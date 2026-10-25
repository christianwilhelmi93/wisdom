'use strict';
// ===== Shortcut setup pop-up (lock-screen quote + Sunday check-in) =====
let SETUP_SNOOZE=false;
function setupState(){S.setup=Object.assign({wall:false,checkin:false,declined:false},S.setup||{});return S.setup}
function setupDone(){const s=setupState();return s.declined||(s.wall&&s.checkin)}
function copyBtn(txt,label){return`<button class="cp" data-copy="${esc(txt)}">${esc(label||txt)}<span>Copy</span></button>`}
// Simple illustrated mock screens of the Shortcuts app
const phone=(title,body)=>`<div class="mock"><div class="mk-top">${title}</div>${body}</div>`;
const row=(t,sub,on)=>`<div class="mk-row ${on?'hl':''}"><span>${t}</span>${sub?`<small>${sub}</small>`:''}</div>`;
const act=(icon,t,sub)=>`<div class="mk-act"><i>${icon}</i><div><b>${t}</b>${sub?`<small>${sub}</small>`:''}</div></div>`;
const GUIDES={
 wall:{title:'Daily lock screen quote',e:'🖼️',autoSteps:[
  ['Open <b>Shortcuts</b> → <b>Automation</b> tab → <b>＋</b> (New Automation)',phone('Automation',row('＋ New Automation','',1)+row('Personal','')) ],
  ['Choose <b>Time of Day</b>: <b>06:30</b>, <b>Daily</b>, then <b>Run Immediately</b> (turn off “Notify When Run”)',phone('When',row('Time of Day','06:30',1)+row('Repeat','Daily')+row('Run Immediately','✓',1))],
  ['Add <b>Get Contents of URL</b> with the URL below',phone('Do',act('🌐','Get Contents of URL',esc(SC_URLS.wall.replace(/^https:\/\//,''))))],
  ['Add <b>Set Wallpaper Photo</b> → <b>Lock Screen</b>, tap ▸ and turn <b>Show Preview off</b>. Done.',phone('Do',act('🌐','Get Contents of URL','')+act('🖼️','Set Wallpaper Photo','Lock Screen · Show Preview off'))]],
  build:['<b>URL</b> → the wallpaper link','<b>Get Contents of URL</b>','<b>Set Wallpaper Photo</b> → Lock Screen, Show Preview off, Crop to Subject off'],
  copies:[[SC_URLS.wall,'Wallpaper URL'],['06:30 · Daily · Run Immediately','Schedule']]},
 checkin:{title:'Sunday check-in reminder',e:'📅',autoSteps:[
  ['Open <b>Shortcuts</b> → <b>Automation</b> → <b>＋</b>',phone('Automation',row('＋ New Automation','',1))],
  ['<b>Time of Day</b>: <b>19:00</b>, <b>Weekly</b> → <b>Sunday</b>, <b>Run Immediately</b>',phone('When',row('Time of Day','19:00',1)+row('Repeat','Weekly · Sunday',1)+row('Run Immediately','✓',1))],
  ['Add <b>Show Notification</b>: “Sunday check-in, boss. Two numbers, +50 XP.”',phone('Do',act('🔔','Show Notification','Sunday check-in, boss…'))],
  ['Add <b>Open URLs</b> with the check-in link below. Done — the first time it runs, this step ticks itself ✓',phone('Do',act('🔔','Show Notification','')+act('🧭','Open URLs',esc(SC_URLS.checkin.replace(/^https:\/\//,'')))) ]],
  build:['<b>Show Notification</b> (text below)','<b>Open URLs</b> → the check-in link'],
  copies:[[SC_URLS.checkin,'Check-in link'],['19:00 · Weekly · Sunday · Run Immediately','Schedule'],['Sunday check-in, boss. Two numbers, +50 XP.','Notification text']]}};
function openSetup(force){if(!force&&(setupDone()||SETUP_SNOOZE))return;const s=setupState();document.querySelector('.setup')&&document.querySelector('.setup').remove();
 const o=document.createElement('div');o.className='setup';let open=null;
 const render=()=>{o.innerHTML=`<div class="su-card"><div class="src">Setup · 2 shortcuts</div><h2>Make Wisdom run itself</h2><p class="mu">Two iPhone automations: a fresh quote on your lock screen every morning, and a Sunday nudge for your check-in.</p>
  ${['wall','checkin'].map((k,i)=>{const g=GUIDES[k],done=s[k];return`<div class="su-step ${done?'done':''}"><button class="su-head" data-open="${k}"><span class="su-n">${done?'✓':i+1}</span><span><small>Step ${i+1}</small>${g.e} ${g.title}</span><span>${open===k?'▴':'▾'}</span></button>
   ${open===k?`<div class="su-body"><button class="btn" data-inst="${k}">${SHORTCUT_LINKS[k]?'Install shortcut':'Install shortcut (build guide)'}</button><div id="b-${k}"></div>
   <h3>Create the automation</h3>${g.autoSteps.map((st,j)=>`<div class="su-g"><div class="su-gt"><span class="num">${j+1}</span> ${st[0]}</div>${st[1]}</div>`).join('')}
   <div class="su-copies">${g.copies.map(c=>`<div class="tag">${c[1]}</div>${copyBtn(c[0])}`).join('')}</div>
   ${k==='wall'?`<button class="btn ${done?'ghost':''}" data-self="wall">${done?'✓ Set up':'I\'ve set it up'}</button>`:`<p class="tag">${done?'✓ Activated — opened from your Shortcut.':'Ticks itself the first time the automation opens the app. Or:'}</p>${done?'':'<button class="btn ghost" data-self="checkin">I\'ve set it up</button>'}`}</div>`:''}</div>`}).join('')}
  <div class="su-foot"><button class="btn ghost" id="su-later">Not now</button><button class="btn ghost" id="su-dec">Decline</button></div>
  <label class="row tag su-tick"><input type="checkbox" id="su-never" style="width:auto;margin:0" ${s.declined?'checked':''}> Don't show this again (re-open in Progress → Settings)</label></div>`;
  o.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{open=open===b.dataset.open?null:b.dataset.open;render()});
  o.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy)}catch(e){const t=document.createElement('textarea');t.value=b.dataset.copy;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}b.querySelector('span').textContent='Copied ✓';setTimeout(()=>b.querySelector('span').textContent='Copy',1500)});
  o.querySelectorAll('[data-inst]').forEach(b=>b.onclick=()=>{const k=b.dataset.inst;if(SHORTCUT_LINKS[k]){location.href=SHORTCUT_LINKS[k];return}
   o.querySelector('#b-'+k).innerHTML=`<div class="su-build"><b>Build the shortcut</b> (one-tap install isn't available yet, so build it once):<ol>${GUIDES[k].build.map(x=>`<li>${x}</li>`).join('')}</ol><p class="tag">You can put these actions straight into the automation below, or save them as a shortcut first. Tip: once built, share its iCloud link and it can be added here for one-tap install.</p></div>`});
  o.querySelectorAll('[data-self]').forEach(b=>b.onclick=()=>{s[b.dataset.self]=true;save();if(s.wall&&s.checkin){o.remove();badge('Shortcuts set up','⚙️')}else{open=null;render()}});
  o.querySelector('#su-later').onclick=()=>{SETUP_SNOOZE=true;o.remove()};
  o.querySelector('#su-dec').onclick=()=>{if(o.querySelector('#su-never').checked){s.declined=true;save()}else SETUP_SNOOZE=true;o.remove()};
  o.querySelector('#su-never').onchange=e=>{s.declined=e.target.checked;save()}};
 render();document.body.appendChild(o)}
// activation pings from Shortcut-opened URLs
(function(){const P=new URLSearchParams(BOOT_QS);if(P.get('src')==='sc'){const s=setupState();if(P.get('checkin'))s.checkin=true;if(P.get('wall'))s.wall=true;save()}})();
// Settings entry
const _vProgress=views.progress;views.progress=function(a){_vProgress(a);V.insertAdjacentHTML('beforeend',`<button class="btn ghost" id="su-open">⚙️ Shortcut setup ${setupState().wall&&setupState().checkin?'✓':''}</button>`);$('#su-open').onclick=()=>{setupState().declined=false;save();openSetup(true)}};
setTimeout(()=>{if(!new URLSearchParams(BOOT_QS).get('src'))openSetup()},400);
