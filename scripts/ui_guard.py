"""Protect the approved UI while permitting text, links, metadata and data updates."""
from __future__ import annotations

import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / 'ui-baseline.json'


def digest(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def asset_digest(path: Path) -> str:
    # Windows and Linux checkouts may use different text line endings.
    data = path.read_bytes()
    if path.suffix in {'.css', '.js', '.svg'}:
        data = data.replace(b'\r\n', b'\n')
    return digest(data)


class Structure(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.events: list = []

    def handle_starttag(self, tag, attributes):
        kept = []
        for key, value in attributes:
            if key in {'class', 'id', 'style', 'role', 'rel', 'type', 'viewbox', 'd', 'fill', 'stroke', 'width', 'height', 'hidden', 'tabindex', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy'}:
                kept.append((key, value))
            elif key == 'href' and tag == 'link' and dict(attributes).get('rel') == 'stylesheet':
                kept.append((key, (value or '').split('?', 1)[0]))
            elif key == 'src' and tag == 'script':
                kept.append((key, (value or '').split('?', 1)[0]))
        self.events.append(('start', tag, sorted(kept)))

    def handle_endtag(self, tag):
        self.events.append(('end', tag))


def structure(path: Path) -> str:
    parser = Structure()
    parser.feed(path.read_text(encoding='utf-8'))
    return digest(json.dumps(parser.events, separators=(',', ':')).encode())


def snapshot() -> dict:
    files = sorted(path for path in (ROOT / 'assets').glob('*')
                   if path.suffix in {'.css', '.js', '.svg', '.png', '.jpg'})
    return {
        'schema': 1,
        'assets': {p.relative_to(ROOT).as_posix(): asset_digest(p) for p in files},
        'pages': {p.relative_to(ROOT).as_posix(): structure(p) for p in sorted(ROOT.rglob('*.html')) if '.git' not in p.parts},
    }


def refresh_cache() -> None:
    pattern = re.compile(r'((?:href|src)=")(/assets/[^"?]+\.(?:css|js)(?:\?[^\"]*)?)(")')
    for page in ROOT.rglob('*.html'):
        def replace(match):
            url = match[2].split('?', 1)[0]
            asset = ROOT / url.lstrip('/')
            if not asset.is_file():
                return match[0]
            return match[1] + url + '?v=' + asset_digest(asset)[:12] + match[3]
        old = page.read_text(encoding='utf-8')
        new = pattern.sub(replace, old)
        if old != new:
            page.write_text(new, encoding='utf-8')
    print('Refreshed CSS/JS cache keys.')


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write-baseline', action='store_true', help='Record an explicitly approved UI change')
    parser.add_argument('--refresh-cache', action='store_true', help='Refresh CSS/JS URLs after an approved asset change')
    args = parser.parse_args()
    if args.refresh_cache:
        refresh_cache()
    current = snapshot()
    if args.write_baseline:
        BASELINE.write_text(json.dumps(current, indent=2, sort_keys=True) + '\n', encoding='utf-8')
        print(f'Recorded {len(current["assets"])} assets and {len(current["pages"])} page structures.')
        return 0
    if not BASELINE.exists():
        print('UI baseline missing. Record it only after an approved UI review.', file=sys.stderr)
        return 1
    expected = json.loads(BASELINE.read_text(encoding='utf-8'))
    changed = [f'{kind}: {name}' for kind in ('assets', 'pages')
               for name in sorted(set(expected[kind]) | set(current[kind]))
               if expected[kind].get(name) != current[kind].get(name)]
    if changed:
        print('UI lock failed. An explicit UI request is required before refreshing the baseline.\n' + '\n'.join(changed), file=sys.stderr)
        return 1
    print(f'UI lock passed: {len(current["assets"])} protected assets, {len(current["pages"])} page structures.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
