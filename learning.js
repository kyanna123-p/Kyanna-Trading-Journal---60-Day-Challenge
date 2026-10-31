/* Technical Analysis Study Center — standalone, no journal data mutations. */
(function(){
const lessons=[
 {id:'bull',title:'Bullish Patterns',intro:'Potential upward reversals. Context and confirmation matter.',cards:[
 ['Hammer','A small body near the high and a long lower wick after a decline.','Potential bullish rejection; look for confirmation near support.',[[70,76,63,74],[72,73,54,57],[56,58,38,42],[43,46,23,27],[28,33,6,31]]],
 ['Bullish Engulfing','A bullish real body engulfs the prior bearish real body.','Potential shift toward buying pressure after a decline.',[[68,72,52,56],[56,60,39,43],[44,49,27,30],[32,34,17,19],[15,41,12,44]]],
 ['Morning Star','Three-candle formation: bearish candle, small-bodied candle, then bullish candle.','Potential bullish reversal; third candle supplies confirmation.',[[66,69,49,53],[52,55,34,38],[39,42,17,20],[20,25,14,22],[18,40,16,43]]],
 ['Three White Soldiers','Three consecutive strong bullish candles.','Suggests sustained buying pressure; consider whether price is extended.',[[40,43,26,28],[30,46,27,43],[42,60,39,57],[55,76,53,73],[72,90,70,87]]]
 ]},
 {id:'bear',title:'Bearish Patterns',intro:'Potential downward reversals. Look for rejection and confirmation.',cards:[
 ['Shooting Star','Small body near the low with a long upper wick after an advance.','Potential bearish rejection near resistance.',[[30,45,28,42],[42,60,40,57],[56,73,54,70],[70,86,68,83],[83,85,79,99]]],
 ['Hanging Man','Small body and long lower wick after an advance.','Potential bearish warning only with subsequent confirmation.',[[30,45,28,42],[42,60,40,57],[56,73,54,70],[70,86,68,83],[84,88,57,86]]],
 ['Bearish Engulfing','A bearish real body engulfs the prior bullish real body.','Potential shift toward selling pressure after a rise.',[[28,43,26,40],[40,58,38,55],[54,72,52,69],[68,81,66,78],[84,57,53,87]]],
 ['Evening Star','Three-candle formation: bullish candle, small-bodied candle, then bearish candle.','Potential bearish reversal after an upward move.',[[29,45,27,42],[42,60,40,57],[57,77,55,74],[76,79,73,75],[75,53,50,78]]],
 ['Three Black Crows','Three consecutive substantial bearish candles.','Suggests sustained selling pressure.',[[85,71,69,87],[72,58,56,74],[60,45,43,62],[46,32,30,48],[33,20,18,35]]]
 ]},
 {id:'neutral',title:'Neutral Patterns',intro:'Indecision patterns require surrounding price context.',cards:[
 ['Doji','Open and close are nearly equal; wicks may vary.','Signals indecision, not a guaranteed reversal.',[[50,61,40,56],[55,65,45,49],[50,51,31,70]]],
 ['Spinning Top','Small real body with upper and lower wicks.','Shows competing buying and selling pressure.',[[50,61,40,56],[55,65,45,49],[50,54,30,74]]]
 ]},
 {id:'levels',title:'Support & Resistance',intro:'Price zones where buyers or sellers have previously reacted.',cards:[
 ['Support Rejection','Price tests a support zone and rebounds.','Watch for confirmation rather than assuming the level must hold.',[[75,65,60,78],[66,53,49,69],[54,42,39,56],[43,60,35,63]]],
 ['Resistance Rejection','Price tests resistance and pulls back.','A failed push above resistance may precede a decline.',[[25,40,22,43],[40,55,38,58],[54,70,51,74],[71,53,50,75]]],
 ['Breakout and Retest','Price breaks a level and returns to test it.','Look for acceptance beyond the level and an orderly retest.',[[35,46,33,49],[47,62,44,65],[61,76,58,79],[75,69,66,78],[70,86,68,88]]]
 ]},
 {id:'charts',title:'Chart Formations',intro:'Formations describe structure; breakout direction needs confirmation.',cards:[
 ['Symmetrical Triangle','Converging highs and lows create a narrowing range.','Wait for a confirmed break rather than predicting direction.',[[30,45,24,48],[44,29,27,47],[31,43,29,45],[42,34,32,44],[35,40,33,42]]]
 ]}
];
const all=lessons.flatMap(x=>x.cards.map(c=>({lesson:x,card:c})));
let section='home',chosen=null,idx=0,answered=null,score=0,order=[];
function diagram(c,triangle=false){
 if(triangle)return '<svg viewBox="0 0 340 175" role="img" aria-label="Candlestick chart with converging trendlines" style="width:100%;max-width:430px"><path d="M25 22 L295 88 L25 151 Z" fill="rgba(168,85,247,.08)" stroke="#a78bfa" stroke-width="2" stroke-dasharray="5 5"/>'+c.map((v,i)=>candle(v,40+i*56)).join('')+'</svg>';
 return '<svg viewBox="0 0 340 175" role="img" aria-label="Unlabeled candlestick pattern" style="width:100%;max-width:430px">'+c.map((v,i)=>candle(v,40+i*(260/Math.max(c.length-1,1)))).join('')+'</svg>';
}
function candle(v,x){let [o,cl,lo,hi]=v,y=n=>165-n*1.5,up=cl>=o,color=up?'#32c99a':'#ed6386';return '<line x1="'+x+'" x2="'+x+'" y1="'+y(hi)+'" y2="'+y(lo)+'" stroke="'+color+'" stroke-width="3"/><rect x="'+(x-12)+'" y="'+y(Math.max(o,cl))+'" width="24" height="'+Math.max(3,Math.abs(y(o)-y(cl)))+'" rx="2" fill="'+color+'"/>'}
function wrap(inner){return '<div class="panel" style="margin-top:16px"><h2>Technical Analysis Study Center</h2><p class="muted">Visual reference and pattern recognition, based on your training notes. Patterns are not trade guarantees.</p>'+inner+'</div>'}
function btn(label,fn){return '<button class="btn secondary" onclick="'+fn+'">'+label+'</button>'}
function renderCenter(){const el=document.getElementById('technicalStudyCenter');if(!el)return;
 if(section==='home'){el.innerHTML=wrap('<div class="grid">'+lessons.map((l,i)=>'<div class="panel span6"><h3>'+l.title+'</h3><p>'+l.intro+'</p><div class="actions">'+btn('Read Article',"studyOpen("+i+")")+' '+btn('Test Your Knowledge',"studyStart("+i+")")+'</div></div>').join('')+'<div class="panel span6"><h3>Mixed Challenge</h3><p>Identify patterns across all categories.</p>'+btn('Test Your Knowledge',"studyStart(-1)")+'</div></div>');return}
 if(section==='article'){let l=lessons[chosen];el.innerHTML=wrap(btn('← All categories','studyHome()')+'<h3>'+l.title+'</h3><p>'+l.intro+'</p>'+l.cards.map(c=>'<div style="padding:14px 0;border-bottom:1px solid rgba(150,150,150,.2)"><h3>'+c[0]+'</h3>'+diagram(c[3],c[0]==='Symmetrical Triangle')+'<p>'+c[1]+'</p><p class="muted">'+c[2]+'</p></div>').join('')+'<div class="actions">'+btn('Test Your Knowledge',"studyStart("+chosen+")")+'</div>');return}
 if(section==='done'){el.innerHTML=wrap('<h3>Round complete</h3><p style="font-size:24px"><b>'+score+' / '+order.length+'</b> correct</p><div class="actions">'+btn('Try Again',"studyStart("+chosen+")")+' '+btn('Categories','studyHome()')+'</div>');return}
 const c=order[idx].card,options=[c[0],...all.map(x=>x.card[0]).filter(n=>n!==c[0])].slice(0,4);const offset=idx%4;const rotated=options.slice(offset).concat(options.slice(0,offset));el.innerHTML=wrap(btn('← Categories','studyHome()')+'<h3>Test Your Knowledge · '+(idx+1)+' / '+order.length+'</h3><p>What pattern is shown?</p><div style="text-align:center;padding:12px;border-radius:12px;background:rgba(130,130,130,.08)">'+diagram(c[3],c[0]==='Symmetrical Triangle')+'</div><div class="actions" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">'+rotated.map(n=>'<button class="btn secondary" '+(answered!==null?'disabled':'')+' onclick="studyAnswer('+JSON.stringify(n).replace(/"/g,'&quot;')+')">'+n+'</button>').join('')+'</div>'+(answered===null?'':'<p><b>'+(answered===c[0]?'Correct':'Not quite — '+c[0])+'</b></p><p>'+c[1]+' '+c[2]+'</p>'+btn(idx===order.length-1?'See score':'Next pattern','studyNext()')))}
window.studyHome=()=>{section='home';renderCenter()};
window.studyOpen=i=>{chosen=i;section='article';renderCenter()};
window.studyStart=i=>{chosen=i;order=(i<0?all:lessons[i].cards.map(c=>({lesson:lessons[i],card:c}))).slice();idx=0;score=0;answered=null;section='quiz';renderCenter()};
window.studyAnswer=n=>{if(answered!==null)return;answered=n;if(n===order[idx].card[0])score++;renderCenter()};
window.studyNext=()=>{idx++;answered=null;if(idx>=order.length)section='done';renderCenter()};
const previous=renderResources;
renderResources=function(){previous();const el=document.getElementById('resources');el.insertAdjacentHTML('beforeend','<div id="technicalStudyCenter"></div>');renderCenter()};
renderResources();
})();
