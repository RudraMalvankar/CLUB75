import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/sqlite-proxy";

import * as schema from "@/database/schema";
import { splitSqlStatements } from "@/database/helpers";
import { migrations } from "@/database/migrations/manifest";
import type { Club75Database, Club75Schema, RemoteSqlResult } from "@/database/types";

type SqliteBindValue = string | number | boolean | null | Uint8Array | ArrayBuffer;

function createProxyCallback(sqlite: Database.Database) {
  return async (
    query: string,
    params: SqliteBindValue[],
    method: "run" | "all" | "values" | "get",
  ): Promise<RemoteSqlResult> => {
    if (method === "run") {
      sqlite.prepare(query).run(...params);
      return { rows: [] };
    }

    if (method === "get") {
      const obj = sqlite.prepare(query).get(...params) as Record<string, unknown> | undefined;
      if (!obj) return { rows: [] };
      return { rows: [Object.values(obj)] };
    }

    if (method === "values") {
      const rows = sqlite
        .prepare(query)
        .all(...params)
        .map((row) => Object.values(row as Record<string, unknown>));
      return { rows };
    }

    const rows = sqlite
      .prepare(query)
      .all(...params)
      .map((row) => Object.values(row as Record<string, unknown>));
    return { rows };
  };
}

let openDatabase: Database.Database | null = null;

export function createTestDatabase(): Club75Database {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");

  openDatabase = sqlite;

  applyMigrations(sqlite);

  const callback = createProxyCallback(sqlite);
  const db = drizzle<Club75Schema>(callback, { schema });

  return db;
}

function applyMigrations(sqlite: Database.Database) {
  for (const entry of migrations.journal.entries) {
    const key = `m${entry.idx.toString().padStart(4, "0")}`;
    const sql = migrations.migrations[key as keyof typeof migrations.migrations];
    if (!sql) continue;

    sqlite.exec("BEGIN");
    try {
      for (const statement of splitSqlStatements(sql)) {
        sqlite.exec(statement);
      }
      sqlite.exec("COMMIT");
    } catch (error) {
      sqlite.exec("ROLLBACK");
      throw error;
    }
  }
}

export function destroyTestDatabase(_db: Club75Database) {
  if (openDatabase) {
    openDatabase.close();
    openDatabase = null;
  }
}
