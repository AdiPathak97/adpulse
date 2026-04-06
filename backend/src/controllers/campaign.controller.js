const campaignService = require('../services/campaign.service');

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getAllCampaigns(
      req.user._id,
      req.query  // passes ?status=active filters through
    );
    res.json({ campaigns });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.getCampaignById(
      req.params.id,
      req.user._id
    );
    res.json({ campaign });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.createCampaign(req.user._id, req.body);
    res.status(201).json({ campaign });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.updateCampaign(
      req.params.id,
      req.user._id,
      req.body
    );
    res.json({ campaign });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    await campaignService.deleteCampaign(req.params.id, req.user._id);
    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign
};