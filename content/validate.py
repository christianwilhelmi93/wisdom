import re,json,glob,collections,subprocess
ex=json.loads(subprocess.check_output(['node','-e',"eval(require('fs').readFileSync('core_cards.js','utf8').replace(/const /g,'var '));console.log(JSON.stringify(RAW_CARDS))"]))
BIZ={'Dale Carnegie','Stephen Covey','Benjamin Franklin','Sun Tzu','Niccolò Machiavelli','Baltasar Gracián','Napoleon Hill','Samuel Smiles'}
cards=[];errs=[]
for c in ex: cards.append(dict(cat='Business' if c[0] in BIZ else 'Life',author=c[0],book=c[1],text=c[2],q=c[3],a=c[4],action=c[5],src='core'))
for f in sorted(glob.glob('[bl]*.txt')):
  for i,l in enumerate(open(f,encoding='utf8')):
    l=l.strip()
    if not l: continue
    p=l.split('|')
    if len(p)!=7 or not all(x.strip() for x in p): errs.append(f'{f}:{i+1} fields={len(p)}');continue
    cards.append(dict(cat={'B':'Business','L':'Life'}[p[0]],author=p[1],book=p[2],text=p[3],q=p[4],a=p[5],action=p[6],src=f))
norm=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
seen={};dups=[]
for c in cards:
  for k in ('text','q'):
    n=norm(c[k])
    if n in seen: dups.append((k,c['src'],c[k][:60],seen[n]))
    else: seen[n]=c['src']
print('errors',errs);print('dups',len(dups));[print(' ',d) for d in dups]
cnt=collections.Counter(c['cat'] for c in cards);print(len(cards),dict(cnt),'business%%=%.1f'%(100*cnt['Business']/len(cards)))
if not errs and not dups:
  json.dump(cards,open('cards.json','w'),ensure_ascii=False)
