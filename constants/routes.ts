export const ROUTES = {
  ROOT: "/",
  SPLASH: "/(splash)",
  ONBOARDING: "/(onboarding)",
  TABS: "/(tabs)",
  DASHBOARD: "/(tabs)/dashboard",
  ATTENDANCE: "/(tabs)/attendance",
  TIMETABLE: "/(tabs)/timetable",
  ANALYTICS: "/(tabs)/analytics",
  SETTINGS: "/(tabs)/settings",
  SETTINGS_MODAL: "/(modals)/settings-modal",
  SUBJECT_MODAL: "/(modals)/subject-modal",
  NOT_FOUND: "+not-found",
  ERROR: "+error",
} as const;

export const TAB_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.ATTENDANCE,
  ROUTES.TIMETABLE,
  ROUTES.ANALYTICS,
  ROUTES.SETTINGS,
] as const;
