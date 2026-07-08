import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type CardProps = ViewProps & {
  readonly padded?: boolean;
  readonly children: React.ReactNode;
};

export function Card({ padded = true, style, children, ...rest }: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      className="bg-card border border-border"
      style={[
        {
          borderRadius: theme.radius.lg,
          overflow: "hidden",
        },
        padded && {
          padding: theme.spacing.cardPadding,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
