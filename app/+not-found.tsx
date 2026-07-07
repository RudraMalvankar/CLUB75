import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { useTheme } from "@/hooks/useTheme";
import { SafeArea } from "@/components/layout/SafeArea";

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeArea className="flex-1 items-center justify-center bg-background">
      <View className="items-center" style={{ padding: theme.spacing["3xl"] }}>
        <Text className="text-display-m font-bold text-foreground">404</Text>
        <Text
          className="text-title font-semibold text-foreground"
          style={{ marginTop: theme.spacing.lg }}
        >
          Page Not Found
        </Text>
        <Text
          className="text-body text-foreground-muted text-center"
          style={{ marginTop: theme.spacing.sm }}
        >
          The page you are looking for does not exist.
        </Text>
        <Pressable
          onPress={() => router.replace("/")}
          className="rounded-lg bg-primary"
          style={{
            marginTop: theme.spacing["2xl"],
            paddingHorizontal: theme.spacing.xl,
            paddingVertical: theme.spacing.md,
          }}
        >
          <Text className="text-body font-medium text-white">Go Home</Text>
        </Pressable>
      </View>
    </SafeArea>
  );
}
