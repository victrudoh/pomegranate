import re, zlib, sys, pathlib

def load_objects(data):
    objs = {}
    for m in re.finditer(rb'(\d+)\s+(\d+)\s+obj\b', data):
        num = int(m.group(1))
        start = m.end()
        end = data.find(b'endobj', start)
        objs[num] = data[start:end]
    return objs

def get_stream(body):
    m = re.search(rb'stream\r?\n', body)
    if not m:
        return None
    raw = body[m.end():]
    raw = re.sub(rb'\r?\nendstream\s*$', b'', raw)
    if b'FlateDecode' in body[:m.start()]:
        try:
            return zlib.decompress(raw)
        except Exception:
            try:
                return zlib.decompressobj().decompress(raw)
            except Exception:
                return None
    return raw

def parse_tounicode(txt):
    mp = {}
    for block in re.findall(rb'beginbfchar(.*?)endbfchar', txt, re.S):
        for src, dst in re.findall(rb'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', block):
            mp[int(src, 16)] = bytes.fromhex(dst.decode()).decode('utf-16-be', 'replace')
    for block in re.findall(rb'beginbfrange(.*?)endbfrange', txt, re.S):
        for lo, hi, dst in re.findall(rb'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', block):
            lo_i, hi_i = int(lo, 16), int(hi, 16)
            base = int(dst, 16)
            for i in range(hi_i - lo_i + 1):
                mp[lo_i + i] = chr(base + i)
    return mp

def extract(path):
    data = pathlib.Path(path).read_bytes()
    objs = load_objects(data)

    tounicode_by_obj = {}
    for num, body in objs.items():
        m = re.search(rb'/ToUnicode\s+(\d+)\s+0\s+R', body)
        if m:
            tu = int(m.group(1))
            s = get_stream(objs.get(tu, b''))
            if s:
                tounicode_by_obj[num] = parse_tounicode(s)

    name_maps = {}
    for num, body in objs.items():
        for fm in re.finditer(rb'/Font\s*<<(.*?)>>', body, re.S):
            for name, onum in re.findall(rb'/([A-Za-z0-9#+._-]+)\s+(\d+)\s+0\s+R', fm.group(1)):
                name_maps.setdefault(name.decode(), set()).add(int(onum))

    def resolve_key(objnum, key, depth=0):
        """Resolve /key to an object body, following indirect refs (bounded depth)."""
        if depth > 6:
            return []
        body = objs.get(objnum, b'')
        out = [body]
        m = re.search(rb'/' + key.encode() + rb'\s+(\d+)\s+0\s+R', body)
        if m:
            out += resolve_key(int(m.group(1)), key, depth + 1)
        else:
            m2 = re.search(rb'/' + key.encode() + rb'\s*<<(.*?)>>', body, re.S)
            if m2:
                for onum in re.findall(rb'(\d+)\s+0\s+R', m2.group(1)):
                    out.append(objs.get(int(onum), b''))
        return out

    def resolve_fonts(body):
        """Collect resource-name -> font object number across indirect chains."""
        local = {}
        res = b'\n'.join(objs.values())
        rm = re.search(rb'/Resources\s+(\d+)\s+0\s+R', body)
        chain = [int(rm.group(1))] if rm else []
        chain.append(None)
        bodies = []
        for cn in chain:
            if cn is None:
                bodies.append(body)
            else:
                bodies.append(objs.get(cn, b''))
        for rb_ in bodies:
            for fm in re.finditer(rb'/Font\s*<<(.*?)>>', rb_, re.S):
                for name, onum in re.findall(rb'/([A-Za-z0-9#+._-]+)\s+(\d+)\s+0\s+R', fm.group(1)):
                    local.setdefault(name.decode(), int(onum))
            fm2 = re.search(rb'/Font\s+(\d+)\s+0\s+R', rb_)
            if fm2:
                fbody = objs.get(int(fm2.group(1)), b'')
                for name, onum in re.findall(rb'/([A-Za-z0-9#+._-]+)\s+(\d+)\s+0\s+R', fbody):
                    local.setdefault(name.decode(), int(onum))
        return local

    pages = sorted(num for num, body in objs.items() if re.search(rb'/Type\s*/Page\b', body))

    out_pages = []
    for pnum in pages:
        body = objs[pnum]
        content = b''
        cm = re.search(rb'/Contents\s+(\d+)\s+0\s+R', body)
        if cm:
            content = get_stream(objs.get(int(cm.group(1)), b'')) or b''
        else:
            ca = re.search(rb'/Contents\s*\[(.*?)\]', body, re.S)
            if ca:
                parts = []
                for onum in re.findall(rb'(\d+)\s+0\s+R', ca.group(1)):
                    parts.append(get_stream(objs.get(int(onum), b'')) or b'')
                content = b'\n'.join(parts)
        local = resolve_fonts(body)

        cur = {}
        lines = []
        buf = []
        for m in re.finditer(rb'/([A-Za-z0-9#+._-]+)\s+[\d.]+\s+Tf|\[(.*?)\]\s*TJ|<([0-9A-Fa-f]+)>\s*Tj|\(((?:\\.|[^)\\])*)\)\s*Tj|\b(Td|TD|T\*|ET)\b', content, re.S):
            if m.group(1):
                nm = m.group(1).decode()
                tgt = local.get(nm)
                if tgt is None and name_maps.get(nm):
                    tgt = sorted(name_maps[nm])[0]
                cur = tounicode_by_obj.get(tgt or -1, {})
            elif m.group(2) is not None or m.group(3) is not None or m.group(4) is not None:
                blocks = []
                if m.group(2) is not None:
                    blocks.append(m.group(2))
                if m.group(3) is not None:
                    blocks.append(b'<' + m.group(3) + b'>')
                if m.group(4) is not None:
                    blocks.append(b'(' + m.group(4) + b')')
                for blk in blocks:
                    for sm in re.finditer(rb'<([0-9A-Fa-f]+)>|\(((?:\\.|[^)\\])*)\)', blk):
                        if sm.group(1):
                            h = sm.group(1).decode()
                            for i in range(0, len(h) - 1, 2):
                                buf.append(cur.get(int(h[i:i + 2], 16), ''))
                        elif sm.group(2) is not None:
                            buf.append(sm.group(2).decode('latin-1'))
            else:
                if buf:
                    lines.append(''.join(buf))
                    buf = []
        if buf:
            lines.append(''.join(buf))
        out_pages.append('\n'.join(l for l in lines if l.strip()))
    return '\n\n=== PAGE BREAK ===\n\n'.join(out_pages)

if __name__ == '__main__':
    print(extract(sys.argv[1]))
