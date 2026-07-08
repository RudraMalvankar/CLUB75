import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import type { AttendanceStats } from "../types";

type QuickStatsProps = {
  readonly stats: AttendanceStats;
};

export function QuickStats({ stats }: QuickStatsProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
          <Text variant="bodyLarge" style={{ fontWeight: theme.fontWeights.bold, fontSize: 24 }}>
            {stats.percentage}%
          </Text>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            Overall
          </Caption>
        </View>
        <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
          <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
            {stats.attended}/{stats.totalLectures}
          </Text>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            Attended
          </Caption>
        </View>
        <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
          <Text
            variant="body"
            style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.danger }}
          >
            {stats.missed}
          </Text>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            Missed
          </Caption>
        </View>
        <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
          <Text
            variant="body"
            style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.success }}
          >
            {stats.safeBunks}
          </Text>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            Safe Bunks
          </Caption>
        </View>
      </View>
    </Card>
  );
}
