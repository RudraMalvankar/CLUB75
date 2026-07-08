import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type ContainerProps = ViewProps & {
  readonly padded?: boolean;
  readonly children: React.ReactNode;
};

export function Container({ padded = true, style, children, ...rest }: ContainerProps) {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 bg-background"
      style={[
        padded && {
          paddingHorizontal: theme.spacing.screenPadding,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
