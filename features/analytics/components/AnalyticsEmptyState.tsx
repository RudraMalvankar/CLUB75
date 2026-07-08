import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Caption } from "@/components/ui/typography/Caption";
import { Button } from "@/components/ui/button/Button";
import { Stack } from "@/components/ui/layout/Stack";

type AnalyticsEmptyStateProps = {
  readonly onAction: () => void;
};

export function AnalyticsEmptyState({ onAction }: AnalyticsEmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: theme.spacing.xl }}
    >
      <Stack gap="lg" align="center">
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.secondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heading variant="headingL">📊</Heading>
        </View>

        <Heading variant="headingM" style={{ textAlign: "center" }}>
          No analytics data
        </Heading>

        <Caption
          variant="caption"
          color={theme.colors.textSecondary}
          style={{ textAlign: "center", maxWidth: 280 }}
        >
          Start tracking your attendance to unlock powerful insights
        </Caption>

        <Button variant="primary" onPress={onAction}>
          Track Attendance
        </Button>
      </Stack>
    </View>
  );
}
