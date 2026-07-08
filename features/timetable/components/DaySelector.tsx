import { Pressable, ScrollView, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";
import type { DayOfWeek, TimetableDay } from "../types";
import { DAY_SHORT_LABELS } from "../types";

type DaySelectorProps = {
  readonly days: TimetableDay[];
  readonly selectedDay: DayOfWeek;
  readonly onSelectDay: (day: DayOfWeek) => void;
};

export function DaySelector({ days, selectedDay, onSelectDay }: DaySelectorProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacing.sm, paddingVertical: theme.spacing.sm }}
    >
      {days.map((day) => {
        const isSelected = day.day === selectedDay;
        const hasLectures = day.lectures.length > 0;

        return (
          <Pressable
            key={day.day}
            onPress={() => onSelectDay(day.day)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View
              style={{
                alignItems: "center",
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.radius.md,
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                borderWidth: 1,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                minWidth: 60,
              }}
            >
              <Text
                variant="body"
                style={{
                  fontWeight: theme.fontWeights.semiBold,
                  color: isSelected ? theme.colors.background : theme.colors.textPrimary,
                }}
              >
                {DAY_SHORT_LABELS[day.day]}
              </Text>
              {hasLectures && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isSelected ? theme.colors.background : theme.colors.primary,
                    marginTop: theme.spacing.xs,
                  }}
                />
              )}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
