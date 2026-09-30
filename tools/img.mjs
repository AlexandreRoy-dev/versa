import sharp from 'sharp';
for (const n of [1,2,3,4]) {
  const src = `../uploads/versa-photo-${n}.jpg`;
  const m = await sharp(src).metadata(); console.log(n, m.width, m.height);
  for (const w of [2000, 1200, 700]) {
    await sharp(src).resize({width:w}).webp({quality: w>1500?72:76}).toFile(`public/img/team-${n}-${w}.webp`);
  }
  await sharp(src).resize({width:600}).jpeg({quality:70}).toFile(`/tmp/prev-${n}.jpg`);
}
