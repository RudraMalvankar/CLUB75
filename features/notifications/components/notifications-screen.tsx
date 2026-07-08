import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationCenter } from "./notification-center";
import { NotificationSettings } from "./notification-settings";

type Tab = "notifications" | "settings";

export function NotificationsScreen() {
  const { theme } = useTheme();
  const {
    groups,
    preferences,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<Tab>("notifications");

  if (isLoading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text variant="body">Loading notifications...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text variant="body" className="text-danger">
            {error}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center justify-between mb-4 px-4">
        <View>
          <Text variant="bodyLarge" className="font-semibold">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text variant="body" className="text-sm text-secondary">
              {unreadCount} unread
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead}>
            <Text variant="body" className="text-sm" style={{ color: theme.colors.primary }}>
              Mark all read
            </Text>
          </Pressable>
        )}
      </View>

      <View className="flex-row px-4 mb-4">
        <Pressable
          onPress={() => setActiveTab("notifications")}
          className="flex-1 py-2 mr-2 rounded-lg items-center"
          style={{
            backgroundColor:
              activeTab === "notifications" ? theme.colors.primary : theme.colors.surface,
          }}
        >
          <Text
            variant="body"
            className="text-sm font-medium"
            style={{
              color:
                activeTab === "notifications" ? theme.colors.background : theme.colors.textPrimary,
            }}
          >
            Notifications
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("settings")}
          className="flex-1 py-2 ml-2 rounded-lg items-center"
          style={{
            backgroundColor: activeTab === "settings" ? theme.colors.primary : theme.colors.surface,
          }}
        >
          <Text
            variant="body"
            className="text-sm font-medium"
            style={{
              color: activeTab === "settings" ? theme.colors.background : theme.colors.textPrimary,
            }}
          >
            Settings
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {activeTab === "notifications" ? (
          <NotificationCenter
            groups={groups}
            onNotificationPress={(notification) => markAsRead(notification.id)}
            onNotificationLongPress={(notification) => deleteNotification(notification.id)}
            emptyMessage="No notifications yet. They'll appear here when scheduled."
          />
        ) : (
          <NotificationSettings preferences={preferences} onUpdatePreferences={() => {}} />
        )}
      </ScrollView>
    </Screen>
  );
}
