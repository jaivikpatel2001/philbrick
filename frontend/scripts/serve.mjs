/* =============================================================================
   Static server for the exported site (`out/`).
   Zero dependencies — works offline. `next start` does NOT support
   `output: "export"`, so `npm run start` / `npm run preview` use this instead.

   Usage:  node scripts/serve.mjs [port]   (default 3000, or PORT env)
   Serves clean URLs (/about -> about.html), an index, and 404.html.

   ── COMPRESSION + CACHING (2026-07-25) ────────────────────────────────────────
   This file now emits the same Content-Encoding and Cache-Control/Expires
   headers as the production Apache config (public/.htaccess), because:

     * A Next.js static export cannot set response headers itself — `headers()`
       is an unsupported feature for `output: "export"`, and `compress` in
       next.config only applies to `next start` or a custom server. This file IS
       that custom server.
     * Render's static-site default is `Cache-Control: public, max-age=0,
       s-maxage=300` on EVERY asset, including the content-hashed, immutable
       files under /_next/static. That is what a Pingdom capture reports as
       "Add Expires headers: F". render.yaml fixes it for Blueprint deploys, but
       Render ignores that file for dashboard-created services. Running the
       service as a Node web service (`npm start`) instead makes the headers
       come from here, where they are version-controlled and cannot drift.

   Brotli is preferred when the client advertises it; gzip is the fallback, and
   is kept deliberately because Pingdom/YSlow grade on gzip specifically.
   Already-compressed payloads (images, woff2) are streamed as-is.
   ========================================================================== */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync, brotliCompressSync, constants as zlibConstants } from "node:zlib";

const ROOT = fileURLToPath(new URL("../out", import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 3000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

/* Text formats worth compressing. Everything else (webp/png/jpg/ico/woff2/mp4)
   is already compressed — running it through gzip costs CPU and can grow it. */
const COMPRESSIBLE = new Set([
  ".html", ".css", ".js", ".mjs", ".json", ".webmanifest", ".svg", ".txt", ".xml",
]);

/* Don't pay the compression cost on payloads too small to benefit (the gzip
   envelope alone is ~20 bytes and a single MTU is ~1500). */
const MIN_COMPRESS_BYTES = 1024;

const YEAR = 31536000;
const MONTH = 2592000;

/**
 * Cache policy, mirroring public/.htaccess and render.yaml exactly.
 *   /_next/static/*  content-hashed by the build      -> 1 year, immutable
 *   fonts            hashed by next/font              -> 1 year, immutable
 *   images / brand   stable names, can change on deploy -> 1 month
 *   html, RSC .txt, sitemap, robots, manifest         -> always revalidate
 */
function cachePolicy(urlPath, ext) {
  if (urlPath.startsWith("/_next/static/")) {
    return `public, max-age=${YEAR}, immutable`;
  }
  if (ext === ".woff2" || ext === ".woff") {
    return `public, max-age=${YEAR}, immutable`;
  }
  if (
    [".webp", ".avif", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".mp4", ".webm"]
      .includes(ext)
  ) {
    return `public, max-age=${MONTH}`;
  }
  return "public, max-age=0, must-revalidate";
}

/** Compressed bodies keyed by `file|encoding`; the export is immutable at run
 *  time, so each variant is built at most once per process. */
const cache = new Map();

function encodeBody(file, encoding, body) {
  const key = `${file}|${encoding}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const out =
    encoding === "br"
      ? brotliCompressSync(body, {
          params: {
            [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
            [zlibConstants.BROTLI_PARAM_SIZE_HINT]: body.length,
          },
        })
      : gzipSync(body, { level: 9 });
  cache.set(key, out);
  return out;
}

function negotiate(acceptEncoding, ext, size) {
  if (!COMPRESSIBLE.has(ext) || size < MIN_COMPRESS_BYTES) return null;
  const accept = (acceptEncoding || "").toLowerCase();
  if (accept.includes("br")) return "br";
  if (accept.includes("gzip")) return "gzip";
  return null;
}

async function resolveFile(urlPath) {
  const candidates = [urlPath, `${urlPath}.html`, join(urlPath, "index.html")];
  for (const c of candidates) {
    try {
      if ((await stat(c)).isFile()) return c;
    } catch {
      /* keep trying */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent((req.url || "/").split("?")[0]);
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

    /* Keep traversal inside out/ — normalize resolves any ".." before joining. */
    const safe = normalize(path).replace(/^([.]{2}[/\\])+/, "");
    const target = join(ROOT, safe === "/" || safe === sep ? "index.html" : safe);
    if (!target.startsWith(ROOT)) {
      res.statusCode = 403;
      res.end("403 Forbidden");
      return;
    }

    let file = await resolveFile(target);
    if (!file) {
      res.statusCode = 404;
      file = join(ROOT, "404.html");
    }

    const body = await readFile(file);
    const ext = extname(file);

    res.setHeader("Content-Type", TYPES[ext] || "application/octet-stream");
    res.setHeader("Cache-Control", cachePolicy(path, ext));
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Vary", "Accept-Encoding");

    const encoding = negotiate(req.headers["accept-encoding"], ext, body.length);
    if (encoding) {
      const encoded = encodeBody(file, encoding, body);
      res.setHeader("Content-Encoding", encoding);
      res.setHeader("Content-Length", encoded.length);
      res.end(req.method === "HEAD" ? undefined : encoded);
      return;
    }

    res.setHeader("Content-Length", body.length);
    res.end(req.method === "HEAD" ? undefined : body);
  } catch (err) {
    res.statusCode = 500;
    res.end(`500 Internal Server Error: ${err.message}`);
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is in use. Try: node scripts/serve.mjs <otherPort>`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`\n  Philbrick (static export) served from out/`);
  console.log(`  ➜  Local:  http://localhost:${PORT}`);
  console.log(`  Brotli/gzip + long-lived cache headers are ON.\n`);
  console.log(`  (Run \`npm run build\` first if out/ is missing or stale.)\n`);
});
