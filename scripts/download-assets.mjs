import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const raw = JSON.parse(await readFile("docs/research/products.json", "utf8"));
const products = typeof raw === "string" ? JSON.parse(raw) : raw;
const base = "https://www.stickitup.xyz/cdn/shop/files/";
const jobs = [
  [base + "Stickitup_logo_with_mascot_e854c4bf-8e9b-4573-bba6-7e71f80020a8.png?width=500", "public/images/logo.png"],
  [base + "Monday_web.webp?v=1791743528&width=2400", "public/images/hero-desktop.webp"],
  [base + "Monday_mob.webp?v=1791743528&width=750", "public/images/hero-mobile.webp"],
  [base + "footer-Crop_1_-_Compress.jpg?v=1780985365&width=2400", "public/images/footer-banner.jpg"],
  [base + "FEVICON_d4ffd39c-a8f2-4d90-a830-5b5b4dcc4765.png?crop=center&height=180&width=180", "public/seo/apple-touch-icon.png"],
  [base + "FEVICON_d4ffd39c-a8f2-4d90-a830-5b5b4dcc4765.png?crop=center&height=96&width=96", "src/app/icon.png"],
  ...products.map((p, i) => [p.img.replace(/width=\d+/, "width=600"), `public/products/${i}.jpg`]),
];

for (const d of ["public/images", "public/products", "public/seo"]) await mkdir(d, { recursive: true });

let failed = 0;
for (let i = 0; i < jobs.length; i += 4) {
  await Promise.all(jobs.slice(i, i + 4).map(async ([url, out]) => {
    if (existsSync(out)) return;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(res.status);
      await writeFile(out, Buffer.from(await res.arrayBuffer()));
    } catch (e) {
      failed++;
      console.error("FAIL", url, e.message);
    }
  }));
}
console.log(`done ${jobs.length - failed}/${jobs.length}`);
