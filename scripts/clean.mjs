import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p)) {
    const full = path.join(p, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      rmrf(full);
      fs.rmdirSync(full);
    } else {
      fs.unlinkSync(full);
    }
  }
  fs.rmdirSync(p);
}

rmrf(distDir);

