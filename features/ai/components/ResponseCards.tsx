import React from "react";
import { View } from "react-native";

import { Badge } from "@/components/ui/badge/Badge";
import { Card } from "@/components/ui/card/Card";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import type {
  AIResponseCard,
  RecoveryPlan,
  WeeklyPlan,
  AttendanceExplanation,
} from "@/features/ai/types";

type ResponseCardProps = {
  readonly card: AIResponseCard;
};

export function ResponseCard({ card }: ResponseCardProps) {
  const { theme } = useTheme();

  return (
    <Card
      className="mb-3 p-4 bg-surface border border-border"
      style={{ borderRadius: theme.radius.md }}
    >
      {card.type === "summary" && <SummaryCard data={card.data} />}
      {card.type === "recovery" && <RecoveryCard data={card.data} />}
      {card.type === "weeklyPlan" && <WeeklyPlanCard data={card.data} />}
      {card.type === "attendanceExplanation" && <AttendanceExplanationCard data={card.data} />}
    </Card>
  );
}

function SummaryCard({
  data,
}: {
  readonly data: {
    overallPercentage: number;
    goalPercentage: number;
    status: string;
    safeBunks: number;
  };
}) {
  return (
    <View>
      <Heading variant="headingM" className="text-textPrimary mb-2">
        Attendance Summary
      </Heading>
      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          Current
        </Text>
        <Text variant="bodyLarge" className="text-textPrimary">
          {data.overallPercentage}%
        </Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          Goal
        </Text>
        <Text variant="bodyLarge" className="text-textPrimary">
          {data.goalPercentage}%
        </Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          Status
        </Text>
        <Badge
          variant={
            data.status === "critical"
              ? "danger"
              : data.status === "warning"
                ? "warning"
                : "success"
          }
        >
          {data.status}
        </Badge>
      </View>
      <View className="flex-row justify-between">
        <Text variant="body" className="text-textSecondary">
          Safe Bunks
        </Text>
        <Text variant="bodyLarge" className="text-textPrimary">
          {data.safeBunks}
        </Text>
      </View>
    </View>
  );
}

function RecoveryCard({ data }: { readonly data: RecoveryPlan }) {
  return (
    <View>
      <Heading variant="headingM" className="text-textPrimary mb-2">
        Recovery Plan
      </Heading>
      <Text variant="body" className="text-textSecondary mb-1">
        Subject: {data.subjectName}
      </Text>
      <Text variant="body" className="text-textSecondary mb-1">
        Current: {data.currentPercentage}%
      </Text>
      <Text variant="body" className="text-textSecondary mb-1">
        Target: {data.targetPercentage}%
      </Text>
      <Text variant="bodyLarge" className="text-primary mb-2">
        Attend {data.lecturesNeeded} more lectures
      </Text>
      <Text variant="body" className="text-textPrimary">
        {data.strategy}
      </Text>
    </View>
  );
}

function WeeklyPlanCard({ data }: { readonly data: WeeklyPlan }) {
  return (
    <View>
      <Heading variant="headingM" className="text-textPrimary mb-2">
        Weekly Plan
      </Heading>
      {data.subjects.map((s, i) => (
        <View key={`${data.day}-${i}`} className="flex-row items-center mb-1">
          <Badge
            variant={
              s.priority === "high" ? "danger" : s.priority === "medium" ? "warning" : "success"
            }
            className="mr-2"
          >
            {s.priority}
          </Badge>
          <Text variant="body" className="text-textPrimary">
            {s.name}
          </Text>
        </View>
      ))}
    </View>
  );
}

function AttendanceExplanationCard({ data }: { readonly data: AttendanceExplanation }) {
  return (
    <View>
      <Heading variant="headingM" className="text-textPrimary mb-2">
        {data.subjectName}
      </Heading>
      <Text variant="bodyLarge" className="text-primary mb-2">
        {data.percentage}% Attendance
      </Text>
      <Text variant="body" className="text-textPrimary mb-1">
        {data.explanation}
      </Text>
      <Text variant="body" className="text-textSecondary">
        Trend: {data.trend}
      </Text>
      <Text variant="body" className="text-textSecondary">
        Risk: {data.risk}
      </Text>
    </View>
  );
}
