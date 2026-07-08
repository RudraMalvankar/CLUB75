import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Caption } from "@/components/ui/typography/Caption";
import { Button } from "@/components/ui/button/Button";
import { Stack } from "@/components/ui/layout/Stack";

type EmptyStateProps = {
  readonly type: "noSubjects" | "noAttendance" | "noSearchResults";
  readonly onAction?: () => void;
};

export function AttendanceEmptyState({ type, onAction }: EmptyStateProps) {
  const { theme } = useTheme();

  const config = {
    noSubjects: {
      title: "No Subjects Yet",
      message: "Add your first subject to start tracking attendance.",
      actionLabel: "Add Subject",
    },
    noAttendance: {
      title: "No Attendance Records",
      message: "Start marking your attendance to see statistics here.",
      actionLabel: "Mark Attendance",
    },
    noSearchResults: {
      title: "No Results Found",
      message: "Try adjusting your search or filter criteria.",
      actionLabel: "Clear Filters",
    },
  };

  const current = config[type];

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: theme.spacing.xl }}
    >
      <Stack gap="lg" align="center">
        <Heading variant="headingM">{current.title}</Heading>
        <Caption
          variant="caption"
          color={theme.colors.textSecondary}
          style={{ textAlign: "center" }}
        >
          {current.message}
        </Caption>
        {onAction && (
          <Button variant="primary" onPress={onAction}>
            {current.actionLabel}
          </Button>
        )}
      </Stack>
    </View>
  );
}
