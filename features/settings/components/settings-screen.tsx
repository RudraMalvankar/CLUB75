import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { useTheme } from "@/hooks/useTheme";
import { SETTINGS_SECTIONS } from "../types";
import { SettingsListItem } from "./settings-list-item";
import { SettingsLoading } from "./settings-loading";
import { useSettings } from "../hooks/use-settings";

export function SettingsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isLoading } = useSettings();

  if (isLoading) {
    return <SettingsLoading />;
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Card>
        {SETTINGS_SECTIONS.map((section) => (
          <SettingsListItem
            key={section.id}
            section={section}
            onPress={() => router.push(section.route as any)}
          />
        ))}
      </Card>
    </ScrollView>
  );
}
