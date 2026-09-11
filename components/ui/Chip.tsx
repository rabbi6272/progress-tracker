import { Colors } from '@/constants/theme';
import { Pressable, StyleSheet, Text } from 'react-native';


type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  const textColor = Colors.text;
  const tint = Colors.tint;
  const borderColor = Colors.icon;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: selected ? tint : borderColor },
        selected && { backgroundColor: tint },
      ]}>
      <Text style={[styles.label, { color: selected ? '#fff' : textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
