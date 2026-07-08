import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Stack } from "@/components/ui/layout/Stack";
import type { DashboardActivity } from "../types";

type RecentActivityProps = {
  readonly activities: DashboardActivity[];
};

export function RecentActivity({ activities }: RecentActivityProps) {
  const { theme } = useTheme();

  if (activities.length === 0) {
    return (
      <View style={{ gap: theme.spacing.sm }}>
        <Heading variant="headingM">Recent Activity</Heading>
        <Card>
          <View style={{ alignItems: "center", paddingVertical: theme.spacing.xl }}>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              No recent activity
            </Caption>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Recent Activity</Heading>
      <Stack gap="sm">
        {activities.slice(0, 5).map((activity) => (
          <Card key={activity.id}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.colors.primary,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text variant="body">{activity.message}</Text>
                <Caption variant="caption" color={theme.colors.textSecondary}>
                  {activity.timestamp.toLocaleDateString()}
                </Caption>
              </View>
            </View>
          </Card>
        ))}
      </Stack>
    </View>
  );
}
