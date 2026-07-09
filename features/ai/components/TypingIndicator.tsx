import React, { useEffect, useMemo } from "react";
import { View, Animated } from "react-native";

import { Card } from "@/components/ui/card/Card";
import { Caption } from "@/components/ui/typography/Caption";
import { useTheme } from "@/hooks/useTheme";

export function TypingIndicator() {
  const { theme } = useTheme();
  const dot1 = useMemo(() => new Animated.Value(0), []);
  const dot2 = useMemo(() => new Animated.Value(0), []);
  const dot3 = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animateDot = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const animation = Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ]);

    animation.start();
    return () => animation.stop();
  }, [dot1, dot2, dot3]);

  const dotStyle = (animatedValue: Animated.Value) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textSecondary,
    marginHorizontal: 3,
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <View className="flex-row justify-start mb-3">
      <Card
        className="px-4 py-3 bg-surface rounded-tl-none"
        style={{ borderRadius: theme.radius.lg }}
      >
        <View className="flex-row items-center">
          <Caption className="text-textSecondary mr-2">AI is thinking</Caption>
          <View className="flex-row">
            <Animated.View style={dotStyle(dot1)} />
            <Animated.View style={dotStyle(dot2)} />
            <Animated.View style={dotStyle(dot3)} />
          </View>
        </View>
      </Card>
    </View>
  );
}
