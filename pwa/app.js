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
    ["Preface",1],["Important Information in This Maintenance Manual",2],["User Guide",3],["Exhaust Emission Control Information",4],["Symbols",6],["Specific Symbols",6],["Symbol Interpretation",7],
    ["Content",8],["Contents",9],["Contents",10],["Contents",11],["Contents",12],["Contents",13],["Contents",14],
    ["Chapter I General Information",15],["General Safety",16],["Identification",17],["Motorcycle Identification",17],["Important Parts",18],
    ["Features",19],["Instruments and Lights",19],["Important Information",21],["Preparation for Disassembly and Disassembling Operation",21],
    ["Gaskets, O-rings, Seals and Bearings",22],["Lock Washer/locking plate, Bolt and Thread Sealant",23],["Circlips",23],
    ["Cable-To-Cable Connector Check",24],["Special Tools",26],["Chapter II Specification",31],["Basic Specifications",32],
    ["Technical Data of the Engine",33],["Technical Details of the Engine",36],["Technical Data of the Motorcycle",39],["Electrical Data",42],
    ["Technical Data of Nut Locking Torque",46],["Technical Data of Bolt and Screw Torque",47],
    ["Chapter III Check and Regular Adjustment",50],["Regular Maintenance and Lubrication Interval",51],
    ["Regular Maintenance and Lubrication Interval Schedule",52],["Air Filter",55],["Fuel Hose",58],["Control",59],
    ["Throttle Cable",60],["Clutch Cable",61],["Rearview Mirrors",62],["Engine Oil",63],["Engine Oil Filter",66],["Coolant",67],
    ["Radiator Hoses",68],["Spark Plugs",69],["Valve Clearance",73],["Brake Adjustment",77],["Check of Brake Fluid",79],
    ["Check of Brake Pads",84],["Check of Brake Hoses",85],["Adjustment of the Drive Chain",86],
    ["Check and Adjustment of the Steering Stem Bearings",88],["Check of Front Fork",91],["Check of Rear Shock Absorber",92],
    ["Check of Front and Rear Tires",93],["Check and Battery Charging",94],["Check of Fuses",101],
    ["Replacement of the Headlight Bulb",103],["Adjustment of the Headlight",105],
    ["Replacement of the Front Turn Signal Light Bulb",106],["Replacement of the Rear License Plate Light",107],
    ["Section IV Motorcycle",109],
    ["Front Wheel and Front Brake Rotor",110],["Rear Wheel and Rear Brake Rotor",119],["Front and Rear Brakes",128],
    ["Front and Rear Brakes / Front Brake Pads",130],["Front and Rear Brakes / Rear Brake Pads",131],
    ["Front and Rear Brakes / Front Brake",132],["Front and Rear Brakes / Front Brake",137],["Front Suspension",143],
    ["Front Suspension / Front Fork",144],["Front Suspension / Front Shock Absorber",145],["Control",155],["Control / Control",156],
    ["Control / Handlebar",159],["Rear Shock Absorber",163],["Drive Chain and Rear Swing Arm",167],["Drive Chain and Rear Swing Arm",168],
    ["Drive Chain and Rear Swing Arm / Rear Swing Arm",171],["Frame",174],["Frame / Engine Assembly",175],
    ["Frame / Rear License Plate Support",179],["Frame / Side Stand",182],["Frame / Left Foot Pedal",185],["Frame / Right Foot Pedal",188],
    ["Muffler",191],["Fairing / Cowling Parts",196],["Fairing / Cowling Parts / Front Fender",198],    ["Fairing / Cowling Parts / Rear Fender",201],["Assembly of Fairing / Cowling Parts / Rear Lower Fender and Chain Cover",205],
    ["Fairing / Cowling Parts / Fuel Tank Cowling and Lower Fairing",208],["Fairing / Cowling Parts / Tailsection",212],
    ["Fairing / Cowling Parts / Headlight Fairing",217],["Lights",220],["Lights / Rear Taillight",221],
    ["Lights / Front Turn Signal Light",222],["Lights / Rear Turn Signal Light",223],
    ["Chapter V Engine",224],["Cylinder Head and Cylinder Head Cover",225],["Exploded View",225],["Technical Parameters",227],
    ["Special Tools and Sealants",228],["Special Tools and Sealants",229],["Cylinder Head Cover",230],
    ["Camshaft Timing Chain Tensioner",232],["Camshaft and Camshaft Timing Chain",234],["Cylinder Head",240],["Valves",245],
    ["Intake Manifolds",256],["Clutch",257],["Breakdown Drawing",257],["Technical Parameters",258],
    ["Special Tools and Fastening Adhesives",259],["Right Engine Cover",260],["Clutch",262],["Engine Lubrication System",268],
    ["Breakdown Drawing",268],["Engine Oil Flow Diagram",270],["Technical Parameters",271],["Special Tools and Fastening Adhesives",272],
    ["Engine Oil and Engine Oil Filter",273],["Oil Pan",274],["Engine Oil Pump",276],["Engine Oil Pressure Relief Valve",278],
    ["Measurement of Engine Oil Pressure",279],["Engine Oil Pressure Switch",280],["Crankshaft / Transmission",282],["Breakdown Drawing",282],
    ["Technical Parameters",285],["Special Tools and Fastening Adhesives",288],["Crankcase",289],["Crankshaft and Connecting Rods",296],
    ["Pistons",309],["Electric Starter",315],["Gear Change Mechanism",319],["Chapter VI Cooling system",330],["Water Pump",333],
    ["Thermostat",337],["Coolant Hose Connectors",339],["Disassemble the Radiator",341],["Dismantle the Radiator",343],
    ["Radiator",344],["Fan",345],["Radiator Cap",347],["Water Temperature Sensor",348],["Radiator Assembly",349],
    ["Cooling Liquid Filling",350],["Chapter VII Fuel System",351],["Fuel System",352],["Fuel Tank",353],["Fuel Pump",359],
    ["Operating Principles of the Fuel Pump",359],["Fuel Pump Appearance",359],["Fuel Pump Composition",360],
    ["Tag and Identification Label of the Fuel Pump",360],["Working Environment of the Fuel Pump",361],
    ["Fuel Pump Maintenance Procedure",362],["Operation Precautions",365],["Throttle Body",366],
    ["Operating Principles of the Throttle Body",366],["Appearance of the Throttle Body",366],["Technical Parameters",367],
    ["Working Environment of the Throttle Body",367],["Disassembly of the Throttle Body",367],["Negative Pressure Balance of the Throttle Body",368],
    ["Throttle Body Cleaning Method",368],["Assembly of the Throttle Body",368],["Installation Cautions for the Throttle Body",368],
    ["Operation Cautions for the Throttle Body",368],["Fuel Injectors",369],["Operating Principles of the Fuel Injectors",369],
    ["Appearance of the Fuel Injectors",369],["Sealing O-ring of the Fuel Injectors",370],["Overvoltage Effects of the Fuel Injectors",371],
    ["Temperature Range of the Fuel Injectors",371],["Fuel Pollutants of the Fuel Injectors",371],["Wiring Harness Layout of the Fuel Injectors",371],
    ["Operation Cautions for the Fuel Injectors",372],["Installation Requirements for the Fuel Injectors",373],
    ["Fuel Injector Replacement Method",373],["Fuel Injector Selection",373],["Blockage of Fuel Injectors",374],
    ["Chapter VIII Electrical System",375],["Charging System",376],["Battery",377],["Stator / Generator",382],["Regulator / Rectifier",387],
    ["Ignition System",389],["Ignition Coil",390],["Crankshaft Position Sensor",398],["ECU",399],["Spark Plugs",400],
    ["Ignition System Troubleshooting",402],["Starting System",403],["Starter Motor",404],["Starter Relay",409],["Gauge Cluster",412],
    ["Gauge Cluster Disassembly",412],["Gauge Cluster and Indicator Lights",412],["Ignition Switch Disassembly",415],
    ["Ignition Switch Inspection",415],["Horn",416],["Disassembly",416],["Inspection",416],["Handlebar Switch (Chinese Market)",417],
    ["Handlebar Switch (US-STANDARD)",418],["Speedometer Sensor",419],["Disassembly of the Speedometer Sensor",419],
    ["Check of the Speedometer Sensor",419],["Speedometer Sensor Assembly",419],["Relay and Fuse-Block",420],["Relays",420],
    ["Fuse-Block",422],["Fuel Injection System",423],["Fuel Injection System / ECU",424],
    ["Fuel Injection System / Water Temperature Sensor",430],["Fuel Injection System / Intake Air Temperature Sensor",431],
    ["Fuel Injection System / Intake Manifold Pressure Sensor",433],["Fuel Injection System / Oxygen Sensor",435],
    ["Fuel Injection System / Idle Speed Stepper Motor",437],["Fuel Injection System / ECP",439],
    ["Chapter IX Faults and Troubleshooting",441],["Difficulty in Starting or Starting Failure",442],
    ["Poor Running (Especial at low speed)",443],["Poor Running (High speed)",444],
    ["Charging Defect (Over Discharging or Over Charging of the Battery Voltage)",445],["No Spark Diagnosis",446],
    ["Diagnosis Breakdown Maintenance of the Fuel Injection System",447],
    ["Directly Use The Fault Indicating Light Flashing Diagnosis (FI) on the Instrument",448],
    ["Using Diagnostic Apparatus for Fault Diagnosis",451],["Check the Faults With Diagnostic Software PCHUD",452],
    ["Common Trouble Shooting Methods of the Fuel Injection System",460],["Repair Kit",460],
    ["Engine Working Data Flow Indicated on the Diagnostic Apparatus",461],["Simple Troubleshooting Methods",461],
    ["Chapter X Appendices",465],["Wire Wrapping Method of the Cables, Wires and Hoses",466],
    ["TNT300 Circuit Diagram (Chinese Market)",487],["TNT300 Circuit Diagram (EURO-STANDARD)",488]
  ];
}
function showManualDirectory(lang){
  const fa=lang==="fa", box=$("#results");
  $("#detail").classList.add("hidden"); $("#pdfViewer").classList.add("hidden"); box.classList.remove("hidden");
  document.querySelectorAll(".filters-btn").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".manual-lang-btn").forEach(x=>x.classList.toggle("active",x.dataset.manualLang===lang));
  if(fa){
    const titleMap={
      "Preface":"پیشگفتار","Important Information in This Maintenance Manual":"اطلاعات مهم در این دفترچه تعمیر و نگهداری","User Guide":"راهنمای کاربر","Exhaust Emission Control Information":"اطلاعات کنترل انتشار آلاینده‌های اگزوز",
      "Symbols":"علائم","Specific Symbols":"علائم اختصاصی","Symbol Interpretation":"تفسیر علائم","Content":"محتوا",
      "Contents":"فهرست مطالب","Chapter I General Information":"فصل اول اطلاعات عمومی","General Safety":"ایمنی عمومی",
      "Identification":"شناسایی","Motorcycle Identification":"شناسایی موتورسیکلت","Important Parts":"قطعات مهم",
      "Features":"ویژگی‌ها","Instruments and Lights":"ابزارها و چراغ‌ها","Important Information":"اطلاعات مهم",
      "Preparation for Disassembly and Disassembling Operation":"آماده‌سازی برای بازکردن و عملیات دمونتاژ",
      "Gaskets, O-rings, Seals and Bearings":"واشرها، اورینگ‌ها، آب‌بندها و بلبرینگ‌ها",
      "Lock Washer/locking plate, Bolt and Thread Sealant":"واشر قفل‌کن، صفحه قفل، پیچ و چسب رزوه",
      "Circlips":"خارها","Cable-To-Cable Connector Check":"بررسی اتصال کابل به کابل","Special Tools":"ابزارهای مخصوص",
      "Chapter II Specification":"فصل دوم مشخصات","Basic Specifications":"مشخصات پایه","Technical Data of the Engine":"اطلاعات فنی موتور",
      "Technical Details of the Engine":"جزئیات فنی موتور","Technical Data of the Motorcycle":"اطلاعات فنی موتورسیکلت",
      "Electrical Data":"اطلاعات الکتریکی","Technical Data of Nut Locking Torque":"اطلاعات فنی گشتاور سفت‌کردن مهره‌ها",
      "Technical Data of Bolt and Screw Torque":"اطلاعات فنی گشتاور پیچ و پیچ‌ومهره","Chapter III Check and Regular Adjustment":"فصل سوم بازدید و تنظیمات دوره‌ای",
      "Regular Maintenance and Lubrication Interval":"فواصل سرویس و روانکاری دوره‌ای",
      "Regular Maintenance and Lubrication Interval Schedule":"جدول فواصل سرویس و روانکاری دوره‌ای",
      "Air Filter":"فیلتر هوا","Fuel Hose":"شلنگ سوخت","Fuel Hoses":"شلنگ‌های سوخت","Control":"کنترل‌ها",
      "Throttle Cable":"کابل گاز","Throttle Cables":"کابل‌های گاز","Clutch Cable":"کابل کلاچ","Rearview Mirrors":"آینه‌های جانبی",
      "Engine Oil":"روغن موتور","Engine Oil Filter":"فیلتر روغن موتور","Coolant":"مایع خنک‌کننده","Radiator Hoses":"شلنگ‌های رادیاتور",
      "Spark Plugs":"شمع‌ها","Valve Clearance":"لقی سوپاپ","Brake Adjustment":"تنظیم ترمز","Check of Brake Fluid":"بررسی روغن ترمز",
      "Brake Fluid Check":"بررسی روغن ترمز","Check of Brake Pads":"بررسی لنت ترمز","Brake Pad Check":"بررسی لنت ترمز",
      "Check of Brake Hoses":"بررسی شلنگ‌های ترمز","Brake Hose Check":"بررسی شلنگ ترمز","Adjustment of the Drive Chain":"تنظیم زنجیر انتقال قدرت",
      "Check and Adjustment of the Steering Stem Bearings":"بررسی و تنظیم بلبرینگ‌های محور فرمان",
      "Front Fork Inspection":"بازرسی دوشاخ جلو","Check of Front Fork":"بررسی دوشاخ جلو",
      "Rear Shock Absorber Inspection":"بازرسی کمک‌فنر عقب","Check of Rear Shock Absorber":"بررسی کمک‌فنر عقب",
      "Front and Rear Tire Inspection":"بازرسی لاستیک‌های جلو و عقب","Check of Front and Rear Tires":"بررسی لاستیک‌های جلو و عقب",
      "Battery Charging and Inspection":"شارژ و بررسی باتری","Check and Battery Charging":"بررسی و شارژ باتری","Fuse Check":"بررسی فیوزها",
      "Replacement of the Headlight Bulb":"تعویض لامپ چراغ جلو","Adjustment of the Headlight":"تنظیم چراغ جلو",
      "Replacement of the Front Turn Signal Light Bulb":"تعویض لامپ چراغ راهنمای جلو",
      "Replacement of the Front Turn Signal Lights":"تعویض چراغ‌های راهنمای جلو",
      "Replacement of the Rear License Plate Light":"تعویض چراغ پلاک عقب","Section IV Motorcycle":"بخش چهارم موتورسیکلت",
      "Front Wheel and Front Brake Rotor":"چرخ جلو و دیسک ترمز جلو","Rear Wheel and Rear Brake Rotor":"چرخ عقب و دیسک ترمز عقب",
      "Front and Rear Brakes":"ترمزهای جلو و عقب","Front and Rear Brakes / Front Brake Pads":"ترمزهای جلو و عقب / لنت ترمز جلو",
      "Front and Rear Brakes / Rear Brake Pads":"ترمزهای جلو و عقب / لنت ترمز عقب",
      "Front and Rear Brakes / Front Brake":"ترمزهای جلو و عقب / ترمز جلو","Front Suspension":"تعلیق جلو",
      "Front Suspension / Front Fork":"تعلیق جلو / دوشاخ جلو","Front Suspension / Front Shock Absorber":"تعلیق جلو / کمک‌فنر جلو",
      "Rear Shock Absorber":"کمک‌فنر عقب","Drive Chain and Rear Swing Arm":"زنجیر انتقال قدرت و بازوی نوسانی عقب",
      "Drive Chain and Rear Swing Arm / Rear Swing Arm":"زنجیر انتقال قدرت و بازوی نوسانی عقب / بازوی نوسانی عقب",
      "Frame":"شاسی","Frame / Engine Assembly":"شاسی / مجموعه موتور","Frame / Rear License Plate Support":"شاسی / پایه پلاک عقب",
      "Frame / Side Stand":"شاسی / جک بغل","Frame / Left Foot Pedal":"شاسی / جاپایی چپ","Frame / Right Foot Pedal":"شاسی / جاپایی راست",
      "Muffler":"اگزوز","Fairing / Cowling Parts":"قطعات فلاپ و قاب‌ها","Fairing / Cowling Parts / Front Fender":"قطعات فلاپ و قاب‌ها / گلگیر جلو",
      "Fairing / Cowling Parts / Rear Fender":"قطعات فلاپ و قاب‌ها / گلگیر عقب",
      "Assembly of Fairing / Cowling Parts / Rear Lower Fender and Chain Cover":"مونتاژ قطعات فلاپ و قاب‌ها / گلگیر پایین عقب و قاب زنجیر",      "Fairing / Cowling Parts / Fuel Tank Cowling and Lower Fairing":"قطعات فلاپ و قاب‌ها / قاب باک و فلاپ پایینی",
      "Fairing / Cowling Parts / Tailsection":"قطعات فلاپ و قاب‌ها / قسمت انتهایی بدنه",
      "Fairing / Cowling Parts / Headlight Fairing":"قطعات فلاپ و قاب‌ها / قاب چراغ جلو","Lights":"چراغ‌ها","Lights / Rear Taillight":"چراغ‌ها / چراغ عقب",
      "Lights / Front Turn Signal Light":"چراغ‌ها / چراغ راهنمای جلو","Lights / Rear Turn Signal Light":"چراغ‌ها / چراغ راهنمای عقب",
      "Chapter V Engine":"فصل پنجم موتور","Cylinder Head and Cylinder Head Cover":"سرسیلندر و درپوش سرسیلندر",
      "Exploded View":"نمای انفجاری","Technical Parameters":"پارامترهای فنی","Special Tools and Sealants":"ابزارهای مخصوص و مواد آب‌بندی",
      "Cylinder Head Cover":"درپوش سرسیلندر","Camshaft Timing Chain Tensioner":"سفت‌کن زنجیر تایم میل‌سوپاپ",
      "Camshaft and Camshaft Timing Chain":"میل‌سوپاپ و زنجیر تایم میل‌سوپاپ","Cylinder Head":"سرسیلندر","Valves":"سوپاپ‌ها",
      "Intake Manifolds":"منیفولدهای ورودی","Clutch":"کلاچ","Breakdown Drawing":"نمای تفکیکی",
      "Special Tools and Fastening Adhesives":"ابزارهای مخصوص و چسب‌های تثبیت‌کننده","Right Engine Cover":"درپوش راست موتور",
      "Engine Lubrication System":"سیستم روانکاری موتور","Engine Oil Flow Diagram":"نمودار جریان روغن موتور",
      "Engine Oil and Engine Oil Filter":"روغن موتور و فیلتر روغن موتور","Oil Pan":"کارتل روغن","Engine Oil Pump":"پمپ روغن موتور",
      "Engine Oil Pressure Relief Valve":"شیر اطمینان فشار روغن موتور","Measurement of Engine Oil Pressure":"اندازه‌گیری فشار روغن موتور",
      "Engine Oil Pressure Switch":"فشنگی فشار روغن موتور","Crankshaft / Transmission":"میل‌لنگ / گیربکس","Crankcase":"محفظه میل‌لنگ",
      "Crankshaft and Connecting Rods":"میل‌لنگ و شاتون‌ها","Pistons":"پیستون‌ها","Electric Starter":"استارت برقی","Gear Change Mechanism":"مکانیزم تعویض دنده",
      "Chapter VI Cooling system":"فصل ششم سیستم خنک‌کاری","Water Pump":"پمپ آب","Thermostat":"ترموستات","Coolant Hose Connectors":"اتصالات شلنگ‌های مایع خنک‌کننده",
      "Disassemble the Radiator":"باز کردن رادیاتور","Dismantle the Radiator":"دمونتاژ رادیاتور","Radiator":"رادیاتور","Fan":"فن",
      "Radiator Cap":"درپوش رادیاتور","Water Temperature Sensor":"سنسور دمای آب","Radiator Assembly":"مونتاژ رادیاتور","Cooling Liquid Filling":"پر کردن مایع خنک‌کننده",
      "Chapter VII Fuel System":"فصل هفتم سیستم سوخت","Fuel System":"سیستم سوخت","Fuel Tank":"باک سوخت","Fuel Pump":"پمپ سوخت",
      "Operating Principles of the Fuel Pump":"اصول عملکرد پمپ سوخت","Fuel Pump Appearance":"ظاهر پمپ سوخت","Fuel Pump Composition":"اجزای پمپ سوخت",
      "Tag and Identification Label of the Fuel Pump":"برچسب و پلاک شناسایی پمپ سوخت","Working Environment of the Fuel Pump":"شرایط کاری پمپ سوخت",
      "Fuel Pump Maintenance Procedure":"روش سرویس پمپ سوخت","Operation Precautions":"اقدامات احتیاطی هنگام کار","Throttle Body":"دریچه گاز",
      "Operating Principles of the Throttle Body":"اصول عملکرد دریچه گاز","Appearance of the Throttle Body":"ظاهر دریچه گاز",
      "Working Environment of the Throttle Body":"شرایط کاری دریچه گاز","Disassembly of the Throttle Body":"باز کردن دریچه گاز",
      "Negative Pressure Balance of the Throttle Body":"بالانس فشار منفی دریچه گاز","Throttle Body Cleaning Method":"روش تمیزکاری دریچه گاز",
      "Assembly of the Throttle Body":"مونتاژ دریچه گاز","Installation Cautions for the Throttle Body":"نکات نصب دریچه گاز",
      "Operation Cautions for the Throttle Body":"نکات کار با دریچه گاز","Fuel Injectors":"انژکتورهای سوخت",
      "Operating Principles of the Fuel Injectors":"اصول عملکرد انژکتورهای سوخت","Appearance of the Fuel Injectors":"ظاهر انژکتورهای سوخت",
      "Sealing O-ring of the Fuel Injectors":"اورینگ آب‌بندی انژکتورهای سوخت","Overvoltage Effects of the Fuel Injectors":"اثرات اضافه‌ولتاژ بر انژکتورهای سوخت",
      "Temperature Range of the Fuel Injectors":"محدوده دمایی انژکتورهای سوخت","Fuel Pollutants of the Fuel Injectors":"آلاینده‌های سوخت در انژکتورهای سوخت",
      "Wiring Harness Layout of the Fuel Injectors":"چیدمان دسته‌سیم انژکتورهای سوخت","Operation Cautions for the Fuel Injectors":"نکات کار با انژکتورهای سوخت",
      "Installation Requirements for the Fuel Injectors":"الزامات نصب انژکتورهای سوخت","Fuel Injector Replacement Method":"روش تعویض انژکتور سوخت",
      "Fuel Injector Selection":"انتخاب انژکتور سوخت","Blockage of Fuel Injectors":"گرفتگی انژکتورهای سوخت","Chapter VIII Electrical System":"فصل هشتم سیستم الکتریکی",
      "Charging System":"سیستم شارژ","Battery":"باتری","Stator / Generator":"استاتور / ژنراتور","Regulator / Rectifier":"رگولاتور / یکسوساز",
      "Ignition System":"سیستم جرقه‌زنی","Ignition Coil":"کویل جرقه","Crankshaft Position Sensor":"سنسور موقعیت میل‌لنگ","ECU":"ECU",
      "Ignition System Troubleshooting":"عیب‌یابی سیستم جرقه‌زنی","Starting System":"سیستم استارت","Starter Motor":"موتور استارت","Starter Relay":"رله استارت",
      "Gauge Cluster":"مجموعه آمپرها","Gauge Cluster Disassembly":"باز کردن مجموعه آمپرها","Gauge Cluster and Indicator Lights":"مجموعه آمپرها و چراغ‌های نشانگر",
      "Ignition Switch Disassembly":"باز کردن سوئیچ احتراق","Ignition Switch Inspection":"بررسی سوئیچ احتراق","Horn":"بوق","Disassembly":"دمونتاژ",
      "Inspection":"بازرسی","Handlebar Switch (Chinese Market)":"کلیدهای روی فرمان (بازار چین)","Handlebar Switch (US-STANDARD)":"کلیدهای روی فرمان (استاندارد آمریکا)",
      "Speedometer Sensor":"سنسور کیلومتر","Disassembly of the Speedometer Sensor":"باز کردن سنسور کیلومتر","Check of the Speedometer Sensor":"بررسی سنسور کیلومتر",
      "Speedometer Sensor Assembly":"مونتاژ سنسور کیلومتر","Relay and Fuse-Block":"رله و جعبه فیوز","Relays":"رله‌ها","Fuse-Block":"جعبه فیوز",
      "Fuel Injection System":"سیستم تزریق سوخت","Fuel Injection System / ECU":"سیستم تزریق سوخت / ECU",
      "Fuel Injection System / Water Temperature Sensor":"سیستم تزریق سوخت / سنسور دمای آب",
      "Fuel Injection System / Intake Air Temperature Sensor":"سیستم تزریق سوخت / سنسور دمای هوای ورودی",
      "Fuel Injection System / Intake Manifold Pressure Sensor":"سیستم تزریق سوخت / سنسور فشار منیفولد ورودی",
      "Fuel Injection System / Oxygen Sensor":"سیستم تزریق سوخت / سنسور اکسیژن",
      "Fuel Injection System / Idle Speed Stepper Motor":"سیستم تزریق سوخت / موتور استپر دور آرام",
      "Fuel Injection System / ECP":"سیستم تزریق سوخت / ECP","Chapter IX Faults and Troubleshooting":"فصل نهم عیب‌ها و عیب‌یابی",
      "Difficulty in Starting or Starting Failure":"سختی در استارت یا روشن نشدن موتور","Poor Running (Especial at low speed)":"بد کار کردن موتور (به‌ویژه در دور پایین)",
      "Poor Running (High speed)":"بد کار کردن موتور (دور بالا)","Charging Defect (Over Discharging or Over Charging of the Battery Voltage)":"نقص در شارژ (تخلیه بیش از حد یا شارژ بیش از حد ولتاژ باتری)",
      "No Spark Diagnosis":"عیب‌یابی نبود جرقه","Diagnosis Breakdown Maintenance of the Fuel Injection System":"تشخیص و عیب‌یابی سیستم تزریق سوخت",
      "Directly Use The Fault Indicating Light Flashing Diagnosis (FI) on the Instrument":"تشخیص مستقیم با چشمک‌زدن چراغ نشانگر خطا (FI) روی آمپر",
      "Using Diagnostic Apparatus for Fault Diagnosis":"استفاده از دستگاه عیب‌یاب برای تشخیص خطا",
      "Check the Faults With Diagnostic Software PCHUD":"بررسی خطاها با نرم‌افزار عیب‌یابی PCHUD",
      "Common Trouble Shooting Methods of the Fuel Injection System":"روش‌های رایج عیب‌یابی سیستم تزریق سوخت","Repair Kit":"کیت تعمیراتی",
      "Engine Working Data Flow Indicated on the Diagnostic Apparatus":"نمایش جریان داده‌های کاری موتور در دستگاه عیب‌یاب","Simple Troubleshooting Methods":"روش‌های ساده عیب‌یابی",
      "Chapter X Appendices":"فصل دهم پیوست‌ها","Wire Wrapping Method of the Cables, Wires and Hoses":"روش بستن و مهار سیم‌ها، کابل‌ها و شلنگ‌ها",
      "TNT300 Circuit Diagram (Chinese Market)":"نقشه مدار TNT300 (بازار چین)","TNT300 Circuit Diagram (EURO-STANDARD)":"نقشه مدار TNT300 (استاندارد اروپا)"
    };
    const entries=manualTocEntries();
    box.innerHTML='<div class="manual-directory"><div class="manual-directory-head"><div><h2>راهنمای کامل فارسی</h2></div><span class="manual-count">'+entries.length+' مورد</span></div><div class="manual-toc-list">'+entries.map(e=>{const pdfPage=Number(e[1]);const sourcePage=pdfPage+1;return '<button class="manual-toc-item" style="direction:rtl;grid-template-columns:auto 1fr;text-align:right" data-manual-page="'+sourcePage+'" data-manual-lang="fa"><strong>'+pdfPage+'</strong><span>'+esc(titleMap[e[0]]||e[0])+'</span></button>'}).join("")+'</div></div>';
  }else{
    const entries=manualTocEntries();
    box.innerHTML='<div class="manual-directory"><div class="manual-directory-head"><div><h2>فهرست راهنمای کامل انگلیسی</h2></div></div><div class="manual-toc-list">'+entries.map(e=>{const title=e[0],p=e[1],display=e[2]??p;return '<button class="manual-toc-item" data-manual-page="'+(Number(p)+1)+'" data-manual-lang="en"><span>'+esc(title)+'</span><strong>'+display+'</strong></button>'}).join("")+'</div></div>';
  }
  box.querySelectorAll("[data-manual-page]").forEach(b=>b.onclick=()=>showManualPage(b.dataset.manualPage,b.dataset.manualLang));
  setPageHeader(fa?"راهنمای کامل فارسی":"راهنمای کامل انگلیسی",fa?"راهنمای کامل فارسی":"راهنمای کامل انگلیسی");
  window.scrollTo({top:0,behavior:"smooth"});
}

function showManualPage(n,lang){
  const e=page(n); if(!e)return;
  const fa=lang==="fa", imgs=(e.images||[]).filter(Boolean);
  const displayPage=fa ? Math.max(1,Number(e.page)-1) : Number(e.page);
  const imageHtml=imgs.map(src=>'<img class="manual-page-image" src="'+imgPath(src)+'" alt="صفحه '+displayPage+'" loading="lazy">').join("");
  const body=fa
    ? '<section><h3>توضیحات فارسی</h3><div class="fa-note">'+esc(e.notes||"برای این صفحه توضیح فارسی ثبت نشده است.")+'</div></section><section><h3>تصاویر</h3><div class="manual-images">'+(imageHtml||'<div class="empty">تصویر موجود نیست.</div>')+'</div></section><section class="pdf-link"><h3>صفحه اصلی انگلیسی</h3><button class="pdf-btn" data-pdf="'+e.page+'">مشاهده صفحه PDF اصلی · '+displayPage+'</button></section>'
    : '<section><h3>صفحه اصلی دفترچه</h3><div class="manual-images">'+(imageHtml||'<div class="empty">تصویر این صفحه موجود نیست.</div>')+'</div></section>';
  $("#detail").innerHTML='<div class="detail-nav"><button class="home-page-btn" type="button" data-home><i class="bi bi-house-fill"></i><span>خانه</span></button><button class="back" id="backManual">← بازگشت</button></div><div class="detail-head"><div class="eyebrow">'+(fa?"راهنمای فارسی":"راهنمای انگلیسی")+'</div><h2>صفحه '+displayPage+'</h2></div>'+body;
  $("#results").classList.add("hidden"); $("#detail").classList.remove("hidden");
  $("#backManual").onclick=()=>showManualDirectory(lang);
  bindPDF(); setPageHeader("صفحه "+displayPage,(fa?"راهنمای کامل فارسی":"راهنمای کامل انگلیسی")+" › صفحه "+displayPage);
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
  if(!list.length){box.innerHTML='<div class="empty">موضوع مرتبط پیدا نشد.</div>';return}  box.innerHTML='<div class="section-title"><h2>نتایج موضوعی</h2><p>برای دیدن توضیحات، روی موضوع بزن.</p></div>'+list.slice(0,30).map(e=>'<article class="result-card"><div class="eyebrow">موضوع</div><h2>'+esc(e.title)+'</h2><div class="tags">'+(e.keywords||[]).slice(0,5).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div><div class="result-meta">صفحات مرتبط: '+uniquePages(e.pages).join("، ")+'</div><button class="primary" data-topic="'+esc(e.id)+'">مشاهده توضیحات</button></article>').join("");
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