import { Colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';


type ProgressBarProps = {
  percent: number;
  color?: string;
};

export function ProgressBar({ percent, color }: ProgressBarProps) {
  const track = Colors.icon;
  const defaultTint = Colors.tint;
  const tint = color ?? defaultTint;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <View style={[styles.track, { backgroundColor: track }]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: tint }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
