import { View, Pressable, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";

type QuickAction = {
  id: string;
  label: string;
  icon: string;
  route: string;
};

type QuickActionsProps = {
  readonly onNavigate: (route: string) => void;
};

const quickActions: QuickAction[] = [
  { id: "attendance", label: "Attendance", icon: "✅", route: "/attendance" },
  { id: "timetable", label: "Timetable", icon: "📅", route: "/timetable" },
  { id: "analytics", label: "Analytics", icon: "📈", route: "/analytics" },
  { id: "settings", label: "Settings", icon: "⚙️", route: "/settings" },
];

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Quick Actions</Heading>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
        {quickActions.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => onNavigate(action.route)}
            style={({ pressed }) => ({
              width: "48%",
              minWidth: 140,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Card
              style={{
                alignItems: "center",
                paddingVertical: theme.spacing.lg,
              }}
            >
              <Text style={{ fontSize: 24 }}>{action.icon}</Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                {action.label}
              </Caption>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
