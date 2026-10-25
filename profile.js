'use strict';
// ===== Local profile ("account", stored only in localStorage) + Supplements tracker =====
const ACT={sed:['Sedentary',1.2],light:['Light (1–3 workouts/wk)',1.375],mod:['Moderate (3–5/wk)',1.55],high:['Very active (6–7/wk)',1.725],ath:['Athlete / physical job',1.9]};
function ensureProfile(){S.profile=Object.assign({name:'Christian',birth:'1993-02-19',sex:'male',activity:'mod',done:false,dismissed:false},S.profile||{});
 S.supps=Object.assign({items:[],log:{},xpDays:{}},S.supps||{});return S.profile}
function age(){const b=S.profile.birth;if(!b)return null;const d=new Date(b+'T00:00'),n=new Date();let a=n.getFullYear()-d.getFullYear();if(n<new Date(n.getFullYear(),d.getMonth(),d.getDate()))a--;return a}
function curKg(){const w=S.body.weights;return w.length?w[w.length-1].kg:S.body.baseKg}
function suggestTargets(){const p=S.profile,kg=curKg(),h=S.body.height,a=age()||30;const bmr=10*kg+6.25*h-5*a+(p.sex==='female'?-161:5);
 return{kcal:Math.round(bmr*(ACT[p.activity]||ACT.mod)[1]/50)*50,p:Math.round(kg*2)}}
function exportAll(){const t=today();const b=new Blob([JSON.stringify({state:S,face:FACE,photos:JSON.parse(localStorage.getItem('wisdom.photos')||'[]'),v:6})],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='wisdom-backup-'+t+'.json';a.click()}
function importAll(after){const i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=async()=>{try{const J=JSON.parse(await i.files[0].text());S=migrate(Object.assign(def(),J.state||J));if(J.face)setFace(J.face);if(J.photos)localStorage.setItem('wisdom.photos',JSON.stringify(J.photos));ensure();ensureProfile();save();alert('Backup restored');go(after||'profile')}catch(e){alert('Invalid file')}};i.click()}

function vProfile(){ensure();ensureProfile();const p=S.profile,tg=S.body.targets,sg=suggestTargets();
 V.innerHTML=`<h2>Your profile</h2><p class="tag">Stored only on this phone — no account, no server. Back it up below.</p>
 <div class="card center"><div style="width:120px;margin:0 auto">${avatarSVG(curRank(),S.stats,S.equip,120)}</div><div class="tag">${esc(p.name||'You')}${age()!=null?' · '+age()+' years':''} · ${S.body.height} cm · ${curKg()} kg</div></div>
 <div class="card"><label>Name</label><input id="pn" value="${esc(p.name)}" placeholder="Your name">
 <label>Birth date</label><input id="pb" type="date" value="${esc(p.birth)}">
 <label>Sex (for calorie / body-fat maths)</label><select id="ps"><option value="male" ${p.sex==='male'?'selected':''}>Male</option><option value="female" ${p.sex==='female'?'selected':''}>Female</option></select>
 <label>Height (cm)</label><input id="ph" type="number" inputmode="numeric" value="${S.body.height}">
 <label>Weight</label><p class="tag" style="margin:0 0 8px">${curKg()} kg — from your latest weigh-in (log new ones under Body → Weight).</p>
 <label>Activity level</label><select id="pa">${Object.entries(ACT).map(([k,[n]])=>`<option value="${k}" ${k===p.activity?'selected':''}>${n}</option>`).join('')}</select>
 <label>Daily targets</label><div class="row"><input id="pk" type="number" inputmode="numeric" value="${tg.kcal}"><span class="tag">kcal</span><input id="pp" type="number" inputmode="numeric" value="${tg.p}"><span class="tag">g protein</span></div>
 <p class="tag">Suggested from your stats: ${sg.kcal} kcal · ${sg.p} g protein (maintenance). <a href="#" id="psg" style="color:var(--gold)">Use these</a></p>
 <button class="btn" id="psv">Save profile</button></div>
 <div class="card"><h3 style="margin-top:0">Your face</h3><p class="tag">Optional selfie, turned into an illustrated face on your avatar.</p><input type="file" id="pf" accept="image/*" capture="user">${FACE?'<button class="btn ghost" id="pnf">Remove face</button>':''}</div>
 <div class="card"><h3 style="margin-top:0">Backup</h3><p class="tag">Everything (progress, body, money, supplements, face, photos) as one JSON file.</p><button class="btn ghost" id="pex">Export backup</button><button class="btn ghost" id="pim">Import backup</button></div>`;
 $('#psg').onclick=e=>{e.preventDefault();$('#pk').value=sg.kcal;$('#pp').value=sg.p};
 $('#psv').onclick=()=>{p.name=$('#pn').value.trim();p.birth=$('#pb').value;p.sex=$('#ps').value;p.activity=$('#pa').value;S.body.height=+$('#ph').value||S.body.height;S.body.targets={kcal:+$('#pk').value||2200,p:+$('#pp').value||160};p.done=true;save();go('today')};
 $('#pf').onchange=e=>{const f=e.target.files[0];if(!f)return;const i=new Image();i.onload=()=>{setFace(stylizeFace(i));vProfile()};i.src=URL.createObjectURL(f)};
 if($('#pnf'))$('#pnf').onclick=()=>{setFace(null);vProfile()};$('#pex').onclick=exportAll;$('#pim').onclick=()=>importAll('profile')}
views.profile=vProfile;

// ---- Home: greeting, optional setup card, supplements reminder; avatar tap -> profile ----
const _vHomeP=views.today;views.today=function(){_vHomeP();ensureProfile();const p=S.profile,h=new Date().getHours();
 const left=suppDue(today()).filter(x=>!x.taken).length;
 let html=`<div class="row" style="justify-content:space-between;margin-bottom:6px"><b>${h<5?'Good night':h<12?'Good morning':h<18?'Good afternoon':'Good evening'}${p.name?', '+esc(p.name):''}</b><button class="icon" id="toProf" title="Profile">👤 Profile</button></div>`;
 if(!p.done&&!p.dismissed)html+=`<div class="card" id="pcard" style="padding:14px"><b>Set up your profile</b><p class="tag">Optional · name, age, height, targets — kept on this phone only.</p><div class="row"><button class="btn" id="pgo" style="margin-top:6px">Set up</button><button class="btn ghost" id="pno" style="margin-top:6px">Not now</button></div></div>`;
 if(left)html+=`<button class="btn ghost" id="supGo" style="margin:0 0 8px">💊 ${left} supplement dose${left>1?'s':''} left today</button>`;
 V.insertAdjacentHTML('afterbegin',html);$('#toProf').onclick=()=>go('profile');const hv=V.querySelector('.hav');if(hv){hv.style.cursor='pointer';hv.onclick=()=>go('profile')}
 if($('#pgo')){$('#pgo').onclick=()=>go('profile');$('#pno').onclick=()=>{p.dismissed=true;save();$('#pcard').remove()}}
 if($('#supGo'))$('#supGo').onclick=()=>go('body','supp')};

// ---- Progress settings: link to profile ----
const _vProgP=views.progress;views.progress=function(a){_vProgP(a);V.insertAdjacentHTML('beforeend','<button class="btn ghost" id="toProf2">👤 Profile & backup</button>');$('#toProf2').onclick=()=>go('profile')};

// ===== Supplements =====
const SLOTS={morning:'🌅 Morning',lunch:'☀️ Lunch',evening:'🌙 Evening'};const WD=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const wdOf=d=>(new Date(d+'T00:00').getDay()+6)%7;
function suppOn(s,d){return !s.paused&&(!s.days||!s.days.length||s.days.includes(wdOf(d)))&&(s.created||'')<=d}
function suppDue(d){ensureProfile();const L=S.supps.log[d]||{},o=[];S.supps.items.forEach(s=>{if(suppOn(s,d))s.times.forEach(t=>o.push({s,t,taken:!!L[s.id+'|'+t]}))});return o}
function suppDayDone(s,d){const L=S.supps.log[d]||{};return s.times.every(t=>L[s.id+'|'+t])}
function suppStreak(s){let n=0,d=today();if(suppOn(s,d)&&!suppDayDone(s,d))d=addDays(d,-1);for(let i=0;i<400;i++,d=addDays(d,-1)){if((s.created||'')>d)break;if(!suppOn(s,d))continue;if(suppDayDone(s,d))n++;else break}return n}
function toggleDose(id,t){const d=today(),L=S.supps.log[d]=S.supps.log[d]||{},k=id+'|'+t;if(L[k])delete L[k];else L[k]=Date.now();
 const due=suppDue(d);if(due.length&&due.every(x=>x.taken)&&!S.supps.xpDays[d]){S.supps.xpDays[d]=1;kickXP(5);S.stats.discipline=(S.stats.discipline||0)+1;badgeOnce('supp-first','All supplements taken','💊')}save()}
async function lookupCode(code){for(const host of['world.openfoodfacts.org','world.openbeautyfacts.org','world.openproductsfacts.org']){try{const r=await fetch(`https://${host}/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,brands,image_front_small_url,image_small_url,quantity`);if(!r.ok)continue;const j=await r.json();
 if(j.status===1&&j.product&&j.product.product_name)return{name:j.product.product_name,brand:(j.product.brands||'').split(',')[0],img:j.product.image_front_small_url||j.product.image_small_url||'',qty:j.product.quantity||'',src:{openfoodfacts:'Open Food Facts',openbeautyfacts:'Open Beauty Facts',openproductsfacts:'Open Products Facts'}[host.split('.')[1]]}}catch(e){}}return null}
let ZX=null;function loadZX(){return ZX||(ZX=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js';s.onload=()=>res(window.ZXing);s.onerror=()=>{ZX=null;rej(new Error('Could not load scanner (offline?)'))};document.head.appendChild(s)}))}
async function decodePhoto(file){const url=URL.createObjectURL(file);const img=new Image();await new Promise((r,j)=>{img.onload=r;img.onerror=j;img.src=url});
 if('BarcodeDetector' in window){try{const c=await new BarcodeDetector().detect(img);if(c.length)return c[0].rawValue}catch(e){}}
 const Z=await loadZX();const rd=new Z.BrowserMultiFormatReader();try{return(await rd.decodeFromImageElement(img)).getText()}catch(e){return null}}
let STREAM=null;function stopCam(){if(STREAM){STREAM.getTracks().forEach(t=>t.stop());STREAM=null}}
async function liveScan(video,onCode){const det=new BarcodeDetector();STREAM=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});video.srcObject=STREAM;await video.play();
 const tick=async()=>{if(!STREAM)return;try{const c=await det.detect(video);if(c.length){stopCam();return onCode(c[0].rawValue)}}catch(e){}requestAnimationFrame(tick)};tick()}

function suppForm(bv,s){s=s||{};const live='BarcodeDetector' in window&&navigator.mediaDevices;
 bv.innerHTML=`<div class="card"><h3 style="margin-top:0">${s.id?'Edit':'Add'} supplement</h3>
 ${s.id?'':`<label>Barcode</label>${live?'<button class="btn ghost" id="sLive" style="margin-top:0">📷 Scan with camera</button><video id="sVid" playsinline muted style="width:100%;border-radius:12px;display:none;margin-top:8px"></video>':''}
 <label class="btn ghost" style="display:block;${live?'':'margin-top:0'}">📸 Take photo of barcode<input type="file" id="sPh" accept="image/*" capture="environment" style="display:none"></label>
 <div class="row" style="margin-top:8px"><input id="sCode" inputmode="numeric" pattern="[0-9]*" placeholder="…or type the number under the barcode"><button class="btn" id="sLook" style="width:auto;margin:0 0 6px">Look up</button></div>
 <p class="tag" id="sMsg">${live?'':'Live camera scanning isn\'t supported in this browser (e.g. iPhone Safari) — use the photo option or type the number.'}</p>`}
 <div id="sPrev" class="row" style="margin:6px 0">${s.img?`<img src="${esc(s.img)}" style="width:56px;height:56px;object-fit:contain;border-radius:8px;background:#fff">`:''}</div>
 <label>Name</label><input id="sN" value="${esc(s.name||'')}" placeholder="e.g. Vitamin D3"><label>Brand</label><input id="sB" value="${esc(s.brand||'')}">
 <label>Dose</label><div class="row"><input id="sD" type="number" step="any" inputmode="decimal" value="${s.dose||1}"><select id="sU">${['capsule','tablet','softgel','scoop','g','mg','µg','IU','ml','drops'].map(u=>`<option ${u===(s.unit||'capsule')?'selected':''}>${u}</option>`).join('')}</select></div>
 <label>When</label><div class="row">${Object.entries(SLOTS).map(([k,n])=>`<label class="tag"><input type="checkbox" class="sT" value="${k}" ${(s.times||['morning']).includes(k)?'checked':''} style="width:auto"> ${n}</label>`).join('')}</div>
 <label>Days</label><div class="row" style="flex-wrap:wrap">${WD.map((n,i)=>`<label class="tag"><input type="checkbox" class="sW" value="${i}" ${!s.days||!s.days.length||s.days.includes(i)?'checked':''} style="width:auto"> ${n}</label>`).join('')}</div>
 <button class="btn" id="sSave">Save</button><button class="btn ghost" id="sCan">Cancel</button></div>`;
 let meta={code:s.code||'',img:s.img||''};const msg=t=>{if($('#sMsg'))$('#sMsg').textContent=t};
 const got=async code=>{code=String(code||'').replace(/\D/g,'');if(!code){msg('No barcode number.');return}$('#sCode').value=code;meta.code=code;msg('Looking up '+code+'…');const r=await lookupCode(code);
  if(r){meta.img=r.img;$('#sN').value=r.name+(r.qty?' ('+r.qty+')':'');$('#sB').value=r.brand;$('#sPrev').innerHTML=r.img?`<img src="${esc(r.img)}" style="width:56px;height:56px;object-fit:contain;border-radius:8px;background:#fff">`:'';msg('Found on '+r.src+' ✓')}
  else{msg('Not found in Open Food/Beauty/Products Facts — type the name below.');$('#sN').focus()}};
 if($('#sLook'))$('#sLook').onclick=()=>got($('#sCode').value);
 if($('#sPh'))$('#sPh').onchange=async e=>{const f=e.target.files[0];if(!f)return;msg('Reading barcode…');try{const c=await decodePhoto(f);c?got(c):msg('Couldn\'t read a barcode in that photo — try closer/sharper, or type the number.')}catch(er){msg(er.message+' — type the number instead.')}};
 if($('#sLive'))$('#sLive').onclick=async()=>{const v=$('#sVid');v.style.display='block';try{await liveScan(v,c=>{v.style.display='none';got(c)})}catch(e){v.style.display='none';msg('Camera unavailable — use photo or type the number.')}};
 $('#sCan').onclick=()=>{stopCam();vBody('supp')};
 $('#sSave').onclick=()=>{const name=$('#sN').value.trim();if(!name){alert('Enter a name');return}const times=[...V.querySelectorAll('.sT:checked')].map(x=>x.value);if(!times.length){alert('Pick at least one time');return}
  let days=[...V.querySelectorAll('.sW:checked')].map(x=>+x.value);if(days.length===7)days=[];if(!days.length&&V.querySelectorAll('.sW:checked').length===0){alert('Pick at least one day');return}
  const o=Object.assign(s.id?s:{id:'s'+Date.now(),created:today(),paused:false},{name,brand:$('#sB').value.trim(),dose:+$('#sD').value||1,unit:$('#sU').value,times,days,code:meta.code,img:meta.img});
  if(!s.id)S.supps.items.push(o);stopCam();save();vBody('supp')}}

function vSupp(bv){ensureProfile();const d=today(),due=suppDue(d),I=S.supps.items;
 const ord=Object.keys(SLOTS);const list=ord.map(t=>{const xs=due.filter(x=>x.t===t);return xs.length?`<h3>${SLOTS[t]}</h3>`+xs.map(x=>`<div class="li row" style="justify-content:space-between;padding:10px 0"><label class="row" style="flex:1;cursor:pointer"><input type="checkbox" data-tk="${x.s.id}|${t}" ${x.taken?'checked':''} style="width:22px;height:22px;margin:0">${x.s.img?`<img src="${esc(x.s.img)}" style="width:34px;height:34px;object-fit:contain;border-radius:6px;background:#fff">`:''}<span><span style="${x.taken?'text-decoration:line-through;opacity:.6':''}">${esc(x.s.name)}</span><br><span class="tag">${x.s.dose} ${esc(x.s.unit)}${x.s.brand?' · '+esc(x.s.brand):''}</span></span></label><span class="tag">🔥${suppStreak(x.s)}</span></div>`).join(''):''}).join('');
 const done=due.filter(x=>x.taken).length;
 const hist=s=>{let h='';for(let i=13;i>=0;i--){const dd=addDays(d,-i);const on=suppOn(s,dd)&&(s.created||'')<=dd;const L=S.supps.log[dd]||{};const n=s.times.filter(t=>L[s.id+'|'+t]).length;h+=`<i title="${dd}" style="display:inline-block;width:12px;height:12px;margin:1px;border-radius:3px;background:${!on?'transparent;border:1px solid var(--line)':n===s.times.length?'var(--gold)':n?'#7a6a45':'#2a2a31'}"></i>`}return h};
 bv.innerHTML=`<div class="card">${due.length?`<div class="src">Today · ${done}/${due.length} taken${S.supps.xpDays[d]?' · +5 XP ✓':' · all = +5 XP, +1 Discipline'}</div>${list}`:`<p class="mu">${I.length?'Nothing scheduled today.':'No supplements yet. Add one by scanning its barcode.'}</p>`}</div>
 <button class="btn" id="sAdd">＋ Add supplement</button>
 ${I.length?`<h3>Your supplements</h3>`+I.map(s=>`<div class="li"><div class="row" style="justify-content:space-between"><div><b>${esc(s.name)}</b>${s.paused?' <span class="tag">(paused)</span>':''}<div class="tag">${s.dose} ${esc(s.unit)} · ${s.times.map(t=>SLOTS[t].split(' ')[1]).join(', ')} · ${s.days&&s.days.length?s.days.map(i=>WD[i]).join(' '):'daily'} · streak ${suppStreak(s)}</div></div>
 <div class="row"><button class="icon" data-ed="${s.id}">✏️</button><button class="icon" data-pa="${s.id}">${s.paused?'▶️':'⏸'}</button><button class="icon" data-dl="${s.id}">🗑</button></div></div><div style="margin-top:6px">${hist(s)} <span class="tag">last 14 days</span></div></div>`).join(''):''}`;
 bv.querySelectorAll('[data-tk]').forEach(c=>c.onchange=()=>{const[id,t]=c.dataset.tk.split('|');toggleDose(id,t);vBody('supp')});
 $('#sAdd').onclick=()=>suppForm(bv);const F=id=>I.find(s=>s.id===id);
 bv.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>suppForm(bv,F(b.dataset.ed)));
 bv.querySelectorAll('[data-pa]').forEach(b=>b.onclick=()=>{const s=F(b.dataset.pa);s.paused=!s.paused;save();vBody('supp')});
 bv.querySelectorAll('[data-dl]').forEach(b=>b.onclick=()=>{if(confirm('Delete this supplement? History is kept in backups only until then.')){S.supps.items=S.supps.items.filter(s=>s.id!==b.dataset.dl);save();vBody('supp')}})}

const _vBodyP=vBody;vBody=function(tab){stopCam();_vBodyP(tab==='supp'?'food':tab);const tb=V.querySelector('.tabs');if(!tb)return;
 tb.insertAdjacentHTML('beforeend',`<button data-bt="supp" class="${tab==='supp'?'on':''}">💊 Supps</button>`);tb.lastElementChild.onclick=()=>vBody('supp');
 if(tab==='supp'){tb.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.bt==='supp'));vSupp($('#bv'))}};
views.body=vBody;ensureProfile();
{const b=document.querySelector('nav button.on');if(b&&b.dataset.v==='today')go('today')}
