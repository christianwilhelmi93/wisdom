'use strict';
// ===== Illustrated avatar: one pre-rendered character per look stage (avatar/t0..t8.webp) =====
// Tier -> outfit/posture via RANKS[r].look. Current body (gains/fat/softness) nudges width & tone. Selfie = separate portrait badge.
function avatarSVG(rank,stats,equip,size,opts){equip=equip||{};size=size||220;rank=Math.max(0,Math.min(RANKS.length-1,rank|0));
 const lk=Math.max(0,Math.min(8,RANKS[rank].look|0)),cur=rank===curRank()&&stats===S.stats;
 let sx=1,flt='';if(cur&&typeof bodyShape==='function'){try{const b=bodyShape();sx=1+0.06*b.muscle+0.05*Math.max(0,b.fat);flt=`filter:saturate(${(1-0.3*b.soft).toFixed(2)}) brightness(${(1-0.12*b.soft).toFixed(2)});`}catch(e){}}
 const w=Math.round(size*0.8),h=Math.round(size*1.07);
 const items=cur?['watch','car','home','boat'].map(k=>itemById(equip[k])).filter(Boolean):[];
 const face='';
 return `<div class="av" style="width:${w}px;height:${h}px;${lk>=7?'--glow:.22':''}"><img src="avatar/t${lk}.webp" alt="${esc(RANKS[rank].n)}" loading="lazy" style="transform:scale(${(1.12*sx).toFixed(3)},1.12);${flt}">${face}${items.length?`<div class="av-items">${items.map(i=>`<span title="${esc(i.n)}">${i.e}</span>`).join('')}</div>`:''}</div>`}
// Selfie: keep a soft, tone-matched circular crop instead of pasting onto the body
function stylizeFace(img){const N=256,cv=document.createElement('canvas');cv.width=cv.height=N;const x=cv.getContext('2d');const s=Math.min(img.width,img.height);
 x.filter='grayscale(.25) sepia(.18) contrast(1.05) brightness(.97)';x.drawImage(img,(img.width-s)/2,(img.height-s)/2.4,s,s,0,0,N,N);x.filter='none';
 const g=x.createRadialGradient(N/2,N/2,N*.3,N/2,N/2,N*.55);g.addColorStop(0,'rgba(14,14,17,0)');g.addColorStop(1,'rgba(14,14,17,.55)');x.fillStyle=g;x.fillRect(0,0,N,N);return cv.toDataURL('image/jpeg',.85)}
