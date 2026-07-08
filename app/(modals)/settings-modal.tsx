import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { SafeArea } from "@/components/layout/SafeArea";
import { SettingsScreen } from "@/features/settings";

export default function SettingsModal() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeArea className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: theme.spacing.screenPadding,
          paddingBottom: theme.spacing.lg,
        }}
      >
        <Text variant="bodyLarge">Settings</Text>
        <Pressable onPress={() => router.back()}>
          <Text variant="body" className="font-semibold" style={{ color: theme.colors.primary }}>
            Done
          </Text>
        </Pressable>
      </View>
      <SettingsScreen />
    </SafeArea>
  );
}
