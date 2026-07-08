import { ScrollView, RefreshControl } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { Stack } from "@/components/ui/layout/Stack";
import { useAnalytics } from "../hooks/useAnalytics";
import {
  AttendanceSummaryCard,
  QuickStats,
  AttendanceTrendCard,
  SubjectPerformance,
  RiskAnalysisCard,
  RecommendationsCard,
  DistributionChart,
  ConsistencyCard,
  AnalyticsEmptyState,
  AnalyticsLoading,
  AnalyticsError,
} from "../components";

export function AnalyticsScreen() {
  const { theme } = useTheme();
  const { dashboard, isLoading, error, timeRange, setTimeRange, refresh } = useAnalytics();

  if (isLoading) {
    return (
      <Screen>
        <AnalyticsLoading />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <AnalyticsError message={error} onRetry={refresh} />
      </Screen>
    );
  }

  if (dashboard.summary.totalLectures === 0) {
    return (
      <Screen>
        <AnalyticsEmptyState onAction={() => {}} />
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
          <Heading variant="headingL">Analytics</Heading>

          <AttendanceSummaryCard summary={dashboard.summary} />

          <QuickStats summary={dashboard.summary} />

          <AttendanceTrendCard
            trend={dashboard.trend}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          <DistributionChart distribution={dashboard.distribution} />

          <SubjectPerformance subjects={dashboard.subjects} />

          <RiskAnalysisCard risks={dashboard.risks} />

          <ConsistencyCard consistency={dashboard.consistency} />

          <RecommendationsCard recommendations={dashboard.recommendations} />
        </Stack>
      </ScrollView>
    </Screen>
  );
}
