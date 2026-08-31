import { useQueries } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/CourseCard';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCourses } from '@/hooks/use-courses';
import { useAuth } from '@/providers/auth-provider';
import { listAssessments } from '@/services/assessments';

export default function CoursesScreen() {
  const { user } = useAuth();
  const { courses, isLoading } = useCourses();

  const progressQueries = useQueries({
    queries: courses.map((course) => ({
      queryKey: ['assessments', course.id],
      queryFn: () => (user ? listAssessments(user.uid, course.id) : []),
      enabled: !!user && !!course.id,
    })),
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Courses</ThemedText>
        <Link href="/course/new" style={styles.add}>
          <IconSymbol size={28} name="plus.circle.fill" color="#0a7ea4" />
        </Link>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ThemedText>Loading courses…</ThemedText>
        ) : courses.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText type="subtitle">No courses yet</ThemedText>
            <ThemedText style={styles.emptyText}>
              Add a course to start tracking your CT marks.
            </ThemedText>
          </View>
        ) : (
          courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              assessments={progressQueries[index]?.data}
            />
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
  content: {
    padding: 20,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    gap: 8,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: 'center',
  },
});
