import json,sys
s=open('../cards.js').read();C=json.loads(s[s.index('['):s.index('];')+1])
a,b=int(sys.argv[1]),int(sys.argv[2])
for i,c in enumerate(C[a:b],a):print(i,'|',c[5],'|',c[6],'|',c[7])
