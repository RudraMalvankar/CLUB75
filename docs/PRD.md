# 📄 Product Requirements Document (PRD)

**Product:** Club75  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** YYYY-MM-DD

---

# Executive Summary

Club75 is a premium offline-first attendance management application designed specifically for students.

Unlike traditional attendance trackers that only record attendance, Club75 helps students make informed academic decisions by predicting attendance trends, calculating safe bunk limits, visualizing progress, and simplifying attendance management.

The long-term vision is to evolve Club75 into a complete student operating system that includes attendance, assignments, study planning, GPA tracking, AI assistance, and academic productivity tools.

---

# Problem Statement

Students constantly ask questions such as:

- Can I bunk tomorrow?
- How many lectures do I need to attend?
- Which subject is at risk?
- What will my attendance be at the end of the semester?

Most existing attendance applications focus on recording attendance rather than helping students make decisions.

Students currently calculate attendance manually using spreadsheets, calculators, or rough estimates, leading to mistakes and unnecessary stress.

Club75 eliminates this uncertainty by providing intelligent attendance insights and predictions.

---

# Vision

Build the most beautiful and intelligent attendance companion for students.

Club75 should become the trusted daily academic companion for every student.

---

# Mission

Help students:

- Reduce attendance anxiety.
- Make informed attendance decisions.
- Stay organized.
- Save time.
- Improve academic planning.

---

# Success Metrics

Primary Success Metrics

- Daily Active Users
- Daily Attendance Updates
- 7-Day User Retention
- Feature Adoption Rate
- Average Session Duration

Secondary Metrics

- User Satisfaction
- Crash-Free Sessions
- App Store Rating
- Referral Rate

---

# Target Audience

## Primary Users

- Engineering Students
- Diploma Students
- College Students
- University Students

Age

16–25

---

## Secondary Users

- Schools
- Coaching Institutes
- Faculties (Future)

---

# MVP Goals

The MVP should allow students to:

- Track attendance
- Create a timetable
- View attendance analytics
- Predict future attendance
- Calculate safe bunks
- Receive reminders
- Work completely offline

---

# Functional Requirements

## Dashboard

The dashboard should display:

- Overall Attendance
- Safe Bunks Remaining
- Need to Attend
- Today's Classes
- Attendance Trend
- Quick Actions

---

## Attendance

Users should be able to:

- Mark Present
- Mark Absent
- Mark Holiday
- Mark Cancelled Lecture
- Mark Medical Leave
- Edit Attendance
- Delete Attendance

---

## Timetable

Users should be able to:

- Create weekly timetable
- Edit timetable
- Delete timetable
- Support multiple lectures
- Support labs
- Support practicals

---

## Attendance Simulator

Users should be able to:

- Simulate future attendance
- Calculate safe bunks
- Predict semester attendance
- View attendance after X missed classes
- View attendance after X attended classes

---

## Analytics

Users should see:

- Subject-wise attendance
- Weekly trends
- Monthly trends
- Heatmap
- Progress rings
- Semester progress

---

## Calendar

Users should:

- View attendance history
- Edit attendance
- View lecture details
- Filter by subject

---

## Notifications

Support:

- Morning Reminder
- Lecture Reminder
- Daily Summary
- Low Attendance Warning
- Streak Reminder

---

## Settings

Support:

- Theme Selection
- Attendance Requirement
- Notification Preferences
- Export Data
- Backup (Future)

---

# Non-Functional Requirements

The application must:

- Work offline.
- Support Dark Mode.
- Support AMOLED Mode.
- Launch under 2 seconds.
- Maintain smooth animations.
- Be battery efficient.
- Support accessibility.

---

# User Stories

As a student,

I want to know if I can bunk tomorrow without falling below my target attendance.

---

As a student,

I want to see my attendance for each subject.

---

As a student,

I want reminders after every lecture.

---

As a student,

I want to predict my semester attendance.

---

# Acceptance Criteria

Every feature must:

- Work offline.
- Support all themes.
- Handle loading states.
- Handle empty states.
- Handle errors gracefully.
- Be documented.
- Pass testing.

---

# Out of Scope (Version 1)

The following features are intentionally excluded:

- Cloud Sync
- Google Login
- AI Assistant
- Friends
- Leaderboards
- Class Groups
- Assignment Tracking
- GPA Tracking
- ERP Integration

These will be considered after the MVP is stable.

---

# Risks

Potential Risks

- Incorrect attendance calculations.
- Poor user onboarding.
- Complex timetable setup.
- Performance issues with large datasets.

Mitigation

- Comprehensive testing.
- Simple onboarding.
- Optimized SQLite queries.
- Clear documentation.

---

# Roadmap

Version 1.0

- Attendance Tracking
- Timetable
- Dashboard
- Simulator
- Analytics
- Notifications

Version 1.5

- Widgets
- Backup
- Export

Version 2.0

- Cloud Sync
- AI Assistant
- Social Features

---

# Definition of Done

A feature is considered complete when:

- Requirements are met.
- Code is reviewed.
- Documentation is updated.
- Tests pass.
- Works offline.
- Supports all themes.
- Meets accessibility standards.

---

End of PRD