from pathlib import Path
import re

source_dir = Path("docs/source")
image_index = Path("docs/images/index.md")
out_dir = Path("docs/manual-pages")
out_dir.mkdir(parents=True, exist_ok=True)

page_images = {}
if image_index.exists():
    for line in image_index.read_text(encoding="utf-8").splitlines():
        m = re.match(r"- Page (\d+):", line)
        if not m:
            continue
        page = int(m.group(1))
        rest = line.split(":", 1)[1].strip()
        parts = rest.split()
        if len(parts) >= 2:
            path = parts[0].strip(chr(96))
            kind = parts[1].strip("()")
            page_images.setdefault(page, []).append((path, kind))

count = 0
for src in sorted(source_dir.glob("page-*.md")):
    m = re.search(r"page-(\d+)\.md$", src.name)
    if not m:
        continue
    page = int(m.group(1))
    page_text = src.read_text(encoding="utf-8").strip()
    lines = [
        f"# Manual page {page}", "",
        f"> Source: [page-{page:04d}.md](../source/page-{page:04d}.md)", "",
        "## Page image / diagram", ""
    ]
    for path, kind in page_images.get(page, []):
        rel = "../" + path.removeprefix("docs/")
        if kind == "page-render":
            lines += [f"![Page {page} render]({rel})", ""]
        else:
            lines += [f"- [{Path(path).name}]({rel})", ""]
    lines += ["## Extracted text", "", page_text, "", "## Persian notes", "", "<!-- Persian translation/explanation will be added here. -->", ""]
    (out_dir / src.name).write_text("\n".join(lines), encoding="utf-8")
    count += 1

index_lines = ["# Benelli TNT300 Manual - Linked Pages", "", "Each page combines the extracted English text with the corresponding rendered page image and embedded images.", "", f"- Pages linked: {count}", "", "## Pages", ""]
for n in range(1, count + 1):
    index_lines.append(f"- [Page {n}](page-{n:04d}.md)")
(out_dir / "index.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")
print(f"Built {count} linked manual pages.")