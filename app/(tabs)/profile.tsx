import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/InputField';
import { Colors } from '@/constants/theme';
import { useProfile } from '@/hooks/useUserProfile';
import { gpaRange, required } from '@/lib/validate';
import { useAuth } from '@/providers/auth-provider';
import { signOut } from '@/services/Auth';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profileData, isLoading, updateProfile } = useProfile();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [currentSemester, setCurrentSemester] = useState('');
  const [targetCgpa, setTargetCgpa] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (profileData) {
      setFullName(profileData.fullName || '');
      setUniversity(profileData.university || '');
      setDepartment(profileData.department || '');
      setCurrentSemester(profileData.currentSemester || '');
      setTargetCgpa(profileData.targetCgpa ? String(profileData.targetCgpa) : '');
    }
  }, [profileData]);

  const hydrated = profileData !== undefined;

  const handleSave = async () => {
    const nextErrors: Record<string, string | null> = {
      fullName: required(fullName, 'Full name'),
    };
    const gpa = Number(targetCgpa);
    if (targetCgpa.trim()) {
      nextErrors.targetCgpa = Number.isNaN(gpa) ? 'Target CGPA must be a number.' : gpaRange(gpa);
    } else {
      nextErrors.targetCgpa = null;
    }
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    await updateProfile.mutateAsync({
      fullName: fullName.trim(),
      university: university.trim(),
      department: department.trim(),
      currentSemester: currentSemester.trim(),
      ...(targetCgpa.trim() ? { targetCgpa: gpa } : {}),
    });
    ToastAndroid.show('Profile updated', 2000);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const displayName = fullName || profileData?.fullName || 'Student';
  const displayCgpa = targetCgpa || (profileData?.targetCgpa ? String(profileData.targetCgpa) : '');

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="handled" >
          <View style={styles.container}>
            <View style={styles.header}>
              <ThemedText type="title">{displayName}</ThemedText>
              <ThemedText style={styles.email}>{user?.email}</ThemedText>
            </View>

            {isLoading && !hydrated ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={Colors.tint} />
                <ThemedText style={styles.loading}>Loading profile…</ThemedText>
              </View>
            ) : (
              <>
                <Field
                  label="Full name"
                  placeholder="Your name"
                  value={fullName}
                  onChangeText={setFullName}
                  error={errors.fullName}
                />
                <Field
                  label="University"
                  placeholder="Your university"
                  value={university}
                  onChangeText={setUniversity}
                />
                <Field
                  label="Department"
                  placeholder="e.g. Computer Science & Engineering"
                  value={department}
                  onChangeText={setDepartment}
                />
                <Field
                  label="Current semester"
                  placeholder="e.g. Semester 3-1"
                  value={currentSemester}
                  onChangeText={setCurrentSemester}
                />
                <Field
                  label="Target CGPA"
                  placeholder="e.g. 3.75"
                  keyboardType="numeric"
                  value={displayCgpa}
                  onChangeText={setTargetCgpa}
                  error={errors.targetCgpa}
                />

                <Button
                  title="Save Changes"
                  onPress={handleSave}
                  loading={updateProfile.isPending}
                  disabled={isLoading}
                />
              </>
            )}

            <Button title="Sign Out" variant="ghost" onPress={handleSignOut} style={styles.signOut} />
            <Button
              title="Back to Dashboard"
              variant="ghost"
              onPress={() => router.replace('/')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f1f1f1',
  },
  container: {
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
  loading: {
    marginVertical: 16,
    textAlign: 'center',
  },
  signOut: {
    marginTop: 4,
  },
});
