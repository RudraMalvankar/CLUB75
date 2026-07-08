import { Text, type TextProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type IconSize = "sm" | "md" | "lg" | "xl";

type IconProps = TextProps & {
  readonly name: string;
  readonly size?: IconSize;
  readonly color?: string;
};

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function Icon({ name, size = "md", color, style, ...rest }: IconProps) {
  const { theme } = useTheme();
  const iconSize = sizeMap[size];

  return (
    <Text
      style={[
        {
          fontSize: iconSize,
          lineHeight: iconSize,
          color: color || theme.colors.textPrimary,
        },
        style,
      ]}
      accessibilityLabel={name}
      {...rest}
    >
      {name}
    </Text>
  );
}
