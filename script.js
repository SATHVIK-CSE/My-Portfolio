const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.navigation');menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open)});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation')}));const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.hero .reveal').forEach(item=>observer.observe(item));
const progressFill=document.querySelector('.scroll-progress span');let progressTick=false;const updateProgress=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progressFill.style.transform='scaleX('+(max>0?window.scrollY/max:0)+')';progressTick=false};window.addEventListener('scroll',()=>{if(!progressTick){window.requestAnimationFrame(updateProgress);progressTick=true}},{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
const sectionLinks=[...document.querySelectorAll('.navigation a[href^="#"]')];const sectionObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;sectionLinks.forEach(link=>{const active=link.getAttribute('href')==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}},{rootMargin:'-42% 0px -48% 0px',threshold:0});document.querySelectorAll('main section[id]').forEach(section=>sectionObserver.observe(section));


const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');const zoomSections=[...document.querySelectorAll('main section[id]')];let focusedSection=null;let zoomFrame=false;const findFocusedSection=()=>{const focusY=window.innerHeight*.48;let nearest=null;let distance=Infinity;for(const section of zoomSections){const rect=section.getBoundingClientRect();const center=rect.top+Math.min(rect.height,window.innerHeight)*.5;const gap=Math.abs(center-focusY);if(gap<distance){nearest=section;distance=gap}}if(!focusedSection){focusedSection=nearest;return}if(!nearest||nearest===focusedSection)return;const previous=focusedSection;focusedSection=nearest;if(reducedMotion.matches||typeof nearest.animate!=='function')return;const visible=(section)=>{const r=section.getBoundingClientRect();return r.bottom>0&&r.top<window.innerHeight};if(visible(previous))previous.animate([{transform:'scale(1)',filter:'blur(0px)'},{transform:'scale(1.055)',filter:'blur(2px)'}],{duration:460,easing:'cubic-bezier(.65,0,.85,.36)'});if(visible(nearest))nearest.animate([{transform:'scale(.9)',filter:'blur(3px)'},{transform:'scale(1.012)',filter:'blur(0px)'},{transform:'scale(1)',filter:'blur(0px)'}],{duration:580,easing:'cubic-bezier(.16,1,.3,1)'})};window.addEventListener('scroll',()=>{if(!zoomFrame){window.requestAnimationFrame(()=>{findFocusedSection();zoomFrame=false});zoomFrame=true}},{passive:true});window.addEventListener('resize',findFocusedSection);findFocusedSection();
// Portrait 3D tilt (desktop only)
(() => {
  const frame = document.querySelector('.portrait-frame');
  if (!frame || matchMedia('(hover: none)').matches) return;
  frame.addEventListener('mousemove', (e) => {
    const r = frame.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.style.transform =
      `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
  });
  frame.addEventListener('mouseleave', () => { frame.style.transform = ''; });
})();
// Portrait stamp intro + 3D tilt
(() => {
  const frame = document.querySelector('.portrait-frame');
  const img = frame && frame.querySelector('img');
  if (!frame || !img) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    frame.dataset.state = 'reveal';
    return;
  }

  // Wait for the photo to load (minimum 1.8s so the stamp is seen)
  frame.dataset.state = 'wait';
  const imgReady = new Promise((resolve) => {
    if (img.complete) return resolve();
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  });
  const minWait = new Promise((resolve) => setTimeout(resolve, 1800));

  Promise.all([imgReady, minWait]).then(() => {
    frame.dataset.state = 'hit';
    setTimeout(() => { frame.dataset.state = 'reveal'; }, 900);
  });

  // 3D tilt on desktop, only after the reveal
  if (matchMedia('(hover: none)').matches) return;
  frame.addEventListener('mousemove', (e) => {
    if (frame.dataset.state !== 'reveal') return;
    const r = frame.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.style.transform =
      `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
  });
  frame.addEventListener('mouseleave', () => { frame.style.transform = ''; });
})();
