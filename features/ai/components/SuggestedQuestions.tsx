import React from "react";
import { ScrollView, Pressable } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_SUGGESTED_QUESTIONS, type AISuggestedQuestion } from "@/features/ai/types";

type SuggestedQuestionsProps = {
  readonly onSelect: (question: string) => void;
  readonly questions?: readonly AISuggestedQuestion[];
};

export function SuggestedQuestions({
  onSelect,
  questions = DEFAULT_SUGGESTED_QUESTIONS,
}: SuggestedQuestionsProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ gap: theme.spacing.sm }}
    >
      {questions.map((q) => (
        <Pressable key={q.id} onPress={() => onSelect(q.question)}>
          <Card
            className="px-4 py-2 bg-surface border border-border"
            style={{ borderRadius: theme.radius.pill }}
          >
            <Text variant="body" className="text-textPrimary whitespace-nowrap">
              {q.icon ? `${q.icon} ` : ""}
              {q.question}
            </Text>
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}
