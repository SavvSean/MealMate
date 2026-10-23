/* MealMate Kitchen Training: original optional, device-local guided tour.
 * Kept separate from cloud state to avoid accidental kitchen writes.
 */
(() => {
  'use strict';
  // EDIT YOUR MASCOT HERE. All name, slogan, and accent changes come from one place.
  const CHEF_CONFIG = {
    name: 'Kyoku',
    title: 'Chef Kyoku',
    catchphrase: 'UMAI!!!',
    motto: 'Set your heart ablaze!',
    personality: 'passionate, upbeat, supportive mentor',
    accentColors: {
      flameRed: '#DA4D38',
      flameOrange: '#F28B35',
      flameGold: '#F6C65B'
    },
    showFlameBadge: true
  };

  const CHEF_NAME = CHEF_CONFIG.name;
  const STORAGE_KEY = 'mealmate_tutorial_seen_v1';
  const steps = [
    {
      tag: 'A FIERY WELCOME!', title: `Welcome! I'm ${CHEF_CONFIG.title}!`,
      text: `Welcome to MealMate! I'm ${CHEF_CONFIG.title}, and I'm thrilled to have you here! ${CHEF_CONFIG.motto} We'll master this little kitchen together—one station at a time!`,
      tab: null, card: 'welcome', button: 'Spark up the tour!'
    },
    {
      tag: 'STATION 01 · THE COUNTER', title: 'Your day, served with passion!',
      text: 'Behold your Counter! Breakfast, lunch, and dinner are ready as little order tickets! Tap the stamp when a meal is done, or the pencil to change your plan. You can do this, Chef!',
      tab: 'today', card: 'counter', button: 'Onward!'
    },
    {
      tag: 'STATION 02 · THE PLANNER', title: 'A great week starts with a plan!',
      text: 'Magnificent! Use the Planner to choose any day and map out your meals! Every small plan is another spark of progress. Your changes are saved so you can focus on cooking!',
      tab: 'calendar', card: 'planner', button: 'Next station!'
    },
    {
      tag: 'STATION 03 · THE MARKET', title: 'Gather your ingredients!',
      text: 'Welcome to your grocery command station! Start with an empty basket, add ingredients yourself, or pick a recipe from the Cookbook! To Buy shows what you still need, Bought hides collected items, and the little trash icon removes mistakes with a confirmation. Shop with confidence!',
      tab: 'groceries', card: 'market', button: 'Keep going!'
    },
    {
      tag: 'STATION 04 · THE COOKBOOK', title: 'Discover your next magnificent dish!',
      text: 'The Cookbook is blazing with possibility! Flip a card to see cooking steps, save a starter as your own, or write a brand-new recipe! You can even share a copy with the Community Cookbook! Add ingredients straight to the Market. UMAI!!! Remember to cook safely!',
      tab: 'recipes', card: 'cookbook', button: 'One more station!'
    },
    {
      tag: 'BONUS · YOUR KITCHEN KEY', title: 'Protect your kitchen progress!',
      text: `Excellent work, Chef! Sign in with your Kitchen Key to save your meals, Market list, and personal recipes to the cloud. Open the same account on your phone or laptop to load your kitchen. ${CHEF_CONFIG.catchphrase} Your progress is worth celebrating!`,
      tab: 'today', card: 'cloud', button: 'Finish strong!'
    },
    {
      tag: 'TRAINING COMPLETE!', title: `${CHEF_CONFIG.catchphrase} You're ready, Chef!`,
      text: `${CHEF_CONFIG.catchphrase} Magnificent work completing the tour! You have the spirit of a true kitchen master! Start with one meal or one grocery—every step counts. Go forth and cook with passion! Replay this tour anytime from Help.`,
      tab: 'today', card: 'finish', button: 'Start cooking!'
    }
  ];

  const chefSVG = `<svg class="tour-chef-svg" viewBox="0 0 200 245" role="img" aria-label="${CHEF_CONFIG.title}, an enthusiastic smiling cartoon chef waving hello" xmlns="http://www.w3.org/2000/svg">
   <g stroke="#603a23" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M49 194q14-31 51-32 40-1 55 33l-3 43H47Z" fill="#fff2d8"/>
    <path d="M60 190q-36-13-40-2-4 11 28 28l17-8" fill="#fff2d8"/>
    <path d="M148 188q18-21 27-37" fill="none" stroke="#f9c999" stroke-width="21"/>
    <path d="M174 154q-13-1-13-13m13 13q7-7 7-18m-7 18q12 1 18-9" fill="none" stroke="#603a23" stroke-width="5"/>
    <path d="M69 179q26 10 60 1l11 58H59Z" fill="#b97a50"/>
    <path d="M86 179l14 19 13-19" fill="${CHEF_CONFIG.accentColors.flameRed}"/>
    <path d="M73 95q-13 18-8 46l-9 18q12 14 30 2 20 14 42 0 23 8 26-11l-11-26q5-22-10-32Z" fill="#5c3828"/>
    <ellipse cx="104" cy="119" rx="48" ry="52" fill="#f6c498"/>
    <path d="M61 103q0-42 43-43 43 2 48 43-13-10-19-18-15 9-32 1-14 21-40 17Z" fill="#5d3827"/>
    <path d="M61 82q-28-12-18-34 0-20 27-19 10-30 38-19 22-11 40 14 28 1 18 31-3 17-20 23Z" fill="#fff9ed"/>
    <path d="M61 75q43 8 88 0v21q-44 8-88 0Z" fill="#fff4e1"/>
    <path d="M91 119v7m31-7v7" fill="none" stroke-width="6"/>
    <path d="M91 140q13 15 26 0" fill="none" stroke-width="5"/>
    <circle cx="75" cy="134" r="7" fill="#ed997d" stroke="none"/><circle cx="137" cy="134" r="7" fill="#ed997d" stroke="none"/>
    <path d="M97 216l7 5 7-5" stroke="#f5d49a" fill="none" stroke-width="4"/>
   </g>
   ${CHEF_CONFIG.showFlameBadge ? `<g aria-hidden="true"><path d="M101 74c-5-6-1-11 2-15 0 5 7 8 7 14 3-2 4-5 4-7 5 8 2 15-6 17-9 2-13-4-12-10 2 1 3 2 5 1Z" fill="${CHEF_CONFIG.accentColors.flameOrange}" stroke="${CHEF_CONFIG.accentColors.flameRed}" stroke-width="1.6"/><path d="M105 78c-2-3 0-6 2-8 0 3 4 4 2 8Z" fill="${CHEF_CONFIG.accentColors.flameGold}"/></g>` : ''}
   <g fill="#ffda82" stroke="#91532e" stroke-width="2"><path d="m30 118 4 7 8 1-6 6 1 8-7-4-7 4 2-8-6-6 9-1Z"/><circle cx="163" cy="59" r="4"/></g>
  </svg>`;

  function picture(type) {
    const common = 'aria-hidden="true"';
    const drawings = {
      welcome: `<div class="demo-welcome"><div class="demo-sun">✳</div><span class="demo-woodsign">OPEN FOR GOOD FOOD</span><div class="demo-smallplates"><span>🍳</span><span>🍚</span><span>🥬</span></div></div>`,
      counter: `<div class="demo-ticket"><span class="demo-tiny">ORDER #001 · BREAKFAST</span><div class="demo-tline"><span class="demo-favicon">🍳</span><b>Eggs + rice + banana</b><span class="demo-stamp">✓</span></div><small>Tap a stamp when your meal is done!</small></div>`,
      planner: `<div class="demo-week"><div class="demo-weektitle">YOUR LITTLE WEEK</div><div class="demo-days">${['M','T','W','T','F','S','S'].map((d,i)=>`<div class="${i===2?'chosen':''}">${d}<b>${i+19}</b></div>`).join('')}</div><div class="demo-weekline">✎ Wednesday · Plan a lunch</div></div>`,
      market: `<div class="demo-receipt"><div class="demo-receipt-title">✳ MARKET SLIP ✳</div><div><span>☑</span> Eggs <small>₱90</small></div><div><span>□</span> Rice <small>₱120</small></div><div class="demo-receipt-total">IN THE JAR: ₱200 / DAY</div></div>`,
      cookbook: `<div class="demo-cookbook"><span class="demo-book-icon">📖</span><div><b>Eggs with rice & tomato</b><small>INGREDIENTS · 15 MIN</small><em>1. Prepare ingredients<br>2. Cook safely<br>3. Serve & enjoy!</em></div></div>`,
      cloud: `<div class="demo-cloud"><span>☁</span><b>CLOUD SAVED</b><small>Your little kitchen travels with you.</small><div class="demo-devices">▣ &nbsp; ⇄ &nbsp; ▯</div></div>`,
      finish: `<div class="demo-finish"><span>✦ ✳ ✦</span><strong>YOU DID IT!</strong><span>🥘 🌱 🍚</span></div>`
    };
    return `<div class="tour-demo tour-demo-${type}" ${common}>${drawings[type] || drawings.welcome}</div>`;
  }

  const overlay = document.getElementById('tutorialOverlay');
  if (!overlay) return;
  document.getElementById('tourChef').innerHTML = chefSVG;
  const chefTag = overlay.querySelector('.tour-chef-tag');
  if(chefTag) chefTag.textContent = `${CHEF_CONFIG.title.toLocaleUpperCase()} ✦`;
  const title = overlay.querySelector('#tourTitle');
  const kicker = overlay.querySelector('#tourKicker');
  const explanation = overlay.querySelector('#tourExplanation');
  const illustration = overlay.querySelector('#tourIllustration');
  const count = overlay.querySelector('#tourCount');
  const progress = overlay.querySelector('#tourProgress');
  const prev = overlay.querySelector('#tourBack');
  const next = overlay.querySelector('#tourNext');
  const skip = overlay.querySelector('#tourSkip');
  let index = 0;
  let opened = false;
  let previousFocus = null;

  function remember(){try{localStorage.setItem(STORAGE_KEY,'seen')}catch(e){ /* privacy mode */ }}
  function isSeen(){try{return localStorage.getItem(STORAGE_KEY)==='seen'}catch(e){return true}}
  function currentTab(name){if(name && window.MealMateUI?.goToTab) window.MealMateUI.goToTab(name)}

  function showStep(){
    const step = steps[index];
    kicker.textContent = step.tag;
    title.textContent = step.title;
    explanation.textContent = step.text;
    illustration.innerHTML = picture(step.card);
    count.textContent = `${index + 1} / ${steps.length}`;
    progress.innerHTML = steps.map((s,i)=>`<span class="tour-dot ${i===index?'current':i<index?'visited':''}" aria-hidden="true"></span>`).join('');
    prev.hidden = index===0;
    next.textContent = step.button;
    skip.textContent = index===steps.length-1 ? 'Close' : 'Skip tutorial ×';
    currentTab(step.tab);
    overlay.querySelector('.tour-dialog').scrollTop=0;
    title.focus({preventScroll:true});
  }
  function openTour(force=false){
    if(opened || (!force&&isSeen()))return;
    if(document.querySelector('.modal-bg.visible'))return;
    previousFocus=document.activeElement;
    opened=true;index=0;
    overlay.hidden=false;
    document.body.classList.add('tour-is-open');
    showStep();
  }
  function closeTour(){
    if(!opened)return;
    remember();opened=false;overlay.hidden=true;
    document.body.classList.remove('tour-is-open');
    currentTab('today');
    previousFocus?.focus?.({preventScroll:true});
  }
  prev.addEventListener('click',()=>{if(index>0){index--;showStep();}});
  next.addEventListener('click',()=>{if(index<steps.length-1){index++;showStep();}else closeTour();});
  skip.addEventListener('click',closeTour);
  // Allow independent triggers in the header and account/help panel.
  document.addEventListener('click',event=>{
    const replay=event.target.closest('[data-tour-replay]');
    if(!replay)return;
    // Explicitly close any account modal before showing the tutorial.
    const auth=document.getElementById('authBg');
    if(auth?.classList.contains('visible')){
      auth.classList.remove('visible');document.body.style.overflow='';
      document.querySelector('.top-help')?.focus();
    }
    openTour(true);
  });
  overlay.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeTour();return;}
    if(e.key==='Tab'){
      const controls=[skip,prev,next].filter(el=>!el.hidden && !el.disabled);
      const first=controls[0],last=controls[controls.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  // Wait for the first paint, then offer the tour only once on this browser.
  window.addEventListener('load',()=>{
    if(!isSeen())setTimeout(()=>openTour(false),650);
  });
  window.MealMateTutorial={replay:()=>openTour(true)};
})();
