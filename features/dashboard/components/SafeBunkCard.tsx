import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";

type SafeBunkCardProps = {
  readonly canBunk: boolean;
  readonly safeBunks: number;
  readonly message: string;
  readonly currentPercentage: number;
  readonly goalPercentage: number;
};

export function SafeBunkCard({
  canBunk,
  safeBunks,
  message,
  currentPercentage,
  goalPercentage,
}: SafeBunkCardProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <View style={{ gap: theme.spacing.md }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        >
          <Heading variant="headingM">Can I Bunk Today?</Heading>
          <Badge variant={canBunk ? "success" : "danger"}>{canBunk ? "YES" : "NO"}</Badge>
        </View>
        <Text variant="bodyLarge">{message}</Text>
        <View style={{ flexDirection: "row", gap: theme.spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              Current
            </Caption>
            <Text variant="body" color={theme.colors.textPrimary}>
              {currentPercentage}%
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              Goal
            </Caption>
            <Text variant="body" color={theme.colors.textPrimary}>
              {goalPercentage}%
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              Safe Bunks
            </Caption>
            <Text variant="body" color={theme.colors.textPrimary}>
              {safeBunks}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
