(function(){
  'use strict';
  const KEY='proxuma-review-trust-collapsed-v3441';

  function makeToggle(){
    const workflow=document.getElementById('workflow');
    const head=workflow?.querySelector('.workflow-fixed-head');
    const body=workflow?.querySelector('.workflow-scroll-body');
    if(!workflow||!head||!body||head.querySelector('.workflow-toggle'))return;

    body.id=body.id||'workflowToolsBody';
    const button=document.createElement('button');
    button.type='button';
    button.className='collapse-toggle unified-control-button workflow-toggle';
    button.setAttribute('aria-controls',body.id);
    button.innerHTML='<span aria-hidden="true" class="toggle-dot"></span><span class="toggle-copy">Open</span><small>Review &amp; Trust</small>';
    head.appendChild(button);

    let collapsed=true;
    try{
      const saved=localStorage.getItem(KEY);
      if(saved==='open')collapsed=false;
      if(saved==='closed')collapsed=true;
    }catch(_e){}

    const sync=()=>{
      workflow.classList.toggle('workflow-collapsed',collapsed);
      body.hidden=collapsed;
      button.setAttribute('aria-expanded',String(!collapsed));
      const copy=button.querySelector('.toggle-copy');
      if(copy)copy.textContent=collapsed?'Open':'Close';
      try{localStorage.setItem(KEY,collapsed?'closed':'open');}catch(_e){}
    };

    button.addEventListener('click',()=>{
      collapsed=!collapsed;
      sync();
      if(!collapsed)requestAnimationFrame(()=>body.focus?.({preventScroll:true}));
    });
    sync();
  }

  function normalizeNativeDisclosures(){
    document.querySelectorAll('details.simple-disclosure').forEach(details=>{
      const summary=details.querySelector(':scope > summary');
      const copy=summary?.querySelector('.toggle-copy');
      if(!summary||!copy)return;
      const sync=()=>{
        copy.textContent=details.open?'Close':'Open';
        summary.setAttribute('aria-expanded',String(details.open));
      };
      details.addEventListener('toggle',sync);
      sync();
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    makeToggle();
    normalizeNativeDisclosures();
  });
})();
