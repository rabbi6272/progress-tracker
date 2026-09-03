import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/InputField';
import { useCourses } from '@/hooks/useCourses';
import { useSemesters } from '@/hooks/useSemesters';
import { isNumeric, required } from '@/lib/validate';

export default function NewCourseScreen() {
  const router = useRouter();
  const { createCourse } = useCourses();
  const { semesters } = useSemesters();

  const [semesterId, setSemesterId] = useState(semesters[0]?.id ?? '');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState('');
  const [passMarks, setPassMarks] = useState('');
  const [ctWeight, setCtWeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleSubmit = async () => {
    const nextErrors: Record<string, string | null> = {
      semesterId: semesterId ? null : 'Select a semester.',
      code: required(code, 'Course code'),
      title: required(title, 'Course title'),
      credits: isNumeric(credits, 'Credits'),
      passMarks: isNumeric(passMarks, 'Pass marks'),
      ctWeight: isNumeric(ctWeight, 'CT weight'),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    await createCourse.mutateAsync({
      semesterId,
      code: code.trim(),
      title: title.trim(),
      credits: Number(credits),
      passMarks: Number(passMarks),
      ctWeight: Number(ctWeight),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>
          New Course
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold">Semester</ThemedText>
          <View style={styles.chips}>
            {semesters.map((sem) => (
              <Chip
                key={sem.id}
                label={sem.name}
                selected={semesterId === sem.id}
                onPress={() => {
                  setSemesterId(sem.id);
                  setErrors((e) => ({ ...e, semesterId: null }));
                }}
              />
            ))}
          </View>
          {errors.semesterId ? <Text style={styles.error}>{errors.semesterId}</Text> : null}
        </View>

        <Field
          label="Course code"
          placeholder="e.g. CSE-2100"
          autoCapitalize="characters"
          value={code}
          onChangeText={(v) => {
            setCode(v);
            setErrors((e) => ({ ...e, code: null }));
          }}
          error={errors.code}
        />
        <Field
          label="Course title"
          placeholder="e.g. Object Oriented Programming"
          value={title}
          onChangeText={(v) => {
            setTitle(v);
            setErrors((e) => ({ ...e, title: null }));
          }}
          error={errors.title}
        />
        <Field
          label="Credits"
          placeholder="e.g. 3.0"
          keyboardType="numeric"
          value={credits}
          onChangeText={(v) => {
            setCredits(v);
            setErrors((e) => ({ ...e, credits: null }));
          }}
          error={errors.credits}
        />
        <Field
          label="Pass marks (out of 100)"
          placeholder="e.g. 40"
          keyboardType="numeric"
          value={passMarks}
          onChangeText={(v) => {
            setPassMarks(v);
            setErrors((e) => ({ ...e, passMarks: null }));
          }}
          error={errors.passMarks}
        />
        <Field
          label="CT weight (% of final grade)"
          placeholder="e.g. 30"
          keyboardType="numeric"
          value={ctWeight}
          onChangeText={(v) => {
            setCtWeight(v);
            setErrors((e) => ({ ...e, ctWeight: null }));
          }}
          error={errors.ctWeight}
        />

        <Button title="Create Course" onPress={handleSubmit} loading={createCourse.isPending} />
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
  error: {
    color: '#e5484d',
    fontSize: 13,
  },
});
