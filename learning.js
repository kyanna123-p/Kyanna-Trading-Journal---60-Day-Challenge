/* Technical Analysis Study Center — standalone, no journal data mutations. */
(function(){
const lessons=[
 {id:'bull',title:'Bullish Reversal Patterns',intro:'Potential upward reversals. Context and confirmation matter.',cards:[
 ['Hammer','A small body near the high and a long lower wick after a decline.','Potential bullish rejection; look for confirmation near support.',[[70,76,63,74],[72,73,54,57],[56,58,38,42],[43,46,23,27],[28,33,6,31]]],
 ['Bullish Engulfing','A bullish real body engulfs the prior bearish real body.','Potential shift toward buying pressure after a decline.',[[68,72,52,56],[56,60,39,43],[44,49,27,30],[32,34,17,19],[15,41,12,44]]],
 ['Morning Star','Three-candle formation: bearish candle, small-bodied candle, then bullish candle.','Potential bullish reversal; third candle supplies confirmation.',[[66,69,49,53],[52,55,34,38],[39,42,17,20],[20,25,14,22],[18,40,16,43]]],
 ['Three White Soldiers','Three consecutive strong bullish candles.','Suggests sustained buying pressure; consider whether price is extended.',[[40,43,26,28],[30,46,27,43],[42,60,39,57],[55,76,53,73],[72,90,70,87]]]
,
 ['Inverted Hammer','Small body near the low with a long upper wick after a decline.','Potential bullish reversal; wait for a confirming bullish candle.',[[88,72,69,91],[73,57,54,77],[58,42,39,62],[43,28,25,47],[28,32,25,60],[32,49,29,52]]],
 ['Piercing Line','A bullish candle opens below the prior bearish close and closes above its body midpoint.','Potential bullish reversal after selling pressure.',[[85,70,67,88],[70,55,52,73],[55,33,30,58],[28,48,24,52],[48,60,45,63]]],
 ['Abandoned Baby Bottom','A doji gaps below a bearish candle, followed by a bullish gap and recovery.','Rare three-candle bullish reversal; gaps are important.',[[86,70,67,90],[70,45,41,73],[33,33,29,37],[45,68,42,71]]],
 ['Morning Star Doji','A morning star whose middle candle is a doji.','Indecision followed by bullish confirmation.',[[84,69,66,87],[69,42,39,72],[34,34,29,38],[40,65,37,68]]],
 ['Tweezer Bottoms','Two candles test approximately the same low.','Potential support and bullish reversal with confirmation.',[[81,66,62,84],[66,49,45,69],[49,34,27,52],[33,47,27,51],[47,63,44,66]]],
 ['Three Line Strike (Bullish Reversal)','A four-candle formation featuring three bearish candles and a large bullish fourth candle.','The final bullish candle can signal a shift; assess context.',[[87,76,73,90],[76,62,59,79],[62,49,46,65],[49,36,33,52],[34,82,31,85]]]
 ]},
 {id:'bear',title:'Bearish Reversal Patterns',intro:'Potential downward reversals. Look for rejection and confirmation.',cards:[
 ['Shooting Star','Small body near the low with a long upper wick after an advance.','Potential bearish rejection near resistance.',[[30,45,28,42],[42,60,40,57],[56,73,54,70],[70,86,68,83],[83,85,79,99]]],
 ['Hanging Man','Small body and long lower wick after an advance.','Potential bearish warning only with subsequent confirmation.',[[30,45,28,42],[42,60,40,57],[56,73,54,70],[70,86,68,83],[84,88,57,86]]],
 ['Bearish Engulfing','A bearish real body engulfs the prior bullish real body.','Potential shift toward selling pressure after a rise.',[[28,43,26,40],[40,58,38,55],[54,72,52,69],[68,81,66,78],[84,57,53,87]]],
 ['Evening Star','Three-candle formation: bullish candle, small-bodied candle, then bearish candle.','Potential bearish reversal after an upward move.',[[29,45,27,42],[42,60,40,57],[57,77,55,74],[76,79,73,75],[75,53,50,78]]],
 ['Three Black Crows','Three consecutive substantial bearish candles.','Suggests sustained selling pressure.',[[85,71,69,87],[72,58,56,74],[60,45,43,62],[46,32,30,48],[33,20,18,35]]]
,
 ['Evening Star Doji','An evening star whose middle candle is a doji.','Indecision followed by bearish confirmation.',[[17,33,14,36],[33,57,30,60],[65,65,61,69],[57,30,27,60]]],
 ['Abandoned Baby Top','A doji gaps above a bullish candle, followed by a bearish gap and decline.','Rare three-candle bearish reversal; gaps are important.',[[17,34,14,37],[34,60,31,63],[73,73,69,77],[60,32,29,63]]],
 ['Dark Cloud Cover','A bearish candle opens above the prior bullish close and closes below its body midpoint.','Potential bearish reversal after an advance.',[[16,32,13,35],[32,50,29,53],[50,76,47,79],[81,58,55,84],[58,44,41,61]]],
 ['Tweezer Tops','Two candles test approximately the same high.','Potential resistance and bearish reversal with confirmation.',[[18,33,15,36],[33,52,30,55],[52,70,49,77],[70,57,54,77],[57,39,36,60]]],
 ['Three Line Strike (Bearish Reversal)','A four-candle formation featuring three bullish candles and a large bearish fourth candle.','The final bearish candle can signal a shift; assess context.',[[15,28,12,31],[28,43,25,46],[43,58,40,61],[58,74,55,77],[76,20,17,79]]]
 ]},
 {id:'neutral',title:'Candlesticks',intro:'Learn bullish and bearish candle anatomy. Either color can express indecision when the body is small.',cards:[
 ['Bullish Candle','A green candle closes above its opening price.','The body shows the open-to-close move; the wicks show the high and low.',[[35,70,27,79]]],
 ['Bearish Candle','A red candle closes below its opening price.','The body shows the open-to-close move; the wicks show the high and low.',[[70,35,27,79]]],
 ['Neutral Green Candle','A small green real body with upper and lower wicks.','Buyers and sellers are relatively balanced despite the slightly higher close.',[[49,53,23,78]]],
 ['Neutral Red Candle','A small red real body with upper and lower wicks.','Buyers and sellers are relatively balanced despite the slightly lower close.',[[53,49,23,78]]]
 ]},
 {id:'charts',title:'Chart Formations',intro:'Formations describe structure; breakout direction needs confirmation.',cards:[
 ['Symmetrical Triangle','Converging highs and lows create a narrowing range.','Wait for a confirmed break rather than predicting direction.',[[30,45,24,48],[44,29,27,47],[31,43,29,45],[42,34,32,44],[35,40,33,42]]]
 ]}
];
const all=lessons.flatMap(x=>x.cards.map(c=>({lesson:x,card:c})));
let section='home',chosen=null,idx=0,answered=null,score=0,order=[];
/* Each diagram uses valid OHLC values (open, close, low, high), not the old inconsistent placeholders. */
const shapes={
'Hammer':[[88,73,69,91],[74,59,55,77],[60,45,41,63],[46,31,27,49],[31,36,8,39],[36,52,32,55],[52,68,48,71]],
'Bullish Engulfing':[[88,73,69,91],[74,59,55,77],[60,45,41,63],[46,31,27,49],[33,23,19,37],[19,43,16,47],[43,58,40,61]],
'Morning Star':[[85,70,67,89],[72,56,53,75],[58,33,29,61],[30,32,25,36],[31,57,28,60],[57,69,54,72]],
'Three White Soldiers':[[77,64,60,81],[65,50,46,69],[50,58,47,62],[57,73,54,77],[72,89,69,93]],
'Shooting Star':[[17,33,14,36],[33,49,30,52],[49,65,46,68],[65,80,62,83],[81,77,74,99],[77,62,59,80],[62,49,46,65]],
'Hanging Man':[[17,33,14,36],[33,49,30,52],[49,65,46,68],[65,80,62,83],[80,77,50,83],[77,62,59,80]],
'Bearish Engulfing':[[17,33,14,36],[33,49,30,52],[49,65,46,68],[65,80,62,83],[78,87,75,90],[90,64,61,93],[64,48,45,67]],
'Evening Star':[[15,30,12,33],[30,47,27,50],[47,73,44,76],[76,74,71,79],[74,48,45,77],[48,34,31,51]],
'Three Black Crows':[[18,34,15,37],[34,51,31,54],[51,44,41,54],[44,27,24,47],[28,12,9,31]],
'Bullish Candle':[[35,70,27,79]],
'Bearish Candle':[[70,35,27,79]],
'Neutral Green Candle':[[49,53,23,78]],
'Neutral Red Candle':[[53,49,23,78]],
'Support Rejection':[[79,66,62,83],[66,50,46,70],[50,32,28,54],[32,40,20,44],[40,57,36,60],[57,72,54,76]],
'Resistance Rejection':[[22,39,19,42],[39,56,36,59],[56,74,53,77],[74,69,67,85],[69,51,48,72],[51,37,34,54]],
'Breakout and Retest':[[23,37,20,40],[37,52,34,55],[52,69,49,72],[69,83,66,86],[83,72,68,87],[72,91,69,94]],
'Symmetrical Triangle':[[30,65,24,70],[65,38,33,69],[38,59,35,63],[59,43,39,62],[43,54,41,57],[54,48,45,56]]
};
Object.assign(shapes,{
"Inverted Hammer":[[88,72,69,91],[73,57,54,77],[58,42,39,62],[43,28,25,47],[28,32,25,60],[32,49,29,52]],
"Piercing Line":[[85,70,67,88],[70,55,52,73],[55,33,30,58],[28,48,24,52],[48,60,45,63]],
"Abandoned Baby Bottom":[[86,70,67,90],[70,45,41,73],[33,33,29,37],[45,68,42,71]],
"Morning Star Doji":[[84,69,66,87],[69,42,39,72],[34,34,29,38],[40,65,37,68]],
"Tweezer Bottoms":[[81,66,62,84],[66,49,45,69],[49,34,27,52],[33,47,27,51],[47,63,44,66]],
"Three Line Strike (Bullish Reversal)":[[87,76,73,90],[76,62,59,79],[62,49,46,65],[49,36,33,52],[34,82,31,85]],
"Evening Star Doji":[[17,33,14,36],[33,57,30,60],[65,65,61,69],[57,30,27,60]],
"Abandoned Baby Top":[[17,34,14,37],[34,60,31,63],[73,73,69,77],[60,32,29,63]],
"Dark Cloud Cover":[[16,32,13,35],[32,50,29,53],[50,76,47,79],[81,58,55,84],[58,44,41,61]],
"Tweezer Tops":[[18,33,15,36],[33,52,30,55],[52,70,49,77],[70,57,54,77],[57,39,36,60]],
"Three Line Strike (Bearish Reversal)":[[15,28,12,31],[28,43,25,46],[43,58,40,61],[58,74,55,77],[76,20,17,79]]
});
/* Pattern-defining candles only: distinguish body gaps from full wick gaps. */
Object.assign(shapes,{
'Morning Star':[[88,49,45,92],[42,48,38,52],[49,83,46,87]],
'Morning Star Doji':[[88,49,43,92],[46,46,41,52],[49,84,44,88]],
'Abandoned Baby Bottom':[[88,53,48,92],[31,31,26,36],[49,84,44,88]],
'Evening Star':[[12,51,8,55],[58,52,49,63],[51,16,12,55]],
'Evening Star Doji':[[12,51,8,56],[54,54,47,59],[51,16,12,56]],
'Abandoned Baby Top':[[12,47,8,52],[69,69,64,74],[49,16,12,54]]
});
function diagram(c,triangle=false,name=''){
 const bars=shapes[name]||c;
 const min=Math.min(...bars.map(v=>v[2])),max=Math.max(...bars.map(v=>v[3]));
 const y=n=>150-(n-min)/(max-min||1)*125;
 const spacing=260/Math.max(1,bars.length-1);
 let out='<svg viewBox="0 0 340 175" role="img" aria-label="'+name+' candlestick chart" style="width:100%;max-width:430px;background:rgba(10,7,24,.55);border-radius:12px">';
 if(triangle)out+='<path d="M35 27 L305 88 L35 150" fill="none" stroke="#b983ff" stroke-width="2" stroke-dasharray="5 5"/>';
 bars.forEach((v,i)=>{const [o,cl,lo,hi]=v,x=40+i*spacing,up=cl>=o,color=up?'#20d69a':'#f25565',top=Math.min(y(o),y(cl)),h=Math.max(3,Math.abs(y(o)-y(cl)));out+='<line x1="'+x+'" x2="'+x+'" y1="'+y(hi)+'" y2="'+y(lo)+'" stroke="'+color+'" stroke-width="2.5"/><rect x="'+(x-10)+'" y="'+top+'" width="20" height="'+h+'" rx="1.5" fill="'+color+'"/>';});
 const highlighted=({'Morning Star':[0,1,2],'Morning Star Doji':[0,1,2],'Abandoned Baby Bottom':[0,1,2],'Evening Star':[0,1,2],'Evening Star Doji':[0,1,2],'Abandoned Baby Top':[0,1,2],Hammer:[4], 'Bullish Engulfing':[4,5], 'Morning Star':[2,3,4], 'Shooting Star':[4], 'Hanging Man':[4], 'Bearish Engulfing':[4,5], 'Evening Star':[2,3,4],'Neutral Green Candle':[0],'Neutral Red Candle':[0]})[name];
 if(highlighted){const x1=40+highlighted[0]*spacing-17,x2=40+highlighted[highlighted.length-1]*spacing+17;out+='<rect x="'+x1+'" y="9" width="'+(x2-x1)+'" height="153" rx="10" fill="none" stroke="#b983ff" stroke-width="2" opacity=".85"/>';}
 return out+'</svg>';
}
function checklist(c){
 const n=c[0],d=c[1],m=c[2];
 const points=[d,m];
 if(/Abandoned Baby/.test(n))points.push('The doji must be fully separated from both neighbors, including the wicks.');
 else if(/Engulfing/.test(n))points.push('The second real body engulfs the first real body; wick overlap is not required.');
 else if(/Hammer/.test(n))points.push('Compare the long wick with the small real body and check preceding trend.');
 else if(/Piercing Line|Dark Cloud Cover/.test(n))points.push('Compare the second close with the midpoint of the previous real body.');
 else if(/Star/.test(n))points.push('Identify the three defining candles and the middle candle body.');
 else points.push('Check the preceding trend and wait for confirmation.');
 return '<div style="margin-top:12px;padding:12px 14px;border:1px solid rgba(184,132,255,.34);background:rgba(130,75,180,.10);border-radius:12px"><strong style="color:#dcb7ff">Key takeaways</strong>'+points.map(t=>'<div style="display:flex;gap:10px;margin-top:8px;align-items:flex-start"><span style="color:#36d8a3">✓</span><span>'+t+'</span></div>').join('')+'</div>';
}
function wrap(inner){return '<div class="panel" style="margin-top:16px"><h2>Technical Analysis Study Center</h2><p class="muted">Visual reference and pattern recognition, based on your training notes. Patterns are not trade guarantees.</p>'+inner+'</div>'}
function btn(label,fn){return '<button class="btn secondary" onclick="'+fn+'">'+label+'</button>'}
function renderCenter(){const el=document.getElementById('technicalStudyCenter');if(!el)return;
 if(section==='home'){el.innerHTML=wrap('<div class="grid">'+lessons.map((l,i)=>'<div class="panel span6"><h3>'+l.title+'</h3><p>'+l.intro+'</p><div class="actions">'+btn('Read Article',"studyOpen("+i+")")+' '+btn('Test Your Knowledge',"studyStart("+i+")")+'</div></div>').join('')+'<div class="panel span6"><h3>Mixed Challenge</h3><p>Identify patterns across all categories.</p>'+btn('Test Your Knowledge',"studyStart(-1)")+'</div></div>');return}
 if(section==='article'){let l=lessons[chosen];el.innerHTML=wrap(btn('← All categories','studyHome()')+'<h3>'+l.title+'</h3><p>'+l.intro+'</p>'+l.cards.map(c=>'<div style="padding:18px;margin:14px 0;border:1px solid rgba(191,132,255,.4);border-radius:16px;background:rgba(14,8,31,.36);backdrop-filter:blur(6px)"><h3 style="color:#e6baff">'+c[0]+'</h3>'+diagram(c[3],c[0]==='Symmetrical Triangle',c[0])+'<h4 style="color:#dcb7ff;margin:12px 0 4px">Pattern description</h4><p>'+c[1]+'</p>'+checklist(c)+'</div>').join('')+'<div class="actions">'+btn('Test Your Knowledge',"studyStart("+chosen+")")+'</div>');return}
 if(section==='done'){el.innerHTML=wrap('<h3>Round complete</h3><p style="font-size:24px"><b>'+score+' / '+order.length+'</b> correct</p><div class="actions">'+btn('Try Again',"studyStart("+chosen+")")+' '+btn('Categories','studyHome()')+'</div>');return}
 const c=order[idx].card,options=[c[0],...all.map(x=>x.card[0]).filter(n=>n!==c[0])].slice(0,4);const offset=idx%4;const rotated=options.slice(offset).concat(options.slice(0,offset));el.innerHTML=wrap(btn('← Categories','studyHome()')+'<h3>Test Your Knowledge · '+(idx+1)+' / '+order.length+'</h3><p>What pattern is shown?</p><div style="text-align:center;padding:12px;border-radius:12px;background:rgba(130,130,130,.08)">'+diagram(c[3],c[0]==='Symmetrical Triangle',c[0])+'</div><div class="actions" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">'+rotated.map(n=>'<button class="btn secondary" '+(answered!==null?'disabled':'')+' onclick="studyAnswer('+JSON.stringify(n).replace(/"/g,'&quot;')+')">'+n+'</button>').join('')+'</div>'+(answered===null?'':'<p><b>'+(answered===c[0]?'Correct':'Not quite — '+c[0])+'</b></p><p>'+c[1]+' '+c[2]+'</p>'+btn(idx===order.length-1?'See score':'Next pattern','studyNext()')))}
window.studyHome=()=>{section='home';renderCenter()};
window.studyOpen=i=>{chosen=i;section='article';renderCenter()};
window.studyStart=i=>{chosen=i;order=(i<0?all:lessons[i].cards.map(c=>({lesson:lessons[i],card:c}))).slice();idx=0;score=0;answered=null;section='quiz';renderCenter()};
window.studyAnswer=n=>{if(answered!==null)return;answered=n;if(n===order[idx].card[0])score++;renderCenter()};
window.studyNext=()=>{idx++;answered=null;if(idx>=order.length)section='done';renderCenter()};
const previous=renderResources;
renderResources=function(){previous();const el=document.getElementById('resources');el.insertAdjacentHTML('beforeend','<div id="technicalStudyCenter"></div>');renderCenter()};
renderResources();
})();
