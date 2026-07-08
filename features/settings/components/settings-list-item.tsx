import { Pressable, View } from "react-native";

import { Badge } from "@/components/ui/badge/Badge";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import type { SettingsSection } from "../types";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";

type SettingsListItemProps = {
  section: SettingsSection;
  onPress: () => void;
  badge?: string;
  badgeVariant?: BadgeVariant;
};

export function SettingsListItem({
  section,
  onPress,
  badge,
  badgeVariant = "primary",
}: SettingsListItemProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between border-b p-4 active:opacity-70"
      style={{
        borderColor: theme.colors.border,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Text variant="bodyLarge">{section.icon}</Text>
        <Text variant="body">{section.title}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        <Text variant="body">›</Text>
      </View>
    </Pressable>
  );
}
