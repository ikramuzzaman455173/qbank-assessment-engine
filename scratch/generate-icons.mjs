import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const publicDir = path.resolve("public");

// 1. High quality SVG template for main icons (solid squircle background)
const mainSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1E1B4B" />
    </linearGradient>

    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#6366F1" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.2" />
    </linearGradient>

    <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="45%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>

    <radialGradient id="ambientGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#6366F1" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#38BDF8" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#0B0F19" stop-opacity="0" />
    </radialGradient>

    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.6" />
    </filter>

    <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#38BDF8" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- Background Base with Rounded Squircle -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)" />

  <!-- Ambient Glow -->
  <rect width="512" height="512" rx="116" fill="url(#ambientGlow)" />

  <!-- Border Highlight -->
  <rect x="2" y="2" width="508" height="508" rx="114" fill="none" stroke="url(#borderGrad)" stroke-width="4" />

  <!-- Knowledge Sparkles -->
  <!-- Top Right Primary Sparkle -->
  <g filter="url(#sparkleGlow)">
    <path d="M 405 80 Q 405 108 433 108 Q 405 108 405 136 Q 405 108 377 108 Q 405 108 405 80 Z" fill="#38BDF8" />
    <circle cx="405" cy="108" r="3.5" fill="#FFFFFF" />
  </g>

  <!-- Top Left Secondary Sparkle -->
  <g opacity="0.85">
    <path d="M 108 118 Q 108 134 124 134 Q 108 134 108 150 Q 108 134 92 134 Q 108 134 108 118 Z" fill="#818CF8" />
    <circle cx="108" cy="134" r="2" fill="#FFFFFF" />
  </g>

  <!-- Main Graduation Cap & Knowledge Emblem -->
  <g filter="url(#shadow)">
    <!-- Skull Cap Body (Base) -->
    <path d="M 136 248 V 336 C 136 394 256 428 256 428 C 256 428 376 394 376 336 V 248 L 256 304 Z" fill="#F8FAFC" />
    
    <!-- Subtle Inner Cap Shading -->
    <path d="M 256 304 V 428 C 256 428 376 394 376 336 V 248 L 256 304 Z" fill="#E2E8F0" opacity="0.4" />

    <!-- Cap Diamond (Mortarboard Top) -->
    <path d="M 256 128 L 444 214 L 256 300 L 68 214 Z" fill="url(#capGrad)" />

    <!-- Diamond Edge Highlight -->
    <path d="M 256 128 L 444 214 L 256 300 L 68 214 Z" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="4.5" stroke-linejoin="round" />

    <!-- Cap Center Button -->
    <circle cx="256" cy="214" r="9" fill="#38BDF8" stroke="#FFFFFF" stroke-width="2" />

    <!-- Hanging Tassel Cord -->
    <path d="M 256 214 Q 380 226 406 250 T 414 340" fill="none" stroke="#38BDF8" stroke-width="7" stroke-linecap="round" />

    <!-- Tassel Knot -->
    <circle cx="414" cy="346" r="10" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />

    <!-- Tassel Fringe -->
    <path d="M 407 352 L 421 352 L 425 382 L 403 382 Z" fill="#38BDF8" />
  </g>
</svg>`;

// 2. Pure SVG Favicon (with responsive transparent / dark-light adaptability)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="favBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1E1B4B" />
    </linearGradient>

    <linearGradient id="favBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>

    <linearGradient id="favCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="45%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>

    <filter id="favShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Base Squircle -->
  <rect width="512" height="512" rx="116" fill="url(#favBgGrad)" />
  <rect x="2" y="2" width="508" height="508" rx="114" fill="none" stroke="url(#favBorderGrad)" stroke-width="6" />

  <!-- Top Right Knowledge Sparkle -->
  <path d="M 405 80 Q 405 108 433 108 Q 405 108 405 136 Q 405 108 377 108 Q 405 108 405 80 Z" fill="#38BDF8" />
  <circle cx="405" cy="108" r="4" fill="#FFFFFF" />

  <!-- Top Left Accent Sparkle -->
  <path d="M 108 118 Q 108 134 124 134 Q 108 134 108 150 Q 108 134 92 134 Q 108 134 108 118 Z" fill="#818CF8" opacity="0.9" />

  <!-- Graduation Cap Body -->
  <g filter="url(#favShadow)">
    <path d="M 136 248 V 336 C 136 394 256 428 256 428 C 256 428 376 394 376 336 V 248 L 256 304 Z" fill="#FFFFFF" />
    <path d="M 256 304 V 428 C 256 428 376 394 376 336 V 248 L 256 304 Z" fill="#E2E8F0" opacity="0.45" />

    <!-- Cap Diamond -->
    <path d="M 256 128 L 444 214 L 256 300 L 68 214 Z" fill="url(#favCapGrad)" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="4.5" stroke-linejoin="round" />

    <!-- Cap Button -->
    <circle cx="256" cy="214" r="9" fill="#38BDF8" stroke="#FFFFFF" stroke-width="2" />

    <!-- Tassel -->
    <path d="M 256 214 Q 380 226 406 250 T 414 340" fill="none" stroke="#38BDF8" stroke-width="7" stroke-linecap="round" />
    <circle cx="414" cy="346" r="10" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />
    <path d="M 407 352 L 421 352 L 425 382 L 403 382 Z" fill="#38BDF8" />
  </g>
</svg>`;

// 3. Maskable Icon SVG (with extra safe padding for circular clipping)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mbgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1E1B4B" />
    </linearGradient>

    <linearGradient id="mcapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="45%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>
  </defs>

  <!-- Full bleed background -->
  <rect width="512" height="512" fill="url(#mbgGrad)" />

  <!-- Scaled content inside safe zone (approx 78%) -->
  <g transform="translate(56, 56) scale(0.78)">
    <!-- Sparkles -->
    <path d="M 405 80 Q 405 108 433 108 Q 405 108 405 136 Q 405 108 377 108 Q 405 108 405 80 Z" fill="#38BDF8" />
    <path d="M 108 118 Q 108 134 124 134 Q 108 134 108 150 Q 108 134 92 134 Q 108 134 108 118 Z" fill="#818CF8" opacity="0.9" />

    <!-- Graduation Cap -->
    <path d="M 136 248 V 336 C 136 394 256 428 256 428 C 256 428 376 394 376 336 V 248 L 256 304 Z" fill="#FFFFFF" />
    <path d="M 256 128 L 444 214 L 256 300 L 68 214 Z" fill="url(#mcapGrad)" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="4.5" />
    <circle cx="256" cy="214" r="9" fill="#38BDF8" stroke="#FFFFFF" stroke-width="2" />
    <path d="M 256 214 Q 380 226 406 250 T 414 340" fill="none" stroke="#38BDF8" stroke-width="7" stroke-linecap="round" />
    <circle cx="414" cy="346" r="10" fill="#38BDF8" />
    <path d="M 407 352 L 421 352 L 425 382 L 403 382 Z" fill="#38BDF8" />
  </g>
</svg>`;

async function main() {
  console.log("Generating icons...");

  // Write SVGs
  await fs.writeFile(path.join(publicDir, "pwa-icon.svg"), mainSvg, "utf8");
  await fs.writeFile(path.join(publicDir, "favicon.svg"), faviconSvg, "utf8");
  console.log("✓ Created pwa-icon.svg & favicon.svg");

  const svgBuffer = Buffer.from(mainSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // Generate PNGs
  const pwa512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  await fs.writeFile(path.join(publicDir, "pwa-512x512.png"), pwa512);
  console.log("✓ Created pwa-512x512.png");

  const pwaMaskable512 = await sharp(maskableBuffer).resize(512, 512).png().toBuffer();
  await fs.writeFile(path.join(publicDir, "pwa-maskable-512x512.png"), pwaMaskable512);
  console.log("✓ Created pwa-maskable-512x512.png");

  const pwa192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  await fs.writeFile(path.join(publicDir, "pwa-192x192.png"), pwa192);
  console.log("✓ Created pwa-192x192.png");

  const appleTouch = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  await fs.writeFile(path.join(publicDir, "apple-touch-icon.png"), appleTouch);
  console.log("✓ Created apple-touch-icon.png");

  // Multi-size PNGs for ICO
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png64 = await sharp(svgBuffer).resize(64, 64).png().toBuffer();

  const icoBuffer = await pngToIco([png16, png32, png48, png64]);
  await fs.writeFile(path.join(publicDir, "favicon.ico"), icoBuffer);
  console.log("✓ Created favicon.ico (with 16, 32, 48, 64px multi-resolutions)");

  console.log("All icons successfully generated!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
