import { Pressable, View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Caption } from "@/components/ui/typography/Caption";

type TabItem = {
  readonly key: string;
  readonly label: string;
  readonly icon: React.ReactNode;
};

type TabBarProps = ViewProps & {
  readonly tabs: TabItem[];
  readonly activeTab: string;
  readonly onTabPress: (key: string) => void;
};

export function TabBar({ tabs, activeTab, onTabPress, style, ...rest }: TabBarProps) {
  const { theme } = useTheme();

  return (
    <View
      className="bg-surface border-t border-border"
      style={[
        {
          flexDirection: "row",
          paddingBottom: theme.spacing.sm,
        },
        style,
      ]}
      {...rest}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: theme.spacing.sm,
              gap: theme.spacing.xs,
              minHeight: theme.layout.touchTargetMin,
            }}
            onPress={() => onTabPress(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View>{tab.icon}</View>
            <Caption
              variant="caption"
              color={isActive ? theme.colors.primary : theme.colors.textSecondary}
              style={{
                fontWeight: isActive ? theme.fontWeights.semiBold : theme.fontWeights.regular,
              }}
            >
              {tab.label}
            </Caption>
          </Pressable>
        );
      })}
    </View>
  );
}
