import { Tabs } from "expo-router";
import { Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { NAVIGATION } from "@/constants/navigation";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textDisabled,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.xs,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name={NAVIGATION.TABS.DASHBOARD}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name={NAVIGATION.TABS.ATTENDANCE}
        options={{
          title: "Attendance",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✅</Text>,
        }}
      />
      <Tabs.Screen
        name={NAVIGATION.TABS.TIMETABLE}
        options={{
          title: "Timetable",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name={NAVIGATION.TABS.ANALYTICS}
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📈</Text>,
        }}
      />
      <Tabs.Screen
        name={NAVIGATION.TABS.SETTINGS}
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
