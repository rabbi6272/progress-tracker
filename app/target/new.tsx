import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/InputField';
import { useTargets } from '@/hooks/use-targets';
import { MAX_GPA, TARGET_TYPES, TARGET_TYPE_LABELS } from '@/lib/constants';
import type { TargetType } from '@/lib/types';
import { gpaRange, isNumeric, required } from '@/lib/validate';

const UNIT_BY_TYPE: Record<TargetType, string> = {
  gpa: 'gpa',
  cgpa: 'cgpa',
  attendance: '%',
  custom: '',
};

export default function NewTargetScreen() {
  const router = useRouter();
  const { createTarget } = useTargets();

  const [type, setType] = useState<TargetType>('gpa');
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleSubmit = async () => {
    const target = Number(targetValue);
    const current = currentValue.trim() ? Number(currentValue) : 0;
    const nextErrors: Record<string, string | null> = {
      title: required(title, 'Title'),
      targetValue: isNumeric(targetValue, 'Target value'),
    };
    if (currentValue.trim() && Number.isNaN(current)) {
      nextErrors.currentValue = 'Current value must be a number.';
    }
    if ((type === 'gpa' || type === 'cgpa') && !Number.isNaN(target)) {
      nextErrors.targetValue = gpaRange(target);
    }
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    await createTarget.mutateAsync({
      type,
      title: title.trim(),
      targetValue: target,
      currentValue: current,
      unit: UNIT_BY_TYPE[type],
      targetDate: targetDate.trim(),
    });
    router.back();
  };

  const gpaHint = type === 'gpa' || type === 'cgpa' ? ` (0 – ${MAX_GPA})` : '';

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>
          New Target
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold">Type</ThemedText>
          <View style={styles.chips}>
            {TARGET_TYPES.map((t) => (
              <Chip
                key={t}
                label={TARGET_TYPE_LABELS[t]}
                selected={type === t}
                onPress={() => {
                  setType(t);
                  setTargetValue('');
                  setErrors((e) => ({ ...e, targetValue: null }));
                }}
              />
            ))}
          </View>
        </View>

        <Field
          label="Title"
          placeholder="e.g. Semester GPA target"
          value={title}
          onChangeText={(v) => {
            setTitle(v);
            setErrors((e) => ({ ...e, title: null }));
          }}
          error={errors.title}
        />
        <Field
          label={`Target value${gpaHint}`}
          placeholder={type === 'attendance' ? 'e.g. 90' : 'e.g. 3.75'}
          keyboardType="numeric"
          value={targetValue}
          onChangeText={(v) => {
            setTargetValue(v);
            setErrors((e) => ({ ...e, targetValue: null }));
          }}
          error={errors.targetValue}
        />
        <Field
          label="Current value (optional)"
          placeholder={type === 'attendance' ? 'e.g. 70' : 'e.g. 3.5'}
          keyboardType="numeric"
          value={currentValue}
          onChangeText={(v) => {
            setCurrentValue(v);
            setErrors((e) => ({ ...e, currentValue: null }));
          }}
          error={errors.currentValue}
        />
        <Field
          label="Target date (optional, YYYY-MM-DD)"
          placeholder="2026-12-31"
          value={targetDate}
          onChangeText={setTargetDate}
        />

        <Button title="Save Target" onPress={handleSubmit} loading={createTarget.isPending} />
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
});
