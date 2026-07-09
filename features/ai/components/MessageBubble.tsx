import React from "react";
import { View, Pressable } from "react-native";

import { Badge } from "@/components/ui/badge/Badge";
import { Card } from "@/components/ui/card/Card";
import { Caption } from "@/components/ui/typography/Caption";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import type { AIMessage } from "@/features/ai/types";

type MessageBubbleProps = {
  readonly message: AIMessage;
  readonly onCopy?: (content: string) => void;
};

export function MessageBubble({ message, onCopy }: MessageBubbleProps) {
  const { theme } = useTheme();
  const isUser = message.role === "user";

  const handleLongPress = () => {
    if (!isUser && onCopy) {
      onCopy(message.content);
    }
  };

  return (
    <View className={`flex-row ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <Pressable onLongPress={handleLongPress} className={`max-w-[85%]`}>
        <Card
          className={`px-4 py-3 ${
            isUser ? "bg-primary rounded-tr-none" : "bg-surface rounded-tl-none"
          }`}
          style={{
            borderRadius: isUser ? theme.radius.lg : theme.radius.lg,
          }}
        >
          {!isUser && (
            <Badge variant="primary" className="mb-2 self-start">
              AI
            </Badge>
          )}
          <Text variant="body" className={`${isUser ? "text-white" : "text-textPrimary"}`}>
            {message.content}
          </Text>
          <Caption className={`mt-1 ${isUser ? "text-white/70" : "text-textSecondary"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Caption>
        </Card>
      </Pressable>
    </View>
  );
}
