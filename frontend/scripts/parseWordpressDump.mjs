/* =============================================================================
   PARSE THE CLIENT'S WORDPRESS DUMP

   Reads an UpdraftPlus mysqldump into JSON rows so the real product content can
   be extracted instead of invented. Feeds scripts/generateCatalog.mjs.

   Usage:
     gzip -dc wordpress/wp-content/updraft/<...>-db.gz > db.sql
     node scripts/parseWordpressDump.mjs db.sql data/generated/parsed

   Two things the dump format demands:
     • UpdraftPlus writes `INSERT INTO \`tbl\` VALUES (...)` with NO column
       list, so the row shape has to be supplied here.
     • Values are MySQL-escaped, so a naive split on `),(` corrupts any content
       containing a comma, quote or newline.

   ENCODING: the dump is UTF-8 (utf8mb4 tables). It MUST be read as utf8 —
   reading it as latin1 decodes each byte separately and turns "≤" into "â‰¤",
   "–" into "â€“" and so on. That mojibake reached the live product pages once;
   generateCatalog.mjs now fails the build if it ever reappears.
   ========================================================================== */
import { readFileSync, writeFileSync } from "node:fs";

const SQL = readFileSync(process.argv[2] || "db.sql", "utf8");

/** Split a `(...),(...),(...)` VALUES tail into arrays of column values. */
function parseTuples(s, start) {
  const rows = [];
  let i = start;
  while (i < s.length) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    if (s[i] === ";" || s[i] !== "(") break;
    i++; // consume (
    const row = [];
    let cur = "";
    let inStr = false;
    let isNull = true;
    while (i < s.length) {
      const c = s[i];
      if (inStr) {
        if (c === "\\") {
          const n = s[i + 1];
          cur +=
            n === "n" ? "\n" : n === "r" ? "\r" : n === "t" ? "\t" :
            n === "0" ? "\0" : n;
          i += 2;
          continue;
        }
        if (c === "'") {
          if (s[i + 1] === "'") { cur += "'"; i += 2; continue; }
          inStr = false; i++; continue;
        }
        cur += c; i++; continue;
      }
      /* drop the whitespace that sits between the comma and the opening quote */
      if (c === "'") { inStr = true; isNull = false; cur = ""; i++; continue; }
      if (c === ",") { row.push(isNull && cur.trim() === "NULL" ? null : (isNull ? cur.trim() : cur)); cur = ""; isNull = true; i++; continue; }
      if (c === ")") { row.push(isNull && cur.trim() === "NULL" ? null : (isNull ? cur.trim() : cur)); i++; break; }
      cur += c; i++;
    }
    rows.push(row);
    while (i < s.length && /\s/.test(s[i])) i++;
    if (s[i] === ";") break;
  }
  return rows;
}

function table(name, columns) {
  const rows = [];
  /* UpdraftPlus dumps have no column list: INSERT INTO `tbl` VALUES (...) */
  const re = new RegExp("INSERT INTO `" + name + "` VALUES", "g");
  let m;
  while ((m = re.exec(SQL))) {
    for (const r of parseTuples(SQL, m.index + m[0].length)) {
      const o = {};
      columns.forEach((c, idx) => (o[c] = r[idx]));
      rows.push(o);
    }
  }
  return rows;
}

const POSTS = ["ID","post_author","post_date","post_date_gmt","post_content","post_title","post_excerpt","post_status","comment_status","ping_status","post_password","post_name","to_ping","pinged","post_modified","post_modified_gmt","post_content_filtered","post_parent","guid","menu_order","post_type","post_mime_type","comment_count"];
const META = ["meta_id","post_id","meta_key","meta_value"];
const TERMS = ["term_id","name","slug","term_group"];
const TT = ["term_taxonomy_id","term_id","taxonomy","description","parent","count"];
const TR = ["object_id","term_taxonomy_id","term_order"];

const posts = table("wp_posts", POSTS);
const meta = table("wp_postmeta", META);
const terms = table("wp_terms", TERMS);
const tt = table("wp_term_taxonomy", TT);
const tr = table("wp_term_relationships", TR);

const byType = {};
for (const p of posts) byType[p.post_type] = (byType[p.post_type] || 0) + 1;

console.log("posts:", posts.length, "meta:", meta.length, "terms:", terms.length);
console.log("post types:", JSON.stringify(byType, null, 1));

const out = process.argv[3] || "parsed";
writeFileSync(`${out}-posts.json`, JSON.stringify(posts));
writeFileSync(`${out}-meta.json`, JSON.stringify(meta));
writeFileSync(`${out}-terms.json`, JSON.stringify({ terms, tt, tr }));
console.log("wrote", out + "-*.json");
