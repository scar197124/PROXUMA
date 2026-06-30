(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  const waiting = text => !text || /waiting|ready to scan|enter a target|scan first|not measured|standby/i.test(text);
  function confidenceClass(value){
    const v=value.toLowerCase();
    if(/high|strong/.test(v)) return 'high';
    if(/medium|moderate/.test(v)) return 'medium';
    if(/low|limited/.test(v)) return 'low';
    return 'waiting';
  }
  function evidenceItems(){
    return [...document.querySelectorAll('#evidenceList li')]
      .map(li => clean(li.textContent))
      .filter(Boolean)
      .filter(x => !/no target|waiting/i.test(x))
      .slice(0,6);
  }
  function update(){
    const risk=clean($('riskLabel')?.textContent);
    const summary=clean($('summaryText')?.textContent);
    const confidence=clean($('confidenceLabel')?.textContent || $('confidenceBrief')?.textContent);
    const trigger=clean($('primaryTrigger')?.textContent);
    const action=clean($('actionText')?.textContent || $('nextStep')?.textContent);
    const evidence=evidenceItems();
    const idle=waiting(risk) || waiting(summary);
    const badge=$('guidedConfidenceBadge');
    if(badge){
      const label=idle?'waiting':(confidence || 'not measured');
      badge.textContent=`Confidence: ${label}`;
      badge.dataset.level=confidenceClass(label);
    }
    if($('guidedResultLead')) $('guidedResultLead').textContent=idle
      ? 'Run a scan to receive a plain-language result and one recommended next action.'
      : `${risk}. ${summary}`;
    if($('guidedObservedTitle')) $('guidedObservedTitle').textContent=idle?'No local evidence yet':(trigger && !waiting(trigger)?trigger:`${evidence.length} local signal${evidence.length===1?'':'s'} reviewed`);
    if($('guidedObservedText')) $('guidedObservedText').textContent=idle
      ? 'Proxuma will list evidence directly visible to the local scanner.'
      : (evidence[0] || 'No strong local warning signal was recorded.');
    if($('guidedNextAction')) $('guidedNextAction').textContent=idle?'Scan first':(action && !waiting(action)?action:'Review the evidence before proceeding.');
    const list=$('guidedEvidenceList');
    if(list){
      list.innerHTML=(evidence.length?evidence:['No supporting evidence was produced by this scan.'])
        .map(item=>{const li=document.createElement('li');li.textContent=item;return li.outerHTML;}).join('');
    }
  }
  ['riskLabel','summaryText','confidenceLabel','confidenceBrief','primaryTrigger','actionText','nextStep','evidenceList']
    .forEach(id=>{const el=$(id);if(el)new MutationObserver(update).observe(el,{childList:true,subtree:true,characterData:true});});
  $('scanButton')?.addEventListener('click',()=>setTimeout(update,260));
  update();
})();
