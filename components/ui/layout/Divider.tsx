import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type DividerProps = ViewProps & {
  readonly vertical?: boolean;
};

export function Divider({ vertical = false, style, ...rest }: DividerProps) {
  const { theme } = useTheme();

  return (
    <View
      className="bg-divider"
      style={[
        vertical
          ? { width: 1, height: "100%", marginHorizontal: theme.spacing.sm }
          : { height: 1, width: "100%", marginVertical: theme.spacing.sm },
        style,
      ]}
      {...rest}
    />
  );
}
