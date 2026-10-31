/* Optional Supabase cloud synchronization, manual and conflict-aware. */
let cloudClient=null, cloudUser=null, cloudRevision=null;
const cloudCfg=()=>{try{return JSON.parse(localStorage.getItem('tradecraftCloudConfig')||'{}')}catch{return {}}};
async function cloudInit(){
  const cfg=cloudCfg();
  if(!cfg.url||!cfg.key)throw Error('Enter your Supabase project URL and publishable key first.');
  if(!/^https:\/\//.test(cfg.url))throw Error('Supabase URL must use HTTPS.');
  if(!window.supabase?.createClient)throw Error('Supabase library did not load. Check your connection.');
  if(!cloudClient)cloudClient=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true}});
  const {data:{user},error}=await cloudClient.auth.getUser();if(error&&error.name!=='AuthSessionMissingError')throw error;
  cloudUser=user;return cloudClient;
}
function cloudMessage(s){const el=document.getElementById('cloudStatus');if(el)el.textContent=s;}
function saveCloudConfig(){
 const url=document.getElementById('supabaseUrl').value.trim().replace(/\/$/,'');
 const key=document.getElementById('supabaseKey').value.trim();
 if(!/^https:\/\//.test(url)||!key){cloudMessage('Enter a valid HTTPS project URL and publishable key.');return;}
 localStorage.setItem('tradecraftCloudConfig',JSON.stringify({url,key}));cloudClient=null;cloudUser=null;cloudRevision=null;cloudMessage('Configuration saved. Sign in to connect.');
}
async function cloudAuth(mode){try{
 const client=await cloudInit();const email=document.getElementById('cloudEmail').value.trim(),password=document.getElementById('cloudPassword').value;
 if(!email||password.length<6)throw Error('Enter email and password (at least six characters).');
 const result=mode==='signup'?await client.auth.signUp({email,password}):await client.auth.signInWithPassword({email,password});
 if(result.error)throw result.error;cloudUser=result.data.user;
 cloudMessage(mode==='signup'&&!result.data.session?'Check your email to confirm your account, then sign in.':'Signed in. Download the cloud copy or upload this device.');
 document.getElementById('cloudPassword').value='';
 }catch(e){cloudMessage('Authentication error: '+e.message)}}
async function cloudSignOut(){try{const c=await cloudInit();await c.auth.signOut();cloudUser=null;cloudRevision=null;cloudMessage('Signed out. Local data remains on this device.')}catch(e){cloudMessage(e.message)}}
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
async function cloudUpload(){try{
 cloudMessage('Checking cloud version…');await cloudInit();if(!cloudUser)throw Error('Sign in first.');
 const {data:remote,error:readErr}=await cloudClient.from('challenge_snapshots').select('revision').eq('user_id',cloudUser.id).maybeSingle();if(readErr)throw readErr;
 if(remote && cloudRevision===null)throw Error('Cloud data already exists. Download it first, and export a backup before deciding which copy to keep.');
 if(remote && remote.revision!==cloudRevision)throw Error('Another device changed the cloud copy. Download it and reconcile before uploading.');
 const copy=JSON.parse(JSON.stringify(data));cloudMessage('Uploading compressed chart images…');await uploadImages(copy);
 let result;
 if(!remote)result=await cloudClient.from('challenge_snapshots').insert({user_id:cloudUser.id,payload:copy,revision:1}).select('revision').single();
 else result=await cloudClient.from('challenge_snapshots').update({payload:copy,revision:remote.revision+1,updated_at:new Date().toISOString()}).eq('user_id',cloudUser.id).eq('revision',remote.revision).select('revision').maybeSingle();
 if(result.error)throw result.error;if(!result.data)throw Error('Cloud version changed during upload. Download and reconcile.');
 cloudRevision=result.data.revision;cloudMessage('Cloud upload complete. Revision '+cloudRevision+'.');
 }catch(e){cloudMessage('Upload stopped: '+e.message)}}
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
 save();cloudRevision=row.revision;render();cloudMessage('Cloud copy downloaded. Revision '+cloudRevision+'.');
 }catch(e){cloudMessage('Download stopped: '+e.message)}}
const originalRenderSettings=renderSettings;
renderSettings=function(){originalRenderSettings();const cfg=cloudCfg();const settings=document.getElementById('settings');settings.insertAdjacentHTML('afterbegin',`<div class="panel" style="margin-bottom:16px"><h2>☁ Cloud Sync — Supabase</h2><p>Sync securely between devices. Manual upload/download prevents accidental overwrites. <b>Export a JSON backup before the first sync.</b></p><div class="inline2"><div class="field"><label>Project URL</label><input id="supabaseUrl" placeholder="https://your-project.supabase.co" value="${esc(cfg.url||'')}"></div><div class="field"><label>Publishable / anon key (never service-role)</label><input id="supabaseKey" type="password" placeholder="sb_publishable_..." value="${esc(cfg.key||'')}"></div></div><button class="btn secondary" onclick="saveCloudConfig()">Save connection</button><div class="inline2" style="margin-top:14px"><div class="field"><label>Email</label><input id="cloudEmail" type="email" autocomplete="email"></div><div class="field"><label>Password</label><input id="cloudPassword" type="password" autocomplete="current-password"></div></div><div class="actions"><button class="btn secondary" onclick="cloudAuth('signup')">Create account</button><button class="btn" onclick="cloudAuth('signin')">Sign in</button><button class="btn secondary" onclick="cloudSignOut()">Sign out</button></div><hr style="opacity:.2;margin:16px 0"><div class="actions"><button class="btn" onclick="cloudUpload()">↑ Upload this device</button><button class="btn secondary" onclick="cloudDownload()">↓ Download cloud copy</button></div><p id="cloudStatus" class="muted" role="status">Not connected. See README for setup.</p><p class="muted">Images are stored privately in Supabase Storage. Cloud data is not automatically merged. Requires an HTTPS-hosted page.</p></div>`)};
renderSettings();
