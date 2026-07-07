import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { useTheme } from "@/hooks/useTheme";
import { SafeArea } from "@/components/layout/SafeArea";

export default function SubjectModal() {
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
        <Text className="text-heading-m font-semibold text-foreground">Subject Details</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-body font-medium text-primary">Done</Text>
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-body text-foreground-muted">Subject modal — Phase 7 placeholder</Text>
      </View>
    </SafeArea>
  );
}
