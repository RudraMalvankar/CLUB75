import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { SimulationInsight } from "../types";

type SimulationInsightsProps = {
  readonly insights: SimulationInsight[];
};

export function SimulationInsights({ insights }: SimulationInsightsProps) {
  const { theme } = useTheme();

  if (insights.length === 0) return null;

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Insights</Heading>
      <Stack gap="sm">
        {insights.map((insight) => {
          const variant =
            insight.type === "danger"
              ? "danger"
              : insight.type === "warning"
                ? "warning"
                : insight.type === "success"
                  ? "success"
                  : "info";
          return (
            <Card key={insight.id}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
                <Badge variant={variant} size="sm">
                  {insight.type === "danger"
                    ? "!"
                    : insight.type === "warning"
                      ? "⚠"
                      : insight.type === "success"
                        ? "✓"
                        : "ℹ"}
                </Badge>
                <Text variant="body" style={{ flex: 1 }}>
                  {insight.message}
                </Text>
              </View>
            </Card>
          );
        })}
      </Stack>
    </View>
  );
}
