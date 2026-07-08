import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type CardHeaderProps = ViewProps & {
  readonly children: React.ReactNode;
};

export function CardHeader({ style, children, ...rest }: CardHeaderProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          gap: theme.spacing.xs,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
