(() => {
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const stage=document.getElementById('gallery-stage');
 if(stage){
  let visible=[...ids],active=0;
  const caption=document.getElementById('gallery-title'),counter=document.getElementById('gallery-counter');
  const prev=document.getElementById('gallery-prev'),next=document.getElementById('gallery-next');
  stage.tabIndex=0;
  stage.setAttribute('aria-label','作品轮播，可使用左右方向键切换');
  const render=()=>{
   stage.innerHTML=visible.map((id,index)=>{const p=projects[id];return `<a class="gallery-card" data-index="${index}" href="project.html?id=${id}" aria-label="${p.title}"><img src="${p.coverImage||coverPath(id)}" alt="${p.title}" width="1200" height="675" decoding="async"></a>`}).join('');update();
   stage.querySelectorAll('.gallery-card').forEach(card=>card.addEventListener('click',event=>{const index=Number(card.dataset.index);if(index!==active){event.preventDefault();active=index;update();}}));
  };
  const update=()=>{
   stage.querySelectorAll('.gallery-card').forEach((card,index)=>{const offset=index-active,depth=Math.abs(offset);card.style.setProperty('--offset',offset);card.style.setProperty('--depth',depth);card.style.setProperty('--angle',Math.sign(offset));card.style.setProperty('--layer',10-depth);card.style.setProperty('--opacity',depth>2?'0':'1');card.classList.toggle('is-active',offset===0);card.tabIndex=depth>2?-1:0;card.setAttribute('aria-hidden',String(depth>2));if(offset===0)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');});
   const id=visible[active];caption.textContent=projects[id].title+' ↗';caption.href=`project.html?id=${id}`;counter.textContent=`${String(active+1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`;prev.disabled=active===0;next.disabled=active===visible.length-1;
  };
  const step=delta=>{active=Math.max(0,Math.min(visible.length-1,active+delta));update();};
  prev.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
  stage.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();step(event.key==='ArrowRight'?1:-1);}});
  let start=null;stage.addEventListener('touchstart',event=>{start=event.touches[0].clientX;},{passive:true});stage.addEventListener('touchend',event=>{if(start===null)return;const delta=event.changedTouches[0].clientX-start;if(Math.abs(delta)>45)step(delta<0?1:-1);start=null;},{passive:true});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{visible=ids.filter(id=>button.dataset.filter==='all'||projects[id].category===button.dataset.filter);active=0;render();}));render();
 }
 if(!reduced){
  const targets=document.querySelectorAll('.about-title,.about-photo,.about-story,.about-academic,.about-experience,.about-tools,.work-card,footer');
  if('IntersectionObserver' in window){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});targets.forEach(target=>{target.classList.add('reveal');observer.observe(target);});}
  if(matchMedia('(pointer:fine)').matches){const hero=document.querySelector('.hero'),fan=document.querySelector('.hero-fan');hero.addEventListener('pointermove',event=>{const r=hero.getBoundingClientRect();fan.style.setProperty('--fx',`${((event.clientX-r.left)/r.width-.5)*20}px`);fan.style.setProperty('--fy',`${((event.clientY-r.top)/r.height-.5)*16}px`);});hero.addEventListener('pointerleave',()=>{fan.style.setProperty('--fx','0px');fan.style.setProperty('--fy','0px');});document.querySelectorAll('.work-card').forEach(card=>{card.addEventListener('pointermove',event=>{const r=card.getBoundingClientRect();card.style.setProperty('--tiltx',`${-((event.clientY-r.top)/r.height-.5)*6}deg`);card.style.setProperty('--tilty',`${((event.clientX-r.left)/r.width-.5)*8}deg`);});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tiltx','0deg');card.style.setProperty('--tilty','0deg');});});}
 }
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);let scheduled=false;const updateProgress=()=>{const length=document.documentElement.scrollHeight-innerHeight;progress.style.setProperty('--progress',length>0?String(scrollY/length):'0');scheduled=false;};window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
})();
