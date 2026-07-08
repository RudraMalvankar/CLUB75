import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Stack } from "@/components/ui/layout/Stack";

export function TimetableLoading() {
  const { theme } = useTheme();

  return (
    <View style={{ padding: theme.spacing.screenPadding, gap: theme.spacing.md }}>
      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 50,
              height: 60,
              backgroundColor: theme.colors.secondary,
              borderRadius: theme.radius.sm,
            }}
          />
        ))}
      </View>

      <Stack gap="sm">
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            style={{
              height: 100,
              backgroundColor: theme.colors.secondary,
              borderRadius: theme.radius.md,
            }}
          />
        ))}
      </Stack>
    </View>
  );
}
