import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const folders = [['..', 'public/images'], ['../academy-images', 'public/images/academy-images'], ['../workplace-images-v2', 'public/images/workplace-images-v2']];
const replacements = [];
let before = 0, after = 0;
for (const [folder, output] of folders) {
  for (const entry of await readdir(folder)) {
    if (!/\.(png|jpg)$/i.test(entry)) continue;
    if (entry === '17895671884741481851274366711128.jpg') continue;
    const source = await readFile(join(folder, entry));
    const target = entry.replace(/\.(png|jpg)$/i, '.webp');
    const optimized = await sharp(source).resize({width:1500,withoutEnlargement:true}).webp({quality:84}).toBuffer();
    await writeFile(join(output,target), optimized);
    replacements.push([entry,target]);before += source.length;after += optimized.length;
  }
}
for (const file of ['src/main.jsx','src/content.js','src/pages.jsx','src/components.jsx']) {
  let source = await readFile(file,'utf8');
  for (const [oldName,newName] of replacements) source = source.replaceAll(oldName,newName);
  await writeFile(file,source);
}
console.log(`Optimized ${replacements.length} photographs: ${(before/1024/1024).toFixed(1)} MB to ${(after/1024/1024).toFixed(1)} MB. Original supplied files preserved.`);
