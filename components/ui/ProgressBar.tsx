import { Colors } from '@/constants/theme';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ProgressBarProps = {
  percent: number;
  color?: string;
};

export function ProgressBar({ percent, color }: ProgressBarProps) {
  const track = Colors.icon + "50";
  const tint = color ?? Colors.tint;
  const clamped = Math.min(100, Math.max(0, percent));
  const progress = useSharedValue(0);

  const fillRef = useRef<React.ElementRef<typeof Animated.View>>(null);
  const hasEntered = useRef(false);
  const latestTarget = useRef(clamped);
  latestTarget.current = clamped;

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      progress.value = withTiming(clamped, { duration: 1000 });
      hasEntered.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasEntered.current && entries.some((e) => e.isIntersecting)) {
          hasEntered.current = true;
          progress.value = withTiming(latestTarget.current);
        }
      },
      { threshold: [0] },
    );

    const node = fillRef.current;
    if (node) observer.observe(node as unknown as Element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasEntered.current) {
      progress.value = withTiming(clamped, { duration: 1000 });
    }
  }, [clamped]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={[styles.track, { backgroundColor: track }]}>
      <Animated.View ref={fillRef} style={[styles.fill, fillStyle, { backgroundColor: tint }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
