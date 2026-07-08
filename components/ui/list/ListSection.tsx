import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Caption } from "@/components/ui/typography/Caption";

type ListSectionProps = ViewProps & {
  readonly title?: string;
  readonly children: React.ReactNode;
};

export function ListSection({ title, style, children, ...rest }: ListSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={[{ gap: theme.spacing.xs }, style]} {...rest}>
      {title && (
        <Caption
          variant="micro"
          color={theme.colors.textSecondary}
          style={{
            paddingHorizontal: theme.spacing.screenPadding,
            paddingTop: theme.spacing.lg,
            paddingBottom: theme.spacing.xs,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Caption>
      )}
      <View
        className="bg-surface"
        style={{
          borderRadius: theme.radius.md,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}
