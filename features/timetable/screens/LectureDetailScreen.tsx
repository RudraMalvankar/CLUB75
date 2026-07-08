import { ScrollView, Alert } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { Button } from "@/components/ui/button/Button";
import { Stack } from "@/components/ui/layout/Stack";
import { useLectureForm } from "../hooks/useLectureForm";
import { LectureDetail } from "../components";
import type { TimetableLecture } from "../types";

type LectureDetailScreenProps = {
  readonly lecture: TimetableLecture;
  readonly onBack: () => void;
  readonly onEdit: (lecture: TimetableLecture) => void;
  readonly onViewSubject: (subjectId: string) => void;
  readonly onDeleted: () => void;
};

export function LectureDetailScreen({
  lecture,
  onBack,
  onEdit,
  onViewSubject,
  onDeleted,
}: LectureDetailScreenProps) {
  const { theme } = useTheme();
  const { deleteLecture, isSubmitting } = useLectureForm();

  const handleDelete = async () => {
    Alert.alert("Delete Lecture", `Are you sure you want to delete ${lecture.subjectName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteLecture(lecture.id);
          if (success) {
            onDeleted();
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing["4xl"] }}>
        <Stack gap="xl">
          <Heading variant="headingL">Lecture Details</Heading>

          <LectureDetail
            lecture={lecture}
            onEdit={() => onEdit(lecture)}
            onDelete={handleDelete}
            onMarkAttendance={() => {}}
            onViewSubject={() => onViewSubject(lecture.subjectId)}
          />

          <Stack gap="sm">
            <Button variant="primary" onPress={() => onEdit(lecture)}>
              Edit Lecture
            </Button>
            <Button variant="outline" onPress={() => onViewSubject(lecture.subjectId)}>
              View Subject
            </Button>
            <Button variant="danger" onPress={handleDelete} disabled={isSubmitting}>
              Delete Lecture
            </Button>
          </Stack>
        </Stack>
      </ScrollView>
    </Screen>
  );
}
