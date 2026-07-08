import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { IconButton } from "@/components/ui/button/IconButton";

type HeaderProps = ViewProps & {
  readonly title?: string;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
  readonly onLeftPress?: () => void;
  readonly onRightPress?: () => void;
  readonly leftAccessibilityLabel?: string;
  readonly rightAccessibilityLabel?: string;
};

export function Header({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  leftAccessibilityLabel,
  rightAccessibilityLabel,
  style,
  ...rest
}: HeaderProps) {
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
          minHeight: theme.layout.touchTargetMin,
        },
        style,
      ]}
      {...rest}
    >
      <View style={{ width: 44 }}>
        {leftIcon && onLeftPress && (
          <IconButton
            size="sm"
            accessibilityLabel={leftAccessibilityLabel || "Go back"}
            onPress={onLeftPress}
          >
            {leftIcon}
          </IconButton>
        )}
      </View>
      {title && (
        <Heading variant="headingM" style={{ flex: 1, textAlign: "center" }}>
          {title}
        </Heading>
      )}
      <View style={{ width: 44 }}>
        {rightIcon && onRightPress && (
          <IconButton
            size="sm"
            accessibilityLabel={rightAccessibilityLabel || "Menu"}
            onPress={onRightPress}
          >
            {rightIcon}
          </IconButton>
        )}
      </View>
    </View>
  );
}
