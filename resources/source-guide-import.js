/* Private source-faithful illustrations: load the user's original study-guide ZIP in-browser.
   No instructor screenshots are uploaded to public web hosting or server-side storage. */
(function () {
  'use strict';
  const target = document.getElementById('originalDepictions');
  if (!target) return;

  const DB_NAME = 'trading-mastery-original-visuals';
  const DB_STORE = 'guide';
  const DB_KEY = 'uploadedStudyGuide';
  const PROGRESS_KEY = 'tradecraftMasteryProgress:v1';
  let archive = null, source = null, basePath = '', current = 0, query = '',
      pictureUrls = new Map(), viewVersion = 0, state = 'empty', lastError = '',
      selectedImage = 0, activeUrls = [], chapter = 'all';

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function storage() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('This browser does not support local image storage.'));
      const r = window.indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(DB_STORE)) r.result.createObjectStore(DB_STORE, {keyPath:'id'}); };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error || new Error('Cannot open local guide storage.'));
    });
  }
  async function readStored() {
    const db = await storage();
    return new Promise((resolve,reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const r = tx.objectStore(DB_STORE).get(DB_KEY);
      r.onsuccess = () => resolve(r.result || null);
      r.onerror = () => reject(r.error);
      tx.oncomplete = () => db.close();
    });
  }
  async function writeStored(file) {
    const db = await storage();
    return new Promise((resolve,reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put({id:DB_KEY,file,updatedAt:new Date().toISOString()});
      tx.oncomplete = () => {db.close();resolve();};
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  async function deleteStored() {
    const db = await storage();
    return new Promise((resolve,reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).delete(DB_KEY);
      tx.oncomplete = () => {db.close();resolve();};
      tx.onerror = () => reject(tx.error);
    });
  }

  function sourceStudyProgress() {
    try {
      const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
      return data && typeof data==='object' ? data : {};
    } catch { return {}; }
  }
  function studied(index) { return !!sourceStudyProgress().studied?.['source:'+index]; }
  function recordStudied() {
    try {
      const progress = sourceStudyProgress();
      progress.studied = progress.studied || {};
      const key='source:'+current;
      if (progress.studied[key]) delete progress.studied[key];
      else progress.studied[key] = true;
      progress.updatedAt = new Date().toISOString();
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      const snapshot=JSON.parse(localStorage.getItem('tradecraft60') || 'null');
      if (snapshot && typeof snapshot === 'object') {
        snapshot.settings=snapshot.settings || {};
        snapshot.settings.masteryProgress = progress;
        localStorage.setItem('tradecraft60', JSON.stringify(snapshot));
        localStorage.setItem('tradecraftMasteryPendingSync','1');
      }
      updateNavigator(); updateStudyStatus();
    } catch (err) { report('Study progress could not be saved: '+err.message); }
  }

  function removeUrls() {
    for (const u of pictureUrls.values()) URL.revokeObjectURL(u);
    pictureUrls.clear();
  }
  function validName(name) { return typeof name==='string' && /^[^/\\]+\.(png|jpg|jpeg|webp)$/i.test(name); }
  async function prepareZip(file, persist) {
    if (!window.JSZip) throw new Error('Image ZIP reader did not load. Please reconnect to the internet or use the downloadable offline guide.');
    const z = await window.JSZip.loadAsync(file);
    const path=Object.keys(z.files).find(k => k.endsWith('/guide_content.json') || k==='guide_content.json');
    if (!path || z.files[path].dir) throw new Error('This ZIP does not contain a guide_content.json file.');
    const root=path.slice(0,path.length-'guide_content.json'.length);
    const parsed=JSON.parse(await z.files[path].async('string'));
    if (!Array.isArray(parsed.lessons) || !parsed.lessons.length) throw new Error('The guide has no recognized lesson entries.');
    const refs=parsed.lessons.flatMap(l => Array.isArray(l.images) ? l.images : []);
    const missing=refs.filter(name => !validName(name) || !z.files[root+'assets/'+name] || z.files[root+'assets/'+name].dir);
    if (missing.length) throw new Error('Missing '+missing.length+' referenced image files; this archive is incomplete.');
    if (parsed.lessons.some(l => typeof l.title!=='string' || typeof l.body!=='string' || typeof l.section!=='string')) throw new Error('The guide contains incomplete lesson metadata.');
    removeUrls(); archive=z;source=parsed;basePath=root;
    current=Math.max(0,parsed.lessons.findIndex(l => /^Bull 180\b/i.test(l.title)));
    selectedImage=0;activeUrls=[];chapter='all';query='';state='loaded';lastError='';
    if (persist) {
      try { await writeStored(file); }
      catch(err) { lastError='The images are available for this session, but this browser could not save the ZIP: '+err.message; }
    }
    showGuide();
  }

  function cleanLessonMarkup(markup) {
    // Render emphasis from the uploaded text while stripping scripts, event handlers and URLs.
    const doc=new DOMParser().parseFromString('<div>'+markup+'</div>','text/html');
    const allowed=new Set(['B','STRONG','I','EM','U','BR','P','UL','OL','LI','CODE','SMALL','SUP','SUB']);
    function safe(node) {
      if (node.nodeType===3) return document.createTextNode(node.nodeValue);
      const out=document.createDocumentFragment();
      if (node.nodeType!==1 || ['SCRIPT','STYLE','IFRAME','OBJECT','SVG','FORM'].includes(node.tagName)) return out;
      let dst=allowed.has(node.tagName)?document.createElement(node.tagName):out;
      for (const c of Array.from(node.childNodes)) dst.appendChild(safe(c));
      return dst;
    }
    const result=document.createElement('div');
    for (const c of Array.from(doc.body.firstElementChild?.childNodes || [])) result.appendChild(safe(c));
    return result.innerHTML;
  }

  function summaryCount() {
    const all=source?.lessons || [];
    const refs=all.reduce((n,l)=>n+(l.images?.length||0),0);
    const uniq=new Set(all.flatMap(l=>l.images||[])).size;
    return {lessons:all.length, refs, unique:uniq,
      done:all.reduce((n,_,i)=>n+Number(studied(i)),0)};
  }
  function filteredItems() {
    const value=query.trim().toLowerCase();
    return source.lessons.map((l,i)=>({...l,index:i})).filter(l=>
      (chapter==='all'||l.section===chapter)&&
      (!value||(l.title+' '+l.section+' '+l.body+' '+(l.tags||[]).join(' ')).toLowerCase().includes(value)));
  }
  function showGuide() {
    if (!source) return;
    const stats=summaryCount();
    target.innerHTML=
      '<section class="original-banner"><div><span class="original-eyebrow">TRADING MASTERY · ORIGINAL VISUALS</span>'+
      '<h2>Visual lesson library</h2><p>One lesson and one picture at a time. Original diagrams remain unaltered.</p></div>'+
      '<div class="original-counts"><b id="originalProgressNumber">'+stats.done+' / '+stats.lessons+'</b><span>Lessons reviewed</span></div></section>'+
      (lastError?'<p class="original-warning">'+escapeHTML(lastError)+'</p>':'')+
      '<div class="original-toolbar">'+
      '<label class="original-chapter-label">Chapter<select id="originalChapter" aria-label="Choose chapter"></select></label>'+
      '<label class="original-lesson-label">Lesson<select id="originalLesson" aria-label="Choose lesson"></select></label>'+
      '<label class="original-search-label">Search<input type="search" id="originalSearch" placeholder="Find a lesson…" value="'+escapeHTML(query)+'"></label>'+
      '</div><div class="original-meta"><span id="originalLessonCount"></span>'+
      '<div class="original-meta-actions"><button type="button" class="original-secondary" data-original="replace">Change ZIP</button>'+
      '<button type="button" class="original-secondary original-remove" data-original="forget">Remove saved images</button></div></div>'+
      '<div class="original-detail" id="originalDetail"></div>';
    updateNavigator();loadCurrentVisuals();
  }

  function updateNavigator() {
    if(!source)return;
    const chapters=[...new Set(source.lessons.map(l=>l.section))];
    const selector=document.getElementById('originalChapter');
    if(selector)selector.innerHTML='<option value="all">All chapters</option>'+
      chapters.map(name=>'<option value="'+escapeHTML(name)+'" '+(chapter===name?'selected':'')+'>'+escapeHTML(name)+'</option>').join('');
    const items=filteredItems(),lessonSelect=document.getElementById('originalLesson');
    if(lessonSelect) {
      lessonSelect.innerHTML=
        (items.some(l=>l.index===current)?'':'<option value="" selected>Choose from '+items.length+' matching lessons</option>')+
        items.map(l=>'<option value="'+l.index+'" '+(l.index===current?'selected':'')+'>'+
          String(l.index+1).padStart(2,'0')+' · '+escapeHTML(l.title)+(studied(l.index)?' ✓':'')+
          '</option>').join('')+
        (!items.length?'<option value="" selected>No matching lessons</option>':'');
      lessonSelect.disabled=!items.length;
    }
    const summary=document.getElementById('originalLessonCount');
    if(summary)summary.textContent=items.length+' lessons in view · '+source.lessons.length+' total';
  }

  function updateStudyStatus() {
    const progress=document.getElementById('originalProgressNumber');
    if(progress)progress.textContent=summaryCount().done+' / '+source.lessons.length;
    const mark=document.getElementById('originalStudyButton');
    if(mark)mark.textContent=studied(current)?'✓ Reviewed · Undo':'Mark reviewed';
  }

  function navigationScope() {
    const matches=filteredItems();
    return matches.some(l=>l.index===current)?matches:source.lessons.map((l,index)=>({...l,index}));
  }
  function selectLesson(index) {
    if (!Number.isInteger(index)||index<0||index>=source.lessons.length)return;
    current=index;selectedImage=0;activeUrls=[];
    updateNavigator();loadCurrentVisuals();
  }
  function stepLesson(by) {
    const scope=navigationScope();
    const position=scope.findIndex(l=>l.index===current);
    const next=scope[position+by];
    if(next){
      selectLesson(next.index);
      const panel=document.getElementById('originalDetail');
      if(panel && typeof panel.scrollIntoView==='function'){
        panel.scrollIntoView({behavior:'auto',block:'start'});
      }
    }
  }

  async function assetURL(name) {
    if (pictureUrls.has(name)) return pictureUrls.get(name);
    const z=archive.file(basePath+'assets/'+name);
    if (!z) throw new Error('This image is missing: '+name);
    const blob=await z.async('blob');
    const url=URL.createObjectURL(blob);pictureUrls.set(name,url);return url;
  }

  function updatePicture() {
    const lesson=source?.lessons[current];
    const names=lesson?.images||[];
    if(!names.length||!activeUrls.length)return;
    selectedImage=Math.max(0,Math.min(names.length-1,selectedImage));
    const image=document.getElementById('originalHeroImage');
    const count=document.getElementById('originalPhotoCount');
    const full=document.getElementById('originalFullSize');
    const prev=document.getElementById('originalPhotoPrev');
    const next=document.getElementById('originalPhotoNext');
    if(image) {image.src=activeUrls[selectedImage];image.alt=lesson.title+' · original depiction '+(selectedImage+1);}
    if(count)count.textContent='Image '+(selectedImage+1)+' of '+names.length;
    if(full)full.href=activeUrls[selectedImage];
    if(prev)prev.disabled=selectedImage===0;
    if(next)next.disabled=selectedImage===names.length-1;
    target.querySelectorAll('[data-original^="image:"]').forEach(button=>{
      const active=Number(button.dataset.original.slice(6))===selectedImage;
      button.setAttribute('aria-pressed',String(active));
      button.classList.toggle('is-selected',active);
    });
  }

  async function loadCurrentVisuals() {
    const index=current, req=++viewVersion;
    const lesson=source?.lessons[index];if(!lesson)return;
    const el=document.getElementById('originalDetail');if(!el)return;
    const images=lesson.images||[];
    el.innerHTML='<div class="original-loading">Loading this lesson’s images…</div>';
    try{
      const urls=await Promise.all(images.map(assetURL));
      if(req!==viewVersion||current!==index)return;
      activeUrls=urls;selectedImage=0;
      const needsReview=lesson.status==='needs-verification'?
        '<p class="original-warning">This source lesson has a rule flagged for verification. Do not infer missing conditions from the illustration.</p>':'';
      const photo=images.length?
        '<div class="original-gallery">'+
          '<div class="original-photo-frame"><img id="originalHeroImage" src="'+urls[0]+'" alt="'+escapeHTML(lesson.title+' · original depiction 1')+'"></div>'+
          '<div class="original-photo-controls"><div class="original-photo-step">'+
          '<button type="button" class="original-secondary" id="originalPhotoPrev" data-original="imagePrev" disabled aria-label="Previous image">‹</button>'+
          '<span id="originalPhotoCount">Image 1 of '+images.length+'</span>'+
          '<button type="button" class="original-secondary" id="originalPhotoNext" data-original="imageNext" '+(images.length===1?'disabled':'')+' aria-label="Next image">›</button></div>'+
          '<a class="original-zoom" id="originalFullSize" href="'+urls[0]+'" target="_blank" rel="noopener noreferrer">Open full-size image</a></div>'+
          (images.length>1?'<div class="original-thumbnails" aria-label="Choose an image">'+images.map((name,i)=>
            '<button type="button" class="original-thumb '+(i===0?'is-selected':'')+'" data-original="image:'+i+'" aria-pressed="'+(i===0)+'" aria-label="Show image '+(i+1)+' of '+images.length+'">'+
            '<img src="'+urls[i]+'" alt="" loading="lazy"><small>'+(i+1)+'</small></button>').join('')+'</div>':'')+
        '</div>':
        '<div class="original-warning">This lesson has no original image in the supplied guide. The source notes remain available below.</div>';
      const notes='<details class="original-notes"><summary>Read source lesson notes</summary>'+
        '<div class="original-explanation">'+cleanLessonMarkup(lesson.body)+'</div></details>';
      const scope=navigationScope(),pos=scope.findIndex(l=>l.index===index);
      el.innerHTML='<div class="original-detailhead">'+
        '<div><span class="original-eyebrow">'+escapeHTML(lesson.section)+'</span>'+
        '<h3>'+escapeHTML(lesson.title)+'</h3>'+
        '<span class="original-viewing">Lesson '+(index+1)+' of '+source.lessons.length+'</span></div>'+
        '<button type="button" class="original-primary" id="originalStudyButton" data-original="studied">'+
        (studied(index)?'✓ Reviewed · Undo':'Mark reviewed')+'</button></div>'+
        needsReview+photo+notes+
        '<div class="original-actions"><button type="button" class="original-secondary" data-original="previous" '+(pos<=0?'disabled':'')+'>‹ Previous lesson</button>'+
        '<button type="button" class="original-secondary" data-original="next" '+(pos>=scope.length-1?'disabled':'')+'>Next lesson ›</button></div>';
    }catch(err){
      if(req===viewVersion)el.innerHTML='<p class="original-warning">Could not load this illustration: '+escapeHTML(err.message)+'</p>';
    }
  }

  function emptyView(message) {
    target.innerHTML='<div class="original-banner"><div><span class="original-eyebrow">ORIGINAL LESSON DEPICTIONS</span><h2>Display the exact illustrations from your study guide</h2>'+
      '<p>Load <b>trading_mastery_study_guide.zip</b> once on this device. The app will privately remember the original images and match them to all 37 lessons. Nothing is uploaded to the public website.</p></div></div>'+
      '<div class="original-import"><label class="original-primary" for="originalZipPicker">Choose your Trading Mastery ZIP</label>'+
      '<input type="file" id="originalZipPicker" accept=".zip,application/zip,application/x-zip-compressed" hidden>'+
      '<p class="original-muted">'+escapeHTML(message||'The schematic pattern quizzes remain available below; imported screenshots take precedence for learning the instructor’s rules.')+'</p></div>';
  }
  function report(message) {
    const el=document.getElementById('originalMessage');
    if(el)el.textContent=message;else lastError=message;
  }

  target.addEventListener('click',async e=>{
    const a=e.target.closest('[data-original]');if(!a)return;
    const cmd=a.dataset.original;
    if(cmd==='replace'){emptyView('Choose your replacement guide ZIP.');return;}
    if(cmd==='forget'){
      if(!window.confirm('Remove the privately saved screenshot archive from this browser? Your study progress remains.'))return;
      try{await deleteStored()}catch(err){lastError='Could not clear saved images: '+err.message;}
      removeUrls();archive=null;source=null;state='empty';emptyView(lastError);return;
    }
    if(cmd.startsWith('image:')){selectedImage=Number(cmd.slice(6));updatePicture();return;}
    if(cmd==='imagePrev'||cmd==='imageNext'){selectedImage+=(cmd==='imageNext'?1:-1);updatePicture();return;}
    if(cmd==='previous'||cmd==='next'){stepLesson(cmd==='next'?1:-1);return;}
    if(cmd==='studied')recordStudied();
  });
  target.addEventListener('input',e=>{
    if(e.target.id!=='originalSearch')return;
    query=e.target.value;updateNavigator();
  });
  target.addEventListener('change',e=>{
    if(e.target.id==='originalChapter'){
      chapter=e.target.value;query='';
      const search=document.getElementById('originalSearch');if(search)search.value='';
      const first=filteredItems()[0];
      if(first)selectLesson(first.index);else updateNavigator();
      return;
    }
    if(e.target.id==='originalLesson'&&e.target.value!==''){selectLesson(Number(e.target.value))}
  });
  target.addEventListener('change',async e=>{
    if(e.target.id!=='originalZipPicker')return;
    const file=e.target.files?.[0];if(!file)return;
    emptyView('Validating and organizing the original screenshots…');
    try{await prepareZip(file,true)}
    catch(err){state='error';lastError=err.message;emptyView('Import failed: '+err.message);}
  });

  emptyView('Checking for a previously imported guide…');
  (async()=> {
    try{
      const saved=await readStored();
      if(saved?.file) await prepareZip(saved.file,false);
      else emptyView('Choose your original ZIP to display the source images. Your other Trading Mastery study modes are available below.');
    }catch(err){lastError=err.message;emptyView('Your browser could not restore saved screenshots: '+err.message);}
  })();
})();