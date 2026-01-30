import { db } from "../db";
import { assets, assetHistory } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { Elysia } from "elysia";
import { jwtAccess } from "../utils/jwt";

export const assetService = new Elysia({ name: "service.asset" })
    .use(jwtAccess)
    .derive(({ jwtAccess, headers }) => ({
        // Helper to check auth if needed inside service methods, 
        // though usually handled by route guard
    }))
    .decorate("asset", {
        async getAll() {
            return await db.select().from(assets).orderBy(desc(assets.createdAt));
        },
        
        async getById(id: string) {
            const [asset] = await db.select().from(assets).where(eq(assets.id, id));
            return asset;
        },
        
        async create(data: any, userId: string) {
            // Transaction?
            const [newAsset] = await db.insert(assets).values(data).returning();
            
            // History is handled by Trigger in DB! 
            // But if we wanted to do it manually:
            /*
            await db.insert(assetHistory).values({
                assetId: newAsset.id,
                actionType: 'CREATED',
                newValue: newAsset,
                changedBy: userId
            });
            */
           
           return newAsset;
        },
        
        async update(id: string, data: any, userId: string) {
            const [updatedAsset] = await db.update(assets)
                .set(data)
                .where(eq(assets.id, id))
                .returning();
            return updatedAsset;
        },

        async delete(id: string) {
            // Soft delete or hard delete? Schema has deletedAt
            const [deletedAsset] = await db.update(assets)
                .set({ deletedAt: new Date() })
                .where(eq(assets.id, id))
                .returning();
            return deletedAsset;
        }
    });
