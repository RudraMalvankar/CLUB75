import { View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";

type SafeAreaProps = ViewProps & {
  readonly top?: boolean;
  readonly bottom?: boolean;
  readonly left?: boolean;
  readonly right?: boolean;
};

export function SafeArea({
  top = true,
  bottom = true,
  left = false,
  right = false,
  style,
  children,
  ...rest
}: SafeAreaProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          paddingTop: top ? insets.top + theme.spacing.lg : 0,
          paddingBottom: bottom ? insets.bottom + theme.spacing.lg : 0,
          paddingLeft: left ? insets.left : 0,
          paddingRight: right ? insets.right : 0,
          flex: 1,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
