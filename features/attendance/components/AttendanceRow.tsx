import { View, Pressable } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Badge } from "@/components/ui/badge/Badge";
import type { AttendanceRecordWithSubject } from "../types";

type AttendanceRowProps = {
  readonly record: AttendanceRecordWithSubject;
  readonly onPress?: (recordId: string) => void;
};

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "danger" | "warning" | "info" | "default" }
> = {
  present: { label: "Present", variant: "success" },
  absent: { label: "Absent", variant: "danger" },
  cancelled: { label: "Cancelled", variant: "default" },
  medical: { label: "Medical", variant: "info" },
  holiday: { label: "Holiday", variant: "warning" },
  extraLecture: { label: "Extra", variant: "success" },
};

export function AttendanceRow({ record, onPress }: AttendanceRowProps) {
  const { theme } = useTheme();

  const status = statusConfig[record.status] ?? {
    label: record.status,
    variant: "default" as const,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Pressable
      onPress={() => onPress?.(record.id)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.divider,
          gap: theme.spacing.md,
        }}
      >
        <View
          style={{
            width: 4,
            height: 36,
            borderRadius: 2,
            backgroundColor: record.subjectColor,
          }}
        />
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
            <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
              {record.subjectName}
            </Text>
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
          </View>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            {formatDate(record.date)}
            {record.notes ? ` | ${record.notes}` : ""}
          </Caption>
        </View>
      </View>
    </Pressable>
  );
}
