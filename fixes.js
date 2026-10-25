'use strict';
// ===== One-time migration: remove XP/coins/Body from repeated weigh-ins (pre-fix exploit) =====
(function(){try{ensure();if(S.fixWeigh1)return;const B=S.body,W=B.weights||[];
 const weeks=new Set(W.map(w=>weekOf(w.d)));B.weighXp=B.weighXp||{};weeks.forEach(k=>B.weighXp[k]=1);
 // Body stat is a reliable counter: +2 per weigh-in reward, +2 per workout, +1 per food-target day, +1 per daily challenge.
 const other=2*(B.workouts||[]).length+Object.keys(B.foodHit||{}).length+Object.values((S.chal||{}).days||{}).filter(e=>e.ok).length;
 const rewarded=Math.max(W.length,Math.floor(((S.stats.body||0)-other)/2)),excess=Math.max(0,rewarded-weeks.size);
 // seed per-day workout reward markers so old workouts aren't double counted later
 B.woXp=B.woXp||{};(B.workouts||[]).forEach(w=>B.woXp[w.d]=1);
 let removed=0;if(excess>0){removed=Math.min(S.xp,Math.round(excess*30*mult()));S.xp-=removed;S._xpSeen=S.xp;S.coins=Math.max(0,(S.coins||0)-Math.floor(removed/2));S.stats.body=Math.max(0,S.stats.body-2*excess)}
 S.fixWeigh1={d:today(),excess,removed};localStorage.setItem(KEY,JSON.stringify(S));
 if(removed)setTimeout(()=>{toast(`Fixed: removed ${removed} XP from repeated weigh-ins`);renderStats();const b=document.querySelector('nav button.on');if(b&&b.dataset.v==='today')go('today')},900)}catch(e){console.warn('fixWeigh1',e)}})();
// ===== Build status feedback (Home compact, Body→Weight and Hall full) =====
{const _h=views.today;views.today=function(){_h();const a=V.querySelector('.hrank')||V.querySelector('.hav');if(a)a.insertAdjacentHTML('afterend',bodyStatusHTML(false))};
 const _b=vBody;vBody=function(tab){_b(tab);if(tab==='weight'&&$('#bv'))$('#bv').insertAdjacentHTML('afterbegin',bodyStatusHTML(true))};views.body=vBody;
 const _hl=views.hall;views.hall=function(){_hl();const c=V.querySelector('.card');if(c)c.insertAdjacentHTML('afterend',bodyStatusHTML(true))};
 const b=document.querySelector('nav button.on');if(b&&b.dataset.v==='today')go('today')}
