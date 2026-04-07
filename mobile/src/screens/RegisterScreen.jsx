import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>adpulse</Text>
      <Text style={styles.subtitle}>Create account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={form.name}
        onChangeText={v => setForm(p => ({ ...p, name: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={v => setForm(p => ({ ...p, email: v }))}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 chars)"
        value={form.password}
        onChangeText={v => setForm(p => ({ ...p, password: v }))}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Create account</Text>
        }
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f5' },
  logo: { fontSize: 28, fontWeight: '700', color: '#4f46e5', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 15
  },
  button: {
    backgroundColor: '#4f46e5', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 4
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  link: { textAlign: 'center', marginTop: 16, color: '#4f46e5', fontSize: 14 }
});

export default RegisterScreen;