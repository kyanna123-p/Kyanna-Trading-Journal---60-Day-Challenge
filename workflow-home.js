function wfTickers(d){return (data.optionsPlans&&data.optionsPlans[d]&&data.optionsPlans[d].tickers)||[]}
function wfSetups(d){return wfTickers(d).flatMap(t=>(t.setups||[]).map(s=>({symbol:t.symbol,instrument:t.instrument||'Options',setup:s})))}
function wfUpdate(k,v){const r=rec();r.workflow=r.workflow||{};r.workflow[k]=v;save();render()}
function wfFocus(k){rec().focus=k;save();render()}
function wfChecks(d){const r=data.daily[d]||{},w=r.workflow||{},checks=r.checks||{},qs=['catalysts','zones','prepared','market','review'];return {plan:wfSetups(d).length>0,items:qs.map(k=>!!w[k]),health:[0,1,2].map(i=>!!checks['health'+i]),grades:categories.map(k=>r.grades&&r.grades[k]).filter(x=>x!==undefined&&x!=='')}}
function wfScore(d){const r=data.daily[d];if(!r||!r.workflow)return __previousScore(d);const c=wfChecks(d),prep=c.items.slice(0,3).filter(Boolean).length;let gradeTotal=c.grades.length?c.grades.reduce((a,b)=>a+Number(b),0)/c.grades.length:0;return Math.round((c.plan?15:0)+prep/3*20+(c.items[3]?15:0)+(c.items[4]?15:0)+c.health.filter(Boolean).length/3*15+gradeTotal/4*20)}
function wfCompleted(d){const r=data.daily[d];if(!r||!r.workflow)return __previousCompleted(d);let c=wfChecks(d);return c.plan&&c.items.every(Boolean)&&c.health.every(Boolean)&&c.grades.length===4}
function wfToggle(k){let r=rec(),w=r.workflow||{};return `<label class="check"><input type="checkbox" ${w[k]?'checked':''} onchange="wfUpdate('${k}',this.checked)"><span>${({catalysts:'Checked overnight price action and upcoming catalysts',zones:'Revalidated weekly/daily zones and moving averages',prepared:'Reviewed planned setups, confirmation and risk',market:'Market session reviewed (including no-trade days)',review:'Completed post-market review'}[k])}</span></label>`}
function wfQuickStats(){const setups=wfSetups(date);return {tickers:wfTickers(date).length,total:setups.length,ready:setups.filter(x=>x.setup.status==='Premarket approved').length,active:setups.filter(x=>x.setup.status==='Entered').length,closed:setups.filter(x=>x.setup.status==='Closed').length}}
function wfStage(label,desc,target,complete){return `<button class="panel" onclick="go('${target}')" style="text-align:left;color:inherit;min-height:100px;width:100%;cursor:pointer"><div class="row"><b>${label}</b><span class="pill">${complete?'✓ Ready':'Open'}</span></div><p style="margin:8px 0 0">${desc}</p></button>`}
function newRenderDashboard(){
 const r=rec(),stats=wfQuickStats(),w=r.workflow||{},n=days.indexOf(date),completedCount=days.filter(d=>data.daily[d]&&completed(d)).length,sc=score(date);
 $('heroDay').textContent=n>=0?'Day '+(n+1)+' of 60':'Outside challenge';
 $('heroBar').style.width=(completedCount/60*100)+'%';
 let plans=wfSetups(date).slice(0,8);
 $('dashboard').innerHTML=`<div class="grid">
 <div class="panel span12"><div class="row"><div><h2>Trading Command Center</h2><p style="margin:5px 0">Your process is the same for every instrument. Prepare the night before, verify in premarket, execute and review.</p></div><button class="btn" onclick="go('options')">Open trade planner</button></div>
 <div class="grid" style="margin-top:10px"><div class="span3"><div class="metric">${stats.tickers}</div><span class="muted">Watchlist symbols</span></div><div class="span3"><div class="metric">${stats.total}</div><span class="muted">Planned setups</span></div><div class="span3"><div class="metric">${stats.ready}</div><span class="muted">Premarket approved</span></div><div class="span3"><div class="metric">${stats.active+stats.closed}</div><span class="muted">Entered / closed setups</span></div></div></div>
 <div class="panel span12"><h2>Daily workflow · ${esc(date)}</h2><div class="grid">
 <div class="span3">${wfStage('1 · Night Before','Build watchlist, mark higher-timeframe zones and MAs, and plan multiple plays.','options',stats.total>0)}</div>
 <div class="span3">${wfStage('2 · Premarket','Recheck catalysts, zones, confirmation conditions and risk.','daily',w.catalysts&&w.zones&&w.prepared)}</div>
 <div class="span3">${wfStage('3 · Execution','Act only on confirmed setups; track entries, exits and stops.','options',w.market)}</div>
 <div class="span3">${wfStage('4 · Review','Record outcomes, rule adherence, health and mindset.','daily',w.review)}</div>
 </div></div>
 <div class="panel span6"><div class="row"><h2>Watchlist & setups</h2><button class="btn small secondary" onclick="go('options')">Manage</button></div>
 ${plans.length?'<div class="cardlist">'+plans.map(p=>`<div class="item"><div class="row"><b>${esc(p.symbol)} · ${esc(p.setup.play||'Event')}</b><span class="tag">${esc(p.setup.status||'Watching')}</span></div><div class="muted">${esc(p.instrument)} · ${esc(p.setup.direction)} · ${esc(p.setup.zone||'Location not marked')}</div></div>`).join('')+'</div>':'<div class="empty">No setups planned for this session. Start with your night-before watchlist.</div>'}
 ${wfSetups(date).length>8?`<p class="muted">Showing 8 of ${stats.total} setups. Open planner to see all.</p>`:''}</div>
 <div class="panel span6"><h2>Today's Focus & Readiness</h2>
 <p><b>Focus:</b> ${esc(r.focus||'Not chosen')} ${r.focusNote?'· '+esc(r.focusNote):''}</p>
 <p><b>Mindset:</b> ${esc(r.notes.mindsetStatus||'Not checked')}</p>
 <p><b>Health:</b> ${[0,1,2].filter(i=>r.checks['health'+i]).length}/3 reminders completed</p>
 <p><b>Process score:</b> ${sc}/100 · <b>Completed challenge days:</b> ${completedCount}/60</p>
 <button class="btn secondary small" onclick="go('daily')">Open daily check-in</button></div>
 <div class="panel span12"><div class="row"><div><h2>Mindset & four constraints</h2><p style="margin:4px 0">Grades are based on your decision-making, not whether the trade won.</p></div><button class="btn small secondary" onclick="go('report')">Open report card</button></div>
 <div class="grid">${categories.map(c=>`<div class="span3"><div class="item"><b>${c}</b><p>${r.grades[c]===undefined||r.grades[c]===''?'Not scored':esc(r.grades[c])+' / 4'}</p></div></div>`).join('')}</div></div>
 </div>`;
}
function newRenderDaily(){
 const r=rec(),w=r.workflow||{},stats=wfQuickStats(),mindset=r.notes.mindsetStatus||'';
 $('daily').innerHTML=`<div class="grid">
 <div class="panel span12"><div class="row"><div><h2>Daily Routine · ${esc(date)}</h2><p style="margin:4px 0">Only one daily check-in. Your setup details live in the Trade Planner, so nothing needs to be entered twice.</p></div><button class="btn" onclick="go('options')">Open trade planner</button></div></div>
 <div class="panel span6"><h2>1 · Night-before execution plan</h2><p>${stats.tickers} symbols · ${stats.total} potential setups · ${stats.ready} approved</p><p>Map weekly/daily levels and moving averages, then define each possible event, confirmation, stop and targets.</p><button class="btn secondary" onclick="go('options')">${stats.total?'Review planned setups':'Build tomorrow’s watchlist'}</button></div>
 <div class="panel span6"><h2>2 · Premarket recheck</h2><div class="light-inner">${wfToggle('catalysts')}${wfToggle('zones')}${wfToggle('prepared')}</div>${field('Catalyst / premarket note (optional)','catalysts',r.notes.catalysts||'','textarea')}</div>
 <div class="panel span6"><h2>Today's Focus</h2><div class="constraint-grid">${categories.map(c=>`<button class="choice ${r.focus===c?'chosen':''}" onclick="wfFocus('${c}')">${c}</button>`).join('')}</div>${field('Today’s focus (optional note)','focusDetail',r.notes.focusDetail||'','textarea')}
 <h3>Mindset check-in</h3><div class="field"><label>How ready do I feel?</label><select onchange="note('mindsetStatus',this.value)">${['','Focused','Calm','Distracted','Anxious','Tired'].map(v=>`<option value="${v}" ${mindset===v?'selected':''}>${v||'Select'}</option>`).join('')}</select></div></div>
 <div class="panel span6"><h2>Health reminders</h2><div class="light-inner">${checks('health')}</div><p class="muted">These are recorded once a day and retained in your review history.</p></div>
 <div class="panel span6"><h2>3 · Market execution</h2><p>Monitor the planned setups. Confirm the event before entry, then track stop, targets, adds and exit using quick actions.</p><div class="light-inner">${wfToggle('market')}</div><button class="btn secondary" onclick="go('options')">Open live setups</button></div>
 <div class="panel span6"><h2>4 · Post-market review</h2><div class="light-inner">${wfToggle('review')}</div>
 ${field('One lesson (optional)','learned',r.notes.learned||'','textarea')}
 ${field('Next adjustment (optional)','changes',r.notes.changes||'','textarea')}
 <button class="btn" onclick="go('report')">Complete report card</button></div></div>`;
}
function newRenderReport(){
 const r=rec(),sc=score(date),pls=wfSetups(date),taken=pls.filter(p=>['Entered','Closed'].includes(p.setup.status)),pnl=pls.reduce((s,p)=>s+(Number(p.setup.pnl)||0),0),legacy=data.trades.filter(t=>t.date===date),oldPnl=legacy.reduce((a,t)=>a+(Number(t.pnl)||0),0);
 $('report').innerHTML=`<div class="grid"><div class="panel span6"><div class="row"><h2>Four trading constraints</h2><span class="grade">${grade(sc)} · ${sc}/100</span></div>
 <p>Score your execution process, not the P/L. A disciplined loss can still earn full marks.</p>
 ${categories.map(k=>`<div class="scoreline"><label><strong>${k}</strong><small style="display:block;color:#aab;font-size:11px;line-height:1.45;margin-top:3px">${constraintHelp[k]}</small></label><select onchange="gradeSet('${k}',this.value)"><option value="">Not graded</option>${[0,1,2,3,4].map(v=>`<option value="${v}" ${String(r.grades[k])===String(v)?'selected':''}>${v} / 4</option>`).join('')}</select></div>`).join('')}</div>
 <div class="panel span6"><h2>Session review · ${esc(date)}</h2><p><b>Planned setups:</b> ${pls.length} · <b>Entered / closed:</b> ${taken.length}</p>
 <p><b>Recorded P/L:</b> $${(pnl+oldPnl).toFixed(2)} <span class="muted">(manual entries, including legacy trades)</span></p>
 <p><b>Today's Focus:</b> ${esc(r.focus||'Not selected')} · <b>Mindset:</b> ${esc(r.notes.mindsetStatus||'Not checked')}</p>
 <p><b>Health reminders:</b> ${[0,1,2].filter(i=>r.checks['health'+i]).length}/3</p>
 <p><b>Lesson:</b> ${esc(r.notes.learned||'Not recorded')}</p><p><b>Adjustment:</b> ${esc(r.notes.changes||'Not recorded')}</p>
 <div class="actions"><button class="btn secondary" onclick="go('daily')">Daily routine</button><button class="btn secondary" onclick="go('options')">Setups</button></div></div></div>`;
}
const __previousScore=score, __previousCompleted=completed;
score=wfScore;
completed=wfCompleted;
renderDashboard=newRenderDashboard;
renderDaily=newRenderDaily;
renderReport=newRenderReport;
render();
