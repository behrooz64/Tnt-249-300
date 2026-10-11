function initTntHome(){
  const style=document.createElement('style');
  style.textContent=`
    #homeLanding{display:none;margin-bottom:1rem}
    .home-hero{position:relative;overflow:hidden;border-radius:1.1rem;margin-bottom:1rem;background:#171a20;min-height:190px;box-shadow:0 .6rem 1.5rem rgba(0,0,0,.12)}
    .home-hero img{display:block;width:100%;height:clamp(190px,35vw,330px);object-fit:cover;object-position:center 45%}
    .home-hero>div{position:absolute;inset:auto 0 0;padding:1.3rem 1rem 1rem;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.82))}
    .home-hero h2{font-size:clamp(1.15rem,3vw,1.7rem);font-weight:800;margin:0 0 .25rem}
    .home-hero p{margin:0;font-size:.9rem}
    #homeLanding .home-search-card{display:block!important;margin-bottom:1rem;border:1px solid var(--bs-border-color);border-radius:1rem;box-shadow:0 .35rem 1.2rem rgba(0,0,0,.06);background:var(--bs-body-bg)}
    .home-search-heading{display:flex;align-items:center;gap:.7rem;margin:0 0 .8rem}
    .home-search-icon{display:flex;align-items:center;justify-content:center;flex:0 0 2.7rem;height:2.7rem;border-radius:.85rem;background:rgba(var(--bs-primary-rgb),.12);color:var(--bs-primary);font-size:1.2rem}
    .home-search-heading strong{display:block;font-size:1.05rem;font-weight:800}
    .home-search-heading small{display:block;color:var(--bs-secondary-color);margin-top:.15rem}
    #homeLanding .search-group{height:54px;border:1px solid var(--bs-border-color);border-radius:.85rem;overflow:hidden;background:var(--bs-tertiary-bg)}
    #homeLanding .search-group .input-group-text,#homeLanding .search-group .form-control,#homeLanding .search-group #clear{height:54px;border:0;background:transparent;font:inherit;font-size:.95rem}
    #homeLanding .search-group .input-group-text{padding:0 1rem;color:var(--bs-primary);font-size:1.1rem}
    #homeLanding .search-group .form-control{min-width:0;box-shadow:none}
    #homeLanding .search-group .form-control:focus{background:var(--bs-body-bg)}
    #homeLanding .search-group #clear{border-right:1px solid var(--bs-border-color);padding:0 .85rem;color:var(--bs-secondary-color);white-space:nowrap}
    .home-search-hints{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;margin-top:.75rem}
    .home-search-hints>span{font-size:.78rem;color:var(--bs-secondary-color)}
    .home-search-hints button{border:1px solid var(--bs-border-color);border-radius:999px;background:var(--bs-tertiary-bg);color:var(--bs-body-color);padding:.3rem .65rem;font:inherit;font-size:.78rem;cursor:pointer}
    .home-search-hints button:hover{border-color:var(--bs-primary);color:var(--bs-primary)}
    .home-choice-grid{display:grid;grid-template-columns:1fr;gap:.75rem}
    .home-choice-grid button{display:flex;align-items:center;gap:.8rem;width:100%;padding:1rem;border:1px solid var(--bs-border-color);border-radius:.9rem;background:var(--bs-body-bg);color:var(--bs-body-color);text-align:right;font:inherit;cursor:pointer;transition:border-color .15s,transform .15s,box-shadow .15s}
    .home-choice-grid button:hover{border-color:rgba(var(--bs-primary-rgb),.5);transform:translateY(-2px);box-shadow:0 .35rem 1rem rgba(0,0,0,.06)}
    .home-choice-grid button>i:first-child{display:flex;align-items:center;justify-content:center;flex:0 0 3rem;height:3rem;border-radius:.8rem;background:var(--bs-secondary-bg);color:var(--bs-primary);font-size:1.35rem}
    .home-choice-grid button>span{flex:1;min-width:0}
    .home-choice-grid strong,.home-choice-grid small{display:block}
    .home-choice-grid small{margin-top:.2rem;color:var(--bs-secondary-color)}
    .home-install-card{position:relative;display:flex;align-items:center;gap:1rem;margin-top:1rem;padding:1.15rem;border:1px solid rgba(var(--bs-primary-rgb),.22);border-radius:1rem;background:linear-gradient(125deg,rgba(var(--bs-primary-rgb),.09),var(--bs-body-bg) 70%);box-shadow:0 .35rem 1.2rem rgba(0,0,0,.055)}
    .home-install-icon{display:flex;align-items:center;justify-content:center;flex:0 0 4rem;height:4rem;border-radius:1.15rem;background:#173d68;color:#fff;box-shadow:0 .4rem .9rem rgba(23,61,104,.22)}
    .home-install-icon img{width:3.2rem;height:3.2rem}
    .home-install-copy{flex:1;min-width:0}
    .home-install-copy h3{margin:0 0 .25rem;font-size:1.05rem;font-weight:850}
    .home-install-copy p{margin:0;color:var(--bs-secondary-color);font-size:.87rem;line-height:1.8}
    .home-install-points{display:flex;flex-wrap:wrap;gap:.35rem .8rem;margin-top:.55rem;color:var(--bs-secondary-color);font-size:.76rem}
    .home-install-points span{display:inline-flex;align-items:center;gap:.3rem}
    .home-install-points i{color:#198754}
    .home-install-action{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:.45rem;border:0;border-radius:.8rem;background:#173d68;color:#fff;padding:.75rem 1rem;font:inherit;font-weight:750;cursor:pointer;white-space:nowrap}
    .home-install-action:hover{background:#20558f;color:#fff}
    .home-install-help{margin-top:.8rem;padding:.8rem 1rem;border:1px solid var(--bs-border-color);border-radius:.8rem;background:var(--bs-body-bg);font-size:.85rem;line-height:1.9}
    .home-install-help[hidden]{display:none!important}
    .home-install-help ol{margin:.25rem 0 0;padding-right:1.2rem}
    @media(max-width:575.98px){.home-install-card{align-items:flex-start;gap:.7rem;padding:.85rem;flex-wrap:wrap}.home-install-icon{flex-basis:3.2rem;height:3.2rem;border-radius:.9rem}.home-install-icon img{width:2.55rem;height:2.55rem}.home-install-copy{flex-basis:calc(100% - 4rem)}.home-install-copy h3{font-size:.98rem}.home-install-copy p{font-size:.81rem}.home-install-action{width:100%;padding:.7rem}.home-install-points{font-size:.72rem}}
    @media(min-width:700px){.home-choice-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.home-choice-grid button{align-items:flex-start;flex-direction:column;min-height:145px}}
    @media(max-width:575.98px){#homeLanding .card-body{padding:1rem!important}#homeLanding .search-group,#homeLanding .search-group .input-group-text,#homeLanding .search-group .form-control,#homeLanding .search-group #clear{height:48px;font-size:.85rem}#homeLanding .search-group #clear{padding:0 .55rem}#homeLanding .search-group .input-group-text{padding:0 .7rem}}
  `;
  document.head.appendChild(style);
  const main=document.querySelector('.app-content .container-fluid');
  if(!main)return;
  const nav=main.querySelector('.search-navigation');
  const searchCard=nav?.nextElementSibling;
  let landing=document.getElementById('homeLanding');
  if(!landing){
    landing=document.createElement('section');
    landing.id='homeLanding';
    landing.innerHTML='<div class="home-hero"><img src="docs/images/f5c8346b7c54d328c8d1865b5d5949afee8c0e1a_xlarge.jpg" alt="موتور بنلی"><div><h2>راهنمای Benelli TNT 249</h2><p>دفترچه تعمیراتی دیجیتال</p></div></div><div class="home-choice-grid"><button type="button" data-home-choice="fa"><i class="bi bi-translate"></i><span><strong>راهنمای فارسی</strong><small>مطالب ترجمه‌شده دفترچه</small></span></button><button type="button" data-home-choice="en"><i class="bi bi-book"></i><span><strong>راهنمای انگلیسی</strong><small>صفحات اصلی دفترچه</small></span></button><button type="button" data-home-choice="repair"><i class="bi bi-wrench-adjustable"></i><span><strong>راهنمای بخش تعمیرات</strong><small>موضوعات تعمیراتی</small></span></button></div><section class="home-install-card" aria-labelledby="homeInstallTitle"><div class="home-install-icon"><img src="icons/tnt249.svg" alt="" width="52" height="52"></div><div class="home-install-copy"><h3 id="homeInstallTitle">نصب برنامه روی گوشی</h3><p>راهنمای تعمیر همیشه همراهت؛ آیکون اختصاصی را به صفحه اصلی گوشی اضافه کن و سریع‌تر به دفترچه دسترسی داشته باش.</p><div class="home-install-points"><span><i class="bi bi-check-circle-fill"></i> بدون فروشگاه برنامه</span><span><i class="bi bi-check-circle-fill"></i> دسترسی سریع از صفحه اصلی</span></div></div><button type="button" id="installPwaButton" class="home-install-action"><i class="bi bi-download"></i><span>نصب روی گوشی</span></button></section><div id="installPwaHelp" class="home-install-help" hidden aria-live="polite"></div>';
    main.insertBefore(landing,nav||main.firstChild);
  }
  if(searchCard&&!searchCard.dataset.homeSearchMoved){
    searchCard.dataset.homeSearchMoved='true';
    searchCard.classList.add('home-search-card');
    const body=searchCard.querySelector('.card-body');
    if(body){
      const heading=document.createElement('div');
      heading.className='home-search-heading';
      heading.innerHTML='<span class="home-search-icon"><i class="bi bi-search"></i></span><span><strong>دنبال چه چیزی می‌گردی؟</strong><small>نام قطعه، ایراد یا موضوع دفترچه را جست‌وجو کن</small></span>';
      body.insertBefore(heading,body.firstChild);
      const hints=document.createElement('div');
      hints.className='home-search-hints';
      hints.innerHTML='<span>جست‌وجوی سریع:</span><button type="button" data-home-query="گرانروی">گرانروی روغن</button><button type="button" data-home-query="لقی سوپاپ">لقی سوپاپ</button><button type="button" data-home-query="استارت">استارت</button><button type="button" data-home-query="ترمز">ترمز</button>';
      body.appendChild(hints);
    }
    landing.insertBefore(searchCard,landing.querySelector('.home-choice-grid'));
  }
  function home(){
    landing.style.display='block';
    if(nav)nav.style.display='none';
    if(searchCard)searchCard.style.display='block';
    ['#status','#results'].forEach(s=>{const x=main.querySelector(s);if(x)x.style.display='none';});
    document.querySelector('#detail')?.classList.add('hidden');
    document.querySelector('#pdfViewer')?.classList.add('hidden');
    if(typeof setPageHeader==='function')setPageHeader('راهنمای تعمیر Benelli TNT 249','خانه');
    window.scrollTo({top:0,behavior:'auto'});
  }
  window.showTntLanding=home;
  function leave(){
    landing.style.display='none';
    if(nav)nav.style.display='';
    if(searchCard){
      searchCard.style.display='';
      if(nav&&searchCard.parentElement!==main)main.insertBefore(searchCard,nav.nextSibling);
    }
    ['#status','#results'].forEach(s=>{const x=main.querySelector(s);if(x)x.style.display='';});
  }
  let deferredInstallPrompt=null;
  const installButton=document.querySelector('#installPwaButton');
  const installHelp=document.querySelector('#installPwaHelp');
  const isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  function showInstallHelp(){
    if(!installHelp)return;
    installHelp.hidden=false;
    if(isIOS){
      installHelp.innerHTML='<strong>افزودن به صفحه اصلی در آیفون</strong><ol><li>این سایت را در مرورگر Safari باز کن.</li><li>دکمه اشتراک‌گذاری (مربع با فلش رو به بالا) را بزن.</li><li>گزینه «Add to Home Screen» یا «افزودن به صفحه اصلی» را انتخاب کن و تأیید کن.</li></ol>';
    }else{
      installHelp.innerHTML='<strong>نصب از مرورگر گوشی</strong><ol><li>سایت را با Chrome باز کن.</li><li>منوی سه‌نقطه مرورگر را باز کن.</li><li>«Install app» یا «افزودن به صفحه اصلی» را انتخاب کن.</li></ol><span class="text-body-secondary">اگر گزینه نصب نمایش داده نمی‌شود، کمی با سایت کار کن و دوباره منو را بررسی کن.</span>';
    }
  }
  if(isStandalone&&installButton){
    installButton.innerHTML='<i class="bi bi-check-circle-fill"></i><span>برنامه نصب شده است</span>';
    installButton.disabled=true;
    installButton.setAttribute('aria-label','برنامه از قبل نصب شده است');
  }
  window.addEventListener('beforeinstallprompt',function(event){
    event.preventDefault();
    deferredInstallPrompt=event;
    if(installButton&&!isStandalone)installButton.innerHTML='<i class="bi bi-download"></i><span>نصب برنامه</span>';
  });
  installButton?.addEventListener('click',async function(){
    if(isStandalone)return;
    if(deferredInstallPrompt){
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt=null;
      return;
    }
    showInstallHelp();
    installHelp?.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  window.addEventListener('appinstalled',function(){
    deferredInstallPrompt=null;
    if(installButton){installButton.innerHTML='<i class="bi bi-check-circle-fill"></i><span>برنامه نصب شد</span>';installButton.disabled=true;}
    if(installHelp)installHelp.hidden=true;
  });
  const searchInput=document.querySelector('#q');
  searchInput?.addEventListener('input',function(){
    const hasQuery=!!searchInput.value.trim();
    ['#status','#results'].forEach(s=>{const x=main.querySelector(s);if(x)x.style.display=hasQuery?'':'none';});
  },true);
  document.querySelector('#clear')?.addEventListener('click',function(e){
    if(landing.style.display!=='block')return;
    e.preventDefault();e.stopImmediatePropagation();
    if(searchInput){searchInput.value='';searchInput.dispatchEvent(new Event('input',{bubbles:true}));searchInput.focus();}
    ['#status','#results'].forEach(s=>{const x=main.querySelector(s);if(x)x.style.display='none';});
  },true);
  document.addEventListener('click',function(e){
    const hint=e.target.closest('[data-home-query]');
    if(hint){
      const q=document.querySelector('#q');
      if(q){q.value=hint.dataset.homeQuery;q.dispatchEvent(new Event('input',{bubbles:true}));q.focus();}
      return;
    }
    const h=e.target.closest('#homeHeader,#brandHome,[data-home],.filters-btn[data-filter="home"]');
    if(h){e.preventDefault();e.stopImmediatePropagation();history.pushState({tnt249:true,view:'home',mode:'home'},'',location.href);home();return;}
    const c=e.target.closest('[data-home-choice]');
    if(c){
      leave();
      if(c.dataset.homeChoice==='repair')document.querySelector('.filters button[data-filter="repair"]')?.click();
      else document.querySelector('.manual-lang-btn[data-manual-lang="'+c.dataset.homeChoice+'"]')?.click();
      return;
    }
    if(e.target.closest('.manual-lang-btn,.filters button:not([data-filter="home"]),[data-topic],[data-page],[data-pdf],[data-manual-page]'))leave();
  },true);
  window.addEventListener('popstate',function(e){if(e.state?.view==='home'&&(e.state.mode||'home')==='home')home();else leave();});
  window.addEventListener('load',function(){if(history.state?.view==='home'&&(history.state.mode||'home')==='home')home();});
  if(history.state?.view==='home'&&(history.state.mode||'home')==='home')home();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initTntHome,{once:true});else initTntHome();
