import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { Chip } from '@/components/ui/Chip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useRoutines } from '@/hooks/use-routines';
import { DAY_NAMES, DAY_SHORT_NAMES } from '@/lib/constants';
import { parseTime } from '@/lib/validate';

export default function RoutineScreen() {
  const { slots, isLoading, deleteRoutineSlot } = useRoutines();
  const tint = Colors.tint;

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());

  const daySlots = slots
    .filter((s) => s.dayOfWeek === selectedDay)
    .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

  const handleDelete = (slotId: string) => {
    Alert.alert('Delete slot', 'Remove this class from your routine?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteRoutineSlot.mutate(slotId) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Routine</ThemedText>
        <Link href="/routine/new" style={styles.add}>
          <IconSymbol size={28} name="plus.circle.fill" color={tint} />
        </Link>
      </View>

      <ScrollView contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.days}>
          {DAY_NAMES.map((day, index) => (
            <Chip
              key={day}
              label={DAY_SHORT_NAMES[index]}
              selected={selectedDay === index}
              onPress={() => setSelectedDay(index)}
            />
          ))}
        </View>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle" style={styles.dayTitle}>
          {DAY_NAMES[selectedDay]}
        </ThemedText>

        {isLoading ? (
          <ThemedText>Loading routine…</ThemedText>
        ) : daySlots.length === 0 ? (
          <ThemedText style={styles.empty}>No classes on {DAY_NAMES[selectedDay]}.</ThemedText>
        ) : (
          daySlots.map((slot) => (
            <View key={slot.id} style={[styles.slot, { borderColor: tint }]}>
              <View style={styles.slotRow}>
                <View style={styles.slotInfo}>
                  <ThemedText type="defaultSemiBold">{slot.courseLabel}</ThemedText>
                  <ThemedText style={styles.meta}>
                    {slot.startTime} – {slot.endTime}
                    {slot.room ? ` · ${slot.room}` : ''}
                  </ThemedText>
                </View>
                <Pressable onPress={() => handleDelete(slot.id)} hitSlop={8}>
                  <IconSymbol size={20} name="trash" color="#e5484d" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  add: {
    padding: 4,
  },
  days: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    padding: 20,
  },
  dayTitle: {
    marginBottom: 12,
  },
  empty: {
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 24,
  },
  slot: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotInfo: {
    flex: 1,
    gap: 2,
  },
  meta: {
    opacity: 0.6,
    fontSize: 14,
  },
});
