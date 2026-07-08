import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";

type GreetingHeaderProps = {
  readonly greeting: string;
  readonly date: string;
  readonly semesterName: string | null;
};

export function GreetingHeader({ greeting, date, semesterName }: GreetingHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <Heading variant="headingXL">{greeting}</Heading>
      <Text variant="bodyLarge" color={theme.colors.textSecondary}>
        {date}
      </Text>
      {semesterName && (
        <Caption variant="caption" color={theme.colors.textSecondary}>
          {semesterName}
        </Caption>
      )}
    </View>
  );
}
