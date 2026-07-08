import { ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Stack } from "@/components/ui/layout/Stack";
import { Heading } from "@/components/ui/typography/Heading";
import { Spacer } from "@/components/ui/layout/Spacer";
import { useSimulation } from "@/features/simulator/hooks/useSimulation";
import { CurrentAttendance } from "@/features/simulator/components/CurrentAttendance";
import { SimulationControls } from "@/features/simulator/components/SimulationControls";
import { PredictionCard } from "@/features/simulator/components/PredictionCard";
import { SubjectSelector } from "@/features/simulator/components/SubjectSelector";
import { ScenarioComparison } from "@/features/simulator/components/ScenarioComparison";
import { SimulationInsights } from "@/features/simulator/components/SimulationInsights";
import { SimulationRecommendations } from "@/features/simulator/components/SimulationRecommendations";
import { SimulatorLoading } from "@/features/simulator/components/SimulatorLoading";
import { SimulatorError } from "@/features/simulator/components/SimulatorError";
import { SimulatorEmptyState } from "@/features/simulator/components/SimulatorEmptyState";

export default function SimulatorScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const {
    subjects,
    isLoading,
    error,
    result,
    scenarios,
    insights,
    recommendations,
    refresh,
    setFuturePresent,
    setFutureAbsent,
    applyPreset,
    reset: resetSimulation,
  } = useSimulation();

  const handleNavigateToAttendance = () => {
    router.navigate("/attendance");
  };

  if (isLoading) {
    return (
      <Screen>
        <SimulatorLoading />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <SimulatorError message={error} onRetry={refresh} />
      </Screen>
    );
  }

  if (!result) {
    return (
      <Screen>
        <SimulatorEmptyState onAction={handleNavigateToAttendance} />
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
          <Heading variant="headingL">Simulator</Heading>

          <SubjectSelector subjects={subjects} selectedSubjectId={null} onSelect={() => {}} />

          <CurrentAttendance result={result} />

          <SimulationControls
            futurePresent={0}
            futureAbsent={0}
            onPresentChange={setFuturePresent}
            onAbsentChange={setFutureAbsent}
            onPreset={applyPreset}
            onReset={resetSimulation}
          />

          <PredictionCard result={result} />

          <SimulationInsights insights={insights} />

          <SimulationRecommendations recommendations={recommendations} />

          <Spacer size="lg" />

          {scenarios.length > 0 && <ScenarioComparison scenarios={scenarios} />}
        </Stack>
      </ScrollView>
    </Screen>
  );
}
