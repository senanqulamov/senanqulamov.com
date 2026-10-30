import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "public", "images", "gallery", "placeholders");
const creditFile = join(root, "src", "data", "gallery-photo-credits.json");
// Fixed Picsum IDs keep this collection stable. Picsum serves Unsplash photos.
const ids = [102, 103, 104, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 139, 140, 141, 142, 143, 144, 145, 146, 147, 149, 151, 152, 153, 154, 155];
const dimensions = (index) => index < 23 ? [1200, 1600] : index < 41 ? [1600, 1067] : [1600, 1600];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const photos = await Promise.all(ids.map(async (id, index) => {
  const [width, height] = dimensions(index);
  const info = await fetch(`https://picsum.photos/id/${id}/info`).then((response) => response.json());
  const image = await fetch(`https://picsum.photos/id/${id}/${width}/${height}.webp?quality=78`);
  if (!image.ok) throw new Error(`Could not download Picsum photo ${id}: ${image.status}`);
  const file = `${String(index + 1).padStart(2, "0")}.webp`;
  await writeFile(join(output, file), Buffer.from(await image.arrayBuffer()));
  return { id, author: info.author, source: info.url, width, height };
}));
await writeFile(creditFile, `${JSON.stringify(photos, null, 2)}\n`);
console.log(`Downloaded ${photos.length} gallery placeholders to ${output}`);
