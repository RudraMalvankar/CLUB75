import React from "react";
import { View, Pressable } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Caption } from "@/components/ui/typography/Caption";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { useTheme } from "@/hooks/useTheme";
import type { BackupMetadata } from "../types";
import {
  formatBackupSize,
  formatRecordCount,
  calculateTotalRecords,
} from "../utils/backup-validator";

type BackupCardProps = {
  readonly name: string;
  readonly metadata: BackupMetadata;
  readonly onRestore?: () => void;
  readonly onDelete?: () => void;
};

export function BackupCard({ name, metadata, onRestore, onDelete }: BackupCardProps) {
  const { theme } = useTheme();
  const totalRecords = calculateTotalRecords(metadata);
  const date = new Date(metadata.createdAt);

  return (
    <Card
      className="p-4 bg-surface border border-border mb-3"
      style={{ borderRadius: theme.radius.md }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-2">
          <Heading variant="headingM" className="text-textPrimary mb-1">
            {name}
          </Heading>
          <Caption className="text-textSecondary">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </Caption>
        </View>
        <Caption className="text-textSecondary">v{metadata.appVersion}</Caption>
      </View>

      <View className="flex-row flex-wrap gap-2 mb-3">
        <View className="bg-background px-2 py-1 rounded" style={{ borderRadius: theme.radius.sm }}>
          <Caption className="text-textSecondary">{formatBackupSize(metadata.fileSize)}</Caption>
        </View>
        <View className="bg-background px-2 py-1 rounded" style={{ borderRadius: theme.radius.sm }}>
          <Caption className="text-textSecondary">
            {formatRecordCount(totalRecords)} records
          </Caption>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-1 mb-3">
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
      </View>

      <View className="flex-row gap-2">
        {onRestore && (
          <Pressable
            onPress={onRestore}
            className="bg-primary px-4 py-2 rounded"
            style={{ borderRadius: theme.radius.sm }}
          >
            <Text variant="body" className="text-white">
              Restore
            </Text>
          </Pressable>
        )}
        {onDelete && (
          <Pressable
            onPress={onDelete}
            className="bg-danger/10 px-4 py-2 rounded"
            style={{ borderRadius: theme.radius.sm }}
          >
            <Text variant="body" className="text-danger">
              Delete
            </Text>
          </Pressable>
        )}
      </View>
    </Card>
  );
}
