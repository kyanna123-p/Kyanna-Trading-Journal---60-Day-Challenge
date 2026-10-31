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
,
 ['Dragonfly Doji','A doji with a long lower wick and little or no upper wick.','Potential bullish rejection after a decline.',[[60,43,39,63],[43,27,24,46],[27,27,8,28]]]
,
 ['Bullish Spinning Top','A small green body with upper and lower shadows.','Indecision after a decline; confirmation is needed.',[[65,50,47,68],[50,35,32,53],[35,39,21,53]]]
,
 ['Bullish Kicker','A bearish candle is followed by a bullish candle opening above the prior body with a gap.','An abrupt change toward buying.',[[70,35,31,74],[57,85,54,89]]]
,
 ['Bullish Harami','A small bullish real body sits inside the prior large bearish real body.','Possible selling exhaustion after a decline.',[[85,30,27,89],[42,51,38,55]]]
,
 ['Bullish Harami Cross','A doji sits within the prior bearish real body.','Indecision after a decline.',[[85,30,27,89],[52,52,48,56]]]
,
 ['Bullish Engulfing Sandwich','A bullish reversal grouping shown in the cheat sheet.','Look for the engulfing body and surrounding candles.',[[78,49,46,81],[49,32,29,52],[28,58,25,61],[58,71,55,74]]]
,
 ['Rising Three','A strong bullish candle, three smaller pullback candles, then a bullish continuation candle.','Typically a bullish continuation formation.',[[30,72,27,76],[67,59,56,70],[59,53,50,62],[53,48,45,56],[49,84,46,88]]]
,
 ['Three Inside Up','A bearish candle, a smaller inside candle, then a bullish confirmation candle.','Potential bullish reversal.',[[83,34,31,87],[42,52,39,55],[52,77,49,81]]]
,
 ['Three Outside Up','Bullish engulfing followed by a bullish confirmation candle.','Potential bullish reversal.',[[65,47,44,68],[43,73,40,77],[72,86,69,90]]]
,
 ['Matching Low','Two bearish candles finish at approximately the same low.','Potential support and bullish reversal.',[[82,42,39,85],[68,42,39,72]]]
,
 ['Three Stars in the South','Three progressively smaller bearish candles with contracting ranges.','Potential exhaustion of a decline.',[[90,60,42,93],[73,56,48,77],[64,57,53,67]]]
,
 ['Bullish Belt Hold','A strong bullish candle opens near its low and closes much higher.','Potential buying pressure after a decline.',[[25,83,24,85]]]
,
 ['Bullish Separating Lines','A bearish candle followed by a bullish candle with approximately the same opening price.','A potential bullish continuation signal.',[[50,28,25,53],[50,82,47,85]]]
,
 ['Bullish Stick Sandwich','Two bearish candles with matching closes separated by a bullish candle.','Potential support and bullish reversal.',[[83,43,40,86],[42,69,39,72],[74,43,40,77]]]
,
 ["Bullish Tri Star","Three doji candles after a decline, with the middle doji gapping below its neighbors.","Potential exhaustion of selling; dojis require a confirmed move.",[[61,61,56,67],[38,38,33,43],[56,56,49,62]]]
,
 ["Bullish Meeting Line","After a bearish candle, a bullish candle opens lower and closes near the prior bearish close.","A meeting close may suggest selling exhaustion.",[[85,45,42,89],[26,45,23,49]]]
,
 ["Bullish Breakaway","A five-candle sequence begins with selling, gaps lower, and ends with a strong bullish recovery.","Potential bullish reversal; final candle penetrates the prior down move.",[[90,60,56,94],[49,39,35,53],[39,31,28,43],[31,29,25,36],[28,71,24,74]]]
,
 ["Bullish Side by Side White Lines","Two similar bullish candles appear beside one another following a gap higher.","Typically a bullish continuation formation rather than a reversal.",[[24,55,21,58],[68,87,65,91],[69,88,66,92]]]
,
 ["Upside Tasuki Gap","Two bullish candles form an upside gap, then a bearish candle pulls back into the gap without closing it.","A potential bullish continuation gap pattern.",[[20,46,17,50],[59,83,56,87],[80,54,52,84]]]
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
,
 ['Gravestone Doji','A doji with a long upper wick and little or no lower wick.','Potential rejection of higher prices.',[[32,49,29,52],[49,67,46,70],[68,68,67,94]]]
,
 ['Bearish Spinning Top','A small red body with upper and lower shadows.','Indecision after an advance; confirmation is needed.',[[28,44,25,47],[44,60,41,63],[62,58,44,76]]]
,
 ['Bearish Kicker','A bullish candle is followed by a bearish candle opening below the prior body with a gap.','An abrupt change toward selling.',[[25,67,21,71],[44,13,10,47]]]
,
 ['Bearish Harami','A small bearish real body sits inside the prior large bullish real body.','Possible buying exhaustion after an advance.',[[20,83,17,87],[65,54,51,69]]]
,
 ['Bearish Harami Cross','A doji sits within the prior bullish real body.','Indecision after an advance.',[[20,83,17,87],[54,54,50,58]]]
,
 ['Bearish Engulfing Sandwich','A bearish engulfing sequence with surrounding candles.','Watch for a strong bearish engulfing body.',[[30,52,27,55],[52,70,49,73],[75,43,40,78],[43,30,27,46]]]
,
 ['Falling Three','A strong bearish candle, three small rebound candles, then bearish continuation.','Typically a bearish continuation formation.',[[82,37,33,86],[42,49,39,52],[49,55,46,58],[55,60,52,63],[59,22,19,63]]]
,
 ['Three Inside Down','A bullish candle, a smaller inside candle, then bearish confirmation.','Potential bearish reversal.',[[20,75,17,79],[62,51,48,65],[51,25,22,54]]]
,
 ['Three Outside Down','Bearish engulfing followed by a bearish confirmation candle.','Potential bearish reversal.',[[30,52,27,55],[57,23,20,60],[24,11,8,27]]]
,
 ['Matching High','Two bullish candles reach approximately the same high.','Potential resistance and bearish reversal.',[[22,70,19,75],[45,70,42,75]]]
,
 ['Advance Block','Three rising bullish candles with weakening bodies or growing upper wicks.','Possible buying exhaustion.',[[20,45,17,49],[44,61,41,70],[60,69,57,82]]]
,
 ['Upside Gap Two Crows','A bullish candle is followed by two bearish candles above its body.','Potential bearish reversal after an advance.',[[22,55,19,59],[70,60,57,73],[76,56,53,79]]]
,
 ['Bearish Belt Hold','A strong bearish candle opens near its high and closes much lower.','Potential selling pressure after an advance.',[[83,25,23,85]]]
,
 ['Bearish Separating Lines','A bullish candle followed by a bearish candle with approximately the same opening price.','A potential bearish continuation signal.',[[50,76,47,79],[50,18,15,53]]]
,
 ['Bearish Stick Sandwich','Two bullish candles with matching closes separated by a bearish candle.','Potential resistance and bearish reversal.',[[20,65,17,68],[66,37,34,69],[35,65,32,68]]]
,
 ["Bearish Tri Star","Three doji candles after an advance, with the middle doji gapping above its neighbors.","Potential buying exhaustion; bearish confirmation is needed.",[[39,39,33,44],[65,65,59,70],[43,43,37,48]]]
,
 ["Bearish Meeting Line","After a bullish candle, a bearish candle opens higher and closes near the prior bullish close.","A meeting close can suggest buying exhaustion.",[[22,64,18,68],[87,64,60,90]]]
,
 ["Bearish Breakaway","A five-candle sequence starts with buying, gaps higher, and ends in a sharp bearish move.","Potential bearish reversal after an upward sequence.",[[15,45,11,49],[56,68,52,72],[68,76,64,80],[76,79,72,83],[80,28,25,84]]]
,
 ["Bearish Side by Side White Lines","Two similar bullish candles appear beside one another after a downward gap.","Often classified as bearish continuation despite green candles.",[[82,48,44,86],[36,55,32,59],[35,54,31,58]]]
,
 ["Downside Tasuki Gap","Two bearish candles form a downside gap, then a bullish candle partially retraces it without closing the gap.","A potential bearish continuation gap pattern.",[[82,53,49,86],[40,19,15,44],[22,48,19,51]]]
,
 ["Downside Gap Two Crows","A rare two-crow gap formation labeled on the reference cheat sheet.","Treat as a specialized pattern; verify trend and follow-through rather than relying on the name alone.",[[82,50,46,86],[38,24,20,42],[32,14,10,36]]]
 ]},
 {id:'neutral',title:'Candlesticks',intro:'Learn bullish and bearish candle anatomy. Either color can express indecision when the body is small.',cards:[
 ['Bullish Candle','A green candle closes above its opening price.','The body shows the open-to-close move; the wicks show the high and low.',[[35,70,27,79]]],
 ['Bearish Candle','A red candle closes below its opening price.','The body shows the open-to-close move; the wicks show the high and low.',[[70,35,27,79]]],
 ['Neutral Green Candle','A small green real body with upper and lower wicks.','Buyers and sellers are relatively balanced despite the slightly higher close.',[[49,53,23,78]]],
 ['Neutral Red Candle','A small red real body with upper and lower wicks.','Buyers and sellers are relatively balanced despite the slightly lower close.',[[53,49,23,78]]]
,
 ['Doji','The opening and closing prices are equal or nearly equal.','Shows indecision; either candle color is possible.',[[50,50,27,75]]]
,
 ['Spinning Top','A small real body with long upper and lower shadows.','Shows indecision; it can be green or red.',[[50,54,27,76]]]
,
 ['Marubozu','A long real body with little or no wick.','Shows strong directional movement within the candle.',[[25,80,25,80]]],
 ["Long Green Candle","A long green real body: the close is far above the open.","Bullish pressure over the candle period.",[[24,86,20,90]]],
 ["Long Red Candle","A long red real body: the close is far below the open.","Bearish pressure over the candle period.",[[86,24,20,90]]],
 ["Short Green Candle","A short green real body with relatively small open-to-close movement.","A small net gain; context and wicks matter.",[[45,56,40,61]]],
 ["Short Red Candle","A short red real body with relatively small open-to-close movement.","A small net loss; context and wicks matter.",[[56,45,40,61]]],
 ["Green Marubozu","A large green real body with essentially no shadows.","Strong buying pressure during the period.",[[20,85,20,85]]],
 ["Red Marubozu","A large red real body with essentially no shadows.","Strong selling pressure during the period.",[[85,20,20,85]]],
 ["Bullish Closing Marubozu","A bullish real body closing at its high, usually with a lower shadow.","Strong finish by buyers; no upper shadow.",[[30,83,23,83]]],
 ["Bearish Closing Marubozu","A bearish real body closing at its low, usually with an upper shadow.","Strong finish by sellers; no lower shadow.",[[78,25,25,87]]],
 ["Bullish Opening Marubozu","A bullish real body opening at its low, usually with an upper shadow.","Buyers controlled price immediately after the open.",[[25,79,25,87]]],
 ["Bearish Opening Marubozu","A bearish real body opening at its high, usually with a lower shadow.","Sellers controlled price immediately after the open.",[[82,29,22,82]]],
 ["Green Spinning Top","A small green real body with noticeable upper and lower shadows.","Indecision; direction depends on surrounding price action.",[[49,55,24,80]]],
 ["Red Spinning Top","A small red real body with noticeable upper and lower shadows.","Indecision; direction depends on surrounding price action.",[[55,49,24,80]]],
 ["Long-Legged Doji","Open and close are nearly equal with long shadows on both sides.","Strong two-sided volatility with little net progress.",[[52,52,17,87]]],
 ["Bullish Doji","A doji that closes slightly above its open.","Indecision despite a marginal bullish finish.",[[50,51,33,69]]],
 ["Bearish Doji","A doji that closes slightly below its open.","Indecision despite a marginal bearish finish.",[[51,50,33,69]]],
 ["Cross Doji","A very small body with a longer lower shadow and a short upper shadow.","A cross-like indecision candle; compare with the dragonfly doji.",[[64,64,20,69]]],
 ["Inverted Cross Doji","A very small body with a long upper shadow and a short lower shadow.","An inverted cross-like indecision candle.",[[36,36,31,82]]],
 ["Dragonfly Doji","Open and close near the high, with a long lower shadow and virtually no upper shadow.","Potential rejection of lower prices; reversal requires context.",[[78,78,23,79]]],
 ["Gravestone Doji","Open and close near the low, with a long upper shadow and virtually no lower shadow.","Potential rejection of higher prices; reversal requires context.",[[23,23,22,79]]],
 ["Hammer","A small real body near the high with a lower shadow at least twice the body.","Bullish reversal candidate after a decline; seek confirmation.",[[72,78,30,81]]],
 ["Hanging Man","The same long-lower-wick shape as a hammer, occurring after an advance.","Bearish warning after an uptrend; confirmation required.",[[72,78,30,81]]],
 ["Inverted Hammer","A small real body near the low with an upper shadow at least twice the body.","Bullish reversal candidate after a decline; confirmation required.",[[23,29,20,83]]],
 ["Shooting Star","The same long-upper-wick shape as an inverted hammer, after an advance.","Bearish reversal warning near highs; confirmation required.",[[29,23,20,83]]]
 ]},
 {id:'charts',title:'Chart Formations',intro:'Formations describe structure; breakout direction needs confirmation.',cards:[
 ['Bullish Symmetrical Triangle','Converging highs and lows followed by a confirmed breakout above descending resistance.','Watch for an upside break and confirmation; not every triangle breaks upward.',[[35,65,30,69],[65,43,39,68],[43,60,40,63],[60,51,48,62],[51,58,49,60],[58,84,55,88]]],
 ['Bearish Symmetrical Triangle','Converging highs and lows followed by a confirmed breakdown below rising support.','Watch for a downside break and confirmation; not every triangle breaks downward.',[[65,35,31,69],[35,57,32,60],[57,40,37,60],[40,49,38,52],[49,43,40,51],[43,18,15,46]]]
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
'Bullish Symmetrical Triangle':[[35,65,30,69],[65,43,39,68],[43,60,40,63],[60,51,48,62],[51,58,49,60],[58,84,55,88]],
'Bearish Symmetrical Triangle':[[65,35,31,69],[35,57,32,60],[57,40,37,60],[40,49,38,52],[49,43,40,51],[43,18,15,46]]
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
Object.assign(shapes,{"Dragonfly Doji":[[60,43,39,63],[43,27,24,46],[27,27,8,28]],"Bullish Spinning Top":[[65,50,47,68],[50,35,32,53],[35,39,21,53]],"Bullish Kicker":[[70,35,31,74],[57,85,54,89]],"Bullish Harami":[[85,30,27,89],[42,51,38,55]],"Bullish Harami Cross":[[85,30,27,89],[52,52,48,56]],"Bullish Engulfing Sandwich":[[78,49,46,81],[49,32,29,52],[28,58,25,61],[58,71,55,74]],"Rising Three":[[30,72,27,76],[67,59,56,70],[59,53,50,62],[53,48,45,56],[49,84,46,88]],"Three Inside Up":[[83,34,31,87],[42,52,39,55],[52,77,49,81]],"Three Outside Up":[[65,47,44,68],[43,73,40,77],[72,86,69,90]],"Matching Low":[[82,42,39,85],[68,42,39,72]],"Three Stars in the South":[[90,60,42,93],[73,56,48,77],[64,57,53,67]],"Gravestone Doji":[[32,49,29,52],[49,67,46,70],[68,68,67,94]],"Bearish Spinning Top":[[28,44,25,47],[44,60,41,63],[62,58,44,76]],"Bearish Kicker":[[25,67,21,71],[44,13,10,47]],"Bearish Harami":[[20,83,17,87],[65,54,51,69]],"Bearish Harami Cross":[[20,83,17,87],[54,54,50,58]],"Bearish Engulfing Sandwich":[[30,52,27,55],[52,70,49,73],[75,43,40,78],[43,30,27,46]],"Falling Three":[[82,37,33,86],[42,49,39,52],[49,55,46,58],[55,60,52,63],[59,22,19,63]],"Three Inside Down":[[20,75,17,79],[62,51,48,65],[51,25,22,54]],"Three Outside Down":[[30,52,27,55],[57,23,20,60],[24,11,8,27]],"Matching High":[[22,70,19,75],[45,70,42,75]],"Advance Block":[[20,45,17,49],[44,61,41,70],[60,69,57,82]],"Upside Gap Two Crows":[[22,55,19,59],[70,60,57,73],[76,56,53,79]]});
Object.assign(shapes,{"Doji":[[50,50,27,75]],"Spinning Top":[[50,54,27,76]],"Marubozu":[[25,80,25,80]],"Bullish Belt Hold":[[25,83,24,85]],"Bearish Belt Hold":[[83,25,23,85]],"Bullish Separating Lines":[[50,28,25,53],[50,82,47,85]],"Bearish Separating Lines":[[50,76,47,79],[50,18,15,53]],"Bullish Stick Sandwich":[[83,43,40,86],[42,69,39,72],[74,43,40,77]],"Bearish Stick Sandwich":[[20,65,17,68],[66,37,34,69],[35,65,32,68]]});
Object.assign(shapes,{"Long Green Candle":[[24,86,20,90]],"Long Red Candle":[[86,24,20,90]],"Short Green Candle":[[45,56,40,61]],"Short Red Candle":[[56,45,40,61]],"Green Marubozu":[[20,85,20,85]],"Red Marubozu":[[85,20,20,85]],"Bullish Closing Marubozu":[[30,83,23,83]],"Bearish Closing Marubozu":[[78,25,25,87]],"Bullish Opening Marubozu":[[25,79,25,87]],"Bearish Opening Marubozu":[[82,29,22,82]],"Green Spinning Top":[[49,55,24,80]],"Red Spinning Top":[[55,49,24,80]],"Long-Legged Doji":[[52,52,17,87]],"Bullish Doji":[[50,51,33,69]],"Bearish Doji":[[51,50,33,69]],"Cross Doji":[[64,64,20,69]],"Inverted Cross Doji":[[36,36,31,82]],"Dragonfly Doji":[[78,78,23,79]],"Gravestone Doji":[[23,23,22,79]],"Hammer":[[72,78,30,81]],"Hanging Man":[[72,78,30,81]],"Inverted Hammer":[[23,29,20,83]],"Shooting Star":[[29,23,20,83]]});
Object.assign(shapes,{"Bullish Tri Star":[[61,61,56,67],[38,38,33,43],[56,56,49,62]],"Bullish Meeting Line":[[85,45,42,89],[26,45,23,49]],"Bullish Breakaway":[[90,60,56,94],[49,39,35,53],[39,31,28,43],[31,29,25,36],[28,71,24,74]],"Bullish Side by Side White Lines":[[24,55,21,58],[68,87,65,91],[69,88,66,92]],"Upside Tasuki Gap":[[20,46,17,50],[59,83,56,87],[80,54,52,84]],"Bearish Tri Star":[[39,39,33,44],[65,65,59,70],[43,43,37,48]],"Bearish Meeting Line":[[22,64,18,68],[87,64,60,90]],"Bearish Breakaway":[[15,45,11,49],[56,68,52,72],[68,76,64,80],[76,79,72,83],[80,28,25,84]],"Bearish Side by Side White Lines":[[82,48,44,86],[36,55,32,59],[35,54,31,58]],"Downside Tasuki Gap":[[82,53,49,86],[40,19,15,44],[22,48,19,51]],"Downside Gap Two Crows":[[82,50,46,86],[38,24,20,42],[32,14,10,36]]});
function diagram(c,triangle=false,name=''){
 const bars=shapes[name]||c;
 const min=Math.min(...bars.map(v=>v[2])),max=Math.max(...bars.map(v=>v[3]));
 const y=n=>150-(n-min)/(max-min||1)*125;
 const spacing=260/Math.max(1,bars.length-1);
 let out='<svg viewBox="0 0 340 175" role="img" aria-label="'+name+' candlestick chart" style="width:100%;max-width:430px;background:rgba(10,7,24,.55);border-radius:12px">';
 if(triangle)out+='<path d="M35 27 L305 88 L35 150" fill="none" stroke="#b983ff" stroke-width="2" stroke-dasharray="5 5"/>';
 bars.forEach((v,i)=>{const [o,cl,lo,hi]=v,x=40+i*spacing,up=cl>=o,color=up?'#20d69a':'#f25565',top=Math.min(y(o),y(cl)),h=Math.max(3,Math.abs(y(o)-y(cl)));out+='<line x1="'+x+'" x2="'+x+'" y1="'+y(hi)+'" y2="'+y(lo)+'" stroke="'+color+'" stroke-width="2.5"/><rect x="'+(x-10)+'" y="'+top+'" width="20" height="'+h+'" rx="1.5" fill="'+color+'"/>';});
 const highlighted=({'Morning Star':[0,1,2],'Morning Star Doji':[0,1,2],'Abandoned Baby Bottom':[0,1,2],'Evening Star':[0,1,2],'Evening Star Doji':[0,1,2],'Abandoned Baby Top':[0,1,2],Hammer:[4], 'Bullish Engulfing':[4,5], 'Shooting Star':[4], 'Hanging Man':[4], 'Bearish Engulfing':[4,5], 'Evening Star':[2,3,4],'Neutral Green Candle':[0],'Neutral Red Candle':[0]})[name];
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
 if(section==='article'){let l=lessons[chosen];el.innerHTML=wrap(btn('← All categories','studyHome()')+'<h3>'+l.title+'</h3><p>'+l.intro+'</p>'+l.cards.map(c=>'<div style="padding:18px;margin:14px 0;border:1px solid rgba(191,132,255,.4);border-radius:16px;background:rgba(14,8,31,.36);backdrop-filter:blur(6px)"><h3 style="color:#e6baff">'+c[0]+'</h3>'+diagram(c[3],c[0].includes('Symmetrical Triangle'),c[0])+'<h4 style="color:#dcb7ff;margin:12px 0 4px">Pattern description</h4><p>'+c[1]+'</p>'+checklist(c)+'</div>').join('')+'<div class="actions">'+btn('Test Your Knowledge',"studyStart("+chosen+")")+'</div>');return}
 if(section==='done'){el.innerHTML=wrap('<h3>Round complete</h3><p style="font-size:24px"><b>'+score+' / '+order.length+'</b> correct</p><div class="actions">'+btn('Try Again',"studyStart("+chosen+")")+' '+btn('Categories','studyHome()')+'</div>');return}
 const c=order[idx].card;const pool=order.map(x=>x.card[0]).filter(n=>n!==c[0]);for(const x of all.map(x=>x.card[0]))if(x!==c[0]&&!pool.includes(x))pool.push(x);const options=[c[0],...pool.slice(idx%Math.max(1,pool.length)).concat(pool.slice(0,idx%Math.max(1,pool.length))).slice(0,3)];const offset=idx%4;const rotated=options.slice(offset).concat(options.slice(0,offset));el.innerHTML=wrap(btn('← Categories','studyHome()')+'<h3>Test Your Knowledge · '+(idx+1)+' / '+order.length+'</h3><p>What pattern is shown?</p><div style="text-align:center;padding:12px;border-radius:12px;background:rgba(130,130,130,.08)">'+diagram(c[3],c[0]==='Symmetrical Triangle',c[0])+'</div><div class="actions" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">'+rotated.map(n=>'<button class="btn secondary" '+(answered!==null?'disabled':'')+' onclick="studyAnswer('+JSON.stringify(n).replace(/"/g,'&quot;')+')">'+n+'</button>').join('')+'</div>'+(answered===null?'':'<p><b>'+(answered===c[0]?'Correct':'Not quite — '+c[0])+'</b></p><p>'+c[1]+' '+c[2]+'</p>'+btn(idx===order.length-1?'See score':'Next pattern','studyNext()')))}
window.studyHome=()=>{section='home';renderCenter()};
window.studyOpen=i=>{chosen=i;section='article';renderCenter()};
window.studyStart=i=>{chosen=i;order=(i<0?all:lessons[i].cards.map(c=>({lesson:lessons[i],card:c}))).slice();idx=0;score=0;answered=null;section='quiz';renderCenter()};
window.studyAnswer=n=>{if(answered!==null)return;answered=n;if(n===order[idx].card[0])score++;renderCenter()};
window.studyNext=()=>{idx++;answered=null;if(idx>=order.length)section='done';renderCenter()};
const previous=renderResources;
renderResources=function(){previous();const el=document.getElementById('resources');el.insertAdjacentHTML('beforeend','<div id="technicalStudyCenter"></div>');renderCenter()};
renderResources();
})();
