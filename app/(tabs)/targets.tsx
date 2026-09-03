import { Link } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors } from '@/constants/theme';
import { useTargets } from '@/hooks/useTargets';
import { TARGET_TYPE_LABELS } from '@/lib/constants';
import { clamp } from '@/lib/gpa';

export default function TargetsScreen() {
  const { targets, isLoading, deleteTarget } = useTargets();
  const tint = Colors.tint;

  const handleDelete = (targetId: string, title: string) => {
    Alert.alert('Delete target', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTarget.mutate(targetId) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Targets</ThemedText>
        <Link href="/target/new" style={styles.add}>
          <IconSymbol size={28} name="plus.circle.fill" color={tint} />
        </Link>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ThemedText>Loading targets…</ThemedText>
        ) : targets.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText type="subtitle">No targets yet</ThemedText>
            <ThemedText style={styles.emptyText}>
              Set a GPA, CGPA, or attendance target to track.
            </ThemedText>
          </View>
        ) : (
          targets.map((target) => {
            const percent =
              target.targetValue > 0
                ? Math.round((target.currentValue / target.targetValue) * 100)
                : 0;
            return (
              <View key={target.id} style={[styles.card, { borderColor: tint }]}>
                <View style={styles.row}>
                  <View style={styles.info}>
                    <ThemedText type="defaultSemiBold">{target.title}</ThemedText>
                    <ThemedText style={styles.meta}>
                      {TARGET_TYPE_LABELS[target.type]}
                      {target.targetDate ? ` · ${target.targetDate}` : ''}
                    </ThemedText>
                  </View>
                  <Pressable onPress={() => handleDelete(target.id, target.title)} hitSlop={8}>
                    <IconSymbol size={20} name="trash" color="#e5484d" />
                  </Pressable>
                </View>
                <ProgressBar percent={clamp(percent, 0, 100)} />
                <ThemedText style={styles.meta}>
                  {target.currentValue} / {target.targetValue} {target.unit} ({percent}%)
                </ThemedText>
              </View>
            );
          })
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
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  meta: {
    opacity: 0.6,
    fontSize: 14,
  },
});
