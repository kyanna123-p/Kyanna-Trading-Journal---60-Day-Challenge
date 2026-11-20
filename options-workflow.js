/* Market-neutral trade planner; optionsPlans storage key retained for backwards compatibility. */
const optionPlays=['Bull 180','Bear 180','Anticipation Bull 180','Anticipation Bear 180','Bull Elephant Bar','Bear Elephant Bar','Bottoming Tail','Topping Tail','Narrow State Breakout','Pullback','Other'];
const optionStatuses=['Watching','Premarket approved','Confirmed','Entered','Missed','Skipped','Invalidated','Never triggered','Closed'];
function optionPlans(){return data.optionsPlans||(data.optionsPlans={})}
function planDay(){return optionPlans()[date]||(optionPlans()[date]={tickers:[],review:{}})}
function planId(){return 'op'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function planTicker(t){return planDay().tickers.find(x=>x.id===t)}
function planSetup(t,s){return planTicker(t)?.setups.find(x=>x.id===s)}
function planStore(){save();renderOptions()}
function optionAddTicker(){let v=prompt('Symbol for '+date+' (plan the night before):');if(!v)return;v=v.trim().toUpperCase().replace(/[^A-Z0-9./_-]/g,'');if(!v)return;let d=planDay();let found=d.tickers.find(t=>t.symbol===v);if(!found)d.tickers.push({id:planId(),symbol:v,instrument:'Stocks',weekly:'',daily:'',mas:'',context:'',setups:[]});planStore()}
function optionEditTicker(id,key,value){let t=planTicker(id);if(t){t[key]=value;save()}}
function optionAddSetup(id){let t=planTicker(id);if(!t)return;t.setups.push({id:planId(),play:'Bull 180',direction:(t.instrument==='Options'||!t.instrument?'Call':'Long'),zone:'',timeframe:'5m',confirmation:'',entry:'',sl:'',tps:'',expiry:'',strike:'',contracts:'',premium:'',exitPremium:'',pnl:'',rules:'',status:'Watching',events:[],note:''});planStore()}
function optionEditSetup(tid,sid,key,value){let s=planSetup(tid,sid);if(s){s[key]=value;save()}}
function optionEvent(tid,sid,action){let s=planSetup(tid,sid);if(!s)return;s.events.push({action,at:new Date().toISOString()});if(action==='Entry')s.status='Entered';if(action==='Stop out'||action==='Close')s.status='Closed';planStore()}
function optionRemove(tid,sid){if(!confirm('Remove this planned setup?'))return;let t=planTicker(tid);t.setups=t.setups.filter(s=>s.id!==sid);planStore()}
function optionRemoveTicker(id){if(!confirm('Remove ticker and its planned setups?'))return;planDay().tickers=planDay().tickers.filter(t=>t.id!==id);planStore()}
function optionSelect(values,current,change){return '<select onchange="'+change+'">'+values.map(v=>'<option value="'+esc(v)+'" '+(v===current?'selected':'')+'>'+esc(v)+'</option>').join('')+'</select>'}
function optionInput(label,value,change,placeholder='',type='text'){return '<div class="field"><label>'+label+'</label><input type="'+type+'" value="'+esc(value||'')+'" placeholder="'+esc(placeholder)+'" onchange="'+change+'"></div>'}
function renderOptions(){let root=$('options');if(!root)return;let d=planDay(),setups=d.tickers.flatMap(t=>t.setups),entered=setups.filter(s=>s.status==='Entered'||s.status==='Closed').length;
root.innerHTML='<div class="panel" style="margin-bottom:12px"><div class="row"><div><h2>Trading execution plan · '+esc(date)+'</h2><p>Night before → Premarket check → Live execution → Post-market review. The process stays the same across instruments; each symbol can have multiple setups.</p></div><button class="btn" onclick="optionAddTicker()">+ Add ticker</button></div><div class="actions"><span class="pill">'+d.tickers.length+' tickers</span><span class="pill">'+setups.length+' setups</span><span class="pill">'+entered+' executed</span></div></div>'+
d.tickers.map(t=>'<div class="panel" style="margin-bottom:12px"><div class="row"><h2>'+esc(t.symbol)+' · '+t.setups.length+' setups</h2><div class="actions"><button class="btn small" onclick="optionAddSetup(\''+t.id+'\')">+ Setup</button><button class="btn danger small" onclick="optionRemoveTicker(\''+t.id+'\')">Remove</button></div></div><div class="field" style="max-width:260px"><label>Instrument type</label>'+optionSelect(['Stocks','Options','Futures','Forex','Crypto','Other'],t.instrument||'Options',"optionEditTicker('"+t.id+"','instrument',this.value);renderOptions()")+'</div><h3>1 · Night-before higher-timeframe map</h3><div class="inline2">'+
optionInput('Weekly zones',t.weekly,"optionEditTicker('"+t.id+"','weekly',this.value)",'Nearby weekly support / resistance')+
optionInput('Daily zones',t.daily,"optionEditTicker('"+t.id+"','daily',this.value)",'Nearby daily support / resistance')+
optionInput('Nearby MAs',t.mas,"optionEditTicker('"+t.id+"','mas',this.value)",'Daily / weekly 10, 20, 50, 200')+
optionInput('Context / bias',t.context,"optionEditTicker('"+t.id+"','context',this.value)",'Trend, chop, proximity')+'</div>'+planChartHtml(t)+
t.setups.map((s,i)=>'<div class="item" style="margin:12px 0"><div class="row"><h3>Setup '+(i+1)+' · '+esc(s.play)+'</h3><button class="btn danger small" onclick="optionRemove(\''+t.id+'\',\''+s.id+'\')">Remove</button></div><div class="inline2"><div class="field"><label>Play / event</label>'+optionSelect(optionPlays,s.play,"optionEditSetup('"+t.id+"','"+s.id+"','play',this.value)")+'</div><div class="field"><label>Trade direction</label>'+optionSelect((t.instrument||'Options')==='Options'?['Call','Put']:['Long','Short'],s.direction,"optionEditSetup('"+t.id+"','"+s.id+"','direction',this.value)")+'</div>'+
optionInput('Location: zone / MA',s.zone,"optionEditSetup('"+t.id+"','"+s.id+"','zone',this.value)",'At or near which level?')+
'<div class="field"><label>Execution timeframe</label>'+optionSelect(['2m','3m','5m','15m','1h'],s.timeframe,"optionEditSetup('"+t.id+"','"+s.id+"','timeframe',this.value)")+'</div>'+
optionInput('Confirmation required',s.confirmation,"optionEditSetup('"+t.id+"','"+s.id+"','confirmation',this.value)",'What must happen before entry?')+
optionInput('Planned entry trigger',s.entry,"optionEditSetup('"+t.id+"','"+s.id+"','entry',this.value)",'Underlying price / trigger')+
optionInput('Stop / invalidation',s.sl,"optionEditSetup('"+t.id+"','"+s.id+"','sl',this.value)")+
optionInput('Targets / profit plan',s.tps,"optionEditSetup('"+t.id+"','"+s.id+"','tps',this.value)")+'</div>'+
'<h3>2 · Premarket check</h3><div class="inline2"><div class="field"><label>Setup status</label>'+optionSelect(optionStatuses,s.status,"optionEditSetup('"+t.id+"','"+s.id+"','status',this.value);renderOptions()")+'</div>'+
optionInput('Expiration (options only)',s.expiry,"optionEditSetup('"+t.id+"','"+s.id+"','expiry',this.value)",'YYYY-MM-DD','date')+
optionInput('Strike (options only)',s.strike,"optionEditSetup('"+t.id+"','"+s.id+"','strike',this.value)",'Optional','number')+
optionInput('Contracts',s.contracts,"optionEditSetup('"+t.id+"','"+s.id+"','contracts',this.value)",'Optional','number')+'</div>'+
'<h3>3 · Live execution · tap events</h3><div class="actions">'+['Confirmation','Entry','Add','TP1','TP2','Breakeven','Runner','Stop out','Close'].map(a=>'<button class="btn secondary small" onclick="optionEvent(\''+t.id+'\',\''+s.id+'\',\''+a+'\')">'+a+'</button>').join('')+'</div>'+
'<div class="muted" style="margin:8px 0">'+(s.events.length?s.events.map(e=>esc(e.action)+' · '+new Date(e.at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})).join(' → '):'No events yet')+'</div>'+
'<h3>4 · Outcome</h3><div class="inline2">'+optionInput('Actual entry price / premium',s.premium,"optionEditSetup('"+t.id+"','"+s.id+"','premium',this.value)",'Optional','number')+
optionInput('Actual exit price / premium',s.exitPremium,"optionEditSetup('"+t.id+"','"+s.id+"','exitPremium',this.value)",'Optional','number')+
optionInput('Realized P/L ($)',s.pnl,"optionEditSetup('"+t.id+"','"+s.id+"','pnl',this.value)",'Optional','number')+
'<div class="field"><label>Followed rules?</label>'+optionSelect(['','Yes','No','No trade'],s.rules,"optionEditSetup('"+t.id+"','"+s.id+"','rules',this.value)")+'</div>'+
optionInput('Optional lesson',s.note,"optionEditSetup('"+t.id+"','"+s.id+"','note',this.value)")+'</div></div>').join('')+'</div>').join('')+
'<div class="panel"><h2>Post-market review</h2><p>Health reminders, Today\'s Focus, mindset, and the four-constraint report card remain in Daily Routine and Report Card. They are recorded once per day, not per setup.</p><div class="actions"><button class="btn secondary" onclick="go(\'daily\')">Daily health / focus</button><button class="btn secondary" onclick="go(\'report\')">Mindset / report card</button></div></div>';
}

function planChartFor(t){return data.studies.find(x=>x.source==='planner'&&x.date===date&&x.market===t.symbol)}
function planChartHtml(t){const chart=planChartFor(t);return `<div class="field"><label>Premarket chart study (optional · counts toward weekly study goal)</label><input id="planImage-${t.id}" type="file" accept="image/*" onchange="planSaveChart('${t.id}')"></div>${chart&&chart.image?`<img class="photo" src="${esc(chart.image)}" alt="Saved ${esc(t.symbol)} chart" loading="lazy">`:''}`}
async function planSaveChart(tid){const t=planTicker(tid);if(!t)return;try{const img=await imageFile('planImage-'+tid);if(!img)return;const chart=planChartFor(t);if(chart){chart.image=img}else{data.studies.unshift({id:planId(),source:'planner',date,market:t.symbol,type:'Premarket plan chart',image:img})}save();renderOptions()}catch(e){alert('Could not save chart. Try a smaller image.')}}
