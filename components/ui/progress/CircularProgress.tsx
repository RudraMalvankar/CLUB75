import { View, Text, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type CircularProgressProps = ViewProps & {
  readonly value: number;
  readonly max?: number;
  readonly size?: number;
  readonly strokeWidth?: number;
};

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  style,
  ...rest
}: CircularProgressProps) {
  const { theme } = useTheme();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...rest}
    >
      <View
        className="bg-secondary"
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: theme.colors.secondary,
        }}
      />
      <View
        className="bg-primary"
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: theme.colors.primary,
        }}
      />
      <Text
        style={{
          fontSize: size * 0.25,
          fontWeight: theme.fontWeights.semiBold,
          color: theme.colors.textPrimary,
        }}
      >
        {Math.round(percentage)}%
      </Text>
    </View>
  );
}
