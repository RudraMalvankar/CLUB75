import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

type ScreenProps = ViewProps & {
  readonly padded?: boolean;
};

export function Screen({ padded = true, style, children, ...rest }: ScreenProps) {
  const { theme } = useTheme();
  const responsive = useResponsiveLayout();

  return (
    <View
      className="flex-1 bg-background"
      style={[
        padded && {
          paddingHorizontal: theme.spacing.screenPadding,
          paddingTop: responsive.insets.top + theme.spacing.lg,
          paddingBottom: responsive.insets.bottom + theme.spacing.lg,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
