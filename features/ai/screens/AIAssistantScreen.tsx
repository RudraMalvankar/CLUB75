import React, { useState } from "react";
import { View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { useTheme } from "@/hooks/useTheme";
import { useAISettings } from "@/features/ai/hooks/useAISettings";
import { AIProviderProvider } from "@/features/ai/providers/AIProviderContext";
import { ChatScreen } from "../components/ChatScreen";
import { ConversationList } from "../components/ConversationList";

type ViewMode = "list" | "chat";

export function AIAssistantScreen() {
  const { theme } = useTheme();
  const { settings } = useAISettings();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setViewMode("chat");
  };

  const handleNewChat = () => {
    setActiveConversationId(undefined);
    setViewMode("chat");
  };

  return (
    <AIProviderProvider settings={settings}>
      <Screen style={{ backgroundColor: theme.colors.background }}>
        <Heading variant="headingL" className="mb-4">
          AI Coach
        </Heading>
        <View className="flex-1">
          {viewMode === "list" ? (
            <ConversationList onSelect={handleSelectConversation} onNewChat={handleNewChat} />
          ) : (
            <ChatScreen conversationId={activeConversationId} />
          )}
        </View>
      </Screen>
    </AIProviderProvider>
  );
}
