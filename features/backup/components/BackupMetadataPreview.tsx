import React from "react";
import { View } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Caption } from "@/components/ui/typography/Caption";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import type { BackupMetadata } from "../types";
import { formatBackupSize, calculateTotalRecords } from "../utils/backup-validator";

type BackupMetadataPreviewProps = {
  readonly metadata: BackupMetadata;
  readonly title?: string;
};

export function BackupMetadataPreview({
  metadata,
  title = "Backup Details",
}: BackupMetadataPreviewProps) {
  const { theme } = useTheme();
  const totalRecords = calculateTotalRecords(metadata);
  const date = new Date(metadata.createdAt);

  return (
    <Card
      className="p-4 bg-surface border border-border mb-4"
      style={{ borderRadius: theme.radius.md }}
    >
      <Heading variant="headingM" className="text-textPrimary mb-3">
        {title}
      </Heading>

      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          Date
        </Text>
        <Text variant="body" className="text-textPrimary">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          App Version
        </Text>
        <Text variant="body" className="text-textPrimary">
          v{metadata.appVersion}
        </Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          File Size
        </Text>
        <Text variant="body" className="text-textPrimary">
          {formatBackupSize(metadata.fileSize)}
        </Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          Total Records
        </Text>
        <Text variant="body" className="text-textPrimary">
          {totalRecords.toLocaleString()}
        </Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text variant="body" className="text-textSecondary">
          Platform
        </Text>
        <Text variant="body" className="text-textPrimary">
          {metadata.platform}
        </Text>
      </View>

      <View className="mt-2 pt-2 border-t border-border">
        <Caption className="text-textSecondary mb-1">Record Breakdown</Caption>
        <View className="flex-row flex-wrap gap-2">
          {metadata.recordCounts.semesters > 0 && (
            <Caption className="text-textSecondary">
              {metadata.recordCounts.semesters} semesters
            </Caption>
          )}
          {metadata.recordCounts.subjects > 0 && (
            <Caption className="text-textSecondary">
              {metadata.recordCounts.subjects} subjects
            </Caption>
          )}
          {metadata.recordCounts.attendance > 0 && (
            <Caption className="text-textSecondary">
              {metadata.recordCounts.attendance} attendance
            </Caption>
          )}
          {metadata.recordCounts.timetable > 0 && (
            <Caption className="text-textSecondary">
              {metadata.recordCounts.timetable} timetable
            </Caption>
          )}
          {metadata.recordCounts.goals > 0 && (
            <Caption className="text-textSecondary">{metadata.recordCounts.goals} goals</Caption>
          )}
        </View>
      </View>
    </Card>
  );
}
