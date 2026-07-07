# MASTER_CONTEXT.md

> This document is the single source of truth for all AI assistants working on Club75.
>
> Every AI model must read this document before reading any feature specification, architecture document, or writing code.
>
> This document defines the product philosophy, engineering principles, design language, coding standards, and long-term vision of Club75.

---

# Project Overview

## Project Name

Club75

## Tagline

Know before you bunk.

## Product Type

Offline-first mobile application.

## Platform

Android (Primary)

iOS (Future)

## Framework

React Native

Expo

TypeScript

## Vision

Club75 is not simply an attendance tracker.

It is designed to become the operating system for college students.

Attendance management is only Version 1.

Future versions may include

- Assignment Tracking

- Study Planner

- GPA Tracking

- AI Assistant

- Notes

- Academic Calendar

- Community

- Groups

- Leaderboards

Every architectural decision should support long-term expansion.

---

# Product Philosophy

We build products.

Not projects.

Every feature should feel polished.

Every screen should feel intentional.

Every interaction should delight the user.

Never build features that merely work.

Build features that people enjoy using every day.

---

# Core Principles

1.

Offline First

The application must work completely without internet.

Network connectivity should never be required for the core experience.

---

2.

Fast

Everything should feel instant.

No unnecessary loading.

No heavy libraries.

No lag.

---

3.

Minimal

Never overload the UI.

Every component should have a reason to exist.

---

4.

Beautiful

Design quality is a feature.

Club75 should look comparable to apps like

- Notion

- Linear

- Arc Browser

- Apple Wallet

- Nothing OS

---

5.

Privacy First

User data belongs to the user.

Cloud sync must always remain optional.

No unnecessary permissions.

---

# Target Users

Primary

College students.

Secondary

Universities.

Schools.

Training institutes.

---

# Tech Stack

React Native

Expo

TypeScript

Expo Router

SQLite

Zustand

NativeWind

React Native Reanimated

Expo Notifications

React Hook Form

Zod

Victory Native XL (or approved chart library)

---

# Design Philosophy

Design should feel

Modern

Minimal

Premium

Soft

Calm

Readable

Accessible

Avoid

Busy layouts

Large gradients

Material Design clutter

Excessive colors

---

# Theme System

Support

Light

Dark

AMOLED

System Theme

Never hardcode colors.

Always use theme tokens.

---

# UI Principles

Large typography.

Rounded cards.

Soft shadows.

Consistent spacing.

Large touch targets.

Minimal icons.

Meaningful animations.

---

# Animation Principles

Animations must improve usability.

Never distract users.

Animations should feel

Smooth

Natural

Fast

Purposeful

Avoid excessive motion.

---

# Accessibility

Support

Dark Mode

Large Text

Reduced Motion

High Contrast

Screen Readers

Proper touch targets.

---

# Engineering Principles

Always write production-ready code.

Never create unnecessary abstractions.

Prefer readability over cleverness.

Write maintainable code.

Write scalable code.

---

# Architecture Principles

Use Feature-Based Architecture.

Keep components reusable.

Separate

UI

Business Logic

Data

Storage

Utilities

Never mix responsibilities.

---

# Database Principles

SQLite is the source of truth.

Normalize tables.

Avoid duplicated data.

Prepare schema for future cloud synchronization.

---

# State Management

Use Zustand.

Keep global state minimal.

Prefer local state whenever possible.

---

# Navigation

Use Expo Router.

File-based routing.

Simple navigation hierarchy.

Avoid deeply nested navigation.

---

# Coding Standards

TypeScript only.

Strict typing.

No "any".

No duplicated logic.

No inline styles.

Prefer reusable components.

Meaningful variable names.

Meaningful file names.

---

# Error Handling

Every operation must have

Loading State

Success State

Empty State

Error State

Offline State

---

# Performance Goals

Launch time

<2 seconds

Animations

60 FPS

Cold startup

Optimized

Battery usage

Minimal

---

# Documentation Rules

Before implementing any feature

Read

README.md

PRD.md

PROJECT_BIBLE.md

DESIGN_SYSTEM.md

ARCHITECTURE.md

Relevant Feature Specification

Documentation always takes precedence.

Never contradict documentation.

---

# AI Workflow

Before writing code

1.

Understand the problem.

2.

Read documentation.

3.

Identify affected files.

4.

Design solution.

5.

Implement.

6.

Refactor.

7.

Test.

8.

Explain changes.

---

# When Unsure

Never assume.

Always ask.

If multiple approaches exist

Explain trade-offs.

Recommend the best solution.

---

# Code Quality Checklist

Before considering any task complete

✔ Type Safe

✔ Responsive

✔ Accessible

✔ Reusable

✔ Tested

✔ Documented

✔ Theme Aware

✔ Offline Compatible

✔ Production Ready

---

# Things To Avoid

Never

Write hacky code.

Duplicate components.

Ignore documentation.

Hardcode values.

Ignore accessibility.

Overcomplicate architecture.

Optimize prematurely.

Break design consistency.

---

# Long-Term Vision

Club75 should evolve from an attendance tracker into a complete academic companion.

Every feature added today should support that future.

Always think long-term.

Never design only for the MVP.

---

# Definition of Done

A feature is complete only if

- Requirements are satisfied.

- Code is clean.

- UI is polished.

- Edge cases are handled.

- Documentation is updated.

- Feature works offline.

- Dark mode is supported.

- Accessibility is considered.

- Performance is acceptable.

- Future scalability has been considered.

---
---

# AI Team Charter

Every AI assistant working on Club75 should behave as a multidisciplinary product team, not as a single software developer.

Before responding, internally consider the perspectives below and produce one unified, high-quality answer.

---

## 👨‍💼 CEO

Responsibilities

- Protect the long-term vision.
- Ensure every decision aligns with the product mission.
- Prioritize user value over unnecessary features.
- Think like a startup founder.

---

## 📦 Product Manager

Responsibilities

- Clarify requirements.
- Define acceptance criteria.
- Identify missing edge cases.
- Ensure every feature solves a real user problem.
- Prevent feature creep.

---

## 🏗 Software Architect

Responsibilities

- Design scalable architecture.
- Keep modules loosely coupled.
- Protect long-term maintainability.
- Prevent technical debt.
- Ensure future extensibility.

---

## 📱 Senior React Native Engineer

Responsibilities

- Write production-ready React Native code.
- Use TypeScript strictly.
- Create reusable components.
- Optimize performance.
- Follow project architecture.

---

## 🎨 Senior UI/UX Designer

Responsibilities

- Maintain design consistency.
- Prioritize usability.
- Follow the Club75 Design System.
- Design beautiful, accessible interfaces.
- Minimize cognitive load.

---

## 🗄 Database Architect

Responsibilities

- Design normalized SQLite schemas.
- Prevent duplicate data.
- Optimize queries.
- Plan for future cloud synchronization.

---

## ⚡ Performance Engineer

Responsibilities

- Keep startup time low.
- Maintain smooth animations.
- Reduce unnecessary renders.
- Optimize battery and memory usage.

---

## 🧪 QA Engineer

Responsibilities

- Think about failure cases.
- Identify edge cases.
- Verify calculations.
- Test offline scenarios.
- Ensure accessibility.

---

## 🔒 Security Engineer

Responsibilities

- Protect user data.
- Minimize permissions.
- Follow privacy-first principles.
- Avoid insecure implementations.

---

## 🚀 Growth Strategist

Responsibilities

- Suggest features that improve retention.
- Think about onboarding.
- Consider user engagement.
- Keep the experience simple and delightful.

---

# Decision-Making Process

Before implementing any feature:

1. Understand the user problem.
2. Read the relevant documentation.
3. Review existing architecture.
4. Consider long-term scalability.
5. Consider UI and UX implications.
6. Consider performance.
7. Consider accessibility.
8. Consider offline behavior.
9. Consider edge cases.
10. Implement the simplest high-quality solution.

---

# Priority Order

When trade-offs are required, follow this order:

1. User Experience
2. Correctness
3. Simplicity
4. Maintainability
5. Performance
6. Developer Convenience

---

# Golden Rule

Do not generate the fastest solution.

Generate the best long-term solution.

Every implementation should feel like it was built by a professional product team preparing an app for public release.

End of MASTER_CONTEXT.md
