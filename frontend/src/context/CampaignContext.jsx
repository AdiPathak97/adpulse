import { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchCampaigns,
  createCampaign as apiCreate,
  updateCampaign as apiUpdate,
  deleteCampaign as apiDelete
} from '../services/campaign.service';
import { useAuth } from './AuthContext';

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadCampaigns();
  }, [user]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const addCampaign = async (payload) => {
    const campaign = await apiCreate(payload);
    setCampaigns(prev => [campaign, ...prev]);
    return campaign;
  };

  const editCampaign = async (id, payload) => {
    const updated = await apiUpdate(id, payload);
    setCampaigns(prev =>
      prev.map(c => c._id === id ? updated : c)
    );
    return updated;
  };

  const removeCampaign = async (id) => {
    await apiDelete(id);
    setCampaigns(prev => prev.filter(c => c._id !== id));
  };

  // called by useWebSocket hook in chunk 7 to patch live metrics
  const updateCampaignMetrics = (campaignId, metrics, spent) => {
    setCampaigns(prev =>
      prev.map(c =>
        c._id === campaignId ? { ...c, metrics, spent } : c
      )
    );
  };

  return (
    <CampaignContext.Provider value={{
      campaigns,
      loading,
      error,
      addCampaign,
      editCampaign,
      removeCampaign,
      updateCampaignMetrics
    }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) throw new Error('useCampaigns must be used within CampaignProvider');
  return context;
};