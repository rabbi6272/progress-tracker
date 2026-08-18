import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/InputField';
import { useAuth } from '@/providers/auth-provider';
import { signIn } from '@/services/auth';
import { FirebaseError } from '@/services/FirebaseError';

export default function LoginScreen() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setError(FirebaseError((e as any).code));
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Welcome back
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Sign in to track your progress
          </ThemedText>

          <Field
            required
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            required
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Button title="Sign In" onPress={handleSubmit} loading={loading} />

          <ThemedText style={styles.footer}>
            Don&apos;t have an account? <Link href="/signup" style={styles.link}>Sign up</Link>
          </ThemedText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
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
    paddingVertical: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  error: {
    color: '#e5484d',
    marginBottom: 12,
    paddingLeft: 8,
    fontSize: 13
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
  },
  link: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
});
