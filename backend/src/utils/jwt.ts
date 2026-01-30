import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

export const jwtAccess = new Elysia({ name: "jwt-access" }).use(
  jwt({
    name: "jwtAccess",
    secret: process.env.JWT_ACCESS_SECRET || "access_secret",
    exp: "15m",
  }),
);

export const jwtRefresh = new Elysia({ name: "jwt-refresh" }).use(
  jwt({
    name: "jwtRefresh",
    secret: process.env.JWT_REFRESH_SECRET || "refresh_secret",
    exp: "7d",
  }),
);
