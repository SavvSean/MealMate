(()=>{'use strict';
const MS=86400000;
const mealPlan=[['2 eggs + rice + banana','Chicken adobo + rice + cabbage','Adobo + rice + vegetables'],['Egg + bread + banana','Adobo + rice + vegetables','Sardines + pechay + rice'],['Oatmeal + banana + milk','Chicken tinola + rice','Tinola + rice'],['2 eggs + rice + tomato','Tinola + rice','Tofu + vegetables + rice'],['Oatmeal + banana + milk','Sardines + pechay + rice','Chicken adobo + rice'],['Egg + bread + banana','Adobo + rice + cabbage','Tofu + vegetables + rice'],['Oatmeal + banana + milk','Chicken tinola + rice','Tinola + rice']];
const recipes=[
{icon:'egg',name:'Eggs with rice & tomato',time:'15–20 min',ingredients:'Eggs, water, cooked rice, tomato',steps:['Use the rice cooker only for boiling/steaming eggs if its instructions permit it. Add water as recommended by the manufacturer.','Cook eggs until both whites and yolks are firm, then cool them in clean water.','Serve with cooked rice and sliced tomato.']},
{icon:'oats',name:'Oatmeal & banana',time:'10–15 min',ingredients:'Rolled oats, water or milk, banana',steps:['Add oats and liquid according to the oats package, provided your cooker supports porridge/oatmeal.','Cook while monitoring for foaming or boil-over, following cooker directions.','Top with banana. Milk can also be added after cooking.']},
{icon:'fish',name:'Sardines with pechay',time:'10–15 min',ingredients:'1 can sardines, a handful of pechay, small amount of water',steps:['Only if your cooker permits cooking soups/other foods: add sardines and a small splash of water to its pot.','Heat until bubbling, add washed chopped pechay and simmer until wilted and hot throughout.','Serve with separately prepared rice.']},
{icon:'veg',name:'Steamed tofu & vegetables',time:'15–25 min',ingredients:'Firm tofu, cabbage, carrots, soy sauce',steps:['If a steamer tray is supplied and approved for your cooker, add water beneath it as the manual directs.','Place sliced carrots and cabbage on the tray, and tofu in a heat-safe bowl or tray according to cooker instructions.','Steam until vegetables are tender and tofu is steaming hot, then add a little soy sauce.']},
{icon:'chicken',name:'Chicken adobo',time:'35–55 min',ingredients:'Chicken, garlic, soy sauce, vinegar, pepper, water',steps:['Only make this in a cooker expressly designed for simmering meat. Do not rely on a standard rice-only cook/warm cycle.','Combine chicken, crushed garlic, soy sauce, vinegar, pepper and a little water in the approved pot.','Simmer with sufficient liquid until chicken reaches 74°C (165°F) at its thickest point; use a food thermometer.','Cool leftovers promptly in shallow containers and refrigerate within two hours.']},
{icon:'pot',name:'Chicken tinola',time:'40–60 min',ingredients:'Chicken, ginger, sayote, malunggay, water',steps:['Only use a cooker approved for cooking raw poultry and simmering soup.','Combine chicken, ginger and water, and simmer until chicken is cooked through.','Add sliced sayote and cook until tender; add malunggay near the end.','Verify chicken reaches 74°C (165°F) with a thermometer.']}
];
// Original cartoon-style kitchen icons: inline SVG, no third-party icon library.
const art={
 egg:`<ellipse cx="25" cy="28" rx="21" ry="17" fill="#fff9e5"/><path d="M15 27c1-8 8-14 16-11 10 3 10 17 1 22-8 5-18-3-17-11Z" fill="#ffc958"/><circle cx="26" cy="26" r="3" fill="#fff1a8"/>`,
 rice:`<path d="M8 23h34l-4 17H12Z" fill="#d49b68"/><path d="M6 23q1-16 19-16t19 16Z" fill="#fff9e8"/><path d="M15 16l5-4m5 4 4-3m5 6 3-2" stroke="#d2c6a5"/>`,
 plate:`<ellipse cx="25" cy="26" rx="21" ry="18" fill="#fff6df"/><ellipse cx="25" cy="26" rx="14" ry="12" fill="#fff"/><ellipse cx="25" cy="26" rx="8" ry="7" fill="#ffc960"/><path d="M13 7v7m-4-7v7m8-7v7m-4 0v5M37 7v13" fill="none" stroke="#563522" stroke-width="2.5"/>`,
 basket:`<path d="M7 21h36l-5 22H12Z" fill="#e5a866"/><path d="M15 21 23 8m12 13L27 8" fill="none" stroke-width="4"/><path d="M15 29h20M18 36h14M24 23v18" fill="none" stroke="#94502c" stroke-width="2.5"/>`,
 calendar:`<rect x="7" y="11" width="36" height="32" rx="5" fill="#fff5df"/><path d="M7 20h36"/><path d="M16 7v9M34 7v9" stroke-width="4"/><path d="M15 27h6v6h-6zM29 27h6v6h-6z" fill="#eab158"/>`,
 book:`<path d="M8 10q10-5 17 3 8-8 17-3v31q-11-5-17 3-8-8-17-3Z" fill="#fff7e2"/><path d="M25 13v31M13 19h7m-7 7h7m10-7h7m-7 7h7" fill="none" stroke-width="2.2"/>`,
 cloche:`<path d="M7 34h36M11 31q0-18 14-18t14 18Z" fill="#f3b86c"/><circle cx="25" cy="11" r="4" fill="#ffda82"/><path d="M18 40h14"/>`,
 pot:`<path d="M10 20h30l-4 23H14Z" fill="#d48762"/><path d="M5 23h5m30 0h5M11 17h28M22 14h6"/><path d="M17 9q-4-4 0-7m9 9q-4-4 0-7m8 5q-4-4 0-7" fill="none" stroke="#e69a65"/>`,
 fish:`<path d="M9 25q15-18 30 0-15 18-30 0Zm0 0-5-9v18Z" fill="#80b5ad"/><circle cx="32" cy="22" r="2" fill="#543827"/><path d="M19 20q5 5 0 10" fill="none"/>`,
 veg:`<path d="M24 44V20" stroke="#578a5b" stroke-width="4"/><path d="M24 29C4 29 5 7 20 8q5 6 4 21Zm0-4C25 5 45 6 43 20q-5 8-19 5Z" fill="#87ba74"/><path d="m18 16 6 13m11-12-11 8" fill="none" stroke="#527b4c" stroke-width="2"/>`,
 chicken:`<path d="M14 24C14 12 26 6 35 13c7 5 8 16 1 23-7 7-17 4-22-2Z" fill="#d88856"/><path d="m15 32-7 9" stroke="#fff0ca" stroke-width="7"/><circle cx="7" cy="41" r="4" fill="#fff3d7"/><circle cx="13" cy="44" r="4" fill="#fff3d7"/>`,
 oats:`<path d="M8 20h34l-5 22H13Z" fill="#b57a53"/><ellipse cx="25" cy="20" rx="17" ry="7" fill="#fff0cb"/><circle cx="18" cy="18" r="3" fill="#d8a55b"/><circle cx="27" cy="21" r="4" fill="#dfbb6d"/><circle cx="33" cy="17" r="2" fill="#e9bd67"/>`,
 bread:`<path d="M10 17Q6 5 19 5q7-6 13 0 14-1 9 14v23H10Z" fill="#d99953"/><path d="M16 21q-3-11 7-11 5-3 10 0 7 0 3 11v16H16Z" fill="#ffe4a5"/>`,
 banana:`<path d="M12 8q-9 29 19 33Q44 44 45 24q-16 17-26-2Z" fill="#f8d35d"/><path d="m11 8-3-4M44 24l3-4"/>`,
 milk:`<path d="M15 10h20v6l5 6v21H10V22l5-6Z" fill="#fff9e8"/><path d="M15 10h20v6H15Z" fill="#83aec1"/><path d="M10 27h30v10H10Z" fill="#aed2d9"/>`,
 pencil:`<path d="m10 34 23-23 7 7-23 23-9 2Z" fill="#ffc75c"/><path d="m10 34-2 9 9-2" fill="#edaa8b"/>`,
 check:`<path d="M9 25 20 35 41 13" fill="none" stroke-width="7"/>`,
 trash:`<path d="M12 14h26m-22 0 2 28h14l2-28M19 14V9h12v5m-9 7v14m6-14v14" fill="none" stroke-width="3.5"/>`,
 star:`<path d="m25 5 6 13 14 2-10 10 3 14-13-7-13 7 3-14L5 20l14-2Z" fill="#ffcc62"/>`,
 clipboard:`<rect x="9" y="9" width="32" height="36" rx="4" fill="#fef3d3"/><path d="M18 12V6h14v6Z" fill="#e9ae6b"/><path d="M16 23h18m-18 9h18" stroke-width="2"/>`,
 flag:`<path d="M12 43V6m0 3q9-6 17 0t12 0v19q-8 6-14 0t-15 0" fill="#ef9865"/>`,
 ticket:`<path d="M10 7h30v36H10Z" fill="#fff9e8"/><path d="M16 15h18m-18 8h18m-18 8h10" stroke-width="2"/>`,
 clock:`<circle cx="25" cy="25" r="19" fill="#fff8e6"/><path d="M25 14v12l9 6" fill="none" stroke-width="4"/>`,
 coin:`<circle cx="25" cy="25" r="18" fill="#ffe39a"/><path d="M31 17q-13-4-14 7t14 8M14 22h14m-14 6h14" fill="none" stroke-width="3"/>`,
 plus:`<path d="M25 10v30M10 25h30" stroke-width="6"/>`,
 arrow:`<path d="M8 25h31m-11-12 12 12-12 12" fill="none" stroke-width="5"/>`,
 left:`<path d="m30 9-16 16 16 16" fill="none" stroke-width="6"/>`,
 right:`<path d="m20 9 16 16-16 16" fill="none" stroke-width="6"/>`,
 jar:`<path d="M13 15h24v28H13Z" fill="#f4ba7a"/><path d="M12 10h26v6H12Z" fill="#b97950"/><path d="M17 24h16v11H17Z" fill="#fff0d1"/>`,
 chef:`<path d="M13 30Q2 20 12 13q1-12 13-8 10-5 13 7 10 4-1 18Z" fill="#fff9e8"/><path d="M14 29v12h22V29M20 30v10m10-10v10" stroke-width="2" fill="#fff9e8"/>`,
};
function icon(name,cls=''){return `<svg class="art ${cls}" viewBox="0 0 50 50" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#533322" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${art[name]||art.star}</svg>`}
function groceryIcon(name){const t=name.toLowerCase();return t.includes('rice')?'rice':t.includes('egg')?'egg':t.includes('chicken')?'chicken':t.includes('sardine')?'fish':t.includes('tofu')?'veg':t.includes('oat')?'oats':t.includes('bread')?'bread':t.includes('banana')?'banana':t.includes('milk')?'milk':t.includes('vegetable')?'veg':t.includes('garlic')?'veg':t.includes('sauce')?'jar':'basket'}
const app=document.getElementById('app');const nav=document.getElementById('nav');let tab='today',monthCursor=null,modalSave=null;
// Market view controls stay on this device only; the grocery data still syncs to Supabase.
let marketFilter='todo',marketSearch='';
let cookbookFilter='all',cookbookSearch='';
// Community feed is read from its dedicated RLS-protected Supabase table, never kitchen_state.
let communityRecipes=[],communityLoading=false,communityError='',communityStatus='',communityLoadedFor=null,communityToken=0,communityBusy=false;
const validChefName = n => /^[\p{L}\p{N} _-]{2,24}$/u.test(n) && n.trim().length>=2;
// Custom, keyboard-friendly cabinet dialog. Does not submit hidden data or overwrite an account.
let kitchenDialogBusy=false;
function kitchenDialog({title, message, yes='Continue', no='Cancel', later=null, input=false, value=''}) {
  if(kitchenDialogBusy) return Promise.resolve(null);
  kitchenDialogBusy=true;
  const bg=document.getElementById('kitchenChoiceBg');
  const titleEl=document.getElementById('kitchenChoiceTitle');
  const messageEl=document.getElementById('kitchenChoiceText');
  const inputField=document.getElementById('kitchenChoiceInputField');
  const inputEl=document.getElementById('kitchenChoiceInput');
  const errorEl=document.getElementById('kitchenChoiceError');
  const yesBtn=document.getElementById('kitchenChoiceYes');
  const noBtn=document.getElementById('kitchenChoiceNo');
  const laterBtn=document.getElementById('kitchenChoiceLater');
  titleEl.textContent=title;messageEl.textContent=message;
  yesBtn.textContent=yes;noBtn.textContent=no;
  laterBtn.hidden=!later;if(later)laterBtn.textContent=later;
  inputField.hidden=!input;inputEl.value=input?value:'';errorEl.textContent='';
  bg.hidden=false;bg.classList.add('visible');
  const oldFocus=document.activeElement;
  const oldOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  return new Promise(resolve=>{
    function finish(result){
      bg.classList.remove('visible');bg.hidden=true;
      document.body.style.overflow=oldOverflow;
      yesBtn.removeEventListener('click',onYes);noBtn.removeEventListener('click',onNo);
      laterBtn.removeEventListener('click',onLater);bg.removeEventListener('keydown',onKey);
      bg.removeEventListener('click',onOutside);
      kitchenDialogBusy=false;oldFocus?.focus?.();resolve(result);
    }
    function onYes(){
      if(input){const n=inputEl.value.trim();if(!validChefName(n)){errorEl.textContent='Please use 2–24 characters: letters, numbers, spaces, hyphens, or underscores.';return}finish(n)}
      else finish('yes');
    }
    function onNo(){finish(input?null:'no')}
    function onLater(){finish(null)}
    function onOutside(e){if(e.target===bg && later)finish(null)}
    function onKey(e){
      if(e.key==='Escape' && later){e.preventDefault();finish(null)}
      if(e.key==='Enter' && input && e.target===inputEl){e.preventDefault();onYes()}
      if(e.key==='Tab'){
        const f=[input?inputEl:null,yesBtn,noBtn,later?laterBtn:null].filter(Boolean);
        const i=f.indexOf(document.activeElement);
        if(e.shiftKey && i<=0){e.preventDefault();f[f.length-1].focus()}
        else if(!e.shiftKey && i===f.length-1){e.preventDefault();f[0].focus()}
      }
    }
    yesBtn.addEventListener('click',onYes);noBtn.addEventListener('click',onNo);
    laterBtn.addEventListener('click',onLater);bg.addEventListener('keydown',onKey);
    bg.addEventListener('click',onOutside);
    (input?inputEl:yesBtn).focus();
  });
}


// Non-blocking cabinet-style feedback for actions like copying a shopping list.
let marketToastTimer=null;
function showMarketToast(message, success=true){
  let toast=document.getElementById('mealmateMarketToast');
  if(!toast){
    toast=document.createElement('div');
    toast.id='mealmateMarketToast';
    toast.className='market-copy-toast';
    toast.setAttribute('role','status');
    toast.setAttribute('aria-live','polite');
    toast.setAttribute('aria-atomic','true');
    document.body.appendChild(toast);
  }
  clearTimeout(marketToastTimer);
  toast.replaceChildren();
  const stamp=document.createElement('span');
  stamp.className='market-copy-toast-stamp';
  stamp.setAttribute('aria-hidden','true');
  stamp.textContent=success?'✓':'!';
  const label=document.createElement('span');
  label.textContent=message;
  toast.append(stamp,label);
  toast.classList.toggle('is-error',!success);
  toast.classList.add('visible');
  marketToastTimer=setTimeout(()=>{
    toast.classList.remove('visible');
  },3200);
}
async function copyMarketList(text){
  try{
    if(navigator.clipboard?.writeText && window.isSecureContext){
      await navigator.clipboard.writeText(text);
    }else{
      // Older browsers: use a temporary textarea without leaving the Market tab.
      const previousFocus=document.activeElement;
      const t=document.createElement('textarea');
      t.value=text;t.setAttribute('readonly','');
      t.style.cssText='position:fixed;top:0;left:-9999px;opacity:0';
      document.body.appendChild(t);t.select();
      let copied=false;
      try{copied=document.execCommand('copy');}finally{t.remove();previousFocus?.focus?.({preventScroll:true});}
      if(!copied)throw new Error('Clipboard copy was rejected');
    }
    showMarketToast('Shopping list copied! Ready to paste.');
  }catch(err){
    console.warn('Market list could not be copied:',err);
    showMarketToast('Could not copy. Please allow clipboard access and try again.',false);
  }
}

const MAX_CUSTOM_RECIPES=75;
const RECIPE_ICONS=['pot','egg','chicken','fish','veg','oats','bread','rice'];
const pad=x=>String(x).padStart(2,'0');function localDate(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}function parseDate(s){const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d,12)}function shift(s,n){const d=parseDate(s);d.setDate(d.getDate()+n);return localDate(d)}function monday(s){const d=parseDate(s);d.setDate(d.getDate()-(d.getDay()+6)%7);return localDate(d)}function human(s,opts){return parseDate(s).toLocaleDateString('en-PH',opts)}function dowIdx(s){return (parseDate(s).getDay()+6)%7}function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function uid(){return String(Date.now())+Math.random().toString(36).slice(2,7)}
const cloud = window.MealMateCloud || {enabled:false};
let activeUser=null, cloudLoading=false, cloudDirty=false, cloudWriting=false, cloudBlocked=false;
let cloudNotice='LOCAL RECIPE BOOK', cloudError=false, saveTimer=null, accountToken=0;
let cloudRevision=0, conflictOwner=null, resolvingConflict=false;
const defaultState=()=>({selected:localDate(new Date()),budget:1400,shopping:{},completed:{},mealOverrides:{},tasks:{},customRecipes:[]});
function normalizeState(src){const base=defaultState();if(!src||typeof src!=='object'||Array.isArray(src))return base;
const d={...base,...src};for(const k of ['shopping','completed','mealOverrides','tasks']){
 if(!d[k]||typeof d[k]!=='object'||Array.isArray(d[k]))d[k]={};
}
if(!Array.isArray(d.customRecipes))d.customRecipes=[];
d.customRecipes=d.customRecipes.filter(x=>x&&typeof x==='object'&&!Array.isArray(x)&&typeof x.id==='string'&&typeof x.name==='string'&&Array.isArray(x.steps)&&Array.isArray(x.ingredients)).slice(0,MAX_CUSTOM_RECIPES);
if(typeof d.chefAlias!=='string')d.chefAlias='';
if(typeof d.budget!=='number'||!Number.isFinite(d.budget)||d.budget<=0)d.budget=1400;
if(!/^\d{4}-\d{2}-\d{2}$/.test(d.selected))d.selected=base.selected;
return d}
function readLocal(key){try{return JSON.parse(localStorage.getItem(key))}catch{return null}}
let persistent=true;let state=defaultState();
try{state=normalizeState(readLocal('mealmate_v1'));localStorage.setItem('mealmate_test','1');localStorage.removeItem('mealmate_test')}catch(e){persistent=false}
if(!/^\d{4}-\d{2}-\d{2}$/.test(state.selected))state.selected=localDate(new Date());
function save(){
  try{
    const key=activeUser?'mealmate_cloud_cache_'+activeUser.id:'mealmate_v1';
    localStorage.setItem(key,JSON.stringify(state));persistent=true;
  }catch(e){persistent=false}
  if(activeUser && !cloudLoading)queueCloudSave();
}
function status(label,isError=false){cloudNotice=label;cloudError=isError;const el=document.getElementById('cloudStatus');if(el){el.textContent=label;el.classList.toggle('cloud-error',isError)}}
function queueCloudSave(){
  if(!activeUser||cloudLoading||cloudBlocked)return;
  cloudDirty=true;
  status('UNSAVED CLOUD CHANGES');
  clearTimeout(saveTimer);saveTimer=setTimeout(()=>flushCloud(),700);
}
// Store a separate recovery copy before offering any conflict resolution.
function backupConflict(owner){
  try{
    localStorage.setItem('mealmate_unsynced_backup_'+owner, JSON.stringify({
      savedAt: new Date().toISOString(), revisionAtEdit: cloudRevision,
      data: state
    }));
  }catch(err){console.warn('Could not create conflict recovery copy',err)}
}
async function resolveCloudConflict(owner){
  if(resolvingConflict || !activeUser || activeUser.id!==owner)return;
  resolvingConflict=true;
  try{
    backupConflict(owner);
    const choice=await kitchenDialog({
      title:'Two kitchen versions found!',
      message:'MealMate found newer changes from another device. To avoid losing either version, we saved your unsynced version as a recovery copy in this browser. Choose which version to use. "Keep mine" will replace the newer cloud copy; "Load cloud" will replace what you see here. You can download your recovery copy in My Kitchen.',
      yes:'Keep mine (replace cloud)',no:'Load cloud version',later:'Decide later'
    });
    if(activeUser?.id!==owner)return;
    if(choice===null){
      status('CLOUD CONFLICT — OPEN MY KITCHEN',true);return;
    }
    const remote=await cloud.read(owner);
    if(activeUser?.id!==owner)return;
    if(choice==='no'){
      // Never discard the recovery copy automatically.
      state=normalizeState(remote?.data);
      cloudRevision=Number(remote?.revision||0);
      cloudDirty=false;cloudBlocked=false;conflictOwner=null;
      try{localStorage.setItem('mealmate_cloud_cache_'+owner,JSON.stringify(state))}catch{}
      status('CLOUD VERSION LOADED — BACKUP SAVED');render();return;
    }
    const snapshot=JSON.parse(JSON.stringify(state));
    try{
      const nextRevision=await cloud.write(owner,snapshot,Number(remote?.revision||0));
      if(activeUser?.id!==owner)return;
      cloudRevision=nextRevision;
      cloudDirty=false;cloudBlocked=false;conflictOwner=null;
      status('YOUR VERSION SAVED — BACKUP KEPT');render();
    }catch(err){
      cloudDirty=true;cloudBlocked=true;conflictOwner=owner;
      status('CLOUD CONFLICT — OPEN MY KITCHEN',true);
      console.warn('Conflict retry failed; local copy kept',err);
    }
  }catch(err){
    if(activeUser?.id===owner){
      cloudBlocked=true;cloudDirty=true;conflictOwner=owner;
      status('COULD NOT RESOLVE — RETRY IN MY KITCHEN',true);
    }
    console.warn('Could not resolve cloud conflict',err);
  }finally{
    resolvingConflict=false;
  }
}
async function flushCloud(){
  if(!activeUser||cloudLoading||cloudBlocked||cloudWriting||!cloudDirty)return;
  cloudWriting=true;
  const owner=activeUser.id;
  let needsResolution=false;
  while(cloudDirty && activeUser?.id===owner){
    cloudDirty=false;
    const snapshot=JSON.parse(JSON.stringify(state));
    status('SAVING TO CLOUD…');
    try{
      const nextRevision=await cloud.write(owner,snapshot,cloudRevision);
      if(activeUser?.id!==owner)break;
      cloudRevision=nextRevision;
      if(!cloudDirty)status('CLOUD SAVED');
    }catch(err){
      if(activeUser?.id!==owner)break;
      cloudDirty=true;
      if(err?.code==='MEALMATE_CONFLICT'){
        backupConflict(owner);
        cloudBlocked=true;conflictOwner=owner;
        status('CLOUD CONFLICT — OPEN MY KITCHEN',true);
        needsResolution=true;
      }else{
        status('SYNC FAILED — TAP ACCOUNT',true);
      }
      console.warn('MealMate cloud save failed',err);break;
    }
  }
  cloudWriting=false;
  if(needsResolution)void resolveCloudConflict(owner);
}
async function changeAccount(user,force=false){
  const id=user?.id||null;
  if(force && id && conflictOwner===id){await resolveCloudConflict(id);return;}
  if(!force && id===(activeUser?.id||null) && (id!==null || cloudNotice==='LOCAL MODE'))return;
  const token=++accountToken;
  clearTimeout(saveTimer);
  cloudDirty=false;
  cloudRevision=0;conflictOwner=null;
  if(!user){
    communityToken++;communityRecipes=[];communityLoadedFor=null;communityError='';communityStatus='';
    activeUser=null;cloudLoading=false;cloudBlocked=false;
    state=normalizeState(readLocal('mealmate_v1'));
    status(cloud.enabled?'LOCAL MODE':'LOCAL — CLOUD NOT SET UP');
    render();return;
  }
  communityToken++;communityRecipes=[];communityLoadedFor=null;communityError='';communityStatus='';
  activeUser=user;cloudLoading=true;cloudBlocked=false;
  status('OPENING YOUR CLOUD KITCHEN…');render();
  try{
    const remote=await cloud.read(id);
    if(token!==accountToken)return;
    cloudRevision=Number(remote?.revision||0);
    if(remote?.data){state=normalizeState(remote.data);}
    else{
      // Never replace server data with local data without asking.
      const importChoice=await kitchenDialog({
        title:'How should we open your kitchen?',
        message:'This account does not have a saved kitchen yet. Bring in meals and groceries saved in this browser, or begin with a fresh kitchen. This choice will not delete the local copy.',
        yes:'Import my local kitchen',no:'Start fresh',later:'Not now'
      });
      if(token!==accountToken)return;
      if(importChoice===null){
        cloudLoading=false;cloudBlocked=true;
        status('KITCHEN SETUP PAUSED — TAP ACCOUNT',true);
        render();return;
      }
      state=importChoice==='yes'?normalizeState(readLocal('mealmate_v1')):defaultState();
      try{localStorage.setItem('mealmate_cloud_cache_'+id,JSON.stringify(state))}catch{}
      cloudRevision=await cloud.write(id,state,cloudRevision);
      if(token!==accountToken)return;
    }
    cloudLoading=false;cloudBlocked=false;
    try{localStorage.setItem('mealmate_cloud_cache_'+id,JSON.stringify(state))}catch{}
    status(remote?.data?'CLOUD LOADED':'CLOUD SAVED');
    closeAuth();render();
    if(tab==='recipes'&&cookbookFilter==='community')void refreshCommunity();
  }catch(err){
    if(token!==accountToken)return;
    if(err?.code==='MEALMATE_CONFLICT'){
      cloudLoading=false;cloudBlocked=true;cloudDirty=true;conflictOwner=id;
      backupConflict(id);
      status('CLOUD CONFLICT — OPEN MY KITCHEN',true);
      render();void resolveCloudConflict(id);return;
    }
    cloudLoading=false;cloudBlocked=true;
    state=normalizeState(readLocal('mealmate_cloud_cache_'+id));
    status('CLOUD LOAD FAILED — RETRY IN ACCOUNT',true);
    console.warn('Could not load cloud kitchen',err);
    render();
  }
}
function shoppingFor(w){if(!Array.isArray(state.shopping[w]))state.shopping[w]=[];return state.shopping[w]}
function marketMatches(g){return (marketFilter==='all'||(marketFilter==='todo'?!g.checked:g.checked))&&`${g.name} ${g.qty}`.toLocaleLowerCase().includes(marketSearch.toLocaleLowerCase())}
function groceryRow(g){return `<div class="grocery grocery-row"><div class="food-chip">${icon(groceryIcon(g.name))}</div><div class="entry ${g.checked?'done':''}"><strong>${esc(g.name)}</strong><small>${esc(g.qty)}</small></div><div class="price">₱${Number(g.price||0).toLocaleString('en-PH')}</div><button class="edit" data-action="groceryedit" data-id="${esc(g.id)}" aria-label="Edit ${esc(g.name)}">${icon('pencil')}</button><button class="grocery-delete" data-action="grocerydelete" data-id="${esc(g.id)}" aria-label="Remove ${esc(g.name)}" title="Remove item">${icon('trash','mini')}</button><button class="check ${g.checked?'checked':''}" data-action="grocerycheck" data-id="${esc(g.id)}" aria-label="${g.checked?'Mark as still to buy:':'Mark as bought:'} ${esc(g.name)}" aria-pressed="${g.checked}">${icon('check')}</button></div>`}
function completedFor(s){return state.completed[s]||(state.completed[s]={})}function taskFor(s){if(!Array.isArray(state.tasks[s]))state.tasks[s]=[];return state.tasks[s]}
function mealFor(s,i){return state.mealOverrides[s]?.[i]??mealPlan[dowIdx(s)][i]}function mealDone(s,i){return !!state.completed[s]?.['meal'+i]}function markMeal(s,i){const a=completedFor(s);a['meal'+i]=!a['meal'+i];save();render()}
function datestrip(){const start=monday(state.selected);return '<div class="dates">'+Array.from({length:7},(_,i)=>{const date=shift(start,i),active=date===state.selected,now=date===localDate(new Date());return `<button class="datebtn ${active?'active':''} ${now?'today':''}" data-action="date" data-date="${date}" aria-label="${human(date,{dateStyle:'full'})}" aria-pressed="${active}"><span class="dow">${human(date,{weekday:'short'})}</span><b>${parseDate(date).getDate()}</b><span class="dot"></span></button>`}).join('')+'</div>'}
function budgetCard(){const w=monday(state.selected);const items=shoppingFor(w);const total=items.reduce((a,x)=>a+Number(x.price||0),0),spent=items.filter(x=>x.checked).reduce((a,x)=>a+Number(x.price||0),0),left=state.budget-total;return `<div class="card budget"><div class="budget-top"><span class="tiny">${icon('coin','mini')} THE GROCERY JAR</span><span class="pill mini-pill">₱200 / DAY</span></div><div class="row budget-figures"><div><span class="tiny">WEEKLY CART</span><div class="amount">₱${total.toLocaleString('en-PH')}</div></div><div class="budget-right"><span class="tiny">${left>=0?'LEFT IN THE JAR':'OVER THE LIMIT'}</span><div class="budget-left ${left<0?'warn':''}">${left<0?'-':''}₱${Math.abs(left).toLocaleString('en-PH')}</div></div></div><div class="progress"><span style="width:${Math.max(0,Math.min(100,total/state.budget*100))}%"></span></div><div class="row budget-bottom"><span class="tiny">${items.filter(x=>x.checked).length}/${items.length} packed · ₱${spent.toLocaleString('en-PH')} in cart</span><button class="btn small ghost" data-action="budget">${icon('pencil','mini')} Budget</button></div></div>`}
function mealRows(s){return `<div class="ticket-stack">${['Breakfast','Lunch','Dinner'].map((label,i)=>`<div class="meal order-ticket meal-${i}"><div class="ticket-illustration">${icon(['egg','cloche','pot'][i])}<span class="ticket-slot">0${i+1}</span></div><div class="entry ${mealDone(s,i)?'done':''}"><small>${label.toUpperCase()} ORDER</small><strong>${esc(mealFor(s,i))}</strong></div><button class="edit" data-action="mealedit" data-index="${i}" aria-label="Edit ${label}">${icon('pencil')}</button><button class="check ${mealDone(s,i)?'checked':''}" data-action="mealcheck" data-index="${i}" aria-label="Mark ${label} complete" aria-pressed="${mealDone(s,i)}">${icon('check')}</button></div>`).join('')}</div>`}
function todayView(){const s=state.selected;const tasks=taskFor(s);const done=[0,1,2].filter(i=>mealDone(s,i)).length;return `<section class="hero"><div class="hero-text"><p class="eyebrow">✦ YOUR LITTLE FOOD STATION ✦</p><h1>${s===localDate(new Date())?'Today’s orders':'Daily orders'}</h1><p class="hero-date">${human(s,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p><span class="counter-stamp">${icon('star','mini')} ${done} OF 3 MEALS SERVED</span></div><div class="hero-plate">${icon('plate')}<span class="hero-spark">✳︎</span></div></section><div class="week-label">${icon('calendar','mini')} PICK A DAY</div>${datestrip()}<div class="space">${budgetCard()}</div><div class="section-top"><div><span class="section-kicker">STATION 01</span><h2>Order tickets</h2><p class="sub">Three meals, one happy kitchen.</p></div><span class="section-deco">${icon('ticket')}</span></div>${mealRows(s)}<div class="section-top"><div><span class="section-kicker">STATION 02</span><h2>Little chores</h2><p class="sub">Your kitchen's to-do board.</p></div><button class="btn small accent" data-action="taskadd">${icon('plus','mini')} Add chore</button></div><div class="card chore-board"><span class="board-clip">${icon('clipboard','mini')} DAILY CHECKLIST</span>${tasks.length?tasks.map(t=>`<div class="task"><button class="check ${t.done?'checked':''}" data-action="taskcheck" data-id="${esc(t.id)}" aria-label="Mark task complete" aria-pressed="${t.done}">${icon('check')}</button><div class="entry ${t.done?'done':''}"><strong>${esc(t.text)}</strong></div><button class="edit" data-action="taskedit" data-id="${esc(t.id)}" aria-label="Edit ${esc(t.text)}" title="Edit chore">${icon('pencil')}</button><button class="chore-delete" data-action="taskdelete" data-id="${esc(t.id)}" aria-label="Delete ${esc(t.text)}" title="Delete chore">${icon('trash','mini')}</button></div>`).join(''):'<div class="chore-empty"><div class="chore-empty-heading">A fresh to-do board!</div><p>Add a little kitchen task to get started. Some ideas:</p><div class="chore-samples" aria-label="Examples, not actual tasks"><span>✳︎ Wash the rice cooker</span><span>✳︎ Prep tomorrow’s lunch</span><span>✳︎ Check grocery supplies</span></div><small>These are examples only — nothing has been added to your checklist.</small></div>'}</div><div class="actionline"><button class="btn primary" data-action="go" data-tab="groceries">${icon('basket','mini')} Hit the market ${icon('arrow','mini')}</button><button class="btn" data-action="go" data-tab="recipes">${icon('book','mini')} Open cookbook</button></div>${!persistent?'<p class="note warn">Your browser is blocking local storage. For reliable saving, publish on GitHub Pages and open the hosted address.</p>':''}`}
function calendarView(){const s=state.selected;const m=monthCursor||s.slice(0,7);const first=parseDate(m+'-01');const n=new Date(first.getFullYear(),first.getMonth()+1,0).getDate();const off=(first.getDay()+6)%7;let boxes='';for(let i=0;i<Math.ceil((off+n)/7)*7;i++){const val=i-off+1;if(val<1||val>n){boxes+='<div></div>';continue}const d=m+'-'+pad(val);const comp=[0,1,2].filter(i=>mealDone(d,i)).length;boxes+=`<button class="cal-day ${d===s?'active':''} ${d===localDate(new Date())?'now':''}" data-action="date" data-date="${d}" data-goto="calendar">${val}${comp?`<span class="completed">${comp}/3</span>`:''}</button>`}return `<section class="page-banner banner-calendar"><div><p class="eyebrow">THE MEAL PLANNER</p><h1>Kitchen calendar</h1><p>Every day deserves a tasty plan!</p></div>${icon('calendar','banner-art')}</section><div class="card calendar-board space"><div class="calendar-head"><button class="btn small pager" data-action="month" data-delta="-1" aria-label="Previous month">${icon('left')}</button><h2>${first.toLocaleDateString('en-PH',{month:'long',year:'numeric'})}</h2><button class="btn small pager" data-action="month" data-delta="1" aria-label="Next month">${icon('right')}</button></div><div class="cal-week">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>`<span>${x}</span>`).join('')}</div><div class="cal-grid">${boxes}</div><div class="actionline"><button class="btn small ghost" data-action="jumpnow">${icon('flag','mini')} Jump to today</button></div></div><div class="section-top"><div><span class="section-kicker">ON THE MENU</span><h2>${human(s,{weekday:'long',month:'short',day:'numeric'})}</h2><p class="sub">Your order tickets for the day</p></div><button class="btn small" data-action="go" data-tab="today">${icon('arrow','mini')} Open day</button></div>${mealRows(s)}`}
function groceriesView(){
 const w=monday(state.selected),end=shift(w,6),items=shoppingFor(w);
 const total=items.reduce((s,x)=>s+Number(x.price||0),0),purchased=items.filter(x=>x.checked).reduce((s,x)=>s+Number(x.price||0),0);
 const pending=items.filter(x=>!x.checked).length,bought=items.length-pending;
 const shown=items.filter(marketMatches);
 const tabs=[['todo','To Buy',pending],['bought','Bought',bought],['all','All',items.length]];
 const msg=marketSearch.trim()?'No matching ingredients. Try a different search.':marketFilter==='bought'?'No items bought yet. Stamp an item from To Buy when it’s in your basket!':marketFilter==='todo'&&items.length?'All done shopping! Your basket is packed.':'Your basket is empty. Add one item, or open a recipe and send its ingredients here.';
 return `<section class="page-banner banner-market"><div><p class="eyebrow">THE SHOPPING STATION</p><h1>Market run!</h1><p>One ingredient at a time, Chef.</p></div>${icon('basket','banner-art')}</section>
 <div class="card market-summary space"><div class="shopping-header"><div><span class="tiny">WEEKLY SHOPPING TRIP</span><h3>${human(w,{month:'short',day:'numeric'})} – ${human(end,{month:'short',day:'numeric'})}</h3></div><div class="week-nav"><button class="btn small pager" data-action="week" data-delta="-7" aria-label="Previous week">${icon('left')}</button><button class="btn small pager" data-action="week" data-delta="7" aria-label="Next week">${icon('right')}</button></div></div><div class="summary-grid"><div class="stat"><span class="tiny">PLANNED SPEND</span><b>₱${total.toLocaleString('en-PH')}</b></div><div class="stat"><span class="tiny">ALREADY BOUGHT</span><b class="good">₱${purchased.toLocaleString('en-PH')}</b></div></div><div class="progress"><span style="width:${items.length?bought/items.length*100:0}%"></span></div><div class="row"><span class="tiny">${bought}/${items.length} collected</span><span class="tiny ${total>state.budget?'warn':'good'}">${total>state.budget?'₱'+(total-state.budget).toLocaleString('en-PH')+' over budget':'₱'+(state.budget-total).toLocaleString('en-PH')+' left in budget'}</span></div></div>
 <div class="section-top market-heading"><div><span class="section-kicker">YOUR MARKET BAG</span><h2>Shopping tickets</h2><p class="sub">Just the groceries you need right now.</p></div><button class="btn small accent" data-action="groceryadd">${icon('plus','mini')} Add item</button></div>
 <div class="market-board"><div class="market-filters" role="group" aria-label="Filter shopping tickets">${tabs.map(([filter,label,count])=>`<button class="market-filter ${marketFilter===filter?'active':''}" data-action="marketfilter" data-filter="${filter}" aria-pressed="${marketFilter===filter}">${label} <span class="filter-count">${count}</span></button>`).join('')}</div>
 ${items.length?`<label class="market-search-label" for="marketSearch">${icon('basket','mini')} Find an ingredient</label><input id="marketSearch" class="market-search" type="search" placeholder="Search your tickets…" maxlength="80" value="${esc(marketSearch)}" autocomplete="off" />`:''}
 <div class="card receipt-list"><div class="receipt-top"><span>${icon('ticket','mini')} MEALMATE • MARKET SLIP</span><span>${marketFilter==='todo'?'TO BUY':marketFilter==='bought'?'BOUGHT':'ALL ITEMS'}</span></div>
 <div id="marketRows">${shown.map(groceryRow).join('')}</div>
 <div id="marketEmpty" class="market-empty ${shown.length?'is-hidden':''}"><div class="empty-basket-art">${icon(shown.length?'star':'basket')}</div><strong>${items.length?'Your market is looking good!':'A fresh market bag!'}</strong><p id="marketEmptyMessage">${esc(msg)}</p>${items.length===0?`<button class="btn primary" data-action="go" data-tab="recipes">${icon('book','mini')} Choose a recipe</button>`:''}</div>
 <div class="receipt-end">✳︎ A LITTLE SHOPPING GOES A LONG WAY ✳︎</div></div></div>
 <div class="market-bottom-actions"><button class="btn" data-action="copy">${icon('clipboard','mini')} Copy full list</button><button class="btn ghost" data-action="budget">${icon('coin','mini')} Weekly budget</button>${bought?`<button class="btn market-clear" data-action="clearbought">Clear bought (${bought})</button>`:''}</div>
 <details class="market-manage"><summary>Manage this week’s list</summary><p>Your saved items stay safe until you remove them. Use the Cookbook to add recipe ingredients to the Market.</p><div class="market-manage-actions"><button class="btn small" data-action="uncheck" ${bought?'':'disabled'}>Mark all as To Buy</button><button class="btn small market-danger" data-action="clearweek" ${items.length?'':'disabled'}>Empty this week’s basket</button></div></details>
 <p class="note market-note">The ₱ amounts are estimates, not live prices. New weeks start empty; your existing saved groceries are kept unless you remove them.</p>`;
}
// Private recipes remain in kitchen_state.data; public copies are stored separately.
function recipeForId(id){return state.customRecipes.find(r=>r.id===id)}
function allCookbookRecipes(){return [
 ...state.customRecipes.map(r=>({...r,personal:true,ingredients:Array.isArray(r.ingredients)?r.ingredients:[],steps:Array.isArray(r.steps)?r.steps:[]})),
 ...recipes.map((r,i)=>({...r,id:'starter-'+i,personal:false,ingredients:r.ingredients.split(',').map(v=>v.trim()),steps:r.steps}))
]}
function matchesCookbook(r){const section=cookbookFilter==='all'||(cookbookFilter==='mine'?r.personal:!r.personal);const q=cookbookSearch.toLocaleLowerCase().trim();return section&&(!q||`${r.name} ${r.ingredients.join(' ')} ${r.time}`.toLocaleLowerCase().includes(q))}
function recipeCard(r,i){
 const details=r.ingredients.filter(Boolean).map(x=>esc(x)).join(' · ');
 return `<article class="card recipe ${r.personal?'recipe-personal':''}">
 <div class="recipe-head"><div class="recipe-emoji color-${i%4}">${icon(RECIPE_ICONS.includes(r.icon)?r.icon:'pot')}</div><div class="recipe-titles"><span class="tiny">${r.personal?'✦ YOUR RECIPE':'✳︎ STARTER CARD'} · ${esc(r.time||'Time varies')}</span><h3>${esc(r.name)}</h3></div></div>
 <div class="recipe-marker">${r.personal?(r.attributedTo?'SAVED FROM '+esc(r.attributedTo):'MY KITCHEN ORIGINAL'):'A LITTLE INSPIRATION'}</div>
 <p class="recipe-ingredients">${details||'No ingredients listed yet.'}</p>
 <details class="recipe-flip"><summary>${icon('book','mini')} Flip for cooking steps ${icon('arrow','mini')}</summary><ol>${r.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details>
 <div class="recipe-commands">
 <button class="btn small recipe-to-market" data-action="recipemarket" data-id="${esc(r.id)}">${icon('basket','mini')} Add to Market</button>
 ${r.personal?`<button class="btn small ghost" data-action="recipeedit" data-id="${esc(r.id)}">${icon('pencil','mini')} Edit</button>${r.sourceCommunityId?`<span class="recipe-origin-notice" title="Saved community recipes cannot be republished in this beta. Create your own original recipe to share.">Private copy · sharing disabled</span>`:`<button class="btn small recipe-publish" data-action="recipepublish" data-id="${esc(r.id)}">${icon('flag','mini')} ${communityRecipes.some(p=>p.author_id===activeUser?.id&&p.source_recipe_id===r.id)?'Update shared':'Share recipe'}</button>`}<button class="recipe-delete" data-action="recipedelete" data-id="${esc(r.id)}" aria-label="Delete ${esc(r.name)}" title="Delete recipe">×</button>`:`<button class="btn small ghost" data-action="recipeclone" data-id="${esc(r.id)}">${icon('plus','mini')} Save my copy</button>`}
 </div>
 </article>`
}
function communityCard(r,i){
 const mine=r.author_id===activeUser?.id, saved=state.customRecipes.some(x=>x.sourceCommunityId===r.id);
 return `<article class="card recipe community-recipe">
 <div class="recipe-head"><div class="recipe-emoji color-${i%4}">${icon(RECIPE_ICONS.includes(r.icon)?r.icon:'pot')}</div><div class="recipe-titles"><span class="tiny">✦ COMMUNITY POST · ${esc(r.time_label||'Time varies')}</span><h3>${esc(r.name)}</h3></div></div>
 <div class="recipe-marker">SHARED BY ${esc(r.author_name)}</div>
 <p class="recipe-ingredients">${r.ingredients.map(esc).join(' · ')}</p>
 <details class="recipe-flip"><summary>${icon('book','mini')} Flip for cooking steps ${icon('arrow','mini')}</summary><ol>${r.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details>
 <div class="recipe-commands">
 <button class="btn small recipe-to-market" data-action="recipemarket" data-id="${esc(r.id)}">${icon('basket','mini')} Add to Market</button>
 <button class="btn small ${saved?'ghost':'accent'}" data-action="communitycopy" data-id="${esc(r.id)}" ${saved?'disabled':''}>${icon(saved?'check':'plus','mini')} ${saved?'In my Cookbook':'Save my copy'}</button>
 ${mine?`<button class="btn small market-danger" data-action="communityremove" data-id="${esc(r.id)}">Unshare</button>`:`<button class="community-report" data-action="communityreport" data-id="${esc(r.id)}" aria-label="Report recipe ${esc(r.name)}">Report</button>`}
 </div></article>`
}
function cookbookCards(){
 if(cookbookFilter==='community'){
  if(!activeUser)return `<div class="card cookbook-empty"><div class="cookbook-empty-art">${icon('chef')}</div><h3>Community kitchen is for signed-in cooks!</h3><p>Sign in to discover recipes shared by other MealMate chefs. Your private recipes remain yours.</p><button class="btn primary" data-action="account">Open Kitchen Key</button></div>`;
  if(communityLoading)return `<div class="card cookbook-empty"><h3>Looking through the recipe shelves…</h3><p>Fetching the latest community cards.</p></div>`;
  if(communityError)return `<div class="card cookbook-empty"><h3>We couldn't open the community shelf.</h3><p>${esc(communityError)}</p><button class="btn primary" data-action="communityrefresh">Retry</button></div>`;
  const q=cookbookSearch.toLocaleLowerCase().trim();const visible=communityRecipes.filter(r=>!q||`${r.name} ${r.author_name} ${r.ingredients.join(' ')} ${r.time_label}`.toLocaleLowerCase().includes(q));
  return visible.length?visible.map(communityCard).join(''):`<div class="card cookbook-empty"><div class="cookbook-empty-art">${icon('book')}</div><h3>${q?'No dishes match that search.':'Your community shelf is waiting!'}</h3><p>${q?'Try another dish, chef name, or ingredient.':'Be the first to share a home-cooked recipe from your personal Cookbook.'}</p><button class="btn" data-action="communityrefresh">${icon('arrow','mini')} Refresh community</button></div>`;
 }
 const filtered=allCookbookRecipes().filter(matchesCookbook);
 return filtered.length?filtered.map(recipeCard).join(''):`<div class="card cookbook-empty"><div class="cookbook-empty-art">${icon('book')}</div><h3>${cookbookSearch.trim()?'No matching recipes!':cookbookFilter==='mine'?'Your first recipe awaits!':'No recipe cards here yet.'}</h3><p>${cookbookSearch.trim()?'Try searching for another ingredient or dish.':cookbookFilter==='mine'?'Every great cook starts with a single dish. Write your first recipe, or save a starter recipe as your own.':'Choose another cookbook shelf to explore.'}</p>${cookbookFilter==='mine'&&!cookbookSearch.trim()?`<button class="btn primary" data-action="recipeadd">${icon('plus','mini')} Write my first recipe</button>`:''}</div>`;
}
function recipesView(){
 const mine=state.customRecipes.length, builtins=recipes.length;
 const groups=[['all','All',mine+builtins],['mine','My recipes',mine],['starter','Starter cards',builtins],['community','Community',communityRecipes.length]];
 return `<section class="page-banner banner-recipes"><div><p class="eyebrow">THE RECIPE STATION</p><h1>Cookbook club!</h1><p>Your very own collection of kitchen treasures.</p></div>${icon('book','banner-art')}</section>
 <div class="cookbook-welcome space"><div class="cookbook-welcome-symbol">${icon('chef')}</div><div><span class="section-kicker">YOUR OWN RECIPE SHELF</span><h2>A story behind every dish!</h2><p>Create personal recipes, and choose when to share a copy with other cooks.</p></div><button class="btn primary cookbook-add" data-action="recipeadd">${icon('plus','mini')} New recipe</button></div>
 <div class="cookbook-tools"><div class="cookbook-tabs" role="group" aria-label="Choose cookbook shelf">${groups.map(([id,name,num])=>`<button class="cookbook-tab ${cookbookFilter===id?'active':''}" data-action="recipefilter" data-filter="${id}" aria-pressed="${cookbookFilter===id}">${name} <span>${num}</span></button>`).join('')}</div><label class="cookbook-search-label" for="cookbookSearch">Find a dish or ingredient<input class="cookbook-search" id="cookbookSearch" type="search" placeholder="Try chicken, oats, tofu…" maxlength="80" value="${esc(cookbookSearch)}" autocomplete="off"></label></div>
 <div class="hint cookbook-hint">${icon('flag','mini')} ${cookbookFilter==='community'?'Community dishes are user-submitted and not safety-reviewed. Check ingredients and cooking instructions carefully.':'Your personal recipes stay private unless you choose Share recipe. Rice cooker instructions and poultry food safety still apply.'}</div>
 ${cookbookFilter==='community'?`<div class="community-toolbar"><span>${activeUser?'SIGNED-IN COMMUNITY · LAST 60 POSTS':'SIGN IN TO SEE COMMUNITY POSTS'}</span><button class="btn small" data-action="communityrefresh">${icon('arrow','mini')} Refresh board</button></div>`:''}
 ${communityStatus?`<p class="community-notice" role="status">${esc(communityStatus)}</p>`:''}
 <div class="recipes-grid" id="cookbookCards">${cookbookCards()}</div>
 <p class="note cookbook-note">✳︎ Sharing posts a public copy to signed-in MealMate cooks. Personal recipes are not altered; saved copies can be edited independently. ✳︎</p>`;
}
function splitLines(text,maxCount,maxLen){return String(text||'').split(/\r?\n/).map(v=>v.trim()).filter(Boolean).slice(0,maxCount).map(v=>v.slice(0,maxLen))}
function writeRecipeFromForm(fd,id=null){
 const name=String(fd.get('name')||'').trim().slice(0,90);
 const time=String(fd.get('time')||'').trim().slice(0,60);
 const iconName=String(fd.get('icon')||'pot');
 const ingredients=splitLines(fd.get('ingredients'),35,120);
 const steps=splitLines(fd.get('steps'),20,450);
 if(!name||!ingredients.length||!steps.length){showRecipeError('Add a name, at least one ingredient, and at least one cooking step.');return false}
 if(!id&&state.customRecipes.length>=MAX_CUSTOM_RECIPES){showRecipeError('Your recipe shelf is full. Remove a recipe before adding another.');return false}
 if(id){const orig=recipeForId(id);if(!orig){showRecipeError('Recipe not found; please try again.');return false}Object.assign(orig,{name,time:time||'Time varies',icon:RECIPE_ICONS.includes(iconName)?iconName:'pot',ingredients,steps,editedAt:new Date().toISOString()});}
 else state.customRecipes.unshift({id:uid(),name,time:time||'Time varies',icon:RECIPE_ICONS.includes(iconName)?iconName:'pot',ingredients,steps,createdAt:new Date().toISOString()});
 cookbookFilter='mine';cookbookSearch='';save();render();return true;
}
function showRecipeError(msg){document.getElementById('recipeFormError').textContent=msg}
function openRecipeEditor(r=null){
 const panel=document.getElementById('recipeBg');
 document.getElementById('recipeForm').reset();
 document.getElementById('recipeEditId').value=r?.id||'';
 document.getElementById('recipeDialogTitle').textContent=r?'Polish your recipe!':'A fresh recipe ticket!';
 document.getElementById('recipeName').value=r?.name||'';
 document.getElementById('recipeTime').value=r?.time||'';
 document.getElementById('recipeIcon').value=RECIPE_ICONS.includes(r?.icon)?r.icon:'pot';
 document.getElementById('recipeIngredients').value=r?.ingredients?.join('\n')||'';
 document.getElementById('recipeSteps').value=r?.steps?.join('\n')||'';
 showRecipeError('');panel.classList.add('visible');document.body.style.overflow='hidden';
 document.getElementById('recipeName').focus();
}
function closeRecipeEditor(){document.getElementById('recipeBg').classList.remove('visible');document.body.style.overflow=''}
function starterToPersonal(id){const r=allCookbookRecipes().find(v=>v.id===id&&!v.personal);if(!r)return;
 if(state.customRecipes.length>=MAX_CUSTOM_RECIPES){alert('Your personal cookbook is full.');return}
 openRecipeEditor({...r,id:'',name:r.name,ingredients:r.ingredients,steps:r.steps});
}
async function addRecipeIngredientsToMarket(id){
 const r=allCookbookRecipes().find(v=>v.id===id)||communityRecipes.find(v=>v.id===id);if(!r)return;
 const w=monday(state.selected),list=shoppingFor(w);
 const ingredients=r.ingredients.map(x=>String(x||'').trim()).filter(Boolean).slice(0,35);
 const seenIngredients=new Set(list.map(g=>g.name.trim().toLocaleLowerCase()));
 const toAdd=ingredients.filter(x=>{const key=x.toLocaleLowerCase();if(seenIngredients.has(key))return false;seenIngredients.add(key);return true;});
 if(!toAdd.length){
   void kitchenDialog({title:'Already in your basket!',message:`All ingredients from “${r.name}” are already on this week’s list.`,yes:'Open Market',no:'Stay here'}).then(choice=>{if(choice==='yes'){tab='groceries';render()}});
   return;
 }
 const ownerAtOpen=activeUser?.id||null;
 const choice=await kitchenDialog({
   title:'Send ingredients to Market?',
   message:`Add ${toAdd.length} ingredient${toAdd.length===1?'':'s'} from “${r.name}” to this week's basket? Their estimated prices start at ₱0 and can be edited anytime.`,
   yes:`Add ${toAdd.length} ingredient${toAdd.length===1?'':'s'}`,
   no:'Keep browsing'
 });
 if(choice!=='yes'||cloudBlocked||(activeUser?.id||null)!==ownerAtOpen)return;
 // Recheck on confirmation, in case the shopping list changed while the dialog was open.
 const current=shoppingFor(w);
 toAdd.filter(name=>!current.some(g=>g.name.toLowerCase()===name.toLowerCase()))
   .forEach(name=>current.push({id:uid(),name,qty:'1',price:0,checked:false}));
 marketFilter='todo';marketSearch='';tab='groceries';save();render();
}
// Community is account-only. Published content is a snapshot, never a read of private kitchen_state.
async function refreshCommunity(){
 if(!activeUser){communityRecipes=[];communityError='';communityLoading=false;render();return}
 const userId=activeUser.id,token=++communityToken;
 communityLoading=true;communityError='';render();
 try{
  const rows=await cloud.listCommunity();
  if(token!==communityToken||activeUser?.id!==userId)return;
  communityRecipes=rows;communityLoadedFor=userId;communityError='';
 }catch(err){
  if(token!==communityToken)return;
  console.warn('Community Cookbook fetch failed',err);
  communityError='Check that community_schema.sql was run in Supabase. '+(err?.message||'Please try again.');
 }finally{if(token===communityToken){communityLoading=false;render()}}
}
function communityFind(id){return communityRecipes.find(x=>x.id===id)}
async function sharePersonalRecipe(id){
 if(!activeUser){openAuth();return}
 if(communityBusy)return;
 const recipe=recipeForId(id);if(!recipe)return;
 if(recipe.sourceCommunityId){communityStatus='This recipe came from another chef. You can keep and edit your private copy, but cannot republish it in this beta.';render();return}
 let name=(state.chefAlias||'').trim();
 if(!validChefName(name)){
   const entered=await kitchenDialog({title:'Choose your public chef name',message:'Your chef name appears beside shared dishes, not your email. You can change it later in My Kitchen.',yes:'Use this chef name',no:'Not now',later:'Cancel',input:true,value:name});
   if(entered===null)return;
   name=entered;
 }
 const choice=await kitchenDialog({title:'Publish your recipe?',message:`“${recipe.name}” will appear in the Community Cookbook as ${name}. Other cooks can save their own copies. Your original remains private.`,yes:'Share this recipe',no:'Keep private'});
 if(choice!=='yes')return;
 communityBusy=true;communityStatus='Publishing your recipe…';render();
 try{
  const now=new Date().toISOString();
  await cloud.publishCommunity({
   author_id:activeUser.id,source_recipe_id:id,author_name:name,
   name:recipe.name,time_label:recipe.time||'Time varies',icon:recipe.icon||'pot',
   ingredients:recipe.ingredients,steps:recipe.steps,updated_at:now
  });
  state.chefAlias=name;save();
  communityStatus='UMAI!!! Your recipe has been shared!';
  await refreshCommunity();
 }catch(err){console.warn('Share failed',err);communityStatus='Could not share recipe: '+(err.message||'Please try again.');render()}
 finally{communityBusy=false}
}
function copyCommunityToMine(id){
 const publicRecipe=communityFind(id);if(!publicRecipe)return;
 if(state.customRecipes.some(r=>r.sourceCommunityId===id)){alert('You already have a personal copy of this recipe.');return}
 if(state.customRecipes.length>=MAX_CUSTOM_RECIPES){alert('Your personal recipe shelf is full.');return}
 state.customRecipes.unshift({id:uid(),name:publicRecipe.name,time:publicRecipe.time_label,icon:publicRecipe.icon,
  ingredients:[...publicRecipe.ingredients],steps:[...publicRecipe.steps],createdAt:new Date().toISOString(),
  sourceCommunityId:id,attributedTo:publicRecipe.author_name});
 cookbookFilter='mine';cookbookSearch='';communityStatus='Saved a personal copy! You can edit yours without changing the original.';
 save();render();
}
async function unshareCommunity(id){
 if(!activeUser)return;
 const r=communityFind(id);if(!r||r.author_id!==activeUser.id)return;
 if(!confirm(`Remove “${r.name}” from the Community Cookbook? Your personal copy will stay safe.`))return;
 try{await cloud.removeCommunity(id,activeUser.id);communityStatus='Recipe removed from community. Your personal copy is safe.';await refreshCommunity()}
 catch(err){alert('Could not unshare: '+(err.message||'Please try again.'))}
}
async function reportCommunity(id){
 if(!activeUser){openAuth();return}
 const r=communityFind(id);if(!r)return;
 const chosen=prompt('Report this recipe? Enter a number:\n1 — Unsafe instructions\n2 — Spam/advertising\n3 — Inappropriate content\n4 — Other\nCancel — Never mind');
 if(chosen===null)return;
 const reason={1:'unsafe',2:'spam',3:'inappropriate',4:'other'}[chosen.trim()];
 if(!reason){alert('Choose a number from 1 to 4.');return}
 try{await cloud.reportCommunity(id,activeUser.id,reason);communityStatus='Report submitted. Thank you for helping keep our kitchen welcoming!';render()}
 catch(err){alert('Could not send report. If you already reported this dish, it has been recorded. '+(err.message||''))}
}
function render(){if(!['today','calendar','groceries','recipes'].includes(tab))tab='today';
if(cloudLoading){nav.innerHTML='';app.innerHTML=`<div class="loading-ticket">${icon('chef')}<h2>Opening your kitchen…</h2><p>Loading your saved meals and grocery tickets.</p></div>`;return;}
const curr={today:'plate',calendar:'calendar',groceries:'basket',recipes:'book'};nav.innerHTML=Object.entries(curr).map(([key,ico],i)=>`<button data-action="go" data-tab="${key}" class="station station-${i} ${tab===key?'active':''}" aria-current="${tab===key?'page':'false'}"><span class="station-badge">${icon(ico)}</span><span class="station-label">${{today:'COUNTER',calendar:'PLANNER',groceries:'MARKET',recipes:'COOKBOOK'}[key]}</span></button>`).join('');app.innerHTML=`<header class="topline"><div class="brand"><div class="logo" aria-hidden="true">${icon('chef')}</div><div><span class="brand-supra">THE LITTLE KITCHEN</span><b>MealMate<span class="brand-star">!</span></b><small>YOUR DAILY FOOD ADVENTURE</small></div></div><button type="button" class="tour-help-btn top-help" data-tour-replay aria-label="Replay the chef tutorial" title="Kitchen tutorial">?</button><div class="account-box"><button type="button" class="account-btn" data-action="account" aria-label="${activeUser?'Account and cloud sync':'Set up account'}">${icon('jar','mini')}<span>${activeUser?'MY KITCHEN':cloud.enabled?'SIGN IN':'CLOUD SETUP'}</span></button><span id="cloudStatus" class="cloud-status ${cloudError?'cloud-error':''}">${esc(cloudNotice)}</span></div></header>`+({today:todayView,calendar:calendarView,groceries:groceriesView,recipes:recipesView}[tab]())+`<p class="footer">✳︎ THANKS FOR STOPPING BY! ✳︎<br>Meals made a little more fun. ${activeUser?'Cloud kitchen connected.':'Saved on this device until you connect your cloud kitchen.'}</p>`}

// Small account drawer is separate from the existing meal/grocery edit modal.
const authBg=document.getElementById('authBg');
const authForm=document.getElementById('authForm');
let signupMode=false;
function setAuthMessage(msg,err=false){const el=document.getElementById('authMessage');el.textContent=msg;el.classList.toggle('cloud-error',err)}
function paintAuth(){
  const configured=cloud.enabled;
  document.getElementById('authForm').hidden=!configured||!!activeUser;
  document.getElementById('authSignedIn').hidden=!activeUser;
  document.getElementById('authSwitch').hidden=!configured||!!activeUser;
  document.getElementById('accountEmail').textContent=activeUser?.email||'';
  document.getElementById('authTitle').textContent=activeUser?'Your kitchen account':configured?(signupMode?'Create your kitchen account':'Open your cloud kitchen'):'Cloud setup needed';
  document.getElementById('authExplainer').textContent=activeUser?cloudBlocked?(conflictOwner?'Another device saved a newer kitchen. Editing is paused until you choose which version to keep.':'Cloud could not load. Editing is paused to protect your existing data. Tap Retry connection.'):'Your kitchen saves to Supabase. Use Sync now if you see an unsaved warning.':configured?'Sign in to keep your kitchen in sync across devices.':'Add your project URL and publishable key in config.js, then run schema.sql in Supabase.';
  document.getElementById('authSubmit').textContent=signupMode?'Create account':'Sign in';
  document.getElementById('syncNow').textContent=conflictOwner?'Resolve sync conflict':cloudBlocked?'Retry connection':'Sync now';
  const backupButton=document.getElementById('downloadKitchenBackup');
  if(backupButton){
    let hasBackup=false;
    try{hasBackup=!!activeUser && !!localStorage.getItem('mealmate_unsynced_backup_'+activeUser.id)}catch{}
    backupButton.hidden=!hasBackup;
  }
  document.getElementById('authSwitch').textContent=signupMode?'Have an account? Sign in':'New here? Create an account';
  document.getElementById('authPassword').autocomplete=signupMode?'new-password':'current-password';
  document.getElementById('authPassword').minLength=signupMode?8:6; // Existing six-character accounts may still sign in.
  const confirmField=document.getElementById('confirmPasswordField');
  const confirmInput=document.getElementById('authPasswordConfirm');
  confirmField.hidden=!signupMode || !configured || !!activeUser;
  confirmInput.required=signupMode && configured && !activeUser;
  if(!signupMode)confirmInput.value='';
  const profileInput=document.getElementById('chefDisplayName');
  if(activeUser && document.activeElement!==profileInput)profileInput.value=state.chefAlias||'';
}
function openAuth(){paintAuth();setAuthMessage('');authBg.classList.add('visible');document.body.style.overflow='hidden'}
function closeAuth(){authBg.classList.remove('visible');if(!document.getElementById('modalBg').classList.contains('visible'))document.body.style.overflow=''}
document.getElementById('closeAuth').addEventListener('click',closeAuth);
authBg.addEventListener('click',e=>{if(e.target===authBg)closeAuth()});
document.getElementById('authSwitch').addEventListener('click',()=>{
  signupMode=!signupMode;
  document.getElementById('authPassword').value='';
  document.getElementById('authPasswordConfirm').value='';
  ['authPassword','authPasswordConfirm'].forEach(id=>{
    document.getElementById(id).type='password';
  });
  ['togglePassword','toggleConfirmPassword'].forEach(id=>{
    const b=document.getElementById(id);b.textContent='Show';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Show password');
  });
  paintAuth();setAuthMessage('');
});
for(const [buttonId,inputId] of [['togglePassword','authPassword'],['toggleConfirmPassword','authPasswordConfirm']]){
  document.getElementById(buttonId).addEventListener('click',()=>{
    const input=document.getElementById(inputId),button=document.getElementById(buttonId);
    const visible=input.type==='password';input.type=visible?'text':'password';
    button.textContent=visible?'Hide':'Show';button.setAttribute('aria-pressed',String(visible));
    button.setAttribute('aria-label',visible?'Hide password':'Show password');
  });
}
document.getElementById('saveChefDisplayName').addEventListener('click',async()=>{
  if(!activeUser)return;
  if(cloudBlocked){setAuthMessage('Resolve the cloud conflict or connection issue before editing your chef name.',true);return}
  const alias=document.getElementById('chefDisplayName').value.trim();
  if(!validChefName(alias)){setAuthMessage('Use 2–24 characters: letters, numbers, spaces, hyphens or underscores.',true);return}
  const oldAlias=state.chefAlias||'';
  if(oldAlias===alias){setAuthMessage('Chef name is already saved.');return}
  const b=document.getElementById('saveChefDisplayName');b.disabled=true;
  try{
    await cloud.updateChefName(activeUser.id,alias);
    state.chefAlias=alias;save();
    await refreshCommunity();
    setAuthMessage('Chef name updated! Existing community posts now show your new name.');
  }catch(err){setAuthMessage('Could not change chef name: '+(err.message||'Try again.'),true)}
  finally{b.disabled=false}
});
authForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const email=document.getElementById('authEmail').value.trim();
  const password=document.getElementById('authPassword').value;
  if(signupMode){
    if(password.length<8){setAuthMessage('Please use at least 8 characters for your password.',true);return}
    if(password!==document.getElementById('authPasswordConfirm').value){setAuthMessage('Passwords do not match. Please double-check both fields.',true);return}
  }
  const button=document.getElementById('authSubmit');button.disabled=true;
  setAuthMessage(signupMode?'Creating account…':'Signing in…');
  try{
    const result=signupMode?await cloud.signup(email,password):await cloud.login(email,password);
    if(signupMode && !result.session)setAuthMessage('Check your email to confirm your account, then sign in.');
    else setAuthMessage('Welcome to your kitchen!');
  }catch(err){setAuthMessage(err.message||'Could not connect. Try again.',true)}
  finally{button.disabled=false}
});
document.getElementById('syncNow').addEventListener('click',async()=>{
  if(!activeUser)return;
  if(cloudBlocked){await changeAccount(activeUser,true);paintAuth();setAuthMessage(cloudBlocked?'Still unresolved. Your local copy is safe.':'Kitchen connected.',cloudBlocked);return;}
  cloudDirty=true;await flushCloud();setAuthMessage(cloudError?'Cloud save needs attention.':'Kitchen saved to cloud.',cloudError);
});
document.getElementById('downloadKitchenBackup')?.addEventListener('click',()=>{
  if(!activeUser)return;
  const raw=localStorage.getItem('mealmate_unsynced_backup_'+activeUser.id);
  if(!raw){setAuthMessage('No recovery copy is saved.');return;}
  const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;
  link.download='mealmate-recovery-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  setAuthMessage('Recovery copy downloaded. Keep it somewhere safe.');
});
document.getElementById('signOut').addEventListener('click',async()=>{
  if(cloudDirty){
    await flushCloud();
    if(cloudDirty&&!confirm('Your latest changes have not synced. Sign out anyway?'))return;
  }
  try{await cloud.logout();closeAuth();}
  catch(err){setAuthMessage(err.message||'Sign out failed.',true)}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAuth()});
const bg=document.getElementById('modalBg'),form=document.getElementById('modalForm');function modal(title,fields,fn){document.getElementById('modalTitle').textContent=title;document.getElementById('modalFields').innerHTML=fields.map(f=>`<label class="field"><span>${esc(f.label)}</span><input name="${esc(f.key)}" type="${f.type||'text'}" ${f.type==='number'?'min="0" step="1"':''} value="${esc(f.value)}" ${f.required?'required':''} maxlength="${f.type==='number'?'12':'200'}"></label>`).join('');modalSave=fn;bg.classList.add('visible');document.body.style.overflow='hidden';const first=form.querySelector('input');if(first)setTimeout(()=>first.focus(),50)}function closeModal(){bg.classList.remove('visible');document.body.style.overflow='';modalSave=null}
// Market destructive actions use the same accessible cabinet dialog as onboarding.
// Decisions are requested before mutating state; no native browser confirm popup.
async function confirmMarketAction({title,message,yes,no='Keep list'},apply){
  const ownerAtOpen=activeUser?.id||null;
  const choice=await kitchenDialog({title,message,yes,no});
  if(choice!=='yes'||cloudBlocked||(activeUser?.id||null)!==ownerAtOpen)return;
  apply();save();render();
}

document.getElementById('cancelModal').addEventListener('click',closeModal);bg.addEventListener('click',e=>{if(e.target===bg)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));if(modalSave)modalSave(data);closeModal();save();render()});
const recipeBg=document.getElementById('recipeBg');
document.getElementById('recipeCancel').addEventListener('click',closeRecipeEditor);
recipeBg.addEventListener('click',e=>{if(e.target===recipeBg)closeRecipeEditor()});
document.getElementById('recipeForm').addEventListener('submit',e=>{
 e.preventDefault();if(cloudBlocked){showRecipeError('Cloud is unavailable. Reconnect before editing.');return}
 const form=new FormData(e.currentTarget),id=document.getElementById('recipeEditId').value;
 if(writeRecipeFromForm(form,id||null))closeRecipeEditor();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&recipeBg.classList.contains('visible'))closeRecipeEditor()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||bg.classList.contains('visible')||recipeBg.classList.contains('visible'))return;const a=b.dataset.action;
if(cloudBlocked && a!=='account'){if(conflictOwner)void resolveCloudConflict(conflictOwner);else openAuth();return;}
const s=state.selected,i=Number(b.dataset.index),w=monday(s),id=b.dataset.id;switch(a){
case'recipefilter':cookbookFilter=b.dataset.filter;render();if(cookbookFilter==='community'&&activeUser&&communityLoadedFor!==activeUser.id)void refreshCommunity();return;
case'communityrefresh':void refreshCommunity();return;
case'recipepublish':void sharePersonalRecipe(id);return;
case'communitycopy':copyCommunityToMine(id);return;
case'communityremove':void unshareCommunity(id);return;
case'communityreport':void reportCommunity(id);return;
case'recipeadd':openRecipeEditor();return;
case'recipeedit':{const r=recipeForId(id);if(r)openRecipeEditor(r);return;}
case'recipeclone':starterToPersonal(id);return;
case'recipedelete':{const r=recipeForId(id);if(!r)return; if(!confirm(`Permanently delete “${r.name}” from your private Cookbook? If you've shared it, its Community post will remain visible until you unshare it separately.`))return;state.customRecipes=state.customRecipes.filter(x=>x.id!==id);break;}
case'recipemarket':addRecipeIngredientsToMarket(id);return;
case'account':openAuth();return;
case'go':tab=b.dataset.tab;if(tab==='recipes'&&cookbookFilter==='community'&&activeUser&&communityLoadedFor!==activeUser.id)void refreshCommunity();break;
case'date':state.selected=b.dataset.date;if(b.dataset.goto)tab=b.dataset.goto;break;
case'week':state.selected=shift(monday(s),Number(b.dataset.delta));marketSearch='';marketFilter='todo';break;
case'month':{const p=monthCursor||s.slice(0,7),d=parseDate(p+'-01');d.setMonth(d.getMonth()+Number(b.dataset.delta));monthCursor=localDate(d).slice(0,7);break}
case'jumpnow':state.selected=localDate(new Date());monthCursor=state.selected.slice(0,7);break;
case'mealcheck':markMeal(s,i);return;
case'mealedit':modal('Edit '+['breakfast','lunch','dinner'][i],[{key:'meal',label:'Meal',value:mealFor(s,i),required:true}],d=>{state.mealOverrides[s]??={};state.mealOverrides[s][i]=d.meal.trim()});return;
case'taskcheck':{const t=taskFor(s).find(x=>x.id===id);if(t)t.done=!t.done;break}
case'taskadd':modal('Add a task',[{key:'text',label:'What do you need to do?',value:'',required:true}],d=>{if(d.text.trim())taskFor(s).push({id:uid(),text:d.text.trim(),done:false})});return;
case'taskedit':{const t=taskFor(s).find(x=>x.id===id);if(!t)return;modal('Edit chore',[{key:'text',label:'Chore',value:t.text,required:true}],d=>{if(d.text.trim())t.text=d.text.trim()});return}
case'taskdelete':{const t=taskFor(s).find(x=>x.id===id);if(!t)return;void confirmMarketAction({title:'Remove this little chore?',message:`“${t.text}” will be removed from ${human(s,{weekday:'long',month:'short',day:'numeric'})}'s checklist. This change will sync to your cloud kitchen.`,yes:'Delete chore',no:'Keep chore'},()=>{state.tasks[s]=taskFor(s).filter(x=>x.id!==id);});return;}
case'marketfilter':marketFilter=b.dataset.filter;render();return;

case'clearbought':{const n=shoppingFor(w).filter(x=>x.checked).length;if(!n)return;void confirmMarketAction({title:'Clear collected groceries?',message:`Remove ${n} bought item${n===1?'':'s'} from this week’s Market? This change will sync to your cloud kitchen.`,yes:`Remove ${n} bought item${n===1?'':'s'}`},()=>{state.shopping[w]=shoppingFor(w).filter(x=>!x.checked);marketFilter='todo';marketSearch='';});return;}
case'clearweek':{const n=shoppingFor(w).length;if(!n)return;void confirmMarketAction({title:'Empty the entire market basket?',message:`This will remove all ${n} grocery item${n===1?'':'s'} for this week, including groceries not yet bought. The deletion will sync to your cloud kitchen.`,yes:'Empty basket'},()=>{state.shopping[w]=[];marketFilter='todo';marketSearch='';});return;}
case'grocerycheck':{const g=shoppingFor(w).find(x=>x.id===id);if(g)g.checked=!g.checked;break}
case'grocerydelete':{const g=shoppingFor(w).find(x=>x.id===id);if(!g)return;void confirmMarketAction({title:'Remove this ingredient?',message:`“${g.name}” (${g.qty}) will be removed from this week’s list and synced to your cloud kitchen.`,yes:'Remove ingredient',no:'Keep item'},()=>{state.shopping[w]=shoppingFor(w).filter(x=>x.id!==id);});return;}
case'groceryadd':modal('Add grocery item',[{key:'name',label:'Item name',value:'',required:true},{key:'qty',label:'Quantity',value:'1'},{key:'price',label:'Estimated price (₱)',value:'0',type:'number'}],d=>{if(d.name.trim()){shoppingFor(w).push({id:uid(),name:d.name.trim(),qty:d.qty.trim(),price:Math.max(0,Number(d.price)||0),checked:false});marketFilter='todo';marketSearch='';}});return;
case'groceryedit':{const g=shoppingFor(w).find(x=>x.id===id);if(!g)return;modal('Edit grocery item',[{key:'name',label:'Item name',value:g.name,required:true},{key:'qty',label:'Quantity',value:g.qty},{key:'price',label:'Estimated price (₱)',value:String(g.price),type:'number'}],d=>{if(d.name.trim()){g.name=d.name.trim();g.qty=d.qty.trim();g.price=Math.max(0,Number(d.price)||0)}});return}
case'uncheck':{const n=shoppingFor(w).filter(x=>x.checked).length;if(!n)return;void confirmMarketAction({title:'Return groceries to To Buy?',message:`Move ${n} bought item${n===1?'':'s'} back into your To Buy list? Nothing will be deleted.`,yes:'Move to To Buy',no:'Leave as bought'},()=>shoppingFor(w).forEach(x=>x.checked=false));return;}
case'budget':modal('Set weekly budget',[{key:'amount',label:'Budget (₱ per week)',value:String(state.budget),type:'number',required:true}],d=>{state.budget=Math.max(1,Number(d.amount)||1400)});return;
case'copy':{const list=shoppingFor(w).map(g=>`${g.checked?'[x]':'[ ]'} ${g.name} — ${g.qty} — ₱${g.price}`).join('\n');const txt=`MealMate: ${w} grocery list\n`+list;void copyMarketList(txt);return;}
}save();render()});
document.addEventListener('input',e=>{if(e.target.id==='cookbookSearch'){cookbookSearch=e.target.value;const cards=document.getElementById('cookbookCards');if(cards)cards.innerHTML=cookbookCards();return}if(e.target.id!=='marketSearch')return;marketSearch=e.target.value;const w=monday(state.selected);const matches=shoppingFor(w).filter(marketMatches);const rows=document.getElementById('marketRows'),empty=document.getElementById('marketEmpty');if(rows)rows.innerHTML=matches.map(groceryRow).join('');if(empty){empty.classList.toggle('is-hidden',matches.length!==0);if(!matches.length){const msg=document.getElementById('marketEmptyMessage');if(msg)msg.textContent=marketSearch.trim()?'No matching ingredients. Try a different search.':'Nothing in this section yet. Try another tab.';}}});
// Keep a recovery snapshot if a signed-in kitchen is closed with unsynced edits.
window.addEventListener('beforeunload',event=>{
  if(activeUser && (cloudDirty || cloudWriting || conflictOwner)){
    backupConflict(activeUser.id);
    event.preventDefault();event.returnValue='';
  }
});
window.MealMateUI={goToTab(name){if(['today','calendar','groceries','recipes'].includes(name)){tab=name;render();window.scrollTo({top:0,behavior:'instant'});}}};
render();
if(cloud.enabled){
  status('CHECKING CLOUD SESSION…');
  cloud.onSession(user=>{void changeAccount(user)});
  cloud.init().catch(err=>{status('LOCAL — CLOUD UNAVAILABLE',true);console.warn('Supabase setup error:',err)});
}else status('LOCAL — CLOUD NOT SET UP');
})();
