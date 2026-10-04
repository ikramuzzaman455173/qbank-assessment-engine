import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const body = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body), 0);

  return Buffer.concat([lenBuf, body, crcBuf]);
}

function createPng(width, height, getPixel) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdrChunk = makeChunk("IHDR", ihdrData);

  // Raw Scanlines
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData.writeUInt8(0, rowOffset); // filter type: None

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData.writeUInt8(r, pxOffset);
      rawData.writeUInt8(g, pxOffset + 1);
      rawData.writeUInt8(b, pxOffset + 2);
      rawData.writeUInt8(a, pxOffset + 3);
    }
  }

  const idatCompressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk("IDAT", idatCompressed);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function renderQBankIcon(x, y, size, isMaskable = false) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = isMaskable ? 0 : size * 0.22;

  // Check rounded rectangle bounds for non-maskable
  if (!isMaskable) {
    const dx = Math.abs(x - cx);
    const dy = Math.abs(y - cy);
    const half = size / 2;
    const cornerR = radius;
    const innerW = half - cornerR;
    const innerH = half - cornerR;

    if (dx > innerW && dy > innerH) {
      const dist = Math.hypot(dx - innerW, dy - innerH);
      if (dist > cornerR) {
        // Transparent outside rounded corner
        return [0, 0, 0, 0];
      }
    }
  }

  // Background Gradient (Deep slate: #1E293B -> #0F172A -> #020617)
  const t = (x + y) / (size * 2);
  let bgR = Math.round(30 * (1 - t) + 2 * t);
  let bgG = Math.round(41 * (1 - t) + 6 * t);
  let bgB = Math.round(59 * (1 - t) + 23 * t);

  // Ambient top-center glow (Indigo aura: #6366F1)
  const glowDist = Math.hypot(x - cx, y - size * 0.35);
  const glowRadius = size * 0.45;
  if (glowDist < glowRadius) {
    const glowIntensity = (1 - glowDist / glowRadius) * 0.35;
    bgR = Math.min(255, Math.round(bgR + 99 * glowIntensity));
    bgG = Math.min(255, Math.round(bgG + 102 * glowIntensity));
    bgB = Math.min(255, Math.round(bgB + 241 * glowIntensity));
  }

  // Normalize coordinates to 0..1 scale relative to center
  const scale = isMaskable ? 0.65 : 0.8;
  const nx = (x - cx) / (size * scale);
  const ny = (y - cy) / (size * scale);

  // Cap Diamond (Polygon: (0, -0.45), (0.45, -0.2), (0, 0.05), (-0.45, -0.2))
  const diamondA = Math.abs(nx) / 0.45 + (ny + 0.2) / 0.25;
  const diamondB = Math.abs(nx) / 0.45 - (ny + 0.2) / 0.25;

  const inDiamond =
    (diamondA <= 1 && diamondA >= -1 && diamondB <= 1 && diamondB >= -1) ||
    Math.abs(nx) / 0.45 + Math.abs(ny + 0.2) / 0.25 <= 1;

  if (inDiamond) {
    // Gradient on Cap: #38BDF8 -> #6366F1 -> #8B5CF6
    const capT = (nx + 0.45) / 0.9;
    const r = Math.round(56 * (1 - capT) + 139 * capT);
    const g = Math.round(189 * (1 - capT) + 92 * capT);
    const b = Math.round(248 * (1 - capT) + 246 * capT);
    return [r, g, b, 255];
  }

  // Skull cap lower arch / body
  if (ny >= -0.15 && ny <= 0.32 && Math.abs(nx) <= 0.32) {
    const bottomCurve = 0.15 + (1 - (nx / 0.32) ** 2) * 0.17;
    if (ny <= bottomCurve) {
      // Off-white / Ice slate body: #F8FAFC
      return [248, 250, 252, 255];
    }
  }

  // Tassel String & Knot
  if (Math.abs(nx - 0.34) <= 0.02 && ny >= -0.15 && ny <= 0.18) {
    return [56, 189, 248, 255]; // #38BDF8
  }
  if (Math.hypot(nx - 0.34, ny - 0.21) <= 0.04) {
    return [56, 189, 248, 255]; // Knot circle
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve("public");

// 1. pwa-192x192.png
const pwa192 = createPng(192, 192, (x, y, w, h) => renderQBankIcon(x, y, w, false));
fs.writeFileSync(path.join(publicDir, "pwa-192x192.png"), pwa192);
console.log("Generated pwa-192x192.png");

// 2. pwa-512x512.png
const pwa512 = createPng(512, 512, (x, y, w, h) => renderQBankIcon(x, y, w, false));
fs.writeFileSync(path.join(publicDir, "pwa-512x512.png"), pwa512);
console.log("Generated pwa-512x512.png");

// 3. pwa-maskable-512x512.png
const pwaMaskable = createPng(512, 512, (x, y, w, h) => renderQBankIcon(x, y, w, true));
fs.writeFileSync(path.join(publicDir, "pwa-maskable-512x512.png"), pwaMaskable);
console.log("Generated pwa-maskable-512x512.png");

// 4. apple-touch-icon.png (180x180)
const appleIcon = createPng(180, 180, (x, y, w, h) => renderQBankIcon(x, y, w, false));
fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), appleIcon);
console.log("Generated apple-touch-icon.png");
