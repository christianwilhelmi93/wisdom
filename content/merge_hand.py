# Append hand-written distractors (mc_hand/*.txt: idx \t A1|A2|A3 \t X1|X2|X3) to ../mc.js as MC_H.
import json,glob,re
s=open('../cards.js').read();C=json.loads(s[s.index('['):s.index('];')+1])
H={}
for f in sorted(glob.glob('mc_hand/*.txt')):
  for l in open(f):
    if not l.strip():continue
    i,a,x=l.rstrip('\n').split('\t');i=int(i);a=a.split('|');x=x.split('|')
    assert len(a)==3==len(x),(f,i)
    n=lambda t:re.sub(r'\W','',t.lower())
    assert n(C[i][6]) not in map(n,a) and n(C[i][7]) not in map(n,x),i
    H[i]=[a,x]
m=open('../mc.js').read().split('\nconst MC_H=')[0].rstrip('\n')
open('../mc.js','w').write(m+'\nconst MC_H='+json.dumps(H,ensure_ascii=False,separators=(',',':'))+';\n')
print(len(H),'hand-written cards')
import random;random.seed(7)
for i in random.sample(sorted(H),30):print(i,C[i][5],'=>',C[i][6],'|',H[i][0],'\n   ',C[i][7],'|',H[i][1])
