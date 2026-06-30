(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const STATUS_KEY = 'proxuma-it-remediation-v3420';
  const SESSION_KEY = 'proxuma-it-named-sessions-v3410';
  let activeFilter = 'all';
  let findings = [];
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hash = s => { let h=2166136261; for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)} return (h>>>0).toString(36); };
  const readStatuses = () => { try{return JSON.parse(localStorage.getItem(STATUS_KEY)||'{}')}catch{return {}} };
  const writeStatuses = x => localStorage.setItem(STATUS_KEY,JSON.stringify(x));
  function severityOf(text){ const t=text.toLowerCase(); if(/critical|malicious|dangerous/.test(t))return'critical'; if(/\[high\]| high |credential|phish|urgent|password/.test(' '+t+' '))return'high'; if(/\[medium\]|suspicious|shortener|lookalike|redirect/.test(t))return'medium'; if(/\[low\]|minor|low risk/.test(t))return'low'; return'info'; }
  function clean(text){ return String(text).replace(/^\s*\[(critical|high|medium|low|info(?:rmational)?)\]\s*/i,'').trim(); }
  function actionFor(sev){ return ({critical:'Stop interaction and independently verify the source immediately.',high:'Do not continue until the target is verified through an official channel.',medium:'Review the evidence and confirm the destination before proceeding.',low:'Use normal caution and verify unexpected requests.',info:'Keep this context with the case for future comparison.'})[sev]; }
  function collect(){
    const raw=[...document.querySelectorAll('#evidenceList li')].map(x=>x.textContent.trim()).filter(Boolean);
    const fallback=$('summaryText')?.textContent?.trim();
    const arr=raw.length?raw:(fallback && !/enter a target|generate/i.test(fallback)?[fallback]:[]);
    findings=arr.map((text,i)=>({id:hash(text),title:clean(text).split(/[.!?]/)[0].slice(0,90)||`Finding ${i+1}`,evidence:clean(text),severity:severityOf(text)}));
    render();
  }
  function render(){
    const list=$('trustFindingList'); if(!list)return; const states=readStatuses();
    const visible=findings.filter(f=>activeFilter==='all'||(activeFilter==='resolved'?states[f.id]==='resolved':states[f.id]!=='resolved'));
    if(!visible.length){list.innerHTML='<div class="trust-empty">'+(findings.length?'No findings match this filter.':'Run a scan to build unified finding cards.')+'</div>';return;}
    list.innerHTML=visible.map((f,i)=>{const status=states[f.id]||'review';return `<article class="trust-finding-card severity-${f.severity}" data-finding-id="${f.id}"><div class="finding-head"><span class="finding-rank">${i+1}</span><div><span class="finding-severity">${esc(f.severity)}</span><h4>${esc(f.title)}</h4></div><select class="remediation-status" aria-label="Remediation status for ${esc(f.title)}"><option value="review" ${status==='review'?'selected':''}>To review</option><option value="progress" ${status==='progress'?'selected':''}>In progress</option><option value="resolved" ${status==='resolved'?'selected':''}>Resolved</option><option value="accepted" ${status==='accepted'?'selected':''}>Accepted risk</option></select></div><div class="finding-confidence"><b>Confidence</b><span>${f.severity==='critical'||f.severity==='high'?'High':f.severity==='medium'?'Moderate':'Contextual'}</span></div><div class="finding-block action-block"><b>Why this matters</b><p>${esc(f.title)}</p></div><div class="finding-block action-block"><b>Recommended next step</b><p>${esc(actionFor(f.severity))}</p></div><details class="finding-evidence-details"><summary>Technical evidence</summary><div class="finding-block verified-block"><b>Observed by the local scanner</b><p>${esc(f.evidence)}</p></div></details></article>`}).join('');
  }
  function snapshot(){ const states=readStatuses(); return {version:'3.52.2',generatedAt:new Date().toISOString(),target:$('targetInput')?.value||'',risk:$('riskLabel')?.textContent?.trim()||'',score:$('scoreValue')?.textContent?.trim()||'',summary:$('summaryText')?.textContent?.trim()||'',findings:findings.map(f=>({...f,status:states[f.id]||'review'})),notes:$('caseNotes')?.value||''}; }
  function download(name,data,type){const blob=new Blob([data],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
  function compare(item){ const current=snapshot(); const old=item.findings||[]; const om=new Map(old.map(f=>[f.id,f])); const cm=new Map(current.findings.map(f=>[f.id,f])); const added=current.findings.filter(f=>!om.has(f.id)); const resolved=old.filter(f=>!cm.has(f.id)); const unchanged=current.findings.filter(f=>om.has(f.id)&&om.get(f.id).severity===f.severity); const changed=current.findings.filter(f=>om.has(f.id)&&om.get(f.id).severity!==f.severity); const el=$('sessionComparison'); if(!el)return; el.classList.remove('empty'); el.innerHTML=`<h4>Comparison with ${esc(item.name||'saved session')}</h4><div class="comparison-grid"><div><b>${added.length}</b><span>New</span></div><div><b>${resolved.length}</b><span>Resolved</span></div><div><b>${unchanged.length}</b><span>Unchanged</span></div><div><b>${changed.length}</b><span>Severity changed</span></div></div>`; }
  document.addEventListener('change',e=>{const sel=e.target.closest('.remediation-status');if(!sel)return;const card=sel.closest('[data-finding-id]');const states=readStatuses();states[card.dataset.findingId]=sel.value;writeStatuses(states);$('trustActionStatus').textContent=`Status updated to ${sel.options[sel.selectedIndex].text}.`;render();});
  document.querySelectorAll('.finding-filter').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.filter;document.querySelectorAll('.finding-filter').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});render();}));
  $('scanButton')?.addEventListener('click',()=>setTimeout(collect,220));
  const observer=new MutationObserver(()=>collect()); if($('evidenceList'))observer.observe($('evidenceList'),{childList:true,subtree:true});
  $('saveNamedSessionButton')?.addEventListener('click',()=>setTimeout(()=>{try{const items=JSON.parse(localStorage.getItem(SESSION_KEY)||'[]');if(items[0]){items[0].findings=snapshot().findings;localStorage.setItem(SESSION_KEY,JSON.stringify(items));}}catch{}},50));
  $('namedSessionList')?.addEventListener('click',e=>{const btn=e.target.closest('[data-action="compare"]');if(!btn)return;const id=btn.closest('[data-id]')?.dataset.id;try{const item=JSON.parse(localStorage.getItem(SESSION_KEY)||'[]').find(x=>x.id===id);if(item)compare(item);}catch{}});
  $('exportTrustJson')?.addEventListener('click',()=>{download('proxuma-trust-report.json',JSON.stringify(snapshot(),null,2),'application/json');$('trustExportStatus').textContent='Structured report exported.';});
  $('exportTrustHtml')?.addEventListener('click',()=>{const s=snapshot();const rows=s.findings.map(f=>`<article><h2>${esc(f.severity.toUpperCase())}: ${esc(f.title)}</h2><p><b>Verified finding:</b> ${esc(f.evidence)}</p><p><b>Status:</b> ${esc(f.status)}</p><p><b>Suggested next step:</b> ${esc(actionFor(f.severity))}</p></article>`).join('')||'<p>No findings.</p>';const html=`<!doctype html><html><head><meta charset="utf-8"><title>Proxuma IT Report</title><style>body{font-family:system-ui;max-width:900px;margin:auto;padding:32px;color:#172033}article{border:1px solid #ccd5df;border-radius:12px;padding:16px;margin:12px 0}h1{margin-bottom:4px}small{color:#596579}</style></head><body><h1>Proxuma IT Trust Report</h1><small>${esc(s.generatedAt)} · ${esc(s.target)}</small><p><b>Verdict:</b> ${esc(s.risk)} · Score ${esc(s.score)}</p><p>${esc(s.summary)}</p>${rows}</body></html>`;download('proxuma-trust-report.html',html,'text/html');$('trustExportStatus').textContent='Printable HTML report exported.';});
  collect();
})();
