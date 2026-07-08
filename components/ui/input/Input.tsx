import { useState, useCallback } from "react";
import { TextInput, View, type TextInputProps, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Label } from "@/components/ui/typography/Label";
import { Caption } from "@/components/ui/typography/Caption";

type InputSize = "sm" | "md" | "lg";

type InputProps = Omit<TextInputProps, "placeholderTextColor"> & {
  readonly containerProps?: ViewProps;
  readonly label?: string;
  readonly error?: string;
  readonly hint?: string;
  readonly size?: InputSize;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
};

export function Input({
  containerProps,
  label,
  error,
  hint,
  size = "md",
  leftIcon,
  rightIcon,
  style,
  ...rest
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const sizeStyles: Record<
    InputSize,
    { height: number; fontSize: number; paddingHorizontal: number }
  > = {
    sm: { height: 36, fontSize: 12, paddingHorizontal: theme.spacing.md },
    md: { height: 44, fontSize: 14, paddingHorizontal: theme.spacing.lg },
    lg: { height: 52, fontSize: 16, paddingHorizontal: theme.spacing.xl },
  };

  const currentSize = sizeStyles[size];

  return (
    <View {...containerProps}>
      {label && (
        <Label size="sm" style={{ marginBottom: theme.spacing.xs }}>
          {label}
        </Label>
      )}
      <View
        className="bg-surface border"
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            height: currentSize.height,
            borderRadius: theme.radius.sm,
            borderWidth: 1,
            borderColor: error
              ? theme.colors.danger
              : isFocused
                ? theme.colors.primary
                : theme.colors.border,
            paddingLeft: leftIcon ? theme.spacing.sm : 0,
            paddingRight: rightIcon ? theme.spacing.sm : 0,
          },
        ]}
      >
        {leftIcon && <View style={{ marginRight: theme.spacing.sm }}>{leftIcon}</View>}
        <TextInput
          style={[
            {
              flex: 1,
              height: "100%",
              fontSize: currentSize.fontSize,
              color: theme.colors.textPrimary,
              paddingHorizontal: leftIcon ? 0 : theme.spacing.md,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textDisabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {rightIcon && <View style={{ marginLeft: theme.spacing.sm }}>{rightIcon}</View>}
      </View>
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
