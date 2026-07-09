import { ScrollView, RefreshControl, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { Button } from "@/components/ui/button/Button";

import { Stack } from "@/components/ui/layout/Stack";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import {
  GreetingHeader,
  OverallAttendanceCard,
  SafeBunkCard,
  TodayTimetable,
  QuickActions,
  SubjectOverview,
  WeeklyTrend,
  Insights,
  RecentActivity,
} from "@/features/dashboard/components";

export default function DashboardScreen() {
  const { theme } = useTheme();
  const {
    isLoading,
    error,
    semester,
    subjects,
    todayLectures,
    overallAttendance,
    safeBunk,
    trend,
    insights,
    recentActivity,
    hasData,
    greeting,
    date,
    refresh,
  } = useDashboardData();

  const handleNavigate = (route: string) => {
    // Navigation will be handled by Expo Router
    console.log("Navigate to:", route);
  };

  if (isLoading) {
    return (
      <Screen>
        <Stack gap="lg">
          <View style={{ height: 80 }} />
          <View
            style={{
              height: 120,
              backgroundColor: theme.colors.secondary,
              borderRadius: theme.radius.md,
            }}
          />
          <View
            style={{
              height: 100,
              backgroundColor: theme.colors.secondary,
              borderRadius: theme.radius.md,
            }}
          />
          <View
            style={{
              height: 100,
              backgroundColor: theme.colors.secondary,
              borderRadius: theme.radius.md,
            }}
          />
        </Stack>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing.lg }}
        >
          <Heading variant="headingM">Something went wrong</Heading>
          <Button variant="primary" onPress={refresh}>
            Retry
          </Button>
        </View>
      </Screen>
    );
  }

  if (!hasData) {
    return (
      <Screen>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        >
          <Stack gap="xl">
            <GreetingHeader greeting={greeting} date={date} semesterName={semester?.name ?? null} />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: theme.spacing["4xl"],
              }}
            >
              <Stack gap="lg" align="center">
                <Heading variant="headingM">Welcome to Club75</Heading>
                <Heading variant="headingL" color={theme.colors.textSecondary}>
                  Get started by adding your semester and subjects
                </Heading>
                <Button variant="primary" onPress={handleNavigate.bind(null, "/settings")}>
                  Set Up Semester
                </Button>
              </Stack>
            </View>
          </Stack>
        </ScrollView>
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
          <GreetingHeader greeting={greeting} date={date} semesterName={semester?.name ?? null} />

          <OverallAttendanceCard
            percentage={overallAttendance.percentage}
            totalLectures={overallAttendance.totalLectures}
            attended={overallAttendance.attended}
            missed={overallAttendance.missed}
            goalPercentage={overallAttendance.goalPercentage}
            currentWeek={overallAttendance.currentWeek}
            totalWeeks={overallAttendance.totalWeeks}
            status={overallAttendance.status}
          />

          <SafeBunkCard
            canBunk={safeBunk.canBunk}
            safeBunks={safeBunk.safeBunks}
            message={safeBunk.message}
            currentPercentage={safeBunk.currentPercentage}
            goalPercentage={safeBunk.goalPercentage}
          />

          <TodayTimetable lectures={todayLectures} />

          <QuickActions onNavigate={handleNavigate} />

          <SubjectOverview subjects={subjects} goalPercentage={overallAttendance.goalPercentage} />

          <WeeklyTrend
            direction={trend.direction}
            weeklyAverage={trend.weeklyAverage}
            changeRate={trend.changeRate}
          />

          <Insights insights={insights} />

          <RecentActivity activities={recentActivity} />
        </Stack>
      </ScrollView>
    </Screen>
  );
}
