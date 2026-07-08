import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";

type ListHeaderProps = ViewProps & {
  readonly title: string;
  readonly action?: React.ReactNode;
};

export function ListHeader({ title, action, style, ...rest }: ListHeaderProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: theme.spacing.screenPadding,
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
      {...rest}
    >
      <Heading variant="headingM">{title}</Heading>
      {action}
    </View>
  );
}
