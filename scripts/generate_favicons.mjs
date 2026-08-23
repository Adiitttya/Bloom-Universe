import sharp from "sharp";

async function makeCircleIcons() {
  const input = "./public/Bloom.jpg";
  const metadata = await sharp(input).metadata();
  const size = Math.min(metadata.width || 800, metadata.height || 800);

  // Create circular SVG mask
  const circleSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff" /></svg>`
  );

  // Generate circular image with transparent background
  const circularImage = await sharp(input)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: circleSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Generate 16x16, 32x32, 180x180, and favicon.ico
  await sharp(circularImage)
    .resize(16, 16)
    .png()
    .toFile("./public/favicon-16x16.png");
  await sharp(circularImage)
    .resize(32, 32)
    .png()
    .toFile("./public/favicon-32x32.png");
  await sharp(circularImage)
    .resize(180, 180)
    .png()
    .toFile("./public/apple-icon.png");
  await sharp(circularImage).resize(32, 32).toFile("./public/favicon.ico");

  console.log("✅ Circular favicons generated successfully!");
}

makeCircleIcons().catch(console.error);
