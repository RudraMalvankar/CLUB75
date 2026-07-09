import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type ChatInputProps = {
  readonly onSend: (message: string) => void;
  readonly disabled?: boolean;
  readonly placeholder?: string;
};

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask about your attendance...",
}: ChatInputProps) {
  const { theme } = useTheme();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <View className="flex-row items-center px-4 py-3 bg-surface border-t border-border">
      <TextInput
        className="flex-1 bg-background rounded-full px-4 py-3 text-textPrimary"
        style={{
          borderRadius: theme.radius.pill,
          minHeight: 44,
          fontSize: theme.typography.body.fontSize,
        }}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        editable={!disabled}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <Pressable
        onPress={handleSend}
        disabled={disabled || !text.trim()}
        className="ml-2 w-11 h-11 items-center justify-center rounded-full bg-primary"
        style={{
          borderRadius: theme.radius.pill,
          opacity: disabled || !text.trim() ? 0.5 : 1,
        }}
      >
        <SendIcon color={theme.colors.background} />
      </Pressable>
    </View>
  );
}

function SendIcon({ color }: { readonly color: string }) {
  return (
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderTopWidth: 6,
        borderBottomWidth: 6,
        borderLeftColor: color,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        marginLeft: 2,
      }}
    />
  );
}
