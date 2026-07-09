import React, { useCallback } from "react";
import { View, FlatList, Pressable } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Caption } from "@/components/ui/typography/Caption";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { useConversations } from "@/features/ai/hooks/useConversations";
import type { AIConversation } from "@/features/ai/types";

type ConversationListProps = {
  readonly onSelect: (conversationId: string) => void;
  readonly onNewChat: () => void;
};

export function ConversationList({ onSelect, onNewChat }: ConversationListProps) {
  const { theme } = useTheme();
  const { conversations, isLoading } = useConversations();

  const renderItem = useCallback(
    ({ item }: { item: AIConversation }) => (
      <Pressable onPress={() => onSelect(item.id)}>
        <Card
          className="mb-3 p-4 bg-surface border border-border"
          style={{ borderRadius: theme.radius.md }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text variant="bodyLarge" className="text-textPrimary flex-1 mr-2" numberOfLines={1}>
              {item.title}
            </Text>
            {item.isPinned && <Caption className="text-primary">📌</Caption>}
          </View>
          <View className="flex-row items-center justify-between">
            <Caption className="text-textSecondary">{item.messageCount} messages</Caption>
            <Caption className="text-textSecondary">
              {new Date(item.updatedAt).toLocaleDateString()}
            </Caption>
          </View>
        </Card>
      </Pressable>
    ),
    [onSelect, theme.radius.md],
  );

  const keyExtractor = useCallback((item: AIConversation) => item.id, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text variant="body" className="text-textSecondary">
          Loading conversations...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-3">
        <Pressable
          onPress={onNewChat}
          className="bg-primary rounded-full py-3 items-center"
          style={{ borderRadius: theme.radius.pill }}
        >
          <Text variant="bodyLarge" className="text-white font-semibold">
            + New Chat
          </Text>
        </Pressable>
      </View>

      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text variant="body" className="text-textSecondary text-center">
            No conversations yet. Start a new chat to begin!
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            padding: theme.spacing.md,
          }}
        />
      )}
    </View>
  );
}
