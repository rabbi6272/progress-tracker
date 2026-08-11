import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  /**
   * Firebase's public typings resolve to the browser build, which does not
   * include the React Native persistence helper. Metro resolves the
   * `react-native` export condition at runtime, so this is available; we
   * only need the type here.
   */
  export function getReactNativePersistence(storage: unknown): Persistence;
}
