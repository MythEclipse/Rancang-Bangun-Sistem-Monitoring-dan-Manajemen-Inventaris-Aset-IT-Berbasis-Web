import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"; // "postgres" driver
import * as schema from "./schema";

const queryClient = postgres(
  process.env.DATABASE_URL ||
    "postgresql://user:password@127.0.0.1:5433/it_asset_db",
);
export const db = drizzle(queryClient, { schema });
