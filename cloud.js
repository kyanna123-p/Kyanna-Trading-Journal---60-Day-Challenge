/* Optional Supabase cloud synchronization, manual and conflict-aware. */
let cloudClient=null, cloudUser=null, cloudRevision=null;
const cloudCfg=()=>{try{return JSON.parse(localStorage.getItem('tradecraftCloudConfig')||'{}')}catch{return {}}};
async function cloudInit(){
  const cfg=cloudCfg();
  if(!cfg.url||!cfg.key)throw Error('Enter your Supabase project URL and publishable key first.');
  if(!/^https:\/\//.test(cfg.url))throw Error('Supabase URL must use HTTPS.');
  if(!window.supabase?.createClient)throw Error('Supabase library did not load. Check your connection.');
  if(!cloudClient)cloudClient=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true}});
  const {data:{session},error}=await cloudClient.auth.getSession();if(error)throw error;
  cloudUser=session?.user||null;if(cloudUser && cloudRevision===null){const v=localStorage.getItem('tradecraftCloudRevision:'+cloudUser.id);if(v!==null)cloudRevision=Number(v);}return cloudClient;
}
let cloudLastMessage='Not connected. See README for setup.';
function cloudMessage(s){cloudLastMessage=s;const el=document.getElementById('cloudStatus');if(el)el.textContent=s;}
function saveCloudConfig(){
 const url=document.getElementById('supabaseUrl').value.trim().replace(/\/$/,'');
 const key=document.getElementById('supabaseKey').value.trim();
 if(!/^https:\/\//.test(url)||!key){cloudMessage('Enter a valid HTTPS project URL and publishable key.');return;}
 localStorage.setItem('tradecraftCloudConfig',JSON.stringify({url,key}));cloudClient=null;cloudUser=null;cloudRevision=null;cloudMessage('Configuration saved. Sign in to connect.');
}
async function cloudAuth(mode){try{
 const email=document.getElementById('cloudEmail').value.trim(),password=document.getElementById('cloudPassword').value;
 if(!email||password.length<6)throw Error('Enter email and password (at least six characters).');
 cloudMessage(mode==='signup'?'Creating account…':'Signing in…');
 const client=await cloudInit();
 const result=mode==='signup'?await client.auth.signUp({email,password}):await client.auth.signInWithPassword({email,password});
 if(result.error)throw result.error;cloudUser=result.data.user;
 cloudMessage(mode==='signup'&&!result.data.session?'Check your email to confirm your account, then sign in.':'Signed in. Download the cloud copy or upload this device.');
 document.getElementById('cloudPassword').value='';
 }catch(e){cloudMessage('Authentication error: '+(e.message||String(e))+(e.status?' (HTTP '+e.status+')':''));console.error('Supabase authentication failed',e)}}
async function cloudSignOut(){try{const c=await cloudInit();await c.auth.signOut();cloudUser=null;cloudRevision=null;cloudAutoEnabled=false;cloudMessage('Signed out. Local data remains on this device.')}catch(e){cloudMessage(e.message)}}
async function uploadImages(copy){
 for(const type of ['trades','studies'])for(const item of copy[type]){
   if(!item.image?.startsWith('data:image/'))continue;
   const m=item.image.match(/^data:(image\/(?:jpeg|png|webp));base64,(.*)$/);if(!m)continue;
   const binary=atob(m[2]),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
   const ext=m[1].split('/')[1],safeId=String(item.id).replace(/[^a-zA-Z0-9_-]/g,'_');
   const path=`${cloudUser.id}/${type}/${safeId}.${ext}`;
   const {error}=await cloudClient.storage.from('challenge-charts').upload(path,bytes,{contentType:m[1],upsert:true});if(error)throw error;
   item.image='storage:'+path;
 }
}
async function cloudUpload(){if(cloudBusy)return;cloudBusy=true;try{
 cloudMessage('Checking cloud version…');await cloudInit();if(!cloudUser)throw Error('Sign in first.');
 const {data:remote,error:readErr}=await cloudClient.from('challenge_snapshots').select('revision').eq('user_id',cloudUser.id).maybeSingle();if(readErr)throw readErr;
 if(remote && cloudRevision===null)throw Error('Cloud data already exists. Download it first, and export a backup before deciding which copy to keep.');
 if(remote && remote.revision!==cloudRevision){cloudAutoEnabled=false;throw Error('Another device changed the cloud copy. Automatic saving paused. Export a backup, then download and reconcile.');}
 const copy=JSON.parse(JSON.stringify(data));cloudMessage('Uploading compressed chart images…');await uploadImages(copy);
 let result;
 if(!remote)result=await cloudClient.from('challenge_snapshots').insert({user_id:cloudUser.id,payload:copy,revision:1}).select('revision').single();
 else result=await cloudClient.from('challenge_snapshots').update({payload:copy,revision:remote.revision+1,updated_at:new Date().toISOString()}).eq('user_id',cloudUser.id).eq('revision',remote.revision).select('revision').maybeSingle();
 if(result.error)throw result.error;if(!result.data)throw Error('Cloud version changed during upload. Download and reconcile.');
 cloudRevision=result.data.revision;localStorage.setItem('tradecraftCloudRevision:'+cloudUser.id,String(cloudRevision));cloudDirty=false;cloudMessage('Cloud upload complete. Revision '+cloudRevision+'.');
 }catch(e){cloudMessage('Upload stopped: '+e.message)}finally{cloudBusy=false}}
async function cloudDownload(){try{
 cloudMessage('Downloading cloud copy…');await cloudInit();if(!cloudUser)throw Error('Sign in first.');
 const {data:row,error}=await cloudClient.from('challenge_snapshots').select('payload,revision').eq('user_id',cloudUser.id).maybeSingle();if(error)throw error;
 if(!row){cloudRevision=null;cloudMessage('No cloud copy yet. Use Upload this device to create one.');return;}
 if(!confirm('Replace this device’s journal with the cloud copy? Export a JSON backup first if you need your local data.'))return;
 const copy=row.payload;
 for(const type of ['trades','studies'])for(const item of copy[type]||[]){
  if(!item.image?.startsWith('storage:'))continue;
  const path=item.image.slice(8),{data:blob,error:imgErr}=await cloudClient.storage.from('challenge-charts').download(path);if(imgErr)throw imgErr;
  item.image=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob)});
 }
 data=copy;for(const k of Object.keys(blank()))if(!data[k])data[k]=blank()[k];
 cloudIgnoreSave=true;try{save()}finally{cloudIgnoreSave=false}cloudRevision=row.revision;localStorage.setItem('tradecraftCloudRevision:'+cloudUser.id,String(cloudRevision));cloudDirty=false;render();cloudMessage('Cloud copy downloaded. Revision '+cloudRevision+'.');
 }catch(e){cloudMessage('Download stopped: '+e.message)}}
const originalRenderSettings=renderSettings;
renderSettings=function(){originalRenderSettings();const cfg=cloudCfg();const settings=document.getElementById('settings');settings.insertAdjacentHTML('afterbegin',`<div class="panel" style="margin-bottom:16px"><h2>☁ Cloud Sync — Supabase</h2><p>Sync securely between devices. Manual upload/download prevents accidental overwrites. <b>Export a JSON backup before the first sync.</b></p><div class="inline2"><div class="field"><label>Project URL</label><input id="supabaseUrl" placeholder="https://your-project.supabase.co" value="${esc(cfg.url||'')}"></div><div class="field"><label>Publishable / anon key (never service-role)</label><input id="supabaseKey" type="password" placeholder="sb_publishable_..." value="${esc(cfg.key||'')}"></div></div><button class="btn secondary" onclick="saveCloudConfig()">Save connection</button><div class="inline2" style="margin-top:14px"><div class="field"><label>Email</label><input id="cloudEmail" type="email" autocomplete="email"></div><div class="field"><label>Password</label><input id="cloudPassword" type="password" autocomplete="current-password"></div></div><div class="actions"><button class="btn secondary" onclick="cloudAuth('signup')">Create account</button><button class="btn" onclick="cloudAuth('signin')">Sign in</button><button class="btn secondary" onclick="cloudSignOut()">Sign out</button></div><hr style="opacity:.2;margin:16px 0"><div class="actions"><button class="btn" onclick="cloudUpload()">↑ Upload this device</button><button class="btn secondary" onclick="cloudDownload()">↓ Download cloud copy</button></div><p id="cloudStatus" class="muted" role="status">Not connected. See README for setup.</p><p class="muted">Images are stored privately in Supabase Storage. Cloud data is not automatically merged. Requires an HTTPS-hosted page.</p></div>`)};
renderSettings();
cloudMessage('Connection settings loaded. Sign in if needed, then enable automatic saving.');


/* Opt-in automatic cloud uploads. Never silently replace local records. */
let cloudAutoEnabled=false,cloudDirty=false,cloudIgnoreSave=false,cloudBusy=false,cloudTimer=null;
const localSave=save;
save=function(){
 localSave();
 if(cloudIgnoreSave)return;
 cloudDirty=true;
 if(cloudAutoEnabled)cloudSchedule();
};
function cloudSchedule(){
 clearTimeout(cloudTimer);
 if(!cloudAutoEnabled)return;
 cloudTimer=setTimeout(async()=>{
  if(cloudBusy){cloudSchedule();return;}
  if(!cloudDirty)return;
  await cloudUpload();
 },1800);
}
async function cloudToggleAuto(){
 if(cloudAutoEnabled){
  cloudAutoEnabled=false;
  clearTimeout(cloudTimer);
  cloudMessage('Automatic saving paused.');
 }else{
  try{
   cloudMessage('Connecting automatic saving...');
   await cloudInit();
   if(!cloudUser)throw Error('Sign in first.');
   const {data:remote,error}=await cloudClient.from('challenge_snapshots').select('revision').eq('user_id',cloudUser.id).maybeSingle();
   if(error)throw error;
   if(remote && cloudRevision!==remote.revision)throw Error('Cloud copy is newer. Download cloud copy before enabling automatic saving.');
   if(!remote && cloudRevision!==null)throw Error('Cloud copy missing. Upload this device first.');
   if(cloudRevision===null)throw Error('Upload or download a cloud copy first.');
   cloudAutoEnabled=true;
   cloudMessage('Automatic saving enabled. Edit a note and tap outside the field.');
   if(cloudDirty)cloudSchedule();
  }catch(e){cloudAutoEnabled=false;cloudMessage('Automatic saving unavailable: '+e.message);}
 }
 const button=document.getElementById('cloudAutoButton');
 if(button)button.textContent=cloudAutoEnabled?'Pause automatic saving':'Enable automatic saving';
}
const renderCloudSettings=renderSettings;
renderSettings=function(){
 renderCloudSettings();
 const status=document.getElementById('cloudStatus');
 if(!status||document.getElementById('cloudAutoButton'))return;
 status.textContent=cloudLastMessage;
 status.insertAdjacentHTML('beforebegin','<div class="actions"><button id="cloudAutoButton" class="btn secondary" onclick="cloudToggleAuto()">Enable automatic saving</button></div><p class="muted">Automatic saving is opt-in per open tab. Changes upload after 2 seconds of inactivity. For changes from another device, use Download cloud copy before editing. Conflicts stop uploads rather than overwriting newer data.</p>');
};
renderSettings();
