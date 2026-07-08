import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { useCalendar } from "../hooks/use-calendar";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";
import { Agenda } from "./agenda";

export function CalendarScreen() {
  const { theme } = useTheme();
  const {
    currentDate,
    selectedDate,
    view,
    events,
    monthSummary,
    weekSummary,
    agenda,
    selectedDayEvents,
    selectedDaySummary,
    isLoading,
    error,
    setView,
    setSelectedDate,
    navigateMonth,
    navigateWeek,
    navigateDay,
    goToToday,
    getMonthName,
    formatDate,
  } = useCalendar();

  const [currentView, setCurrentView] = useState(view);

  const handleViewChange = useCallback(
    (newView: typeof view) => {
      setCurrentView(newView);
      setView(newView);
    },
    [setView],
  );

  const handlePrevious = useCallback(() => {
    if (currentView === "month") navigateMonth(-1);
    else if (currentView === "week") navigateWeek(-1);
    else if (currentView === "day") navigateDay(-1);
  }, [currentView, navigateMonth, navigateWeek, navigateDay]);

  const handleNext = useCallback(() => {
    if (currentView === "month") navigateMonth(1);
    else if (currentView === "week") navigateWeek(1);
    else if (currentView === "day") navigateDay(1);
  }, [currentView, navigateMonth, navigateWeek, navigateDay]);

  const handleDateSelect = useCallback(
    (date: string) => {
      setSelectedDate(date);
      if (currentView === "month") {
        setCurrentView("day");
        setView("day");
      }
    },
    [setSelectedDate, setView, currentView],
  );

  const title = (() => {
    if (currentView === "month") {
      return `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
    }
    if (currentView === "week") {
      return `Week of ${formatDate(currentDate)}`;
    }
    if (currentView === "day") {
      return formatDate(currentDate);
    }
    return "Agenda";
  })();

  if (isLoading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text variant="body">Loading calendar...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text variant="body" className="text-danger">
            {error}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <CalendarHeader
          title={title}
          view={currentView}
          onViewChange={handleViewChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={goToToday}
        />

        {currentView === "month" && (
          <MonthView
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            selectedDate={selectedDate}
            events={events}
            onDateSelect={handleDateSelect}
          />
        )}

        {currentView === "week" && (
          <WeekView
            startDate={formatDate(currentDate)}
            selectedDate={selectedDate}
            events={events}
            onDateSelect={handleDateSelect}
          />
        )}

        {currentView === "day" && (
          <DayView
            date={selectedDate ?? formatDate(currentDate)}
            events={selectedDayEvents}
            summary={selectedDaySummary}
          />
        )}

        {currentView === "agenda" && <Agenda items={agenda} />}

        {currentView === "month" && monthSummary && (
          <View className="mt-4 p-4 rounded-xl" style={{ backgroundColor: theme.colors.surface }}>
            <Text variant="body" className="font-semibold mb-2">
              Monthly Summary
            </Text>
            <View className="flex-row justify-between">
              <Text variant="body" className="text-secondary">
                Attendance
              </Text>
              <Text variant="body" className="font-semibold">
                {monthSummary.attendancePercentage}%
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text variant="body" className="text-secondary">
                Lectures
              </Text>
              <Text variant="body">{monthSummary.totalLectures}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text variant="body" className="text-secondary">
                Present
              </Text>
              <Text variant="body" className="text-success">
                {monthSummary.totalPresent}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text variant="body" className="text-secondary">
                Absent
              </Text>
              <Text variant="body" className="text-danger">
                {monthSummary.totalAbsent}
              </Text>
            </View>
          </View>
        )}

        {currentView === "week" && weekSummary && (
          <View className="mt-4 p-4 rounded-xl" style={{ backgroundColor: theme.colors.surface }}>
            <Text variant="body" className="font-semibold mb-2">
              Weekly Summary
            </Text>
            <View className="flex-row justify-between">
              <Text variant="body" className="text-secondary">
                Attendance
              </Text>
              <Text variant="body" className="font-semibold">
                {weekSummary.attendancePercentage}%
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text variant="body" className="text-secondary">
                Lectures
              </Text>
              <Text variant="body">{weekSummary.totalLectures}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
