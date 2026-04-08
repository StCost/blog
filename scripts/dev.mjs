import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

function runBuild() {
  const p = spawn(process.execPath, [path.join(root, "scripts", "build.mjs")], {
    stdio: "inherit",
    env: { ...process.env, BASE_PATH: "/" }
  });
  return new Promise((resolve, reject) => {
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`build failed: ${code}`))));
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

function serveFile(res, filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(buf);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

await runBuild();

// Rebuild on changes (simple watcher)
fs.watch(path.join(root, "content"), { recursive: true }, async () => {
  try {
    await runBuild();
  } catch {
    // keep serving last successful build
  }
});
fs.watch(path.join(root, "src"), { recursive: true }, async () => {
  try {
    await runBuild();
  } catch {
    // keep serving last successful build
  }
});

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];
  const safe = urlPath.replace(/\0/g, "");
  const tryPaths = [];

  if (safe.endsWith("/")) {
    tryPaths.push(path.join(distDir, safe, "index.html"));
  } else {
    tryPaths.push(path.join(distDir, safe));
    tryPaths.push(path.join(distDir, safe, "index.html"));
    tryPaths.push(path.join(distDir, safe + ".html"));
  }
  if (safe === "/") tryPaths.unshift(path.join(distDir, "index.html"));

  for (const p of tryPaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return serveFile(res, p);
    }
  }
  // fallback
  return serveFile(res, path.join(distDir, "404.html"));
});

const port = Number(process.env.PORT || 4173);
server.listen(port, "127.0.0.1", () => {
  console.log(`dev server: http://127.0.0.1:${port}/`);
});

