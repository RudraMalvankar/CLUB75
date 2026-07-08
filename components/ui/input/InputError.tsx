import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Caption } from "@/components/ui/typography/Caption";

type InputErrorProps = ViewProps & {
  readonly message: string;
};

export function InputError({ message, style, ...rest }: InputErrorProps) {
  const { theme } = useTheme();

  return (
    <View style={[{ marginTop: theme.spacing.xs }, style]} {...rest}>
      <Caption variant="caption" color={theme.colors.danger}>
        {message}
      </Caption>
    </View>
  );
}
