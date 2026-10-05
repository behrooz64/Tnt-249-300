const $=s=>document.querySelector(s);
let entries=[];

const norm=s=>String(s||"")
  .toLowerCase()
  .replace(/[يى]/g,"ی")
  .replace(/ك/g,"ک")
  .replace(/ۀ/g,"ه")
  .replace(/[\u200c\u200d]/g," ")
  .replace(/[،؛:؟!.,;:()\[\]{}\/\\]/g," ")
  .replace(/\s+/g," ")
  .trim();

function pageLink(p){
  return "./docs/manual-pages/page-"+String(p).padStart(4,"0")+".md";
}

function render(list,query=""){
  const box=$("#results");
  box.innerHTML="";
  if(!list.length){
    box.innerHTML="<div class='empty'>نتیجه‌ای پیدا نشد. عبارت را ساده‌تر کنید یا از کلمات مشکل مثل «استارت»، «ریپ»، «داغ» یا «ترمز» استفاده کنید.</div>";
  }else{
    list.forEach(e=>{
      const pages=[...new Set(e.pages||[])].sort((a,b)=>a-b);
      const article=document.createElement("article");
      article.innerHTML=
        "<h2>"+e.title+"</h2>"+
        "<div class='tags'>"+(e.keywords||[]).map(k=>"<span>"+k+"</span>").join("")+"</div>"+
        "<h3>مسیر بررسی</h3><ol>"+(e.steps||[]).map(x=>"<li>"+x+"</li>").join("")+"</ol>"+
        "<h3>صفحات مرجع</h3><div class='pages'>"+
        pages.map(p=>"<a target='_blank' rel='noopener' href='"+pageLink(p)+"'>p"+p+"</a>").join(" ")+"</div>";
      box.appendChild(article);
    });
  }
  $("#status").textContent=query
    ? (list.length+" مسیر مرتبط پیدا شد.")
    : (entries.length+" مسیر تعمیراتی آماده است.");
}

function search(){
  const q=norm($("#q").value);
  if(!q){render(entries,"");return;}
  const terms=q.split(" ").filter(Boolean);
  const scored=entries.map(e=>{
    const title=norm(e.title);
    const keywords=norm((e.keywords||[]).join(" "));
    const steps=norm((e.steps||[]).join(" "));
    const hay=title+" "+keywords+" "+steps;
    let score=0;
    terms.forEach(t=>{
      if(title.includes(t)) score+=6;
      else if(keywords.includes(t)) score+=3;
      else if(steps.includes(t)) score+=1;
    });
    return {...e,score};
  }).filter(e=>e.score>0).sort((a,b)=>b.score-a.score);
  render(scored,$("#q").value);
}

async function init(){
  try{
    const r=await fetch("./data/repair-index.json",{cache:"no-store"});
    if(!r.ok) throw new Error("HTTP "+r.status);
    const data=await r.json();
    entries=Array.isArray(data)?data:(data.entries||[]);
    render(entries,"");
  }catch(e){
    $("#status").textContent="خطا در بارگذاری پایگاه تعمیرات: "+e.message;
    console.error(e);
  }
}

$("#q").addEventListener("input",search);
$("#q").addEventListener("keydown",e=>{if(e.key==="Enter")search();});
$("#clear").onclick=()=>{$("#q").value="";render(entries,"");$("#q").focus();};
init();