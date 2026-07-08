import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { Recommendation } from "../types";

type RecommendationsCardProps = {
  readonly recommendations: Recommendation[];
};

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  const { theme } = useTheme();

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Recommendations</Heading>
      <Stack gap="sm">
        {recommendations.map((rec) => {
          const typeVariant =
            rec.type === "warning" ? "danger" : rec.type === "recover" ? "warning" : "success";
          return (
            <Card key={rec.id}>
              <View
                style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.md }}
              >
                <Badge variant={typeVariant} size="sm">
                  {rec.type === "warning" ? "!" : rec.type === "recover" ? "↑" : "✓"}
                </Badge>
                <Text variant="body" style={{ flex: 1 }}>
                  {rec.message}
                </Text>
              </View>
            </Card>
          );
        })}
      </Stack>
    </View>
  );
}
