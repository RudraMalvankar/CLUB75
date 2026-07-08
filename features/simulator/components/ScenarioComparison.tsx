import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { SimulationScenario } from "../types";

type ScenarioComparisonProps = {
  readonly scenarios: SimulationScenario[];
};

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  const { theme } = useTheme();

  if (scenarios.length === 0) return null;

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Scenario Comparison</Heading>
      <Stack gap="sm">
        {scenarios.map((scenario) => {
          const statusVariant =
            scenario.result.status === "excellent"
              ? "success"
              : scenario.result.status === "good"
                ? "info"
                : scenario.result.status === "safe"
                  ? "warning"
                  : "danger";
          return (
            <Card key={scenario.id}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ gap: theme.spacing.xs }}>
                  <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                    {scenario.label}
                  </Text>
                  <Caption variant="caption" color={theme.colors.textSecondary}>
                    {scenario.result.totalPresent}/{scenario.result.totalLectures} lectures
                  </Caption>
                </View>
                <View style={{ alignItems: "flex-end", gap: theme.spacing.xs }}>
                  <Text variant="bodyLarge" style={{ fontWeight: theme.fontWeights.bold }}>
                    {scenario.result.simulatedPercentage}%
                  </Text>
                  <Badge variant={statusVariant} size="sm">
                    {scenario.result.status.toUpperCase()}
                  </Badge>
                </View>
              </View>
            </Card>
          );
        })}
      </Stack>
    </View>
  );
}
