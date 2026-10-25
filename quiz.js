// Multiple-choice tests: precomputed distractors (mc.js), instant feedback + explanation, wrong = SRS lapse.
const mcFirst=s=>(s||'').split(/(?<=[.!?])\s/)[0];
const mcShuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function mcQ(c,kind){const idx=/^c\d+$/.test(c.id)?+c.id.slice(1)-1:-1;
 const H=typeof MC_H!=='undefined'&&MC_H[idx];if(H&&kind==='T')kind='X';
 const F={A:x=>x.a,X:x=>x.action,T:x=>mcFirst(x.text)}[kind];const M=typeof MC_A!=='undefined'?{A:MC_A,X:MC_X,T:MC_T}[kind]:null;
 let ds=H&&kind!=='T'?H[kind==='A'?0:1].slice():(M&&M[idx]||[]).map(j=>CARDS[j]).filter(Boolean).map(F);
 if(ds.length<3){const ans=F(c);ds=ds.concat(mcShuf(all().filter(x=>x.id!==c.id&&(x.cat||'Life')===(c.cat||'Life')&&F(x)&&F(x)!==ans)).slice(0,3-ds.length).map(F))}
 const ans=F(c);let q;
 if(kind==='A')q=c.q;
 else if(kind==='X')q=`Principle: “${mcFirst(c.text)}” — Which move actually applies it?`;
 else q=`Scenario: ${c.cat==='Business'?'On a job this week you decide to':'This week you decide to'} “${(c.action||'').replace(/\.$/,'')}”. Which principle are you applying?`;
 return{c,kind,q,ans,opts:mcShuf([ans].concat(ds.slice(0,3)))}}
function mcLapse(id){const r=S.srs[id];if(!r)return;r.n=0;r.iv=0;r.lapses=(r.lapses||0)+1;r.ef=Math.max(1.3,r.ef-0.2);r.due=today();r.last=today()}
const MC_LABEL={A:'understanding',X:'application',T:'scenario'};
// Renders one question; calls done(ok) after Next.
function mcAsk(x,head,done,extra){
 V.innerHTML=`${head.bar!=null?`<div class="bar"><i style="width:${head.bar}%"></i></div>`:''}<div class="card mc"><div class="src">${head.src} · ${MC_LABEL[x.kind]}</div><div class="q">${esc(x.q)}</div>${x.opts.map((o,k)=>`<button class="btn ghost opt" data-k="${k}" style="text-align:left">${'ABCD'[k]}. ${esc(o)}</button>`).join('')}<div id="mcfb"></div>${extra||''}</div>`;
 V.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=x.opts[+b.dataset.k]===x.ans;if(!ok)mcLapse(x.c.id);save();
  V.querySelectorAll('.opt').forEach(y=>{y.disabled=true;if(x.opts[+y.dataset.k]===x.ans){y.style.borderColor='#7fae5a';y.style.background='rgba(127,174,90,.15)'}});
  if(!ok){b.style.borderColor='#c05050';b.style.background='rgba(192,80,80,.15)'}
  $('#mcfb').innerHTML=`<div style="margin:10px 0;padding:10px;border-radius:10px;background:rgba(255,255,255,.05)"><b style="color:${ok?'#7fae5a':'#e07070'}">${ok?'✓ Correct':'✗ Not quite'}</b>${ok?'':`<div style="margin-top:4px">Answer: <b>${esc(x.ans)}</b></div>`}<div class="mu" style="margin-top:6px;font-size:14px">${esc(mcFirst(x.c.text))} <i>— ${esc(x.c.author||'')}${x.c.book?', '+esc(x.c.book):''}</i></div>${ok?'':'<div class="mu" style="font-size:12px;margin-top:4px">Back in your reviews today.</div>'}</div><button class="btn" id="mcnext">Next</button>`;
  const sk=$('#skp');if(sk)sk.remove();$('#mcnext').onclick=()=>done(ok);$('#mcnext').scrollIntoView({block:'nearest'})})}
// ---- weekly quiz: 5 Qs (3 understanding, 2 application) ----
vQuiz=function(){const cs=quizCards();if(cs.length<5){V.innerHTML='<p class="mu">Learn at least 5 new cards this week to unlock the quiz.</p>';return}
 const biz=cs.filter(c=>c.cat==='Business'),life=cs.filter(c=>c.cat!=='Business');
 let sel=mcShuf(biz).slice(0,Math.min(2,biz.length));sel=sel.concat(mcShuf(life.filter(c=>!sel.includes(c))).slice(0,5-sel.length));if(sel.length<5)sel=sel.concat(mcShuf(cs.filter(c=>!sel.includes(c))).slice(0,5-sel.length));
 const kinds=mcShuf(['A','A','A','X','X']);const qs=mcShuf(sel).map((c,i)=>mcQ(c,c.action?kinds[i]:'A'));
 let i=0,score=0;const step=()=>{if(i>=qs.length){S.quiz[weekKey()]={score,d:today()};kickXP(40);let breeze=false;if(score>=4)breeze=addToken(1,'Streak breeze earned (weekly quiz '+score+'/5)');save();
   V.innerHTML=`<div class="card center"><div class="src">Weekly quiz</div><h2>${score}/5</h2><p>+40 XP${score>=4?(breeze?' · 🛡️ streak breeze earned!':' · tokens already full (max 2)'):''}</p><p class="mu">Tokens: ${shieldHTML()}</p><button class="btn" id="h">Back</button></div>`;$('#h').onclick=()=>go('today');return}
  mcAsk(qs[i],{src:`Question ${i+1}/5 · ${esc(qs[i].c.cat||'Life')}`,bar:i*20},ok=>{if(ok)score++;i++;step()})};step()};
views.quiz=vQuiz;
// ---- pop quiz: 3 Qs (understanding + application) ----
vPop=function(){const recent=Object.entries(S.firstSeen).filter(([id,d])=>d>=addDays(today(),-14)&&d<today()&&byId(id)).map(([id])=>byId(id));
 const qs=mcShuf(recent).slice(0,3).map((c,i)=>mcQ(c,i===2&&c.action?'X':'A'));let i=0,sc=0;
 S.popDay=today();S.sessDay=today();S.sessN=(S.sessN||0)+1;S.popAt=S.sessN+2+(Math.random()<.5?1:0);save();
 const step=()=>{if(i>=qs.length){kickXP(10);save();V.innerHTML=`<div class="card center"><div class="src">Pop quiz</div><h2>${sc}/${qs.length}</h2><p>+10 XP${sc===qs.length?' · perfect':''}</p><button class="btn" id="cont">Start session</button></div>`;$('#cont').onclick=()=>vSessionRaw();return}
  mcAsk(qs[i],{src:`⚡ Pop quiz · ${i+1}/${qs.length}`},ok=>{if(ok)sc++;i++;step()},'<button class="icon" id="skp">Skip</button>');const s=$('#skp');if(s)s.onclick=()=>vSessionRaw()};step()};
// ---- interview: harder mix — ~40% scenario, ~30% application, rest understanding ----
buildInterview=function(){const nx=curRank()+1,n=nx>=9?12:10;let pool=interviewPool();if(pool.length<n)pool=Object.keys(S.srs).filter(byId).map(id=>({c:byId(id),w:1}));const cs=wsample(pool,n);
 const nS=Math.round(cs.length*.4),nX=Math.round(cs.length*.3);
 return mcShuf(cs.map((c,i)=>mcQ(c,!c.action?'A':i<nS?'T':i<nS+nX?'X':'A')))};
vInterview=function(){ensure();S.interview=S.interview||{};const nx=RANKS[curRank()+1];if(!nx||eligibleRank()<=curRank()){V.innerHTML=`<p class="mu">${esc(rankBlocker())}</p>`;return}if(interviewCooldown()){V.innerHTML=`<div class="card center"><h2>Interview for ${esc((S.interview.job||{}).title||nx.n)}</h2><p class="mu">Retake available in ${interviewCooldown()} day(s). Review your missed cards meanwhile — or buy an Instant retake in the Shop.</p><button class="btn ghost" onclick="go('shop')">Shop</button></div>`;return}
 const tier=curRank()+1;if(!S.interview.job||S.interview.job.tier!==tier){const op=jobOptions(tier);V.innerHTML=`<div class="card center"><div class="src">Tier ${tier} · ${esc(nx.n)}</div><h2>Which job are you applying for?</h2><p class="mu">Cosmetic only: title, look and interviewer. Same tier, XP and stats.</p>${op.map((o,k)=>`<button class="btn ghost" data-job="${k}" style="text-align:left">${TRACKS[o.track].e} <b>${esc(o.title)}</b><br><small class="tag">${TRACKS[o.track].n}${o.switch?' · switch track':''}</small></button>`).join('')}</div>`;
  V.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>{S.interview.job=Object.assign({tier},op[+b.dataset.job]);save();vInterview()});return}
 const job=S.interview.job;const Q=buildInterview();let i=0,score=0;const missed=[];
 V.innerHTML=`<div class="card center"><div class="src">Interview for ${esc(job.title)} · Tier ${tier}</div><div style="font-size:54px">🎤</div><p class="ins">${esc(interviewerLine(tier,job))}</p><button class="icon" id="chg">Change job</button><p class="mu">${Q.length} questions · mostly scenarios &amp; application · 70% to pass</p><button class="btn" id="go">Begin</button></div>`;
 const step=()=>{if(i>=Q.length){const pass=score/Q.length>=0.7;S.interview=S.interview||{};
   if(pass){S.interview.failed=null;recordJob(curRank()+1,job);S.interview.job=null;S.rank=curRank()+1;S.rankSince=today();S.forms.push({r:S.rank,d:today(),stats:{...S.stats}});badge('Rank: '+rankName(S.rank)+` (interview ${score}/${Q.length})`,'👑');kickXP(50);save();go('today');rankOverlay(S.rank)}
   else{S.interview.failed=today();save();
    V.innerHTML=`<div class="card"><div class="src">Interview for ${esc(job.title)}</div><h2>${score}/${Q.length} — not this time</h2><p class="mu">“Close. Brush up on these and come back in a week.” Missed cards are back in your reviews.</p>${missed.map(c=>`<div class="li"><div class="src" style="margin:0">${esc(c.author)}</div><div class="t">${esc(c.text)}</div></div>`).join('')}<button class="btn" id="h">Back</button></div>`;$('#h').onclick=()=>go('today')}return}
  mcAsk(Q[i],{src:`Interview for ${esc(job.title)} · ${i+1}/${Q.length}`,bar:i/Q.length*100},ok=>{if(ok)score++;else missed.push(Q[i].c);i++;step()})};
 $('#go').onclick=step;$('#chg').onclick=()=>{S.interview.job=null;save();vInterview()}};
views.interview=vInterview;
