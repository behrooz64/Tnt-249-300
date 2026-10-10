const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "site");
const base = "https://behrooz64.github.io/Tnt-249-300";
const sitemapPath = path.join(root, "sitemap.xml");
const textSitemapPath = path.join(root, "sitemap.txt");
const robotsPath = path.join(root, "robots.txt");
const errors = [];
const checked = [];
const seenCanonicals = new Map();

function fail(message) { errors.push(message); }
function fileForUrl(url) {
  if (url === base || url === base + "/") return path.join(root, "index.html");
  if (!url.startsWith(base + "/")) return null;
  const relative = decodeURIComponent(url.slice((base + "/").length));
  const clean = relative.split("?")[0].replace(/^\/+|\/+$/g, "");
  if (!clean) return path.join(root, "index.html");
  if (clean.endsWith(".xml") || clean.endsWith(".txt") || clean.endsWith(".html")) {
    return path.join(root, clean);
  }
  return path.join(root, clean, "index.html");
}
if (!fs.existsSync(sitemapPath)) fail("Missing sitemap.xml");
if (!fs.existsSync(textSitemapPath)) fail("Missing sitemap.txt");
if (!fs.existsSync(robotsPath)) fail("Missing robots.txt");

let urls = [];
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  if (!xml.includes("<urlset") || !xml.includes("</urlset>")) fail("Invalid sitemap XML envelope");
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  if (!urls.length) fail("Sitemap has no URLs");
  if (new Set(urls).size !== urls.length) fail("Sitemap contains duplicate URLs");
}
for (const url of urls) {
  const file = fileForUrl(url);
  if (!file) { fail("URL outside canonical site: " + url); continue; }
  if (!fs.existsSync(file)) { fail("Sitemap URL has no built HTML file: " + url + " -> " + path.relative(root, file)); continue; }
  const html = fs.readFileSync(file, "utf8");
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "";
  const description = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [])[1] || "";
  const canonical = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) || [])[1] || "";
  const robots = (html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i) || [])[1] || "";
  if (!/<html[^>]*lang=["']fa["']/i.test(html)) fail("Missing Persian html lang: " + url);
  if (title.trim().length < 12) fail("Missing/short title: " + url);
  if (description.trim().length < 50) fail("Missing/short meta description: " + url);
  const canonicalUrl = decodeURI(url);\n  if (canonical !== canonicalUrl) fail("Canonical mismatch: " + url + " -> " + canonical);
  if (!/index\s*,\s*follow/i.test(robots)) fail("Page not explicitly indexable: " + url);
  if (!html.includes('type="application/ld+json"')) fail("Missing structured data: " + url);
  if (!/<h1\b/i.test(html)) fail("Missing H1: " + url);
  if (canonical) {
    if (seenCanonicals.has(canonical)) fail("Duplicate canonical: " + canonical);
    seenCanonicals.set(canonical, url);
  }
  checked.push(url);
}
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes(base + "/sitemap.xml")) fail("robots.txt does not declare sitemap");
}
console.log("SEO audit: " + checked.length + " sitemap URLs checked; " + errors.length + " errors.");
if (errors.length) {
  for (const error of errors) console.error("ERROR: " + error);
  process.exit(1);
}
