import { Pressable, ScrollView, View } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { useSettings } from "../hooks/use-settings";
import { ACCENT_COLORS, THEME_OPTIONS } from "../types";
import { SettingsLoading } from "./settings-loading";

export function AppearanceSettingsScreen() {
  const { theme } = useTheme();
  const { appearance, updateAppearance, isLoading } = useSettings();

  if (isLoading) {
    return <SettingsLoading />;
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Card>
        <Text variant="body" className="p-4 pb-2 font-semibold">
          Theme
        </Text>
        {THEME_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => updateAppearance({ ...appearance, theme: option.value })}
            className="flex-row items-center justify-between border-b p-4 active:opacity-70"
            style={{ borderColor: theme.colors.border }}
          >
            <Text variant="body">{option.label}</Text>
            {appearance.theme === option.value && <Text variant="body">✓</Text>}
          </Pressable>
        ))}
      </Card>

      <Card className="mt-4">
        <Text variant="body" className="p-4 pb-2 font-semibold">
          Accent Color
        </Text>
        <View className="flex-row flex-wrap gap-3 p-4">
          {ACCENT_COLORS.map((color) => (
            <Pressable
              key={color.value}
              onPress={() => updateAppearance({ ...appearance, accentColor: color.value })}
              className="h-10 w-10 rounded-full"
              style={{
                backgroundColor: color.value,
                borderWidth: appearance.accentColor === color.value ? 3 : 0,
                borderColor: theme.colors.background,
              }}
            />
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}
