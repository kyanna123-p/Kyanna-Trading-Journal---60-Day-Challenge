
/* The same watchlist and trade data powers all four workflow stages. */
function workflowNav(){
 const make=function(x){const id=x[0],label=x[1],icon=x[2];return '<button class="nav '+(tab===id?'active':'')+'" onclick="go(\''+id+'\')"><span class="navicon">'+icon+'</span><span>'+label+'</span></button>'};
 const stage=['options','daily','trades','report'];
 $('nav').innerHTML=make(tabs[0])+'<div class="nav-group-label">WORKFLOW</div>'+tabs.filter(x=>stage.includes(x[0])).map(make).join('')+'<div class="nav-group-label">TOOLS & HISTORY</div>'+tabs.filter(x=>!stage.includes(x[0])&&x[0]!=='dashboard').map(make).join('');
 $('mobileNav').innerHTML=tabs.map(x=>'<button class="'+(tab===x[0]?'active':'')+'" onclick="go(\''+x[0]+'\')">'+x[2]+'<span>'+x[1]+'</span></button>').join('');
}
function workflowOptionAction(tid,sid,action){optionEvent(tid,sid,action);renderTrades();renderDashboard()}
function workflowOptionSet(tid,sid,key,value){optionEditSetup(tid,sid,key,value);if(key==='status')render()}
function workflowExecution(){
 const tickers=planDay().tickers;
 let html='<div class="panel"><div class="row"><div><h2>3 · Execution · '+esc(date)+'</h2><p>Track confirmation, entry, stop, targets and exits with quick taps. Your night-before plan carries forward automatically.</p></div><button class="btn secondary" onclick="go(\'daily\')">Premarket check</button></div></div>';
 let n=0;
 tickers.forEach(t=>(t.setups||[]).forEach(s=>{
 n++;const args="'"+t.id+"','"+s.id+"'";
 html+='<div class="panel" style="margin-top:10px"><div class="row"><div><h2>'+esc(t.symbol)+' · '+esc(s.play)+' · '+esc(s.direction)+'</h2><p>'+esc(s.zone||'Zone unmarked')+' · '+esc(s.timeframe||'5m')+' · '+esc(t.instrument||'Options')+'</p></div><span class="pill">'+esc(s.status||'Watching')+'</span></div>';
 html+='<div class="inline2"><div class="hint"><b>Trigger</b><p>'+esc(s.confirmation||'—')+' · '+esc(s.entry||'—')+'</p></div><div class="hint"><b>Risk</b><p>Stop: '+esc(s.sl||'—')+' · Targets: '+esc(s.tps||'—')+'</p></div></div>';
 html+='<div class="actions">'+['Confirmation','Entry','Add','TP1','TP2','Breakeven','Runner','Stop out','Close'].map(a=>'<button class="btn secondary small" onclick="workflowOptionAction('+args+',\''+a+'\')">'+a+'</button>').join('')+'</div>';
 html+='<p class="muted">'+((s.events||[]).length?s.events.map(e=>esc(e.action)+' · '+new Date(e.at).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})).join(' → '):'No execution events yet')+'</p>';
 html+='<div class="inline2"><div class="field"><label>Setup status</label>'+optionSelect(optionStatuses,s.status,"workflowOptionSet("+args+",'status',this.value)")+'</div>';
 html+=optionInput('Actual entry / premium',s.premium,"workflowOptionSet("+args+",'premium',this.value)",'','number');
 html+=optionInput('Actual exit / premium',s.exitPremium,"workflowOptionSet("+args+",'exitPremium',this.value)",'','number');
 html+=optionInput('Realized P/L ($)',s.pnl,"workflowOptionSet("+args+",'pnl',this.value)",'','number');
 html+='<div class="field"><label>Followed rules?</label>'+optionSelect(['','Yes','No','No trade'],s.rules,"workflowOptionSet("+args+",'rules',this.value)")+'</div>';
 html+=optionInput('Brief lesson',s.note,"workflowOptionSet("+args+",'note',this.value)")+'</div></div>';
 }));
 if(!n)html+='<div class="panel"><div class="empty">No setups planned. Start with the night-before watchlist.</div><button class="btn" onclick="go(\'options\')">Build watchlist</button></div>';
 html+='<div class="panel" style="margin-top:10px"><div class="row"><h2>Session completion</h2><button class="btn" onclick="go(\'report\')">Go to Review</button></div>'+wfToggle('market')+'</div>';
 let old=data.trades.filter(t=>t.date===date);
 if(old.length)html+='<details class="panel" style="margin-top:10px"><summary>Historical journal entries ('+old.length+')</summary><div class="cardlist">'+old.map(t=>'<div class="item"><b>'+esc(t.market||'Trade')+'</b><p>'+esc(t.setup||'')+' · P/L '+esc(t.pnl??'—')+'</p></div>').join('')+'</div></details>';
 $('trades').innerHTML=html;
}
function workflowReview(){
 __stageOriginalReview();
 const r=rec(),s=wfSetups(date);
 $('report').innerHTML='<div class="panel" style="margin-bottom:12px"><h2>4 · Post-Market Review · '+esc(date)+'</h2><p>Reflect on executions, then grade the four constraints. A no-trade day can still be a successful process day.</p>'+wfToggle('review')+
 '<div class="inline2">'+field('One lesson (optional)','learned',r.notes.learned||'','textarea')+field('Tomorrow’s adjustment (optional)','changes',r.notes.changes||'','textarea')+'</div>'+
 '<div class="cardlist">'+(s.length?s.map(p=>'<div class="item"><div class="row"><b>'+esc(p.symbol)+' · '+esc(p.setup.play)+'</b><span class="pill">'+esc(p.setup.status)+'</span></div><p>Rules: '+esc(p.setup.rules||'Not graded')+' · P/L: '+(p.setup.pnl===''?'—':'$'+esc(p.setup.pnl))+'</p></div>').join(''):'<p class="muted">No setups planned this session.</p>')+'</div></div>'+$('report').innerHTML;
}
function workflowCalendar(){
 const fmt=x=>new Date(x+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
 let rows=days.map((d,i)=>{
 const r=data.daily[d],done=r&&completed(d),sc=r?score(d):null,early=calendarMode()==='nyse'&&NYSE_EARLY_CLOSE[d];
 return '<button class="calendar-day '+(date===d?'current':'')+'" onclick="selectDate(\''+d+'\');go(\'dashboard\')"><b>Day '+(i+1)+'</b><span>'+fmt(d)+'</span>'+(early?'<span class="tag">'+esc(NYSE_EARLY_CLOSE[d])+'</span>':'')+'<small>'+(done?'✓ Complete':sc===null?'Not started':sc+'/100')+'</small></button>';
 }).join('');
 let exclusions=calendarExcludedWithin(start,days[59]);
 let skipped=exclusions.map(x=>'<span class="pill">'+fmt(x.date)+' · '+esc(x.reason)+'</span>').join('');
 $('calendar').innerHTML='<div class="panel"><div class="row"><div><h2>60-Day Challenge Calendar</h2><p>Day 1: '+fmt(days[0])+' · Day 60: '+fmt(days[59])+' · '+calendarScheduleTitle()+'</p></div><button class="btn secondary small" onclick="go(\'settings\')">Edit trading calendar</button></div><p class="muted">Full closures do not count. Early-close sessions still count.</p><div class="calendar-grid">'+rows+'</div><div style="margin-top:14px"><h3>Excluded non-trading dates ('+exclusions.length+')</h3><div class="actions">'+(skipped||'<span class="muted">None in this period</span>')+'</div><p class="muted">The NYSE calendar is exchange-verified for 2026–2028; other instruments may use different sessions.</p></div></div>';
}
const __stageOriginalReview=renderReport;
nav=workflowNav;renderTrades=workflowExecution;renderReport=workflowReview;renderCalendar=workflowCalendar;
const __stageBaseRender=render;
render=function(){calendarAdoptCloudSettings();__stageBaseRender()};
render();
