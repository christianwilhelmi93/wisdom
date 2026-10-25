// Daily "dream" lock-screen renderer (1179x2556): photo background + dark gradient + serif quote
const DREAM_COUNT=30;
function dayIndex(d){const t=Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());return Math.floor(t/864e5);}
function wpQuote(d){return QUOTES[(dayIndex(d)*17)%QUOTES.length]}
function wpImage(d){return 'dream/'+String((dayIndex(d)*7)%DREAM_COUNT+1).padStart(2,'0')+'.jpg'}
function wrapText(ctx,text,maxW){const words=text.split(' ');const lines=[];let line='';for(const w of words){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w;}else line=t;}if(line)lines.push(line);return lines;}
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
async function drawWallpaper(canvas,date){
 date=date||new Date();const W=1179,H=2556;canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d');
 const [q,a]=wpQuote(date);
 ctx.fillStyle='#0b0b0d';ctx.fillRect(0,0,W,H);
 try{const img=await loadImg(wpImage(date));const s=Math.max(W/img.width,H/img.height);const iw=img.width*s,ih=img.height*s;
  ctx.imageSmoothingQuality='high';ctx.drawImage(img,(W-iw)/2,(H-ih)/2,iw,ih);}catch(e){}
 // readability: soft top vignette for the clock, strong bottom gradient for the quote
 let g=ctx.createLinearGradient(0,0,0,H*0.3);g.addColorStop(0,'rgba(0,0,0,0.45)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H*0.3);
 g=ctx.createLinearGradient(0,H*0.42,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(0.45,'rgba(0,0,0,0.55)');g.addColorStop(1,'rgba(0,0,0,0.88)');ctx.fillStyle=g;ctx.fillRect(0,H*0.42,W,H*0.58);
 ctx.textAlign='center';let size=q.length>90?60:q.length>55?70:82;
 ctx.font=`italic ${size}px Georgia, 'Times New Roman', serif`;const lines=wrapText(ctx,'“'+q+'”',W*0.8);const lh=size*1.34;
 const blockH=lines.length*lh+150;let y=H*0.80-blockH/2;
 ctx.shadowColor='rgba(0,0,0,0.6)';ctx.shadowBlur=30;ctx.fillStyle='#f6f1e7';
 for(const ln of lines){ctx.fillText(ln,W/2,y);y+=lh;}
 ctx.shadowBlur=0;ctx.fillStyle='#c9a96e';ctx.fillRect(W/2-44,y+6,88,3);
 ctx.font=`500 42px -apple-system, 'Helvetica Neue', Arial, sans-serif`;ctx.fillStyle='#e9dfcc';
 ctx.fillText(a.toUpperCase().split('').join('\u200A'),W/2,y+84);
 return canvas;
}
if(typeof module!=='undefined')module.exports={drawWallpaper,dayIndex};
