import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  compatibilityRows,
  deliveryZones,
  InsertProduct,
  maintenancePacks,
  productImages,
  products,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      _db = drizzle(ENV.databaseUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(products.id);
}

export async function getProduct(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(products).values(product);
  return getProduct(product.id);
}

export async function updateProduct(id: string, patch: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(products).set(patch).where(eq(products.id, id));
  return getProduct(id);
}

export async function deleteProduct(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(products).where(eq(products.id, id));
  return { success: true };
}

export async function listProductImages(productId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(desc(productImages.createdAt));
}

export async function addProductImage(image: typeof productImages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(productImages).values(image);
  return listProductImages(image.productId);
}

export async function removeProductImage(id: number, productId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(productImages).where(and(eq(productImages.id, id), eq(productImages.productId, productId)));
  return listProductImages(productId);
}

export async function listMaintenancePacks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(maintenancePacks).orderBy(maintenancePacks.id);
}

export async function listCompatibilityRows() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(compatibilityRows).orderBy(compatibilityRows.id);
}

export async function listDeliveryZones() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(deliveryZones).orderBy(deliveryZones.id);
}
