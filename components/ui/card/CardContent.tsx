import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type CardContentProps = ViewProps & {
  readonly children: React.ReactNode;
};

export function CardContent({ style, children, ...rest }: CardContentProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          gap: theme.spacing.sm,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
