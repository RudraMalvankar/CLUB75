import { useState, useCallback } from "react";
import { ScrollView, RefreshControl, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { FAB } from "@/components/ui/button/FAB";
import { Modal } from "@/components/ui/modal/Modal";
import { Stack } from "@/components/ui/layout/Stack";
import { useAttendance } from "../hooks";
import {
  SubjectCard,
  QuickStats,
  AddAttendanceForm,
  AttendanceEmptyState,
  AttendanceError,
  AttendanceLoading,
} from "../components";
import type { AttendanceFormData, FilterStatus, SortOption } from "../types";

export default function AttendanceScreen() {
  const { theme } = useTheme();
  const {
    isLoading,
    error,
    subjects,
    searchQuery,
    filter,
    sort,
    setSearch,
    setFilter,
    setSort,
    addAttendance,
    refresh,
  } = useAttendance();

  const [showAddModal, setShowAddModal] = useState(false);

  const totalStats = subjects.reduce(
    (acc, s) => ({
      totalLectures: acc.totalLectures + s.totalLectures,
      attended: acc.attended + s.attended,
      missed: acc.missed + s.missed,
    }),
    { totalLectures: 0, attended: 0, missed: 0 },
  );

  const overallPercentage =
    totalStats.totalLectures > 0
      ? Math.round((totalStats.attended / totalStats.totalLectures) * 100)
      : 0;

  const overallSafeBunks = subjects.reduce((acc, s) => acc + s.safeBunks, 0);

  const handleAddAttendance = useCallback(
    async (data: AttendanceFormData) => {
      await addAttendance(data);
      setShowAddModal(false);
    },
    [addAttendance],
  );

  const handleSubjectPress = useCallback((subjectId: string) => {
    // Navigation will be handled by Expo Router
    console.log("Navigate to subject:", subjectId);
  }, []);

  if (isLoading) {
    return (
      <Screen>
        <AttendanceLoading />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <AttendanceError message={error} onRetry={refresh} />
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
          <Heading variant="headingXL">Attendance</Heading>

          <QuickStats
            stats={{
              totalLectures: totalStats.totalLectures,
              attended: totalStats.attended,
              missed: totalStats.missed,
              percentage: overallPercentage,
              safeBunks: overallSafeBunks,
              goalPercentage: 75,
            }}
          />

          <Input
            label="Search"
            value={searchQuery}
            onChangeText={setSearch}
            placeholder="Search subjects..."
          />

          <View style={{ gap: theme.spacing.sm }}>
            <Heading variant="headingM">Filter</Heading>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
              {(["all", "safe", "warning", "critical"] as FilterStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={filter.status === status ? "primary" : "outline"}
                  size="sm"
                  onPress={() => setFilter({ status })}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </View>
          </View>

          <View style={{ gap: theme.spacing.sm }}>
            <Heading variant="headingM">Sort</Heading>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
              {(["percentage", "alphabetical", "highestRisk", "safeBunks"] as SortOption[]).map(
                (sortOption) => (
                  <Button
                    key={sortOption}
                    variant={sort === sortOption ? "primary" : "outline"}
                    size="sm"
                    onPress={() => setSort(sortOption)}
                  >
                    {sortOption === "percentage"
                      ? "%"
                      : sortOption === "alphabetical"
                        ? "A-Z"
                        : sortOption === "highestRisk"
                          ? "Risk"
                          : "Bunks"}
                  </Button>
                ),
              )}
            </View>
          </View>

          {subjects.length === 0 ? (
            <AttendanceEmptyState
              type={searchQuery || filter.status !== "all" ? "noSearchResults" : "noSubjects"}
              onAction={() => setSearch("")}
            />
          ) : (
            <Stack gap="sm">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} onPress={handleSubjectPress} />
              ))}
            </Stack>
          )}
        </Stack>
      </ScrollView>

      <FAB accessibilityLabel="Add Attendance" onPress={() => setShowAddModal(true)}>
        +
      </FAB>

      <Modal visible={showAddModal} title="Add Attendance" onClose={() => setShowAddModal(false)}>
        <AddAttendanceForm
          subjectId={subjects[0]?.id ?? ""}
          onSubmit={handleAddAttendance}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </Screen>
  );
}
