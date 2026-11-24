/* Simple resource hub with user-curated video lessons.
   User video links are personal bookmarks, not publicly redistributed media. */
(function(){
'use strict';
const tracks=['Getting Started','Market State','Levels & Moving Averages','Setups & Entry','Execution & Risk','Review & Mindset'];
let activeVideoId=null;
const e=v=>esc(String(v??''));
function lib(){data.settings=data.settings||{};data.settings.trainingVideos=data.settings.trainingVideos||[];data.settings.trainingWatched=data.settings.trainingWatched||{};return data.settings}
function trustedUrl(value){
 try{let url=new URL(value.trim());if(url.protocol!=='https:')return null;return url}catch{return null}
}
function embedLink(raw){
 const u=trustedUrl(raw);if(!u)return null;
 const host=u.hostname.toLowerCase().replace(/^www\./,'');
 let id='';
 if(host==='youtube.com'||host==='m.youtube.com'||host==='youtube-nocookie.com'){
  if(u.pathname==='/watch')id=u.searchParams.get('v')||'';
  else if(u.pathname.startsWith('/embed/')||u.pathname.startsWith('/shorts/'))id=u.pathname.split('/')[2]||'';
 }else if(host==='youtu.be')id=u.pathname.split('/')[1]||'';
 if(/^[a-zA-Z0-9_-]{11}$/.test(id))return 'https://www.youtube-nocookie.com/embed/'+id;
 if(host==='vimeo.com'||host==='player.vimeo.com'){
  const hit=u.pathname.match(/\/(?:video\/)?([0-9]{5,15})(?:\/|$)/);
  if(hit)return 'https://player.vimeo.com/video/'+hit[1];
 }
 return null;
}
function addTrainingVideo(){
 const title=$('trainingTitle')?.value?.trim(),raw=$('trainingUrl')?.value?.trim(),track=$('trainingTrack')?.value;
 if(!title||title.length>150){alert('Please enter a video title up to 150 characters.');return}
 const url=trustedUrl(raw||'');if(!url){alert('Add a valid HTTPS video or training link.');return}
 if(!tracks.includes(track)){alert('Choose a training category.');return}
 const item={id:'tr-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),title,url:url.href,track};
 lib().trainingVideos.push(item);activeVideoId=item.id;save();renderResources();
}
function videoViewed(id){
 const video=lib().trainingVideos.find(x=>x.id===id);if(!video)return;
 lib().trainingWatched[id]=!lib().trainingWatched[id];if(!lib().trainingWatched[id])delete lib().trainingWatched[id];
 save();renderResources();
}
function videoSelect(id){activeVideoId=id;renderResources()}
function videoRemove(id){
 if(!confirm('Remove this video bookmark?'))return;
 lib().trainingVideos=lib().trainingVideos.filter(x=>x.id!==id);
 delete lib().trainingWatched[id];if(activeVideoId===id)activeVideoId=null;
 save();renderResources();
}
function renderVideoTraining(){
 const conf=lib(),videos=conf.trainingVideos,watched=conf.trainingWatched;
 const selected=videos.find(x=>x.id===activeVideoId)||videos[0];if(selected)activeVideoId=selected.id;
 const completed=videos.filter(x=>watched[x.id]).length;
 return '<div class="learn-head"><div><h2>Learning & Resources</h2><p>Learn a concept, see it on a chart, practice the pattern, and review your execution.</p></div></div>'+
 '<div class="learn-mainlinks"><a class="learn-link" href="resources/trading-mastery.html"><b>Trading Mastery</b><span>Original depiction-based lessons · 37 topics</span></a>'+
 '<a class="learn-link" href="resources/trading-mastery.html#masteryApp"><b>Flashcards & Pattern Quizzes</b><span>Self-paced study and recognition practice</span></a></div>'+
 '<section class="learn-video"><div class="learn-videohead"><div><h3>Video Training</h3><p>Save educational video links by category, then mark lessons watched. '+completed+' / '+videos.length+' completed.</p></div>'+
 '</div><div class="learn-trackchips">'+tracks.map(t=>'<span>'+e(t)+'</span>').join('')+'</div>'+
 (videos.length?'<div class="learn-video-layout"><div class="learn-video-list">'+tracks.map(t=>{
 const list=videos.filter(v=>v.track===t);if(!list.length)return '';
 return '<div class="learn-track"><h4>'+e(t)+'</h4>'+list.map(v=>'<button class="learn-lesson '+(selected?.id===v.id?'selected':'')+'" type="button" onclick="videoSelect(\''+e(v.id)+'\')"><b>'+e(v.title)+'</b><span>'+(watched[v.id]?'✓ Watched':'Watch lesson')+'</span></button>').join('')+'</div>';
 }).join('')+'</div><div class="learn-player"><h4>'+e(selected?.title||'Select a lesson')+'</h4>'+
 (selected?(embedLink(selected.url)?'<div class="learn-frame"><iframe src="'+e(embedLink(selected.url))+'" title="'+e(selected.title)+'" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>':
 '<div class="learn-external">This lesson opens on its original website.<p><a href="'+e(selected.url)+'" target="_blank" rel="noopener noreferrer">Open training video</a></p></div>')+
 '<div class="learn-actions"><button class="btn secondary" onclick="videoViewed(\''+e(selected.id)+'\')">'+(watched[selected.id]?'✓ Marked watched':'Mark watched')+'</button>'+
 '<button class="learn-remove" onclick="videoRemove(\''+e(selected.id)+'\')">Remove link</button></div>':'')+
 '</div></div>':'<div class="learn-empty"><b>Your video library is ready.</b><p>Add a video link to build your personal training curriculum. You can organize videos by concept and track what you have watched.</p></div>')+
 '<details class="learn-add"><summary>+ Add a training video</summary><div class="learn-fields">'+
 '<label>Video title<input id="trainingTitle" maxlength="150" placeholder="e.g. Recognizing a Bull 180"></label>'+
 '<label>Video URL<input id="trainingUrl" type="url" placeholder="https://www.youtube.com/watch?v=…"></label>'+
 '<label>Category<select id="trainingTrack">'+tracks.map(t=>'<option value="'+e(t)+'">'+e(t)+'</option>').join('')+'</select></label></div>'+
 '<button class="btn" onclick="addTrainingVideo()">Save to library</button></details>'+
 '<p class="learn-fineprint">Only add videos you have permission to share or link to. Third-party training content is not included in this app. Video links and watched status are saved with your journal data; uploads and paid video hosting are not yet implemented.</p></section>'+
 '<details class="learn-practice"><summary>More pattern drills <span>Open illustrated practice center</span></summary><div id="technicalStudyCenter" class="learn-practice-content"></div></details>';
}
const oldRenderResources=renderResources;
renderResources=function(){
 oldRenderResources();
 const root=$('resources'),legacy=$('technicalStudyCenter');
 const previousPractice=legacy?legacy.innerHTML:'';
 root.innerHTML=renderVideoTraining();
 const place=$('technicalStudyCenter');if(place)place.innerHTML=previousPractice;
};
Object.assign(window,{addTrainingVideo,videoViewed,videoSelect,videoRemove});
renderResources();
})();