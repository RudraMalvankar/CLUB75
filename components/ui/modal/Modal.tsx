import { Modal as RNModal, View, Pressable, type ModalProps as RNModalProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { IconButton } from "@/components/ui/button/IconButton";

type ModalProps = Omit<RNModalProps, "visible"> & {
  readonly visible: boolean;
  readonly title?: string;
  readonly onClose?: () => void;
  readonly children: React.ReactNode;
};

export function Modal({
  visible,
  title,
  onClose,
  animationType = "fade",
  children,
  ...rest
}: ModalProps) {
  const { theme } = useTheme();

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent
      onRequestClose={onClose}
      {...rest}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: theme.spacing.screenPadding,
        }}
        onPress={onClose}
      >
        <Pressable
          className="bg-surface"
          style={{
            width: "100%",
            maxWidth: 400,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.cardPadding,
            gap: theme.spacing.lg,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {(title || onClose) && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {title && <Heading variant="headingM">{title}</Heading>}
              {onClose && (
                <IconButton size="sm" accessibilityLabel="Close" onPress={onClose}>
                  <Heading variant="headingM" color={theme.colors.textSecondary}>
                    ×
                  </Heading>
                </IconButton>
              )}
            </View>
          )}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
