/* Crawl the running dev server and pull every visible text item, page by page,
   grouped by the section it sits in. Output feeds the content-audit workbook
   (scripts/buildContentAudit.py).

   Run the dev server first — in development every route is open regardless of
   config/pageReleases.ts, which is what makes a complete audit possible.

     node scripts/contentAuditCrawl.mjs http://localhost:3000
*/
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "content-audit");

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&middot;/g, "·")
    .replace(/&hellip;/g, "…")
    .replace(/&rsquo;/g, "’")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));

const clean = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Strip the bits that are not page content. */
function stripChrome(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
}

function headMeta(html) {
  const g = (re) => {
    const m = html.match(re);
    return m ? decode(m[1]).trim() : "";
  };
  return {
    title: g(/<title>([^<]*)<\/title>/i),
    description: g(/<meta name="description" content="([^"]*)"/i),
    ogTitle: g(/<meta property="og:title" content="([^"]*)"/i),
    ogDescription: g(/<meta property="og:description" content="([^"]*)"/i),
    canonical: g(/<link rel="canonical" href="([^"]*)"/i),
  };
}

/** Everything between <main> and </main>, chrome removed. */
function mainOnly(html) {
  const m = html.match(/<main[^>]*id="main"[^>]*>([\s\S]*?)<\/main>/i);
  return stripChrome(m ? m[1] : html);
}

/* Pull text-bearing elements in document order, tagging each with its type and
   the most recent heading above it, which is the section it belongs to. */
const TEXT_TAGS =
  /<(h1|h2|h3|h4|p|li|button|a|span|dt|dd|figcaption|th|td)\b([^>]*)>([\s\S]*?)<\/\1>/gi;

function extract(html) {
  const body = mainOnly(html);
  const items = [];
  let section = "Page";
  let eyebrow = "";
  for (const m of body.matchAll(TEXT_TAGS)) {
    const tag = m[1].toLowerCase();
    const attrs = m[2] || "";
    const text = clean(m[3]);
    if (!text || text.length > 1400) continue;
    /* Nested matches produce duplicates; keep the first occurrence of each
       (tag, text) pair per section. */
    const isEyebrow = /class="[^"]*eyebrow/.test(attrs);
    if (isEyebrow) {
      eyebrow = text;
      continue;
    }
    if (tag === "h1" || tag === "h2") {
      section = eyebrow ? `${eyebrow} — ${text}` : text;
      eyebrow = "";
      items.push({ section, type: tag === "h1" ? "Page title" : "Heading", text });
      continue;
    }
    const type =
      tag === "h3" || tag === "h4"
        ? "Subheading"
        : tag === "button"
          ? "Button"
          : tag === "a"
            ? "Link"
            : tag === "li"
              ? "List item"
              : tag === "th" || tag === "td"
                ? "Table cell"
                : "Paragraph";
    items.push({ section, type, text });
  }
  /* De-duplicate: nested tags repeat the same string. */
  const seen = new Set();
  return items.filter((it) => {
    const k = `${it.section}|${it.type}|${it.text}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function links(html) {
  const out = new Set();
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) out.add(m[1].replace(/\/$/, "") || "/");
  return [...out];
}

const SKIP = /^\/(variant\d+|_next|images|brand|api)/;

const pages = new Map();
const queue = ["/"];
const visited = new Set();

while (queue.length) {
  const path = queue.shift();
  if (visited.has(path) || SKIP.test(path)) continue;
  visited.add(path);
  let html;
  try {
    const res = await fetch(BASE + path);
    if (!res.ok) {
      console.error("skip", path, res.status);
      continue;
    }
    html = await res.text();
  } catch (e) {
    console.error("fail", path, e.message);
    continue;
  }
  pages.set(path, { path, meta: headMeta(html), items: extract(html) });
  for (const l of links(html)) if (!visited.has(l) && !SKIP.test(l)) queue.push(l);
  console.error("ok", path, pages.get(path).items.length, "items");
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  join(OUT_DIR, "crawl.json"),
  JSON.stringify([...pages.values()].sort((a, b) => a.path.localeCompare(b.path)), null, 1)
);
console.error("\npages:", pages.size);
