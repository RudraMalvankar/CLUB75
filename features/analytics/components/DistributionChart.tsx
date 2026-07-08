import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Stack } from "@/components/ui/layout/Stack";
import { PieChart } from "./PieChart";
import type { DistributionData } from "../types";

type DistributionChartProps = {
  readonly distribution: DistributionData;
};

export function DistributionChart({ distribution }: DistributionChartProps) {
  const { theme } = useTheme();

  const chartData = [
    { label: "Present", value: distribution.present, color: theme.colors.success },
    { label: "Absent", value: distribution.absent, color: theme.colors.danger },
    { label: "Cancelled", value: distribution.cancelled, color: theme.colors.textSecondary },
    { label: "Medical", value: distribution.medical, color: theme.colors.warning },
    { label: "Holiday", value: distribution.holiday, color: theme.colors.info },
  ].filter((item) => item.value > 0);

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Attendance Distribution</Heading>
      <Card>
        <Stack gap="md" align="center">
          <PieChart data={chartData} size={120} />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: theme.spacing.md,
            }}
          >
            {chartData.map((item) => (
              <View key={item.label} style={{ alignItems: "center" }}>
                <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                  {item.value}
                </Text>
                <Caption variant="caption" color={theme.colors.textSecondary}>
                  {item.label}
                </Caption>
              </View>
            ))}
          </View>
        </Stack>
      </Card>
    </View>
  );
}
