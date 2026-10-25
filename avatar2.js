'use strict';
// ===== Illustrated avatar: one pre-rendered character per look stage (avatar/t0..t8.webp) =====
// Tier -> outfit/posture via RANKS[r].look. Current body (gains/fat/softness) nudges width & tone. Selfie = separate portrait badge.
function avatarSVG(rank,stats,equip,size,opts){equip=equip||{};size=size||220;rank=Math.max(0,Math.min(RANKS.length-1,rank|0));
 const lk=Math.max(0,Math.min(8,RANKS[rank].look|0)),cur=rank===curRank()&&stats===S.stats;
 const bt=cur?bodyType():'n';let flt=bt==='s'?'filter:saturate(.85) brightness(.95);':bt==='a'?'filter:brightness(1.07) saturate(1.08);':bt==='o'||bt==='w'?'filter:saturate(.8) brightness(.92);':'';if(cur){const sf=Math.min(1,weighOverdue(today())/14);if(sf>0)flt=`filter:saturate(${(1-0.35*sf).toFixed(2)}) brightness(${(1-0.15*sf).toFixed(2)});`}
 const w=Math.round(size*0.8),h=Math.round(size*1.07);
 const items=cur?['watch','car','home','boat'].map(k=>itemById(equip[k])).filter(Boolean):[];
 const face='';
 return `<div class="av" style="width:${w}px;height:${h}px;${lk>=7?'--glow:.22':''}"><img src="avatar/t${lk}${bt==='n'?'':'_'+bt}.webp" alt="${esc(RANKS[rank].n)}" loading="lazy" style="transform:scale(1.12);${flt}">${face}${items.length?`<div class="av-items">${items.map(i=>`<span title="${esc(i.n)}">${i.e}</span>`).join('')}</div>`:''}</div>`}
// Selfie: keep a soft, tone-matched circular crop instead of pasting onto the body
function stylizeFace(img){const N=256,cv=document.createElement('canvas');cv.width=cv.height=N;const x=cv.getContext('2d');const s=Math.min(img.width,img.height);
 x.filter='grayscale(.25) sepia(.18) contrast(1.05) brightness(.97)';x.drawImage(img,(img.width-s)/2,(img.height-s)/2.4,s,s,0,0,N,N);x.filter='none';
 const g=x.createRadialGradient(N/2,N/2,N*.3,N/2,N/2,N*.55);g.addColorStop(0,'rgba(14,14,17,0)');g.addColorStop(1,'rgba(14,14,17,.55)');x.fillStyle=g;x.fillRect(0,0,N,N);return cv.toDataURL('image/jpeg',.85)}

// Body type: o=obese, w=overweight, s=soft, n=normal, a=athletic. Body fat % wins if logged; else BMI. Athletic needs training gains (>=20 of 40).
const BODY_NAMES={o:'Obese',w:'Overweight',s:'Soft',n:'Normal',a:'Athletic'};
function trained14(){const t=today(),from=addDays(t,-14),B=S.body;return (B.workouts||[]).some(w=>w.d>=from)||Object.keys(B.restDays||{}).some(d=>d>=from&&false)||Object.entries(((S.chal||{}).days)||{}).some(([d,e])=>d>=from&&e.ok)}
function bodyInfo(){ensure();const B=S.body,lw=lastWeigh(),kg=lw?lw.kg:B.baseKg,h=B.height/100,bmi=kg/(h*h),bf=lastBF(),gains=B.gains||0,fit=gains>=20,soft0=trained14()?26:25;
 let bt;if(bf!=null)bt=bf>=30?'o':bf>=25?'w':bf>=20?'s':(bf<13&&fit)?'a':'n';
 else bt=bmi>=32?'o':bmi>=28?'w':bmi>=soft0?(fit?'n':'s'):(bmi>=20&&fit)?'a':'n';
 return{bt,kg,h,bmi,bf,gains,fit,soft0}}
// Body type: o=obese, w=overweight, s=soft, n=normal, a=athletic. Body fat % wins if logged; else BMI fallback (soft starts at 26 if trained in last 14 days). Athletic needs training gains >=20/40.
function bodyType(){try{return bodyInfo().bt}catch(e){return'n'}}
function bodyStatus(){const I=bodyInfo(),N=BODY_NAMES,kgAt=b=>b*I.h*I.h,d=x=>Math.abs(x).toFixed(1)+' kg',g=`training gains ${Math.floor(I.gains)}/20`;let drv,next,worse;
 if(I.bf!=null){drv=`body fat ${I.bf}%`;const nx={o:['Overweight','<30%'],w:['Soft','<25%'],s:['Normal','<20%']}[I.bt];
  next=nx?`${nx[0]} at ${nx[1]} body fat`:I.bt==='n'?(I.bf<13?`Athletic: need ${g}`:`Athletic at <13% body fat + ${g}`):'Top build — keep it';
  worse=I.bt==='o'?'':I.bt==='a'?'Stop training and gains fade → Normal':`${{w:'Obese at ≥30%',s:'Overweight at ≥25%',n:'Soft at ≥20%'}[I.bt]} body fat`}
 else{drv=`BMI ${I.bmi.toFixed(1)} (${I.kg} kg)`;const lim={o:32,w:28,s:I.soft0}[I.bt];
  next=I.bt==='o'?`Overweight below BMI 32 (−${d(I.kg-kgAt(32))})`:I.bt==='w'?`Soft below BMI 28 (−${d(I.kg-kgAt(28))})`:I.bt==='s'?`Normal below BMI ${I.soft0} (−${d(I.kg-kgAt(I.soft0))}) or reach ${g}`:I.bt==='n'?(I.bmi<20?'Athletic: build up to BMI 20+ with training':`Athletic: ${g}`):'Top build — keep training';
  worse=I.bt==='o'?'':I.bt==='a'?'Stop training and gains fade → Normal':I.bt==='n'?(I.bmi<I.soft0?`Soft at BMI ${I.soft0}+ (+${d(kgAt(I.soft0)-I.kg)})`:'Lose training gains → Soft'):`${{w:'Obese',s:'Overweight'}[I.bt]} at BMI ${{w:32,s:28}[I.bt]}+ (+${d(kgAt({w:32,s:28}[I.bt])-I.kg)})`}
 const tip=I.bf==null?'BMI is only a fallback — log waist + neck at a weigh-in for body-fat %, which always wins.':'';
 return{bt:I.bt,name:N[I.bt],drv,next,worse,tip,soft0:I.soft0}}
function bodyStatusHTML(full){const s=bodyStatus();return full?`<div class="card" style="padding:12px 14px"><b>Build: ${s.name}</b> <span class="tag">· from ${esc(s.drv)}</span><div class="tag" style="margin-top:6px">▲ Next: ${esc(s.next)}</div>${s.worse?`<div class="tag">▼ Watch: ${esc(s.worse)}</div>`:''}${s.tip?`<div class="tag" style="margin-top:4px">ℹ️ ${esc(s.tip)}</div>`:''}</div>`
 :`<div class="tag center" id="bstat" style="margin:4px 0 2px">Build: <b style="color:var(--tx)">${s.name}</b> · ${esc(s.drv)} · ▲ ${esc(s.next)}</div>`}
