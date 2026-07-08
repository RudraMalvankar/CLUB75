import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Card } from "@/components/ui/card/Card";
import { Stack } from "@/components/ui/layout/Stack";
import type { AttendanceSummary } from "../types";

type QuickStatsProps = {
  readonly summary: AttendanceSummary;
};

export function QuickStats({ summary }: QuickStatsProps) {
  const { theme } = useTheme();

  const stats = [
    { label: "Present", value: summary.attended, color: theme.colors.success },
    { label: "Absent", value: summary.missed, color: theme.colors.danger },
    { label: "Safe Bunks", value: summary.safeBunks, color: theme.colors.info },
    { label: "Required", value: summary.lecturesRequired, color: theme.colors.warning },
  ];

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Quick Statistics</Heading>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
        {stats.map((stat) => (
          <Card key={stat.label} style={{ flex: 1, minWidth: 100 }}>
            <Stack gap="xs" align="center">
              <Text
                variant="bodyLarge"
                style={{ fontWeight: theme.fontWeights.bold, color: stat.color, fontSize: 20 }}
              >
                {stat.value}
              </Text>
              <Text variant="body" color={theme.colors.textSecondary} style={{ fontSize: 12 }}>
                {stat.label}
              </Text>
            </Stack>
          </Card>
        ))}
      </View>
    </View>
  );
}
