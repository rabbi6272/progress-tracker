import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/InputField';
import { useAssessments } from '@/hooks/use-assessments';
import { ASSESSMENT_TYPES, ASSESSMENT_TYPE_LABELS } from '@/lib/constants';
import type { AssessmentType } from '@/lib/types';
import { clampMarks, isNumeric, required } from '@/lib/validate';

const today = () => new Date().toISOString().slice(0, 10);

export default function NewAssessmentScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const { createAssessment } = useAssessments(courseId ?? '');

  const [type, setType] = useState<AssessmentType>('ct');
  const [name, setName] = useState('');
  const [marksObtained, setMarksObtained] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(today());
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleSubmit = async () => {
    const max = Number(maxMarks);
    const obtained = Number(marksObtained);
    const nextErrors: Record<string, string | null> = {
      name: required(name, 'Name'),
      marksObtained: isNumeric(marksObtained, 'Marks obtained'),
      maxMarks: isNumeric(maxMarks, 'Max marks'),
      weight: isNumeric(weight, 'Weight'),
      date: required(date, 'Date'),
    };
    if (!Number.isNaN(max) && !Number.isNaN(obtained) && marksObtained.trim()) {
      nextErrors.marksObtained = clampMarks(obtained, max);
    }
    if (max <= 0 && maxMarks.trim()) nextErrors.maxMarks = 'Max marks must be positive.';
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    await createAssessment.mutateAsync({
      type,
      name: name.trim(),
      marksObtained: obtained,
      maxMarks: max,
      weight: Number(weight),
      date: date.trim(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>
          Add Assessment
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold">Type</ThemedText>
          <View style={styles.chips}>
            {ASSESSMENT_TYPES.map((t) => (
              <Chip
                key={t}
                label={ASSESSMENT_TYPE_LABELS[t]}
                selected={type === t}
                onPress={() => setType(t)}
              />
            ))}
          </View>
        </View>

        <Field
          label="Name"
          placeholder="e.g. CT-1"
          value={name}
          onChangeText={(v) => {
            setName(v);
            setErrors((e) => ({ ...e, name: null }));
          }}
          error={errors.name}
        />
        <Field
          label="Marks obtained"
          placeholder="e.g. 18"
          keyboardType="numeric"
          value={marksObtained}
          onChangeText={(v) => {
            setMarksObtained(v);
            setErrors((e) => ({ ...e, marksObtained: null }));
          }}
          error={errors.marksObtained}
        />
        <Field
          label="Max marks"
          placeholder="e.g. 20"
          keyboardType="numeric"
          value={maxMarks}
          onChangeText={(v) => {
            setMaxMarks(v);
            setErrors((e) => ({ ...e, maxMarks: null }));
          }}
          error={errors.maxMarks}
        />
        <Field
          label="Weight (% of course)"
          placeholder="e.g. 10"
          keyboardType="numeric"
          value={weight}
          onChangeText={(v) => {
            setWeight(v);
            setErrors((e) => ({ ...e, weight: null }));
          }}
          error={errors.weight}
        />
        <Field
          label="Date (YYYY-MM-DD)"
          placeholder="2026-08-03"
          value={date}
          onChangeText={(v) => {
            setDate(v);
            setErrors((e) => ({ ...e, date: null }));
          }}
          error={errors.date}
        />

        <Button title="Save Assessment" onPress={handleSubmit} loading={createAssessment.isPending} />
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
