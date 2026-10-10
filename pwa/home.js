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
    landing.innerHTML='<div class="home-hero"><img src="https://d1uzk9o9cg136f.cloudfront.net/f/16782548/rc/2020/12/06/f5c8346b7c54d328c8d1865b5d5949afee8c0e1a_xlarge.jpg" alt="موتور بنلی"><div><h2>راهنمای Benelli TNT 249</h2><p>دفترچه تعمیراتی دیجیتال</p></div></div><div class="home-choice-grid"><button type="button" data-home-choice="fa"><i class="bi bi-translate"></i><span><strong>راهنمای فارسی</strong><small>مطالب ترجمه‌شده دفترچه</small></span></button><button type="button" data-home-choice="en"><i class="bi bi-book"></i><span><strong>راهنمای انگلیسی</strong><small>صفحات اصلی دفترچه</small></span></button><button type="button" data-home-choice="repair"><i class="bi bi-wrench-adjustable"></i><span><strong>راهنمای بخش تعمیرات</strong><small>موضوعات تعمیراتی</small></span></button></div>';
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
