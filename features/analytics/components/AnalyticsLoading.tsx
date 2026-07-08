import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";

export function AnalyticsLoading() {
  const { theme } = useTheme();

  return (
    <View style={{ padding: theme.spacing.screenPadding, gap: theme.spacing.md }}>
      <View
        style={{
          height: 150,
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.md,
        }}
      />
      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 80,
              backgroundColor: theme.colors.secondary,
              borderRadius: theme.radius.md,
            }}
          />
        ))}
      </View>
      <View
        style={{
          height: 120,
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.md,
        }}
      />
      <View
        style={{
          height: 100,
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.md,
        }}
      />
    </View>
  );
}
