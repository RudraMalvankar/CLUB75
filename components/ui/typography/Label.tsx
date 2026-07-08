import { Text, type TextProps, type TextStyle } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type LabelSize = "sm" | "md" | "lg";

type LabelProps = TextProps & {
  readonly size?: LabelSize;
  readonly color?: TextStyle["color"];
  readonly align?: TextStyle["textAlign"];
  readonly children: React.ReactNode;
};

const sizeStyles: Record<LabelSize, { fontSize: number; lineHeight: number }> = {
  sm: { fontSize: 12, lineHeight: 18 },
  md: { fontSize: 14, lineHeight: 22 },
  lg: { fontSize: 16, lineHeight: 24 },
};

export function Label({ size = "md", color, align, style, children, ...rest }: LabelProps) {
  const { theme } = useTheme();
  const typography = sizeStyles[size];

  return (
    <Text
      className="text-foreground"
      style={[
        {
          fontFamily: theme.fontFamilies.sans,
          fontSize: typography.fontSize,
          lineHeight: typography.lineHeight,
          fontWeight: theme.fontWeights.medium,
        },
        { color, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
