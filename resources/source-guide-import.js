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
      pictureUrls = new Map(), viewVersion = 0, state = 'empty', lastError = '';

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
      showGuide();
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
    query='';state='loaded';lastError='';
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
      !value||(l.title+' '+l.section+' '+l.body+' '+(l.tags||[]).join(' ')).toLowerCase().includes(value));
  }
  function showGuide() {
    if (!source) return;
    const s=summaryCount();
    target.innerHTML=
      '<div class="original-banner"><div><span class="original-eyebrow">ORIGINAL LESSON DEPICTIONS · PRIVATE LIBRARY</span><h2>Learn directly from your source screenshots</h2>'+
      '<p>Images are displayed exactly as supplied, with the lesson rules below. Your ZIP is saved in this browser, not published on the website.</p></div>'+
      '<div class="original-counts"><b>'+s.unique+'</b> unique screenshots <span>'+s.refs+' lesson placements · '+s.lessons+' lessons · '+s.done+' reviewed</span></div></div>'+
      (lastError?'<p class="original-warning">'+escapeHTML(lastError)+'</p>':'')+
      '<div class="original-toolbar"><label>Find a lesson<input type="search" id="originalSearch" placeholder="Bull 180, Elephant Bar, moving averages…" value="'+escapeHTML(query)+'"></label>'+
      '<button type="button" class="original-secondary" data-original="replace">Import another ZIP</button>'+
      '<button type="button" class="original-secondary" data-original="forget">Clear private guide</button>'+
      '<a href="#masteryApp" class="original-secondary">Pattern quizzes and flashcards</a></div>'+
      '<div class="original-grid"><aside class="original-directory" id="originalDirectory"></aside><div class="original-detail" id="originalDetail"></div></div>';
    updateDirectory();
    loadCurrentVisuals();
  }
  function updateDirectory() {
    const el=document.getElementById('originalDirectory');
    if(!el||!source)return;
    const group={};filteredItems().forEach(l=>(group[l.section]??=[]).push(l));
    el.innerHTML=Object.entries(group).map(([section,items])=>
      '<div class="original-dirgroup"><h3>'+escapeHTML(section)+'</h3>'+
      items.map(l=>'<button type="button" data-original="lesson:'+l.index+'" class="original-lesson '+(current===l.index?'current':'')+'">'+
      escapeHTML(l.title)+
      '<small>'+(l.images||[]).length+' original image'+((l.images||[]).length!==1?'s':'')+(studied(l.index)?' · ✓ Studied':'')+'</small></button>').join('')+'</div>').join('')||
      '<p class="original-empty">No matching lessons.</p>';
  }
  async function assetURL(name) {
    if (pictureUrls.has(name)) return pictureUrls.get(name);
    const z=archive.file(basePath+'assets/'+name);
    if (!z) throw new Error('This image is missing: '+name);
    const blob=await z.async('blob');
    const url=URL.createObjectURL(blob);pictureUrls.set(name,url);return url;
  }
  async function loadCurrentVisuals() {
    const index=current, req=++viewVersion;
    const lesson=source?.lessons[index];if(!lesson)return;
    const el=document.getElementById('originalDetail');if(!el)return;
    const imgs=lesson.images||[];
    el.innerHTML='<div class="original-detailhead"><span class="original-eyebrow">'+escapeHTML(lesson.section)+'</span><h3>'+escapeHTML(lesson.title)+'</h3></div>'+
      '<div class="original-loading">Preparing '+imgs.length+' original depiction'+(imgs.length===1?'':'s')+'…</div>';
    try {
      const links=await Promise.all(imgs.map(assetURL));
      if(req!==viewVersion || current!==index)return;
      const visual=imgs.length?
        '<section class="original-gallery"><h4>Original lesson depictions · '+imgs.length+'</h4>'+
        imgs.map((name,i)=>
          '<figure class="original-figure"><a href="'+links[i]+'" target="_blank" rel="noopener noreferrer" title="Open original image full size">'+
          '<img src="'+links[i]+'" loading="lazy" alt="'+escapeHTML(lesson.title+' · original illustration '+(i+1))+'"></a>'+
          '<figcaption><span>Original '+(i+1)+' / '+imgs.length+'</span><a href="'+links[i]+'" target="_blank" rel="noopener noreferrer">View full size</a></figcaption></figure>'
        ).join('')+'</section>':
        '<div class="original-warning">No original depiction was attached to this lesson. Its exact source text is kept below.</div>';
      const warn=lesson.status==='needs-verification'?
        '<div class="original-warning">Source verification required: the lesson notes flag a rule that should not be inferred from the picture alone.</div>':'';
      el.innerHTML='<div class="original-detailhead"><span class="original-eyebrow">'+escapeHTML(lesson.section)+'</span><h3>'+escapeHTML(lesson.title)+'</h3>'+
        '<div class="original-tags">'+(lesson.tags||[]).map(t=>'<span>'+escapeHTML(t)+'</span>').join('')+'</div></div>'+warn+visual+
        '<section class="original-explanation"><h4>Source lesson notes</h4>'+cleanLessonMarkup(lesson.body)+'</section>'+
        '<div class="original-actions"><div><button type="button" class="original-secondary" data-original="previous" '+(index===0?'disabled':'')+'>Previous</button>'+
        '<button type="button" class="original-secondary" data-original="next" '+(index===source.lessons.length-1?'disabled':'')+'>Next lesson</button></div>'+
        '<button type="button" class="original-primary" data-original="studied">'+(studied(index)?'✓ Reviewed · Undo':'Mark as reviewed')+'</button></div>';
    }catch(err){
      if (req===viewVersion) el.innerHTML='<p class="original-warning">Could not load a depiction: '+escapeHTML(err.message)+'</p>';
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
    if(cmd==='replace'){emptyView('Choose your replacement study-guide ZIP.');return;}
    if(cmd==='forget'){
      if(!window.confirm('Remove the privately saved screenshot archive from this browser? Your studied markers are retained.'))return;
      try{await deleteStored()}catch(err){lastError='Could not clear private images: '+err.message;}
      removeUrls();archive=null;source=null;state='empty';emptyView(lastError);return;
    }
    if(cmd.startsWith('lesson:')){current=Number(cmd.slice(7));updateDirectory();loadCurrentVisuals();return;}
    if(cmd==='previous'||cmd==='next'){current=Math.min(source.lessons.length-1,Math.max(0,current+(cmd==='next'?1:-1)));updateDirectory();loadCurrentVisuals();return;}
    if(cmd==='studied')recordStudied();
  });
  target.addEventListener('input',e=>{
    if(e.target.id!=='originalSearch')return;
    const node=e.target;query=node.value;
    updateDirectory();
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