import { Text, type TextProps, type TextStyle } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type HeadingVariant = "displayXL" | "displayL" | "displayM" | "headingXL" | "headingL" | "headingM";

type HeadingProps = TextProps & {
  readonly variant?: HeadingVariant;
  readonly color?: TextStyle["color"];
  readonly align?: TextStyle["textAlign"];
  readonly children: React.ReactNode;
};

export function Heading({
  variant = "headingL",
  color,
  align,
  style,
  children,
  ...rest
}: HeadingProps) {
  const { theme } = useTheme();
  const typography = theme.typography[variant];

  return (
    <Text
      className="text-foreground"
      style={[typography, { color, textAlign: align }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
