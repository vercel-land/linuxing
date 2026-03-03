import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connection = await mysql.createPool({
  host: "localhost",
  user: "rosetta",
  password: "rosetta",
  database: "rosetta",
});

export const db = drizzle(connection, { schema, mode: "default" });
