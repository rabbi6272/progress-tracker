import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/theme';

type FieldProps = TextInputProps & {
  label: string;
  error?: string | null;
  required?: boolean;
};

export function Field({ label, error, required, style, ...rest }: FieldProps) {
  return (
    <View style={[styles.container]}>
      <ThemedText type="defaultSemiBold" style={{ paddingLeft: 8 }}>
        {label}{required && <Text style={{ color: '#e5484d' }}> * </Text>}
      </ThemedText>
      <TextInput
        placeholderTextColor={Colors.icon}
        style={[
          styles.input,
          { borderColor: error ? '#e5484d' : Colors.icon, color: Colors.text },
          style,
        ]}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '500'
  },
  error: {
    color: '#e5484d',
    fontSize: 11,
  },
});
