import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity, RefreshControl
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { fetchCampaigns } from '../services/campaign.service';
import useWebSocket from '../hooks/useWebSocket';

const STATUS_COLORS = {
  active: '#16a34a',
  paused: '#d97706',
  completed: '#6b7280'
};

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connected, setConnected] = useState(false);

  const activeCampaignIds = campaigns
    .filter(c => c.status === 'active')
    .map(c => c._id);

  const handleMetricsUpdate = (campaignId, metrics, spent) => {
    setCampaigns(prev =>
      prev.map(c => c._id === campaignId ? { ...c, metrics, spent } : c)
    );
  };

  useWebSocket(activeCampaignIds, handleMetricsUpdate);

  const load = async () => {
    try {
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#4f46e5" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>adpulse</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.welcome}>Hi, {user.name}</Text>

      <FlatList
        data={campaigns}
        keyExtractor={c => c._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            load();
          }} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No campaigns yet.</Text>
        }
        renderItem={({ item: c }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{c.name}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[c.status] }]}>
                <Text style={styles.badgeText}>{c.status}</Text>
              </View>
            </View>
            <View style={styles.cardRow}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Budget</Text>
                <Text style={styles.metricValue}>₹{c.budget.toLocaleString()}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Spent</Text>
                <Text style={styles.metricValue}>₹{Math.round(c.spent).toLocaleString()}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Clicks</Text>
                <Text style={styles.metricValue}>{c.metrics.clicks.toLocaleString()}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Impressions</Text>
                <Text style={styles.metricValue}>{c.metrics.impressions.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 16, paddingTop: 56,
    borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  logo: { fontSize: 20, fontWeight: '700', color: '#4f46e5' },
  logout: { color: '#888', fontSize: 14 },
  welcome: { padding: 16, fontSize: 14, color: '#666' },
  card: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 8, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardName: { fontSize: 15, fontWeight: '600', flex: 1 },
  badge: { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { alignItems: 'center' },
  metricLabel: { fontSize: 10, color: '#aaa', textTransform: 'uppercase', marginBottom: 2 },
  metricValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  empty: { textAlign: 'center', padding: 48, color: '#aaa' }
});

export default DashboardScreen;