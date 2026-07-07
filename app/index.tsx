import { APP_NAME } from "@/constants/app";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.spacing.screenPadding,
          paddingVertical: theme.spacing.sectionGap,
        },
      ]}
    >
      <Text style={[theme.typography.headingL, { color: theme.colors.textPrimary }]}>
        {APP_NAME}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
