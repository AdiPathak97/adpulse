const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaign.controller');
const { protect } = require('../middleware/auth.middleware');

// all campaign routes are protected
router.use(protect);

router.route('/')
  .get(getCampaigns)
  .post(createCampaign);

router.route('/:id')
  .get(getCampaign)
  .put(updateCampaign)
  .delete(deleteCampaign);

module.exports = router;