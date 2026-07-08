import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";

export function AttendanceLoading() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, padding: theme.spacing.screenPadding, gap: theme.spacing.md }}>
      <View
        style={{
          height: 40,
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.sm,
        }}
      />
      <View
        style={{
          height: 120,
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.md,
        }}
      />
      <View
        style={{
          height: 120,
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.md,
        }}
      />
      <View
        style={{
          height: 120,
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.md,
        }}
      />
    </View>
  );
}
