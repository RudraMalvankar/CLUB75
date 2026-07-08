import { Pressable, View, type PressableProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";

type ListItemProps = PressableProps & {
  readonly title: string;
  readonly subtitle?: string;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
  readonly showDivider?: boolean;
};

export function ListItem({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  showDivider = true,
  style,
  ...rest
}: ListItemProps) {
  const { theme } = useTheme();

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.screenPadding,
            gap: theme.spacing.md,
            opacity: pressed ? 0.8 : 1,
            minHeight: theme.layout.touchTargetMin,
          },
          typeof style === "function" ? style({ pressed }) : style,
        ]}
        accessibilityRole="button"
        {...rest}
      >
        {leftIcon && <View>{leftIcon}</View>}
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <Text variant="body">{title}</Text>
          {subtitle && (
            <Caption variant="caption" color={theme.colors.textSecondary}>
              {subtitle}
            </Caption>
          )}
        </View>
        {rightIcon && <View>{rightIcon}</View>}
      </Pressable>
      {showDivider && <View className="bg-divider" style={{ height: 1, marginLeft: 56 }} />}
    </>
  );
}
