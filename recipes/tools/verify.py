"""Verify page coverage, original hashes and every local HTML link."""
import hashlib,json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parents[1];SITE=ROOT.parent
DATA=json.loads((ROOT/'data/recipes.json').read_text())
errors=[]
ids=[r['id'] for r in DATA['recipes']]
assert len(ids)==len(set(ids))==73
assert len(DATA['notes'])==15
expected={(d,p) for d,count in [(1,24),(2,24),(3,24),(4,22)] for p in range(1,count+1)}
assert {(p['pdf'],p['page']) for p in DATA['pages']}==expected
mapped={(s['pdf'],s['page']) for r in DATA['recipes']+DATA['notes'] for s in r['sources']}
assert mapped==expected
for p in DATA['pages']:
 assert p['entries']
 assert (ROOT/f"scans/{p['pdf']}-{p['page']:02}.jpg").exists()
for src in json.loads((ROOT/'data/source-manifest.json').read_text()):
 assert hashlib.sha256((ROOT/src['file']).read_bytes()).hexdigest()==src['sha256']
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  for key,value in attrs:
   if key not in ['href','src'] or not value or value.startswith('#'):continue
   u=urlsplit(value)
   if u.scheme or u.netloc:continue
   dest=(SITE/unquote(u.path).lstrip('/')) if u.path.startswith('/') else self.file.parent/unquote(u.path)
   if dest.is_dir():dest=dest/'index.html'
   if not dest.exists():errors.append(f'{self.file}: {value}')
for file in ROOT.rglob('*.html'):
 parser=Links();parser.file=file;parser.feed(file.read_text())
assert not errors,'\n'.join(errors)
print(f'PASS: {len(ids)} entries, 94 pages covered, 4 original hashes verified, all local links valid')
