'use strict';
const KEY='wisdom.v1';const $=s=>document.querySelector(s);const V=$('#view');
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const addDays=(ds,n)=>{const d=new Date(ds+'T12:00:00');d.setDate(d.getDate()+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let S=load();
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s)return migrate(Object.assign(def(),s))}catch(e){}return def()}
function migrate(s){const st=s.stats||{};if('business' in st||'stoic' in st){s.stats={wealth:(st.business||0),discipline:(st.stoic||0),wisdom:(st.wisdom||0)}}
 s.inv=(s.inv||[]).filter(id=>itemById(id));for(const k in s.equip){if(!itemById(s.equip[k]))delete s.equip[k]}
 (s.forms||[]).forEach(f=>{if(f.stats&&'business' in f.stats)f.stats={wealth:f.stats.business||0,discipline:f.stats.stoic||0,wisdom:f.stats.wisdom||0}});
 s.custom=(s.custom||[]).map(c=>{if(c.stat==='business')c.stat='wealth';if(c.stat==='stoic')c.stat='discipline';c.cat=c.cat||(c.stat==='wealth'?'Business':'Life');return c});return s}
function def(){return{srs:{},fav:[],saved:[],custom:[],xp:0,streak:0,best:0,lastDay:null,days:{},newPerDay:3,session:null,stats:{wealth:0,discipline:0,wisdom:0},bizShare:0.4,inv:[],equip:{},badges:[],forms:[{r:0,d:null}],tokenWeek:null,actions:[]}}
function save(){if(S._xpSeen==null)S._xpSeen=S.xp;if(S.xp>S._xpSeen){const m=typeof mult==='function'?mult():1;S.xp=S._xpSeen+Math.round((S.xp-S._xpSeen)*m);S.coins=(S.coins||0)+Math.floor((S.xp-S._xpSeen)/2)}S._xpSeen=S.xp;localStorage.setItem(KEY,JSON.stringify(S));renderStats()}
const all=()=>CARDS.concat(S.custom);const byId=id=>all().find(c=>c.id===id);
const level=xp=>Math.floor(Math.sqrt(xp/60))+1;const lvlXp=l=>60*(l-1)*(l-1);
function renderStats(){$('#stats').innerHTML=`🔥 <b>${S.streak}</b> · ${typeof shieldHTML==='function'?shieldHTML():''} · 🪙 <b>${S.coins||0}</b><br>${S.xp} XP`}
// ---- SM-2 ----
function grade(id,g){ // g: 0 Again,1 Hard,2 Good,3 Easy
 const q=[1,3,4,5][g];let c=S.srs[id]||{ef:2.5,n:0,iv:0,lapses:0};
 if(q<3){c.n=0;c.iv=0;c.lapses++;}
 else{if(c.n===0)c.iv=g===3?4:1;else if(c.n===1)c.iv=g===1?3:g===3?8:6;else c.iv=Math.round(c.iv*(g===1?1.2:c.ef*(g===3?1.3:1)));c.n++;}
 c.ef=Math.max(1.3,c.ef+(0.1-(5-q)*(0.08+(5-q)*0.02)));c.due=addDays(today(),c.iv);c.last=today();S.srs[id]=c;
 if(window.PREVIEW)return;const st=statOf(byId(id));S.stats[st]++;if(S.session&&S.session.gains)S.session.gains[st]=(S.session.gains[st]||0)+1;
 const xp=(c.n<=1?10:6)+(g===3?2:0)+(g===0?-3:0);S.xp+=Math.max(2,xp);S.days[today()]=(S.days[today()]||0)+1;
}
function buildSession(){
 const t=today();const due=Object.entries(S.srs).filter(([id,c])=>c.due<=t&&byId(id)).sort((a,b)=>a[1].due<b[1].due?-1:1).slice(0,15).map(x=>x[0]);
 const fresh=pickNew(S.newPerDay);
 return{day:t,queue:fresh.map(id=>({id,isNew:true})).concat(due.map(id=>({id,isNew:false}))),done:0,total:fresh.length+due.length,startXp:S.xp,startRank:curRank(),gains:{},rewarded:false}
}
const weekOf=ds=>Math.floor((dayIndex(new Date(ds+'T12:00:00'))+3)/7);
function badge(t,e){S.badges.push({d:today(),t,e})}
function rewards(){const s=S.session;if(s.rewarded)return;s.rewarded=true;
 const roll=Math.random();let pool=null;if(roll<0.05)pool='epic';else if(roll<0.18)pool='rare';else if(roll<0.40)pool='common';
 if(pool){const opts=ITEMS.filter(i=>i.r===pool);const it=opts[Math.floor(Math.random()*opts.length)];s.drop=it.id;if(!S.inv.includes(it.id)){S.inv.push(it.id);badge('Found: '+it.n,it.e)}else{S.xp+=15;s.dupe=true}}
 const nl=Object.keys(S.srs).length;[25,50,100,250,500,750,1000,CARDS.length].forEach(n=>{if(nl>=n&&!S.badges.some(b=>b.t===n+' cards learned'))badge(n+' cards learned','📚')});
 const r=curRank();if(r>s.startRank&&!S.forms.some(f=>f.r===r)){S.forms.push({r,d:today(),stats:{...S.stats}});badge('Rank: '+rankName(r),'👑');s.rankUp=r}}
function finishDay(){const t=today();if(S.lastDay===t)return;
 if(S.lastDay===addDays(t,-1)){S.streak++;S.multBonus=Math.min(0.5,(S.multBonus||0)+0.02)}
 else{const gap=S.lastDay?Math.round((new Date(t)-new Date(S.lastDay))/864e5)-1:99;
  if(S.streak>0&&gap>=1&&gap<=(S.tokens||0)){S.tokens-=gap;S.streak++;S.multBonus=Math.min(0.5,(S.multBonus||0)+0.02);S.session.mercy=gap;badge(`Streak token${gap>1?'s':''} protected your streak (${gap} missed day${gap>1?'s':''})`,'🛡️')}
  else{if(S.streak>1)S.brokenStreak={v:S.streak,d:t,mb:S.multBonus};S.multBonus=Math.round((S.multBonus||0)/2*100)/100;S.streak=1}}
 questMark('learn');
 [7,30,100,365].forEach(n=>{if(S.streak===n)badge(n+'-day streak','🔥')});S.best=Math.max(S.best,S.streak);S.lastDay=t;S.xp+=20;}
// ---- views ----
const views={hall:vHall,today:()=>vHome(),session:vSession,library:vLibrary,wall:vWall,progress:vProgress,add:vAdd,card:vCard};
function go(v,arg){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));V.innerHTML='';V.className='fade';views[v](arg);scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function favBtns(c){return`<div class="row" style="justify-content:flex-end"><button class="icon ${S.saved.includes(c.id)?'on':''}" data-sv="${c.id}" title="Save">🔖</button><button class="icon ${S.fav.includes(c.id)?'on':''}" data-fv="${c.id}" title="Favourite">♥</button></div>`}
function wireFav(rerender){V.querySelectorAll('[data-sv]').forEach(b=>b.onclick=()=>{tog(S.saved,b.dataset.sv);save();b.classList.toggle('on')});V.querySelectorAll('[data-fv]').forEach(b=>b.onclick=()=>{tog(S.fav,b.dataset.fv);save();b.classList.toggle('on')})}
function tog(a,id){const i=a.indexOf(id);i<0?a.push(id):a.splice(i,1)}
function vSession(){
 if(!S.session||S.session.day!==today()){S.session=buildSession();save()}
 const s=S.session;
 if(!s.queue.length){const done=S.lastDay===today();if(s.total>0&&!s.rewarded){if(!done)finishDay();rewards();save();s.animate=true}
  const qd=QUOTES[(dayIndex(new Date())*17)%QUOTES.length];
  V.innerHTML=`<div class="card center"><div class="src">${s.total?'Session complete':'All caught up'}</div><h2>${s.total?'Well done.':'Nothing due today.'}</h2>
  ${endBlock(s)}<p class="ins">“${esc(qd[0])}”</p><p class="src">${esc(qd[1])}</p>
  <button class="btn ghost" id="more">Learn 3 more cards</button><button class="btn ghost" id="addc">＋ Add your own card</button></div>`;
  $('#more').onclick=()=>{const ids=pickNew(3).filter(id=>!s.queue.some(q=>q.id===id));s.queue=ids.map(id=>({id,isNew:true}));s.total+=ids.length;save();vSession()};
  $('#addc').onclick=()=>go('add');V.insertAdjacentHTML('beforeend',actionsBlock());wireActions();runEnd(s);return}
 const it=s.queue[0];const c=byId(it.id);if(!c){s.queue.shift();save();return vSession()}
 if(s.done===0&&!it.fresh&&V.dataset.shown!==today()){const pend=pendingActions();if(pend.length){V.dataset.shown=today();V.innerHTML='<h2>Yesterday\'s practice</h2><p class="mu">Did you try these? Each one marked done earns +15 XP.</p>'+actionsBlock()+'<button class="btn" id="go">Start session</button>';wireActions();$('#go').onclick=vSession;return}}
 const pct=Math.round(s.done/Math.max(1,s.done+s.queue.length)*100);
 const ivs=[0,1,2,3].map(g=>{const b=JSON.parse(JSON.stringify(S.srs));window.PREVIEW=1;grade(c.id,g);window.PREVIEW=0;const iv=S.srs[c.id].iv;S.srs=b;return iv<1?'<1d':iv+'d'});
 if(it.isNew){
  V.innerHTML=`<div class="bar"><i style="width:${pct}%"></i></div><div class="tag">New insight · ${s.queue.length} left</div>
  <div class="card"><div class="src">${esc(c.author)} — ${esc(c.book)}</div><div class="ins">${esc(c.text)}</div>
  <div class="act"><b>Try this today:</b> ${esc(c.action)}</div>${favBtns(c)}</div>
  <button class="btn" id="next">Got it — test me</button>`;if(!S.firstSeen[c.id])S.firstSeen[c.id]=today();if(!S.actions.some(a=>a.id===c.id&&a.day===today()))S.actions.push({id:c.id,day:today(),done:false});wireFav();
  $('#next').onclick=()=>{it.isNew=false;it.fresh=true;save();vSession()};return}
 V.innerHTML=`<div class="bar"><i style="width:${pct}%"></i></div><div class="tag">${it.fresh?'Recall check':'Review'} · ${s.queue.length} left</div>
 <div class="card"><div class="src">${esc(c.author)} — ${esc(c.book)}</div><div class="q">${esc(c.q)}</div>
 <div id="ansBox"><button class="btn ghost" id="show">Show answer</button></div></div>`;
 $('#show').onclick=()=>{$('#ansBox').innerHTML=`<div class="ans"><div class="ins">${esc(c.a)}</div><p class="mu" style="font-size:14px">${esc(c.text)}</p>
 <div class="act"><b>Try this today:</b> ${esc(c.action)}</div>${favBtns(c)}</div>
 <div class="grades">${['Again','Hard','Good','Easy'].map((n,g)=>`<button class="g${g}" data-g="${g}">${n}<small>${ivs[g]}</small></button>`).join('')}</div>`;wireFav();
  V.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const g=+b.dataset.g;grade(c.id,g);s.queue.shift();s.done++;if(g===0)s.queue.splice(Math.min(3,s.queue.length),0,{id:c.id,isNew:false});save();vSession()})};
}
let LIBCAT='All';
function vLibrary(tab,cat){
 tab=tab||'all';if(cat)LIBCAT=cat;const q=(V.dataset.q||'');
 let list=all();if(LIBCAT!=='All')list=list.filter(c=>(c.cat||'Life')===LIBCAT);if(tab==='fav')list=list.filter(c=>S.fav.includes(c.id));if(tab==='saved')list=list.filter(c=>S.saved.includes(c.id));if(tab==='mine')list=S.custom;if(tab==='learned')list=list.filter(c=>S.srs[c.id]);
 V.innerHTML=`<div class="tabs">${[['all','All'],['fav','♥ Favourites'],['saved','🔖 Saved'],['learned','Learned'],['mine','My cards']].map(([k,n])=>`<button data-t="${k}" class="${k===tab?'on':''}">${n}</button>`).join('')}</div>
 <div class="tabs">${['All','Life','Business'].map(k=>`<button data-c="${k}" class="${k===LIBCAT?'on':''}">${k} ${k==='All'?all().length:all().filter(c=>(c.cat||'Life')===k).length}</button>`).join('')}</div><input id="srch" placeholder="Search author, book, idea…" value="${esc(q)}"><button class="btn ghost" id="addc">＋ Add your own card</button><div id="lst"></div>`;
 const draw=()=>{const t=$('#srch').value.toLowerCase();$('#lst').innerHTML=list.filter(c=>(c.author+c.book+c.text).toLowerCase().includes(t)).map(c=>`<div class="li" data-id="${c.id}"><div class="src" style="margin:0 0 4px">${esc(c.author)} · ${esc(c.book)}</div><div class="t">${esc(c.text)}</div></div>`).join('')||'<p class="mu">Nothing here yet.</p>';
  V.querySelectorAll('.li').forEach(e=>e.onclick=()=>go('card',e.dataset.id))};
 $('#srch').oninput=draw;draw();V.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>vLibrary(b.dataset.t));V.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>vLibrary(tab,b.dataset.c));$('#addc').onclick=()=>go('add');
}
function vCard(id){const c=byId(id);const r=S.srs[id];
 V.innerHTML=`<button class="icon" id="back">‹ Library</button><div class="card"><div class="src">${esc(c.author)} — ${esc(c.book)}</div><div class="ins">${esc(c.text)}</div>
 <div class="ans"><div class="q">${esc(c.q)}</div><div class="mu">${esc(c.a)}</div></div><div class="act"><b>Try this today:</b> ${esc(c.action)}</div>${favBtns(c)}
 <p class="tag">${c.cat||'Life'} · ${STAT_NAME[statOf(c)]} · ${r?`Next review ${r.due} · interval ${r.iv}d · ease ${r.ef.toFixed(2)}`:'Not learned yet'}</p></div>
 ${r?'':'<button class="btn" id="learn">Add to today\'s session</button>'}${c.custom?'<button class="btn ghost" id="del">Delete my card</button>':''}`;
 wireFav();$('#back').onclick=()=>go('library');
 if($('#learn'))$('#learn').onclick=()=>{if(!S.session||S.session.day!==today())S.session=buildSession();S.session.queue.unshift({id,isNew:true});S.session.total++;save();go('today')};
 if($('#del'))$('#del').onclick=()=>{if(confirm('Delete this card?')){S.custom=S.custom.filter(x=>x.id!==id);delete S.srs[id];save();go('library','mine')}};
}
function vAdd(){V.innerHTML=`<h2>Add your own card</h2><label>Insight (2–4 sentences)</label><textarea id="t" rows="4"></textarea>
 <label>Author</label><input id="au"><label>Book</label><input id="bk"><label>Recall question</label><input id="q"><label>Answer</label><input id="a">
 <label>Try this today</label><input id="ac"><label>Stat it trains</label><select id="stt"><option value="wisdom">Wisdom (Life)</option><option value="discipline">Discipline (Life)</option><option value="wealth">Wealth (Business)</option></select><button class="btn" id="sv">Save card</button>`;
 $('#sv').onclick=()=>{const g=k=>$('#'+k).value.trim();if(!g('t')||!g('q')){alert('Insight and question are required.');return}
  S.custom.push({id:'u'+Date.now(),custom:true,text:g('t'),author:g('au')||'Me',book:g('bk')||'Personal notes',q:g('q'),a:g('a')||g('t'),action:g('ac')||'Reflect on this once today.',stat:$('#stt').value,cat:$('#stt').value==='wealth'?'Business':'Life'});save();go('library','mine')}}
function vProgress(){const learned=Object.keys(S.srs).length,tot=all().length,l=level(S.xp);const t=today();
 const mature=Object.values(S.srs).filter(c=>c.iv>=21).length,due=Object.values(S.srs).filter(c=>c.due<=t).length;
 const lp=Math.round((S.xp-lvlXp(l))/(lvlXp(l+1)-lvlXp(l))*100);let heat='';for(let i=89;i>=0;i--){const n=S.days[addDays(t,-i)]||0;heat+=`<i class="${n?n<4?'l1':n<9?'l2':'l3':''}" title="${addDays(t,-i)}: ${n}"></i>`}
 const authors={};Object.keys(S.srs).forEach(id=>{const c=byId(id);if(c)authors[c.author]=(authors[c.author]||0)+1});
 V.innerHTML=`<h2>Progress</h2><div class="card"><div class="src">Level ${l}</div><div class="bar"><i style="width:${lp}%"></i></div><div class="tag">${S.xp} XP · ${lvlXp(l+1)-S.xp} XP to level ${l+1}</div></div>
 <div class="grid"><div class="stat"><b>🔥 ${S.streak}</b>Current streak</div><div class="stat"><b>${S.best}</b>Best streak</div>
 <div class="stat"><b>${learned}/${tot}</b>Cards learned</div><div class="stat"><b>${mature}</b>Mastered (21d+)</div>
 <div class="stat"><b>${due}</b>Due today</div><div class="stat"><b>${S.fav.length}</b>Favourites</div></div>
 <h3>Last 90 days</h3><div class="heat">${heat}</div>
 <h3>Authors studied</h3>${Object.entries(authors).sort((a,b)=>b[1]-a[1]).map(([a,n])=>`<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:6px 0"><span>${esc(a)}</span><span class="mu">${n}</span></div>`).join('')||'<p class="mu">Start your first session.</p>'}
 <h3>Settings</h3><label>New cards per day</label><select id="npd">${[1,2,3,4,5,7,10].map(n=>`<option ${n==S.newPerDay?'selected':''}>${n}</option>`).join('')}</select>
 <label>Daily mix (share of new cards from business books)</label><select id="mix">${[[0,'All Life'],[0.33,'Mostly Life (1 in 3 business)'],[0.4,'Balanced (≈40% business)'],[0.67,'Mostly Business (2 in 3)'],[1,'All Business']].map(([v,n])=>`<option value="${v}" ${Math.abs(v-S.bizShare)<0.01?'selected':''}>${n}</option>`).join('')}</select>
 <button class="btn ghost" id="exp">Export backup</button><button class="btn ghost" id="imp">Import backup</button><button class="btn ghost" id="rst">Reset all progress</button>`;
 $('#npd').onchange=e=>{S.newPerDay=+e.target.value;S.session=null;save()};$('#mix').onchange=e=>{S.bizShare=+e.target.value;S.session=null;save()};
 $('#exp').onclick=()=>{const b=new Blob([JSON.stringify({state:S,face:FACE,photos:JSON.parse(localStorage.getItem('wisdom.photos')||'[]'),v:5})],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='wisdom-backup-'+t+'.json';a.click()};
 $('#imp').onclick=()=>{const i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=async()=>{try{const J=JSON.parse(await i.files[0].text());S=migrate(Object.assign(def(),J.state||J));if(J.face)setFace(J.face);if(J.photos)localStorage.setItem('wisdom.photos',JSON.stringify(J.photos));ensure();save();go('progress')}catch(e){alert('Invalid file')}};i.click()};
 $('#rst').onclick=()=>{if(confirm('Erase all progress?')){S=def();save();go('today')}};
}
function vWall(){const base=location.href.replace(/[#?].*$/,'').replace(/index\.html$/,'');const url=base+'wallpaper/today.png';
 V.innerHTML=`<h2>Daily lock-screen wallpaper</h2><p class="mu">“The dream” — a new aspirational scene and quote every day (365 quotes × 30 scenes), sized for iPhone (1179×2556). <a href="dream/CREDITS.md" style="color:var(--gold)">Image credits</a></p>
 <canvas class="wp" id="wp"></canvas><button class="btn" id="dl">Save today's wallpaper</button>
 <h3>Automatic: iOS Shortcut</h3><p>Stable URL (updated every day):<br><code>${esc(url)}</code></p><p class="mu" style="font-size:14px">Dated files also exist: <code>${esc(base)}wallpaper/YYYY-MM-DD.png</code></p>
 <ol class="steps"><li>Open the <b>Shortcuts</b> app → <b>Automation</b> tab → <b>+</b> (New Automation).</li>
 <li>Choose <b>Time of Day</b>, set e.g. <b>06:30</b>, <b>Daily</b>, and select <b>Run Immediately</b> (turn off “Notify When Run”). Tap Next.</li>
 <li>Tap <b>New Blank Automation</b>. Add action <b>URL</b> and paste the URL above.</li>
 <li>Add action <b>Get Contents of URL</b> (it uses the URL automatically).</li>
 <li>Add action <b>Set Wallpaper</b> (called “Set Wallpaper Photo” on iOS 17/18). Input: <i>Contents of URL</i>. Tap the arrow and choose <b>Lock Screen</b>; turn off <b>Show Preview</b> and turn off <b>Crop to Subject</b>/<b>Legibility Blur</b> if offered.</li>
 <li>Tap <b>Done</b>. Test it once with the ▶ button.</li></ol>
 <p class="mu" style="font-size:14px">Tip: on the Lock Screen, long-press → Customize to make sure the current lock screen is a <i>Photo</i> wallpaper; Set Wallpaper replaces that one. If you prefer only the dated file, insert <b>Current Date</b> → <b>Format Date</b> (Custom: <code>yyyy-MM-dd</code>) and build the URL <code>${esc(base)}wallpaper/[Formatted Date].png</code>.</p>`;
 const cv=$('#wp');drawWallpaper(cv,new Date());
 $('#dl').onclick=()=>cv.toBlob(async b=>{const f=new File([b],'wisdom-'+today()+'.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return}catch(e){}}
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=f.name;a.click()},'image/png');
}


// ---- avatar feel ----
function pendingActions(){const t=today(),y=addDays(t,-1);S.actions=S.actions.filter(a=>a.day>=addDays(t,-2));return S.actions.filter(a=>!a.done&&(a.day===t||a.day===y)&&byId(a.id))}
function actionsBlock(){const p=pendingActions();if(!p.length)return'';return'<h3>Try-this-today check-in</h3>'+p.map(a=>{const c=byId(a.id);return`<div class="card" style="padding:16px"><div class="src">${esc(c.author)}${a.day!==today()?' · yesterday':''}</div><div>${esc(c.action)}</div><button class="btn ghost" data-ad="${a.id}|${a.day}">✓ I did it  +15 XP</button></div>`}).join('')}
function wireActions(){V.querySelectorAll('[data-ad]').forEach(b=>b.onclick=()=>{const[id,d]=b.dataset.ad.split('|');const a=S.actions.find(x=>x.id===id&&x.day===d);if(a&&!a.done){a.done=true;S.xp+=15;S.stats[statOf(byId(id))]++;S.days[today()]=(S.days[today()]||0)+1;
 const n=S.actions.filter(x=>x.done).length;if([1,10,50].includes(n))badge(n+' practices completed','✅');const r=curRank();if(!S.forms.some(f=>f.r===r)){S.forms.push({r,d:today(),stats:{...S.stats}});badge('Rank: '+rankName(r),'👑');save();rankOverlay(r)}save()}
 b.outerHTML='<p class="tag" style="color:var(--gold)">✓ Done · +15 XP</p>'})}
function endBlock(s){const r=curRank(),nx=RANKS[r+1];const g=s.gains||{};
 return`<div style="margin:6px 0 14px">${avatarSVG(r,S.stats,S.equip,150)}</div><div class="src">${rankName(r)}</div>
 <div class="bar" style="height:8px"><i id="xpb" style="width:0"></i></div><div class="tag" id="xpt">${S.xp} XP${nx?' · '+(nx.xp-S.xp)+' to '+nx.n:''}</div>
 <div id="ticks" style="margin:12px 0;min-height:26px">${Object.entries(g).filter(x=>x[1]).map(([k,v])=>`<span class="tick">+${v} ${STAT_NAME[k]}</span>`).join('')}${s.mercy?'<span class="tick">🛡️ Streak token used</span>':''}</div>
 <p class="mu">🔥 ${S.streak}-day streak· ${shieldHTML()}</p>
 ${s.drop?`<div class="drop">${itemById(s.drop).e}<div><b>${s.dupe?'Duplicate':'Reward drop!'}</b><br><span class="mu">${itemById(s.drop).n} · ${itemById(s.drop).r}${s.dupe?' · +15 XP':''}</span></div></div>`:''}`}
function runEnd(s){const r=curRank(),lo=RANKS[r].xp,hi=(RANKS[r+1]||{xp:S.xp+1}).xp;const pct=x=>Math.max(0,Math.min(100,(x-lo)/(hi-lo)*100));
 const b=$('#xpb');if(!b)return;const anim=s.animate;b.style.transition='none';b.style.width=(anim?pct(Math.max(lo,s.startXp)):pct(S.xp))+'%';
 if(anim){s.animate=false;requestAnimationFrame(()=>setTimeout(()=>{b.style.transition='width 1.4s cubic-bezier(.2,.8,.2,1)';b.style.width=pct(S.xp)+'%'},150));
  V.querySelectorAll('.tick').forEach((t,i)=>{t.style.animationDelay=(0.9+i*0.35)+'s'});if(s.rankUp!=null&&!s.rankShown){s.rankShown=true;save();setTimeout(()=>rankOverlay(s.rankUp),1900)}}}
function rankOverlay(r){const prev=Math.max(0,r-1);const o=document.createElement('div');o.className='rankup';const q=RANKS[r].q;
 o.innerHTML=`<div class="rk-bg"></div><div class="rk-in"><div class="src">Rank up</div><div class="rk-av"><div class="rk-old">${avatarSVG(prev,S.stats,S.equip,230)}</div><div class="rk-new">${avatarSVG(r,S.stats,S.equip,230)}</div></div>
 <h2 style="font-size:34px;margin:18px 0 6px">${rankName(r)}</h2><p class="ins" style="max-width:300px;margin:auto">“${esc(q[0])}”</p><p class="src" style="margin-top:8px">${esc(q[1])}</p><button class="btn" style="max-width:280px">Continue</button></div>`;
 document.body.appendChild(o);o.querySelector('button').onclick=()=>o.remove()}
function vHall(){const r=curRank();const owned=ITEMS.filter(i=>S.inv.includes(i.id));
 V.innerHTML=`<h2>The Hall</h2><div class="card center">${avatarSVG(r,S.stats,S.equip,220)}<div class="src" style="margin-top:12px">${rankName(r)} · ${dominant(S.stats)==='balanced'?'Balanced':STAT_NAME[dominant(S.stats)]+'-led'} · physique ${Math.round(physique(r,S.stats)*100)}%</div>
 <div class="grid" style="grid-template-columns:repeat(3,1fr)">${Object.keys(STAT_NAME).map(k=>`<div class="stat"><b>${S.stats[k]}</b>${STAT_NAME[k]}</div>`).join('')}</div>
 <p class="tag">Rank sets your outfit and posture (hoodie → workwear → blazer → tailored suit → Legend). Training gains broaden your build; skipped weigh-ins make it look tired.</p></div>
 <h3>Past forms</h3><div class="forms">${S.forms.map(f=>`<div class="center">${avatarSVG(f.r,f.stats||{wisdom:0,business:0,stoic:0},{},96)}<div class="tag">${rankName(f.r)}<br>${f.d||'start'}</div></div>`).join('')}${RANKS.slice(Math.max(...S.forms.map(f=>f.r))+1,Math.max(...S.forms.map(f=>f.r))+2).map(x=>`<div class="center" style="opacity:.35"><div style="width:96px;height:96px;border:1px dashed var(--line);border-radius:20px;margin:auto;display:grid;place-items:center">?</div><div class="tag">${x.n}<br>${x.xp} XP</div></div>`).join('')}</div>
 <h3>Collection (${owned.length}/${ITEMS.length})</h3><p class="tag">Watches, cars, suits, homes and boats drop at random after sessions. Tap to equip (one per slot).</p><div class="items">${ITEMS.map(i=>{const has=S.inv.includes(i.id),on=S.equip[slotOf(i)]===i.id;return`<button class="it ${has?'':'locked'} ${on?'on':''}" data-it="${i.id}" ${has?'':'disabled'}>${has?i.e:'?'}<small>${has?i.n:i.r}</small></button>`}).join('')}</div>
 <h3>Badges timeline</h3>${S.badges.slice().reverse().map(b=>`<div class="li row"><span style="font-size:22px">${b.e}</span><div><div>${esc(b.t)}</div><div class="tag">${b.d}</div></div></div>`).join('')||'<p class="mu">Complete a session to earn your first badge.</p>'}`;
 V.querySelectorAll('[data-it]').forEach(b=>b.onclick=()=>{const it=itemById(b.dataset.it),sl=slotOf(it);S.equip[sl]=S.equip[sl]===it.id?undefined:it.id;save();vHall()})}

function pickNew(n){const out=S.custom.filter(c=>!S.srs[c.id]).slice(0,n).map(c=>c.id);
 const left=n-out.length;const nb=Math.round(left*S.bizShare);const want={Business:nb,Life:left-nb};const seed=Math.floor(Date.now()/864e5)*7;
 for(const cat of ['Business','Life']){const pool=CARDS.filter(c=>c.cat===cat&&!S.srs[c.id]&&!out.includes(c.id));let i=seed%Math.max(1,pool.length),k=0;
  while(k<want[cat]&&k<pool.length){const c=pool[i%pool.length];if(!out.includes(c.id)){out.push(c.id);k++}i+=13}}
 if(out.length<n){CARDS.filter(c=>!S.srs[c.id]&&!out.includes(c.id)).slice(0,n-out.length).forEach(c=>out.push(c.id))}
 return out}
