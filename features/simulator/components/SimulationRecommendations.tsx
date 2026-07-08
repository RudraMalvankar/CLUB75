import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { SimulationRecommendation } from "../types";

type SimulationRecommendationsProps = {
  readonly recommendations: SimulationRecommendation[];
};

export function SimulationRecommendations({ recommendations }: SimulationRecommendationsProps) {
  const { theme } = useTheme();

  if (recommendations.length === 0) return null;

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Recommendations</Heading>
      <Stack gap="sm">
        {recommendations.map((rec) => (
          <Card key={rec.id}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
              <Badge
                variant={
                  rec.urgency === "high" ? "danger" : rec.urgency === "medium" ? "warning" : "info"
                }
                size="sm"
              >
                {rec.urgency === "high" ? "!" : "✓"}
              </Badge>
              <Text variant="body" style={{ flex: 1 }}>
                {rec.message}
              </Text>
            </View>
          </Card>
        ))}
      </Stack>
    </View>
  );
}
