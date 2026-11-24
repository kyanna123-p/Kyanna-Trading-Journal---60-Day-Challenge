/* One-screen quick journal — mirrors the user's trading plan.
 * All data uses the existing optionPlans/day and daily record; old records are preserved. */
(function(){
'use strict';
const stages=[['night','Night prep'],['pre','Premarket'],['live','Execution'],['review','Review']];
const emaPlaces=['','Above','In between','Below','On top'];
const emaShapes=['','Flat','Sharp','Weak','~45°'];
const cycleChoices=['','Confirmed valley','Confirmed peak','Noise candle','Trending','Not clear'];
const eventChoices=['','Bull Elephant Bar','Bear Elephant Bar','Bottoming Tail','Topping Tail','Bull 180','Bear 180','Anticipation Bull 180','Anticipation Bear 180','Other'];
const escaped=val=>esc(String(val??''));
function state(){let r=rec();r.workflow=r.workflow||{};return r.workflow}
function stage(){return stages.some(([id])=>id===state().quickStage)?state().quickStage:'night'}
function saveStage(id){if(!stages.some(x=>x[0]===id))return;state().quickStage=id;save();renderOptions()}
function quickUpdate(table,id,key,value,refresh){
 if(table==='day')rec().notes[key]=value;
 else if(table==='workflow')state()[key]=value;
 else if(table==='ticker'){const t=planTicker(id);if(!t)return;const before=t.instrument;t[key]=value;if(key==='instrument'&&before!==value){for(const s of t.setups||[]){if(value==='Options'&&s.direction==='Long')s.direction='Call';else if(value==='Options'&&s.direction==='Short')s.direction='Put';else if(value!=='Options'&&s.direction==='Call')s.direction='Long';else if(value!=='Options'&&s.direction==='Put')s.direction='Short'}}}
 else if(table==='setup'){const [tid,sid]=id.split(':');const s=planSetup(tid,sid);if(!s)return;s[key]=value}
 save();if(refresh)renderOptions();
}
function quickSetFocus(value){rec().focus=value;save();renderOptions()}
function quickSymbol(){
 const input=$('quickNewSymbol');let symbol=(input?.value||'').trim().toUpperCase().replace(/[^A-Z0-9./_-]/g,'');
 if(!symbol)return;
 let t=planDay().tickers.find(x=>x.symbol===symbol);
 if(!t){t={id:planId(),symbol,instrument:'Stocks',weekly:'',daily:'',mas:'',context:'',setups:[]};planDay().tickers.push(t)}
 if(!t.setups.length)quickAddSetup(t.id,false);
 save();renderOptions();$('quickNewSymbol')?.focus();
}
function quickAddSetup(tid,refresh=true){
 let t=planTicker(tid);if(!t)return;
 t.setups=t.setups||[];
 t.setups.push({id:planId(),play:'',direction:(t.instrument==='Options'?'Call':'Long'),zone:'',timeframe:'5m',confirmation:'',entry:'',sl:'',tps:'',expiry:'',strike:'',contracts:'',premium:'',exitPremium:'',pnl:'',rules:'',status:'Watching',events:[],note:''});
 save();if(refresh)renderOptions();
}
function quickDeleteSetup(tid,sid){if(!confirm('Remove this planned setup?'))return;let t=planTicker(tid);if(!t)return;t.setups=t.setups.filter(s=>s.id!==sid);save();renderOptions()}
function quickRemoveSymbol(tid){if(!confirm('Remove this symbol and its setups?'))return;planDay().tickers=planDay().tickers.filter(t=>t.id!==tid);save();renderOptions()}
function quickActiveSet(value){state().quickSelected=value;save();renderOptions()}
function allSetups(){return planDay().tickers.flatMap(t=>(t.setups||[]).map(s=>({t,s,id:t.id+':'+s.id})))}
function quickCurrent(){
 let a=allSetups();if(!a.length)return null;
 return a.find(x=>x.id===state().quickSelected)||a.find(x=>x.s.status==='Premarket approved'||x.s.status==='Entered')||a[0];
}
function quickTap(action){
 const active=quickCurrent();if(!active)return;
 const s=active.s;s.events=s.events||[];
 const once=['Confirmation','Entry','Add','Close','Stop out'];
 if(once.includes(action)&&s.events.some(x=>x.action===action))return;
 if(action==='Add'&&(!s.events.some(x=>x.action==='Entry')||s.status==='Closed'))return;
 if(action==='Entry'&&s.status==='Closed')return;
 if(action==='Confirmation')s.status='Confirmed';
 if(action==='Entry')s.status='Entered';
 if(action==='Close'||action==='Stop out')s.status='Closed';
 if(action==='Skip')s.status='Skipped';
 if(action!=='Skip'||!s.events.some(x=>x.action==='Skip'))s.events.push({action,at:new Date().toISOString()});
 state().quickSelected=active.id;
 state().market=true;
 save();renderOptions();renderDashboard();
}
function quickNoTrade(){if(allSetups().some(x=>x.s.events?.some(e=>e.action==='Entry')))return;state().noTrade=!state().noTrade;state().market=state().noTrade||allSetups().some(x=>x.s.events?.length);save();renderOptions();renderDashboard()}
function quickMark(id,next){state()[id]=true;state().quickStage=next;save();renderOptions();renderDashboard()}
function quickReviewed(){const w=state();w.quickReview=true;w.review=true;w.quickStage='review';w.finishedAt=w.finishedAt||new Date().toISOString();save();renderOptions();renderDashboard()}
function quickToday(){return iso(new Date())}
function quickSessionDay(day){return days.find(d=>d>=day)||days[days.length-1]}
function quickOpenSession(day){
 if(!day||!days.includes(day))return;
 selectDate(day);
 const w=state();if(!w.quickStage)w.quickStage=w.quickNight?'pre':'night';
 save();render();
}
function quickNextSession(){
 const i=days.indexOf(date);
 if(i>=0&&i<days.length-1){quickOpenSession(days[i+1]);go('options')}
}
function quickCurrentSession(){const d=quickSessionDay(quickToday());if(d){quickOpenSession(d);go('options')}}
let quickLastLocalDate=quickToday();
function quickRollover(){
 const now=quickToday();
 if(now===quickLastLocalDate)return;
 quickLastLocalDate=now;
 const next=quickSessionDay(now);
 if(next&&next!==date)quickOpenSession(next);
}
function quickReviewGrade(key,v){rec().grades[key]=v;save();renderDashboard()}
function quickHealth(i,v){rec().checks['health'+i]=v;save()}
function quickTag(text,selected,onclick){return '<button type="button" class="qj-chip '+(selected?'active':'')+'" onclick="'+onclick+'">'+escaped(text)+'</button>'}
function drop(values,value,action,label){return '<label class="qj-field"><span>'+escaped(label)+'</span><select onchange="'+action+'">'+values.map(x=>'<option value="'+escaped(x)+'" '+(x===value?'selected':'')+'>'+escaped(x||'Choose…')+'</option>').join('')+'</select></label>'}
function input(label,value,action,placeholder){return '<label class="qj-field"><span>'+escaped(label)+'</span><input value="'+escaped(value||'')+'" placeholder="'+escaped(placeholder||'')+'" onchange="'+action+'"></label>'}

/* Numbered checklists follow the attached Trading Plan/Execution PDF.
   Exactly three screenshots, one per session phase: night, premarket, review. */
const nightSteps=[
 'Mark nearby Daily and Weekly EMAs, move those stocks to watching list and set alerts',
 'Draw Demand Zones, make notes, set alerts',
 'Make zones on chart. State, position',
 'Daily cycle position? Confirmed valley/peak? Noise candle? Trending?',
 'Screenshot Chart',
 'What am I focusing on tomorrow?'
];
const executionSteps=[
 'POWERBAR, TAILBAR (WITH LARGE WICK), OR BULL/BEAR 180 ABOVE OR BELOW MAs - ENTRY',
 'STOPLOSS BELOW ENTRY BAR',
 'COLOR CHANGE - ADD ONCE',
 '20 EMA 2 BAR BREAK - TAKE PROFIT'
];
function checklistFlags(){const w=state();return w.nightChecklist||(w.nightChecklist={})}
function checklistSetNight(index,checked){
 if(index<0||index>=nightSteps.length)return;
 checklistFlags()[index]=checked;
 save();
 const count=$('nightChecklistCount');
 if(count)count.textContent=nightSteps.filter((_,i)=>!!checklistFlags()[i]).length+' / 6';
}
function checklistSetExecution(tid,sid,index,checked){
 const s=planSetup(tid,sid);
 if(!s||index<0||index>=executionSteps.length)return;
 s.executionChecklist=s.executionChecklist||{};
 s.executionChecklist[index]=checked;
 save();
 const count=$('executionChecklistCount');
 if(count)count.textContent=executionSteps.filter((_,i)=>!!s.executionChecklist[i]).length+' / 4';
}
function checklistChart(source){return data.studies.find(x=>x.date===date&&x.source===source)}
async function checklistSaveChart(source,id,type,step){
 try{
  const image=await imageFile(id);if(!image)return;
  const existing=checklistChart(source);
  if(existing)existing.image=image;
  else data.studies.push({id:planId(),date,market:'Session',source,type,image});
  if(typeof step==='number')checklistFlags()[step]=true;
  save();renderOptions();
 }catch(e){alert('Could not save screenshot. Please choose a smaller image.')}
}
function saveNightScreenshot(){return checklistSaveChart('quick-night-checklist','nightChecklistImage','Night prep chart',4)}
function savePremarketScreenshot(){return checklistSaveChart('quick-premarket-checklist','premarketChecklistImage','Premarket chart')}
function checklistScreenshot(source,inputId,action,caption){
 const image=checklistChart(source)?.image;
 return '<div class="qj-check-screenshot"><label class="qj-upload-label">'+escaped(caption)+
 '<input id="'+inputId+'" type="file" accept="image/*" onchange="'+action+'()"></label>'+
 (image?'<a href="'+escaped(image)+'" target="_blank" rel="noopener noreferrer" title="Open saved screenshot">'+
 '<img class="qj-review-img" src="'+escaped(image)+'" alt="'+escaped(caption)+'"></a>':'')+'</div>';
}
function checklistNightMarkup(focus){
 const flags=checklistFlags(),count=nightSteps.filter((_,i)=>flags[i]).length;
 return '<section class="qj-numbered"><div class="qj-numbered-head"><h3>Night Prep Checklist</h3><span id="nightChecklistCount">'+count+' / 6</span></div>'+
 nightSteps.map((step,i)=>'<div class="qj-numbered-step">'+
 '<label class="qj-numbered-label"><input type="checkbox" '+(flags[i]?'checked':'')+' onchange="checklistSetNight('+i+',this.checked)">'+
 '<b>'+(i+1)+'.</b><span>'+escaped(step)+'</span></label>'+
 (i===4?checklistScreenshot('quick-night-checklist','nightChecklistImage','saveNightScreenshot','Night prep screenshot'):'')+
 (i===5?'<div class="qj-check-extra">'+todayFocusDropdown(focus)+'</div>':'')+'</div>').join('')+
 '</section>';
}
function checklistExecutionMarkup(tid,sid){
 const s=planSetup(tid,sid);if(!s)return '';
 const flags=s.executionChecklist||{},count=executionSteps.filter((_,i)=>flags[i]).length;
 return '<section class="qj-numbered"><div class="qj-numbered-head"><h3>Execution Checklist</h3><span id="executionChecklistCount">'+count+' / 4</span></div>'+
 executionSteps.map((step,i)=>'<label class="qj-numbered-label qj-numbered-execution">'+
 '<input type="checkbox" '+(flags[i]?'checked':'')+
 ' onchange="checklistSetExecution(\''+tid+'\',\''+sid+'\','+i+',this.checked)">'+
 '<b>'+(i+1)+'.</b><span>'+escaped(step)+'</span></label>').join('')+'</section>';
}

function night(){
 const tickers=planDay().tickers,r=rec();
 let html='<div class="qj-head"><div><h2>Night prep · '+escaped(date)+'</h2><p>Build this session’s plan in advance. Mark your levels, zones and alerts. Each symbol can have multiple potential plays.</p></div></div>'+
 checklistNightMarkup(r.focus)+
 '<div class="qj-add"><input id="quickNewSymbol" aria-label="Add symbol" placeholder="Ticker / symbol (AAPL, MNQ…)" onkeydown="if(event.key===\'Enter\'){event.preventDefault();quickSymbol()}"><button class="btn" onclick="quickSymbol()">+ Add symbol</button></div>';
 if(!tickers.length)html+='<div class="qj-empty">Add your first symbol. You only need to enter details relevant to tomorrow.</div>';
 for(const t of tickers){
 html+='<article class="qj-symbol"><div class="qj-symbolhead"><strong>'+escaped(t.symbol)+'</strong>'+
 '<div class="qj-symbolbuttons"><button class="qj-quiet" onclick="quickAddSetup(\''+t.id+'\')">+ Setup</button><button class="qj-quiet qj-danger" onclick="quickRemoveSymbol(\''+t.id+'\')" aria-label="Remove '+escaped(t.symbol)+'">Remove</button></div></div>'+
 '<p class="qj-sub">'+(t.setups||[]).length+' potential setup(s)</p>'+
 '<div class="qj-setups">'+(t.setups||[]).map(s=>'<div class="qj-setup"><div class="qj-setupline">'+
 drop(eventChoices,s.play,"quickUpdate('setup','"+t.id+':'+s.id+"','play',this.value,false)",'Potential event')+
 '<button class="qj-small-danger" title="Remove this setup" onclick="quickDeleteSetup(\''+t.id+'\',\''+s.id+'\')">×</button></div>'+
 '<details class="qj-details"><summary>Optional setup plan · location / entry / stop</summary><div class="qj-three">'+
 input('Zone or MA',s.zone,"quickUpdate('setup','"+t.id+':'+s.id+"','zone',this.value,false)",'e.g. daily 200')+
 input('Entry confirmation',s.confirmation,"quickUpdate('setup','"+t.id+':'+s.id+"','confirmation',this.value,false)",'Event to confirm')+
 input('Stop below/above entry bar',s.sl,"quickUpdate('setup','"+t.id+':'+s.id+"','sl',this.value,false)",'Planned stop')+
 '</div></details></div>').join('')+'</div>'+
 '<details class="qj-details"><summary>Chart context (optional)</summary><div class="qj-three">'+
 drop(['Stocks','Options','Futures','Forex','Crypto','Other'],t.instrument||'Stocks',"quickUpdate('ticker','"+t.id+"','instrument',this.value,true)",'Market')+
 input('Nearby daily/weekly EMAs',t.mas,"quickUpdate('ticker','"+t.id+"','mas',this.value,false)",'10 / 20 / 50 / 200')+
 input('Weekly zones',t.weekly,"quickUpdate('ticker','"+t.id+"','weekly',this.value,false)",'Nearby weekly level')+
 input('Daily zones',t.daily,"quickUpdate('ticker','"+t.id+"','daily',this.value,false)",'Nearby daily level')+
 input('Demand zones / state / position',t.context,"quickUpdate('ticker','"+t.id+"','context',this.value,false)",'Mark on chart')+
 drop(cycleChoices,t.cycle||'',"quickUpdate('ticker','"+t.id+"','cycle',this.value,false)",'Daily cycle')+
 '</div></details></article>';
 }
 html+='<div class="qj-next"><button class="btn" onclick="quickMark(\'quickNight\',\'pre\')">Done planning <span aria-hidden="true">→</span></button></div>';
 return html;
}
function premarket(){
 const tks=planDay().tickers;
 let h='<div class="qj-head"><div><h2>Two premarket checks</h2><p>1. Price relative to EMAs. 2. The 20 EMA state. Your rule: execute only from flat conditions.</p></div></div>';
 if(!tks.length)h+='<div class="qj-empty">Your watchlist is empty. <button class="qj-link" onclick="saveStage(\'night\')">Build the night-before plan</button></div>';
 for(const t of tks){
 const shape=t.ema20||'', flat=shape==='Flat';
 h+='<div class="qj-symbol qj-premarket"><div class="qj-symbolhead"><strong>'+escaped(t.symbol)+'</strong>'+
 '<span class="qj-status '+(flat?'ready':shape?'wait':'')+'">'+(flat?'Flat condition':shape?'Wait / reassess':'Not checked')+'</span></div>'+
 '<div class="qj-two">'+
 drop(emaPlaces,t.emaRelative||'',"quickUpdate('ticker','"+t.id+"','emaRelative',this.value,false)",'Price relative to EMAs')+
 drop(emaShapes,shape,"quickUpdate('ticker','"+t.id+"','ema20',this.value,true)",'20 EMA state')+
 '</div>'+
 (shape&&shape!=='Flat'?'<p class="qj-caution">Your plan says to execute only from flat conditions. Wait for a valid setup.</p>':'')+
 '<details class="qj-details"><summary>Setups to watch ('+t.setups.length+')</summary>'+
 t.setups.map(s=>'<div class="qj-statusrow"><span>'+escaped(s.play||'Unselected event')+'</span>'+
 drop(['Watching','Premarket approved','Invalidated','Skipped'],s.status,"quickUpdate('setup','"+t.id+':'+s.id+"','status',this.value,true)",'Status')+'</div>').join('')+
 '</details></div>';
 }
 h+='<section class="qj-strip"><h3>Premarket chart</h3>'+
 checklistScreenshot('quick-premarket-checklist','premarketChecklistImage','savePremarketScreenshot','Premarket screenshot')+
 '</section>'+
 '<section class="qj-strip"><h3>Ready to observe</h3><p class="qj-sub">You do not have to take a trade. An unclear market can be a no-trade day.</p></section>'+
 '<div class="qj-next"><button class="btn" onclick="quickMark(\'quickPremarket\',\'live\')">Premarket checked <span aria-hidden="true">→</span></button></div>';
 return h;
}
function live(){
 const a=allSetups(),current=quickCurrent(),r=state();
 let h='<div class="qj-head"><div><h2>Tap as the trade unfolds</h2><p>Powerbar, large-wick tailbar, or Bull/Bear 180. Stop beyond the entry bar; add once on color change; exit on the 20 EMA two-bar break.</p></div></div>';
 if(!a.length)h+='<div class="qj-empty">No setups to monitor. <button class="qj-link" onclick="saveStage(\'night\')">Add a symbol</button></div>';
 else{
 const c=current.s,done=(act)=>c.events?.some(e=>e.action===act),status=c.status||'Watching';
 h+='<label class="qj-field qj-choice"><span>Setup you are watching</span><select onchange="quickActiveSet(this.value)">'+a.map(x=>'<option value="'+x.id+'" '+(x.id===current.id?'selected':'')+'>'+escaped(x.t.symbol+' · '+(x.s.play||'Event not chosen')+(x.s.status==='Entered'?' · In trade':''))+'</option>').join('')+'</select></label>'+
 '<div class="qj-active"><div class="qj-symbolhead"><div><strong>'+escaped(current.t.symbol)+' · '+escaped(c.play||'Setup')+'</strong>'+
 '<p class="qj-sub">'+escaped(c.zone||'Zone from chart')+' · Stop: '+escaped(c.sl||'Below/above entry bar')+'</p></div>'+
 '<span class="qj-status">'+escaped(status)+'</span></div>'+
 (current.t.ema20&&current.t.ema20!=='Flat'?'<p class="qj-caution">20 EMA marked '+escaped(current.t.ema20)+'. Your plan says to execute from flat conditions only; reassess before entering.</p>':'')+
 checklistExecutionMarkup(current.t.id,c.id)+
 '<div class="qj-actiongrid">'+
 [['Confirmation','Confirm'],['Entry','Entry'],['Add','Add once · color change'],['Close','Exit · 20 EMA 2-bar break'],['Stop out','Stopped'],['Skip','Skipped']].map(([key,label])=>{
 const tapped=done(key)||(key==='Skip'&&status==='Skipped'),disabled=(tapped||key==='Add'&&(!done('Entry')||done('Add'))||key==='Entry'&&status==='Closed');
 return '<button type="button" class="qj-action '+(tapped?'tapped':'')+'" onclick="quickTap(\''+key+'\')" '+(disabled?'disabled':'')+'>'+(tapped?'✓ ':'')+escaped(label)+'</button>';
 }).join('')+'</div>'+
 '<div class="qj-history">'+(c.events?.length?c.events.map(e=>'<span>'+escaped(e.action)+' · '+new Date(e.at).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})+'</span>').join(''):'Tap an event to record its time automatically.')+'</div>'+
 '<details class="qj-details"><summary>Trade details (optional)</summary><div class="qj-three">'+
 drop(current.t.instrument==='Options'?['Call','Put']:['Long','Short'],c.direction,"quickUpdate('setup','"+current.id+"','direction',this.value,false)",'Direction')+
 input('Entry price / premium',c.premium,"quickUpdate('setup','"+current.id+"','premium',this.value,false)")+
 input('Exit price / premium',c.exitPremium,"quickUpdate('setup','"+current.id+"','exitPremium',this.value,false)")+
 input('Realized P/L ($)',c.pnl,"quickUpdate('setup','"+current.id+"','pnl',this.value,false)")+
 input('Contracts / size',c.contracts,"quickUpdate('setup','"+current.id+"','contracts',this.value,false)")+
 input('Targets',c.tps,"quickUpdate('setup','"+current.id+"','tps',this.value,false)")+
 '</div></details></div>';
 }
 h+='<div class="qj-no-trade"><label class="qj-tick"><input type="checkbox" onchange="quickNoTrade()" '+(r.noTrade?'checked':'')+' '+(allSetups().some(x=>x.s.events?.some(e=>e.action==='Entry'))?'disabled':'')+'> No trade today</label><span class="qj-sub">A valid decision, not a missed requirement.</span></div>'+
 '<div class="qj-next"><button class="btn" onclick="saveStage(\'review\')">Go to review <span aria-hidden="true">→</span></button></div>';
 return h;
}
function review(){
 const r=rec(),w=state(),trades=allSetups().filter(x=>x.s.events?.some(e=>e.action==='Entry'));
 const grade=Object.entries(todayFocusDescriptions).map(([key,label])=>({key,label}));
 const emotional=['','Calm','Focused','Anxious','Tired','Frustrated','Distracted'];
 let h='<div class="qj-head"><div><h2>Fast post-market review</h2><p>Screenshot, emotional check, what went right/wrong, and one improvement. The rest is optional.</p></div></div>'+
 '<div class="qj-review-summary"><span>'+trades.length+' entr'+(trades.length===1?'y':'ies')+' recorded</span><span>Focus: '+escaped(r.focus||'Not set')+'</span></div>'+
 '<div class="qj-two">'+
 drop(emotional,r.notes.mindsetStatus||'',"quickUpdate('day',null,'mindsetStatus',this.value,false)",'Emotional check-in')+
 drop(['','Yes','No','No trade'],w.quickRules||'',"quickUpdate('workflow',null,'quickRules',this.value,false)",'Followed my rules?')+
 '</div>'+
 '<label class="qj-field"><span>What went right / wrong? (optional)</span><textarea rows="2" placeholder="One sentence is enough" onchange="quickUpdate(\'day\',null,\'learned\',this.value,false)">'+escaped(r.notes.learned||'')+'</textarea></label>'+
 '<label class="qj-field"><span>What could I do better? (optional)</span><textarea rows="2" placeholder="One thing for next time" onchange="quickUpdate(\'day\',null,\'changes\',this.value,false)">'+escaped(r.notes.changes||'')+'</textarea></label>'+
 checklistScreenshot('quick-review','quickReviewImage','quickSaveReviewChart','Post-review screenshot')+
 '<details class="qj-details"><summary>Mindset report card · four constraints (optional)</summary><div class="qj-four">'+
 categories.map(k=>drop(['','0','1','2','3','4'],String(r.grades[k]??''),"quickReviewGrade('"+k+"',this.value)",k)).join('')+'</div></details>'+
 '<details class="qj-details"><summary>Health reminders (sleep, nutrition, movement)</summary><div class="qj-wellness">'+
 keys.health.map((txt,i)=>'<label class="qj-tick"><input type="checkbox" '+(r.checks['health'+i]?'checked':'')+' onchange="quickHealth('+i+',this.checked)"> '+escaped(txt)+'</label>').join('')+
 '</div></details>'+
 '<div class="qj-next"><button class="btn" onclick="quickReviewed()">'+(w.finishedAt?'✓ Day saved':'Finish & save day')+'</button>'+(w.finishedAt&&days.indexOf(date)<days.length-1?'<button class="btn secondary" onclick="quickNextSession()">Plan next session →</button>':'')+'</div>'+(w.finishedAt?'<p class="qj-sub" role="status">Saved for '+escaped(date)+'. This record stays in your Calendar and remains editable.</p>':'');
 return h;
}
function quickReviewChart(){return data.studies.find(x=>x.source==='quick-review'&&x.date===date)}
async function quickSaveReviewChart(){
 try{
 const image=await imageFile('quickReviewImage');if(!image)return;
 const old=quickReviewChart();if(old)old.image=image;
 else data.studies.push({id:planId(),date,source:'quick-review',market:'Session',type:'Post-market chart',image});
 save();renderOptions();
 }catch(e){alert('Unable to save this chart. Try a smaller image.')}
}
function renderQuick(){
 const root=$('options');if(!root)return;
 const selected=stage();
 root.innerHTML='<div class="qj-shell"><div class="qj-top"><div><h2>Quick Journal</h2><p>'+escaped(date)+' · Autosaved by session date.</p></div><div class="qj-header-actions"><button class="qj-today-link" onclick="quickCurrentSession()">Current session</button><span class="qj-progress">'+(stages.findIndex(x=>x[0]===selected)+1)+' / 4</span></div></div>'+
 '<nav class="qj-steps" aria-label="Trading workflow">'+stages.map(([id,label],i)=>'<button class="'+(selected===id?'is-active':'')+'" onclick="saveStage(\''+id+'\')"><span>'+String(i+1)+'</span> '+label+'</button>').join('')+'</nav>'+
 '<div class="qj-body">'+(selected==='night'?night():selected==='pre'?premarket():selected==='live'?live():review())+'</div></div>';
}
function quickScore(d){
 const w=data.daily[d]?.workflow||{},r=data.daily[d]||{};
 const planned=wfTickers(d).length>0||!!r.focus;
 const tested=!!w.quickPremarket;
 const executed=!!w.noTrade||wfSetups(d).some(x=>(x.setup.events||[]).length);
 const reviewed=!!w.quickReview;
 return 25*([planned,tested,executed,reviewed].filter(Boolean).length);
}
function quickCompleted(d){let w=data.daily[d]?.workflow||{};return quickScore(d)===100&&!!w.quickReview}
function quickDashboard(){
 const w=state(),r=rec(),setupCount=allSetups().length,
 done=days.filter(d=>data.daily[d]&&completed(d)).length,
 n=days.indexOf(date);
 $('heroDay').textContent=n>=0?'Day '+(n+1)+' of 60':'Outside challenge';
 $('heroBar').style.width=(done/60*100)+'%';
 const st=stage(),sc=score(date);
 $('dashboard').innerHTML='<div class="qj-dashboard"><div class="qj-top"><div><h2>Today’s trading process</h2><p>'+escaped(date)+' · Stay focused on the next step.</p></div><span class="qj-progress">'+sc+'% complete</span></div>'+
 '<div class="qj-stats"><div><b>'+wfTickers(date).length+'</b><span>Symbols</span></div><div><b>'+setupCount+'</b><span>Setups</span></div><div><b>'+done+'/60</b><span>Days completed</span></div></div>'+
 '<div class="qj-dashboard-focus"><strong>Today’s Focus:</strong> '+escaped(r.focus||'Not selected')+
 (todayFocusDescriptions[r.focus]?' — '+escaped(todayFocusDescriptions[r.focus]):'')+'</div>'+
 '<button class="btn" onclick="go(\'options\')">Continue journaling · '+escaped(stages.find(x=>x[0]===st)[1])+' →</button>'+
 '<p class="qj-sub">No separate forms required. Move through Night prep → Premarket → Execution → Review.</p></div>';
}
const originalGo=go;
go=function(id){
 if(id==='daily'||id==='trades'||id==='report'){
   state().quickStage=id==='daily'?'pre':id==='trades'?'live':'review';
   save();id='options';
 }
 originalGo(id);
};
tabs.splice(0,tabs.length,
 ['dashboard','Dashboard','⌂'],['options','Journal','☑'],
 ['studies','Chart Studies','▥'],['analytics','Analytics','▥'],
 ['calendar','Calendar','▦'],['resources','Resources','◇'],['settings','Settings','⚙']);
renderOptions=renderQuick;
renderDashboard=quickDashboard;
score=quickScore;
completed=quickCompleted;
render();
Object.assign(window,{saveStage,quickUpdate,quickSetFocus,quickSymbol,quickAddSetup,
 quickDeleteSetup,quickRemoveSymbol,quickActiveSet,quickTap,quickNoTrade,
 quickMark,quickReviewed,quickReviewGrade,quickHealth,quickSaveReviewChart,quickNextSession,quickCurrentSession,
 checklistSetNight,checklistSetExecution,saveNightScreenshot,savePremarketScreenshot});
const initialDay=quickSessionDay(quickToday());
if(initialDay&&initialDay!==date)quickOpenSession(initialDay);
if(window.addEventListener)window.addEventListener('focus',quickRollover);
if(document.addEventListener)document.addEventListener('visibilitychange',()=>{if(!document.hidden)quickRollover()});
if(typeof setInterval==='function')setInterval(quickRollover,60000);
})();