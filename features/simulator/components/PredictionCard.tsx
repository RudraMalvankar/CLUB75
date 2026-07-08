import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { ProgressBar } from "@/components/ui/progress/ProgressBar";
import type { SimulationResult } from "../types";

type PredictionCardProps = {
  readonly result: SimulationResult;
};

export function PredictionCard({ result }: PredictionCardProps) {
  const { theme } = useTheme();

  const statusVariant =
    result.status === "excellent"
      ? "success"
      : result.status === "good"
        ? "info"
        : result.status === "safe"
          ? "warning"
          : "danger";
  const statusLabel = result.status.toUpperCase();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Prediction</Heading>

      <Card>
        <View style={{ alignItems: "center", gap: theme.spacing.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
            <Text variant="body" color={theme.colors.textSecondary}>
              {result.originalPercentage}%
            </Text>
            <Text variant="bodyLarge" style={{ fontWeight: theme.fontWeights.bold }}>
              {result.change >= 0 ? "+" : ""}
              {result.change}%
            </Text>
            <Text
              variant="body"
              style={{
                fontWeight: theme.fontWeights.bold,
                color: result.isImprovement ? theme.colors.success : theme.colors.danger,
              }}
            >
              {result.simulatedPercentage}%
            </Text>
          </View>

          <Badge variant={statusVariant}>{statusLabel}</Badge>

          <View style={{ width: "100%", gap: theme.spacing.sm }}>
            <ProgressBar value={result.simulatedPercentage} height={8} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Goal: {result.goalPercentage}%
              </Caption>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                {result.totalPresent}/{result.totalLectures} lectures
              </Caption>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
            <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <Text
                variant="body"
                style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.success }}
              >
                {result.safeBunks}
              </Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Safe Bunks
              </Caption>
            </View>
            <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {result.lecturesRequired}
              </Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Required
              </Caption>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}
