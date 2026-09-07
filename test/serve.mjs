/* Servidor estático mínimo para desenvolvimento (sem dependências). */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.argv[2] || 4173);
const ROOT = process.cwd();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    const filePath = normalize(join(ROOT, pathname));
    if (!filePath.startsWith(ROOT)) throw Object.assign(new Error("fora"), { code: "EFORBID" });

    let file = filePath;
    try {
      await stat(file);
    } catch {
      file = join(ROOT, "404.html");
      res.statusCode = 404;
    }
    const data = await readFile(file);
    res.writeHead(res.statusCode, {
      "Content-Type": MIME[extname(file)] || "application/octet-stream",
      "Cache-Control": file.includes("assets/images") ? "public, max-age=31536000, immutable" : "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end("erro");
  }
}).listen(PORT, () => console.log(`servindo em http://localhost:${PORT}`));