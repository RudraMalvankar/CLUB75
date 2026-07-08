import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type SectionProps = ViewProps & {
  readonly gap?: boolean;
  readonly children: React.ReactNode;
};

export function Section({ gap = true, style, children, ...rest }: SectionProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        gap && {
          gap: theme.spacing.cardGap,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
