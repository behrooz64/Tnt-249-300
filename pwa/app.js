const $=s=>document.querySelector(s);
function setPageHeader(title="صفحه اصلی", section="خانه"){
  const contentTitle=document.querySelector("#contentPageTitle");
  const contentCrumb=document.querySelector("#contentPageBreadcrumb");
  if(contentTitle) contentTitle.textContent=title;
  if(contentCrumb) contentCrumb.textContent=section;
}
function goHome(){
  const q=$("#q");
  if(q) q.value="";
  $("#detail")?.classList.add("hidden");
  $("#pdfViewer")?.classList.add("hidden");
  $("#results")?.classList.remove("hidden");
  document.body.classList.remove("modal-open");
  document.querySelectorAll(".filters .active").forEach(x=>x.classList.remove("active"));
  const homeFilter=document.querySelector('.filters button[data-filter="home"]');
  if(homeFilter) homeFilter.classList.add("active");
  document.querySelectorAll(".filters-btn").forEach(x=>x.classList.toggle("active",x.dataset.filter==="home"));
  renderHome("home");
  setPageHeader("راهنمای تعمیر Benelli TNT 249","خانه");
  window.scrollTo({top:0,behavior:"smooth"});
}

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
function bindPDF(){document.querySelectorAll("[data-pdf]").forEach(b=>b.onclick=()=>showPDF(b.dataset.pdf));document.querySelectorAll("[data-home]").forEach(b=>b.onclick=goHome)}
function renderCategories(){
  const groups=[
    ["موتور و مکانیک","🔧",["valve-compression","oil-pressure"]],
    ["سوخت و EFI","⛽",["fuel-pressure","throttle-tps-idle","injector","sensors-efi","crank-no-start","rough-low-rpm"]],
    ["خنک‌کاری","🌡️",["overheat"]],
    ["برق و استارت","⚡",["no-start","battery-charging","dtc"]],
    ["شاسی و ترمز","🛞",["brakes","chain-chassis"]]
  ];
  const map=new Map(repairs.map(x=>[x.id,x]));
  const box=$("#results");
  box.innerHTML=
  '<div class="home-topic-grid">'+groups.map(([name,icon,ids])=>{
    const valid=ids.map(id=>map.get(id)).filter(Boolean);
    return '<section class="category"><div class="category-head"><div class="category-title"><span class="category-icon" aria-hidden="true">'+icon+'</span><h2>'+esc(name)+'</h2></div><span class="category-count">'+valid.length+' موضوع</span></div><div class="topic-grid">'+valid.map(e=>'<button class="topic-card" data-topic="'+esc(e.id)+'"><span>'+esc(e.title)+'</span><small>'+uniquePages(e.pages).length+' صفحه مرتبط</small><i class="bi bi-chevron-left topic-arrow" aria-hidden="true"></i></button>').join("")+'</div></section>';
  }).join("")+'</div>';
  box.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>showRepair(b.dataset.topic));
  $("#status").textContent="";
}
function showRepair(id){
  const e=repairs.find(x=>x.id===id);if(!e)return;
  $("#detail").innerHTML='<div class="detail-nav"><button class="home-page-btn" type="button" data-home><i class="bi bi-house-fill"></i><span>خانه</span></button><button class="back" id="backDetail">← بازگشت به موضوعات</button><div class="detail-head"><div class="eyebrow">موضوع تعمیر</div><h2>'+esc(e.title)+'</h2><div class="tags">'+(e.keywords||[]).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div></div><section><h3>مسیر بررسی</h3><ol>'+(e.steps||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol></section><section><h3>صفحات مرتبط دفترچه</h3><div class="page-list">'+uniquePages(e.pages).map(p=>'<button class="page-chip" data-pdf="'+p+'">صفحه '+p+'</button>').join("")+'</div></section><section class="pdf-link"><h3>دفترچه اصلی</h3><p>برای دیدن خود صفحه، بدون توضیح اضافه:</p>'+pdfButtons(e.pages)+'</section>';
  $("#results").classList.add("hidden");$("#detail").classList.remove("hidden");$("#backDetail").onclick=closeDetail;bindPDF();
  setPageHeader(e.title,"تعمیرات › "+e.title);
  window.scrollTo({top:0,behavior:"smooth"});
}
function closeDetail(){$("#detail").classList.add("hidden");$("#results").classList.remove("hidden");renderHome("home");setPageHeader("راهنمای تعمیر Benelli TNT 249","خانه")}
function showManualPage(n){
  const e=page(n);if(!e)return;
  $("#detail").innerHTML='<div class="detail-nav"><button class="home-page-btn" type="button" data-home><i class="bi bi-house-fill"></i><span>خانه</span></button><button class="back" id="backDetail">← بازگشت</button><div class="detail-head"><div class="eyebrow">دفترچه</div><h2>صفحه '+e.page+'</h2></div><section><h3>توضیحات فارسی</h3><div class="fa-note">'+esc(e.notes||"برای این صفحه توضیح فارسی ثبت نشده است.")+'</div></section><section class="pdf-link"><h3>صفحه اصلی PDF</h3>'+pdfButtons([e.page])+'</section>';
  $("#results").classList.add("hidden");$("#detail").classList.remove("hidden");$("#backDetail").onclick=closeDetail;bindPDF();
  setPageHeader("صفحه "+e.page,"دفترچه › صفحه "+e.page);
  window.scrollTo({top:0,behavior:"smooth"});
}
function manualTocEntries(){
  return [
    ["Contents",9],
    ["Preface",1],["User Guide",3],["Exhaust Emission Control Information",4],["Symbols",5],["Specific Symbols",5],["Symbol Interpretation",6],
    ["Chapter I General Information",14],["General Safety",15],["Identification",16],["Motorcycle Identification",16],["Important Parts",17],
    ["Features",18],["Instruments and Lights",18],["Important Information",20],["Preparation for Disassembly and Disassembling Operation",20],
    ["Gaskets, O-rings, Seals and Bearings",21],["Lock Washer/locking plate, Bolt and Thread Sealant",22],["Circlips",22],
    ["Cable-To-Cable Connector Check",23],["Special Tools",25],["Chapter II Specification",30],["Basic Specifications",31],
    ["Technical Data of the Engine",32],["Technical Details of the Engine",35],["Technical Data of the Motorcycle",38],["Electrical Data",41],
    ["Technical Data of Nut Locking Torque",45],["Technical Data of Bolt and Screw Torque",46],
    ["Chapter III Check and Regular Adjustment",49],["Regular Maintenance and Lubrication Interval",50],
    ["Regular Maintenance and Lubrication Interval Schedule",51],["Air Filter",54],["Fuel Hose",57],["Control",58],
    ["Throttle Cable",59],["Clutch Cable",60],["Rearview Mirrors",61],["Engine Oil",62],["Engine Oil Filter",65],["Coolant",66],
    ["Radiator Hoses",67],["Spark Plugs",68],["Valve Clearance",72],["Brake Adjustment",76],["Check of Brake Fluid",78],
    ["Check of Brake Pads",83],["Check of Brake Hoses",84],["Adjustment of the Drive Chain",85],
    ["Check and Adjustment of the Steering Stem Bearings",87],["Check of Front Fork",90],["Check of Rear Shock Absorber",91],
    ["Check of Front and Rear Tires",92],["Check and Battery Charging",93],["Check of Fuses",100],
    ["Replacement of the Headlight Bulb",102],["Adjustment of the Headlight",104],
    ["Replacement of the Front Turn Signal Light Bulb",105],["Replacement of the Rear License Plate Light",106],
    ["Section IV Motorcycle",108],
    ["Front Wheel and Front Brake Rotor",109],["Rear Wheel and Rear Brake Rotor",118],["Front and Rear Brakes",127],
    ["Front and Rear Brakes / Front Brake Pads",129],["Front and Rear Brakes / Rear Brake Pads",130],
    ["Front and Rear Brakes / Front Brake",131],["Front and Rear Brakes / Front Brake",136],["Front Suspension",142],
    ["Front Suspension / Front Fork",143],["Front Suspension / Front Shock Absorber",144],["Control",154],["Control / Control",155],
    ["Control / Handlebar",158],["Rear Shock Absorber",162],["Drive Chain and Rear Swing Arm",166],["Drive Chain and Rear Swing Arm",167],
    ["Drive Chain and Rear Swing Arm / Rear Swing Arm",170],["Frame",173],["Frame / Engine Assembly",174],
    ["Frame / Rear License Plate Support",178],["Frame / Side Stand",181],["Frame / Left Foot Pedal",184],["Frame / Right Foot Pedal",187],
    ["Muffler",190],["Fairing / Cowling Parts",195],["Fairing / Cowling Parts / Front Fender",197],
    ["Fairing / Cowling Parts / Rear Fender",200],["Assembly of Fairing / Cowling Parts / Rear Lower Fender and Chain Cover",204],
    ["Fairing / Cowling Parts / Fuel Tank Cowling and Lower Fairing",207],["Fairing / Cowling Parts / Tailsection",211],
    ["Fairing / Cowling Parts / Headlight Fairing",216],["Lights",219],["Lights / Rear Taillight",220],
    ["Lights / Front Turn Signal Light",221],["Lights / Rear Turn Signal Light",222],
    ["Chapter V Engine",223],["Cylinder Head and Cylinder Head Cover",224],["Exploded View",224],["Technical Parameters",226],
    ["Special Tools and Sealants",227],["Special Tools and Sealants",228],["Cylinder Head Cover",229],
    ["Camshaft Timing Chain Tensioner",231],["Camshaft and Camshaft Timing Chain",233],["Cylinder Head",239],["Valves",244],
    ["Intake Manifolds",255],["Clutch",256],["Breakdown Drawing",256],["Technical Parameters",257],
    ["Special Tools and Fastening Adhesives",258],["Right Engine Cover",259],["Clutch",261],["Engine Lubrication System",267],
    ["Breakdown Drawing",267],["Engine Oil Flow Diagram",269],["Technical Parameters",270],["Special Tools and Fastening Adhesives",271],
    ["Engine Oil and Engine Oil Filter",272],["Oil Pan",273],["Engine Oil Pump",275],["Engine Oil Pressure Relief Valve",277],
    ["Measurement of Engine Oil Pressure",278],["Engine Oil Pressure Switch",279],["Crankshaft / Transmission",281],["Breakdown Drawing",281],
    ["Technical Parameters",284],["Special Tools and Fastening Adhesives",287],["Crankcase",288],["Crankshaft and Connecting Rods",295],
    ["Pistons",308],["Electric Starter",314],["Gear Change Mechanism",318],["Chapter VI Cooling system",329],["Water Pump",332],
    ["Thermostat",336],["Coolant Hose Connectors",338],["Disassemble the Radiator",340],["Dismantle the Radiator",342],
    ["Radiator",343],["Fan",344],["Radiator Cap",346],["Water Temperature Sensor",347],["Radiator Assembly",348],
    ["Cooling Liquid Filling",349],["Chapter VII Fuel System",350],["Fuel System",351],["Fuel Tank",352],["Fuel Pump",358],
    ["Operating Principles of the Fuel Pump",358],["Fuel Pump Appearance",358],["Fuel Pump Composition",359],
    ["Tag and Identification Label of the Fuel Pump",359],["Working Environment of the Fuel Pump",360],
    ["Fuel Pump Maintenance Procedure",361],["Operation Precautions",364],["Throttle Body",365],
    ["Operating Principles of the Throttle Body",365],["Appearance of the Throttle Body",365],["Technical Parameters",366],
    ["Working Environment of the Throttle Body",366],["Disassembly of the Throttle Body",366],["Negative Pressure Balance of the Throttle Body",367],
    ["Throttle Body Cleaning Method",367],["Assembly of the Throttle Body",367],["Installation Cautions for the Throttle Body",367],
    ["Operation Cautions for the Throttle Body",367],["Fuel Injectors",368],["Operating Principles of the Fuel Injectors",368],
    ["Appearance of the Fuel Injectors",368],["Sealing O-ring of the Fuel Injectors",369],["Overvoltage Effects of the Fuel Injectors",370],
    ["Temperature Range of the Fuel Injectors",370],["Fuel Pollutants of the Fuel Injectors",370],["Wiring Harness Layout of the Fuel Injectors",370],
    ["Operation Cautions for the Fuel Injectors",371],["Installation Requirements for the Fuel Injectors",372],
    ["Fuel Injector Replacement Method",372],["Fuel Injector Selection",372],["Blockage of Fuel Injectors",373],
    ["Chapter VIII Electrical System",374],["Charging System",375],["Battery",376],["Stator / Generator",381],["Regulator / Rectifier",386],
    ["Ignition System",388],["Ignition Coil",389],["Crankshaft Position Sensor",397],["ECU",398],["Spark Plugs",399],
    ["Ignition System Troubleshooting",401],["Starting System",402],["Starter Motor",403],["Starter Relay",408],["Gauge Cluster",411],
    ["Gauge Cluster Disassembly",411],["Gauge Cluster and Indicator Lights",411],["Ignition Switch Disassembly",414],
    ["Ignition Switch Inspection",414],["Horn",415],["Disassembly",415],["Inspection",415],["Handlebar Switch (Chinese Market)",416],
    ["Handlebar Switch (US-STANDARD)",417],["Speedometer Sensor",418],["Disassembly of the Speedometer Sensor",418],
    ["Check of the Speedometer Sensor",418],["Speedometer Sensor Assembly",418],["Relay and Fuse-Block",419],["Relays",419],
    ["Fuse-Block",421],["Fuel Injection System",422],["Fuel Injection System / ECU",423],
    ["Fuel Injection System / Water Temperature Sensor",429],["Fuel Injection System / Intake Air Temperature Sensor",430],
    ["Fuel Injection System / Intake Manifold Pressure Sensor",432],["Fuel Injection System / Oxygen Sensor",434],
    ["Fuel Injection System / Idle Speed Stepper Motor",436],["Fuel Injection System / ECP",438],
    ["Chapter IX Faults and Troubleshooting",440],["Difficulty in Starting or Starting Failure",441],
    ["Poor Running (Especial at low speed)",442],["Poor Running (High speed)",443],
    ["Charging Defect (Over Discharging or Over Charging of the Battery Voltage)",444],["No Spark Diagnosis",445],
    ["Diagnosis Breakdown Maintenance of the Fuel Injection System",446],
    ["Directly Use The Fault Indicating Light Flashing Diagnosis (FI) on the Instrument",447],
    ["Using Diagnostic Apparatus for Fault Diagnosis",450],["Check the Faults With Diagnostic Software PCHUD",451],
    ["Common Trouble Shooting Methods of the Fuel Injection System",459],["Repair Kit",459],
    ["Engine Working Data Flow Indicated on the Diagnostic Apparatus",460],["Simple Troubleshooting Methods",460],
    ["Chapter X Appendices",464],["Wire Wrapping Method of the Cables, Wires and Hoses",465],
    ["TNT300 Circuit Diagram (Chinese Market)",486],["TNT300 Circuit Diagram (EURO-STANDARD)",487]
  ];
}
function showManualDirectory(lang){
  const fa=lang==="fa", box=$("#results");
  $("#detail").classList.add("hidden"); $("#pdfViewer").classList.add("hidden"); box.classList.remove("hidden");
  document.querySelectorAll(".filters-btn").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".manual-lang-btn").forEach(x=>x.classList.toggle("active",x.dataset.manualLang===lang));
  if(fa){
    const pages=uniquePages(manual.map(x=>x.page));
    box.innerHTML='<div class="manual-directory"><div class="manual-directory-head"><div><div class="eyebrow">نسخه فارسی</div><h2>راهنمای کامل فارسی</h2><p>صفحات با توضیحات فارسی و تصاویر.</p></div><span class="manual-count">'+pages.length+' صفحه</span></div><div class="manual-page-grid">'+pages.map(p=>'<button class="manual-page-item" data-manual-page="'+p+'" data-manual-lang="fa">صفحه '+p+' <i class="bi bi-chevron-left"></i></button>').join("")+'</div></div>';
  }else{
    const entries=manualTocEntries();
    box.innerHTML='<div class="manual-directory"><div class="manual-directory-head"><div><h2>فهرست راهنمای کامل انگلیسی</h2></div></div><div class="manual-toc-list">'+entries.map(([title,p])=>'<button class="manual-toc-item" data-manual-page="'+p+'" data-manual-lang="en"><span>'+esc(title)+'</span><strong>'+p+'</strong></button>').join("")+'</div></div>';
  }
  box.querySelectorAll("[data-manual-page]").forEach(b=>b.onclick=()=>showManualPage(b.dataset.manualPage,b.dataset.manualLang));
  setPageHeader(fa?"راهنمای کامل فارسی":"راهنمای کامل انگلیسی",fa?"راهنمای کامل فارسی":"راهنمای کامل انگلیسی");
  window.scrollTo({top:0,behavior:"smooth"});
}

function showManualPage(n,lang){
  const e=page(n); if(!e)return;
  const fa=lang==="fa", imgs=(e.images||[]).filter(Boolean);
  const imageHtml=imgs.map(src=>'<img class="manual-page-image" src="'+imgPath(src)+'" alt="صفحه '+e.page+'" loading="lazy">').join("");
  const body=fa
    ? '<section><h3>توضیحات فارسی</h3><div class="fa-note">'+esc(e.notes||"برای این صفحه توضیح فارسی ثبت نشده است.")+'</div></section><section><h3>تصاویر</h3><div class="manual-images">'+(imageHtml||'<div class="empty">تصویر موجود نیست.</div>')+'</div></section><section class="pdf-link"><h3>صفحه اصلی انگلیسی</h3>'+pdfButtons([e.page])+'</section>'
    : '<section><h3>صفحه اصلی دفترچه</h3><div class="manual-images">'+(imageHtml||'<div class="empty">تصویر موجود نیست.</div>')+'</div></section>';
  $("#detail").innerHTML='<div class="detail-nav"><button class="home-page-btn" type="button" data-home><i class="bi bi-house-fill"></i><span>خانه</span></button><button class="back" id="backManual">← بازگشت</button></div><div class="detail-head"><div class="eyebrow">'+(fa?"راهنمای فارسی":"راهنمای انگلیسی")+'</div><h2>صفحه '+e.page+'</h2></div>'+body;
  $("#results").classList.add("hidden"); $("#detail").classList.remove("hidden");
  $("#backManual").onclick=()=>showManualDirectory(lang);
  bindPDF(); setPageHeader("صفحه "+e.page,(fa?"راهنمای کامل فارسی":"راهنمای کامل انگلیسی")+" › صفحه "+e.page);
  window.scrollTo({top:0,behavior:"smooth"});
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
document.querySelectorAll(".manual-lang-btn").forEach(b=>b.onclick=()=>showManualDirectory(b.dataset.manualLang));
$("#q").addEventListener("input",search);$("#q").addEventListener("keydown",e=>{if(e.key==="Enter")search()});$("#clear").onclick=()=>{$("#q").value="";search();$("#q").focus()};document.querySelectorAll(".filters button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#q").value="";renderHome(b.dataset.filter)});$("#pdfViewer").addEventListener("click",e=>{if(e.target.id==="pdfViewer")closePDF()});init();