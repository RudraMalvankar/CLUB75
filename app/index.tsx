import { APP_NAME } from "@/constants/app";
import { MoonStar, Smartphone, SunMedium, useIconProps } from "@/constants/icons";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView, Text, View } from "react-native";

export default function HomeScreen() {
  const { theme, preference } = useTheme();
  const responsive = useResponsiveLayout();
  const iconProps = useIconProps({ size: theme.icons.size.md });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View
        className="flex-1 justify-center gap-4 px-screen-padding"
        style={{
          paddingTop: Math.max(theme.spacing.sectionGap, responsive.insets.top + theme.spacing.lg),
          paddingBottom: Math.max(
            theme.spacing.sectionGap,
            responsive.insets.bottom + theme.spacing.lg,
          ),
        }}
      >
        <View className="flex-row items-center gap-3">
          <SunMedium {...iconProps} />
          <MoonStar {...iconProps} />
          <Smartphone {...iconProps} />
        </View>
        <Text className="text-heading-l font-semibold text-foreground">{APP_NAME}</Text>
        <Text className="text-body text-foreground-muted">
          Design infrastructure ready. Theme: {theme.id}. Preference: {preference}. Orientation:{" "}
          {responsive.orientation}.
        </Text>
      </View>
    </SafeAreaView>
  );
}
