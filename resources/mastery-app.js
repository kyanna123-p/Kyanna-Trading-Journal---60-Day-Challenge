/* Unified Trading Mastery: original 37 concept texts + existing illustrated pattern reference.
   Pattern diagrams are schematics, never substitutes for original lesson screenshots. */
(function(){
'use strict';
const lib=window.TradingPatternLibrary;
const host=document.getElementById('masteryApp');
const source=document.getElementById('sourceConcepts');
if(!host||!source){return;}
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chapters=Array.from(source.querySelectorAll('section.group')).map((section,i)=>({
 id:'c'+i,name:section.querySelector('h2')?.textContent.trim()||'Concepts',
 entries:Array.from(section.querySelectorAll('details')).map((d,j)=>({
 id:'concept:'+i+':'+j,kind:'concept',section:'c'+i,
 category:section.querySelector('h2')?.textContent.trim()||'Concepts',
 title:d.querySelector('summary')?.textContent.trim()||'Untitled',
 explanation:d.querySelector('.lesson-body')?.textContent.trim()||''
 }))
}));
const patternGroups=lib?lib.lessons.map(g=>({id:g.id,name:g.title,entries:g.cards.map((c,i)=>({
 id:'pattern:'+g.id+':'+i,kind:'pattern',section:g.id,category:g.title,
 title:c[0],description:c[1],interpretation:c[2],bars:c[3],group:g
}))})):[];
const conceptual=chapters.flatMap(g=>g.entries);
const visual=patternGroups.flatMap(g=>g.entries);
const all=conceptual.concat(visual);
const total=all.length;
const storageKey='tradecraftMasteryProgress:v1';
function loadProgress(){
 try{
  const local=JSON.parse(localStorage.getItem(storageKey)||'{}');
  const journal=JSON.parse(localStorage.getItem('tradecraft60')||'{}');
  const cloud=journal?.settings?.masteryProgress||{};
  const a=(cloud.updatedAt||'')>(local.updatedAt||'')?cloud:local;
  return a&&typeof a==='object'?{studied:a.studied&&typeof a.studied==='object'?a.studied:{},bestQuiz:a.bestQuiz||null,updatedAt:a.updatedAt||''}:{studied:{},bestQuiz:null,updatedAt:''};
 }catch(e){return{studied:{},bestQuiz:null,updatedAt:''};}
}
const progress=loadProgress();
function saveProgress(){
 try{
  progress.updatedAt=new Date().toISOString();
  localStorage.setItem(storageKey,JSON.stringify(progress));
  // Reuse the existing journal snapshot so cloud backups can include learning progress.
  // The dashboard's existing autosave resumes when the user returns to the main app.
  const journal=JSON.parse(localStorage.getItem('tradecraft60')||'null');
  if(journal&&typeof journal==='object'){
   journal.settings=journal.settings||{};
   journal.settings.masteryProgress=progress;
   localStorage.setItem('tradecraft60',JSON.stringify(journal));
   localStorage.setItem('tradecraftMasteryPendingSync','1');
  }
 }catch(e){console.warn('Mastery progress could not be saved',e)}
}
const state={view:'reference',kind:'concept',category:'all',search:'',deck:[],cursor:0,flipped:false,quiz:[],quizCursor:0,answer:null,score:0,misses:[],round:10,quizDone:false};
function availableGroups(){return state.kind==='concept'?chapters:patternGroups}
function availableItems(){return state.kind==='concept'?conceptual:visual}
function filtered(){const term=state.search.toLowerCase().trim();return availableItems().filter(x=>(state.category==='all'||x.section===state.category)&&(!term||(x.title+' '+x.category+' '+(x.explanation||'')+' '+(x.description||'')+' '+(x.interpretation||'')).toLowerCase().includes(term)))}
function label(s){return escapeHtml(s)}
function completedCount(arr){return arr.filter(c=>!!progress.studied[c.id]).length}
function mark(id){progress.studied[id]=!progress.studied[id];if(!progress.studied[id])delete progress.studied[id];saveProgress();render()}
function cardDiagram(item,hideName){if(item.kind!=='pattern'||!lib)return '';return lib.diagram(item.bars,false,item.title,!!hideName,item.section==='neutral')}
function detailText(item){return item.kind==='concept'?'<div class="tm-source-text">'+label(item.explanation)+'</div>':
 '<p><strong>Pattern:</strong> '+label(item.description)+'</p><p><strong>Interpretation:</strong> '+label(item.interpretation)+'</p>'+
 '<p class="tm-muted"><strong>Category:</strong> '+label(item.category)+' · This SVG is a schematic illustration, not the original instructor screenshot.</p>'}
function compactHeader(){
 const current=filtered(),count=completedCount(availableItems()),pct=availableItems().length?Math.round(count/availableItems().length*100):0;
 return '<div class="tm-summary"><div><h2>Self-paced study library</h2><p>Original study-guide descriptions and separate schematic pattern references. No imposed schedule.</p></div>'+
 '<div class="tm-counts"><b>'+completedCount(all)+' / '+total+'</b><span>studied across library</span></div></div>'+
 '<div class="tm-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><span style="width:'+pct+'%"></span></div>'+
 '<p class="tm-muted">'+count+' / '+availableItems().length+' '+(state.kind==='concept'?'concepts':'pattern references')+' reviewed · '+current.length+' currently displayed · Progress saved locally; existing cloud sync can pick it up when you return to the main app.</p>';
}
function button(text,action,active){return '<button type="button" class="tm-tab'+(active?' is-active':'')+'" data-action="'+action+'">'+label(text)+'</button>'}
function header(){
 const nConcept=conceptual.length,nPattern=visual.length;
 return '<div class="tm-header"><div class="tm-view-tabs" role="group" aria-label="Study mode">'+
 button('Reference','view:reference',state.view==='reference')+button('Flip Cards','view:cards',state.view==='cards')+
 button('Quiz','view:quiz',state.view==='quiz')+button('Coverage & Sources','view:audit',state.view==='audit')+
 '</div><div class="tm-view-tabs" role="group" aria-label="Study collection">'+
 button('Core concepts · '+nConcept,'kind:concept',state.kind==='concept')+
 button('Illustrated patterns · '+nPattern,'kind:pattern',state.kind==='pattern')+'</div></div>'+
 compactHeader();
}
function filters(){
 return '<div class="tm-tools"><div class="tm-categories"><button class="tm-chip'+(state.category==='all'?' is-active':'')+'" data-action="category:all">All categories</button>'+
 availableGroups().map(g=>'<button class="tm-chip'+(state.category===g.id?' is-active':'')+'" data-action="category:'+g.id+'">'+label(g.name)+' <small>('+g.entries.length+')</small></button>').join('')+
 '</div><label class="tm-search"><span>Find a concept or pattern</span><input id="tmSearch" type="search" autocomplete="off" placeholder="Search the study library…" value="'+label(state.search)+'"></label></div>';
}
function sourceBadge(item){
 return item.kind==='concept'?'<span class="tm-kicker">Teaching notes · Original illustration pending</span>':
 '<span class="tm-kicker">Illustrative candlestick/formation schematic</span>';
}
function refItem(item){
 const marked=!!progress.studied[item.id];
 return '<article class="tm-ref" id="'+label(item.id)+'">'+sourceBadge(item)+
 '<div class="tm-ref-heading"><h3>'+label(item.title)+'</h3><span class="tm-studied-label">'+(marked?'Studied':'Not reviewed')+'</span></div>'+
 (item.kind==='pattern'?'<div class="tm-diagram">'+cardDiagram(item,false)+'</div>':'')+
 '<div class="tm-details">'+detailText(item)+'</div>'+
 '<div class="tm-ref-actions"><button type="button" class="tm-outline" data-action="mark:'+item.id+'">'+(marked?'✓ Studied · Undo':'Mark as studied')+'</button></div></article>';
}
function referenceView(){
 let items=filtered();
 return filters()+'<div class="tm-reference-grid">'+(items.length?items.map(refItem).join(''):'<p class="tm-empty">No lessons match your filters.</p>')+'</div>';
}
function shuffle(xs){const a=xs.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function createDeck(){state.deck=shuffle(filtered());state.cursor=0;state.flipped=false}
function deckView(){
 if(!state.deck.length)return '<p class="tm-empty">There are no cards in this selection. Try another category.</p>';
 const c=state.deck[state.cursor];
 return '<div class="tm-deck-info">Card '+(state.cursor+1)+' / '+state.deck.length+' · '+label(c.category)+'</div>'+
 '<div class="tm-flip-card"><span class="tm-kicker">'+(state.flipped?'Back · Explanation':'Front · Recall before flipping')+'</span>'+
 (state.flipped?'<h3>'+label(c.title)+'</h3>'+detailText(c):
 (c.kind==='pattern'?'<div class="tm-diagram">'+cardDiagram(c,true)+'</div><p>Identify the illustrated pattern.</p>':
 '<h3>'+label(c.title)+'</h3><p>Recall its key definition, exact conditions, context and exceptions.</p>'))+
 '</div><div class="tm-card-actions">'+
 '<button type="button" class="tm-primary" data-action="flip">'+(state.flipped?'Show front':'Flip for explanation')+'</button>'+
 '<button type="button" class="tm-outline" data-action="mark:'+c.id+'">'+(progress.studied[c.id]?'✓ Studied':'Mark studied')+'</button>'+
 '<button type="button" class="tm-outline" data-action="prev" '+(state.cursor===0?'disabled':'')+'>Previous</button>'+
 '<button type="button" class="tm-outline" data-action="next" '+(state.cursor===state.deck.length-1?'disabled':'')+'>Next</button>'+
 '<button type="button" class="tm-outline" data-action="reshuffle">Reshuffle</button></div>';
}
function cardsView(){
 return filters()+'<div class="tm-mode-note">Pattern cards test visual recognition using schematic illustrations. For instructor-specific event diagrams, only the preserved source text is shown until the originals are available.</div>'+deckView();
}
function prepareQuiz(){state.quiz=shuffle(filtered()).slice(0,state.round===0?undefined:state.round);state.quizCursor=0;state.score=0;state.answer=null;state.misses=[];state.quizDone=false}
function quizChoices(card){
 const pool=availableItems().filter(x=>x.id!==card.id&&x.title!==card.title&&x.category===card.category);
 const others=shuffle(pool).slice(0,3);
 if(others.length<3)others.push(...shuffle(availableItems().filter(x=>x.id!==card.id&&x.title!==card.title&&!others.some(y=>y.title===x.title))).slice(0,3-others.length));
 return shuffle([card,...others]).slice(0,4);
}
let choiceCache=null;
function quizView(){
 if(!filtered().length)return filters()+'<p class="tm-empty">Choose a category containing at least one item.</p>';
 let intro='<div class="tm-quiz-options"><p>Test identification and definitions based on the reference collection. Results are for study, not measured trading probabilities.</p>'+
 '<div class="tm-card-actions">'+button('10 questions','round:10',state.round===10)+button('All in selection','round:all',state.round===0)+
 '<button type="button" class="tm-primary" data-action="startQuiz">Start / restart quiz</button></div></div>';
 if(!state.quiz.length||state.view!=='quiz')return filters()+intro;
 if(state.quizDone){
 const wrong=state.misses.map(x=>'<div class="tm-error"><b>'+label(x.title)+'</b> · '+label(x.category)+'</div>').join('');
 return filters()+intro+'<div class="tm-result"><h3>Round complete</h3><b>'+state.score+' / '+state.quiz.length+' correct</b><p>Review mistakes from the source entries before another round.</p>'+(wrong?'<h4>Review these</h4>'+wrong:'<p>No missed questions.</p>')+'</div>';
 }
 const card=state.quiz[state.quizCursor];
 if(!choiceCache||choiceCache.id!==card.id)choiceCache={id:card.id,choices:quizChoices(card)};
 const question=card.kind==='pattern'?'Which illustrated pattern or candle is shown?':'Which Trading Mastery concept matches this excerpt?';
 const src=card.kind==='pattern'?'<div class="tm-diagram">'+cardDiagram(card,true)+'</div>':
 '<div class="tm-prompt">'+label(card.explanation.slice(0,200))+(card.explanation.length>200?'…':'')+'</div>';
 const answered=state.answer!==null;
 const options=choiceCache.choices.map(c=>'<button type="button" class="tm-answer'+(answered&&c.title===card.title?' is-correct':'')+(answered&&state.answer===c.title&&state.answer!==card.title?' is-wrong':'')+'" data-answer="'+label(c.title)+'" '+(answered?'disabled':'')+'>'+label(c.title)+'</button>').join('');
 return filters()+intro+'<div class="tm-test"><span class="tm-kicker">Question '+(state.quizCursor+1)+' / '+state.quiz.length+'</span>'+
 '<h3>'+question+'</h3>'+src+'<div class="tm-answer-grid">'+options+'</div>'+
 (answered?'<div class="tm-feedback"><b>'+(state.answer===card.title?'Correct':'Correct answer: '+label(card.title))+'</b>'+detailText(card)+'</div>'+
 '<button type="button" class="tm-primary" data-action="quizNext">'+(state.quizCursor===state.quiz.length-1?'Finish round':'Next question')+'</button>':'')+'</div>';
}
function auditView(){
 const byCategory=chapters.concat(patternGroups);
 let dupe={};visual.forEach(x=>{dupe[x.title]=(dupe[x.title]||0)+1});
 const repeats=Object.entries(dupe).filter(([,v])=>v>1).map(([name])=>name);
 return '<div class="tm-audit"><h2>Coverage & source integrity</h2>'+
 '<p><b>'+conceptual.length+' conceptual lessons</b> in '+chapters.length+' chapters, and <b>'+visual.length+' illustrative pattern references</b> in '+patternGroups.length+' categories.</p>'+
 '<div class="tm-audit-grid">'+byCategory.map(g=>'<div class="tm-audit-card"><h3>'+label(g.name)+'</h3><p>'+completedCount(g.entries)+' / '+g.entries.length+' studied</p></div>').join('')+'</div>'+
 '<h3>Source distinctions</h3><p>Original teaching statements, thresholds and exceptions remain in their existing concept text. Reported probabilities are instructor claims, not independently verified statistics.</p>'+
 '<p>The '+visual.length+' diagrams are educational SVG schematics from the app’s prior candlestick/chart-formations study center. <b>They are not reproductions of the original annotated lesson screenshots.</b></p>'+
 '<p>Repeated pattern names across categories ('+label(repeats.join(', '))+') are intentional because raw candle anatomy and reversal context are taught separately.</p>'+
 '<h3>Still awaiting original lesson material</h3><ul>'+
 '<li>Original annotated diagrams/screenshots are not available in this repository to attach to the concept lessons.</li>'+
 '<li>“Dual space” lacks its complete source-specific definition.</li>'+
 '<li>Anticipation Bear 180, Pullback Add at 50% retracement, and Red Bar Take Out are named in the card-format notes, but complete source-specific rules and illustrations are not present in this guide.</li>'+
 '</ul><p class="tm-muted">These gaps are deliberately left identified, rather than filled with invented entry rules or pictures. Uploading the original lesson pages is needed for source-faithful completion.</p>'+
 '</div>';
}
function render(){
 if(!lib)host.innerHTML='<p class="tm-empty">The illustrated pattern library could not be loaded. The core guide remains below.</p>';
 const h=header()+(state.view==='reference'?referenceView():state.view==='cards'?cardsView():state.view==='quiz'?quizView():auditView());
 host.innerHTML=h;
}
function changeView(view){state.view=view;state.search='';state.category='all';choiceCache=null;if(view==='cards')createDeck();if(view==='quiz'){state.quiz=[];state.quizDone=false}render()}
function changeKind(kind){state.kind=kind;state.category='all';state.search='';choiceCache=null;state.quiz=[];state.quizDone=false;if(state.view==='cards')createDeck();render()}
host.addEventListener('click',e=>{
 const a=e.target.closest('[data-action]');if(!a)return;
 const cmd=a.dataset.action||'';
 if(cmd.startsWith('view:'))return changeView(cmd.split(':')[1]);
 if(cmd.startsWith('kind:'))return changeKind(cmd.split(':')[1]);
 if(cmd.startsWith('category:')){state.category=cmd.slice(9);choiceCache=null;state.quiz=[];if(state.view==='cards')createDeck();return render()}
 if(cmd.startsWith('mark:'))return mark(cmd.slice(5));
 if(cmd==='flip'){state.flipped=!state.flipped;return render()}
 if(cmd==='next'||cmd==='prev'){state.cursor=Math.min(state.deck.length-1,Math.max(0,state.cursor+(cmd==='next'?1:-1)));state.flipped=false;return render()}
 if(cmd==='reshuffle'){createDeck();return render()}
 if(cmd.startsWith('round:')){state.round=cmd.split(':')[1]==='all'?0:10;state.quiz=[];state.quizDone=false;return render()}
 if(cmd==='startQuiz'){prepareQuiz();choiceCache=null;return render()}
 if(cmd==='quizNext'){state.quizCursor++;state.answer=null;choiceCache=null;if(state.quizCursor>=state.quiz.length){state.quizDone=true;progress.bestQuiz={score:state.score,total:state.quiz.length,kind:state.kind,at:new Date().toISOString()};saveProgress()}return render()}
});
host.addEventListener('click',e=>{
 const a=e.target.closest('[data-answer]');if(!a||state.view!=='quiz'||state.answer!==null||state.quizDone||!state.quiz.length)return;
 state.answer=a.dataset.answer;const card=state.quiz[state.quizCursor];if(state.answer===card.title)state.score++;else state.misses.push(card);
 render();
});
host.addEventListener('input',e=>{
 if(e.target.id!=='tmSearch')return;
 const v=e.target.value;state.search=v;choiceCache=null;state.quiz=[];if(state.view==='cards')createDeck();
 const start=e.target.selectionStart;
 render();
 const now=document.getElementById('tmSearch');if(now){now.focus();now.setSelectionRange(start,start)}
});
document.addEventListener('keydown',e=>{
 if(state.view!=='cards'||e.ctrlKey||e.altKey||e.metaKey||/input|textarea|select/i.test(document.activeElement?.tagName||''))return;
 if(e.key==='ArrowRight'&&state.cursor<state.deck.length-1){state.cursor++;state.flipped=false;render()}
 if(e.key==='ArrowLeft'&&state.cursor>0){state.cursor--;state.flipped=false;render()}
 if(e.key===' '){e.preventDefault();state.flipped=!state.flipped;render()}
});
source.hidden=true;
render();
})();