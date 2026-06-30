(function(){
  'use strict';

  if(window.__proxumaFocusReadingInitialized) return;
  window.__proxumaFocusReadingInitialized = true;

  const targets = [
    { id:'scan-detail-workspace', label:'Scan Details' },
    { id:'investigation-workspace', label:'Investigation' },
    { id:'workflow', label:'Review & Trust' }
  ];

  let active = null;
  let previousFocus = null;
  let placeholder = null;
  let originalParent = null;
  let originalNextSibling = null;
  let pageScrollY = 0;

  const viewportLayer = document.createElement('div');
  viewportLayer.className = 'focus-reading-viewport';
  viewportLayer.hidden = true;
  viewportLayer.setAttribute('aria-hidden', 'true');

  document.body.appendChild(viewportLayer);

  function makeButton(target, label){
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'focus-reading-toggle unified-control-button';
    button.setAttribute('aria-label', `Expand ${label} reading space`);
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = '<span aria-hidden="true">⛶</span><span class="focus-reading-label">Focus</span>';
    button.addEventListener('click', () => {
      if(active === target) exitFocus();
      else enterFocus(target, button, label);
    });
    return button;
  }

  function addToolbar(target, label){
    if(target.querySelector('.focus-reading-toolbar')) return;
    const toolbar = document.createElement('div');
    toolbar.className = 'focus-reading-toolbar';
    toolbar.appendChild(makeButton(target, label));

    if(target.id === 'scan-detail-workspace'){
      const head = target.querySelector('.scan-details-header');
      if(head) head.appendChild(toolbar);
      else target.prepend(toolbar);
    } else if(target.id === 'investigation-workspace'){
      const head = target.querySelector('#investigation-controls');
      if(head) head.appendChild(toolbar);
      else target.prepend(toolbar);
    } else if(target.id === 'workflow'){
      const head = target.querySelector('.workflow-fixed-head');
      if(head) head.appendChild(toolbar);
      else target.prepend(toolbar);
    } else {
      target.prepend(toolbar);
    }
  }

  function enterFocus(target, button, label){
    if(active) exitFocus(false);

    previousFocus = document.activeElement;
    pageScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    active = target;
    originalParent = target.parentNode;
    originalNextSibling = target.nextSibling;
    placeholder = document.createComment(`focus-placeholder-${target.id}`);
    originalParent.insertBefore(placeholder, target);

    viewportLayer.hidden = false;
    viewportLayer.setAttribute('aria-hidden', 'false');
    viewportLayer.appendChild(target);

    document.body.classList.add('focus-reading-active');
    target.classList.add('is-focus-reading');
    button.setAttribute('aria-pressed','true');
    button.setAttribute('aria-label', `Exit ${label} focus reading mode`);
    const labelNode = button.querySelector('.focus-reading-label');
    if(labelNode) labelNode.textContent = 'Exit focus';

    requestAnimationFrame(() => {
      button.focus({preventScroll:true});
    });
  }

  function restoreTarget(){
    if(!active || !originalParent) return;
    if(placeholder && placeholder.parentNode === originalParent){
      originalParent.insertBefore(active, placeholder);
      placeholder.remove();
    } else if(originalNextSibling && originalNextSibling.parentNode === originalParent){
      originalParent.insertBefore(active, originalNextSibling);
    } else {
      originalParent.appendChild(active);
    }
  }

  function exitFocus(restore=true){
    if(!active) return;
    const exitingTarget = active;
    const button = exitingTarget.querySelector('.focus-reading-toggle');

    exitingTarget.classList.remove('is-focus-reading');
    restoreTarget();
    document.body.classList.remove('focus-reading-active');

    if(button){
      button.setAttribute('aria-pressed','false');
      button.setAttribute('aria-label', 'Expand reading space');
      const labelNode = button.querySelector('.focus-reading-label');
      if(labelNode) labelNode.textContent = 'Focus';
    }

    viewportLayer.hidden = true;
    viewportLayer.setAttribute('aria-hidden', 'true');
    active = null;
    placeholder = null;
    originalParent = null;
    originalNextSibling = null;

    window.scrollTo({top:pageScrollY, left:0, behavior:'auto'});
    if(restore && previousFocus && typeof previousFocus.focus === 'function'){
      requestAnimationFrame(() => previousFocus.focus({preventScroll:true}));
    }
  }

  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape' && active){
      event.preventDefault();
      exitFocus();
    }
  });

  viewportLayer.addEventListener('click', (event) => {
    if(event.target === viewportLayer) exitFocus();
  });

  window.addEventListener('pagehide', () => {
    if(active) exitFocus(false);
  });

  targets.forEach(({id,label}) => {
    const target = document.getElementById(id);
    if(target) addToolbar(target,label);
  });
})();
