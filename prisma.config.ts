import { defineConfig, env } from "prisma/config";

import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma CLI / Migrate should use the direct (non-pooled) Neon URL.
    url: env("DIRECT_URL"),
  },
});
