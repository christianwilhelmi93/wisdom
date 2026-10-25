'use strict';
// ===== Mind · Body · Money layer: tokens, rank gating, body, money, quests, check-in, weekly quiz, face =====
STAT_NAME.body='Body';
RANKS.forEach((r,i)=>{r.minBody=Math.round(i*5.5);r.minDisc=Math.round(i*4.5)});
function xpRank(){return rankIdx(S.xp)}
function curRank(){return S.rank||0}
function eligibleRank(){const st=S.stats;let r=0;for(let i=0;i<RANKS.length;i++){if(S.xp>=RANKS[i].xp&&(st.body||0)>=RANKS[i].minBody&&(st.discipline||0)>=RANKS[i].minDisc)r=i;else if(S.xp>=RANKS[i].xp)break}return r}
function rankBlocker(){const n=RANKS[curRank()+1];if(n&&eligibleRank()>curRank())return interviewCooldown()?`Interview for ${n.n}: retake in ${interviewCooldown()} day(s)`:`Interview for ${n.n} is ready`;if(!n)return'';const st=S.stats,m=[];if(S.xp<n.xp)m.push(`${n.xp-S.xp} XP`);if((st.body||0)<n.minBody)m.push(`${n.minBody-(st.body||0)} Body`);if((st.discipline||0)<n.minDisc)m.push(`${n.minDisc-(st.discipline||0)} Discipline`);return `Next: ${n.n} — needs ${m.join(', ')}`}
function ensure(){S.stats.body=S.stats.body||0;S.tokens=S.tokens==null?1:S.tokens;
 S.body=Object.assign({targets:{kcal:2200,p:160},log:{},meals:[],workouts:[],weights:[],gains:0,lastTick:null,penaltyDays:{},restDays:{},imports:{},strava:{},height:176,baseKg:76,foodHit:{}},S.body||{});
 S.money=Object.assign({goals:[],wallBar:true,saveActs:{},rewards:{}},S.money||{});S.quests=S.quests||{};if(S.ladder!==2){if(S.rank!=null)S.rank=OLD_RANK_MAP[Math.min(8,S.rank)];(S.forms||[]).forEach(f=>f.r=OLD_RANK_MAP[Math.min(8,f.r)]||0);S.ladder=2}if(S.multBonus==null)S.multBonus=Math.min(0.5,0.02*Math.max(0,(S.streak||1)-1));S.photos=S.photos||null;if(S.rank==null)S.rank=Math.max(0,...(S.forms||[{r:0}]).map(f=>f.r));S.rankSince=S.rankSince||((S.forms||[]).slice(-1)[0]||{}).d||'2000-01-01';S.coins=S.coins||0;S.checkins=S.checkins||{};S.quiz=S.quiz||{};S.firstSeen=S.firstSeen||{};}
const shieldHTML=()=>`<span class="shield" title="Streak tokens">🛡️${S.tokens}</span>`;
function addToken(n,why){const b=S.tokens;S.tokens=Math.min(2,S.tokens+n);if(S.tokens>b&&why)badge(why,'🛡️');return S.tokens>b}
function kickXP(n){S.xp=Math.max(0,S.xp+n)}
const mult=()=>Math.round((1+Math.min(0.5,S.multBonus||0))*100)/100;
const multHTML=()=>`<span class="mult">x${mult().toFixed(2)} 🔥</span>`;
// ---- daily tick: weekly token, weigh-in penalty, gains decay ----
function dailyTick(){ensure();const t=today(),B=S.body;if(B.lastTick===t)return;const from=B.lastTick?addDays(B.lastTick,1):t;
 for(let d=from;d<=t;d=addDays(d,1)){
  if(S.tokenWeekGrant!==weekOf(d)){S.tokenWeekGrant=weekOf(d);S.tokens=Math.min(2,(S.tokens||0)+1)}
  const od=weighOverdue(d);if(od>0&&!B.penaltyDays[d]){B.penaltyDays[d]=1;kickXP(-5)}
  const lastW=B.workouts.length?B.workouts[B.workouts.length-1].d:null;
  if(!B.restDays[d]&&(!lastW||lastW<addDays(d,-2)))B.gains=Math.max(0,B.gains*0.985-0.05);}
 B.lastTick=t;save()}
// ---- weight & physique ----
function lastWeigh(){const w=S.body.weights;return w.length?w[w.length-1]:null}
function weighOverdue(d){const lw=lastWeigh();if(!lw)return 0;const days=Math.round((new Date(d)-new Date(lw.d))/864e5);return Math.max(0,days-7)}
function bodyShape(){ensure();const B=S.body,lw=lastWeigh(),kg=lw?lw.kg:B.baseKg;const bmiBase=B.baseKg/((B.height/100)**2);const bmi=kg/((B.height/100)**2);
 const muscle=Math.max(0,Math.min(1,B.gains/40));const bmiFat=(bmi-bmiBase)/4;const bf=lastBF();const fat=Math.max(-0.4,Math.min(1,bf!=null?0.7*((bf-16)/12)+0.3*bmiFat:bmiFat));const soft=Math.min(1,weighOverdue(today())/14);
 return{muscle,fat:Math.min(1,fat+soft*0.35),soft}}
function navyBF(waist,neck,h){if(!(waist>neck&&neck>0))return null;return Math.round((495/(1.0324-0.19077*Math.log10(waist-neck)+0.15456*Math.log10(h))-450)*10)/10}
function lastBF(){const w=S.body.weights.slice().reverse().find(w=>w.bf!=null);return w?w.bf:null}
function logWeight(kg,x){ensure();x=x||{};const e={d:today(),kg:+kg};if(x.waist&&x.neck){e.waist=+x.waist;e.neck=+x.neck;e.bf=navyBF(e.waist,e.neck,S.body.height);e.bfSrc='navy'}if(x.bf){e.bf=+x.bf;e.bfSrc='manual'}S.body.weights=S.body.weights.filter(w=>w.d!==e.d);S.body.weights.push(e);S.body.weights.sort((a,b)=>a.d<b.d?-1:1);kickXP(30);S.stats.body+=2;badgeOnce('first-weigh','First weigh-in','⚖️');save()}
// ---- workouts ----
function logWorkout(type,min,notes,src){ensure();min=+min||30;S.body.workouts.push({d:today(),type,min,notes:notes||'',src:src||'manual'});
 S.body.gains=Math.min(60,S.body.gains+Math.min(1.5,min/30));S.stats.body+=2;kickXP(20);questMark('train');save()}
function restDay(){if(S.tokens<1)return false;S.tokens--;S.body.restDays[today()]=1;questMark('train');save();return true}
// ---- food ----
function dayLog(d){d=d||today();return S.body.log[d]=S.body.log[d]||[]}
function totals(d){return dayLog(d).reduce((a,x)=>({kcal:a.kcal+x.kcal,p:a.p+x.p,c:a.c+(x.c||0),f:a.f+(x.f||0)}),{kcal:0,p:0,c:0,f:0})}
function addFood(e){dayLog().push(Object.assign({t:Date.now()},e));const T=totals(),tg=S.body.targets;
 if(!S.body.foodHit[today()]&&T.p>=tg.p&&T.kcal>=tg.kcal*0.85&&T.kcal<=tg.kcal*1.1){S.body.foodHit[today()]=1;S.stats.body+=1;kickXP(15);questMark('train')}save()}
async function offSearch(q){const r=await fetch('https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&json=1&page_size=12&fields=product_name,nutriments,brands,code&search_terms='+encodeURIComponent(q));const j=await r.json();
 return (j.products||[]).filter(p=>p.nutriments&&p.nutriments['energy-kcal_100g']!=null).map(p=>offMap(p))}
function offMap(p){const n=p.nutriments;return{n:(p.product_name||'?')+(p.brands?' ('+p.brands.split(',')[0]+')':''),kcal:+n['energy-kcal_100g']||0,p:+n.proteins_100g||0,c:+n.carbohydrates_100g||0,f:+n.fat_100g||0,g:100,u:'100 g',off:1}}
async function offBarcode(code){const r=await fetch('https://world.openfoodfacts.org/api/v2/product/'+code+'.json');const j=await r.json();return j.product?offMap(j.product):null}
// ---- money (savings goals only) ----
const GOAL_TYPES={car:{e:'🚗',item:'c_sport'},house:{e:'🏠',item:'h_modern'},trip:{e:'🏝️',item:'t_beach'},boat:{e:'🛥️',item:'b_yacht'},watch:{e:'⌚',item:'w_gold'},other:{e:'🎯',item:'s_linen'}};
function saved(g){return g.deps.reduce((a,d)=>a+d.amt,0)}
function goalPace(g){const s=saved(g),left=Math.max(0,g.target-s);if(!g.deadline)return{left,weekly:null,status:''};
 const wl=Math.max(1,(new Date(g.deadline)-new Date(today()))/6048e5);const total=Math.max(1,(new Date(g.deadline)-new Date(g.created))/6048e5);
 const expected=g.target*Math.min(1,(total-wl)/total);return{left,weekly:Math.ceil(left/wl),status:s>=expected?'ahead':'behind',diff:Math.round(s-expected)}}
function deposit(gid,amt){const g=S.money.goals.find(x=>x.id===gid);if(!g||!(amt>0))return null;const before=saved(g)/g.target;g.deps.push({d:today(),amt:+amt});const after=saved(g)/g.target;
 kickXP(Math.min(40,10+Math.round(amt/500)));S.stats.wealth++;questMark('save');const ev=[];
 [25,50,75].forEach(m=>{if(before*100<m&&after*100>=m){kickXP(25);badge(`${g.name}: ${m}% saved`,'💰');ev.push(m)}});
 if(before<1&&after>=1&&!g.done){g.done=today();kickXP(200);const it=GOAL_TYPES[g.type||'other'].item;if(!S.inv.includes(it))S.inv.push(it);const sl=slotOf(itemById(it));S.equip[sl]=it;badge('Goal reached: '+g.name,'🏆');ev.push(100)}
 save();return ev}
// ---- quests ----
function q(){const t=today();return S.quests[t]=S.quests[t]||{learn:false,train:false,save:false,combo:false}}
function questMark(k){const Q=q();Q[k]=true;if(Q.learn&&Q.train&&Q.save&&!Q.combo){Q.combo=true;kickXP(30);badge('Daily combo: Learn + Train + Save','⚡')}}
function questBar(){ensure();const Q=q();if(S.lastDay===today()&&!Q.learn)questMark('learn');const it=(k,l,e)=>`<div class="qst ${Q[k]?'on':''}">${e}<span>${l}</span></div>`;
 const ci=checkinDue()?`<button class="btn" id="ciBtn">Sunday check-in · +50 XP</button>`:'';const qz=quizAvailable()?`<button class="btn ghost" id="qzBtn">Weekly quiz · +40 XP</button>`:'';
 return `<div class="quests">${it('learn','Learn','📖')}${it('train','Train','💪')}${it('save','Save','💰')}<div class="qst combo ${Q.combo?'on':''}">⚡<span>Combo +30</span></div></div>${ci}${qz}`}
function wireQuestBar(){const c=$('#ciBtn');if(c)c.onclick=()=>go('checkin');const z=$('#qzBtn');if(z)z.onclick=()=>go('quiz')}
// ---- weekly check-in ----
function isoSunday(){const d=new Date();d.setDate(d.getDate()-d.getDay());return d.toISOString().slice(0,10)}
function checkinDue(){return new Date().getDay()===0&&!S.checkins[today()]}
function checkinStreak(){let n=0,d=new Date();d.setDate(d.getDate()-d.getDay());for(;;){const k=d.toISOString().slice(0,10);if(S.checkins[k]&&k!==today()||(k===today()&&S.checkins[k]))n++;else if(k!==today())break;d.setDate(d.getDate()-7);if(n>200)break}return n}
function checkinCopy(){ensure();const lines=[];const g=topGoal();const st=checkinStreak();const lastWeek=addDays(today(),-7);const missed=S.checkins[lastWeek]===undefined&&Object.keys(S.checkins).length>0;
 if(missed)lines.push("Last week slipped. That's fine. Log today and your avatar gets back on track.");
 if(g){const pct=Math.round(saved(g)/g.target*100);const nm=[25,50,75,100].find(m=>m>pct);if(pct>=60&&pct<100)lines.push(`You're ${pct}% of the way to ${g.name}. One more deposit${nm?' moves you toward the '+nm+'% reward':''}.`)}
 if(st>=2)lines.push(`${st+1} weeks straight. ${rankName(Math.min(8,curRank()+1))} rank is getting closer.`);
 lines.push("Sunday check-in, boss. Two numbers: your weight and what you put aside. +50 XP waiting.","Quick one: step on the scale, then tell me if you saved. Two taps, +50 XP.","New week, same plan. Weight, savings, done. Your avatar is waiting.");
 return lines[0]}
function vCheckin(step){ensure();step=step||1;V.innerHTML=`<div class="card center"><div class="src">Weekly check-in · ${step}/2</div><p class="ins">${esc(checkinCopy())}</p>${step===1?
 `<label>Weight (kg)</label><input id="kg" type="number" step="0.1" inputmode="decimal" value="${(lastWeigh()||{kg:S.body.baseKg}).kg}"><details><summary class="tag">Optional: tape (body-fat) or known body-fat %</summary><div class="row"><input id="wa" type="number" step="0.5" placeholder="Waist cm (navel)"><input id="ne" type="number" step="0.5" placeholder="Neck cm"></div><input id="bfm" type="number" step="0.1" placeholder="Body fat % (manual)"></details><button class="btn" id="n1">Log weight</button><button class="btn ghost" id="s1">Skip</button>`:
 `<h3>Did you save this week?</h3>${S.money.goals.filter(g=>!g.done).length?`<select id="gsel">${S.money.goals.filter(g=>!g.done).map(g=>`<option value="${g.id}">${esc(g.name)}</option>`).join('')}</select><input id="amt" type="number" inputmode="numeric" placeholder="Amount NOK"><button class="btn" id="yes">Yes — log it</button>`:'<button class="btn" id="yes2">Yes, I set money aside</button>'}<button class="btn ghost" id="no">Not this week</button>`}</div>`;
 const fin=(savedYes)=>{S.checkins[today()]={saved:savedYes};kickXP(50);save();V.innerHTML=`<div class="card center"><h2>Checked in ✓</h2><p class="mu">+50 XP. ${savedYes?'Money moved — nice.':'Next week is a fresh start.'}</p>${quizAvailable()?'<button class="btn" id="qz">Take the weekly quiz</button>':''}<button class="btn ghost" id="h">Back to Today</button></div>`;$('#h').onclick=()=>go('today');if($('#qz'))$('#qz').onclick=()=>go('quiz')};
 if(step===1){$('#n1').onclick=()=>{const v=parseFloat($('#kg').value);if(v>30&&v<250)logWeight(v,{waist:$('#wa').value,neck:$('#ne').value,bf:$('#bfm').value});vCheckin(2)};$('#s1').onclick=()=>vCheckin(2)}
 else{if($('#yes'))$('#yes').onclick=()=>{const a=+$('#amt').value;if(a>0)deposit($('#gsel').value,a);fin(true)};if($('#yes2'))$('#yes2').onclick=()=>{S.money.saveActs[today()]=1;questMark('save');fin(true)};$('#no').onclick=()=>fin(false)}}
// ---- weekly quiz ----
function weekKey(){return weekOf(today())}
function quizAvailable(){if(S.quiz[weekKey()])return false;const day=new Date().getDay();return (day===6||day===0||S.checkins[today()])&&quizCards().length>=5}
function quizCards(){const t=today(),from=addDays(t,-((new Date().getDay()+6)%7));return Object.entries(S.firstSeen).filter(([id,d])=>d>=from&&byId(id)).map(([id])=>byId(id))}
function vQuiz(){const cs=quizCards();if(cs.length<5){V.innerHTML='<p class="mu">Learn at least 5 new cards this week to unlock the quiz.</p>';return}
 const pickN=(a,n)=>a.slice().sort(()=>Math.random()-.5).slice(0,n);const biz=cs.filter(c=>c.cat==='Business'),life=cs.filter(c=>c.cat!=='Business');
 let sel=pickN(biz,Math.min(2,biz.length));sel=sel.concat(pickN(life.filter(c=>!sel.includes(c)),5-sel.length));if(sel.length<5)sel=sel.concat(pickN(cs.filter(c=>!sel.includes(c)),5-sel.length));
 const qs=sel.map(c=>{const pool=all().filter(x=>x.id!==c.id&&(x.cat||'Life')===(c.cat||'Life')&&x.a!==c.a);const opts=pickN([c.a].concat(pickN(pool,3).map(x=>x.a)),4);return{c,opts}});
 let i=0,score=0;const step=()=>{if(i>=qs.length){S.quiz[weekKey()]={score,d:today()};kickXP(40);let breeze=false;if(score>=4)breeze=addToken(1,'Streak breeze earned (weekly quiz '+score+'/5)');save();
   V.innerHTML=`<div class="card center"><div class="src">Weekly quiz</div><h2>${score}/5</h2><p>+40 XP${score>=4?(breeze?' · 🛡️ streak breeze earned!':' · tokens already full (max 2)'):''}</p><p class="mu">Tokens: ${shieldHTML()}</p><button class="btn" id="h">Back</button></div>`;$('#h').onclick=()=>go('today');return}
  const {c,opts}=qs[i];V.innerHTML=`<div class="bar"><i style="width:${i*20}%"></i></div><div class="card"><div class="src">Question ${i+1}/5 · ${esc(c.cat||'Life')}</div><div class="q">${esc(c.q)}</div>${opts.map((o,k)=>`<button class="btn ghost opt" data-k="${k}" style="text-align:left">${esc(o)}</button>`).join('')}</div>`;
  V.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=opts[+b.dataset.k]===c.a;if(ok)score++;b.style.borderColor=ok?'#4d6b3a':'#6b2c2c';V.querySelectorAll('.opt').forEach(x=>{if(opts[+x.dataset.k]===c.a)x.style.borderColor='#7fae5a';x.disabled=true});setTimeout(()=>{i++;step()},700)})};step()}
// ---- face selfie → stylised illustration ----
let FACE=null; // selfie feature removed; any old 'wisdom.face' value is ignored
function stylizeFace(img){const N=160,cv=document.createElement('canvas');cv.width=cv.height=N;const x=cv.getContext('2d');const s=Math.min(img.width,img.height);
 x.drawImage(img,(img.width-s)/2,(img.height-s)/2-s*0.05,s,s,0,0,N,N);const d=x.getImageData(0,0,N,N),p=d.data,g=new Float32Array(N*N);
 for(let i=0;i<N*N;i++)g[i]=0.3*p[i*4]+0.59*p[i*4+1]+0.11*p[i*4+2];
 const dark=[58,40,34],mid=[196,150,118],light=[244,222,196];
 for(let y=0;y<N;y++)for(let X=0;X<N;X++){const i=y*N+X;const L=g[i]/255;const lv=Math.round(L*4)/4;let c=lv<.35?dark:lv<.7?mid:light;if(lv>=.35&&lv<.7){c=mid}
  const gx=X>0&&X<N-1?g[i+1]-g[i-1]:0,gy=y>0&&y<N-1?g[i+N]-g[i-N]:0,e=Math.hypot(gx,gy);const k=e>48?0.35:1;
  p[i*4]=c[0]*k;p[i*4+1]=c[1]*k;p[i*4+2]=c[2]*k;const dx=X-N/2,dy=y-N/2;p[i*4+3]=dx*dx+dy*dy<(N/2)*(N/2)?255:0}
 x.putImageData(d,0,0);return cv.toDataURL('image/png')}
function setFace(url){} // no-op (feature removed)
// ---- URL params: ?import=steps:8500,kcal:450,workout:run:30  ?checkin=1  Strava ?code= ----
function handleParams(){const P=new URLSearchParams(location.search);let target=null;const msgs=[];
 if(P.get('import')){ensure();const d=S.body.imports[today()]=S.body.imports[today()]||{};P.get('import').split(',').forEach(kv=>{const [k,...v]=kv.split(':');
  if(k==='steps'){d.steps=+v[0];msgs.push(`${v[0]} steps`);if(+v[0]>=8000)questMark('train')}else if(k==='kcal'){d.active=+v[0];msgs.push(`${v[0]} active kcal`)}
  else if(k==='weight'){logWeight(+v[0]);msgs.push(`${v[0]} kg`)}else if(k==='workout'){logWorkout(v[0]||'workout',+v[1]||30,'',P.get('src')||'shortcut');msgs.push(`${v[0]} ${v[1]||30} min`)}});save();target='body'}
 if(P.get('checkin'))target='checkin';if(P.get('code')&&P.get('scope'))target='strava';
 if(P.get('import')||P.get('checkin')){history.replaceState(null,'',location.pathname)}
 return{target,msgs}}
// ---- Strava (OAuth, token kept in localStorage) ----
const stravaRedirect=()=>location.origin+location.pathname;
function stravaAuthURL(){return`https://www.strava.com/oauth/authorize?client_id=${encodeURIComponent(S.body.strava.clientId)}&redirect_uri=${encodeURIComponent(stravaRedirect())}&response_type=code&approval_prompt=auto&scope=activity:read_all`}
async function stravaToken(body){const r=await fetch('https://www.strava.com/oauth/token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({client_id:S.body.strava.clientId,client_secret:S.body.strava.secret},body))});if(!r.ok)throw new Error('Strava '+r.status);const j=await r.json();Object.assign(S.body.strava,{access:j.access_token,refresh:j.refresh_token,exp:j.expires_at});save()}
async function stravaSync(){const sv=S.body.strava;if(!sv.access)throw new Error('Not connected');if(sv.exp*1000<Date.now()+60000)await stravaToken({grant_type:'refresh_token',refresh_token:sv.refresh});
 const after=Math.floor((Date.now()-14*864e5)/1000);const r=await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30&after='+after,{headers:{Authorization:'Bearer '+sv.access}});if(!r.ok)throw new Error('Strava '+r.status);
 const acts=await r.json();sv.seen=sv.seen||[];let n=0;for(const a of acts){if(sv.seen.includes(a.id))continue;sv.seen.push(a.id);S.body.workouts.push({d:a.start_date_local.slice(0,10),type:a.sport_type||a.type,min:Math.round(a.moving_time/60),notes:a.name,src:'strava'});S.body.gains=Math.min(60,S.body.gains+Math.min(1.5,a.moving_time/1800));S.stats.body+=2;kickXP(20);if(a.start_date_local.slice(0,10)===today())questMark('train');n++}
 S.body.workouts.sort((a,b)=>a.d<b.d?-1:1);save();return n}
function badgeOnce(key,t,e){S.badgeKeys=S.badgeKeys||{};if(!S.badgeKeys[key]){S.badgeKeys[key]=1;badge(t,e)}}
function topGoal(){return S.money.goals.filter(g=>!g.done).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0))[0]||null}
