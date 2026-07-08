import { View, Text, Pressable } from "react-native";
import { useRouter, Stack } from "expo-router";

import { useTheme } from "@/hooks/useTheme";
import { SafeArea } from "@/components/layout/SafeArea";

type ErrorBoundaryProps = {
  error: Error;
  retry: () => void;
};

function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeArea className="flex-1 items-center justify-center bg-background">
      <View className="items-center" style={{ padding: theme.spacing["3xl"] }}>
        <Text className="text-display-m font-bold text-danger">!</Text>
        <Text
          className="text-title font-semibold text-foreground"
          style={{ marginTop: theme.spacing.lg }}
        >
          Something went wrong
        </Text>
        <Text
          className="text-body text-foreground-muted text-center"
          style={{ marginTop: theme.spacing.sm, maxWidth: 300 }}
          numberOfLines={4}
        >
          {error.message}
        </Text>
        <View
          className="flex-row"
          style={{ marginTop: theme.spacing["2xl"], gap: theme.spacing.md }}
        >
          <Pressable
            onPress={retry}
            className="rounded-lg bg-primary"
            style={{
              paddingHorizontal: theme.spacing.xl,
              paddingVertical: theme.spacing.md,
            }}
          >
            <Text className="text-body font-medium text-white">Try Again</Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/")}
            className="rounded-lg border border-border"
            style={{
              paddingHorizontal: theme.spacing.xl,
              paddingVertical: theme.spacing.md,
            }}
          >
            <Text className="text-body font-medium text-foreground">Go Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeArea>
  );
}

export default function ErrorScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ErrorBoundary error={new Error("Unknown error")} retry={() => {}} />
    </>
  );
}
