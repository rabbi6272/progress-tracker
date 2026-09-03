import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';
import { useSemesters } from '@/hooks/useSemesters';
import { useProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/providers/auth-provider';
import { signOut } from '@/services/Auth';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profileData, isLoading } = useProfile();
  const { semesters } = useSemesters();
  const router = useRouter();

  const currentSemester = semesters.find((s) => s.id === profileData?.currentSemesterId);
  const displayName = profileData?.fullName || 'Student';

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} edges={['top']}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <ActivityIndicator size="large" color={Colors.tint} />
          <ThemedText style={styles.loadingText}>Loading profile…</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={{ flex: 1, padding: 16, backgroundColor: '#f1f1f1', justifyContent: 'center' }}>
        <View style={styles.card}>
          <View style={styles.header}>
            <ThemedText type="title">{displayName}</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </View>

          <View style={styles.infoGrid}>
            <InfoRow label="University" value={profileData?.university || '—'} />
            <InfoRow label="Department" value={profileData?.department || '—'} />
            <InfoRow label="Semester" value={currentSemester?.name || '—'} />
            <InfoRow
              label="Target CGPA"
              value={profileData?.targetCgpa ? String(profileData.targetCgpa) : '—'}
            />
          </View>

          <Button title="Edit Profile" onPress={() => router.push('/profile/edit')} />
          <Button title="Sign Out" variant="ghost" onPress={handleSignOut} style={styles.signOut} />
          <Button title="Back to Dashboard" variant="ghost" onPress={() => router.replace('/')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.infoValue}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 4,
  },
  email: {
    opacity: 0.7,
  },
  loadingText: {
    opacity: 0.8,
  },
  infoGrid: {
    gap: 16,
    marginBottom: 28,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  infoLabel: {
    opacity: 0.6,
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addText: {
    color: Colors.tint,
    fontWeight: '600',
  },
  semesterList: {
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  semesterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  emptyText: {
    opacity: 0.5,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  signOut: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
});