import type { SQLiteRunResult } from "expo-sqlite";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";

import type * as schema from "@/database/schema";

export type Club75Schema = typeof schema;
export type Club75Database = SqliteRemoteDatabase<Club75Schema>;

export type RemoteSqlResult<T = unknown> = {
  rows: T[];
};

export type RuntimeRunResult = SQLiteRunResult;

export type RepositoryListOptions = {
  limit?: number;
  offset?: number;
};
