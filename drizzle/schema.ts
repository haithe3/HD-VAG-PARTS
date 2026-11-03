import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  reference: varchar("reference", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  brand: varchar("brand", { length: 120 }),
  quality: varchar("quality", { length: 40 }),
  compatible: text("compatible"),
  price: varchar("price", { length: 64 }),
  priceValue: int("priceValue"),
  inStock: boolean("inStock").default(true).notNull(),
  image: text("image"),
  keywords: text("keywords"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productImages = mysqlTable("product_images", {
  id: int("id").autoincrement().primaryKey(),
  productId: varchar("productId", { length: 64 }).notNull(),
  storageKey: varchar("storageKey", { length: 255 }).notNull(),
  url: text("url").notNull(),
  altText: varchar("altText", { length: 255 }),
  uploadedByOpenId: varchar("uploadedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const maintenancePacks = mysqlTable("maintenance_packs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  vehicle: varchar("vehicle", { length: 255 }),
  items: text("items").notNull(),
  price: varchar("price", { length: 64 }),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const compatibilityRows = mysqlTable("compatibility_rows", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 255 }).notNull(),
  partName: text("partName").notNull(),
  brand: varchar("brand", { length: 120 }),
  compatibleModels: text("compatibleModels"),
  years: varchar("years", { length: 120 }),
  engineCodes: varchar("engineCodes", { length: 255 }),
  price: varchar("price", { length: 64 }),
  quality: varchar("quality", { length: 40 }),
  inStock: boolean("inStock").default(true).notNull(),
  placeholder: boolean("placeholder").default(false).notNull(),
});

export const deliveryZones = mysqlTable("delivery_zones", {
  id: int("id").autoincrement().primaryKey(),
  wilaya: varchar("wilaya", { length: 120 }).notNull().unique(),
  price: varchar("price", { length: 64 }),
  delay: varchar("delay", { length: 120 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type MaintenancePack = typeof maintenancePacks.$inferSelect;
export type CompatibilityRow = typeof compatibilityRows.$inferSelect;
export type DeliveryZone = typeof deliveryZones.$inferSelect;
