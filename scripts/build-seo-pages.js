const fs = require("fs");
const path = require("path");

const root = process.cwd();
const site = path.join(root, "site");
const base = "https://behrooz64.github.io/Tnt-249-300";
const dataDir = path.join(site, "data");
const repairFile = path.join(dataDir, "repair-index.json");
const manualFile = path.join(dataDir, "manual-index.json");

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}
function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
}
function plain(value) {
  return String(value || "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ").trim();
}
function slug(value) {
  return String(value || "").toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
}
function pageTemplate({title, description, canonical, body, type = "TechArticle"}) {
  const desc = description.slice(0, 300);
  const jsonLd = {
    "@context":"https://schema.org",
    "@type":type,
    "headline":title,
    "description":desc,
    "inLanguage":"fa",
    "url":canonical,
    "isPartOf":{"@type":"WebSite","name":"راهنمای تعمیر Benelli TNT 249","url":base + "/"}
  };
  return `<!doctype html>
<html lang="fa" dir="rtl"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article"><meta property="og:locale" content="fa_IR">
<meta property="og:site_name" content="راهنمای تعمیر Benelli TNT 249">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g,"\\u003c")}</script>
<style>
:root{color-scheme:light;--ink:#17212b;--muted:#526171;--line:#dce3ea;--blue:#1458a6;--panel:#f5f8fb}
*{box-sizing:border-box}body{margin:0;background:#f7f9fc;color:var(--ink);font-family:Tahoma,Arial,sans-serif;line-height:2}
main{max-width:900px;margin:0 auto;padding:24px 16px 48px}.brand{font-size:.9rem;color:var(--muted)}article{background:#fff;border:1px solid var(--line);border-radius:16px;padding:clamp(18px,4vw,34px);margin:16px 0;box-shadow:0 5px 20px #17212b0a}
h1{font-size:clamp(1.5rem,4vw,2.15rem);line-height:1.5;margin:.35rem 0 1rem}h2{font-size:1.15rem;margin:1.5rem 0 .5rem}p{overflow-wrap:anywhere}a{color:var(--blue)}.meta{color:var(--muted);font-size:.9rem}.notice{background:#fff8e6;border-right:4px solid #d49a19;padding:12px 16px;border-radius:8px}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.actions a{display:inline-block;padding:8px 14px;border-radius:9px;background:var(--blue);color:white;text-decoration:none}.actions a.secondary{background:var(--panel);color:var(--ink);border:1px solid var(--line)}
ul{padding-right:1.3rem}footer{font-size:.85rem;color:var(--muted);padding:10px}
</style></head><body><main>
<div class="brand"><a href="${base}/">راهنمای تعمیر Benelli TNT 249</a> › راهنمای فنی</div>
<article><h1>${esc(title)}</h1><p class="meta">راهنمای فارسی تعمیر و عیب‌یابی موتورسیکلت بنلی TNT 249</p>
${body}
<div class="actions"><a href="${base}/">بازگشت به راهنمای کامل</a><a class="secondary" href="${base}/topics/">همه راهنماهای تعمیر</a></div>
</article>
<footer>این راهنما با ارجاع به دفترچه سرویس موجود تهیه شده است. منبع فعلی در بخش‌هایی مربوط به TNT300 است؛ مقادیر فنی را بدون تطبیق با TNT249 قطعی فرض نکنید.</footer>
</main></body></html>`;
}

const repair = readJson(repairFile, {entries:[]});
const manual = readJson(manualFile, {pages:[]});
const manualPagesAvailable = new Set((manual.pages || []).filter(p => (plain(p.notes).length + plain(p.text).length) >= 100).map(p => Number(p.page)));
const topicsDir = path.join(site, "topics");
fs.mkdirSync(topicsDir, {recursive:true});
const sitemap = new Set([base + "/", base + "/topics/"]);
const topicLinks = [];

for (const entry of (repair.entries || [])) {
  const id = slug(entry.id || entry.title);
  if (!id) continue;
  const dir = path.join(topicsDir, id);
  fs.mkdirSync(dir, {recursive:true});
  const canonical = base + "/topics/" + id + "/";
  const keywords = Array.isArray(entry.keywords) ? entry.keywords : [];
  const steps = Array.isArray(entry.steps) ? entry.steps : [];
  const pages = Array.isArray(entry.pages) ? [...new Set(entry.pages.map(Number).filter(p => Number.isFinite(p) && manualPagesAvailable.has(p)))] : [];
  const description = `${entry.title}: راهنمای فارسی بررسی، عیب‌یابی و مراجعه به صفحات مرتبط دفترچه تعمیر Benelli TNT 249. ${keywords.join("، ")}`;
  const body = `<p>${esc(entry.title)} یکی از موضوعات راهنمای تعمیراتی Benelli TNT 249 است. این صفحه مسیر بررسی اولیه و ارجاع به صفحات دفترچه را یک‌جا جمع می‌کند.</p>
${keywords.length ? `<h2>عبارت‌های مرتبط</h2><p>${esc(keywords.join("، "))}</p>` : ""}
${steps.length ? `<h2>مسیر بررسی پیشنهادی</h2><ol>${steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>` : ""}
${pages.length ? `<h2>صفحات مرتبط دفترچه</h2><ul>${pages.map(p=>`<li><a href="${base}/manual/page-${p}/">صفحه ${p} دفترچه</a></li>`).join("")}</ul><p class="meta">شماره‌ها برای یافتن بخش مرتبط در نسخه دفترچه هستند؛ لینک‌ها ممکن است در برنامه به صفحه داخلی هدایت شوند.</p>` : ""}
<p class="notice">هشدار مدل: مرجع اصلی بعضی اطلاعات، دفترچه TNT300 است. مشخصات و مقادیر را پیش از اجرا با نسخه دقیق TNT249 تطبیق دهید.</p>`;
  fs.writeFileSync(path.join(dir, "index.html"), pageTemplate({title:entry.title + " | راهنمای تعمیر Benelli TNT 249", description, canonical, body}));
  sitemap.add(canonical);
  topicLinks.push({title:entry.title, url:canonical, description});
}

const topicHubBody = `<p>راهنماهای موضوعی برای یافتن سریع مسیر عیب‌یابی و صفحات مرتبط دفترچه سرویس.</p><ul>${topicLinks.map(t=>`<li><a href="${t.url}">${esc(t.title)}</a> <span class="meta">، ${esc(t.description.slice(0,130))}</span></li>`).join("")}</ul>`;
fs.writeFileSync(path.join(topicsDir, "index.html"), pageTemplate({
  title:"راهنماهای تعمیر و عیب‌یابی Benelli TNT 249",
  description:"فهرست راهنماهای فارسی تعمیر و عیب‌یابی بنلی TNT 249 شامل استارت، برق، سوخت‌رسانی، ترمز، سوپاپ، روغن و خنک‌کاری.",
  canonical:base + "/topics/", body:topicHubBody, type:"CollectionPage"
}));

const manualDir = path.join(site, "manual");
fs.mkdirSync(manualDir, {recursive:true});
const manualLinks = [];
for (const page of (manual.pages || [])) {
  const number = Number(page.page);
  if (!Number.isInteger(number) || number < 1) continue;
  const notes = plain(page.notes);
  const extracted = plain(page.text);
  const meaningful = (notes.length + extracted.length) >= 100;
  if (!meaningful) continue;
  const id = "page-" + number;
  const canonical = base + "/manual/" + id + "/";
  const dir = path.join(manualDir, id);
  fs.mkdirSync(dir, {recursive:true});
  const title = `صفحه ${number} دفترچه تعمیر Benelli TNT 249`;
  const content = [
    notes ? `<h2>توضیحات فارسی</h2><p>${esc(notes)}</p>` : "",
    extracted ? `<h2>متن استخراج‌شده از دفترچه</h2><p>${esc(extracted)}</p>` : "",
    `<p class="meta">شماره صفحه مرجع: ${number}. منبع اصلی موجود برای این بخش از دفترچه سرویس TNT300 است و باید با TNT249 تطبیق داده شود.</p>`
  ].join("");
  fs.writeFileSync(path.join(dir, "index.html"), pageTemplate({
    title, description:`توضیحات فارسی و متن دفترچه تعمیر بنلی TNT 249، صفحه ${number}. مرجع فنی نیازمند تطبیق با مدل دقیق موتورسیکلت است.`,
    canonical, body:content
  }));
  sitemap.add(canonical);
  manualLinks.push({number, title, url:canonical});
}

const manualHubBody = `<p>صفحات دارای متن یا توضیح قابل جست‌وجو در نسخه دیجیتال دفترچه.</p><ul>${manualLinks.map(p=>`<li><a href="${p.url}">${esc(p.title)}</a></li>`).join("")}</ul>`;
fs.writeFileSync(path.join(manualDir, "index.html"), pageTemplate({
  title:"فهرست صفحات دفترچه تعمیر Benelli TNT 249",
  description:"فهرست صفحات دارای توضیحات فارسی و متن استخراج‌شده از دفترچه تعمیراتی بنلی.",
  canonical:base + "/manual/", body:manualHubBody, type:"CollectionPage"
}));
sitemap.add(base + "/manual/");

fs.writeFileSync(path.join(site, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...sitemap].sort().map(url => `  <url><loc>${esc(url)}</loc></url>`).join("\n") +
  '\n</urlset>\n');
fs.writeFileSync(path.join(site, "robots.txt"),
  'User-agent: *\nAllow: /\nSitemap: ' + base + '/sitemap.xml\n');
console.log(`SEO build: ${topicLinks.length} topic pages, ${manualLinks.length} manual pages, ${sitemap.size} sitemap URLs`);
