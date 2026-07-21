/* Audit the client's WordPress PAGES: how much real content each one carries,
   and whether it is plain HTML or locked inside Elementor JSON. */
import { readFileSync, writeFileSync } from "node:fs";

const posts = JSON.parse(readFileSync("parsed-posts.json", "utf8"));
const meta = JSON.parse(readFileSync("parsed-meta.json", "utf8"));

const metaBy = new Map();
for (const m of meta) {
  if (!metaBy.has(m.post_id)) metaBy.set(m.post_id, {});
  metaBy.get(m.post_id)[m.meta_key] = m.meta_value;
}

const text = (html) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const pages = posts
  .filter((p) => p.post_type === "page" && p.post_status === "publish")
  .map((p) => {
    const m = metaBy.get(p.ID) || {};
    const elementor = m._elementor_data || "";
    /* Elementor stores the visible copy as JSON; pull the text-bearing fields */
    const elText = [
      ...elementor.matchAll(/"(?:title|editor|text|description_text|title_text)":"((?:[^"\\]|\\.)*)"/g),
    ]
      .map((x) => text(x[1].replace(/\\n/g, " ").replace(/\\"/g, '"')))
      .filter((s) => s.length > 2);

    return {
      id: p.ID,
      title: p.post_title,
      slug: p.post_name,
      htmlChars: text(p.post_content).length,
      elementorBlocks: elText.length,
      elementorChars: elText.join(" ").length,
      body: text(p.post_content),
      elementor: elText,
    };
  })
  .sort((a, b) => b.htmlChars + b.elementorChars - (a.htmlChars + a.elementorChars));

writeFileSync("pages.json", JSON.stringify(pages, null, 2));

console.log("slug".padEnd(26), "html".padStart(7), "elem".padStart(7), "blocks".padStart(7));
for (const p of pages)
  console.log(
    p.slug.slice(0, 24).padEnd(26),
    String(p.htmlChars).padStart(7),
    String(p.elementorChars).padStart(7),
    String(p.elementorBlocks).padStart(7)
  );
console.log("\n-> pages.json");
