// Makes web-sized copies of everything in Photos/ and keeps src/photos.json in sync.
//
//   npm run photos
//
// - Originals in Photos/ are never changed (and never uploaded to GitHub).
// - Copies go to src/assets/photos/, at most 2400px on the long side, with
//   camera metadata (including GPS location) removed.
// - New photos are added to src/photos.json using the date and caption from the
//   file name, e.g. "2024-08 Camel on Mt Sinai.jpg". Entries already in that file
//   keep whatever captions and order you've given them.

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const sourceDir = path.join(root, 'Photos');
const outDir = path.join(root, 'src/assets/photos');
const listFile = path.join(root, 'src/photos.json');

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function parseName(file) {
  const base = path.parse(file).name;
  const m = base.match(/^(\d{4})(?:-(\d{2}))?[\s,_-]*(.*)$/);
  if (!m) return { date: '', caption: base.trim() };
  const [, year, month, rest] = m;
  // "Venice 2" -> "Venice": a trailing number only told two files apart.
  const caption = rest.replace(/\s+\d+$/, '').trim();
  return { date: month ? `${year}-${month}` : year, caption };
}

const files = (await fs.readdir(sourceDir))
  .filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f))
  .sort();

await fs.mkdir(outDir, { recursive: true });

let list = [];
try { list = JSON.parse(await fs.readFile(listFile, 'utf8')); } catch {}
const known = new Map(list.map((p) => [p.source, p]));

const added = [];
for (const file of files) {
  const slug = slugify(path.parse(file).name);
  const out = path.join(outDir, `${slug}.jpg`);
  const src = path.join(sourceDir, file);

  const [srcStat, outStat] = await Promise.all([
    fs.stat(src), fs.stat(out).catch(() => null),
  ]);
  if (!outStat || outStat.mtimeMs < srcStat.mtimeMs) {
    await sharp(src)
      .rotate() // respect the camera's orientation flag before it is stripped
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(out);
    console.log(`  made   ${slug}.jpg`);
  }

  if (!known.has(file)) {
    const parsed = parseName(file);
    // "alt" describes the photo for people using screen readers. It starts as the
    // caption; a sentence about what's in the picture is better.
    const entry = { source: file, image: `${slug}.jpg`, ...parsed, alt: parsed.caption };
    added.push(entry);
    known.set(file, entry);
  }
}

// New photos go in newest-first; existing entries stay where you put them.
added.sort((a, b) => b.date.localeCompare(a.date) || a.source.localeCompare(b.source));
list = [...added, ...list].filter((p) => files.includes(p.source));

await fs.writeFile(listFile, JSON.stringify(list, null, 2) + '\n');
console.log(`${list.length} photos in src/photos.json (${added.length} new)`);
