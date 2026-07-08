import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Label } from "@/components/ui/typography/Label";

type InputLabelProps = ViewProps & {
  readonly label: string;
  readonly required?: boolean;
  readonly error?: boolean;
};

export function InputLabel({
  label,
  required = false,
  error = false,
  style,
  ...rest
}: InputLabelProps) {
  const { theme } = useTheme();

  return (
    <View style={[{ marginBottom: theme.spacing.xs }, style]} {...rest}>
      <Label size="sm">
        {label}
        {required && (
          <Label size="sm" color={theme.colors.danger} style={{ marginLeft: 2 }}>
            *
          </Label>
        )}
      </Label>
    </View>
  );
}
