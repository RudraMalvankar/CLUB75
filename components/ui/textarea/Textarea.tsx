import { useState, useCallback } from "react";
import { TextInput, View, type TextInputProps, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Label } from "@/components/ui/typography/Label";
import { Caption } from "@/components/ui/typography/Caption";

type TextareaProps = Omit<TextInputProps, "placeholderTextColor" | "multiline"> & {
  readonly containerProps?: ViewProps;
  readonly label?: string;
  readonly error?: string;
  readonly hint?: string;
  readonly minHeight?: number;
};

export function Textarea({
  containerProps,
  label,
  error,
  hint,
  minHeight = 100,
  style,
  ...rest
}: TextareaProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <View {...containerProps}>
      {label && (
        <Label size="sm" style={{ marginBottom: theme.spacing.xs }}>
          {label}
        </Label>
      )}
      <TextInput
        className="bg-surface border"
        multiline
        style={[
          {
            minHeight,
            borderRadius: theme.radius.sm,
            borderWidth: 1,
            borderColor: error
              ? theme.colors.danger
              : isFocused
                ? theme.colors.primary
                : theme.colors.border,
            padding: theme.spacing.md,
            fontSize: 14,
            lineHeight: 22,
            color: theme.colors.textPrimary,
            textAlignVertical: "top",
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textDisabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {error && (
        <Caption
          variant="caption"
          color={theme.colors.danger}
          style={{ marginTop: theme.spacing.xs }}
        >
          {error}
        </Caption>
      )}
      {hint && !error && (
        <Caption
          variant="caption"
          color={theme.colors.textSecondary}
          style={{ marginTop: theme.spacing.xs }}
        >
          {hint}
        </Caption>
      )}
    </View>
  );
}
