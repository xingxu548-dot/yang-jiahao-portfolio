const clamp=(n,min,max)=>Math.min(Math.max(n,min),max);
const lerp=(a,b,t)=>a+(b-a)*t;

const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting)entry.target.classList.add('visible');
}),{threshold:.12,rootMargin:'0px 0px -6%'});
reveals.forEach(el=>observer.observe(el));

let targetY=window.scrollY,currentY=window.scrollY,smoothRaf=0;
const desktop=()=>matchMedia('(min-width:761px) and (prefers-reduced-motion:no-preference)').matches;
function smoothTo(y){targetY=clamp(y,0,document.documentElement.scrollHeight-innerHeight);if(!smoothRaf)smoothRaf=requestAnimationFrame(smoothStep)}
function smoothStep(){currentY=lerp(currentY,targetY,.09);window.scrollTo(0,currentY);if(Math.abs(targetY-currentY)<.3){currentY=targetY;window.scrollTo(0,currentY);smoothRaf=0}else smoothRaf=requestAnimationFrame(smoothStep)}
window.addEventListener('wheel',event=>{if(!desktop()||event.ctrlKey)return;event.preventDefault();smoothTo(targetY+event.deltaY*1.08)},{passive:false});
window.addEventListener('keydown',event=>{if(!desktop())return;const amount={ArrowDown:110,ArrowUp:-110,PageDown:innerHeight*.86,PageUp:-innerHeight*.86}[event.key];if(amount){event.preventDefault();smoothTo(targetY+amount)}});
window.addEventListener('scroll',()=>{if(!smoothRaf)currentY=targetY=window.scrollY},{passive:true});
document.querySelectorAll('[data-scroll],a[href^="#"]').forEach(control=>control.addEventListener('click',event=>{const selector=control.dataset.scroll||control.getAttribute('href');const destination=document.querySelector(selector);if(!destination)return;event.preventDefault();desktop()?smoothTo(destination.offsetTop):destination.scrollIntoView({behavior:'smooth'})}));

const compare=document.querySelector('#compare'),overlay=compare.querySelector('.compare-overlay'),line=compare.querySelector('.compare-line');
let dragging=false;
function setCompare(clientX){const rect=compare.getBoundingClientRect();const percentage=clamp((clientX-rect.left)/rect.width*100,7,93);overlay.style.clipPath=`inset(0 0 0 ${percentage}%)`;line.style.left=`${percentage}%`}
compare.addEventListener('pointerdown',event=>{dragging=true;compare.setPointerCapture(event.pointerId);setCompare(event.clientX)});
compare.addEventListener('pointermove',event=>{if(dragging)setCompare(event.clientX)});
compare.addEventListener('pointerup',()=>dragging=false);
compare.addEventListener('pointercancel',()=>dragging=false);

const heroPhoto=document.querySelector('.hero-photo'),heroCopy=document.querySelector('.hero-copy'),gate=document.querySelector('.gate');
const profile=document.querySelector('.profile'),profilePortrait=document.querySelector('.profile-portrait img'),duality=document.querySelector('.duality');
const priest=document.querySelector('.priest'),priestBg=document.querySelector('.priest-bg');
const rangeImages=[...document.querySelectorAll('.role-card img')],galleryImages=[...document.querySelectorAll('.gallery-grid img')];
const interlude=document.querySelector('.interlude'),interludeTrack=document.querySelector('.interlude-track'),frameA=document.querySelector('.frame-a'),frameB=document.querySelector('.frame-b');
const progressLabel=document.querySelector('.progress-rail span');
const reel=document.querySelector('.cinematic-reel'),reelImages=[...document.querySelectorAll('.reel-image')],reelCopies=[...document.querySelectorAll('.reel-copy')],reelDots=[...document.querySelectorAll('.reel-meter b')];
const identityFilm=document.querySelector('.identity-film'),identityGate=document.querySelector('.identity-gate'),identityRitual=document.querySelector('.identity-ritual'),identityCopies=[...document.querySelectorAll('.identity-copy')];
const timeline=document.querySelector('.timeline'),backstage=document.querySelector('.backstage'),backstageRibbon=document.querySelector('.backstage-ribbon');
const demonWorld=document.querySelector('.demon-world'),demonLayers=[...document.querySelectorAll('.demon-layer')],demonTitle=document.querySelector('.demon-title'),demonNotes=[...document.querySelectorAll('.demon-note')];
let ticking=false;
function progressFor(element){const rect=element.getBoundingClientRect();return clamp((innerHeight-rect.top)/(innerHeight+rect.height),0,1)}
function renderScroll(){
  const mobile=innerWidth<=760;
  const maxScroll=document.documentElement.scrollHeight-innerHeight;
  const pageP=clamp(window.scrollY/maxScroll,0,1);
  const velocity=clamp((targetY-currentY)/45,-12,12);
  document.body.style.setProperty('--page-progress',pageP.toFixed(4));
  document.body.style.setProperty('--velocity',velocity.toFixed(3));
  progressLabel.textContent=`SCROLL / ${String(Math.round(pageP*100)).padStart(2,'0')}`;
  const heroP=clamp(window.scrollY/innerHeight,0,1);
  heroPhoto.style.transform=`translate3d(${heroP*(mobile?0:3)}vw,${heroP*(mobile?18:72)}px,0) scale(${1+heroP*(mobile?.025:.09)})`;
  heroPhoto.style.filter=`saturate(${.72+heroP*.08}) contrast(1.04) blur(${heroP*1.5}px)`;
  heroCopy.style.transform=`translate3d(0,${-heroP*64}px,0)`;heroCopy.style.opacity=String(1-heroP*.82);
  gate.style.transform=`translate3d(0,${heroP*110}px,0) scaleX(${1+heroP*.18})`;gate.style.opacity=String(1-heroP*.4);
  const identityRect=identityFilm.getBoundingClientRect();
  const identityP=clamp(-identityRect.top/(identityRect.height-innerHeight),0,1);
  const revealP=clamp((identityP-.28)/.48,0,1);
  identityGate.style.opacity=String(1-clamp((identityP-.22)*1.5,0,.78));
  identityGate.style.transform=`scale(${1+identityP*(mobile?.05:.16)}) translate3d(0,${identityP*(mobile?-1:-3)}vh,0)`;
  identityRitual.style.opacity=String(clamp((identityP-.18)*1.8,0,1));
  identityRitual.style.clipPath=`circle(${revealP*82}% at 50% 50%)`;
  identityRitual.style.transform=`scale(${1.12-identityP*.1})`;
  identityCopies[0].style.opacity=String(clamp(1-identityP*3.2,0,1));
  identityCopies[0].style.transform=`translate3d(0,${-42-identityP*90}%,0)`;
  identityCopies[1].style.opacity=String(clamp((identityP-.5)*3.5,0,1));
  identityCopies[1].style.transform=`translate3d(0,${-25-(identityP-.5)*34}%,0)`;
  const timelineP=progressFor(timeline);timeline.style.setProperty('--timeline-progress',clamp((timelineP-.18)*1.55,0,1).toFixed(3));
  const demonRect=demonWorld.getBoundingClientRect();
  const demonP=clamp(-demonRect.top/(demonRect.height-innerHeight),0,1);
  demonWorld.style.setProperty('--demon-progress',demonP.toFixed(3));
  const demonCenters=[0,.26,.52,.76];let demonActive=0;
  demonLayers.forEach((layer,i)=>{const distance=Math.abs(demonP-demonCenters[i]);layer.style.opacity=String(clamp(1-distance*5,0,1));layer.style.transform=`scale(${1.1-demonP*.06}) translate3d(${(demonP-demonCenters[i])*3}vw,0,0)`;layer.style.clipPath=`inset(${clamp(distance*15,0,8)}% ${clamp(distance*12,0,7)}%)`;if(distance<Math.abs(demonP-demonCenters[demonActive]))demonActive=i});
  demonTitle.style.opacity=String(clamp(1-demonP*4,0,1));demonTitle.style.transform=`translate3d(0,${-44-demonP*90}%,0)`;
  demonNotes.forEach((note,i)=>{const center=.24+i*.25,distance=Math.abs(demonP-center);note.style.opacity=String(clamp(1-distance*7,0,1));note.style.transform=`translate3d(0,${-30+(demonP-center)*120}px,0)`});
  const backstageP=progressFor(backstage);backstageRibbon.style.transform=mobile?'none':`translate3d(${18-backstageP*54}vw,0,0)`;
  const profileP=progressFor(profile);profilePortrait.style.transform=mobile?'none':`translate3d(0,${(profileP-.5)*-8}%,0) scale(1.035)`;
  const dualityP=progressFor(duality);if(!dragging){const auto=clamp(16+dualityP*68,10,90);overlay.style.clipPath=`inset(0 0 0 ${auto}%)`;line.style.left=`${auto}%`}
  const priestP=progressFor(priest);priestBg.style.transform=`translate3d(${(priestP-.5)*(mobile?.3:2)}vw,${(priestP-.5)*(mobile?32:145)}px,0) scale(${mobile?1.035:1.08+Math.abs(priestP-.5)*.04})`;
  const interludeP=progressFor(interlude);
  interludeTrack.style.transform=`translate3d(${24-interludeP*48}vw,0,0)`;
  frameA.style.transform=`translate3d(0,${(interludeP-.5)*(mobile?-45:-130)}px,0) rotate(${-8+interludeP*6}deg)`;
  frameB.style.transform=`translate3d(0,${(interludeP-.5)*(mobile?38:110)}px,0) rotate(${7-interludeP*5}deg)`;
  const reelRect=reel.getBoundingClientRect();
  const reelP=clamp(-reelRect.top/(reelRect.height-innerHeight),0,1);
  const centers=[0,.5,1];
  let active=0;
  reelImages.forEach((image,i)=>{
    const distance=Math.abs(reelP-centers[i]);
    const opacity=clamp(1-distance*4,0,1);
    image.style.opacity=opacity;
    image.style.transform=`scale(${1.13-reelP*.08+i*.018}) translate3d(${(reelP-centers[i])*4}vw,0,0)`;
    image.style.clipPath=`inset(${clamp(distance*18,0,10)}% ${clamp(distance*10,0,7)}%)`;
    reelCopies[i].style.opacity=clamp(1-distance*5,0,1);
    reelCopies[i].style.transform=`translate3d(0,${-40+(reelP-centers[i])*130}px,0)`;
    if(distance<Math.abs(reelP-centers[active]))active=i;
  });
  reelDots.forEach((dot,i)=>dot.classList.toggle('active',i===active));
  rangeImages.forEach((img,i)=>{if(mobile){img.style.transform='none';return}const p=progressFor(img.parentElement);const wide=img.parentElement.classList.contains('wide');const amplitude=wide?10:(i%2?44:-44);img.style.transform=`translate3d(0,${(p-.5)*amplitude}px,0) scale(${wide?1.01:1.035})`});
  galleryImages.forEach((img,i)=>{if(mobile){img.style.transform='none';return}const p=progressFor(img.parentElement);img.style.transform=`translate3d(0,${(p-.5)*(i%2?-34:34)}px,0) scale(1.025)`});
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(renderScroll);ticking=true}},{passive:true});
window.addEventListener('resize',renderScroll);renderScroll();

const cursor=document.querySelector('.cursor');
window.addEventListener('pointermove',event=>{cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`});
document.querySelectorAll('a,button,.role-card,.gallery-grid figure,.compare').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'))});
document.querySelectorAll('.role-card').forEach(card=>card.addEventListener('pointermove',event=>{if(!desktop())return;const r=card.getBoundingClientRect();const x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;card.style.transform=`rotateY(${x*7}deg) rotateX(${-y*5}deg)`}));
document.querySelectorAll('.role-card').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform=''));

const lightbox=document.querySelector('.lightbox'),lightboxImage=lightbox.querySelector('img');
document.querySelectorAll('.gallery-grid img').forEach(img=>img.addEventListener('click',()=>{lightboxImage.src=img.src;lightbox.showModal()}));
lightbox.querySelector('button').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close()});

const canvas=document.querySelector('#dust'),ctx=canvas.getContext('2d');let particles=[];
function sizeDust(){const dpr=Math.min(devicePixelRatio,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:Math.min(70,Math.floor(innerWidth/18))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+.2,s:Math.random()*.18+.04,o:Math.random()*.4+.08}))}
function drawDust(){ctx.clearRect(0,0,innerWidth,innerHeight);ctx.fillStyle='#e8e2d6';particles.forEach(p=>{p.y-=p.s;if(p.y<-3){p.y=innerHeight+3;p.x=Math.random()*innerWidth}ctx.globalAlpha=p.o;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(drawDust)}
sizeDust();addEventListener('resize',sizeDust);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)drawDust();

const stars=document.querySelector('#constellation'),starsCtx=stars.getContext('2d');let starPoints=[];
function sizeStars(){const dpr=Math.min(devicePixelRatio,2),rect=stars.getBoundingClientRect();stars.width=rect.width*dpr;stars.height=rect.height*dpr;starsCtx.setTransform(dpr,0,0,dpr,0,0);starPoints=Array.from({length:72},(_,i)=>({x:Math.random()*rect.width,y:Math.random()*rect.height,r:i%19===0?1.8:Math.random()*.8+.25,o:Math.random()*.6+.2}))}
function drawStars(){const r=stars.getBoundingClientRect();starsCtx.clearRect(0,0,r.width,r.height);starPoints.forEach((p,i)=>{const glow=.65+.35*Math.sin(Date.now()/900+i);starsCtx.globalAlpha=p.o*glow;starsCtx.fillStyle=i%19===0?'#a51f24':'#e8e2d6';starsCtx.beginPath();starsCtx.arc(p.x,p.y,p.r,0,Math.PI*2);starsCtx.fill();if(i%19===0&&starPoints[i+1]){starsCtx.strokeStyle='rgba(177,138,74,.22)';starsCtx.beginPath();starsCtx.moveTo(p.x,p.y);starsCtx.lineTo(starPoints[i+1].x,starPoints[i+1].y);starsCtx.stroke()}});requestAnimationFrame(drawStars)}
sizeStars();addEventListener('resize',sizeStars);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)drawStars();
