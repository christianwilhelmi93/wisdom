'use strict';
// ===== Daily bodyweight challenge (Home card) =====
const CHALS=[
 {id:'push',n:'Push-ups',u:'reps',b:60,st:[10,25],tip:'Hands under shoulders, body in one straight line, chest to fist-height.'},
 {id:'squat',n:'Squats',u:'reps',b:100,st:[10,25],tip:'Feet shoulder-width, sit back, knees track over toes, heels down.'},
 {id:'steps',n:'Steps',u:'steps',b:8000,st:[1000,2500],tip:'Split it: a 15-min walk after each meal covers most of it.'},
 {id:'plank',n:'Plank (total)',u:'sec',b:120,st:[30,60],tip:'Elbows under shoulders, squeeze glutes, don\'t let hips sag.'},
 {id:'lunge',n:'Lunges',u:'reps',b:60,st:[10,20],tip:'Long step, back knee nearly touches the floor, torso upright.'},
 {id:'burpee',n:'Burpees',u:'reps',b:30,st:[5,10],tip:'Chest to floor, jump with arms overhead. Quality over speed.'},
 {id:'wall',n:'Wall sit (total)',u:'sec',b:120,st:[30,60],tip:'Back flat on the wall, thighs parallel, knees over ankles.'},
 {id:'situp',n:'Sit-ups / crunches',u:'reps',b:80,st:[10,25],tip:'Exhale on the way up, don\'t pull on your neck.'},
 {id:'dips',n:'Chair dips',u:'reps',b:50,st:[10,20],tip:'Sturdy chair, elbows straight back, lower to 90°.'},
 {id:'jj',n:'Jumping jacks',u:'reps',b:150,st:[25,50],tip:'Stay light on the balls of your feet, steady rhythm.'}];
const fmtU=(v,u)=>u==='sec'?(v>=60?Math.floor(v/60)+'m'+(v%60?' '+v%60+'s':''):v+'s'):u==='steps'?v.toLocaleString('en'):v;
function chalState(){const C=S.chal=S.chal||{};C.days=C.days||{};C.streak=C.streak||0;C.best=C.best||0;C.last=C.last||null;return C}
function hashStr(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function chalFor(d){// deterministic weekly shuffle: 7 distinct picks per ISO week
 const mon=addDays(d,-((new Date(d+'T00:00').getDay()+6)%7)),idx=CHALS.map((c,i)=>i);let h=hashStr('chal'+mon);
 for(let i=idx.length-1;i>0;i--){h=Math.imul(h^(h>>>15),2246822507)>>>0;const j=h%(i+1);[idx[i],idx[j]]=[idx[j],idx[i]]}
 return CHALS[idx[(new Date(d+'T00:00').getDay()+6)%7]]}
function chalToday(){const C=chalState(),t=today();let e=C.days[t];
 if(!e){const c=chalFor(t),scale=1+Math.min(0.6,curRank()*0.03+Math.min(30,C.streak)*0.01),r=c.u==='steps'?500:c.u==='sec'?15:5;
  e=C.days[t]={id:c.id,target:Math.round(c.b*scale/r)*r,done:0,ok:false}}
 return{e,c:CHALS.find(x=>x.id===e.id)||CHALS[0]}}
function chalAdd(n){const C=chalState(),{e}=chalToday();if(e.ok)return;e.done=Math.max(0,Math.min(e.target,e.done+n));if(e.done>=e.target)chalComplete();save()}
function chalComplete(){const C=chalState(),t=today(),{e}=chalToday();if(e.ok)return;e.done=e.target;e.ok=true;
 C.streak=C.last===addDays(t,-1)?C.streak+1:1;C.last=t;C.best=Math.max(C.best,C.streak);
 kickXP(20);S.stats.body=(S.stats.body||0)+1;S.body.gains=Math.min(60,(S.body.gains||0)+0.5);if(typeof questMark==='function')questMark('train');badgeOnce('chal-first','First daily challenge','🏅')}
function chalCard(){const C=chalState(),{e,c}=chalToday(),p=Math.round(e.done/e.target*100);
 return `<div class="card" id="chal" style="padding:12px 14px;margin:8px 0">
 <div class="row" style="justify-content:space-between"><b>💪 Today: ${fmtU(e.target,c.u)} ${esc(c.n)}</b><span class="tag">${C.streak?'🔥'+C.streak:''} ${e.ok?'✓ +20 XP':'+20 XP'}</span></div>
 <div class="bar" style="height:7px;margin:7px 0 4px"><i style="width:${p}%"></i></div>
 <div class="row" style="justify-content:space-between"><span class="tag">${fmtU(e.done,c.u)} / ${fmtU(e.target,c.u)}</span>
 ${e.ok?'<span class="tag" style="color:var(--gold)">Done today</span>':`<span class="row" style="gap:5px">${c.st.map(s=>`<button class="icon" data-ca="${s}" style="border:1px solid var(--line);border-radius:8px;padding:3px 8px;font-size:13px">+${fmtU(s,c.u)}</button>`).join('')}<button class="icon" id="caDone" style="border:1px solid var(--gold);color:var(--gold);border-radius:8px;padding:3px 8px;font-size:13px">Done</button></span>`}</div>
 <div class="tag" style="margin-top:4px">${esc(c.tip)} Split it across the day.</div></div>`}
const _vHomeC=views.today;views.today=function(){_vHomeC();const st=V.querySelector('.quests3')||$('#start');if(st)st.insertAdjacentHTML(st.id==='start'?'beforebegin':'afterend',chalCard());else V.insertAdjacentHTML('beforeend',chalCard());
 V.querySelectorAll('[data-ca]').forEach(b=>b.onclick=()=>{chalAdd(+b.dataset.ca);go('today')});if($('#caDone'))$('#caDone').onclick=()=>{if(confirm('Mark today\'s challenge as complete?')){chalComplete();save();go('today')}}};
{const b=document.querySelector('nav button.on');if(b&&b.dataset.v==='today')go('today')}
