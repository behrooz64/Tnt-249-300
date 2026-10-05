const fs=require("fs"),path=require("path");
const root=path.join(process.cwd(),"docs/manual-pages");
const out=path.join(process.cwd(),"data/manual-index.json");
const pages=[];
for(let n=1;n<=488;n++){
  const id=String(n).padStart(4,"0");
  const file=path.join(root,"page-"+id+".md");
  if(!fs.existsSync(file)) continue;
  const md=fs.readFileSync(file,"utf8");
  const notes=(md.match(/## Persian notes\\n([\\s\\S]*?)(?=\\n## |$)/i)||[])[1]||"";
  const extracted=(md.match(/## Extracted text\\n([\\s\\S]*?)(?=\\n## |$)/i)||[])[1]||"";
  const title=(md.match(/^# Manual page .*?\\n\\n(?:>[^\\n]*\\n\\n)?(?:## [^\\n]+\\n)?(?:\\n)?/m)||[])[0]||"";
  const imgs=[...md.matchAll(/(?:!\\[[^\\]]*\\]|- )\\[([^\\]]+)\\]\\(([^)]+\\.(?:png|jpg|jpeg|webp))\\)/gi)].map(m=>m[2]).filter(Boolean);
  const pageImg='docs/images/pages/page-'+id+'.png';
  pages.push({page:n,title:"صفحه "+n,notes:notes.trim(),text:extracted.trim(),images:[pageImg,...imgs.map(x=>x.replace(/^\\.\\//,"docs/"))]});
}
fs.writeFileSync(out,JSON.stringify({version:"2.0.0",source:"Benelli TNT300 Service Manual",pages},null,2));
console.log("Indexed",pages.length,"pages");