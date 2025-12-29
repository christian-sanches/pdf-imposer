import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const publicDir = join(process.cwd(), 'public');

// Convert SVG to PNG
async function convertIcon(size) {
  const svgPath = join(publicDir, `icon-${size}.svg`);
  const pngPath = join(publicDir, `icon-${size}.png`);
  
  const svgBuffer = readFileSync(svgPath);
  
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(pngPath);
  
  console.log(`✓ Created icon-${size}.png`);
}

// Generate favicon sizes
async function generateFavicon() {
  const svgPath = join(publicDir, 'icon-512.svg');
  const svgBuffer = readFileSync(svgPath);
  
  // Generate different favicon sizes
  const faviconSizes = [16, 32, 48];
  
  for (const size of faviconSizes) {
    const faviconPath = join(publicDir, `favicon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(faviconPath);
    console.log(`✓ Created favicon-${size}x${size}.png`);
  }
  
  // Generate apple-touch-icon
  const appleTouchPath = join(publicDir, 'apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);
  console.log(`✓ Created apple-touch-icon.png`);
  
  // Generate favicon.ico (32x32 PNG saved as .ico)
  const faviconIcoPath = join(publicDir, 'favicon.ico');
  const faviconTempPath = join(publicDir, 'favicon-temp.png');
  
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconTempPath);
  
  const pngBuffer = readFileSync(faviconTempPath);
  writeFileSync(faviconIcoPath, pngBuffer);
  
  // Clean up temp file
  const fs = await import('fs/promises');
  await fs.unlink(faviconTempPath);
  
  console.log('✓ Created favicon.ico');
}

// Generate icons
(async () => {
  try {
    console.log('🎨 Generating app icons and favicons...\n');
    await convertIcon(192);
    await convertIcon(512);
    await generateFavicon();
    console.log('\n✅ All icons and favicons generated successfully!');
    console.log('\n📁 Generated files:');
    console.log('   - icon-192.png');
    console.log('   - icon-512.png');
    console.log('   - favicon-16x16.png');
    console.log('   - favicon-32x32.png');
    console.log('   - favicon-48x48.png');
    console.log('   - favicon.ico');
    console.log('   - apple-touch-icon.png');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
})();

