import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_ICONS,
  NOTIFICATION_PRIORITY_COLORS,
} from "../types";
import type { Notification } from "../types";

type NotificationCardProps = {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onLongPress?: (notification: Notification) => void;
};

export function NotificationCard({ notification, onPress, onLongPress }: NotificationCardProps) {
  const { theme } = useTheme();

  const icon = NOTIFICATION_TYPE_ICONS[notification.type];
  const typeLabel = NOTIFICATION_TYPE_LABELS[notification.type];
  const priorityColor = NOTIFICATION_PRIORITY_COLORS[notification.priority];
  const isUnread = notification.status === "unread";

  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <Pressable
      onPress={() => onPress(notification)}
      onLongPress={() => onLongPress?.(notification)}
      className="p-4 rounded-xl mb-2"
      style={{
        backgroundColor: isUnread ? `${theme.colors.primary}10` : theme.colors.surface,
        borderLeftWidth: 3,
        borderLeftColor: isUnread ? theme.colors.primary : priorityColor,
      }}
    >
      <View className="flex-row items-start">
        <View className="mr-3 mt-0.5">
          <Text variant="bodyLarge">{icon}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              variant="body"
              className="font-semibold flex-1"
              style={{
                color: isUnread ? theme.colors.textPrimary : theme.colors.textSecondary,
              }}
            >
              {notification.title}
            </Text>
            {isUnread && (
              <View
                className="w-2 h-2 rounded-full ml-2"
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
          </View>
          <Text
            variant="body"
            className="text-sm mb-2"
            style={{ color: theme.colors.textSecondary }}
          >
            {notification.body}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text variant="body" className="text-xs" style={{ color: theme.colors.textSecondary }}>
              {typeLabel}
            </Text>
            <Text variant="body" className="text-xs" style={{ color: theme.colors.textSecondary }}>
              {timeAgo}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
