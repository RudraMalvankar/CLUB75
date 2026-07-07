import { View, ActivityIndicator, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useInitializationContext } from "@/components/providers/InitializationProvider";

export function LoadingScreen() {
  const { theme } = useTheme();
  const { phase } = useInitializationContext();

  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      style={{ padding: theme.spacing["3xl"] }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text
        className="text-body mt-lg text-foreground-muted"
        style={{ marginTop: theme.spacing.lg }}
      >
        {phase === "fonts" && "Loading fonts..."}
        {phase === "theme" && "Preparing theme..."}
        {phase === "database" && "Initializing database..."}
        {phase === "preferences" && "Loading preferences..."}
        {phase === "navigation" && "Setting up navigation..."}
        {phase === "complete" && "Ready!"}
      </Text>
    </View>
  );
}
