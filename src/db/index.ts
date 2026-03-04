import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update. In production, a standard solution is to use a connection pool.
 */
const globalForDb = globalThis as unknown as {
  conn: mysql.Pool | undefined;
};

const conn =
  globalForDb.conn ??
  mysql.createPool({
    host: "localhost",
    user: "rosetta",
    password: "rosetta",
    database: "rosetta",
    connectionLimit: process.env.NODE_ENV === "production" ? 10 : 2,
    maxIdle: 0, // Max number of idle connections (default is 10; set to 0 to close idle connections immediately)
    idleTimeout: 1000, // Idle connections timeout, in milliseconds, the default value 60000
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema, mode: "default" });
