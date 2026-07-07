import {
  createDrizzleDatabase,
  createRuntimeProxyClient,
  type SqliteProxyClient,
  openRuntimeSqliteClient,
} from "@/database/client";
import { MigrationError } from "@/database/errors";
import { splitSqlStatements } from "@/database/helpers";
import { migrations } from "@/database/migrations/manifest";
import type { Club75Database } from "@/database/types";

let runtimeDatabase: Club75Database | null = null;
const MIGRATIONS_TABLE_NAME = "__drizzle_migrations";

type MigrationManifest = typeof migrations;

async function ensureMigrationsTable(client: SqliteProxyClient) {
  await client.run(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL
    );
  `);
}

async function getAppliedMigrationTags(client: SqliteProxyClient) {
  const rows = await client.all<{ tag: string }>(`SELECT tag FROM ${MIGRATIONS_TABLE_NAME};`);
  return new Set(rows.map((row) => row.tag));
}

function getMigrationKey(index: number) {
  return `m${index.toString().padStart(4, "0")}`;
}

async function applyMigration(client: SqliteProxyClient, tag: string, sqlSource: string) {
  await client.run("BEGIN");

  try {
    for (const statement of splitSqlStatements(sqlSource)) {
      await client.run(statement);
    }

    await client.run(`INSERT INTO ${MIGRATIONS_TABLE_NAME} (tag, applied_at) VALUES (?, ?);`, [
      tag,
      new Date().toISOString(),
    ]);
    await client.run("COMMIT");
  } catch (error) {
    await client.run("ROLLBACK");
    throw error;
  }
}

export async function runMigrations(
  client: SqliteProxyClient,
  manifest: MigrationManifest = migrations,
) {
  await ensureMigrationsTable(client);
  const appliedTags = await getAppliedMigrationTags(client);

  for (const entry of manifest.journal.entries) {
    if (appliedTags.has(entry.tag)) {
      continue;
    }

    const key = getMigrationKey(entry.idx) as keyof typeof manifest.migrations;
    const migration = manifest.migrations[key];
    if (!migration) {
      throw new MigrationError(`Missing migration SQL for tag "${entry.tag}"`);
    }

    await applyMigration(client, entry.tag, migration);
  }
}

export async function initializeDatabase() {
  if (runtimeDatabase) {
    return runtimeDatabase;
  }

  const sqliteClient = await openRuntimeSqliteClient();
  const proxyClient = createRuntimeProxyClient(sqliteClient);
  const db = createDrizzleDatabase(proxyClient);

  try {
    await runMigrations(proxyClient);
  } catch (error) {
    throw new MigrationError("Failed to run runtime migrations", error);
  }

  runtimeDatabase = db;
  return db;
}

export function getDatabase() {
  if (!runtimeDatabase) {
    throw new MigrationError("Database has not been initialized. Call initializeDatabase() first.");
  }

  return runtimeDatabase;
}
