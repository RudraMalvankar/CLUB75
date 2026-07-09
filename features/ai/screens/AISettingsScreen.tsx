import React from "react";
import { View, ScrollView, Switch } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Screen } from "@/components/layout/Screen";
import { useTheme } from "@/hooks/useTheme";
import { useAISettings } from "@/features/ai/hooks/useAISettings";
import { AI_PROVIDER_LABELS, type AIProviderName } from "@/features/ai/types";

const PROVIDERS: AIProviderName[] = ["gemini", "openai", "mock"];

export function AISettingsScreen() {
  const { theme } = useTheme();
  const { settings, updateSettings, isLoading } = useAISettings();

  if (isLoading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text variant="body" className="text-textSecondary">
            Loading settings...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md }}>
        <Heading variant="headingL" className="mb-4">
          AI Settings
        </Heading>

        <Card
          className="mb-4 p-4 bg-surface border border-border"
          style={{ borderRadius: theme.radius.md }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text variant="bodyLarge" className="text-textPrimary">
              Enable AI
            </Text>
            <Switch
              value={settings.enabled}
              onValueChange={(value) => updateSettings({ enabled: value })}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background}
            />
          </View>

          <Text variant="body" className="text-textSecondary mb-2">
            Provider
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {PROVIDERS.map((provider) => (
              <Card
                key={provider}
                className={`px-4 py-2 ${
                  settings.provider === provider
                    ? "bg-primary/20 border-primary"
                    : "bg-background border-border"
                }`}
                style={{ borderRadius: theme.radius.sm }}
              >
                <Text
                  variant="body"
                  className={settings.provider === provider ? "text-primary" : "text-textSecondary"}
                >
                  {AI_PROVIDER_LABELS[provider]}
                </Text>
              </Card>
            ))}
          </View>

          {settings.provider === "gemini" && (
            <>
              <Text variant="body" className="text-textSecondary mb-2">
                API Key
              </Text>
              <Card
                className="mb-4 p-3 bg-background border border-border"
                style={{ borderRadius: theme.radius.sm }}
              >
                <Text variant="body" className="text-textPrimary">
                  {settings.apiKey ? "••••••••" + settings.apiKey.slice(-4) : "Not set"}
                </Text>
              </Card>
            </>
          )}

          <View className="flex-row items-center justify-between mb-4">
            <Text variant="bodyLarge" className="text-textPrimary">
              Streaming
            </Text>
            <Switch
              value={settings.streaming}
              onValueChange={(value) => updateSettings({ streaming: value })}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background}
            />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text variant="bodyLarge" className="text-textPrimary">
              History
            </Text>
            <Switch
              value={settings.historyEnabled}
              onValueChange={(value) => updateSettings({ historyEnabled: value })}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background}
            />
          </View>

          <Text variant="body" className="text-textSecondary">
            Temperature: {settings.temperature.toFixed(1)}
          </Text>
        </Card>

        <Card
          className="p-4 bg-surface border border-border"
          style={{ borderRadius: theme.radius.md }}
        >
          <Heading variant="headingM" className="text-textPrimary mb-2">
            Privacy Notice
          </Heading>
          <Text variant="body" className="text-textSecondary">
            Your attendance data is sent to the AI provider only when you ask a question. No data is
            stored on external servers. API keys are stored locally on your device.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
