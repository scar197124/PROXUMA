(function(){
  "use strict";
  const STORAGE_PREFIX="proxuma-panel-group-v3-";

  function selectors(){
    return Array.from(document.querySelectorAll('.grouped-panel-selector[data-panel-group]'));
  }

  function panels(group){
    return Array.from(document.querySelectorAll(`.grouped-panel-managed[data-panel-group="${group}"]`));
  }

  function activate(selector,targetId,focusPanel){
    const group=selector.dataset.panelGroup;
    const target=document.getElementById(targetId);
    if(!target)return;

    panels(group).forEach(panel=>{
      const active=panel.id===targetId;
      panel.hidden=!active;
      panel.classList.remove('is-collapsed');
      if(panel.tagName==='DETAILS')panel.open=true;
      const body=panel.querySelector('.collapsible-card-body,.simple-disclosure-body,.grouped-panel-scroll-body');
      if(body)body.hidden=false;
    });

    selector.querySelectorAll('[data-target-panel]').forEach(button=>{
      const active=button.dataset.targetPanel===targetId;
      button.setAttribute('aria-checked',String(active));
      button.setAttribute('aria-pressed',String(active));
      button.classList.toggle('active',active);
    });

    try{localStorage.setItem(STORAGE_PREFIX+group,targetId);}catch(_e){}

    const region=target.querySelector('.grouped-panel-scroll-body')||target;
    region.scrollTop=0;
    requestAnimationFrame(()=>{ region.scrollTop=0; });
    if(focusPanel){
      region.focus?.({preventScroll:true});
    }
  }

  function initialize(selector){
    const group=selector.dataset.panelGroup;
    const choices=Array.from(selector.querySelectorAll('[data-target-panel]'));
    if(!choices.length)return;

    let saved='';
    try{saved=localStorage.getItem(STORAGE_PREFIX+group)||'';}catch(_e){}
    const initial=choices.some(choice=>choice.dataset.targetPanel===saved)
      ? saved
      : choices[0].dataset.targetPanel;

    choices.forEach(choice=>{
      choice.removeAttribute('role');
      choice.addEventListener('click',()=>activate(selector,choice.dataset.targetPanel,true));
    });

    activate(selector,initial,false);
  }

  document.addEventListener('DOMContentLoaded',()=>selectors().forEach(initialize));
})();

/* Proxuma IT v3.43.1 — keep native disclosure labels explicit and synchronized. */
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('details.simple-disclosure').forEach(details=>{
    const copy=details.querySelector(':scope > summary .toggle-copy');
    if(!copy)return;
    const sync=()=>{ copy.textContent=details.open?'Close':'Open'; };
    details.addEventListener('toggle',sync);
    sync();
  });
});
