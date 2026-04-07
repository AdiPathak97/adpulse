import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { createCampaign } from '../services/campaign.service';

const CreateCampaignScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    budget: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!form.name || !form.budget || !form.startDate) {
      Alert.alert('Validation', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await createCampaign({
        ...form,
        budget: parseFloat(form.budget),
        status: 'active'
      });
      Alert.alert('Success', 'Campaign created', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>New Campaign</Text>

      <Text style={styles.label}>Campaign Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Summer Sale"
        value={form.name}
        onChangeText={v => setForm(p => ({ ...p, name: v }))}
      />

      <Text style={styles.label}>Budget (₹) *</Text>
      <TextInput
        style={styles.input}
        placeholder="5000"
        value={form.budget}
        onChangeText={v => setForm(p => ({ ...p, budget: v }))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Start Date *</Text>
      <TextInput
      style={styles.input}
      placeholder="YYYY-MM-DD"
      value={form.startDate}
      onChangeText={v => setForm(p => ({ ...p, startDate: v }))}
      keyboardType="numeric"
      />
  
      <Text style={styles.label}>End Date (optional)</Text>
      <TextInput
      style={styles.input}
      placeholder="YYYY-MM-DD"
      value={form.endDate}
      onChangeText={v => setForm(p => ({ ...p, endDate: v }))}
      keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Create Campaign</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 24, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 24, color: '#1a1a1a' },
  label: { fontSize: 12, color: '#666', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 15
  },
  button: {
    backgroundColor: '#4f46e5', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 8
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  cancelButton: { padding: 14, alignItems: 'center', marginTop: 8 },
  cancelText: { color: '#888', fontSize: 15 }
});

export default CreateCampaignScreen;