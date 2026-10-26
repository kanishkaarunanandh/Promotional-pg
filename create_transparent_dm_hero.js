import sharp from 'sharp';

async function processImage() {
  const inputPath = 'src/assets/digital marketing.png';
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const c = info.channels; // 4

  // Check if pixel is within the left man's white sneakers
  function isSneaker(x, y) {
    // Front sneaker body
    if (x >= 60 && x <= 265 && y >= 1315 && y <= 1444) {
      if (x < 115 && y < 1390) return false;
      if (x < 135 && y < 1335) return false;
      return true;
    }
    // Back sneaker body
    if (x >= 195 && x <= 342 && y >= 1250 && y <= 1416) {
      if (x > 310 && y < 1340) return false;
      if (x > 330 && y < 1375) return false;
      if (x < 240 && y > 1360) return false;
      return true;
    }
    return false;
  }

  const bgMask = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0, tail = 0;

  function isWhiteEnough(x, y) {
    if (isSneaker(x, y)) return false;
    const idx = (y * w + x) * c;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return r >= 236 && g >= 236 && b >= 236;
  }

  // 1. Seed from all 4 borders
  for (let x = 0; x < w; x++) {
    if (isWhiteEnough(x, 0)) { bgMask[0 * w + x] = 1; queue[tail++] = 0 * w + x; }
    if (isWhiteEnough(x, h - 1)) { bgMask[(h - 1) * w + x] = 1; queue[tail++] = (h - 1) * w + x; }
  }
  for (let y = 0; y < h; y++) {
    if (isWhiteEnough(0, y)) { bgMask[y * w + 0] = 1; queue[tail++] = y * w + 0; }
    if (isWhiteEnough(w - 1, y)) { bgMask[y * w + (w - 1)] = 1; queue[tail++] = y * w + (w - 1); }
  }

  // 2. Extra seeds for inner background gaps
  const extraSeeds = [
    [516, 1050], // between woman's legs
    [516, 950],
    [516, 1150],
    [697, 325],  // right man arm/neck gap
    [339, 630],  // left man pointing arm / torso gap
    [338, 585],
    [390, 1380], // between left man and woman's shoes
    [410, 1420],
    [520, 1370], // between woman's shoes
    [640, 1400], // between woman and right man's shoes
    [780, 1410], // between right man's shoes
  ];

  for (const [sx, sy] of extraSeeds) {
    const sPos = sy * w + sx;
    if (isWhiteEnough(sx, sy) && !bgMask[sPos]) {
      bgMask[sPos] = 1;
      queue[tail++] = sPos;
    }
  }

  // Breadth-First Search (BFS) flood fill
  while (head < tail) {
    const pos = queue[head++];
    const cx = pos % w;
    const cy = Math.floor(pos / w);

    const neighbors = [
      cx > 0 ? pos - 1 : -1,
      cx < w - 1 ? pos + 1 : -1,
      cy > 0 ? pos - w : -1,
      cy < h - 1 ? pos + w : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !bgMask[n]) {
        const nx = n % w;
        const ny = Math.floor(n / w);
        if (isWhiteEnough(nx, ny)) {
          bgMask[n] = 1;
          queue[tail++] = n;
        }
      }
    }
  }

  console.log('Background flood fill completed. Total bg pixels:', tail);

  // Create output RGBA buffer
  const out = Buffer.from(data);

  // Set alpha for all background pixels
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      const idx = p * c;
      if (bgMask[p]) {
        out[idx + 3] = 0; // 100% transparent
      }
    }
  }

  // Anti-aliasing pass: feather edges neighboring the transparent background
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (bgMask[p]) continue;

      const hasBgNeighbor =
        bgMask[p - 1] || bgMask[p + 1] ||
        bgMask[p - w] || bgMask[p + w] ||
        bgMask[p - w - 1] || bgMask[p - w + 1] ||
        bgMask[p + w - 1] || bgMask[p + w + 1];

      if (hasBgNeighbor) {
        const idx = p * c;
        const r = out[idx];
        const g = out[idx + 1];
        const b = out[idx + 2];
        const minVal = Math.min(r, g, b);

        if (minVal > 215) {
          const alphaFactor = Math.max(0, Math.min(1, (255 - minVal) / (255 - 215)));
          const newAlpha = Math.round(alphaFactor * 255);
          out[idx + 3] = Math.min(out[idx + 3], newAlpha);

          if (alphaFactor > 0.08) {
            const decontaminate = (val) =>
              Math.max(0, Math.min(255, Math.round((val - (1 - alphaFactor) * 255) / alphaFactor)));
            out[idx] = decontaminate(r);
            out[idx + 1] = decontaminate(g);
            out[idx + 2] = decontaminate(b);
          }
        }
      }
    }
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('src/assets/digital-marketing-hero.png');

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 95, effort: 6 })
    .toFile('src/assets/digital-marketing.webp');

  console.log('Done: saved transparent PNG and WebP');
}

processImage().catch(console.error);
