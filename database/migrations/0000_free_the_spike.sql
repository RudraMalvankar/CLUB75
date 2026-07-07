CREATE TABLE `ai_metadata` (
	`id` text PRIMARY KEY NOT NULL,
	`semester_id` text,
	`subject_id` text,
	`namespace` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ai_metadata_namespace_idx` ON `ai_metadata` (`namespace`);--> statement-breakpoint
CREATE INDEX `ai_metadata_subject_idx` ON `ai_metadata` (`subject_id`);--> statement-breakpoint
CREATE INDEX `ai_metadata_semester_idx` ON `ai_metadata` (`semester_id`);--> statement-breakpoint
CREATE TABLE `attendance_records` (
	`id` text PRIMARY KEY NOT NULL,
	`subject_id` text NOT NULL,
	`lecture_slot_id` text,
	`timetable_entry_id` text,
	`date` text NOT NULL,
	`status` text NOT NULL,
	`lecture_number` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`lecture_slot_id`) REFERENCES `lecture_slots`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`timetable_entry_id`) REFERENCES `timetable_entries`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `attendance_subject_idx` ON `attendance_records` (`subject_id`);--> statement-breakpoint
CREATE INDEX `attendance_date_idx` ON `attendance_records` (`date`);--> statement-breakpoint
CREATE INDEX `attendance_status_idx` ON `attendance_records` (`status`);--> statement-breakpoint
CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`goal_type` text NOT NULL,
	`scope` text NOT NULL,
	`semester_id` text,
	`subject_id` text,
	`target_attendance` integer NOT NULL,
	`is_active` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE cascade ON DELETE cascade,
	CONSTRAINT "target_attendance_range_check" CHECK("target_attendance" >= 0 AND "target_attendance" <= 100)
);
--> statement-breakpoint
CREATE INDEX `goals_scope_idx` ON `goals` (`scope`);--> statement-breakpoint
CREATE INDEX `goals_semester_idx` ON `goals` (`semester_id`);--> statement-breakpoint
CREATE INDEX `goals_subject_idx` ON `goals` (`subject_id`);--> statement-breakpoint
CREATE TABLE `lecture_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`semester_id` text NOT NULL,
	`day` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`label` text,
	`active_from` text,
	`active_until` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lecture_slots_semester_day_idx` ON `lecture_slots` (`semester_id`,`day`);--> statement-breakpoint
CREATE UNIQUE INDEX `lecture_slots_unique_window` ON `lecture_slots` (`semester_id`,`day`,`start_time`,`end_time`);--> statement-breakpoint
CREATE TABLE `app_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`language` text NOT NULL,
	`haptics_enabled` integer NOT NULL,
	`analytics_opt_in` integer NOT NULL,
	`reduced_motion` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `app_preferences_language_idx` ON `app_preferences` (`language`);--> statement-breakpoint
CREATE TABLE `notification_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`enabled` integer NOT NULL,
	`attendance_reminders_enabled` integer NOT NULL,
	`low_attendance_alerts_enabled` integer NOT NULL,
	`daily_summary_enabled` integer NOT NULL,
	`reminder_lead_minutes` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `theme_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`theme` text NOT NULL,
	`follow_system` integer NOT NULL,
	`accent_color` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `theme_preferences_theme_idx` ON `theme_preferences` (`theme`);--> statement-breakpoint
CREATE TABLE `semesters` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`minimum_attendance` integer NOT NULL,
	`current_week` integer NOT NULL,
	`working_days` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "current_week_non_negative_check" CHECK("current_week" >= 0),
	CONSTRAINT "working_days_non_negative_check" CHECK("working_days" >= 0)
);
--> statement-breakpoint
CREATE INDEX `semesters_name_idx` ON `semesters` (`name`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`default_semester_id` text,
	`target_attendance` integer NOT NULL,
	`theme_preference_id` text NOT NULL,
	`notification_preference_id` text NOT NULL,
	`app_preference_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`default_semester_id`) REFERENCES `semesters`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`theme_preference_id`) REFERENCES `theme_preferences`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`notification_preference_id`) REFERENCES `notification_preferences`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`app_preference_id`) REFERENCES `app_preferences`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`faculty` text NOT NULL,
	`color` text NOT NULL,
	`credit` integer NOT NULL,
	`minimum_attendance` integer NOT NULL,
	`is_lab` integer NOT NULL,
	`semester_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE cascade ON DELETE cascade,
	CONSTRAINT "minimum_attendance_range_check" CHECK("minimum_attendance" >= 0 AND "minimum_attendance" <= 100)
);
--> statement-breakpoint
CREATE INDEX `subjects_semester_idx` ON `subjects` (`semester_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_semester_code_unique` ON `subjects` (`semester_id`,`code`);--> statement-breakpoint
CREATE TABLE `timetable_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`subject_id` text NOT NULL,
	`lecture_slot_id` text NOT NULL,
	`room` text,
	`faculty` text,
	`lecture_type` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`lecture_slot_id`) REFERENCES `lecture_slots`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `timetable_entries_subject_idx` ON `timetable_entries` (`subject_id`);--> statement-breakpoint
CREATE INDEX `timetable_entries_slot_idx` ON `timetable_entries` (`lecture_slot_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `timetable_entries_subject_slot_unique` ON `timetable_entries` (`subject_id`,`lecture_slot_id`);