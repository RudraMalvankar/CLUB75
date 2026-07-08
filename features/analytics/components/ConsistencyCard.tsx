import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Stack } from "@/components/ui/layout/Stack";
import { ProgressRing } from "./ProgressRing";
import type { ConsistencyScore } from "../types";

type ConsistencyCardProps = {
  readonly consistency: ConsistencyScore;
};

export function ConsistencyCard({ consistency }: ConsistencyCardProps) {
  const { theme } = useTheme();

  const ringColor =
    consistency.score >= 80
      ? theme.colors.success
      : consistency.score >= 60
        ? theme.colors.warning
        : theme.colors.danger;

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Consistency</Heading>
      <Card>
        <Stack gap="md" align="center">
          <ProgressRing
            value={consistency.score}
            size={80}
            color={ringColor}
            label={consistency.label}
          />
          <Text variant="body" color={theme.colors.textSecondary} style={{ textAlign: "center" }}>
            {consistency.description}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
            <View style={{ alignItems: "center" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Weekly
              </Caption>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {consistency.weeklyStability}%
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Monthly
              </Caption>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {consistency.monthlyStability}%
              </Text>
            </View>
          </View>
        </Stack>
      </Card>
    </View>
  );
}
