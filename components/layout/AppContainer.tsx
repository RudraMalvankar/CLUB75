import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { SafeArea } from "@/components/layout/SafeArea";

type AppContainerProps = ViewProps;

export function AppContainer({ style, children, ...rest }: AppContainerProps) {
  const { theme } = useTheme();

  return (
    <SafeArea style={[{ backgroundColor: theme.colors.background }, style]} {...rest}>
      <View className="flex-1" {...rest}>
        {children}
      </View>
    </SafeArea>
  );
}
