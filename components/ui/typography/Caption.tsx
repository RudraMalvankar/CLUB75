import { Text, type TextProps, type TextStyle } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type CaptionVariant = "caption" | "micro";

type CaptionProps = TextProps & {
  readonly variant?: CaptionVariant;
  readonly color?: TextStyle["color"];
  readonly align?: TextStyle["textAlign"];
  readonly children: React.ReactNode;
};

export function Caption({
  variant = "caption",
  color,
  align,
  style,
  children,
  ...rest
}: CaptionProps) {
  const { theme } = useTheme();
  const typography = theme.typography[variant];

  return (
    <Text
      className="text-foreground-muted"
      style={[typography, { color, textAlign: align }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
