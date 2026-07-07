# 🗄 Club75 Database Design

Version: 1.0

Status: Living Document

---

# Overview

Club75 is an offline-first application.

SQLite is the primary source of truth.

Every feature in Club75 should continue functioning even without internet connectivity.

Future cloud synchronization must be additive and should never replace local storage.

---

# Database Goals

The database should be

• Fast

• Reliable

• Simple

• Normalized

• Easy to migrate

• Offline First

• Future Cloud Ready

---

# Database Principles

Every table should have

- Primary Key
- Created Date
- Updated Date

Avoid duplicate data.

Never store calculated values unless necessary.

Relationships should be explicit.

Indexes should be added only where performance benefits.

---

# Database Engine

SQLite

ORM

Drizzle ORM (Recommended)

Alternative

Expo SQLite API

---

# Database Structure

Tables

subjects

attendance

timetable

semester

settings

notifications

achievements

streaks

future_sync

---

# Entity Relationship

Semester

↓

Subjects

↓

Timetable

↓

Attendance

↓

Analytics

---

# subjects

Stores all academic subjects.

Columns

id

uuid

name

faculty

credits

minimumAttendance

color

isLab

semesterId

createdAt

updatedAt

---

# attendance

Stores lecture attendance.

Columns

id

subjectId

date

status

lectureNumber

remarks

createdAt

updatedAt

Status Values

Present

Absent

Cancelled

Holiday

Medical Leave

Extra Lecture

---

# timetable

Stores recurring weekly timetable.

Columns

id

dayOfWeek

subjectId

startTime

endTime

room

type

Type

Lecture

Practical

Lab

Tutorial

---

# semester

Stores semester information.

Columns

id

name

startDate

endDate

minimumAttendance

workingDays

createdAt

updatedAt

---

# settings

Stores user preferences.

Columns

id

theme

accentColor

notificationsEnabled

attendanceGoal

followSystemTheme

language

createdAt

updatedAt

---

# notifications

Stores notification history.

Columns

id

title

message

type

scheduledTime

status

createdAt

---

# achievements

Stores unlocked badges.

Columns

id

badge

earnedAt

description

---

# streaks

Stores attendance streaks.

Columns

id

currentStreak

bestStreak

lastAttendanceDate

---

# future_sync

Reserved for cloud synchronization.

Currently unused.

Allows migration without database redesign.

Columns

id

syncStatus

lastSync

deviceId

---

# Relationships

Semester

1

↓

Many Subjects

Subject

1

↓

Many Attendance Records

Subject

1

↓

Many Timetable Entries

---

# Indexes

Index

attendance.date

Reason

Calendar Performance

---

Index

attendance.subjectId

Reason

Analytics

---

Index

timetable.dayOfWeek

Reason

Today's Classes

---

# Repository Pattern

UI

↓

Hook

↓

Service

↓

Repository

↓

SQLite

Never access SQLite directly from UI.

---

# Migrations

Every schema change should use migrations.

Never modify production tables manually.

Migration names

001_initial

002_notifications

003_widgets

etc.

---

# Data Validation

Use Zod before inserting.

Reject invalid records.

Never trust user input.

---

# Backup Strategy

Version 1

Local SQLite only.

Version 2

Export JSON

Export CSV

Version 3

Google Drive Backup

Cloud Sync

---

# Performance

Goals

Attendance Query

<10ms

Dashboard

<100ms

Analytics

<300ms

---

# Future Cloud Sync

Cloud sync should mirror SQLite.

SQLite remains the primary source.

Conflict Resolution

Latest timestamp wins.

Manual merge if conflict exists.

---

# Security

Database stored locally.

No sensitive information.

No passwords.

No tokens.

Future encrypted backups.

---

# Sample Folder Structure

database/

schema/

migrations/

repositories/

seed/

database.ts

---

# Repository Structure

AttendanceRepository

SubjectRepository

SemesterRepository

SettingsRepository

TimetableRepository

NotificationRepository

AchievementRepository

---

# Sample Query Flow

Dashboard

↓

AttendanceService

↓

AttendanceRepository

↓

SQLite

↓

Attendance Data

↓

UI

---

# Data Lifecycle

Create

↓

Read

↓

Update

↓

Delete

↓

Archive (Future)

---

# Database Rules

Never duplicate attendance calculations.

Never store derived percentages.

Always calculate percentages dynamically.

Use transactions for bulk updates.

Validate every insert.

Use indexes carefully.

---

# Future Expansion

The schema should support

Cloud Sync

Multiple Semesters

Multiple Colleges

Friends

Groups

Leaderboards

AI Insights

Widgets

Wear OS

Apple Watch

without major restructuring.

---

# Database Non-Negotiables

SQLite is the source of truth.

No direct database calls from UI.

Repositories own all queries.

Services own all business logic.

Database must remain offline-first.

Cloud is optional.

---

# Definition of Done

Database work is complete when

✓ Schema documented

✓ Migration written

✓ Repository implemented

✓ Queries optimized

✓ Indexed where necessary

✓ Tested

✓ Future compatible

---

End of DATABASE.md