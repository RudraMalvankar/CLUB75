import { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button/Button";
import { Stack } from "@/components/ui/layout/Stack";
import { Card } from "@/components/ui/card/Card";
import { useLectureForm } from "../hooks/useLectureForm";
import type { LectureFormData, TimetableLecture } from "../types";
import { DAY_LABELS, ALL_DAYS, LECTURE_TYPE_LABELS } from "../types";

type LectureFormScreenProps = {
  readonly mode: "add" | "edit";
  readonly initialData?: TimetableLecture;
  readonly semesterId: string;
  readonly subjectId?: string;
  readonly onSuccess: (lecture: TimetableLecture) => void;
  readonly onCancel: () => void;
};

export function LectureFormScreen({
  mode,
  initialData,
  semesterId,
  subjectId,
  onSuccess,
  onCancel,
}: LectureFormScreenProps) {
  const { theme } = useTheme();
  const { createLecture, updateLecture, checkConflicts, isSubmitting, errors, conflicts } =
    useLectureForm();

  const [formData, setFormData] = useState<LectureFormData>({
    subjectId: subjectId ?? initialData?.subjectId ?? "",
    day: initialData?.day ?? "monday",
    startTime: initialData?.startTime ?? "09:00",
    endTime: initialData?.endTime ?? "10:00",
    room: initialData?.room ?? "",
    faculty: initialData?.faculty ?? "",
    lectureType: initialData?.lectureType ?? "lecture",
    notes: "",
  });

  useEffect(() => {
    if (formData.day && formData.startTime && formData.endTime) {
      void checkConflicts(semesterId, formData, initialData?.id);
    }
  }, [formData.day, formData.startTime, formData.endTime, semesterId, initialData?.id]);

  const handleSubmit = async () => {
    let lecture: TimetableLecture | null;

    if (mode === "add") {
      lecture = await createLecture(semesterId, formData);
    } else if (initialData) {
      lecture = await updateLecture(initialData.id, formData);
    } else {
      return;
    }

    if (lecture) {
      onSuccess(lecture);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing["4xl"] }}>
        <Stack gap="xl">
          <Heading variant="headingL">{mode === "add" ? "Add Lecture" : "Edit Lecture"}</Heading>

          {errors.length > 0 && (
            <Card style={{ backgroundColor: theme.colors.danger + "10" }}>
              <Stack gap="xs">
                {errors.map((error, i) => (
                  <Text key={i} variant="body" color={theme.colors.danger}>
                    {error}
                  </Text>
                ))}
              </Stack>
            </Card>
          )}

          {conflicts.length > 0 && (
            <Card style={{ backgroundColor: theme.colors.warning + "10" }}>
              <Stack gap="xs">
                <Text
                  variant="body"
                  style={{ fontWeight: theme.fontWeights.medium, color: theme.colors.warning }}
                >
                  Time Conflict
                </Text>
                {conflicts.map((conflict, i) => (
                  <Text key={i} variant="body" color={theme.colors.textSecondary}>
                    {conflict.message}
                  </Text>
                ))}
              </Stack>
            </Card>
          )}

          <Card>
            <Stack gap="md">
              <View style={{ gap: theme.spacing.xs }}>
                <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                  Day
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Stack gap="sm" style={{ flexDirection: "row" }}>
                    {ALL_DAYS.map((day) => (
                      <Button
                        key={day}
                        variant={formData.day === day ? "primary" : "outline"}
                        size="sm"
                        onPress={() => setFormData({ ...formData, day })}
                      >
                        {DAY_LABELS[day].slice(0, 3)}
                      </Button>
                    ))}
                  </Stack>
                </ScrollView>
              </View>

              <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
                <View style={{ flex: 1, gap: theme.spacing.xs }}>
                  <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                    Start
                  </Text>
                  <Button
                    variant="outline"
                    onPress={() => setFormData({ ...formData, startTime: "09:00" })}
                  >
                    {formData.startTime}
                  </Button>
                </View>
                <View style={{ flex: 1, gap: theme.spacing.xs }}>
                  <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                    End
                  </Text>
                  <Button
                    variant="outline"
                    onPress={() => setFormData({ ...formData, endTime: "10:00" })}
                  >
                    {formData.endTime}
                  </Button>
                </View>
              </View>

              <View style={{ gap: theme.spacing.xs }}>
                <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                  Room
                </Text>
                <Button
                  variant="outline"
                  onPress={() => setFormData({ ...formData, room: formData.room || "101" })}
                >
                  {formData.room || "Enter room"}
                </Button>
              </View>

              <View style={{ gap: theme.spacing.xs }}>
                <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                  Faculty
                </Text>
                <Button
                  variant="outline"
                  onPress={() =>
                    setFormData({ ...formData, faculty: formData.faculty || "Dr. Smith" })
                  }
                >
                  {formData.faculty || "Enter faculty"}
                </Button>
              </View>

              <View style={{ gap: theme.spacing.xs }}>
                <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                  Lecture Type
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Stack gap="sm" style={{ flexDirection: "row" }}>
                    {(["lecture", "practical", "lab", "theory", "tutorial"] as const).map(
                      (type) => (
                        <Button
                          key={type}
                          variant={formData.lectureType === type ? "primary" : "outline"}
                          size="sm"
                          onPress={() => setFormData({ ...formData, lectureType: type })}
                        >
                          {LECTURE_TYPE_LABELS[type]}
                        </Button>
                      ),
                    )}
                  </Stack>
                </ScrollView>
              </View>
            </Stack>
          </Card>

          <Stack gap="sm">
            <Button
              variant="primary"
              onPress={handleSubmit}
              disabled={isSubmitting || conflicts.length > 0}
            >
              {mode === "add" ? "Add Lecture" : "Save Changes"}
            </Button>
            <Button variant="ghost" onPress={onCancel}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </ScrollView>
    </Screen>
  );
}
