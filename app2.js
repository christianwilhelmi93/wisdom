'use strict';
// ===== Views: Home, Body, Money, Shop, Interview + startup =====
const fmt=n=>Math.round(n).toLocaleString('nb-NO');
// ---------- HOME (slim, one screen) ----------
function vHome(){ensure();const r=curRank(),nx=RANKS[r+1],lo=RANKS[r].xp,hi=nx?nx.xp:S.xp+1,pct=Math.max(0,Math.min(100,(S.xp-lo)/(hi-lo)*100));const Q=q();if(S.lastDay===today())Q.learn=true;
 const g=topGoal(),gp=g?Math.min(100,saved(g)/g.target*100):0;const ready=nx&&eligibleRank()>r;const cd=interviewCooldown();
 const sess=S.session&&S.session.day===today()?S.session:null;const left=sess?sess.queue.length:null;
 const ciShow=new Date().getDay()===0?!S.checkins[today()]:checkinOverdue();
 V.innerHTML=`<div class="home">
 <div class="hav">${avatarSVG(r,S.stats,S.equip,168)}</div>
 <div class="hrank">${esc(rankName(r))}<small style="display:block;font:11px -apple-system,sans-serif;color:var(--mu)">Tier ${r} · ${esc(RANKS[r].n)}</small><span>${Object.keys(STAT_NAME).map(k=>`${STAT_NAME[k][0]}${S.stats[k]||0}`).join(' · ')}</span></div>
 <div class="bar" style="height:7px;margin:6px 0 2px"><i style="width:${pct}%"></i></div><div class="tag">${S.xp} XP ${multHTML()} ${nx?`· ${esc(rankBlocker())}`:''}</div>
 ${ready&&!cd?`<button class="btn ghost" id="ivBtn" style="margin-top:6px">🎤 Interview · Tier ${r+1}</button>`:''}
 <div class="quests3">
  <div class="q3 ${Q.learn?'on':''}" data-go="session"><b>📖 Learn</b><small>${Q.learn?'Done':left!=null?left+' cards left':'3 new + reviews'}</small></div>
  <div class="q3 ${Q.train?'on':''}" data-go="body"><b>💪 Train</b><small>${Q.train?'Done':'Workout or hit food targets'}</small></div>
  <div class="q3 ${Q.save?'on':''}" data-go="money"><b>💰 Save</b><small>${g?esc(g.name):'Set a goal'}</small>${g?`<div class="thin"><i style="width:${gp}%"></i></div>`:''}</div>
 </div>
 ${Q.combo?'<div class="tag center" style="color:var(--gold)">⚡ Combo complete +30 XP</div>':''}
 ${ciShow?`<button class="btn ghost" id="ciBtn">📅 Weekly check-in · +50 XP</button>`:''}
 ${quizAvailable()?`<button class="btn ghost" id="qzBtn">🧠 Weekly quiz · +40 XP</button>`:''}
 <button class="btn big" id="start">${Q.learn?'Learn more':'Start today\'s session'}</button></div>`;
 $('#start').onclick=()=>go('session');V.querySelectorAll('[data-go]').forEach(e=>e.onclick=()=>go(e.dataset.go));wireQuestBar();if($('#ivBtn'))$('#ivBtn').onclick=()=>go('interview')}
function checkinOverdue(){const d=new Date();d.setDate(d.getDate()-d.getDay());const k=d.toISOString().slice(0,10);return k!==today()&&!S.checkins[k]&&Object.keys(S.checkins).length>0}
// ---------- BODY ----------
function vBody(tab){ensure();tab=tab||'food';const T=totals(),tg=S.body.targets,lw=lastWeigh(),od=weighOverdue(today());
 const ring=(v,t,l)=>`<div class="stat"><b>${fmt(v)}<small style="font-size:13px;color:var(--mu)"> / ${fmt(t)}</small></b>${l}<div class="thin"><i style="width:${Math.min(100,v/t*100)}%"></i></div></div>`;
 V.innerHTML=`<div class="tabs">${[['food','🍽 Food'],['train','🏋️ Train'],['weight','⚖️ Weight'],['sync','🔗 Sync']].map(([k,n])=>`<button data-bt="${k}" class="${k===tab?'on':''}">${n}</button>`).join('')}</div><div id="bv"></div>`;
 V.querySelectorAll('[data-bt]').forEach(b=>b.onclick=()=>vBody(b.dataset.bt));const bv=$('#bv');
 if(tab==='food'){bv.innerHTML=`<div class="grid">${ring(T.kcal,tg.kcal,'kcal')}${ring(T.p,tg.p,'protein g')}</div>
  <input id="fs" placeholder="Search food (e.g. skyr, kylling, grovbrød)…"><div class="row"><button class="btn ghost" id="offb" style="margin:0">🌐 Online search</button><button class="btn ghost" id="scan" style="margin:0">📷 Barcode</button></div><div id="fr"></div>
  <h3>Saved meals</h3><div id="ml"></div>
  <h3>Quick add</h3><div class="row"><input id="qk" type="number" placeholder="kcal" inputmode="numeric"><input id="qp" type="number" placeholder="protein g" inputmode="numeric"><button class="btn" id="qa" style="width:auto;margin:0 0 6px">Add</button></div>
  <h3>Today</h3><div id="tl"></div>
  <details><summary class="tag">Targets</summary><div class="row"><input id="tk" type="number" value="${tg.kcal}"><input id="tp" type="number" value="${tg.p}"><button class="btn ghost" id="ts" style="width:auto;margin:0 0 6px">Save</button></div></details>`;
  const showRes=list=>{$('#fr').innerHTML=list.slice(0,12).map((f,i)=>`<div class="li row" style="justify-content:space-between"><div><div>${esc(f.n)}</div><div class="tag">${f.kcal} kcal · ${f.p} g P per 100 g</div></div><div class="row"><input type="number" value="${f.g}" style="width:70px;margin:0" data-g="${i}"><button class="icon" data-add="${i}">＋</button></div></div>`).join('');
   $('#fr').querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const f=list[+b.dataset.add],g=+$('#fr').querySelector(`[data-g="${b.dataset.add}"]`).value||f.g;addFood({n:f.n,g,kcal:Math.round(f.kcal*g/100),p:Math.round(f.p*g/10)/10,c:Math.round(f.c*g/100),f:Math.round(f.f*g/100)});vBody('food')})};
  $('#fs').oninput=e=>{const t=e.target.value.toLowerCase();showRes(t.length<2?[]:FOODS.filter(f=>f.n.toLowerCase().includes(t)))};
  $('#offb').onclick=async()=>{const t=$('#fs').value;if(!t){alert('Type a food first');return}$('#fr').innerHTML='<p class="tag">Searching Open Food Facts…</p>';try{showRes(await offSearch(t))}catch(e){$('#fr').innerHTML='<p class="tag">Offline or no results.</p>'}};
  $('#scan').onclick=()=>scanBarcode(showRes);
  const meals=PRESET_MEALS.concat(S.body.meals);$('#ml').innerHTML=meals.map((m,i)=>`<div class="li row" style="justify-content:space-between"><div><div>${esc(m.n)}</div><div class="tag">${m.kcal} kcal · ${m.p} g P</div></div><button class="icon" data-m="${i}">＋</button></div>`).join('')+`<button class="btn ghost" id="svm">Save today's log as a meal</button>`;
  $('#ml').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const m=meals[+b.dataset.m];addFood({n:m.n,kcal:m.kcal,p:m.p,c:m.c||0,f:m.f||0});vBody('food')});
  $('#svm').onclick=()=>{const n=prompt('Meal name?');if(n){const T=totals();S.body.meals.push({id:'m'+Date.now(),n,kcal:T.kcal,p:T.p,c:T.c,f:T.f});save();vBody('food')}};
  $('#qa').onclick=()=>{const k=+$('#qk').value,p=+$('#qp').value;if(k||p){addFood({n:'Quick add',kcal:k,p});vBody('food')}};
  $('#tl').innerHTML=dayLog().map((x,i)=>`<div class="li row" style="justify-content:space-between"><span>${esc(x.n)}${x.g?` <span class="tag">${x.g} g</span>`:''}</span><span class="tag">${x.kcal} kcal · ${x.p} g <button class="icon" data-del="${i}">×</button></span></div>`).join('')||'<p class="tag">Nothing logged yet.</p>';
  $('#tl').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{dayLog().splice(+b.dataset.del,1);save();vBody('food')});
  $('#ts').onclick=()=>{S.body.targets={kcal:+$('#tk').value||2200,p:+$('#tp').value||160};save();vBody('food')}}
 if(tab==='train'){const w=S.body.workouts.slice(-8).reverse();bv.innerHTML=`<div class="card"><label>Type</label><select id="wt">${['Strength','Run','Walk','Cycling','Football','Swim','Hike','Mobility','Other'].map(x=>`<option>${x}</option>`).join('')}</select>
  <label>Duration (min)</label><input id="wm" type="number" value="45" inputmode="numeric"><label>Notes (optional)</label><input id="wn"><button class="btn" id="wl">Check in workout · +20 XP</button>
  <button class="btn ghost" id="rd">Planned rest day (uses 🛡️ ${S.tokens})</button></div><h3>Recent</h3>${w.map(x=>`<div class="li"><b>${esc(x.type)}</b> · ${x.min} min <span class="tag">${x.d}${x.src!=='manual'?' · '+x.src:''}</span>${x.notes?`<div class="tag">${esc(x.notes)}</div>`:''}</div>`).join('')||'<p class="tag">No workouts yet.</p>'}`;
  $('#wl').onclick=()=>{logWorkout($('#wt').value,$('#wm').value,$('#wn').value);go('body','train')};$('#rd').onclick=()=>{if(!restDay())alert('No streak tokens left this week.');vBody('train')}}
 if(tab==='weight'){const ws=S.body.weights.slice(-12);const mn=Math.min(...ws.map(w=>w.kg),S.body.baseKg)-1,mx=Math.max(...ws.map(w=>w.kg),S.body.baseKg)+1;
  const pts=ws.map((w,i)=>`${10+i*(280/Math.max(1,ws.length-1))},${90-(w.kg-mn)/(mx-mn)*80}`).join(' ');
  bv.innerHTML=`<div class="card center">${od>0?`<p style="color:#e08a6a">Weigh-in ${od} day(s) overdue — losing 5 XP a day and your avatar is softening.</p>`:''}<p class="mu">Last: ${lw?lw.kg+' kg on '+lw.d:'never'} · baseline ${S.body.height} cm / ${S.body.baseKg} kg</p>
  ${ws.length>1?`<svg viewBox="0 0 300 100" style="width:100%"><polyline points="${pts}" fill="none" stroke="#c9a96e" stroke-width="2"/></svg>`:''}
  <input id="kg" type="number" step="0.1" inputmode="decimal" value="${lw?lw.kg:S.body.baseKg}">
  <p class="tag" style="text-align:left">Body fat (optional). US Navy tape: waist at the navel, neck just below the larynx. Or enter a % estimated elsewhere.</p>
  <div class="row"><input id="wa" type="number" step="0.5" placeholder="Waist cm" value="${lw&&lw.waist||''}"><input id="ne" type="number" step="0.5" placeholder="Neck cm" value="${lw&&lw.neck||''}"></div><input id="bfm" type="number" step="0.1" placeholder="Body fat % (manual)">
  <label class="row tag">Height <input id="ht" type="number" value="${S.body.height}" style="width:80px;margin:0"> cm</label>
  <button class="btn" id="lw">Log weigh-in · +30 XP</button>
  <p class="mu">BMI ${(((lw?lw.kg:S.body.baseKg))/((S.body.height/100)**2)).toFixed(1)}${lastBF()!=null?` · body fat ${lastBF()}%`:''} · physique: ${physLabel()}</p></div>
  <div class="card"><h3>Progress photos</h3><p class="tag">Stored only on this phone. Pick two dates to compare.</p><input type="file" id="pp" accept="image/*" capture="environment">
  <div id="pcmp"></div><div class="items" style="grid-template-columns:repeat(4,1fr)">${photos().map((p,i)=>`<button class="it" data-ph="${i}" style="padding:2px"><img src="${p.img}" style="width:100%;border-radius:6px"><small>${p.d}</small></button>`).join('')}</div></div>`;
  let sel=[];const cmp=()=>{const P=photos();const a=P[sel[0]],b=P[sel[1]];$('#pcmp').innerHTML=a?`<div class="ph2"><div><img src="${a.img}"><div class="tag center">${a.d}</div></div>${b?`<div><img src="${b.img}"><div class="tag center">${b.d}</div></div>`:'<div class="tag center">pick a second</div>'}</div>${a?'<button class="btn ghost" id="phd">Delete first selected</button>':''}`:'';if($('#phd'))$('#phd').onclick=()=>{if(confirm('Delete this photo?')){P.splice(sel[0],1);savePhotos(P);vBody('weight')}}};
  const P0=photos();if(P0.length>1){sel=[0,P0.length-1];cmp()}
  V.querySelectorAll('[data-ph]').forEach(b=>b.onclick=()=>{sel=[sel[sel.length-1],+b.dataset.ph].filter(x=>x!=null).slice(-2);cmp()});
  $('#pp').onchange=async e=>{const f=e.target.files[0];if(!f)return;const P=photos();P.push({d:today(),img:await shrinkImg(f,720)});P.sort((a,b)=>a.d<b.d?-1:1);if(!savePhotos(P))alert('Phone storage full — delete an old photo.');S.photoXp=S.photoXp||{};if(!S.photoXp[weekOf(today())]){S.photoXp[weekOf(today())]=1;kickXP(10)}save();vBody('weight')};
  $('#lw').onclick=()=>{const v=parseFloat($('#kg').value);S.body.height=+$('#ht').value||176;if(v>30&&v<250){logWeight(v,{waist:$('#wa').value,neck:$('#ne').value,bf:$('#bfm').value});vBody('weight')}}}
 if(tab==='sync')vSync(bv)}
async function scanBarcode(showRes){if(!('BarcodeDetector' in window)){const c=prompt('Camera barcode scanning isn\'t supported in this browser (iOS Safari lacks it). Type the barcode number:');if(c){try{const f=await offBarcode(c.trim());showRes(f?[f]:[])}catch(e){alert('Lookup failed (offline?)')}}return}
 const det=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});const vid=document.createElement('video');vid.setAttribute('playsinline','');vid.style.cssText='position:fixed;inset:0;width:100%;height:100%;object-fit:cover;z-index:60;background:#000';document.body.appendChild(vid);
 const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});vid.srcObject=st;await vid.play();const stop=()=>{st.getTracks().forEach(t=>t.stop());vid.remove()};vid.onclick=stop;
 const loop=async()=>{if(!vid.isConnected)return;const r=await det.detect(vid).catch(()=>[]);if(r.length){stop();const f=await offBarcode(r[0].rawValue).catch(()=>null);showRes(f?[f]:[]);if(!f)alert('Product not found: '+r[0].rawValue);return}requestAnimationFrame(loop)};loop()}
function vSync(el){const sv=S.body.strava;const base=location.origin+location.pathname;const imp=S.body.imports[today()]||{};
 el.innerHTML=`<div class="card"><h3>Strava</h3>${sv.access?`<p class="tag">Connected ✓</p><button class="btn" id="ss">Sync last 14 days</button><button class="btn ghost" id="sd">Disconnect</button>`:`<p class="tag">Create an API app at strava.com/settings/api, set "Authorization Callback Domain" to <code>${esc(location.host)}</code>, then paste its Client ID and Secret. They stay on this phone only.</p>
 <label>Client ID</label><input id="cid" value="${esc(sv.clientId||'')}"><label>Client Secret</label><input id="csec" type="password" value="${esc(sv.secret||'')}"><button class="btn" id="sc">Connect Strava</button>`}<p class="tag" id="smsg"></p></div>
 <div class="card"><h3>Apple Health / Garmin via Shortcut</h3><p class="tag">Today imported: ${imp.steps?imp.steps+' steps':'—'} ${imp.active?' · '+imp.active+' active kcal':''}</p>
 <p class="tag">Open this URL from a Shortcut with your numbers filled in:</p><code>${esc(base)}?import=steps:8500,kcal:450,workout:run:30</code>
 <ol class="steps tag"><li>Shortcuts → Automation → + → Time of Day 21:00, Run Immediately.</li><li>Add <b>Find Health Samples</b>: Steps, today, Sum. Repeat for Active Energy.</li><li>Add <b>Text</b>: <code>${esc(base)}?import=steps:[Steps],kcal:[Active Energy]</code></li><li>Add <b>Open URLs</b> with that Text. (Garmin syncs to Apple Health, so it's included.)</li></ol></div>`;
 if($('#sc'))$('#sc').onclick=()=>{sv.clientId=$('#cid').value.trim();sv.secret=$('#csec').value.trim();save();if(!sv.clientId){alert('Client ID needed');return}location.href=stravaAuthURL()};
 if($('#ss'))$('#ss').onclick=async()=>{$('#smsg').textContent='Syncing…';try{const n=await stravaSync();$('#smsg').textContent=`Imported ${n} new activities.`}catch(e){$('#smsg').textContent=e.message}};
 if($('#sd'))$('#sd').onclick=()=>{S.body.strava={clientId:sv.clientId,secret:sv.secret};save();vBody('sync')}}
// ---------- MONEY (savings goals only) ----------
function vMoney(){ensure();const gs=S.money.goals;
 V.innerHTML=`<h2>Savings goals</h2>${gs.map(g=>{const s=saved(g),pc=Math.min(100,s/g.target*100),P=goalPace(g);return`<div class="card goal">${g.img?`<img src="${g.img}" class="gimg">`:''}<div class="src">${GOAL_TYPES[g.type||'other'].e} ${esc(g.name)}${g.done?' · reached 🏆':''}</div>
 <div class="bar" style="height:10px"><i style="width:${pc}%"></i></div><div class="row" style="justify-content:space-between"><b>${fmt(s)} / ${fmt(g.target)} kr</b><span class="tag">${Math.round(pc)}%</span></div>
 ${g.deadline&&!g.done?`<p class="tag">${fmt(P.weekly)} kr/week to hit ${g.deadline} · <span style="color:${P.status==='ahead'?'#8fc07a':'#e0a070'}">${P.status} by ${fmt(Math.abs(P.diff))} kr</span></p>`:''}
 ${g.done?'':`<div class="row"><input type="number" placeholder="Deposit kr" inputmode="numeric" data-amt="${g.id}" style="margin:0"><button class="btn" data-dep="${g.id}" style="width:auto;margin:0">Deposit</button></div>`}
 <div class="row" style="justify-content:flex-end"><button class="icon" data-pin="${g.id}" title="Show on lock screen">${topGoal()===g?'📌':'📍'}</button><button class="icon" data-gdel="${g.id}">🗑</button></div></div>`}).join('')||'<p class="mu">No goals yet. Pick something worth saving for.</p>'}
 <details ${gs.length?'':'open'}><summary class="btn ghost">＋ New goal</summary><div class="card"><label>Name</label><input id="gn" placeholder="e.g. Porsche fund"><label>Type</label><select id="gt">${Object.keys(GOAL_TYPES).map(k=>`<option value="${k}">${GOAL_TYPES[k].e} ${k}</option>`).join('')}</select>
 <label>Target (NOK)</label><input id="ga" type="number" inputmode="numeric"><label>Deadline (optional)</label><input id="gd" type="date"><label>Picture (optional)</label><input id="gi" type="file" accept="image/*"><button class="btn" id="gc">Create goal</button></div></details>
 <p class="tag">Strictly savings: log what you set aside. Rewards at 25/50/75%, and reaching a goal unlocks a matching avatar item.</p>
 <label class="row tag"><input type="checkbox" id="wb" style="width:auto" ${S.money.wallBar?'checked':''}> Show the top goal's progress on my lock-screen wallpaper</label>`;
 V.querySelectorAll('[data-dep]').forEach(b=>b.onclick=()=>{const a=+V.querySelector(`[data-amt="${b.dataset.dep}"]`).value;const ev=deposit(b.dataset.dep,a);if(ev&&ev.length)celebrate(b.dataset.dep,ev);else vMoney()});
 V.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>{gs.forEach(g=>g.pinned=g.id===b.dataset.pin);save();vMoney()});
 V.querySelectorAll('[data-gdel]').forEach(b=>b.onclick=()=>{if(confirm('Delete goal?')){S.money.goals=gs.filter(g=>g.id!==b.dataset.gdel);save();vMoney()}});
 $('#wb').onchange=e=>{S.money.wallBar=e.target.checked;save()};
 $('#gc').onclick=async()=>{const n=$('#gn').value.trim(),a=+$('#ga').value;if(!n||!(a>0)){alert('Name and target needed');return}let img=null;const f=$('#gi').files[0];if(f)img=await shrinkImg(f,480);
  S.money.goals.push({id:'g'+Date.now(),name:n,type:$('#gt').value,target:a,deadline:$('#gd').value||null,img,deps:[],created:today()});save();vMoney()}}
function shrinkImg(file,max){return new Promise(res=>{const i=new Image();i.onload=()=>{const s=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',0.8))};i.src=URL.createObjectURL(file)})}
function celebrate(gid,ev){const g=S.money.goals.find(x=>x.id===gid),top=Math.max(...ev);const o=document.createElement('div');o.className='rankup';const it=itemById(GOAL_TYPES[g.type||'other'].item);
 o.innerHTML=`<div class="rk-bg"></div><div class="rk-in">${top===100?`<div class="src">Goal reached</div><div style="font-size:64px">🏆</div><h2 style="font-size:30px">${esc(g.name)}</h2><p>+200 XP · new item: ${it.e} ${esc(it.n)}</p><div class="rk-av"><div class="rk-new" style="opacity:1">${avatarSVG(curRank(),S.stats,S.equip,230)}</div></div>`:`<div class="src">Milestone</div><div style="font-size:64px">💰</div><h2>${top}% of ${esc(g.name)}</h2><p>+25 XP · keep stacking.</p>`}<button class="btn" style="max-width:280px">Continue</button></div>`;
 document.body.appendChild(o);o.querySelector('button').onclick=()=>{o.remove();vMoney()}}
// ---------- SHOP (coins only; payment-provider hook for the future) ----------
const PRICE={common:120,rare:300,epic:700};
function shopCatalog(){const c=ITEMS.filter(i=>!S.inv.includes(i.id)).map(i=>({sku:'item:'+i.id,name:i.n,e:i.e,price:PRICE[i.r],kind:'cosmetic'}));
 c.unshift({sku:'shield',name:'Streak shield (max 2 held)',e:'🛡️',price:250,kind:'shield',disabled:S.tokens>=2});
 if(S.brokenStreak&&(new Date(today())-new Date(S.brokenStreak.d))/864e5<=2)c.unshift({sku:'reincarnate',name:`Streak reincarnation (restore ${S.brokenStreak.v} days)`,e:'🔥',price:1200,kind:'restore'});
 if(interviewCooldown())c.unshift({sku:'retake',name:'Instant interview retake',e:'🎤',price:800,kind:'retake'});return c}
// Providers: only 'coins' is implemented. A real-money provider (e.g. Apple IAP/Stripe) could register here later.
const PAY={coins:{canPay:p=>S.coins>=p,charge:p=>{S.coins-=p;S._xpSeen=S.xp;return true}}};
function purchase(sku,provider='coins'){const it=shopCatalog().find(x=>x.sku===sku);if(!it||it.disabled)return false;const P=PAY[provider];if(!P||!P.canPay(it.price))return false;P.charge(it.price);grant(sku);save();return true}
function grant(sku){if(sku.startsWith('item:')){const id=sku.slice(5);S.inv.push(id);badge('Bought: '+itemById(id).n,itemById(id).e)}
 else if(sku==='shield')addToken(1);else if(sku==='reincarnate'){S.streak=S.brokenStreak.v+(S.lastDay===today()?1:0);if(S.brokenStreak.mb!=null)S.multBonus=S.brokenStreak.mb;S.brokenStreak=null;badge('Streak reincarnated','🔥')}else if(sku==='retake'){S.interview.failed=null}}
function vShop(){V.innerHTML=`<button class="icon" id="bk">‹ Hall</button><h2>Shop</h2><p class="mu">🪙 ${S.coins} coins — earned from sessions, quizzes, workouts, deposits and check-ins (½ coin per XP). Cosmetic only; nothing core is locked.</p>
 <div class="items" style="grid-template-columns:repeat(2,1fr)">${shopCatalog().map(x=>`<button class="it" data-sku="${x.sku}" ${x.disabled||S.coins<x.price?'disabled':''} style="${x.disabled||S.coins<x.price?'opacity:.45':''}">${x.e}<small>${esc(x.name)}</small><small style="color:var(--gold)">🪙 ${x.price}</small></button>`).join('')}</div>`;
 $('#bk').onclick=()=>go('hall');V.querySelectorAll('[data-sku]').forEach(b=>b.onclick=()=>{if(confirm('Buy for coins?')&&purchase(b.dataset.sku))vShop()})}
// ---------- RANK-UP INTERVIEW ----------
function interviewCooldown(){const f=S.interview&&S.interview.failed;if(!f)return 0;const d=7-Math.floor((new Date(today())-new Date(f))/864e5);return d>0?d:0}
function interviewPool(){const since=S.rankSince||'2000-01-01';return Object.entries(S.srs).filter(([id,c])=>byId(id)&&((S.firstSeen[id]||c.last||'')>=since)).map(([id,c])=>({c:byId(id),w:1+c.lapses*2+Math.max(0,2.5-c.ef)*4}))}
function wsample(pool,n){const out=[];pool=pool.slice();while(out.length<n&&pool.length){const tot=pool.reduce((a,x)=>a+x.w,0);let r=Math.random()*tot,i=0;while(r>pool[i].w){r-=pool[i].w;i++}out.push(pool.splice(i,1)[0].c)}return out}
function buildInterview(){const nx=curRank()+1,n=nx>=9?12:10;let pool=interviewPool();if(pool.length<n)pool=Object.keys(S.srs).filter(byId).map(id=>({c:byId(id),w:1}));const cs=wsample(pool,n);
 const pick=(a,k)=>a.slice().sort(()=>Math.random()-.5).slice(0,k);const sc=Math.min(2,cs.length);
 return cs.map((c,i)=>{const same=all().filter(x=>x.id!==c.id&&(x.cat||'Life')===(c.cat||'Life'));
  if(i<sc){const lead=c.cat==='Business'?'On a job this week you decide to':'This week you decide to';const first=s=>s.split(/(?<=[.!?])\s/)[0];
   return{c,scenario:true,q:`Scenario: ${lead} "${c.action.replace(/\.$/,'')}". Which principle are you applying?`,ans:first(c.text),opts:pick([first(c.text)].concat(pick(same,3).map(x=>first(x.text))),4)}}
  return{c,q:c.q,ans:c.a,opts:pick([c.a].concat(pick(same.filter(x=>x.a!==c.a),3).map(x=>x.a)),4)}}).sort(()=>Math.random()-.5)}
function vInterview(){ensure();S.interview=S.interview||{};const nx=RANKS[curRank()+1];if(!nx||eligibleRank()<=curRank()){V.innerHTML=`<p class="mu">${esc(rankBlocker())}</p>`;return}if(interviewCooldown()){V.innerHTML=`<div class="card center"><h2>Interview for ${esc(job.title)}</h2><p class="mu">Retake available in ${interviewCooldown()} day(s). Review your missed cards meanwhile — or buy an Instant retake in the Shop.</p><button class="btn ghost" onclick="go('shop')">Shop</button></div>`;return}
 const tier=curRank()+1;if(!S.interview.job||S.interview.job.tier!==tier){const op=jobOptions(tier);V.innerHTML=`<div class="card center"><div class="src">Tier ${tier} · ${esc(nx.n)}</div><h2>Which job are you applying for?</h2><p class="mu">Cosmetic only: title, look and interviewer. Same tier, XP and stats.</p>${op.map((o,k)=>`<button class="btn ghost" data-job="${k}" style="text-align:left">${TRACKS[o.track].e} <b>${esc(o.title)}</b><br><small class="tag">${TRACKS[o.track].n}${o.switch?' · switch track':''}</small></button>`).join('')}</div>`;
  V.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>{S.interview.job=Object.assign({tier},op[+b.dataset.job]);save();vInterview()});return}
 const job=S.interview.job;const Q=buildInterview();let i=0,score=0;const missed=[];
 V.innerHTML=`<div class="card center"><div class="src">Interview for ${esc(job.title)} · Tier ${tier}</div><div style="font-size:54px">🎤</div><p class="ins">${esc(interviewerLine(tier,job))}</p><button class="icon" id="chg">Change job</button><p class="mu">${Q.length} questions · 70% to pass</p><button class="btn" id="go">Begin</button></div>`;
 const step=()=>{if(i>=Q.length){const pass=score/Q.length>=0.7;S.interview=S.interview||{};
   if(pass){S.interview.failed=null;recordJob(curRank()+1,job);S.interview.job=null;S.rank=curRank()+1;S.rankSince=today();S.forms.push({r:S.rank,d:today(),stats:{...S.stats}});badge('Rank: '+rankName(S.rank)+` (interview ${score}/${Q.length})`,'👑');kickXP(50);save();go('today');rankOverlay(S.rank)}
   else{S.interview.failed=today();missed.forEach(c=>{const r=S.srs[c.id];if(r){r.due=today();r.n=0}});save();
    V.innerHTML=`<div class="card"><div class="src">Interview for ${esc(job.title)}</div><h2>${score}/${Q.length} — not this time</h2><p class="mu">“Close. Brush up on these and come back in a week.” Missed cards are back in your reviews.</p>${missed.map(c=>`<div class="li"><div class="src" style="margin:0">${esc(c.author)}</div><div class="t">${esc(c.text)}</div></div>`).join('')}<button class="btn" id="h">Back</button></div>`;$('#h').onclick=()=>go('today')}return}
  const x=Q[i];V.innerHTML=`<div class="bar"><i style="width:${i/Q.length*100}%"></i></div><div class="card"><div class="src">Interview for ${esc(job.title)} · ${i+1}/${Q.length}${x.scenario?' · scenario':''}</div><div class="q">${esc(x.q)}</div>${x.opts.map((o,k)=>`<button class="btn ghost opt" data-k="${k}" style="text-align:left">${esc(o)}</button>`).join('')}</div>`;
  V.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=x.opts[+b.dataset.k]===x.ans;if(ok)score++;else missed.push(x.c);V.querySelectorAll('.opt').forEach(y=>{y.disabled=true;if(x.opts[+y.dataset.k]===x.ans)y.style.borderColor='#7fae5a'});if(!ok)b.style.borderColor='#a04040';setTimeout(()=>{i++;step()},650)})};
 $('#go').onclick=step;$('#chg').onclick=()=>{S.interview.job=null;save();vInterview()}}
// ---------- hook extra views into existing router ----------
Object.assign(views,{body:vBody,money:vMoney,shop:vShop,interview:vInterview,checkin:()=>vCheckin(1),quiz:vQuiz,learn:vLibrary});
const _go=go;go=function(v,arg){if(v==='learn')v='library';_go(v,arg);document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v||(v==='library'&&b.dataset.v==='learn')||(v==='session'&&b.dataset.v==='learn')))};
// Hall extras: shop, progress links
const _vHall=vHall;vHall=function(){_vHall();V.insertAdjacentHTML('afterbegin',`<div class="row" style="gap:8px;margin-bottom:10px"><button class="btn ghost" id="toShop" style="margin:0">🛒 Shop · 🪙${S.coins}</button><button class="btn ghost" id="toProg" style="margin:0">📈 Progress</button></div>`);
 V.insertAdjacentHTML('beforeend',`<h3>Career path</h3>${careerTimeline()}`);
 $('#toShop').onclick=()=>go('shop');$('#toProg').onclick=()=>go('progress');};
views.hall=vHall;
// Wallpaper: optional goal bar (client-side only)
const _draw=drawWallpaper;drawWallpaper=async function(cv,d){await _draw(cv,d);const g=typeof S!=='undefined'&&S.money&&S.money.wallBar&&topGoal();if(!g)return cv;const x=cv.getContext('2d'),W=cv.width,H=cv.height,pc=Math.min(1,saved(g)/g.target);
 const y=H*0.94;x.fillStyle='rgba(255,255,255,.18)';x.fillRect(W*0.2,y,W*0.6,10);x.fillStyle='#c9a96e';x.fillRect(W*0.2,y,W*0.6*pc,10);x.font='500 34px -apple-system,Helvetica,Arial';x.fillStyle='#e9dfcc';x.textAlign='center';x.fillText(`${g.name} · ${Math.round(pc*100)}%`,W/2,y-18);return cv};
// ---------- progress photos & physique label ----------
function photos(){try{return JSON.parse(localStorage.getItem('wisdom.photos')||'[]')}catch(e){return[]}}
function savePhotos(P){try{localStorage.setItem('wisdom.photos',JSON.stringify(P));return true}catch(e){return false}}
function physLabel(){const b=bodyShape();if(b.fat>0.5)return'soft';if(b.muscle>0.7&&b.fat<0)return'Greek god';if(b.muscle>0.4&&b.fat<0.2)return'athletic';if(b.muscle>0.15)return'fit';return'average'}
// ---------- pop quiz: 3 Qs from recent cards at the start of every 2nd–3rd session ----------
function popDue(){if(S.session&&S.session.day===today())return false;if(S.popDay===today())return false;const recent=Object.entries(S.firstSeen).filter(([id,d])=>d>=addDays(today(),-14)&&d<today()&&byId(id));return recent.length>=3&&(S.sessN||0)+1>=(S.popAt||2)}
function vPop(){const recent=Object.entries(S.firstSeen).filter(([id,d])=>d>=addDays(today(),-14)&&d<today()&&byId(id)).map(([id])=>byId(id));const pk=(a,n)=>a.slice().sort(()=>Math.random()-.5).slice(0,n);
 const qs=pk(recent,3).map(c=>({c,opts:pk([c.a].concat(pk(all().filter(x=>x.id!==c.id&&(x.cat||'Life')===(c.cat||'Life')&&x.a!==c.a),3).map(x=>x.a)),4)}));let i=0,sc=0;
 S.popDay=today();S.sessDay=today();S.sessN=(S.sessN||0)+1;S.popAt=S.sessN+2+(Math.random()<.5?1:0);save();
 const step=()=>{if(i>=3){kickXP(10);save();V.innerHTML=`<div class="card center"><div class="src">Pop quiz</div><h2>${sc}/3</h2><p>+10 XP${sc===3?' · perfect':''}</p><button class="btn" id="cont">Start session</button></div>`;$('#cont').onclick=()=>vSessionRaw();return}
  const {c,opts}=qs[i];V.innerHTML=`<div class="card"><div class="src">⚡ Pop quiz · ${i+1}/3</div><div class="q">${esc(c.q)}</div>${opts.map((o,k)=>`<button class="btn ghost opt" data-k="${k}" style="text-align:left">${esc(o)}</button>`).join('')}<button class="icon" id="skp">Skip</button></div>`;
  $('#skp').onclick=()=>vSessionRaw();V.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const ok=opts[+b.dataset.k]===c.a;if(ok)sc++;V.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(opts[+x.dataset.k]===c.a)x.style.borderColor='#7fae5a'});if(!ok)b.style.borderColor='#a04040';setTimeout(()=>{i++;step()},900)})};step()}
const vSessionRaw=views.session;views.session=a=>{if(S.session&&S.session.day===today()||S.sessDay===today())return vSessionRaw(a);if(popDue())return vPop();S.sessDay=today();S.sessN=(S.sessN||0)+1;save();return vSessionRaw(a)};
// ---------- startup ----------
ensure();dailyTick();{const P=new URLSearchParams(location.search);
 if(P.get('code')&&P.get('scope')&&S.body.strava.clientId){stravaToken({code:P.get('code'),grant_type:'authorization_code'}).then(()=>stravaSync()).catch(e=>alert('Strava: '+e.message)).finally(()=>{history.replaceState(null,'',location.pathname);go('body','sync')})}
 const h=handleParams();renderStats();go(h.target==='checkin'?'checkin':h.target==='body'?'body':location.hash==='#wallpaper'?'wall':'today',h.target==='body'?'train':undefined);if(h.msgs.length)setTimeout(()=>alert('Imported: '+h.msgs.join(', ')),300)}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
