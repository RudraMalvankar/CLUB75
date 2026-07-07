import { View, type ViewProps } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

type AppShellProps = ViewProps;

export function AppShell({ style, children, ...rest }: AppShellProps) {
  const responsive = useResponsiveLayout();

  return (
    <View
      className="flex-1 bg-background"
      style={[
        {
          paddingTop: responsive.insets.top,
          paddingBottom: responsive.insets.bottom,
          paddingLeft: responsive.insets.left,
          paddingRight: responsive.insets.right,
        },
        style,
      ]}
      {...rest}
    >
      <View className="flex-1">{children}</View>
    </View>
  );
}
