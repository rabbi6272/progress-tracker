import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/InputField';
import { useCourses } from '@/hooks/use-courses';
import { useRoutines } from '@/hooks/use-routines';
import { DAY_NAMES, DAY_SHORT_NAMES } from '@/lib/constants';
import { isTime, parseTime } from '@/lib/validate';

export default function NewRoutineSlotScreen() {
  const router = useRouter();
  const { createRoutineSlot } = useRoutines();
  const { courses } = useCourses();

  const [dayOfWeek, setDayOfWeek] = useState<number>(new Date().getDay());
  const [courseId, setCourseId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const selectedCourse = courses.find((c) => c.id === courseId);

  const handleSubmit = async () => {
    const nextErrors: Record<string, string | null> = {
      courseId: courseId ? null : 'Select a course.',
      startTime: isTime(startTime),
      endTime: isTime(endTime),
    };
    if (!nextErrors.startTime && !nextErrors.endTime) {
      if (parseTime(endTime) <= parseTime(startTime)) {
        nextErrors.endTime = 'End time must be after start time.';
      }
    }
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    await createRoutineSlot.mutateAsync({
      courseId,
      courseLabel: selectedCourse?.code ?? 'Class',
      dayOfWeek,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      room: room.trim(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>
          New Class Slot
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold">Day</ThemedText>
          <View style={styles.chips}>
            {DAY_NAMES.map((day, index) => (
              <Chip
                key={day}
                label={DAY_SHORT_NAMES[index]}
                selected={dayOfWeek === index}
                onPress={() => setDayOfWeek(index)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold">Course</ThemedText>
          {courses.length === 0 ? (
            <ThemedText style={styles.meta}>Add a course first to schedule classes.</ThemedText>
          ) : (
            <View style={styles.chips}>
              {courses.map((c) => (
                <Chip
                  key={c.id}
                  label={c.code}
                  selected={courseId === c.id}
                  onPress={() => {
                    setCourseId(c.id);
                    setErrors((e) => ({ ...e, courseId: null }));
                  }}
                />
              ))}
            </View>
          )}
          {errors.courseId ? <Text style={styles.error}>{errors.courseId}</Text> : null}
        </View>

        <Field
          label="Start time (HH:MM, 24h)"
          placeholder="09:30"
          value={startTime}
          onChangeText={(v) => {
            setStartTime(v);
            setErrors((e) => ({ ...e, startTime: null }));
          }}
          error={errors.startTime}
        />
        <Field
          label="End time (HH:MM, 24h)"
          placeholder="10:30"
          value={endTime}
          onChangeText={(v) => {
            setEndTime(v);
            setErrors((e) => ({ ...e, endTime: null }));
          }}
          error={errors.endTime}
        />
        <Field
          label="Room (optional)"
          placeholder="e.g. Room 405"
          value={room}
          onChangeText={setRoom}
        />

        <Button
          title="Save Slot"
          onPress={handleSubmit}
          loading={createRoutineSlot.isPending}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 24,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    gap: 8,
    marginBottom: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  meta: {
    opacity: 0.6,
    fontSize: 14,
  },
  error: {
    color: '#e5484d',
    fontSize: 13,
  },
});
