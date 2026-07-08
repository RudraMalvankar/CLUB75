import { View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { NotificationCard } from "./notification-card";
import type { Notification, NotificationGroup } from "../types";

type NotificationCenterProps = {
  groups: NotificationGroup[];
  onNotificationPress: (notification: Notification) => void;
  onNotificationLongPress?: (notification: Notification) => void;
  emptyMessage?: string;
};

export function NotificationCenter({
  groups,
  onNotificationPress,
  onNotificationLongPress,
  emptyMessage = "No notifications",
}: NotificationCenterProps) {
  const { theme } = useTheme();

  if (groups.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Text variant="bodyLarge" className="mb-2">
          🔔
        </Text>
        <Text variant="body" className="text-secondary text-center">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {groups.map((group) => (
        <View key={group.date} className="mb-4">
          <Text
            variant="body"
            className="font-semibold mb-2 px-1"
            style={{ color: theme.colors.textSecondary }}
          >
            {group.label}
          </Text>
          {group.notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={onNotificationPress}
              onLongPress={onNotificationLongPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
