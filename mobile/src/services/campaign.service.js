import api from './api';

export const fetchCampaigns = async () => {
  const { data } = await api.get('/campaigns');
  return data.campaigns;
};

export const createCampaign = async (payload) => {
  const { data } = await api.post('/campaigns', payload);
  return data.campaign;
};