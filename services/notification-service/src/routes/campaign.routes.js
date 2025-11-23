const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');

// Get all campaigns
router.get('/', campaignController.getAllCampaigns);

// Get single campaign
router.get('/:id', campaignController.getCampaign);

// Create campaign (Admin only)
router.post('/', campaignController.createCampaign);

// Update campaign (Admin only)
router.put('/:id', campaignController.updateCampaign);

// Send campaign
router.post('/:id/send', campaignController.sendCampaign);

// Cancel campaign
router.post('/:id/cancel', campaignController.cancelCampaign);

module.exports = router;
