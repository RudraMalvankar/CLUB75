import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Caption } from "@/components/ui/typography/Caption";
import { Button } from "@/components/ui/button/Button";
import { Stack } from "@/components/ui/layout/Stack";

type SimulatorEmptyStateProps = {
  readonly onAction: () => void;
};

export function SimulatorEmptyState({ onAction }: SimulatorEmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: theme.spacing.xl }}
    >
      <Stack gap="lg" align="center">
        <Heading variant="headingM">No Attendance Data</Heading>
        <Caption
          variant="caption"
          color={theme.colors.textSecondary}
          style={{ textAlign: "center" }}
        >
          Add attendance records first to use the simulator
        </Caption>
        <Button variant="primary" onPress={onAction}>
          Go to Attendance
        </Button>
      </Stack>
    </View>
  );
}
