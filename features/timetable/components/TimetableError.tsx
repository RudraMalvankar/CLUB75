import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Button } from "@/components/ui/button/Button";
import { Stack } from "@/components/ui/layout/Stack";

type TimetableErrorProps = {
  readonly message: string;
  readonly onRetry: () => void;
};

export function TimetableError({ message, onRetry }: TimetableErrorProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: theme.spacing.xl }}
    >
      <Stack gap="lg" align="center">
        <Heading variant="headingM">Something went wrong</Heading>
        <Button variant="primary" onPress={onRetry}>
          Retry
        </Button>
      </Stack>
    </View>
  );
}
