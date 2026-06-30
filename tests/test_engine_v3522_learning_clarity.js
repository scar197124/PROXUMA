const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'assets','js','proxuma-it.js'),'utf8');
const checks=[
 ['version marker',html.includes('v3.52.2-learning-clarity')],
 ['plain-language guidance label',html.includes('Plain-language guidance')],
 ['safety takeaway tab',html.includes('>Safety Takeaway</button>')],
 ['takeaway heading',html.includes('What to remember next time')],
 ['old labels removed',!html.includes('>Learning Note</button>')&&!html.includes('<strong>Learning Mode</strong>')],
 ['scan-specific wording',js.includes('Safety takeaway:')],
 ['scanner property preserved',js.includes('learningStatus')&&js.includes('learningText')]
];
for(const [name,ok] of checks){if(!ok){console.error('FAIL',name);process.exitCode=1}else console.log('PASS',name)}
