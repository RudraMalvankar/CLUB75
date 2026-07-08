import { useState, useCallback } from "react";
import { ScrollView, RefreshControl, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { Button } from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal/Modal";
import { Stack } from "@/components/ui/layout/Stack";
import { useSubjectDetail } from "../hooks";
import {
  SubjectHeader,
  AttendanceRow,
  AddAttendanceForm,
  EditAttendanceForm,
  AttendanceEmptyState,
  AttendanceError,
  AttendanceLoading,
} from "../components";
import type { AttendanceFormData, AttendanceRecordWithSubject } from "../types";

type SubjectDetailScreenProps = {
  readonly subjectId: string;
};

export function SubjectDetailScreen({ subjectId }: SubjectDetailScreenProps) {
  const { theme } = useTheme();
  const { isLoading, error, subject, records, stats, refresh } = useSubjectDetail(subjectId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecordWithSubject | null>(null);

  const handleAdd = useCallback(
    async (data: AttendanceFormData) => {
      // Will be connected to hook
      setShowAddModal(false);
      refresh();
    },
    [refresh],
  );

  const handleEdit = useCallback(
    async (id: string, data: Partial<AttendanceFormData>) => {
      // Will be connected to hook
      setShowEditModal(false);
      setSelectedRecord(null);
      refresh();
    },
    [refresh],
  );

  const handleRecordPress = useCallback(
    (recordId: string) => {
      const record = records.find((r) => r.id === recordId);
      if (record) {
        setSelectedRecord(record);
        setShowEditModal(true);
      }
    },
    [records],
  );

  if (isLoading) {
    return (
      <Screen>
        <AttendanceLoading />
      </Screen>
    );
  }

  if (error || !subject) {
    return (
      <Screen>
        <AttendanceError message={error ?? "Subject not found"} onRetry={refresh} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.spacing["4xl"] }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        <Stack gap="xl">
          <SubjectHeader subject={subject} stats={stats} />

          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            <Button variant="primary" onPress={() => setShowAddModal(true)} style={{ flex: 1 }}>
              Mark Present
            </Button>
            <Button
              variant="outline"
              onPress={() => {
                // Mark absent logic
              }}
              style={{ flex: 1 }}
            >
              Mark Absent
            </Button>
          </View>

          <Heading variant="headingM">History</Heading>

          {records.length === 0 ? (
            <AttendanceEmptyState type="noAttendance" onAction={() => setShowAddModal(true)} />
          ) : (
            <Stack gap="sm">
              {records.slice(0, 20).map((record) => (
                <AttendanceRow key={record.id} record={record} onPress={handleRecordPress} />
              ))}
            </Stack>
          )}
        </Stack>
      </ScrollView>

      <Modal visible={showAddModal} title="Add Attendance" onClose={() => setShowAddModal(false)}>
        <AddAttendanceForm
          subjectId={subjectId}
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        visible={showEditModal}
        title="Edit Attendance"
        onClose={() => {
          setShowEditModal(false);
          setSelectedRecord(null);
        }}
      >
        {selectedRecord && (
          <EditAttendanceForm
            record={selectedRecord}
            onSubmit={handleEdit}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedRecord(null);
            }}
          />
        )}
      </Modal>
    </Screen>
  );
}
