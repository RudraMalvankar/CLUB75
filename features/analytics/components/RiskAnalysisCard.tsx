import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { RiskAnalysis } from "../types";
import { RISK_LABELS } from "../types";

type RiskAnalysisCardProps = {
  readonly risks: RiskAnalysis[];
};

export function RiskAnalysisCard({ risks }: RiskAnalysisCardProps) {
  const { theme } = useTheme();

  if (risks.length === 0) {
    return (
      <View style={{ gap: theme.spacing.sm }}>
        <Heading variant="headingM">Risk Analysis</Heading>
        <Card>
          <View style={{ alignItems: "center", padding: theme.spacing.lg }}>
            <Text variant="body" color={theme.colors.success}>
              No subjects at risk
            </Text>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              All subjects are performing well
            </Caption>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Risk Analysis</Heading>
      <Stack gap="sm">
        {risks.map((risk) => {
          const riskVariant =
            risk.riskLevel === "critical"
              ? "danger"
              : risk.riskLevel === "high"
                ? "warning"
                : "info";
          return (
            <Card key={risk.subjectId}>
              <Stack gap="sm">
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                    {risk.subjectName}
                  </Text>
                  <Badge variant={riskVariant} size="sm">
                    {RISK_LABELS[risk.riskLevel]}
                  </Badge>
                </View>
                <Text variant="body" color={theme.colors.textSecondary}>
                  {risk.recommendation}
                </Text>
                {risk.factors.length > 0 && (
                  <Stack gap="xs">
                    {risk.factors.map((factor, index) => (
                      <Caption key={index} variant="caption" color={theme.colors.textSecondary}>
                        • {factor}
                      </Caption>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </View>
  );
}
