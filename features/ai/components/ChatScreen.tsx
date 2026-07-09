import React, { useCallback, useEffect, useRef } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { useChat } from "@/features/ai/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ChatInput } from "./ChatInput";

type ChatScreenProps = {
  readonly conversationId?: string;
};

export function ChatScreen({ conversationId }: ChatScreenProps) {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  const { conversation, isLoading, isStreaming, error, sendMessage, loadConversation } =
    useChat(conversationId);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, loadConversation]);

  const messages = conversation?.messages ?? [];

  const handleSend = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage],
  );

  const handleSuggestedQuestion = useCallback(
    (question: string) => {
      sendMessage(question);
    },
    [sendMessage],
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof messages)[number] }) => <MessageBubble message={item} />,
    [],
  );

  const keyExtractor = useCallback((item: (typeof messages)[number]) => item.id, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text variant="body" className="text-textSecondary">
          Loading conversation...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View className="flex-1">
        {error && (
          <Card
            className="mx-4 mt-4 p-3 bg-danger/10 border border-danger/30"
            style={{ borderRadius: theme.radius.md }}
          >
            <Text variant="body" className="text-danger">
              {error}
            </Text>
          </Card>
        )}

        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Heading variant="headingL" className="text-textPrimary text-center mb-2">
              AI Attendance Coach
            </Heading>
            <Text variant="body" className="text-textSecondary text-center mb-8">
              Ask me anything about your attendance, subjects, or study plans.
            </Text>
            <SuggestedQuestions onSelect={handleSuggestedQuestion} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{
              padding: theme.spacing.md,
              paddingBottom: theme.spacing.xl,
            }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {isStreaming && (
          <View className="px-4">
            <TypingIndicator />
          </View>
        )}

        {messages.length > 0 && !isStreaming && (
          <View className="px-4 mb-2">
            <SuggestedQuestions onSelect={handleSuggestedQuestion} />
          </View>
        )}

        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </View>
    </KeyboardAvoidingView>
  );
}
