/* Proxuma local-only phishing and typo-squatting engine. No network calls. */
const BRAND_PROFILES = [
  // Canadian banks and services
  {brand:'Scotiabank', domains:['scotiabank.com','scotiabank.ca'], keywords:['scotia','scotiabank']},
  {brand:'RBC Royal Bank', domains:['rbc.com','rbcroyalbank.com','royalbank.com'], keywords:['rbc','royalbank','rbcroyalbank']},
  {brand:'TD Canada Trust', domains:['td.com','tdcanadatrust.com'], keywords:['td','tdbank','tdcanadatrust']},
  {brand:'BMO', domains:['bmo.com','bankofmontreal.com'], keywords:['bmo','bankofmontreal']},
  {brand:'CIBC', domains:['cibc.com'], keywords:['cibc']},
  {brand:'National Bank of Canada', domains:['nbc.ca','bnc.ca','nationalbank.com'], keywords:['nationalbank','banquenationale','nbc','bnc']},
  {brand:'Desjardins', domains:['desjardins.com'], keywords:['desjardins']},
  {brand:'Tangerine', domains:['tangerine.ca'], keywords:['tangerine']},
  {brand:'Simplii', domains:['simplii.com'], keywords:['simplii']},
  {brand:'EQ Bank', domains:['eqbank.ca'], keywords:['eqbank']},
  {brand:'Manulife Bank', domains:['manulifebank.ca','manulife.ca'], keywords:['manulife','manulifebank']},
  {brand:'Laurentian Bank', domains:['lbcfg.ca','laurentianbank.ca'], keywords:['laurentianbank','lbcfg']},
  {brand:'ATB Financial', domains:['atb.com'], keywords:['atb','atbfinancial']},
  {brand:'Vancity', domains:['vancity.com'], keywords:['vancity']},
  {brand:'Interac', domains:['interac.ca'], keywords:['interac','etransfer','e-transfer']},
  {brand:'Canada Revenue Agency', domains:['canada.ca'], keywords:['cra','canadarevenue','revenuecanada']},
  // American banks, brokerages, and payment platforms
  {brand:'Bank of America', domains:['bankofamerica.com','bofa.com'], keywords:['bankofamerica','bofa']},
  {brand:'Chase', domains:['chase.com','jpmorganchase.com'], keywords:['chase','jpmorgan','jpmorganchase']},
  {brand:'Wells Fargo', domains:['wellsfargo.com'], keywords:['wellsfargo']},
  {brand:'Citi', domains:['citi.com','citibank.com'], keywords:['citi','citibank']},
  {brand:'Capital One', domains:['capitalone.com'], keywords:['capitalone']},
  {brand:'U.S. Bank', domains:['usbank.com'], keywords:['usbank']},
  {brand:'PNC Bank', domains:['pnc.com'], keywords:['pnc','pncbank']},
  {brand:'Truist', domains:['truist.com'], keywords:['truist']},
  {brand:'American Express', domains:['americanexpress.com','amex.com'], keywords:['americanexpress','amex']},
  {brand:'Discover', domains:['discover.com'], keywords:['discover']},
  {brand:'Ally Bank', domains:['ally.com'], keywords:['ally','allybank']},
  {brand:'Navy Federal', domains:['navyfederal.org'], keywords:['navyfederal']},
  {brand:'Charles Schwab', domains:['schwab.com'], keywords:['schwab','charlesschwab']},
  {brand:'Fidelity', domains:['fidelity.com'], keywords:['fidelity']},
  {brand:'PayPal', domains:['paypal.com'], keywords:['paypal']},
  {brand:'Venmo', domains:['venmo.com'], keywords:['venmo']},
  {brand:'Cash App', domains:['cash.app','cashapp.com'], keywords:['cashapp','cash-app']},
  {brand:'Zelle', domains:['zellepay.com'], keywords:['zelle','zellepay']},
  {brand:'IRS', domains:['irs.gov'], keywords:['irs','internalrevenue']},
  // Major enterprises and delivery platforms commonly impersonated
  {brand:'Amazon', domains:['amazon.com','amazon.ca'], keywords:['amazon']},
  {brand:'Apple', domains:['apple.com','icloud.com'], keywords:['apple','icloud']},
  {brand:'Microsoft', domains:['microsoft.com','live.com','outlook.com','office.com'], keywords:['microsoft','outlook','office365','onedrive']},
  {brand:'Google', domains:['google.com','gmail.com'], keywords:['google','gmail']},
  {brand:'Meta/Facebook', domains:['facebook.com','meta.com'], keywords:['facebook','meta']},
  {brand:'Instagram', domains:['instagram.com'], keywords:['instagram']},
  {brand:'Netflix', domains:['netflix.com'], keywords:['netflix']},
  {brand:'UPS', domains:['ups.com'], keywords:['ups']},
  {brand:'FedEx', domains:['fedex.com'], keywords:['fedex']},
  {brand:'DHL', domains:['dhl.com'], keywords:['dhl']},
  {brand:'Canada Post', domains:['canadapost-postescanada.ca'], keywords:['canadapost','postescanada']}
];
const SUSPICIOUS_TLDS = new Set(['zip','mov','click','country','tk','top','xyz','icu','buzz','support','rest','ru','cn','work','quest','gq','cf']);
const SENSITIVE_PATHS = /(login|signin|verify|verification|secure|account|update|password|wallet|interac|e-transfer|refund|tax|cra|irs)/i;
const HOMO = {'0':'o','1':'l','3':'e','4':'a','5':'s','7':'t','8':'b','@':'a','$':'s','!':'i','|':'l'};
function normalizeHost(raw){let input=(raw||'').trim().toLowerCase(); if(!input) return null; input=input.replace(/\s+/g,'').replace(/,/g,'.'); try{ if(!/^https?:\/\//.test(input)) input='https://'+input; const u=new URL(input); return {url:u, host:u.hostname.replace(/^www\./,''), path:u.pathname+u.search}; }catch{return null}}
function skeleton(s){return s.toLowerCase().split('').map(c=>HOMO[c]||c).join('').replace(/[^a-z0-9]/g,'')}
function lev(a,b){const m=[]; for(let i=0;i<=b.length;i++)m[i]=[i]; for(let j=0;j<=a.length;j++)m[0][j]=j; for(let i=1;i<=b.length;i++){for(let j=1;j<=a.length;j++){m[i][j]=b.charAt(i-1)===a.charAt(j-1)?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,Math.min(m[i][j-1]+1,m[i-1][j]+1));}} return m[b.length][a.length]}
function registered(host){const parts=host.split('.'); if(parts.length<=2)return host; const last2=parts.slice(-2).join('.'); const last3=parts.slice(-3).join('.'); if(/\.(co|com|net|org|gov)\.(uk|ca|au|nz)$/.test('.'+last3)) return last3; return last2}
function analyzeUrl(raw){const parsed=normalizeHost(raw); if(!parsed) return {level:'neutral', score:0, title:'Enter a valid URL.', details:['The input could not be read as a URL or domain.']};
 const {host,path}=parsed; const reg=registered(host); const domainName=reg.split('.')[0]; const tld=reg.split('.').pop(); let score=0; const findings=[];
 if(SUSPICIOUS_TLDS.has(tld)){score+=24; findings.push(`Suspicious or high-abuse TLD detected: .${tld}`)}
 if(host.includes('xn--')){score+=30; findings.push('Punycode / internationalized lookalike domain detected.')}
 if((host.match(/-/g)||[]).length>=2){score+=10; findings.push('Multiple hyphens can indicate separator-based spoofing.')}
 if(SENSITIVE_PATHS.test(path)){score+=14; findings.push('Sensitive login, verification, refund, tax, or account path detected.')}
 for(const profile of BRAND_PROFILES){const official=profile.domains.includes(reg); const skel=skeleton(domainName); const brandHits=profile.keywords.filter(k=>skel.includes(skeleton(k))||lev(skel,skeleton(k))<=2);
   const wrapped=profile.domains.some(d=>host.includes(d+'.')||host.includes(d.replace('.','')+'.'));
   if(official){findings.push(`Official known domain match for ${profile.brand}.`); score=Math.max(0,score-10); continue;}
   if(wrapped){score+=42; findings.push(`Possible wrapped-domain impersonation of ${profile.brand}.`)}
   if(brandHits.length){score+=34; findings.push(`Possible typo-squatting or brand impersonation near ${profile.brand}.`)}
   for(const d of profile.domains){const base=d.split('.')[0]; const distance=lev(skel,skeleton(base)); if(distance>0 && distance<=2){score+=34; findings.push(`Lookalike spelling detected near ${profile.brand} (${d}).`); break;}}
 }
 const unique=[...new Set(findings)]; let level='low', title='Low Risk'; if(score>=85){level='critical'; title='Critical Risk'} else if(score>=55){level='high'; title='High Risk'} else if(score>=25){level='medium'; title='Medium Risk'}
 if(unique.length===0) unique.push('No obvious typo-squatting signals found in the local rule set.');
 return {level, score:Math.min(100,score), title, details:unique, host:reg};}
function render(){const input=document.getElementById('urlInput'); const box=document.getElementById('result'); const r=analyzeUrl(input.value); box.className='result '+r.level; box.innerHTML=`<strong>${r.title} · ${r.score}/100</strong><span>${r.details.map(x=>'• '+x).join('<br>')}</span>`;}
// Scanner bindings moved to homepage-safe boot below.


// Homepage-safe boot: scanner UI may live inside Lite/Sense/Shield instead of the canonical home.
(function proxumaSafeBoot(){
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const scanBtn = document.getElementById('scanBtn');
  const urlInput = document.getElementById('urlInput');
  if (!scanBtn || !urlInput) return;
  scanBtn.addEventListener('click', render);
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') render(); });
  document.querySelectorAll('[data-test]').forEach(b => b.addEventListener('click', () => {
    urlInput.value = b.dataset.test;
    render();
  }));
})();
