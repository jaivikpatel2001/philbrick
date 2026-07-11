/* =============================================================================
   Static preview server for the exported site (`out/`).
   Zero dependencies — works offline. `next start` does NOT support
   `output: "export"`, so `npm run start` uses this instead.

   Usage:  node scripts/serve.mjs [port]   (default 3000, or PORT env)
   Serves clean URLs (/about -> about.html), an index, and 404.html.
   ========================================================================== */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

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
};

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
    const target = join(ROOT, path === "/" ? "index.html" : path);

    let file = await resolveFile(target);
    if (!file) {
      res.statusCode = 404;
      file = join(ROOT, "404.html");
    }
    const body = await readFile(file);
    res.setHeader("Content-Type", TYPES[extname(file)] || "application/octet-stream");
    res.end(body);
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
  console.log(`  ➜  Local:  http://localhost:${PORT}\n`);
  console.log(`  (Run \`npm run build\` first if out/ is missing or stale.)\n`);
});
