const Campaign = require('../models/Campaign');

const getAllCampaigns = async (userId, filters = {}) => {
  const query = { user: userId };
  if (filters.status) query.status = filters.status;

  return await Campaign.find(query).sort({ createdAt: -1 });
};

const getCampaignById = async (id, userId) => {
  const campaign = await Campaign.findOne({ _id: id, user: userId });
  if (!campaign) throw new Error('Campaign not found');
  return campaign;
};

const createCampaign = async (userId, data) => {
  return await Campaign.create({ ...data, user: userId });
};

const updateCampaign = async (id, userId, data) => {
  const campaign = await Campaign.findOneAndUpdate(
    { _id: id, user: userId },  // ensures user owns the campaign
    data,
    { new: true, runValidators: true }
  );
  if (!campaign) throw new Error('Campaign not found');
  return campaign;
};

const deleteCampaign = async (id, userId) => {
  const campaign = await Campaign.findOneAndDelete({ _id: id, user: userId });
  if (!campaign) throw new Error('Campaign not found');
  return campaign;
};

module.exports = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
};