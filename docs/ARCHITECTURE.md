# 🏗 Club75 Architecture

Version: 1.0

Status: Living Document

---

# Overview

Club75 follows a modern feature-first architecture.

The architecture prioritizes

- Simplicity
- Scalability
- Maintainability
- Reusability
- Offline-first development

Every architectural decision should support future expansion.

Club75 should never require a complete rewrite to add future modules.

Examples

Attendance

↓

Assignments

↓

Study Planner

↓

GPA

↓

AI Assistant

↓

Community

---

# Architecture Principles

Club75 follows these principles

- Offline First
- Feature First
- Clean Architecture
- Component Driven
- Composition over Inheritance
- Single Responsibility
- Predictable State
- Reusable UI
- Type Safety
- Documentation First

---

# Tech Stack

Framework

React Native

Runtime

Expo

Language

TypeScript

Navigation

Expo Router

Database

SQLite

State

Zustand

Styling

NativeWind

Animation

React Native Reanimated

Forms

React Hook Form

Validation

Zod

Notifications

Expo Notifications

Charts

Victory Native XL

Icons

Lucide

---

# Folder Structure

```
app/
components/
features/
hooks/
services/
store/
database/
utils/
types/
constants/
assets/
```

---

# Folder Responsibilities

## app/

Contains routes.

Never place business logic here.

---

## components/

Reusable UI.

Examples

PrimaryButton

AttendanceCard

SubjectCard

ProgressRing

BottomNavigation

Dialog

---

## features/

Every feature owns itself.

Example

Attendance

contains

Screens

Hooks

Components

Services

Utils

Types

---

## hooks/

Reusable hooks.

Example

useAttendance()

useNotifications()

useTheme()

---

## services/

Business logic.

Attendance calculations.

Notification scheduling.

Prediction engine.

---

## database/

SQLite.

Queries.

Repositories.

Migrations.

---

## utils/

Pure helper functions.

Formatting.

Date utilities.

Math.

Calculations.

---

## store/

Global state.

Use Zustand.

Never store unnecessary data globally.

---

## constants/

Colors.

Spacing.

Theme.

Routes.

Configuration.

---

## assets/

Images.

Icons.

Fonts.

Illustrations.

---

# Feature Structure

Every feature should follow

```
attendance/

components/

hooks/

screens/

services/

types/

utils/
```

No exceptions.

---

# Data Flow

UI

↓

Hook

↓

Service

↓

Repository

↓

SQLite

Never skip layers.

---

# State Management

Use Zustand.

Global State only for

Theme

Settings

Current Semester

Notifications

Avoid putting feature-specific data globally.

---

# Business Logic

Business logic never belongs inside components.

Bad

Component calculates attendance.

Good

AttendanceService calculates attendance.

---

# Navigation

Use Expo Router.

Every major module has its own route.

Example

Dashboard

Attendance

Analytics

Calendar

Settings

---

# Database Pattern

Components never call SQLite directly.

Correct

Component

↓

Service

↓

Repository

↓

SQLite

---

# Error Handling

Every operation must support

Loading

Success

Error

Offline

Empty

Retry

---

# Logging

Development

Console logging allowed.

Production

Structured logging only.

Never expose internal errors to users.

---

# Offline Strategy

Everything must work without internet.

SQLite is the source of truth.

Cloud sync will be additive.

Never required.

---

# Theme Architecture

Every component must use theme tokens.

Never hardcode colors.

Support

Light

Dark

AMOLED

---

# Component Rules

Components should

Do one thing well.

Remain reusable.

Remain testable.

Remain small.

Avoid files larger than ~250 lines unless justified.

---

# Naming Convention

Components

PascalCase

Hooks

useSomething

Services

SomethingService

Repositories

SomethingRepository

Types

PascalCase

Constants

UPPER_CASE

Folders

kebab-case

---

# Performance

Lazy load heavy screens.

Memoize expensive calculations.

Avoid unnecessary re-renders.

Keep animations smooth.

Optimize SQLite queries.

---

# Security

Store only required data.

No unnecessary permissions.

No sensitive information in logs.

---

# Accessibility

Every screen should support

Dark Mode

AMOLED

Large Text

Screen Readers

Reduced Motion

Proper Touch Targets

---

# Future Architecture

Architecture should support

Cloud Sync

Widgets

Wear OS

Apple Watch

AI Assistant

Assignments

Study Planner

GPA

without major refactoring.

---

# Non-Negotiables

Never duplicate business logic.

Never hardcode theme values.

Never access SQLite directly from UI.

Never mix UI with calculations.

Never ignore loading or error states.

Never build one-off components.

---

# Architecture Decision Principles

When choosing between two approaches

Prefer

Simpler

More readable

More maintainable

Better documented

Future-proof

over

Short-term speed.

---

# Definition of Good Architecture

A new developer or AI should be able to understand the project within 30 minutes.

A feature should be buildable without touching unrelated modules.

Every layer should have a single responsibility.

Every component should be reusable.

Every screen should feel consistent.

Every decision should support the long-term vision of Club75.

---

End of ARCHITECTURE.md