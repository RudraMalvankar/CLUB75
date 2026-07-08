import { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Stack } from "@/components/ui/layout/Stack";
import type { AttendanceFormData, AttendanceStatus } from "../types";

type AddAttendanceFormProps = {
  readonly subjectId: string;
  readonly onSubmit: (data: AttendanceFormData) => void;
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

export function AddAttendanceForm({ subjectId, onSubmit, onCancel }: AddAttendanceFormProps) {
  const { theme } = useTheme();
  const [status, setStatus] = useState<AttendanceStatus>("present");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]!);
  const [lectureNumber, setLectureNumber] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = useCallback(() => {
    onSubmit({
      subjectId,
      status,
      date,
      lectureNumber: lectureNumber ? parseInt(lectureNumber, 10) : null,
      notes: notes.trim() || null,
    });
  }, [subjectId, status, date, lectureNumber, notes, onSubmit]);

  return (
    <ScrollView style={{ maxHeight: 500 }}>
      <Stack gap="lg">
        <Heading variant="headingM">Add Attendance</Heading>

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
            Save
          </Button>
        </View>
      </Stack>
    </ScrollView>
  );
}
