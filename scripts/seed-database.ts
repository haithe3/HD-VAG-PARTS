import fs from "node:fs/promises";
import path from "node:path";
import { getDb } from "../server/db";
import { compatibilityRows, deliveryZones, maintenancePacks, products } from "../drizzle/schema";

const root = process.cwd();
const readJson = async <T>(file: string) => JSON.parse(await fs.readFile(path.join(root, file), "utf8")) as T;

async function seedTable<T extends Record<string, unknown>>(table: any, values: T[], label: string) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not available");
  const current = await db.select().from(table).limit(1);
  if (current.length) {
    console.log(`[seed] ${label}: already has data, skipped`);
    return;
  }
  for (let i = 0; i < values.length; i += 250) {
    await db.insert(table).values(values.slice(i, i + 250));
  }
  console.log(`[seed] ${label}: inserted ${values.length}`);
}

const rawProducts = await readJson<any[]>("client/src/data/products.json");
const rawCompatibility = await readJson<any[]>("client/src/data/compatibility.json");
const rawDelivery = await readJson<any[]>("client/src/data/delivery.json");
const rawPacks = await readJson<any[]>("client/src/data/packs.json");

await seedTable(products, rawProducts.map((item) => ({
  id: item.id,
  name: item.name,
  reference: item.reference,
  category: item.category,
  brand: item.brand || null,
  quality: item.quality || null,
  compatible: item.compatible || null,
  price: item.price || null,
  priceValue: typeof item.priceValue === "number" ? item.priceValue : null,
  inStock: item.inStock !== false,
  image: item.image || null,
  keywords: item.keywords || null,
})), "products");

await seedTable(compatibilityRows, rawCompatibility.map((item) => ({
  reference: item.reference,
  partName: item.partName,
  brand: item.brand || null,
  compatibleModels: item.compatibleModels || null,
  years: item.years || null,
  engineCodes: item.engineCodes || null,
  price: item.price || null,
  quality: item.quality || null,
  inStock: item.inStock !== false,
  placeholder: item.placeholder === true,
})), "compatibility");

await seedTable(deliveryZones, rawDelivery.map((item) => ({
  wilaya: item.wilaya,
  price: item.price || null,
  delay: item.delay || null,
})), "delivery");

await seedTable(maintenancePacks, rawPacks.map((item) => ({
  id: item.id,
  name: item.name,
  vehicle: item.vehicle || null,
  items: JSON.stringify(item.contents ?? []),
  price: item.price || null,
  image: null,
})), "maintenance packs");

console.log("[seed] complete");
