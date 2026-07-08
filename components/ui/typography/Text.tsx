import { Text as RNText, type TextProps, type TextStyle } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type TextVariant = "bodyLarge" | "body";

type TextComponentProps = TextProps & {
  readonly variant?: TextVariant;
  readonly color?: TextStyle["color"];
  readonly align?: TextStyle["textAlign"];
  readonly children: React.ReactNode;
};

export function Text({
  variant = "body",
  color,
  align,
  style,
  children,
  ...rest
}: TextComponentProps) {
  const { theme } = useTheme();
  const typography = theme.typography[variant];

  return (
    <RNText
      className="text-foreground"
      style={[typography, { color, textAlign: align }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
