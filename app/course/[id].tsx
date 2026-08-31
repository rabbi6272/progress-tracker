import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors } from '@/constants/theme';
import { useAssessments } from '@/hooks/use-assessments';
import { useCourses } from '@/hooks/use-courses';
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants';
import { courseProgress, weightedPercent } from '@/lib/gpa';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tint = Colors.tint;

  const { courses } = useCourses();
  const course = courses.find((c) => c.id === id);
  const { assessments, isLoading, deleteAssessment } = useAssessments(id ?? '');

  const progress = courseProgress(assessments);
  const weighted = weightedPercent(assessments);

  const handleDelete = (assessmentId: string, name: string) => {
    Alert.alert('Delete assessment', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAssessment.mutate(assessmentId),
      },
    ]);
  };

  if (!course) {
    return (
      <View style={styles.centered}>
        <ThemedText>Loading course…</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <ThemedText type="title">{course.code}</ThemedText>
        <ThemedText style={styles.title}>{course.title}</ThemedText>
        <ThemedText style={styles.meta}>{course.credits} credits · {course.ctWeight}% CT weight</ThemedText>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <ThemedText type="subtitle">Progress</ThemedText>
          <ThemedText style={styles.percent}>{weighted}%</ThemedText>
        </View>
        <ProgressBar percent={weighted} />
        <ThemedText style={styles.meta}>
          {progress.max > 0 ? `${progress.obtained} / ${progress.max} marks across ${assessments.length} assessment(s)` : 'No assessments recorded yet.'}
        </ThemedText>
      </View>

      <View style={styles.row}>
        <ThemedText type="subtitle">Assessments</ThemedText>
        <Button
          title="Add"
          onPress={() => router.push(`/assessment/new?courseId=${course.id}`)}
          style={styles.addButton}
        />
      </View>

      {isLoading ? (
        <ThemedText>Loading assessments…</ThemedText>
      ) : assessments.length === 0 ? (
        <ThemedText style={styles.empty}>No assessments yet. Add your first CT mark.</ThemedText>
      ) : (
        assessments.map((a) => (
          <View key={a.id} style={[styles.assessment, { borderColor: tint }]}>
            <View style={styles.assessmentRow}>
              <View style={styles.assessmentInfo}>
                <ThemedText type="defaultSemiBold">
                  {a.name} <ThemedText style={styles.meta}>· {ASSESSMENT_TYPE_LABELS[a.type]}</ThemedText>
                </ThemedText>
                <ThemedText style={styles.meta}>
                  {a.marksObtained} / {a.maxMarks} · weight {a.weight}% · {a.date}
                </ThemedText>
              </View>
              <Pressable onPress={() => handleDelete(a.id, a.name)} hitSlop={8}>
                <IconSymbol size={20} name="trash" color="#e5484d" />
              </Pressable>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    gap: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    opacity: 0.8,
  },
  meta: {
    opacity: 0.6,
    fontSize: 14,
  },
  summary: {
    gap: 8,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percent: {
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 0,
  },
  empty: {
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 12,
  },
  assessment: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  assessmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assessmentInfo: {
    flex: 1,
    gap: 2,
  },
});
