(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'proxuma-it-named-sessions-v3410';
  const currentSnapshot = () => ({
    id: (crypto.randomUUID ? crypto.randomUUID() : 'session-' + Date.now()),
    name: ($('sessionNameInput')?.value || '').trim() || 'Untitled scan',
    target: $('targetInput')?.value || '',
    risk: $('riskLabel')?.textContent?.trim() || 'Not scanned',
    score: $('riskScore')?.textContent?.trim() || '',
    summary: $('summaryText')?.textContent?.trim() || '',
    action: $('actionText')?.textContent?.trim() || '',
    severityMix: $('severityMix')?.textContent?.trim() || '',
    timestamp: $('reportTimestamp')?.textContent?.trim() || new Date().toLocaleString(),
    savedAt: new Date().toISOString()
  });
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
  const write = items => localStorage.setItem(KEY, JSON.stringify(items.slice(0,50)));
  const esc = s => String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function setStatus(id,msg){ const el=$(id); if(el) el.textContent=msg; }
  function workflowState(stage){
    const order=['scan','review','prioritize','save','export']; const idx=order.indexOf(stage);
    document.querySelectorAll('[data-workflow-step]').forEach((el,i)=>{el.classList.toggle('active',i===idx);el.classList.toggle('complete',i<idx);});
  }
  function renderSessions(){
    const list=$('namedSessionList'); if(!list) return; const items=read(); list.innerHTML='';
    if(!items.length){list.innerHTML='<li class="session-item"><div><strong>No named sessions yet</strong><small>Run a scan and save a snapshot here.</small></div></li>';return;}
    items.forEach(item=>{
      const li=document.createElement('li'); li.className='session-item'; li.dataset.id=item.id;
      li.innerHTML=`<div><strong>${esc(item.name)}</strong><small>${esc(item.risk)} · ${esc(item.target || 'No target')} · ${esc(new Date(item.savedAt).toLocaleString())}</small></div><div class="session-actions"><button type="button" data-action="open">Open</button><button type="button" class="ghost-button" data-action="compare">Compare</button><button type="button" class="ghost-button" data-action="export">Export</button><button type="button" class="ghost-button danger-action" data-action="delete">Delete</button></div>`;
      list.appendChild(li);
    });
  }
  function download(name,data,type='application/json'){
    const blob=new Blob([data],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500);
  }
  function parseSeverity(){
    const mix=($('severityMix')?.textContent||'').toLowerCase();
    const count=label=>Number((mix.match(new RegExp('(\\d+)\\s*'+label))||[])[1]||0);
    const high=count('high'), medium=count('medium'), low=count('low');
    const risk=($('riskLabel')?.textContent||'').toLowerCase();
    const critical=/critical|dangerous|malicious/.test(risk)?1:0;
    const info=Math.max(0,($('evidenceList')?.children?.length||0)-high-medium-low);
    return {critical,high,medium,low,info};
  }
  function updateSeverity(){ const s=parseSeverity(); Object.entries(s).forEach(([k,v])=>{const id='sev'+k[0].toUpperCase()+k.slice(1); if($(id)) $(id).textContent=v;}); return s; }
  function explain(){
    const snap=currentSnapshot(); if(!snap.target){setStatus('advisorStatus','Run or open a scan first.');return;}
    const sev=updateSeverity();
    const priority=sev.critical?'Immediate':sev.high?'High':sev.medium?'Moderate':'Routine';
    const text=[
      `Local explanation for: ${snap.target}`,
      `Priority: ${priority}`,
      `Verified local verdict: ${snap.risk}${snap.score ? ` (${snap.score})` : ''}`,
      '',
      'What the scanner found:', snap.summary || 'No summary is available.',
      '',
      'Recommended next move:', snap.action || 'Review the evidence and verify the source independently.',
      '',
      `Signal mix: ${sev.critical} critical, ${sev.high} high, ${sev.medium} medium, ${sev.low} low, ${sev.info} informational.`,
      '',
      'Boundary: This explanation reorganizes the visible offline report. It does not perform a new lookup, verify ownership, or guarantee safety.'
    ].join('\n');
    const out=$('localAdvisorOutput'); out.textContent=text; out.classList.remove('empty'); setStatus('advisorStatus','Explanation generated locally.'); workflowState('export');
  }
  $('scanButton')?.addEventListener('click',()=>{workflowState('review');setTimeout(()=>{updateSeverity();workflowState('prioritize');},120);});
  $('saveNamedSessionButton')?.addEventListener('click',()=>{
    const snap=currentSnapshot(); if(!snap.target){setStatus('sessionStatus','Run a scan before saving a session.');return;}
    const items=read(); items.unshift(snap); write(items); renderSessions(); setStatus('sessionStatus',`Saved “${snap.name}” locally.`); workflowState('save');
  });
  $('exportSessionsButton')?.addEventListener('click',()=>{const items=read();download('proxuma-it-sessions.json',JSON.stringify({version:'3.49.0',exportedAt:new Date().toISOString(),sessions:items},null,2));setStatus('sessionStatus','All named sessions exported.');});
  $('namedSessionList')?.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-action]'); if(!btn)return; const li=btn.closest('[data-id]'); const items=read(); const item=items.find(x=>x.id===li.dataset.id); if(!item)return;
    if(btn.dataset.action==='open'){if($('targetInput')) $('targetInput').value=item.target; if($('sessionNameInput')) $('sessionNameInput').value=item.name; setStatus('sessionStatus',`Opened “${item.name}”. Press Analyze to refresh the verified result.`); document.querySelector('#scan')?.scrollIntoView({behavior:'smooth'});}
    if(btn.dataset.action==='compare'){const now=currentSnapshot();setStatus('sessionStatus',`Comparison — saved: ${item.risk}; current: ${now.risk}. Saved target: ${item.target || 'none'}.`);}
    if(btn.dataset.action==='export') download(`proxuma-session-${item.name.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.json`,JSON.stringify(item,null,2));
    if(btn.dataset.action==='delete'){write(items.filter(x=>x.id!==item.id));renderSessions();setStatus('sessionStatus',`Deleted “${item.name}”.`);}
  });
  $('explainCurrentButton')?.addEventListener('click',explain);
  $('copyExplanationButton')?.addEventListener('click',async()=>{const text=$('localAdvisorOutput')?.textContent||''; if(!text||$('localAdvisorOutput')?.classList.contains('empty')){setStatus('advisorStatus','Generate an explanation first.');return;} try{await navigator.clipboard.writeText(text);setStatus('advisorStatus','Explanation copied.');}catch{setStatus('advisorStatus','Copy was blocked by this browser.');}});
  $('resetWorkspaceButton')?.addEventListener('click',()=>{
    if(!confirm('Reset the Proxuma workspace? This clears named sessions, local scan history, notes, and saved interface state on this device.')) return;
    if(!confirm('Final confirmation: permanently clear this browser’s Proxuma workspace data?')) return;
    Object.keys(localStorage).filter(k=>/proxuma/i.test(k)).forEach(k=>localStorage.removeItem(k)); location.reload();
  });
  renderSessions(); updateSeverity(); workflowState('scan');
})();
