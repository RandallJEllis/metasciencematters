#!/usr/bin/env python3
"""Give CSS and JavaScript content-based URLs so browsers cannot reuse old assets."""
from hashlib import sha256
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent

def version_assets():
    html_path = ROOT / 'index.html'
    html = html_path.read_text()
    assets = ROOT / 'assets'
    assets.mkdir(exist_ok=True)
    for source_name, extension, attribute in [
        ('style.css', 'css', 'href'),
        ('script.js', 'js', 'src'),
    ]:
        content = (ROOT / source_name).read_bytes()
        digest = sha256(content).hexdigest()[:12]
        target = f'assets/site-{digest}.{extension}'
        pattern = rf'({attribute}=")(?:{re.escape(source_name)}|assets/site-[0-9a-f]+\.{extension})(")'
        html, count = re.subn(pattern, lambda match: match[1] + target + match[2], html)
        if count != 1:
            raise ValueError(f'Expected one {source_name} reference, found {count}')
        (ROOT / target).write_bytes(content)
        print(f'{source_name} -> {target}')
    html_path.write_text(html)

if __name__ == '__main__':
    version_assets()
