# 🎨 Club75 Design System

> Version: 1.0.0
>
> Status: Living Document
>
> Last Updated: 2026-07-07

---

# Overview

The Club75 Design System defines the visual language, interaction principles, accessibility standards, and reusable UI components for the application.

This document serves as the single source of truth for every screen, component, interaction, and animation.

Every new UI must follow this document.

---

# Design Philosophy

Club75 should never feel like a college project.

It should feel like a premium consumer application.

Inspired by

- Apple Wallet
- Arc Browser
- Linear
- Notion
- Nothing OS
- Calm
- Flighty

Not Inspired By

- Traditional Material Design
- Bootstrap
- Generic Dashboard Templates
- Heavy Corporate UI

---

# Product Personality

Club75 should feel

Professional

Modern

Minimal

Friendly

Reliable

Trustworthy

Intelligent

Calm

Students should feel

"I trust this app."

instead of

"This is another attendance calculator."

---

# Core Design Principles

## 1. Clarity First

Every screen should answer one question.

Never overload users.

Every card should have one purpose.

---

## 2. White Space is a Feature

Don't fill every corner.

Allow breathing room.

Padding creates hierarchy.

---

## 3. Large Typography

Important information should be impossible to miss.

Attendance %

↓

Large

Subtitle

↓

Small

Supporting text

↓

Very subtle

---

## 4. Color Has Meaning

Never use colors randomly.

Green

Success

Yellow

Warning

Red

Danger

Blue / Indigo

Primary actions

Grey

Secondary information

---

## 5. Every Pixel Has Purpose

No decorative elements.

No meaningless gradients.

No fake glass everywhere.

---

# Design Language

Theme

Soft Bento

Characteristics

Rounded Cards

Soft Shadows

Minimal Borders

Large Numbers

Clean Graphs

Small Icons

Smooth Motion

---

# Color System

## Light Theme

Background

#F8FAFC

Surface

#FFFFFF

Card

#FFFFFF

Primary

#4F46E5

Primary Hover

#4338CA

Primary Pressed

#3730A3

Secondary

#E2E8F0

Border

#E5E7EB

Text Primary

#0F172A

Text Secondary

#64748B

Text Disabled

#94A3B8

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Info

#3B82F6

Divider

#E2E8F0

---

## Dark Theme

Background

#09090B

Surface

#18181B

Card

#1E1E21

Border

#2A2A2E

Primary

#6366F1

Text

#FAFAFA

Secondary Text

#A1A1AA

Success

#22C55E

Warning

#FBBF24

Danger

#F87171

---

## AMOLED Theme

Background

#000000

Card

#101010

Border

#1B1B1B

Text

#FFFFFF

Primary

#818CF8

---

# Semantic Colors

Success

Attendance Above Target

Danger

Attendance Below Target

Warning

Approaching Limit

Info

General Information

Accent

Brand

---

# Theme Rules

Never hardcode colors.

Always use design tokens.

Correct

colors.primary

Incorrect

"#4F46E5"

---

# Typography

Font Family

Outfit

Fallback

System Font

---

# Font Scale

Display XL

48

Display L

40

Display M

34

Heading XL

30

Heading L

24

Heading M

20

Title

18

Body Large

16

Body

14

Caption

12

Micro

10

---

# Font Weight

Light

300

Regular

400

Medium

500

SemiBold

600

Bold

700

ExtraBold

800

---

# Typography Rules

Attendance %

Bold

Subject Name

SemiBold

Supporting Text

Regular

Metadata

Regular

Labels

Medium

---

# Spacing System

Base Unit

4px

Spacing

4

8

12

16

20

24

32

40

48

64

96

Never invent spacing.

---

# Border Radius

Small

12

Medium

18

Large

24

XL

32

Pill

999

---

# Elevation

Level 1

Very Soft Shadow

Level 2

Cards

Level 3

Dialogs

Level 4

Floating Buttons

Avoid heavy shadows.

---

# Grid System

Phone Width

100%

Horizontal Padding

20

Card Gap

16

Section Gap

32

Safe Area

Always Respect

---

# Layout Principles

Every screen follows

Header

↓

Primary Card

↓

Secondary Cards

↓

Content

↓

Floating Navigation

---

# Icons

Library

Lucide

Style

Outline

Weight

2

Never mix icon libraries.

---

# Illustrations

Style

Minimal

Flat

Friendly

No 3D.

No cartoon characters.

---

# Images

Use real screenshots.

Avoid stock photos.

---

# Buttons

Primary

Filled

Secondary

Outlined

Tertiary

Text

Danger

Red Filled

Disabled

Grey

Loading

Spinner

Every button minimum height

48px

---

# Inputs

Rounded

Large touch target

Clear labels

Support

Error

Helper Text

Success

Focus State

---

# Cards

Cards are the primary container.

Every card

Rounded

Soft Shadow

Padding

24

Internal Gap

16

---

# Progress Indicators

Use

Circular Progress

Linear Progress

Progress Rings

Avoid pie charts.

---

# Graphs

Allowed

Area Charts

Line Charts

Bar Charts

Heatmaps

Progress Rings

Not Allowed

3D Charts

Exploded Pie Charts

Radar Charts

---

# Empty States

Every empty screen should

Explain

Guide

Offer Action

Never show blank screens.

---

# Loading States

Skeleton Loader

Progress

Optimistic Updates

Avoid spinners whenever possible.

---

# Error States

Friendly Language

Explain Problem

Suggest Action

Never expose raw errors.

---

# Responsive Rules

Support

Small Phones

Large Phones

Tablets (Future)

Foldables (Future)

---

# Haptics

Light

Button Press

Medium

Attendance Saved

Heavy

Achievement

---

# Sound

Silent by default.

Never autoplay sounds.

---

# Accessibility

Support

Screen Readers

Dynamic Font Sizes

Reduced Motion

Color Blind Friendly

Dark Mode

AMOLED

High Contrast

---

# Motion Philosophy

Motion should communicate.

Never entertain.

Animations should

Guide

Explain

Confirm

Never distract.

---

# Component Naming

AttendanceCard

SubjectCard

PrimaryButton

ProgressRing

BottomNavigation

QuickActionCard

Never use vague names.

---

# Naming Conventions

Components

PascalCase

Hooks

camelCase

Constants

UPPER_CASE

Folders

kebab-case

---

# Design Checklist

Every screen must support

✅ Light Theme

✅ Dark Theme

✅ AMOLED

✅ Accessibility

✅ Loading State

✅ Empty State

✅ Error State

✅ Offline State

✅ Smooth Animations

✅ Responsive Layout

---

# Non-Negotiables

Every new UI must

Follow spacing system

Follow typography scale

Use theme tokens

Support all themes

Be accessible

Be reusable

Match the Club75 brand

Never introduce one-off styling.

---

End of Part 1