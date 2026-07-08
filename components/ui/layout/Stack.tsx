import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type StackDirection = "horizontal" | "vertical";

type StackProps = ViewProps & {
  readonly direction?: StackDirection;
  readonly gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  readonly align?: "flex-start" | "center" | "flex-end" | "stretch";
  readonly justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  readonly wrap?: boolean;
  readonly children: React.ReactNode;
};

export function Stack({
  direction = "vertical",
  gap = "md",
  align = "stretch",
  justify = "flex-start",
  wrap = false,
  style,
  children,
  ...rest
}: StackProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: direction === "horizontal" ? "row" : "column",
          gap: theme.spacing[gap],
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? "wrap" : "nowrap",
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
