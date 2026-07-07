import { openDatabaseAsync, type SQLiteBindParams, type SQLiteDatabase } from "expo-sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";

import { foreignKeyPragmaSql } from "@/database/helpers";
import type { Club75Database, Club75Schema, RemoteSqlResult } from "@/database/types";
import * as schema from "@/database/schema";

const DATABASE_NAME = "club75.db";

export type RuntimeSQLiteClient = SQLiteDatabase;
export type SqliteBindValue = string | number | boolean | null | Uint8Array | ArrayBuffer;
export type SqliteQueryParams = SqliteBindValue[];
export type SqliteRow = Record<string, unknown>;

export interface SqliteProxyClient {
  run(query: string, params?: SqliteQueryParams): Promise<void>;
  get<T extends SqliteRow = SqliteRow>(
    query: string,
    params?: SqliteQueryParams,
  ): Promise<T | null>;
  all<T extends SqliteRow = SqliteRow>(query: string, params?: SqliteQueryParams): Promise<T[]>;
  values(query: string, params?: SqliteQueryParams): Promise<unknown[][]>;
}

function mapParams(params: SqliteQueryParams = []): SQLiteBindParams {
  return params as SQLiteBindParams;
}

async function runProxyQuery(
  client: SqliteProxyClient,
  query: string,
  params: SqliteQueryParams,
  method: "run" | "all" | "values" | "get",
): Promise<RemoteSqlResult> {
  if (method === "run") {
    await client.run(query, params);
    return { rows: [] };
  }

  if (method === "get") {
    const row = await client.get(query, params);
    return { rows: row ? [row] : [] };
  }

  if (method === "values") {
    return { rows: await client.values(query, params) };
  }

  const rows = await client.all(query, params);
  return { rows };
}

export function createRuntimeProxyClient(client: RuntimeSQLiteClient): SqliteProxyClient {
  return {
    async run(query, params = []) {
      await client.runAsync(query, mapParams(params));
    },
    async get<T extends SqliteRow>(query: string, params: SqliteQueryParams = []) {
      return client.getFirstAsync<T>(query, mapParams(params));
    },
    async all<T extends SqliteRow>(query: string, params: SqliteQueryParams = []) {
      return client.getAllAsync<T>(query, mapParams(params));
    },
    async values(query, params = []) {
      const rows = await client.getAllAsync<Record<string, unknown>>(query, mapParams(params));
      return rows.map((row) => Object.values(row));
    },
  };
}

export async function openRuntimeSqliteClient() {
  const client = await openDatabaseAsync(DATABASE_NAME, { enableChangeListener: true });
  await client.execAsync(foreignKeyPragmaSql());
  return client;
}

export function createDrizzleDatabase(client: SqliteProxyClient): Club75Database {
  return drizzle<Club75Schema>(
    async (query, params, method) =>
      runProxyQuery(client, query, params as SqliteQueryParams, method),
    {
      schema,
    },
  );
}
