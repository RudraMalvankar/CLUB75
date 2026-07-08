import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

type SpacerProps = ViewProps & {
  readonly size?: SpacerSize;
};

export function Spacer({ size = "md", style, ...rest }: SpacerProps) {
  const { theme } = useTheme();

  return <View style={[{ height: theme.spacing[size] }, style]} {...rest} />;
}
