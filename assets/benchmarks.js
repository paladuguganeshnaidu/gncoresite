(()=>{
 const buttons=[...document.querySelectorAll('[data-benchmark-filter]')];
 const panels=[...document.querySelectorAll('[data-benchmark-group]')];
 const status=document.getElementById('benchmark-filter-status');
 buttons.forEach(button=>button.addEventListener('click',()=>{
   const group=button.dataset.benchmarkFilter;
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   panels.forEach(p=>p.hidden=group!=='all'&&p.dataset.benchmarkGroup!==group);
   const visible=panels.filter(p=>!p.hidden).length;
   if(status)status.textContent=visible+' figures';
 }));
})();
