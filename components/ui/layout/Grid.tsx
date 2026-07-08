import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type GridProps = ViewProps & {
  readonly columns?: number;
  readonly gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  readonly children: React.ReactNode;
};

export function Grid({ columns = 2, gap = "md", style, children, ...rest }: GridProps) {
  const { theme } = useTheme();
  const gapValue = theme.spacing[gap];

  return (
    <View
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: gapValue,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

type GridItemProps = ViewProps & {
  readonly columns?: number;
  readonly totalColumns?: number;
  readonly children: React.ReactNode;
};

export function GridItem({
  columns = 1,
  totalColumns = 2,
  style,
  children,
  ...rest
}: GridItemProps) {
  const widthPercentage = (columns / totalColumns) * 100;

  return (
    <View style={[{ width: `${widthPercentage}%` as const }, style]} {...rest}>
      {children}
    </View>
  );
}
