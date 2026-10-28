(()=>{'use strict';document.documentElement.classList.add('js');
const menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('#menu-toggle');
if(menu&&toggle){toggle.addEventListener('click',()=>{const expand=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(expand));toggle.setAttribute('aria-label',expand?'Close navigation':'Open navigation');menu.hidden=!expand;});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');toggle.focus();}});}
const observer=window.IntersectionObserver&&(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)?new IntersectionObserver(items=>{for(const entry of items){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}},{threshold:.08,rootMargin:'0px 0px -25px 0px'}):null;
document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('is-visible'));
document.querySelectorAll('.copy-command').forEach(el=>el.setAttribute('aria-live','polite'));
const say=(el,label)=>{const old=el.dataset.originalLabel||el.textContent;el.dataset.originalLabel=old;el.textContent=label;window.setTimeout(()=>{if(el.isConnected)el.textContent=old;},1700)};
async function copy(text,btn){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else {const node=document.createElement('textarea');node.value=text;node.style.position='fixed';node.style.left='-10000px';document.body.append(node);node.select();if(!document.execCommand('copy'))throw new Error('copy');node.remove();}say(btn,'Copied ✓');}catch(e){say(btn,'Select and copy manually');}}
document.addEventListener('click',event=>{const btn=event.target.closest('.copy-command');if(!btn)return;const text=btn.dataset.copy;if(text)copy(text,btn);});
})();
// OS installer tabs: semantic tabs, keyboard arrows, Home/End, persistent HTML fallback.
(()=>{
 const tabs=Array.from(document.querySelectorAll('[role="tab"][data-os]'));
 if(!tabs.length)return;
 function activate(tab,focus=false){
   tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;
     const panel=document.getElementById(t.getAttribute('aria-controls'));if(panel)panel.hidden=!active;});
   if(focus)tab.focus();
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{
   let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;
   else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
   e.preventDefault();activate(tabs[next],true);
 });});
})();
