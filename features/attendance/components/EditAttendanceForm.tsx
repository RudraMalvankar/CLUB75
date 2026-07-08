import { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Stack } from "@/components/ui/layout/Stack";
import type { AttendanceFormData, AttendanceStatus, AttendanceRecordWithSubject } from "../types";

type EditAttendanceFormProps = {
  readonly record: AttendanceRecordWithSubject;
  readonly onSubmit: (id: string, data: Partial<AttendanceFormData>) => void;
  readonly onCancel: () => void;
};

const statusOptions: { value: AttendanceStatus; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "cancelled", label: "Cancelled" },
  { value: "medical", label: "Medical" },
  { value: "holiday", label: "Holiday" },
  { value: "extraLecture", label: "Extra Lecture" },
];

export function EditAttendanceForm({ record, onSubmit, onCancel }: EditAttendanceFormProps) {
  const { theme } = useTheme();
  const [status, setStatus] = useState<AttendanceStatus>(record.status as AttendanceStatus);
  const [date, setDate] = useState(record.date);
  const [lectureNumber, setLectureNumber] = useState(record.lectureNumber?.toString() ?? "");
  const [notes, setNotes] = useState(record.notes ?? "");

  const handleSubmit = useCallback(() => {
    onSubmit(record.id, {
      status,
      date,
      lectureNumber: lectureNumber ? parseInt(lectureNumber, 10) : null,
      notes: notes.trim() || null,
    });
  }, [record.id, status, date, lectureNumber, notes, onSubmit]);

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <Stack gap="lg">
        <Heading variant="headingM">Edit Attendance</Heading>

        <View style={{ gap: theme.spacing.sm }}>
          <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
            Status
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={status === option.value ? "primary" : "outline"}
                size="sm"
                onPress={() => setStatus(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </View>
        </View>

        <Input label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

        <Input
          label="Lecture Number (optional)"
          value={lectureNumber}
          onChangeText={setLectureNumber}
          placeholder="e.g., 1"
          keyboardType="numeric"
        />

        <Input
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any notes..."
        />

        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <Button variant="outline" onPress={onCancel} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" onPress={handleSubmit} style={{ flex: 1 }}>
            Update
          </Button>
        </View>
      </Stack>
    </ScrollView>
  );
}
