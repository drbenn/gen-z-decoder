import { StyleSheet, Text, View } from 'react-native';

export default function TranslateInputScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translate Input</Text>
      <Text style={styles.subtitle}>Mode toggle, input field, translate button</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
});