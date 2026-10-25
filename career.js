'use strict';
// ===== Cosmetic career tracks. Tier/XP/stats/gating come from RANKS; this only changes titles, props, accents, interviewer lines. =====
// Each tier: [main title, alternate title, prop]
const TRACKS={
 build:{n:'Builder / Trades',e:'🏗️',col:'#f2c230',who:'Site boss',tiers:[
  ['Unemployed','Unemployed',''],['Dishwasher','Kitchen Porter','apron'],['Labourer','Yard Hand','vest'],['Hod Carrier','Groundworker','helmet'],['Construction Worker','Scaffolder','helmet'],['Machine Operator','Dumper Driver','helmet'],['Excavator Operator','Crane Operator','helmet'],['Foreman','Lead Hand','helmet'],['Site Manager','Project Lead','tablet'],['Groundwork Company Owner','Contractor','tablet'],['Construction Boss','Civil Works MD',''],['Property Developer','Land Investor',''],['Infrastructure Tycoon','Real-Estate Baron',''],['Building Mogul','Empire Builder',''],['Legend of the Trade','Master Builder','laurel']]},
 biz:{n:'Business / Sales',e:'🤝',col:'#e05a5a',who:'Sales director',tiers:[
  ['Unemployed','Unemployed',''],['Burger Flipper','Cashier','cap'],['Shift Lead','Barista Lead','cap'],['Retail Assistant','Call-Centre Agent',''],['Sales Rep','Door-to-Door Seller','tablet'],['Senior Sales Rep','Inside Sales Lead','tablet'],['Account Manager','Key Account Rep','tablet'],['Sales Manager','Team Lead','tablet'],['Sales Director','Head of Growth','tablet'],['Agency Owner','Franchise Owner',''],['CEO','Managing Partner',''],['Angel Investor','Brand Builder',''],['Business Tycoon','Serial Founder',''],['Media Mogul','Retail Mogul',''],['Legend of Business','Icon','laurel']]},
 money:{n:'Money / Finance',e:'📈',col:'#5ac08a',who:'Finance partner',tiers:[
  ['Unemployed','Unemployed',''],['Cleaner','Night Cleaner','mop'],['Warehouse Clerk','Stock Counter','vest'],['Office Junior','Cash Handler',''],['Bookkeeper','Payroll Clerk','tablet'],['Accountant','Credit Officer','tablet'],['Analyst','Controller','tablet'],['Senior Analyst','Finance Manager','tablet'],['Portfolio Manager','CFO','tablet'],['Advisory Firm Owner','Fund Founder',''],['Fund Manager','Partner',''],['Investor','Private Banker',''],['Finance Tycoon','Hedge Fund Boss',''],['Investment Mogul','Family Office Head',''],['Legend of Finance','Oracle','laurel']]}};
const TRACK_ORDER=['build','biz','money'];
function career(){if(typeof S==='undefined')return{path:[]};S.career=S.career||{path:[]};
 if(!S.career.migrated){S.career.migrated=1;const r=S.rank||0;for(let t=1;t<=r;t++)if(!S.career.path.some(p=>p.tier===t)){const f=(S.forms||[]).find(f=>f.r===t);S.career.path.push({tier:t,track:'build',title:TRACKS.build.tiers[t][0],d:f&&f.d||null,auto:1})}}
 return S.career}
function careerAt(tier){return career().path.find(p=>p.tier===tier)||null}
function rankName(r){const c=careerAt(r);return c?c.title:RANKS[r].n}
function rankLabel(r){return`${rankName(r)} · Tier ${r}`}
function lastTrack(){const p=career().path;return p.length?p[p.length-1].track:null}
// 3 options for a tier: 2 from the current track (main + alternate) + 1 from a neighbouring track; first choice offers one per track
function jobOptions(tier){const lt=lastTrack();const T=k=>TRACKS[k].tiers[Math.min(tier,14)];
 if(!lt||tier<=1)return TRACK_ORDER.map(k=>({track:k,title:T(k)[0],acc:T(k)[2]}));
 const i=TRACK_ORDER.indexOf(lt),nb=TRACK_ORDER[(i+(tier%2?1:2))%3];
 return[{track:lt,title:T(lt)[0],acc:T(lt)[2]},{track:lt,title:T(lt)[1],acc:T(lt)[2]},{track:nb,title:T(nb)[0],acc:T(nb)[2],switch:1}]}
function interviewerLine(tier,job){const T=TRACKS[job.track];const base=(RANKS[tier].iv||'').replace(/^[^:]+:\s*/,'');return`${T.who}: "So you want to be ${/^[AEIOU]/.test(job.title)?"an":"a"} ${job.title}." ${base}`}
function recordJob(tier,job){const c=career();c.path=c.path.filter(p=>p.tier!==tier);c.path.push({tier,track:job.track,title:job.title,acc:job.acc,d:today()});c.path.sort((a,b)=>a.tier-b.tier)}
function careerTimeline(){const p=career().path;if(!p.length)return'<p class="tag">Pass your first interview to start your career path.</p>';
 return`<div class="timeline">${p.map(x=>`<div class="tl"><i style="background:${TRACKS[x.track].col}"></i><div><b>${esc(x.title)}</b><div class="tag">Tier ${x.tier} · ${TRACKS[x.track].e} ${TRACKS[x.track].n}${x.d?' · '+x.d:''}</div></div></div>`).join('')}</div>`}
