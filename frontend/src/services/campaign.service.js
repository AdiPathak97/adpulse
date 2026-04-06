import api from './api';

export const fetchCampaigns = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await api.get(`/campaigns${params ? `?${params}` : ''}`);
  return data.campaigns;
};

export const createCampaign = async (payload) => {
  const { data } = await api.post('/campaigns', payload);
  return data.campaign;
};

export const updateCampaign = async (id, payload) => {
  const { data } = await api.put(`/campaigns/${id}`, payload);
  return data.campaign;
};

export const deleteCampaign = async (id) => {
  await api.delete(`/campaigns/${id}`);
};