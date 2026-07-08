import { View, Pressable } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import type { SimulationSubject } from "../types";

type SubjectSelectorProps = {
  readonly subjects: SimulationSubject[];
  readonly selectedSubjectId: string | null;
  readonly onSelect: (subjectId: string | null) => void;
};

export function SubjectSelector({ subjects, selectedSubjectId, onSelect }: SubjectSelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Subject</Heading>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
        <Pressable
          onPress={() => onSelect(null)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Card
            style={{
              borderColor: selectedSubjectId === null ? theme.colors.primary : theme.colors.border,
              borderWidth: selectedSubjectId === null ? 2 : 1,
            }}
          >
            <View style={{ gap: theme.spacing.xs, minWidth: 100 }}>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                Overall
              </Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                All subjects
              </Caption>
            </View>
          </Card>
        </Pressable>

        {subjects.slice(0, 6).map((subject) => (
          <Pressable
            key={subject.id}
            onPress={() => onSelect(subject.id)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Card
              style={{
                borderColor: selectedSubjectId === subject.id ? subject.color : theme.colors.border,
                borderWidth: selectedSubjectId === subject.id ? 2 : 1,
              }}
            >
              <View style={{ gap: theme.spacing.xs, minWidth: 100 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.xs }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: subject.color,
                    }}
                  />
                  <Text
                    variant="body"
                    style={{ fontWeight: theme.fontWeights.medium }}
                    numberOfLines={1}
                  >
                    {subject.name}
                  </Text>
                </View>
                <Caption variant="caption" color={theme.colors.textSecondary}>
                  {subject.currentPercentage}%
                </Caption>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
