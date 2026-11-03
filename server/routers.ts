import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";

const productFields = {
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(500),
  reference: z.string().min(1).max(255),
  category: z.string().min(1).max(64),
  brand: z.string().max(120).optional().nullable(),
  quality: z.string().max(40).optional().nullable(),
  compatible: z.string().max(5000).optional().nullable(),
  price: z.string().max(64).optional().nullable(),
  priceValue: z.number().int().nonnegative().optional().nullable(),
  inStock: z.boolean().optional(),
  image: z.string().max(2000).optional().nullable(),
  keywords: z.string().max(5000).optional().nullable(),
};

export const appRouter = router({
  system: router({
    health: publicProcedure.query(() => ({ ok: true })),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure.query(() => db.listProducts()),
    compatibility: publicProcedure.query(() => db.listCompatibilityRows()),
    delivery: publicProcedure.query(() => db.listDeliveryZones()),
    packs: publicProcedure.query(() => db.listMaintenancePacks()),
  }),
  admin: router({
    products: router({
      list: adminProcedure.query(() => db.listProducts()),
      create: adminProcedure.input(z.object(productFields)).mutation(({ input }) =>
        db.createProduct({ ...input, inStock: input.inStock ?? true }),
      ),
      update: adminProcedure.input(z.object({
        id: z.string().min(1),
        patch: z.object({
          name: z.string().min(1).max(500).optional(),
          reference: z.string().min(1).max(255).optional(),
          category: z.string().min(1).max(64).optional(),
          brand: z.string().max(120).optional().nullable(),
          quality: z.string().max(40).optional().nullable(),
          compatible: z.string().max(5000).optional().nullable(),
          price: z.string().max(64).optional().nullable(),
          priceValue: z.number().int().nonnegative().optional().nullable(),
          inStock: z.boolean().optional(),
          image: z.string().max(2000).optional().nullable(),
          keywords: z.string().max(5000).optional().nullable(),
        }),
      })).mutation(({ input }) => db.updateProduct(input.id, input.patch)),
      remove: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(({ input }) => db.deleteProduct(input.id)),
    }),
    images: router({
      list: adminProcedure.input(z.object({ productId: z.string().min(1) })).query(({ input }) => db.listProductImages(input.productId)),
      upload: adminProcedure.input(z.object({
        productId: z.string().min(1),
        fileName: z.string().min(1).max(180),
        mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        dataBase64: z.string().min(1).max(12_000_000),
        altText: z.string().max(255).optional(),
      })).mutation(async ({ input, ctx }) => {
        const raw = input.dataBase64.replace(/^data:[^;]+;base64,/, "");
        const bytes = Buffer.from(raw, "base64");
        if (bytes.byteLength > 8 * 1024 * 1024) throw new Error("Image is larger than 8 MB");
        const uploaded = await storagePut(`products/${input.productId}/${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`, bytes, input.mimeType);
        await db.addProductImage({
          productId: input.productId,
          storageKey: uploaded.key,
          url: uploaded.url,
          altText: input.altText ?? null,
          uploadedByOpenId: ctx.user.openId,
        });
        await db.updateProduct(input.productId, { image: uploaded.url });
        return { url: uploaded.url, images: await db.listProductImages(input.productId) };
      }),
      remove: adminProcedure.input(z.object({ id: z.number().int(), productId: z.string().min(1) })).mutation(async ({ input }) => {
        const images = await db.removeProductImage(input.id, input.productId);
        await db.updateProduct(input.productId, { image: images[0]?.url ?? "" });
        return images;
      }),
    }),
    packs: router({
      list: adminProcedure.query(() => db.listMaintenancePacks()),
    }),
  }),
});

export type AppRouter = typeof appRouter;
