/**
 * Icon and Splash Screen Generator for PWA
 * 
 * This script generates all the required icon sizes for iOS, Android, and web.
 * Run with: node scripts/generate-icons.js
 * 
 * Prerequisites: npm install sharp (already in devDependencies)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Source image (should be at least 512x512)
const SOURCE_IMAGE = path.join(rootDir, 'public/favicon.png');
const OUTPUT_DIR = path.join(rootDir, 'public/icons');

// Icon sizes needed
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// iOS splash screen sizes (width x height)
const SPLASH_SCREENS = [
  { width: 640, height: 1136, name: 'splash-640x1136.png' },   // iPhone 5
  { width: 750, height: 1334, name: 'splash-750x1334.png' },   // iPhone 6/7/8
  { width: 1242, height: 2208, name: 'splash-1242x2208.png' }, // iPhone 6+/7+/8+
  { width: 1125, height: 2436, name: 'splash-1125x2436.png' }, // iPhone X/XS
  { width: 1170, height: 2532, name: 'splash-1170x2532.png' }, // iPhone 12/13
  { width: 1284, height: 2778, name: 'splash-1284x2778.png' }, // iPhone 12/13 Pro Max
];

// Theme colors
const LIGHT_BG = '#FFF9F5';
const PRIMARY_COLOR = '#E54B4B';

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🎨 Generating PWA icons...');

  // Check if source exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('❌ Source image not found:', SOURCE_IMAGE);
    console.log('Please ensure favicon.png exists in public/');
    process.exit(1);
  }

  // Get source image info
  const sourceInfo = await sharp(SOURCE_IMAGE).metadata();
  console.log(`📷 Source: ${sourceInfo.width}x${sourceInfo.height}`);

  // Generate standard icons
  for (const size of ICON_SIZES) {
    const filename = `icon-${size}x${size}.png`;
    await sharp(SOURCE_IMAGE)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 249, b: 245, alpha: 0 } })
      .png()
      .toFile(path.join(OUTPUT_DIR, filename));
    console.log(`✅ ${filename}`);
  }

  // Generate maskable icons (with padding for safe zone)
  // Maskable icons need ~40% padding so the logo isn't clipped
  for (const size of [192, 512]) {
    const filename = `icon-maskable-${size}x${size}.png`;
    const innerSize = Math.round(size * 0.6); // 60% of total size for logo
    
    // Create a background with padding
    const background = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 249, b: 245, alpha: 1 } // Light background
      }
    }).png().toBuffer();
    
    // Resize logo
    const logo = await sharp(SOURCE_IMAGE)
      .resize(innerSize, innerSize, { fit: 'contain' })
      .png()
      .toBuffer();
    
    // Composite logo onto background
    await sharp(background)
      .composite([{
        input: logo,
        gravity: 'center'
      }])
      .png()
      .toFile(path.join(OUTPUT_DIR, filename));
    console.log(`✅ ${filename} (maskable)`);
  }

  // Generate splash screens
  console.log('\n🌊 Generating splash screens...');
  
  for (const splash of SPLASH_SCREENS) {
    const logoSize = Math.min(splash.width, splash.height) * 0.3;
    
    // Create background
    const background = await sharp({
      create: {
        width: splash.width,
        height: splash.height,
        channels: 4,
        background: { r: 255, g: 249, b: 245, alpha: 1 }
      }
    }).png().toBuffer();
    
    // Resize logo for splash
    const logo = await sharp(SOURCE_IMAGE)
      .resize(Math.round(logoSize), Math.round(logoSize), { fit: 'contain' })
      .png()
      .toBuffer();
    
    // Composite
    await sharp(background)
      .composite([{
        input: logo,
        gravity: 'center'
      }])
      .png()
      .toFile(path.join(OUTPUT_DIR, splash.name));
    console.log(`✅ ${splash.name}`);
  }

  console.log('\n🎉 All icons generated successfully!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

generateIcons().catch(console.error);
