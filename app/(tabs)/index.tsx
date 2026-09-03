import { useQueries } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/CourseCard';
import { ThemedText } from '@/components/ThemedText';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCourses } from '@/hooks/useCourses';
import { useRoutines } from '@/hooks/useRoutines';
import { useTargets } from '@/hooks/useTargets';
import { useProfile } from '@/hooks/useUserProfile';
import { DAY_NAMES } from '@/lib/constants';
import { parseTime } from '@/lib/validate';
import { useAuth } from '@/providers/auth-provider';
import { listAssessments } from '@/services/Assessments';

export default function HomeScreen() {
  const { user } = useAuth();
  const { profileData } = useProfile();
  const { courses } = useCourses();
  const { slots } = useRoutines();
  const { targets } = useTargets();

  const progressQueries = useQueries({
    queries: courses.map((course) => ({
      queryKey: ['assessments', course.id],
      queryFn: () => (user ? listAssessments(user.uid, course.id) : []),
      enabled: !!user && !!course.id,
    })),
  });

  const firstName = profileData?.fullName?.split(' ')[0] ?? 'Student';

  const nextClass = findNextClass(slots);

  const topTargets = targets.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.greeting}>
          Hi, {firstName}
        </ThemedText>
        <ThemedText style={styles.subGreeting}>
          {profileData?.currentSemesterId || 'Track your CT marks, routine, and targets.'}
        </ThemedText>

        {nextClass ? (
          <View style={styles.nextClass}>
            <ThemedText style={styles.label}>NEXT CLASS</ThemedText>
            <ThemedText type="subtitle" style={styles.nextClassTitle}>
              {nextClass.courseLabel}
            </ThemedText>
            <ThemedText style={styles.nextClassMeta}>
              {nextClass.startTime} – {nextClass.endTime}
              {nextClass.room ? ` · ${nextClass.room}` : ''}
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.sectionRow}>
          <ThemedText type="subtitle">CT Progress</ThemedText>
          <Link href="/courses" style={styles.seeAll}>See all</Link>
        </View>

        {courses.length === 0 ? (
          <ThemedText style={styles.meta}>No courses yet. Add one from the Courses tab.</ThemedText>
        ) : (
          courses.slice(0, 3).map((course, index) => (
            <CourseCard key={course.id} course={course} assessments={progressQueries[index]?.data} />
          ))
        )}

        {topTargets.length > 0 ? (
          <>
            <View style={styles.sectionRow}>
              <ThemedText type="subtitle">Targets</ThemedText>
              <Link href="/targets" style={styles.seeAll}>See all</Link>
            </View>
            {topTargets.map((target) => {
              const percent =
                target.targetValue > 0
                  ? Math.round((target.currentValue / target.targetValue) * 100)
                  : 0;
              return (
                <View key={target.id} style={styles.target}>
                  <View style={styles.targetRow}>
                    <ThemedText type="defaultSemiBold">{target.title}</ThemedText>
                    <ThemedText style={styles.meta}>{percent}%</ThemedText>
                  </View>
                  <ProgressBar percent={Math.min(100, Math.max(0, percent))} />
                </View>
              );
            })}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function findNextClass(slots: ReturnType<typeof useRoutines>['slots']) {
  if (slots.length === 0) return null;
  const now = new Date();
  const today = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (let offset = 0; offset < 7; offset++) {
    const dayIndex = (today + offset) % 7;
    const daySlots = slots
      .filter((s) => s.dayOfWeek === dayIndex)
      .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
    const match = daySlots.find((s) => {
      if (offset === 0) return parseTime(s.startTime) >= nowMinutes;
      return true;
    });
    if (match) {
      return { ...match, day: DAY_NAMES[dayIndex], offset };
    }
  }
  return null;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  greeting: {
    marginBottom: 2,
  },
  subGreeting: {
    opacity: 0.7,
    marginBottom: 20,
  },
  nextClass: {
    backgroundColor: '#0a7ea4',
    borderRadius: 14,
    padding: 16,
    gap: 4,
    marginBottom: 24,
  },
  label: {
    color: '#e6f4fe',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  nextClassTitle: {
    color: '#fff',
  },
  nextClassMeta: {
    color: '#e6f4fe',
    fontSize: 14,
  },
  meta: {
    opacity: 0.6,
    fontSize: 14,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  seeAll: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  target: {
    marginBottom: 12,
    gap: 6,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
