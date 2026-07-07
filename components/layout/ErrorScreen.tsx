import { View, Text, Pressable } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useInitializationContext } from "@/components/providers/InitializationProvider";

type ErrorScreenProps = {
  readonly message?: string;
  readonly onRetry?: () => void;
};

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  const { theme } = useTheme();
  const { error, retry, retryCount } = useInitializationContext();

  const displayMessage = message ?? error ?? "Something went wrong";
  const handleRetry = onRetry ?? retry;

  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      style={{ padding: theme.spacing["3xl"] }}
    >
      <Text
        className="text-heading-m font-semibold text-foreground"
        style={{ marginBottom: theme.spacing.lg }}
      >
        Initialization Error
      </Text>
      <Text
        className="text-body text-foreground-muted text-center"
        style={{ marginBottom: theme.spacing["2xl"] }}
      >
        {displayMessage}
      </Text>
      <Pressable
        onPress={handleRetry}
        className="rounded-lg bg-primary px-xl py-md"
        style={{ minWidth: 120, alignItems: "center" }}
      >
        <Text className="text-body font-medium text-white">
          {retryCount > 0 ? `Retry (${retryCount}/3)` : "Retry"}
        </Text>
      </Pressable>
    </View>
  );
}
