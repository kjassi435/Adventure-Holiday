import { createClient } from "@libsql/client/http";

const dbUrl = (process.env.TURSO_DATABASE_URL || "file:local.db").replace(/^libsql:/, "https:");

const db = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

export default db;
