export const NAVIGATION = {
  TABS: {
    DASHBOARD: "dashboard",
    ATTENDANCE: "attendance",
    TIMETABLE: "timetable",
    ANALYTICS: "analytics",
    SIMULATOR: "simulator",
    SETTINGS: "settings",
  } as const,
  MODALS: {
    SETTINGS: "settings-modal",
    SUBJECT: "subject-modal",
  } as const,
  GROUPS: {
    APP: "(app)",
    SPLASH: "(splash)",
    ONBOARDING: "(onboarding)",
    TABS: "(tabs)",
    MODALS: "(modals)",
    ERRORS: "(errors)",
  } as const,
} as const;

export type TabName = (typeof NAVIGATION.TABS)[keyof typeof NAVIGATION.TABS];
export type ModalName = (typeof NAVIGATION.MODALS)[keyof typeof NAVIGATION.MODALS];
