const fs=require("fs"),path=require("path");
const root=path.join(process.cwd(),"docs/manual-pages");
const out=path.join(process.cwd(),"data/manual-index.json");
const pages=[];

function normalizeImagePath(raw){
  const clean=String(raw||"").trim().replace(/\\/g,"/").replace(/^\.\//,"");
  if(!clean) return "";
  if(/^https?:\/\//i.test(clean) || clean.startsWith("data:")) return clean;
  if(clean.startsWith("/docs/")) return clean.slice(1);
  if(clean.startsWith("docs/")) return clean;
  return path.posix.normalize(path.posix.join("docs/manual-pages",clean));
}

for(let n=1;n<=488;n++){
  const id=String(n).padStart(4,"0");
  const file=path.join(root,"page-"+id+".md");
  if(!fs.existsSync(file)) continue;

  const md=fs.readFileSync(file,"utf8");

  // Persian notes are the final section of each page file. Do not truncate
  // them merely because the translation contains Markdown headings.
  const notes=(md.match(/## Persian notes\s*\n([\s\S]*)$/i)||[])[1]||"";
  const extracted=(md.match(/## Extracted text\s*\n([\s\S]*?)(?=\n## Persian notes\b|$)/i)||[])[1]||"";

  // Read every Markdown image/link target, including .jpeg files.
  const imgs=[...md.matchAll(/!?(?:\[[^\]]*\])\(([^)\s]+\.(?:png|jpe?g|webp)(?:\?[^)]*)?)\)/gi)]
    .map(m=>normalizeImagePath(m[1]))
    .filter(Boolean);

  const pageImg="docs/images/pages/page-"+id+".png";
  const images=[pageImg,...imgs.filter(x=>x!==pageImg)];
  
  pages.push({
    page:n,
    title:"صفحه "+n,
    notes:notes.trim(),
    text:extracted.trim(),
    images
  });
}

fs.writeFileSync(
  out,
  JSON.stringify(
    {version:"2.1.0",source:"Benelli TNT300 Service Manual",pages},
    null,
    2
  )
);

console.log("Indexed",pages.length,"pages");