import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type JournalEntry = {
  idx: number;
  when: number;
  tag: string;
  breakpoints: boolean;
};

type Journal = {
  entries: JournalEntry[];
};

async function buildMigrationManifest() {
  const migrationsDir = path.resolve("database/migrations");
  const metaDir = path.join(migrationsDir, "meta");
  const journalPath = path.join(metaDir, "_journal.json");
  const outputPath = path.join(migrationsDir, "manifest.ts");

  const journal = JSON.parse(await readFile(journalPath, "utf8")) as Journal;
  const migrationEntries = await Promise.all(
    journal.entries.map(async (entry) => {
      const sqlPath = path.join(migrationsDir, `${entry.tag}.sql`);
      const sqlSource = await readFile(sqlPath, "utf8");
      return [`m${entry.idx.toString().padStart(4, "0")}`, sqlSource] as const;
    }),
  );

  const output = `export const migrations = ${JSON.stringify(
    {
      journal,
      migrations: Object.fromEntries(migrationEntries),
    },
    null,
    2,
  )} as const;\n`;

  await mkdir(migrationsDir, { recursive: true });
  await writeFile(outputPath, output, "utf8");
}

void buildMigrationManifest();
