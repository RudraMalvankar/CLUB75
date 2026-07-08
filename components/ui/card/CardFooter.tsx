import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type CardFooterProps = ViewProps & {
  readonly children: React.ReactNode;
};

export function CardFooter({ style, children, ...rest }: CardFooterProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
          marginTop: theme.spacing.sm,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
