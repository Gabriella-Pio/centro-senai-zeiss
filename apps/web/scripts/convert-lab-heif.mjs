#!/usr/bin/env node
/**
 * Converte .heif/.heic em public/lab para JPEG de site.
 *
 * iPhone recente (HDR/grade) quebra o heif-convert do Debian
 * ("Too many auxiliary image references"). O script remove as refs
 * auxiliares, decodifica a foto principal e exporta JPEG q90
 * com lado maior ≤ 3200 px.
 *
 *   npm run convert:heif -w @cem/web
 *   node scripts/convert-lab-heif.mjs --force
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_DIR = join(ROOT, "public/lab");
const MAX_EDGE = 3200;
const JPEG_QUALITY = 90;

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dirArg = process.argv.find((a, i, all) => all[i - 1] === "--dir");
const inputDir = dirArg ? dirArg : DEFAULT_DIR;

function parseBoxes(buf, start = 0, end = buf.length) {
  const boxes = [];
  let off = start;
  while (off + 8 <= end) {
    let size = buf.readUInt32BE(off);
    const type = buf.subarray(off + 4, off + 8).toString("latin1");
    let hdr = 8;
    if (size === 1) {
      if (off + 16 > end) break;
      size = Number(buf.readBigUInt64BE(off + 8));
      hdr = 16;
    } else if (size === 0) {
      size = end - off;
    }
    if (size < hdr) break;
    boxes.push({ off, type, size, hdr });
    off += size;
  }
  return boxes;
}

function stripAuxiliaryRefs(buf) {
  const top = parseBoxes(buf);
  const meta = top.find((b) => b.type === "meta");
  if (!meta) return null;

  const metaBody = meta.off + meta.hdr + 4;
  const metaEnd = meta.off + meta.size;
  const children = parseBoxes(buf, metaBody, metaEnd);
  const pitm = children.find((b) => b.type === "pitm");
  const iref = children.find((b) => b.type === "iref");
  if (!pitm || !iref) return null;

  const pitmVer = buf[pitm.off + pitm.hdr];
  const pitmPayload = pitm.off + pitm.hdr + 4;
  const primaryId =
    pitmVer === 1 ? buf.readUInt32BE(pitmPayload) : buf.readUInt16BE(pitmPayload);

  const irefVer = buf[iref.off + iref.hdr];
  const idLen = irefVer === 1 ? 4 : 2;
  const irefEnd = iref.off + iref.size;
  const kept = [];
  let p = iref.off + iref.hdr + 4;
  while (p + 8 <= irefEnd) {
    const size = buf.readUInt32BE(p);
    const type = buf.subarray(p + 4, p + 8).toString("latin1");
    if (size < 8 || p + size > irefEnd) break;
    const fromId = idLen === 4 ? buf.readUInt32BE(p + 8) : buf.readUInt16BE(p + 8);
    if (type === "dimg" && fromId === primaryId) {
      kept.push(buf.subarray(p, p + size));
    }
    p += size;
  }

  if (!kept.length) return null;

  const header = Buffer.from(buf.subarray(iref.off, iref.off + iref.hdr + 4));
  const payload = Buffer.concat(kept);
  const newIrefSize = header.length + payload.length;
  if (newIrefSize > iref.size) return null;

  const out = Buffer.from(buf);
  header.writeUInt32BE(newIrefSize, 0);
  payload.copy(out, iref.off + header.length);
  header.copy(out, iref.off, 0, header.length);

  const freeLen = iref.size - newIrefSize;
  if (freeLen >= 8) {
    const freeOff = iref.off + newIrefSize;
    out.writeUInt32BE(freeLen, freeOff);
    out.write("free", freeOff + 4, 4, "ascii");
    out.fill(0, freeOff + 8, freeOff + freeLen);
  } else if (freeLen !== 0) {
    return null;
  }

  return out;
}

function runHeifConvert(src, destBase) {
  const result = spawnSync("heif-convert", ["-q", "95", src, `${destBase}.png`], {
    encoding: "utf8",
  });
  return {
    ok: result.status === 0,
    stderr: (result.stderr || result.stdout || "").trim(),
  };
}

function collectOutputs(tmp, prefix) {
  return readdirSync(tmp)
    .filter((name) => name.startsWith(prefix) && name.endsWith(".png"))
    .map((name) => join(tmp, name));
}

function listHeifFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listHeifFiles(path));
      continue;
    }
    const ext = extname(entry.name).toLowerCase();
    if (ext === ".heif" || ext === ".heic") out.push(path);
  }
  return out.sort();
}

async function exportJpeg(pngPath, dest) {
  const info = await sharp(pngPath)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toFile(dest);
  return info;
}

async function convertFile(src) {
  const dest = src.replace(/\.hei[fc]$/i, ".jpeg");
  if (!force) {
    try {
      if (statSync(dest).mtimeMs >= statSync(src).mtimeMs) {
        return { src, dest, skipped: true, reason: "jpeg já existe (use --force)" };
      }
    } catch {
      /* dest ausente */
    }
  }

  const tmp = mkdtempSync(join(tmpdir(), "lab-heif-"));
  const prefix = "frame";
  const base = join(tmp, prefix);
  try {
    let convert = runHeifConvert(src, base);
    if (!convert.ok) {
      const patched = stripAuxiliaryRefs(readFileSync(src));
      if (!patched) {
        return { src, dest, error: convert.stderr || "não foi possível simplificar o HEIF" };
      }
      const patchedPath = join(tmp, "simple.heif");
      writeFileSync(patchedPath, patched);
      convert = runHeifConvert(patchedPath, base);
      if (!convert.ok) {
        return { src, dest, error: convert.stderr || "heif-convert falhou após simplificar" };
      }
    }

    const pngs = collectOutputs(tmp, prefix);
    if (!pngs.length) return { src, dest, error: "heif-convert não gerou PNG" };

    let largest = pngs[0];
    let largestPixels = 0;
    for (const png of pngs) {
      const meta = await sharp(png).metadata();
      const pixels = (meta.width ?? 0) * (meta.height ?? 0);
      if (pixels > largestPixels) {
        largest = png;
        largestPixels = pixels;
      }
    }

    const info = await exportJpeg(largest, dest);
    return {
      src,
      dest,
      width: info.width,
      height: info.height,
      kb: Math.round(info.size / 1024),
    };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function whichHeifConvert() {
  const result = spawnSync("heif-convert", ["-h"], { encoding: "utf8" });
  return result.status === 0 || result.status === 1;
}

async function main() {
  if (!whichHeifConvert()) {
    console.error("heif-convert não encontrado. Instale: sudo apt install libheif-examples");
    process.exit(1);
  }

  const files = listHeifFiles(inputDir);
  if (!files.length) {
    console.log(`Nenhum .heif/.heic em ${inputDir}`);
    return;
  }

  console.log(`Convertendo ${files.length} arquivo(s) em ${relative(ROOT, inputDir) || "."}\n`);

  let failed = 0;
  for (const src of files) {
    const result = await convertFile(src);
    const label = relative(inputDir, result.src);
    if (result.skipped) {
      console.log(`• ${label} — ${result.reason}`);
      continue;
    }
    if (result.error) {
      failed += 1;
      console.error(`• ${label} — ERRO: ${result.error}`);
      continue;
    }
    console.log(
      `• ${label} → ${relative(inputDir, result.dest)}  ${result.width}×${result.height}  ${result.kb} KB`,
    );
  }

  if (failed) {
    console.error(`\n${failed} arquivo(s) falharam.`);
    process.exit(1);
  }

  console.log("\nPronto. Os .heif podem sair do public/ (fique com o master no Drive).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
