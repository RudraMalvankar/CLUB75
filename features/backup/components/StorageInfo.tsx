import React from "react";
import { View } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Caption } from "@/components/ui/typography/Caption";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";

type StorageInfoProps = {
  readonly totalRecords: number;
  readonly recordCounts: Record<string, number>;
};

export function StorageInfo({ totalRecords, recordCounts }: StorageInfoProps) {
  const { theme } = useTheme();

  const entries = Object.entries(recordCounts).filter(([_, count]) => count > 0);

  return (
    <Card
      className="p-4 bg-surface border border-border mb-4"
      style={{ borderRadius: theme.radius.md }}
    >
      <Heading variant="headingM" className="text-textPrimary mb-3">
        Storage Information
      </Heading>

      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          Total Records
        </Text>
        <Text variant="bodyLarge" className="text-textPrimary">
          {totalRecords.toLocaleString()}
        </Text>
      </View>

      {entries.map(([key, count]) => (
        <View key={key} className="flex-row justify-between mb-1">
          <Caption className="text-textSecondary capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </Caption>
          <Caption className="text-textPrimary">{count.toLocaleString()}</Caption>
        </View>
      ))}
    </Card>
  );
}
