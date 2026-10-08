const $=s=>document.querySelector(s);
let manual=[],repairs=[],specs=[];
const norm=s=>String(s||"").toLowerCase().replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/ۀ/g,"ه").replace(/[\u200c\u200d]/g," ").replace(/[،؛:؟!.,;:()\[\]{}\/\\]/g," ").replace(/\s+/g," ").trim();
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function page(n){return manual.find(x=>x.page===Number(n))}
function imgPath(p){const s=String(p||"").trim();if(/^https?:\/\//i.test(s))return s;return "./"+s.replace(/^\.\//,"")}
function uniquePages(pages){return [...new Set((pages||[]).map(Number).filter(Boolean))].sort((a,b)=>a-b)}
function showPDF(n){
  const e=page(n),v=$("#pdfViewer"); if(!e)return;
  const img=(e.images||[]).find(x=>/docs\/images\/pages\/page-\d+\.png$/i.test(x)) || (e.images||[])[0];
  v.innerHTML='<div class="pdf-top"><button id="closePdf">← بستن</button><span>صفحه '+e.page+'</span></div>'+(img?'<img class="pdf-page" src="'+imgPath(img)+'" alt="صفحه اصلی PDF '+e.page+'">':'<div class="empty">تصویر این صفحه موجود نیست.</div>');
  v.classList.remove("hidden"); document.body.classList.add("modal-open");
  $("#closePdf").onclick=closePDF; v.scrollIntoView({behavior:"smooth",block:"start"});
}
function closePDF(){$("#pdfViewer").classList.add("hidden");document.body.classList.remove("modal-open")}
function pdfButtons(pages){return uniquePages(pages).map(p=>'<button class="pdf-btn" data-pdf="'+p+'">مشاهده صفحه PDF اصلی · '+p+'</button>').join("")}
function bindPDF(){document.querySelectorAll("[data-pdf]").forEach(b=>b.onclick=()=>showPDF(b.dataset.pdf))}
function renderCategories(){
  const groups=[
    ["موتور و مکانیک",["valve-compression","oil-pressure"]],
    ["سوخت و EFI",["fuel-pressure","throttle-tps-idle","injector","sensors-efi","crank-no-start","rough-low-rpm"]],
    ["خنک‌کاری",["overheat"]],
    ["برق و استارت",["no-start","battery-charging","dtc"]],
    ["شاسی و ترمز",["brakes","chain-chassis"]]
  ];
  const map=new Map(repairs.map(x=>[x.id,x]));
  const box=$("#results");
  box.innerHTML='<div class="section-title"><h2>دسته‌بندی موضوعات</h2><p>اول موضوع را انتخاب کن؛ توضیحات کامل بعد از ورود به موضوع نمایش داده می‌شود.</p></div>'+
  groups.map(([name,ids])=>'<section class="category"><h2>'+esc(name)+'</h2><div class="topic-grid">'+ids.map(id=>{const e=map.get(id);return e?'<button class="topic-card" data-topic="'+esc(id)+'"><span>'+esc(e.title)+'</span><small>'+uniquePages(e.pages).length+' صفحه مرتبط</small></button>':""}).join("")+'</div></section>').join("");
  box.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>showRepair(b.dataset.topic));
  $("#status").textContent="موضوعات آماده است";
}
function showRepair(id){
  const e=repairs.find(x=>x.id===id);if(!e)return;
  $("#detail").innerHTML='<div class="detail-nav"><button class="home-page-btn" type="button" onclick="goHome()"><i class="bi bi-house-fill"></i><span>خانه</span></button><button class="back" id="backDetail">← بازگشت به موضوعات</button><div class="detail-head"><div class="eyebrow">موضوع تعمیر</div><h2>'+esc(e.title)+'</h2><div class="tags">'+(e.keywords||[]).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div></div><section><h3>مسیر بررسی</h3><ol>'+(e.steps||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol></section><section><h3>صفحات مرتبط دفترچه</h3><div class="page-list">'+uniquePages(e.pages).map(p=>'<button class="page-chip" data-pdf="'+p+'">صفحه '+p+'</button>').join("")+'</div></section><section class="pdf-link"><h3>دفترچه اصلی</h3><p>برای دیدن خود صفحه، بدون توضیح اضافه:</p>'+pdfButtons(e.pages)+'</section>';
  $("#results").classList.add("hidden");$("#detail").classList.remove("hidden");$("#backDetail").onclick=closeDetail;bindPDF();window.scrollTo({top:0,behavior:"smooth"});
}
function closeDetail(){$("#detail").classList.add("hidden");$("#results").classList.remove("hidden");renderHome()}
function showManualPage(n){
  const e=page(n);if(!e)return;
  $("#detail").innerHTML='<div class="detail-nav"><button class="home-page-btn" type="button" onclick="goHome()"><i class="bi bi-house-fill"></i><span>خانه</span></button><button class="back" id="backDetail">← بازگشت</button><div class="detail-head"><div class="eyebrow">دفترچه</div><h2>صفحه '+e.page+'</h2></div><section><h3>توضیحات فارسی</h3><div class="fa-note">'+esc(e.notes||"برای این صفحه توضیح فارسی ثبت نشده است.")+'</div></section><section class="pdf-link"><h3>صفحه اصلی PDF</h3>'+pdfButtons([e.page])+'</section>';
  $("#results").classList.add("hidden");$("#detail").classList.remove("hidden");$("#backDetail").onclick=closeDetail;bindPDF();window.scrollTo({top:0,behavior:"smooth"});
}
function search(){
  const q=norm($("#q").value),mode=document.querySelector(".filters .active").dataset.filter;
  if(!q){renderHome(mode);return}
  const terms=q.split(" ").filter(Boolean);
  if(mode==="repair"||mode==="home"){
    const r=repairs.map(e=>({...e,score:score(e.title+" "+(e.keywords||[]).join(" ")+" "+(e.steps||[]).join(" "),terms)})).filter(e=>e.score).sort((a,b)=>b.score-a.score);
    renderRepairResults(r);$("#status").textContent=r.length+" موضوع مرتبط";return;
  }
  let r=manual.map(e=>({...e,score:score((e.notes||"")+" "+(e.text||"")+" صفحه "+e.page,terms)})).filter(e=>e.score).sort((a,b)=>b.score-a.score);
  if(mode==="spec")r=r.filter(e=>/مشخصات|spec|torque|pressure|clearance|oil|mm|nm|psi|ولت|آمپر|مقدار/i.test((e.notes||"")+" "+e.text));
  renderManualResults(r);$("#status").textContent=r.length+" صفحه مرتبط";
}
function score(h,terms){const x=norm(h);let s=0;terms.forEach(t=>{if(x.includes(t))s+=x.indexOf(t)<120?3:1});return s}
function renderRepairResults(list){
  const box=$("#results");$("#detail").classList.add("hidden");box.classList.remove("hidden");
  if(!list.length){box.innerHTML='<div class="empty">موضوع مرتبط پیدا نشد.</div>';return}
  box.innerHTML='<div class="section-title"><h2>نتایج موضوعی</h2><p>برای دیدن توضیحات، روی موضوع بزن.</p></div>'+list.slice(0,30).map(e=>'<article class="result-card"><div class="eyebrow">موضوع</div><h2>'+esc(e.title)+'</h2><div class="tags">'+(e.keywords||[]).slice(0,5).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div><div class="result-meta">صفحات مرتبط: '+uniquePages(e.pages).join("، ")+'</div><button class="primary" data-topic="'+esc(e.id)+'">مشاهده توضیحات</button></article>').join("");
  box.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>showRepair(b.dataset.topic));
}
function renderManualResults(list){
  const box=$("#results");$("#detail").classList.add("hidden");box.classList.remove("hidden");
  if(!list.length){box.innerHTML='<div class="empty">نتیجه‌ای پیدا نشد.</div>';return}
  box.innerHTML='<div class="section-title"><h2>نتایج صفحات دفترچه</h2><p>ابتدا صفحه را انتخاب کن؛ متن کامل اینجا نمایش داده نمی‌شود.</p></div>'+list.slice(0,60).map(e=>'<article class="result-card"><div class="eyebrow">دفترچه</div><h2>صفحه '+e.page+'</h2><p class="result-title">'+esc(e.notes?e.notes.split("\n")[0]:"صفحه دفترچه")+'</p><button class="primary" data-page="'+e.page+'">مشاهده موضوع</button></article>').join("");
  box.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>showManualPage(b.dataset.page));
}
function renderHome(mode){
  if(mode==="repair"||mode==="home"){renderCategories();return}
  if(mode==="manual")renderManualResults(manual.slice(0,60));
  else renderManualResults(manual.filter(e=>/مشخصات|spec|torque|pressure|clearance|oil|mm|nm|psi|ولت|آمپر|مقدار/i.test((e.notes||"")+" "+e.text)).slice(0,60));
}
async function load(url){const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw Error(r.status);return r.json()}
async function init(){try{const[m,r,s]=await Promise.all([load("./data/manual-index.json?v=20261007"),load("./data/repair-index.json?v=20261007"),load("./data/repair-specs.json?v=20261007")]);manual=m.pages||m;repairs=Array.isArray(r)?r:r.entries||[];specs=Array.isArray(s)?s:s.entries||[];renderHome("home")}catch(e){$("#status").textContent="خطا در بارگذاری داده‌ها: "+e.message}}
$("#q").addEventListener("input",search);$("#q").addEventListener("keydown",e=>{if(e.key==="Enter")search()});$("#clear").onclick=()=>{$("#q").value="";search();$("#q").focus()};document.querySelectorAll(".filters button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#q").value="";renderHome(b.dataset.filter)});$("#pdfViewer").addEventListener("click",e=>{if(e.target.id==="pdfViewer")closePDF()});init();