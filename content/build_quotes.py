import json,re,subprocess,random
base=json.loads(subprocess.check_output(['node','-e',"eval(require('fs').readFileSync('../quotes.js','utf8').replace(/const /g,'var '));console.log(JSON.stringify(QUOTES))"]))
base=base[:50]
cards=json.load(open('cards.json'))
norm=lambda s:re.sub(r'[^a-z]','',s.lower())
have={norm(q) for q,a in base}
cand=[]
for c in cards:
  t=c['text'].strip()
  sents=re.split(r'(?<=[.!?])\s+',t)
  s=sents[0].strip(' "\'')
  if 25<=len(s)<=105 and 'popular' not in s and 'attributed' not in s.lower() and '(' not in s:
    if norm(s) not in have: have.add(norm(s)); cand.append([s,c['author']])
random.seed(7);random.shuffle(cand)
# interleave authors for variety
by={};[by.setdefault(a,[]).append([q,a]) for q,a in cand]
out=[];keys=list(by)
while len(out)<315 and any(by.values()):
  for k in keys:
    if by[k] and len(out)<315: out.append(by[k].pop())
Q=base+out
assert len(Q)==365 and len({norm(q) for q,a in Q})==365
open('../quotes.js','w').write('// 365 short quotes/maxims (public-domain quotes + concise paraphrased maxims), one per day\nconst QUOTES='+json.dumps(Q,ensure_ascii=False,indent=0)+';\n')
print(len(Q),len(set(a for q,a in Q)),'authors')
