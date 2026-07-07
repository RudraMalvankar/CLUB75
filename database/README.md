# Club75 Persistence Layer

Offline-first SQLite persistence architecture for Club75.

---

## Architecture

```
UI -> Hook -> Service -> Repository -> SQLite
```

SQLite is the single source of truth. Cloud sync is additive and optional.

---

## Directory Structure

```
database/
  client.ts          # SQLite proxy client and Drizzle database factory
  database.ts        # Database initialization, migration runner, singleton
  errors.ts          # Typed error classes (Database, Repository, Validation, Migration, Seed, Sync)
  helpers.ts         # Constants, validation schemas, timestamp utilities
  types.ts           # Shared TypeScript types

  schema/            # Drizzle table definitions + Zod validation schemas
    semester.ts
    subjects.ts
    attendance.ts
    lectureSlots.ts
    timetable.ts
    goals.ts
    settings.ts
    preferences.ts
    aiMetadata.ts
    index.ts

  repositories/      # Data access layer (CRUD only, no business logic)
    semester.repository.ts
    subject.repository.ts
    attendance.repository.ts
    lecture.repository.ts
    timetable.repository.ts
    goal.repository.ts
    settings.repository.ts
    ai-metadata.repository.ts
    index.ts

  migrations/        # Drizzle Kit generated SQL + manifest
    0000_*.sql
    meta/_journal.json
    manifest.ts
    build-manifest.ts

  seed/
    index.ts         # Development seed data

  tests/
    test-db.ts
    helpers.test.ts
    schema.test.ts
    database.test.ts
    seed.test.ts
    repositories/
      semester.repository.test.ts
      subject.repository.test.ts
      attendance.repository.test.ts
      lecture.repository.test.ts
      timetable.repository.test.ts
      goal.repository.test.ts
      settings.repository.test.ts
      ai-metadata.repository.test.ts
```

---

## Schema Overview

| Table | Purpose |
|-------|---------|
| `semesters` | Semester definitions with date ranges and attendance thresholds |
| `subjects` | Academic subjects linked to semesters |
| `lecture_slots` | Time slots within a weekly schedule |
| `timetable_entries` | Links subjects to lecture slots (weekly recurring) |
| `attendance_records` | Daily attendance per subject per date |
| `goals` | Attendance targets at semester or subject level |
| `settings` | Global app settings with nested preferences |
| `theme_preferences` | Theme, accent color, system follow |
| `notification_preferences` | Notification toggles and lead time |
| `app_preferences` | Language, haptics, analytics, motion |
| `ai_metadata` | Future AI insights storage (namespace/key/value) |

### Relationships

```
semesters (1) --< (many) subjects
semesters (1) --< (many) lecture_slots
subjects (1) --< (many) attendance_records
subjects (1) --< (many) timetable_entries
lecture_slots (1) --< (many) timetable_entries
lecture_slots (1) --< (many) attendance_records
timetable_entries (1) --< (many) attendance_records
semesters (1) --< (many) goals
subjects (1) --< (many) goals
semesters (1) --< (many) ai_metadata
subjects (1) --< (many) ai_metadata
```

### Every table includes

- Primary key (UUID text)
- `created_at` (integer ms)
- `updated_at` (integer ms)
- Foreign keys with cascade rules
- Indexes on frequently queried columns

---

## Repository Pattern

Each table has a dedicated repository class. Repositories only perform persistence operations.

### Allowed

- CRUD (insert, getById, getAll, update, delete)
- Filtered queries (getBySubject, getByDateRange, findByStatus, etc.)
- Search
- Transactions (SettingsRepository.upsert)

### Forbidden

- Business logic
- Attendance calculations
- Predictions
- Recommendations
- Goal calculations
- Simulation

---

## Validation

Every insert and update is validated through Zod schemas before reaching SQLite.

```ts
// Validation happens at the repository boundary
async insert(payload: InsertSubject) {
  const validated = validateOrThrow(insertSubjectSchema, payload, "Invalid subject insert payload");
  // ... database write
}
```

Schema files export both the Drizzle table definition and the corresponding Zod schemas.

---

## Error Handling

All errors are wrapped in typed error classes:

| Error | Usage |
|-------|-------|
| `DatabaseError` | Base class for all database errors |
| `RepositoryError` | Repository operation failures |
| `ValidationError` | Zod validation failures |
| `MigrationError` | Migration execution failures |
| `SeedError` | Seed data insertion failures |
| `SyncError` | Future cloud sync failures |

Never throw raw SQLite errors to the UI layer.

---

## Migration Strategy

Migrations are generated with Drizzle Kit and bundled as a TypeScript manifest for runtime use.

### Workflow

```bash
# 1. Generate SQL migration from schema changes
npm run db:generate

# 2. Compile migrations into TypeScript manifest
npm run db:manifest

# 3. Test migrations against in-memory database
npm run test
```

### How it works

1. `drizzle-kit generate` produces `.sql` files in `database/migrations/`
2. `build-manifest.ts` reads the SQL files and compiles them into `manifest.ts`
3. `database.ts` applies migrations at runtime using the manifest
4. A `__drizzle_migrations` table tracks applied migration tags

### Adding a new migration

1. Modify schema files in `database/schema/`
2. Run `npm run db:generate`
3. Run `npm run db:manifest`
4. Commit the new SQL file and updated manifest

---

## Seed Strategy

Development seed data creates a realistic dataset:

```
Semester (Semester 5)
  -> 6 Subjects (4 theory + 2 labs)
  -> 8 Lecture Slots (Mon-Sat schedule)
  -> 8 Timetable Entries
  -> 120 Attendance Records (30 days x 4 subjects)
  -> 1 Goal
  -> 1 Settings (with all preferences)
  -> 1 AI Metadata entry
```

### Running seed

```bash
npm run db:seed
```

Seed is idempotent: it skips if data already exists.

---

## Testing

Tests use `better-sqlite3` for deterministic in-memory SQLite behavior outside the Expo runtime.

### Running tests

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
```

### Test categories

| Category | What it covers |
|----------|----------------|
| `helpers.test.ts` | Utility functions, Zod schemas, constants |
| `schema.test.ts` | Zod validation for all insert/update schemas |
| `database.test.ts` | Database initialization, table creation |
| `repositories/*.test.ts` | Full CRUD for each repository |
| `seed.test.ts` | Integration tests, foreign key cascades, data lifecycle |

### Test principles

- In-memory SQLite (fast, isolated)
- Each test creates and destroys its own database
- No shared state between tests
- Foreign key constraints enforced
- All tests run independently

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate SQL migration from schema |
| `npm run db:manifest` | Compile migrations to TypeScript |
| `npm run db:push` | Push schema directly to database |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:drop` | Drop database |
| `npm run db:seed` | Seed development data |
| `npm run db:reset` | Drop + generate + manifest |
| `npm run test` | Run Vitest test suite |
| `npm run test:watch` | Run Vitest in watch mode |

---

## Performance

- Indexed columns: `date`, `subjectId`, `day`, `namespace`, `scope`
- Reads optimized over writes
- No caching layer
- No premature optimization
- Target: attendance queries <10ms, dashboard <100ms, analytics <300ms

---

## Future Compatibility

Schema supports future features without redesign:

- Cloud sync: UUID keys, timestamp columns ready for conflict resolution
- Widgets: Fast queries via indexed columns
- AI Insights: `ai_metadata` namespace/key/value store
- Wear OS: Same SQLite source, different UI layer
- Export/Import: Normalized data, clean relationships
- Backup: Single-file SQLite database

---

## Non-Negotiables

- SQLite is the source of truth
- No direct database calls from UI
- Repositories own all queries
- Services own all business logic
- Validation before every write
- Offline-first always
