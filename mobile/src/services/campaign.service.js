import api from './api';

export const fetchCampaigns = async () => {
  const { data } = await api.get('/campaigns');
  return data.campaigns;
};