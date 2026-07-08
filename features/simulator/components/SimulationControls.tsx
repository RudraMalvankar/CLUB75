import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Button } from "@/components/ui/button/Button";
import { Card } from "@/components/ui/card/Card";
import type { SimulationPreset } from "../types";
import { SIMULATION_PRESETS } from "../types";

type SimulationControlsProps = {
  readonly futurePresent: number;
  readonly futureAbsent: number;
  readonly onPresentChange: (value: number) => void;
  readonly onAbsentChange: (value: number) => void;
  readonly onPreset: (preset: SimulationPreset) => void;
  readonly onReset: () => void;
};

export function SimulationControls({
  futurePresent,
  futureAbsent,
  onPresentChange,
  onAbsentChange,
  onPreset,
  onReset,
}: SimulationControlsProps) {
  const { theme } = useTheme();

  const quickAdjustments = [
    { label: "+1", value: 1 },
    { label: "+5", value: 5 },
    { label: "+10", value: 10 },
  ];

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Heading variant="headingM">Simulation Controls</Heading>

      <Card>
        <View style={{ gap: theme.spacing.md }}>
          <View style={{ gap: theme.spacing.sm }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                Attend More
              </Text>
              <Text
                variant="body"
                style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.success }}
              >
                +{futurePresent}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
              {quickAdjustments.map((adj) => (
                <Button
                  key={`present-${adj.value}`}
                  variant="outline"
                  size="sm"
                  onPress={() => onPresentChange(futurePresent + adj.value)}
                >
                  {adj.label}
                </Button>
              ))}
              <Button variant="ghost" size="sm" onPress={() => onPresentChange(0)}>
                Reset
              </Button>
            </View>
          </View>

          <View style={{ gap: theme.spacing.sm }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                Miss More
              </Text>
              <Text
                variant="body"
                style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.danger }}
              >
                +{futureAbsent}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
              {quickAdjustments.map((adj) => (
                <Button
                  key={`absent-${adj.value}`}
                  variant="outline"
                  size="sm"
                  onPress={() => onAbsentChange(futureAbsent + adj.value)}
                >
                  {adj.label}
                </Button>
              ))}
              <Button variant="ghost" size="sm" onPress={() => onAbsentChange(0)}>
                Reset
              </Button>
            </View>
          </View>
        </View>
      </Card>

      <View style={{ gap: theme.spacing.sm }}>
        <Caption variant="caption" color={theme.colors.textSecondary}>
          Quick Presets
        </Caption>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
          {SIMULATION_PRESETS.map((preset) => (
            <Button key={preset.id} variant="outline" size="sm" onPress={() => onPreset(preset)}>
              {preset.label}
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
}
