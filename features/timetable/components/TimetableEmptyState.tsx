import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Caption } from "@/components/ui/typography/Caption";
import { Button } from "@/components/ui/button/Button";
import { Stack } from "@/components/ui/layout/Stack";

type TimetableEmptyStateProps = {
  readonly onCreateTimetable: () => void;
};

export function TimetableEmptyState({ onCreateTimetable }: TimetableEmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: theme.spacing.xl }}
    >
      <Stack gap="lg" align="center">
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.secondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heading variant="headingL">📅</Heading>
        </View>

        <Heading variant="headingM" style={{ textAlign: "center" }}>
          No timetable yet
        </Heading>

        <Caption
          variant="caption"
          color={theme.colors.textSecondary}
          style={{ textAlign: "center", maxWidth: 280 }}
        >
          Create your weekly timetable to track attendance and never miss a lecture
        </Caption>

        <Button variant="primary" onPress={onCreateTimetable}>
          Create Timetable
        </Button>
      </Stack>
    </View>
  );
}
