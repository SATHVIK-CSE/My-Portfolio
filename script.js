const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.navigation');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');

if(menuButton&&nav){
  menuButton.addEventListener('click',()=>{
    const open=menuButton.getAttribute('aria-expanded')!=='true';
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    nav.classList.toggle('open',open);
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Open navigation');
  }));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&nav.classList.contains('open')){
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded','false');
      menuButton.setAttribute('aria-label','Open navigation');
      menuButton.focus();
    }
  });
}

document.documentElement.classList.add('js-ready');
const revealItems=[...document.querySelectorAll('.reveal')];
if('IntersectionObserver' in window&&!reducedMotion.matches){
  revealItems.forEach((item,index)=>item.style.setProperty('--reveal-delay',`${Math.min(index%4,3)*75}ms`));
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
  }),{threshold:.12,rootMargin:'0px 0px -30px 0px'});
  revealItems.forEach(item=>revealObserver.observe(item));
}else{
  revealItems.forEach(item=>item.classList.add('is-visible'));
}

const progressFill=document.querySelector('.scroll-progress span');
let progressQueued=false;
const updateProgress=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  if(progressFill)progressFill.style.transform=`scaleX(${max>0?window.scrollY/max:0})`;
  progressQueued=false;
};
window.addEventListener('scroll',()=>{
  if(!progressQueued){window.requestAnimationFrame(updateProgress);progressQueued=true;}
},{passive:true});
window.addEventListener('resize',updateProgress);
updateProgress();

const sectionLinks=[...document.querySelectorAll('.navigation a[href^="#"]')];
if('IntersectionObserver' in window){
  const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    sectionLinks.forEach(link=>{
      const active=link.getAttribute('href')===`#${entry.target.id}`;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }),{rootMargin:'-40% 0px -52% 0px',threshold:0});
  document.querySelectorAll('main section[id]').forEach(section=>sectionObserver.observe(section));
}

