/* Technical Analysis Study Center — standalone, no journal data mutations. */
(function(){
const lessons=[
 {id:'bull',title:'Bullish Reversal Patterns',intro:'Potential upward reversals, with source-listed continuation and indecision formations labeled individually.',cards:[
 ['Hammer','A small body near the high and a long lower wick after a decline.','Potential bullish rejection; look for confirmation near support.',[[70,76,63,74],[72,73,54,57],[56,58,38,42],[43,46,23,27],[28,33,6,31]]],
 ['Bullish Engulfing','A bullish real body engulfs the prior bearish real body.','Potential shift toward buying pressure after a decline.',[[68,72,52,56],[56,60,39,43],[44,49,27,30],[32,34,17,19],[15,41,12,44]]],
 ['Morning Star','Three-candle formation: bearish candle, small-bodied candle, then bullish candle.','Potential bullish reversal; third candle supplies confirmation.',[[66,69,49,53],[52,55,34,38],[39,42,17,20],[20,25,14,22],[18,40,16,43]]],
 ['Three White Soldiers','Three consecutive strong bullish candles.','Suggests sustained buying pressure; consider whether price is extended.',[[40,43,26,28],[30,46,27,43],[42,60,39,57],[55,76,53,73],[72,90,70,87]]]
,
 ['Inverted Hammer','Small body near the low with a long upper wick after a decline.','Potential bullish reversal; wait for a confirming bullish candle.',[[88,72,69,91],[73,57,54,77],[58,42,39,62],[43,28,25,47],[28,32,25,60],[32,49,29,52]]],
 ['Piercing Line','A bullish candle opens below the prior bearish low and closes above the midpoint of that red real body.','Potential bullish reversal after selling pressure.',[[85,70,67,88],[70,55,52,73],[55,33,30,58],[28,48,24,52],[48,60,45,63]]],
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
 {id:'bear',title:'Bearish Reversal Patterns',intro:'Potential downward reversals, with source-listed continuation and indecision formations labeled individually.',cards:[
 ['Shooting Star','Small body near the low with a long upper wick after an advance.','Potential bearish rejection near resistance.',[[30,45,28,42],[42,60,40,57],[56,73,54,70],[70,86,68,83],[83,85,79,99]]],
 ['Hanging Man','Small body and long lower wick after an advance.','Potential bearish warning only with subsequent confirmation.',[[30,45,28,42],[42,60,40,57],[56,73,54,70],[70,86,68,83],[84,88,57,86]]],
 ['Bearish Engulfing','A bearish real body engulfs the prior bullish real body.','Potential shift toward selling pressure after a rise.',[[28,43,26,40],[40,58,38,55],[54,72,52,69],[68,81,66,78],[84,57,53,87]]],
 ['Evening Star','Three-candle formation: bullish candle, small-bodied candle, then bearish candle.','Potential bearish reversal after an upward move.',[[29,45,27,42],[42,60,40,57],[57,77,55,74],[76,79,73,75],[75,53,50,78]]],
 ['Three Black Crows','Three consecutive substantial bearish candles.','Suggests sustained selling pressure.',[[85,71,69,87],[72,58,56,74],[60,45,43,62],[46,32,30,48],[33,20,18,35]]]
,
 ['Evening Star Doji','An evening star whose middle candle is a doji.','Indecision followed by bearish confirmation.',[[17,33,14,36],[33,57,30,60],[65,65,61,69],[57,30,27,60]]],
 ['Abandoned Baby Top','A doji gaps above a bullish candle, followed by a bearish gap and decline.','Rare three-candle bearish reversal; gaps are important.',[[17,34,14,37],[34,60,31,63],[73,73,69,77],[60,32,29,63]]],
 ['Dark Cloud Cover','A bearish candle opens above the prior bullish high and closes below the midpoint of that green real body.','Potential bearish reversal after an advance.',[[16,32,13,35],[32,50,29,53],[50,76,47,79],[81,58,55,84],[58,44,41,61]]],
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
 ['Harami (Overview)','A two-candle shape: the second real body fits entirely within the first real body.','A smaller inside body can signal reduced momentum; trend context determines interpretation.',[[20,84,17,88],[65,54,51,69]]],
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
 ["Long-Legged Doji","Open and close are nearly equal with long shadows on both sides.","Strong two-sided volatility with little net progress.",[[51,52,17,87],[52,51,17,87]]],
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
,
 ["Head and Shoulders","Three peaks with the middle head above the two shoulders and a neckline beneath the pullbacks.","Bearish reversal candidate; confirmation is a break below the neckline.",[[40,60,35,65]]],
 ["Inverted Head and Shoulders","Three troughs with the middle head lower than the two shoulders and a neckline overhead.","Bullish reversal candidate; confirmation is a break above the neckline.",[[40,60,35,65]]],
 ["Double Top","Price tests a similar high twice with a pullback between the peaks.","Bearish reversal requires a break below the intervening low.",[[40,60,35,65]]],
 ["Double Bottom","Price tests a similar low twice with a rally between the troughs.","Bullish reversal requires a break above the intervening high.",[[40,60,35,65]]],
 ["Triple Top","Three tests of a similar resistance level with pullbacks in between.","Bearish reversal requires confirmed loss of the support level.",[[40,60,35,65]]],
 ["Triple Bottom","Three tests of a similar support level with rallies in between.","Bullish reversal requires confirmed break above resistance.",[[40,60,35,65]]],
 ["Ascending Triangle","Horizontal resistance and rising swing lows squeeze price toward an apex.","Often bullish, but wait for a confirmed resistance break.",[[40,60,35,65]]],
 ["Descending Triangle","Horizontal support and falling swing highs squeeze price toward an apex.","Often bearish, but wait for a confirmed support break.",[[40,60,35,65]]],
 ["Wedge Continuation","A narrowing, sloped consolidation within a larger trending move.","Direction depends on the prior trend; confirm a break of the wedge boundary.",[[40,60,35,65]]],
 ["Wedge Reversal","A narrowing sloped price structure that breaks against its prior trend.","Look for a confirmed opposite-direction breakout; wedge slope alone is not a signal.",[[40,60,35,65]]],
 ["Channels","Swing highs and lows are bounded by roughly parallel trendlines.","Trade interpretation depends on a range rejection or confirmed channel breakout.",[[40,60,35,65]]],
 ["Flags","A sharp directional pole followed by a short, countertrend parallel consolidation.","Continuation is not confirmed until the flag boundary breaks in the pole direction.",[[40,60,35,65]]],
 ["Pennants","A sharp pole followed by a brief converging consolidation.","Wait for a break from the small triangle in the pole direction.",[[40,60,35,65]]],
 ["Rectangles","Repeated tests of horizontal resistance and horizontal support.","Neutral while range-bound; direction is confirmed by a boundary break.",[[40,60,35,65]]]
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
const formationArt={"Head and Shoulders":{"p":[[20,142],[48,73],[69,113],[110,28],[138,115],[176,74],[206,117],[243,149]],"l":[[42,116,218,120]],"tag":"Neckline","bias":"bear"},"Inverted Head and Shoulders":{"p":[[20,30],[48,99],[69,65],[110,150],[138,64],[176,102],[206,61],[244,23]],"l":[[42,64,218,60]],"tag":"Neckline","bias":"bull"},"Double Top":{"p":[[20,140],[62,38],[100,107],[143,39],[185,108],[228,151]],"l":[[55,108,207,108],[50,38,158,38]],"tag":"Support","bias":"bear"},"Double Bottom":{"p":[[20,32],[62,137],[100,65],[143,136],[185,64],[228,22]],"l":[[55,65,207,65],[50,137,158,137]],"tag":"Resistance","bias":"bull"},"Triple Top":{"p":[[18,143],[54,42],[89,110],[126,43],[158,110],[193,42],[221,113],[252,149]],"l":[[45,43,203,43],[65,110,235,110]],"tag":"Support","bias":"bear"},"Triple Bottom":{"p":[[18,28],[54,135],[89,68],[126,135],[158,68],[193,135],[221,66],[252,22]],"l":[[45,135,203,135],[65,68,235,68]],"tag":"Resistance","bias":"bull"},"Bullish Symmetrical Triangle":{"p":[[20,42],[51,139],[83,57],[115,127],[147,71],[180,116],[211,84],[242,100],[270,42]],"l":[[20,38,246,99],[20,145,246,98]],"tag":"Breakout","bias":"bull"},"Bearish Symmetrical Triangle":{"p":[[20,42],[51,139],[83,57],[115,127],[147,71],[180,116],[211,84],[242,100],[270,157]],"l":[[20,38,246,99],[20,145,246,98]],"tag":"Breakdown","bias":"bear"},"Ascending Triangle":{"p":[[20,139],[51,45],[81,119],[109,46],[139,100],[169,45],[197,80],[224,45],[254,22]],"l":[[40,45,230,45],[20,145,230,67]],"tag":"Resistance","bias":"bull"},"Descending Triangle":{"p":[[20,37],[51,135],[81,52],[109,135],[139,72],[169,135],[197,89],[224,135],[253,157]],"l":[[40,135,230,135],[20,27,230,106]],"tag":"Support","bias":"bear"},"Wedge Continuation":{"p":[[20,42],[51,130],[75,127],[100,80],[125,116],[151,69],[177,105],[202,59],[225,96],[246,153]],"l":[[78,85,227,54],[78,133,227,93]],"tag":"Wedge break","bias":"bear"},"Wedge Reversal":{"p":[[20,35],[48,130],[72,64],[100,138],[127,94],[155,143],[181,119],[205,147],[241,47]],"l":[[43,59,220,130],[43,139,220,153]],"tag":"Wedge break","bias":"bull"},"Channels":{"p":[[22,42],[50,98],[73,54],[99,115],[124,73],[150,130],[174,93],[199,145],[223,110],[250,163]],"l":[[15,30,225,118],[15,94,225,182]],"tag":"Channel","bias":"neutral"},"Flags":{"p":[[20,150],[67,29],[92,61],[115,77],[139,55],[163,72],[186,51],[209,68],[242,22]],"l":[[83,45,219,75],[83,79,219,109]],"tag":"Flag break","bias":"bull"},"Pennants":{"p":[[20,150],[67,28],[93,65],[118,113],[145,78],[169,103],[192,90],[214,96],[250,30]],"l":[[88,55,224,97],[88,125,224,97]],"tag":"Pennant","bias":"bull"},"Rectangles":{"p":[[20,74],[44,42],[71,132],[99,43],[126,131],[152,42],[180,132],[206,42],[232,131],[255,158]],"l":[[30,42,240,42],[30,132,240,132]],"tag":"Range","bias":"neutral"}};
function formationDiagram(name,hideName=false){
 const f=formationArt[name];if(!f)return '';
 const grid=[45,90,135].map(y=>'<path d="M12 '+y+'H326" stroke="rgba(190,171,226,.10)" stroke-width="1"/>').join('');
 const lines=f.l.map(v=>'<line x1="'+v[0]+'" y1="'+v[1]+'" x2="'+v[2]+'" y2="'+v[3]+'" stroke="#f1bd56" stroke-width="2.5" stroke-linecap="round"/>').join('');
 const pts=f.p.map(p=>p.join(',')).join(' ');
 const breakout=f.p[f.p.length-1],prior=f.p[f.p.length-2];
 const color=f.bias==='bull'?'#34dba7':f.bias==='bear'?'#fa7185':'#d0bcff';
 return '<svg viewBox="0 0 340 184" role="img" aria-label="'+(hideName?'Identify this chart formation':name)+'" style="display:block;width:100%;max-width:480px;background:rgba(10,7,24,.50);border-radius:12px"><rect x="3" y="3" width="334" height="178" rx="11" fill="none" stroke="rgba(177,129,243,.22)"/>'+grid+lines+'<polyline points="'+pts+'" stroke="#d8d4f5" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none"/><line x1="'+prior[0]+'" y1="'+prior[1]+'" x2="'+breakout[0]+'" y2="'+breakout[1]+'" stroke="'+color+'" stroke-width="4" stroke-linecap="round"/><circle cx="'+breakout[0]+'" cy="'+breakout[1]+'" r="4" fill="'+color+'"/><text x="14" y="175" fill="#f1bd56" font-size="10">'+f.tag+'</text></svg>';
}

Object.assign(shapes,{
 'Three Line Strike (Bullish Reversal)':[[87,75,72,91],[75,61,58,79],[61,47,44,64],[43,89,40,93]],
 'Three Line Strike (Bearish Reversal)':[[15,29,12,32],[29,44,26,47],[44,61,41,64],[65,11,8,68]],
 'Three Inside Up':[[83,34,31,87],[42,52,39,55],[52,91,49,94]],
 'Three Inside Down':[[20,75,17,79],[62,51,48,65],[51,13,10,54]],
 'Piercing Line':[[85,70,67,88],[70,55,52,73],[55,33,30,58],[28,48,24,52],[48,60,45,63]]
});
Object.assign(shapes,{
'Harami (Overview)':[[20,84,17,88],[65,54,51,69]],
'Long-Legged Doji':[[51,52,17,87],[52,51,17,87]]
});
function diagram(c,triangle=false,name='',hideName=false,anatomy=false){
 if(formationArt[name])return formationDiagram(name,hideName);
 const bars=anatomy?c:(shapes[name]||c);
 const min=Math.min(...bars.map(v=>v[2])),max=Math.max(...bars.map(v=>v[3]));
 const y=n=>151-(n-min)/(max-min||1)*123;
 const spacing=bars.length<=1?0:Math.min(58,262/(bars.length-1));
 const start=170-(bars.length-1)*spacing/2;
 const x=i=>start+i*spacing;
 let out='<svg viewBox="0 0 340 182" role="img" aria-label="'+(hideName?'Identify the candlestick pattern':name+' candlestick illustration')+'" style="display:block;width:100%;max-width:480px;background:rgba(10,7,24,.55);border-radius:12px">';
 out+='<rect x="3" y="3" width="334" height="176" rx="10" fill="none" stroke="rgba(176,139,235,.23)"/>';
 [46,90,135].forEach(v=>{out+='<line x1="12" y1="'+v+'" x2="328" y2="'+v+'" stroke="rgba(190,171,226,.11)" stroke-width="1"/>';});
 const highlights={
  'Hammer':[4],'Inverted Hammer':[4],'Shooting Star':[4],'Hanging Man':[4],
  'Bullish Engulfing':[4,5],'Bearish Engulfing':[4,5],
  'Piercing Line':[2,3],'Dark Cloud Cover':[2,3],
  'Tweezer Bottoms':[2,3],'Tweezer Tops':[2,3],
  'Three White Soldiers':[2,3,4],'Three Black Crows':[2,3,4],
  'Dragonfly Doji':[2],'Gravestone Doji':[2]
 };
 const selected=anatomy?bars.map((_,i)=>i):(highlights[name]||bars.map((_,i)=>i));
 const ys=selected.flatMap(i=>bars[i]?[y(bars[i][3]),y(bars[i][2])]:[]);
 if(ys.length){
  const x1=x(selected[0])-17,x2=x(selected[selected.length-1])+17,top=Math.max(8,Math.min(...ys)-9),bottom=Math.min(171,Math.max(...ys)+9);
  out+='<rect x="'+x1+'" y="'+top+'" width="'+(x2-x1)+'" height="'+Math.max(15,bottom-top)+'" rx="7" fill="rgba(184,131,255,.07)" stroke="#b983ff" stroke-width="1.8"/>';
 }
 bars.forEach((v,i)=>{
   const [o,cl,lo,hi]=v,cx=x(i),up=cl>=o,color=up?'#20d69a':'#f25565',bodyY=Math.min(y(o),y(cl)),bodyH=Math.max(3,Math.abs(y(o)-y(cl)));
   out+='<line x1="'+cx+'" x2="'+cx+'" y1="'+y(hi)+'" y2="'+y(lo)+'" stroke="'+color+'" stroke-width="2.5" stroke-linecap="round"/>';
   if(Math.abs(cl-o)<=1)out+='<line x1="'+(cx-11)+'" y1="'+y((o+cl)/2)+'" x2="'+(cx+11)+'" y2="'+y((o+cl)/2)+'" stroke="'+color+'" stroke-width="3.8" stroke-linecap="round"/>';
   else out+='<rect x="'+(cx-10)+'" y="'+bodyY+'" width="20" height="'+bodyH+'" rx="1.5" fill="'+color+'"/>';
 });
 if(name==='Abandoned Baby Bottom'||name==='Abandoned Baby Top'){
  out+='<text x="170" y="173" font-size="10" fill="#cdb3f3" text-anchor="middle">Isolated doji · full wick gaps on both sides</text>';
 }
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
const confirmations={
'Hammer':'Next candle holds above the hammer and buyers follow through.',
'Inverted Hammer':'Subsequent bullish candle supports a reversal.',
'Hanging Man':'Subsequent selling confirms rejection after an advance.',
'Shooting Star':'Subsequent bearish follow-through confirms rejection.',
'Bullish Engulfing':'Price holds the engulfing low and buyers follow through.',
'Bearish Engulfing':'Price holds below the engulfing high and sellers follow through.',
'Piercing Line':'Price holds the second candle and buyers follow through.',
'Dark Cloud Cover':'Price holds below the bearish candle and selling follows through.',
'Morning Star':'Third candle closes decisively into the first bearish body.',
'Morning Star Doji':'Third candle closes into the bearish body after a middle doji.',
'Evening Star':'Third candle closes decisively into the first bullish body.',
'Evening Star Doji':'Third candle closes into the bullish body after a middle doji.',
'Abandoned Baby Bottom':'Both full wick gaps isolate the doji, followed by bullish momentum.',
'Abandoned Baby Top':'Both full wick gaps isolate the doji, followed by bearish momentum.',
'Three Line Strike (Bullish Reversal)':'The fourth bullish candle reverses the prior three red real bodies.',
'Three Line Strike (Bearish Reversal)':'The fourth bearish candle reverses the prior three green real bodies.'
};
const formationConfirm={
'Head and Shoulders':'Break below the neckline',
'Inverted Head and Shoulders':'Break above the neckline',
'Double Top':'Break below the intervening low',
'Double Bottom':'Break above the intervening high',
'Triple Top':'Break below support after the third peak',
'Triple Bottom':'Break above resistance after the third trough',
'Bullish Symmetrical Triangle':'Break above descending resistance',
'Bearish Symmetrical Triangle':'Break below rising support',
'Ascending Triangle':'Break above horizontal resistance',
'Descending Triangle':'Break below horizontal support',
'Wedge Continuation':'Break beyond the wedge in the prevailing trend direction',
'Wedge Reversal':'Break against the preceding trend',
'Channels':'Channel boundary rejection or confirmed breakout',
'Flags':'Break in the flagpole direction',
'Pennants':'Break in the pole direction',
'Rectangles':'Break above resistance or below support'
};
const formationBias={
'Head and Shoulders':'Potential bearish reversal','Inverted Head and Shoulders':'Potential bullish reversal',
'Double Top':'Potential bearish reversal','Double Bottom':'Potential bullish reversal',
'Triple Top':'Potential bearish reversal','Triple Bottom':'Potential bullish reversal',
'Bullish Symmetrical Triangle':'Potential bullish reversal or continuation','Bearish Symmetrical Triangle':'Potential bearish reversal or continuation',
'Ascending Triangle':'Potential bullish continuation','Descending Triangle':'Potential bearish continuation',
'Wedge Continuation':'Direction depends on prior trend','Wedge Reversal':'Direction depends on prior trend',
'Channels':'Direction depends on breakout','Flags':'Direction depends on pole','Pennants':'Direction depends on pole','Rectangles':'Direction depends on breakout'
};
function classification(card,lesson){
 if(lesson.id==='charts')return 'Chart formation';
 if(lesson.id==='neutral')return 'Candlestick anatomy';
 if(/Rising Three|Falling Three|Separating Lines|Tasuki Gap|Side by Side White Lines/.test(card[0]))return 'Continuation pattern';
 return lesson.id==='bull'?'Bullish pattern':'Bearish pattern';
}
function studyExtras(card,lesson){
 const name=card[0],chart=lesson.id==='charts',candle=lesson.id==='neutral';
 const confirmation=chart?formationConfirm[name]:candle?'Compare the open, close, high and low; then interpret the surrounding trend.':(confirmations[name]||'Look for follow-through, an important level, and the preceding trend before acting.');
 const mistake=chart?'Assuming the pattern has broken out before price crosses its defining trendline, neckline, or range boundary.':candle?'Treating a candle shape or color as a complete trade signal without surrounding context.':/Abandoned Baby/.test(name)?'Confusing an ordinary star with an abandoned baby: the doji must be completely isolated by wick-to-wick gaps.':/Engulfing/.test(name)?'Requiring the wicks to engulf: the real bodies, not necessarily the wicks, must engulf.':'Assuming a recognizable shape guarantees a reversal without the preceding trend or confirmation.';
 return '<p style="margin:10px 0 4px;color:#dcb7ff;font-weight:600">Confirmation to look for</p><p>'+confirmation+'</p><p style="margin:10px 0 4px;color:#dcb7ff;font-weight:600">Common mistake</p><p>'+mistake+'</p>';
}
function candleStrengthNotes(){
 return '<div style="margin:18px 0;padding:18px;border:1px solid rgba(191,132,255,.40);border-radius:14px;background:rgba(14,8,31,.30)"><h3 style="color:#e6baff">Candlestick Strength Meter — Reading Bodies & Wicks</h3><p>A long body indicates a larger open-to-close move. A small body indicates little net progress. Long upper wicks show rejection from higher prices; long lower wicks show rejection from lower prices. These are descriptions of candle shape, not guarantees of the next move.</p><p class="muted">Compare open, high, low, close and trend context before interpreting strength.</p></div>';
}
function wrap(inner){return '<div class="panel" style="margin-top:16px"><h2>Technical Analysis Study Center</h2><p class="muted">Visual reference and pattern recognition, based on your training notes. Patterns are not trade guarantees.</p>'+inner+'</div>'}
function btn(label,fn){return '<button class="btn secondary" onclick="'+fn+'">'+label+'</button>'}
let quizCount=10,questionKind=0,correctAnswer='',questionOptions=[],questionPrompt='';
function pickChoices(correct,pool,limit=4){
 const seen=[correct];for(const x of pool){if(typeof x==='string'&&x!==correct&&!seen.includes(x))seen.push(x);if(seen.length>=limit)break;}
 return seen.sort(()=>Math.random()-.5);
}
function shuffle(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function prepareQuestion(){
 const item=order[idx],c=item.card,l=item.lesson,name=c[0],chart=l.id==='charts';
 questionKind=idx%3;
 const peer=shuffle(l.cards.filter(x=>x[0]!==name));
 if(questionKind===0){
  questionPrompt=chart?'Which chart formation is shown?':'Which candlestick or pattern is shown?';
  correctAnswer=name;
  questionOptions=pickChoices(name,peer.map(x=>x[0]));
 }else if(chart&&questionKind===1){
  questionPrompt='What is the usual directional interpretation of this formation?';
  correctAnswer=formationBias[name];
  questionOptions=pickChoices(correctAnswer,shuffle(Object.values(formationBias)));
 }else if(chart){
  questionPrompt='What confirms this chart formation?';
  correctAnswer=formationConfirm[name];
  questionOptions=pickChoices(correctAnswer,peer.map(x=>formationConfirm[x[0]]).filter(Boolean));
 }else{
  questionPrompt=questionKind===1?'Which description matches the illustrated pattern?':'Which interpretation best matches the illustrated pattern?';
  const col=questionKind===1?1:2;
  correctAnswer=c[col];
  questionOptions=pickChoices(correctAnswer,peer.map(x=>x[col]));
 }
}
function renderCenter(){
 const el=document.getElementById('technicalStudyCenter');if(!el)return;
 if(section==='home'){
  el.innerHTML=wrap('<div class="grid">'+lessons.map((l,i)=>'<div class="panel span6" style="background:rgba(14,8,31,.28);backdrop-filter:blur(6px)"><h3>'+l.title+'</h3><p>'+l.intro+'</p><p class="muted">'+l.cards.length+' illustrated references</p><div class="actions">'+btn('Read Article',"studyOpen("+i+")")+' '+btn('Test 10',"studyStart("+i+",10)")+' '+btn('Test All',"studyStart("+i+",0)")+'</div></div>').join('')+'<div class="panel span6"><h3>Mixed Challenge</h3><p>Test patterns across every category. Choose a short round or study them all at your own pace.</p><div class="actions">'+btn('Test 10',"studyStart(-1,10)")+' '+btn('Test All',"studyStart(-1,0)")+'</div></div></div>');return;
 }
 if(section==='article'){
  const l=lessons[chosen];
  el.innerHTML=wrap(btn('← All categories','studyHome()')+'<h3>'+l.title+'</h3><p>'+l.intro+'</p>'+(l.id==='neutral'?candleStrengthNotes():'')+l.cards.map(c=>'<div style="padding:18px;margin:14px 0;border:1px solid rgba(191,132,255,.4);border-radius:16px;background:rgba(14,8,31,.36);backdrop-filter:blur(6px)"><h3 style="color:#e6baff">'+c[0]+'</h3><p class="muted" style="margin:0 0 12px">'+classification(c,l)+'</p>'+diagram(c[3],false,c[0],false,l.id==='neutral')+'<h4 style="color:#dcb7ff;margin:12px 0 4px">Pattern description</h4><p>'+c[1]+'</p>'+checklist(c)+studyExtras(c,l)+'</div>').join('')+'<div class="actions">'+btn('Test 10',"studyStart("+chosen+",10)")+' '+btn('Test All',"studyStart("+chosen+",0)")+'</div>');return;
 }
 if(section==='done'){
  el.innerHTML=wrap('<h3>Round complete</h3><p style="font-size:24px"><b>'+score+' / '+order.length+'</b> correct</p><div class="actions">'+btn('Try Again',"studyStart("+chosen+","+quizCount+")")+' '+btn('Categories','studyHome()')+'</div>');return;
 }
 const item=order[idx],c=item.card;
 const question='<h3>Test Your Knowledge · '+(idx+1)+' / '+order.length+'</h3><p>'+questionPrompt+'</p>';
 const opts='<div class="actions" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px">'+questionOptions.map(n=>'<button class="btn secondary" style="white-space:normal;text-align:left;min-height:46px" '+(answered!==null?'disabled':'')+' onclick="studyAnswer('+JSON.stringify(n).replace(/"/g,'&quot;')+')">'+n+'</button>').join('')+'</div>';
 const feedback=answered===null?'':'<p><b>'+(answered===correctAnswer?'Correct':'Not quite — '+correctAnswer)+'</b></p><p>'+c[1]+' '+c[2]+'</p>'+btn(idx===order.length-1?'See score':'Next pattern','studyNext()');
 el.innerHTML=wrap(btn('← Categories','studyHome()')+question+'<div style="padding:12px;border-radius:12px;background:rgba(130,130,130,.08)">'+diagram(c[3],false,c[0],true,item.lesson.id==='neutral')+'</div>'+opts+feedback);
}
window.studyHome=()=>{section='home';renderCenter()};
window.studyOpen=i=>{chosen=i;section='article';renderCenter()};
window.studyStart=(i,count=10)=>{
 chosen=i;quizCount=count;
 const group=i<0?all.filter((x,index)=>all.findIndex(y=>y.card[0]===x.card[0])===index):lessons[i].cards.map(c=>({lesson:lessons[i],card:c}));
 const shuffled=shuffle(group);
 order=count>0?shuffled.slice(0,count):shuffled;
 idx=0;score=0;answered=null;section='quiz';prepareQuestion();renderCenter();
};
window.studyAnswer=n=>{if(answered!==null)return;answered=n;if(n===correctAnswer)score++;renderCenter()};
window.studyNext=()=>{idx++;answered=null;if(idx>=order.length)section='done';else prepareQuestion();renderCenter()};
const previous=renderResources;
renderResources=function(){previous();const el=document.getElementById('resources');el.insertAdjacentHTML('beforeend','<div id="technicalStudyCenter"></div>');renderCenter()};
renderResources();
})();
