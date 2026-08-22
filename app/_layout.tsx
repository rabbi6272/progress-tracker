import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, initializing } = useAuth();
  const [loaded, error] = useFonts({
    'LatoRegular': require('../assets/fonts/Lato-Regular.ttf'),
    'LatoSemiBold': require('../assets/fonts/Lato-SemiBold.ttf'),
    'LatoBold': require('../assets/fonts/Lato-Bold.ttf'),
    'InterRegular': require('../assets/fonts/Inter-Regular.ttf'),
    'InterMedium': require('../assets/fonts/Inter-Medium.ttf'),
    'InterSemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'InterBold': require('../assets/fonts/Inter-Bold.ttf'),
    'NunitoRegular': require('../assets/fonts/Nunito-Regular.ttf'),
    'NunitoMedium': require('../assets/fonts/Nunito-Medium.ttf'),
    'NunitoSemiBold': require('../assets/fonts/Nunito-SemiBold.ttf'),
    'NunitoBold': require('../assets/fonts/Nunito-Bold.ttf'),
  });

  useEffect(() => {
    if (!initializing && loaded) {
      SplashScreen.hideAsync();
    }
  }, [initializing, loaded]);

  if (initializing || !loaded) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="course/[id]" options={{ title: 'Course' }} />
        <Stack.Screen name="course/new" options={{ title: 'New Course', presentation: 'modal' }} />
        <Stack.Screen
          name="assessment/new"
          options={{ title: 'Add Assessment', presentation: 'modal' }}
        />
        <Stack.Screen
          name="routine/new"
          options={{ title: 'New Class Slot', presentation: 'modal' }}
        />
        <Stack.Screen name="target/new" options={{ title: 'New Target', presentation: 'modal' }} />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <>
      <QueryProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryProvider>
      <StatusBar style="auto" />
    </>
  );
}
