import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import type { CalendarView } from "../types";

type CalendarHeaderProps = {
  title: string;
  subtitle?: string;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function CalendarHeader({
  title,
  subtitle,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const { theme } = useTheme();

  const views: CalendarView[] = ["month", "week", "day", "agenda"];

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text variant="bodyLarge" className="font-semibold">
            {title}
          </Text>
          {subtitle && (
            <Text variant="body" className="text-secondary">
              {subtitle}
            </Text>
          )}
        </View>
        <Pressable
          onPress={onToday}
          className="px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: `${theme.colors.primary}20` }}
        >
          <Text variant="body" className="text-sm" style={{ color: theme.colors.primary }}>
            Today
          </Text>
        </Pressable>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={onPrevious} className="p-2">
          <Text variant="body" className="text-lg">
            ‹
          </Text>
        </Pressable>
        <View className="flex-row gap-2">
          {views.map((v) => (
            <Pressable
              key={v}
              onPress={() => onViewChange(v)}
              className="px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: view === v ? theme.colors.primary : "transparent",
              }}
            >
              <Text
                variant="body"
                className="text-sm capitalize"
                style={{
                  color: view === v ? theme.colors.background : theme.colors.textSecondary,
                }}
              >
                {v}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={onNext} className="p-2">
          <Text variant="body" className="text-lg">
            ›
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
