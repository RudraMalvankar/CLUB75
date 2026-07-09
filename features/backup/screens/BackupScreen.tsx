import React, { useCallback, useRef, useState } from "react";
import { View, ScrollView, Pressable, Alert } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Screen } from "@/components/layout/Screen";
import { useTheme } from "@/hooks/useTheme";
import { useBackup } from "../hooks/useBackup";
import { useBackupHistory } from "../hooks/useBackupHistory";
import { useStorageInfo } from "../hooks/useStorageInfo";
import { BackupCard } from "../components/BackupCard";
import { StorageInfo } from "../components/StorageInfo";
import type { BackupData } from "../types";

export function BackupScreen() {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingRestore, setPendingRestore] = useState<BackupData | null>(null);

  const {
    isCreating,
    isRestoring,
    isResetting,
    error,
    exportBackup,
    importBackup,
    restoreBackup,
    resetApplication,
    clearError,
  } = useBackup();

  const { history, isLoading: historyLoading, deleteBackup } = useBackupHistory();
  const { totalRecords, recordCounts, refresh: refreshStorage } = useStorageInfo();

  const handleExport = useCallback(async () => {
    await exportBackup();
    refreshStorage();
  }, [exportBackup, refreshStorage]);

  const handleImportPress = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const data = await importBackup(file);
      if (data) {
        setPendingRestore(data);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [importBackup],
  );

  const handleConfirmRestore = useCallback(async () => {
    if (!pendingRestore) return;

    Alert.alert(
      "Restore Backup",
      "This will replace all your current data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: async () => {
            await restoreBackup(pendingRestore);
            setPendingRestore(null);
            refreshStorage();
          },
        },
      ],
    );
  }, [pendingRestore, restoreBackup, refreshStorage]);

  const handleCancelRestore = useCallback(() => {
    setPendingRestore(null);
  }, []);

  const handleReset = useCallback(() => {
    Alert.alert(
      "Reset Application",
      "This will delete ALL your data including semesters, subjects, attendance, and settings. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetApplication();
            refreshStorage();
          },
        },
      ],
    );
  }, [resetApplication, refreshStorage]);

  const handleDeleteBackup = useCallback(
    (createdAt: number) => {
      Alert.alert("Delete Backup", "Are you sure you want to delete this backup from history?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => void deleteBackup(createdAt),
        },
      ]);
    },
    [deleteBackup],
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing["4xl"] }}>
        <Heading variant="headingL" className="mb-4">
          Backup & Restore
        </Heading>

        {error && (
          <Card
            className="mb-4 p-3 bg-danger/10 border border-danger/30"
            style={{ borderRadius: theme.radius.md }}
          >
            <Text variant="body" className="text-danger">
              {typeof error === "string" ? error : error.message}
            </Text>
            <Pressable onPress={clearError} className="mt-2">
              <Text variant="body" className="text-primary">
                Dismiss
              </Text>
            </Pressable>
          </Card>
        )}

        <StorageInfo totalRecords={totalRecords} recordCounts={recordCounts} />

        <Card
          className="p-4 bg-surface border border-border mb-4"
          style={{ borderRadius: theme.radius.md }}
        >
          <Heading variant="headingM" className="text-textPrimary mb-3">
            Export Data
          </Heading>
          <Text variant="body" className="text-textSecondary mb-3">
            Create a backup of all your attendance data.
          </Text>
          <Pressable
            onPress={handleExport}
            disabled={isCreating}
            className="bg-primary py-3 px-4 rounded items-center"
            style={{ borderRadius: theme.radius.sm, opacity: isCreating ? 0.5 : 1 }}
          >
            <Text variant="bodyLarge" className="text-white font-semibold">
              {isCreating ? "Creating Backup..." : "Export Backup"}
            </Text>
          </Pressable>
        </Card>

        <Card
          className="p-4 bg-surface border border-border mb-4"
          style={{ borderRadius: theme.radius.md }}
        >
          <Heading variant="headingM" className="text-textPrimary mb-3">
            Import Data
          </Heading>
          <Text variant="body" className="text-textSecondary mb-3">
            Restore data from a backup file.
          </Text>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Pressable
            onPress={handleImportPress}
            disabled={isRestoring}
            className="bg-secondary py-3 px-4 rounded items-center"
            style={{ borderRadius: theme.radius.sm, opacity: isRestoring ? 0.5 : 1 }}
          >
            <Text variant="bodyLarge" className="text-textPrimary font-semibold">
              {isRestoring ? "Restoring..." : "Import Backup"}
            </Text>
          </Pressable>
        </Card>

        {pendingRestore && (
          <Card
            className="p-4 bg-warning/10 border border-warning/30 mb-4"
            style={{ borderRadius: theme.radius.md }}
          >
            <Heading variant="headingM" className="text-textPrimary mb-2">
              Confirm Restore
            </Heading>
            <Text variant="body" className="text-textSecondary mb-3">
              This backup contains {pendingRestore.metadata.recordCounts.attendance} attendance
              records. All current data will be replaced.
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={handleCancelRestore}
                className="flex-1 bg-secondary py-3 px-4 rounded items-center"
                style={{ borderRadius: theme.radius.sm }}
              >
                <Text variant="body" className="text-textPrimary">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmRestore}
                className="flex-1 bg-danger py-3 px-4 rounded items-center"
                style={{ borderRadius: theme.radius.sm }}
              >
                <Text variant="body" className="text-white">
                  Restore
                </Text>
              </Pressable>
            </View>
          </Card>
        )}

        <Card
          className="p-4 bg-surface border border-border mb-4"
          style={{ borderRadius: theme.radius.md }}
        >
          <Heading variant="headingM" className="text-textPrimary mb-3">
            Backup History
          </Heading>
          {historyLoading ? (
            <Text variant="body" className="text-textSecondary">
              Loading...
            </Text>
          ) : history.length === 0 ? (
            <Text variant="body" className="text-textSecondary">
              No backups yet
            </Text>
          ) : (
            history.map((item) => (
              <BackupCard
                key={item.metadata.createdAt}
                name={item.name}
                metadata={item.metadata}
                onDelete={() => handleDeleteBackup(item.metadata.createdAt)}
              />
            ))
          )}
        </Card>

        <Card
          className="p-4 bg-surface border border-border"
          style={{ borderRadius: theme.radius.md }}
        >
          <Heading variant="headingM" className="text-textPrimary mb-2">
            Reset Application
          </Heading>
          <Text variant="body" className="text-textSecondary mb-3">
            Delete all data and start fresh. This cannot be undone.
          </Text>
          <Pressable
            onPress={handleReset}
            disabled={isResetting}
            className="bg-danger/10 py-3 px-4 rounded items-center"
            style={{ borderRadius: theme.radius.sm, opacity: isResetting ? 0.5 : 1 }}
          >
            <Text variant="bodyLarge" className="text-danger font-semibold">
              {isResetting ? "Resetting..." : "Reset App"}
            </Text>
          </Pressable>
        </Card>
      </ScrollView>
    </Screen>
  );
}
