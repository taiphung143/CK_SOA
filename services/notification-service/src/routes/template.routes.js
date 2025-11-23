const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');

// Get all templates
router.get('/', templateController.getAllTemplates);

// Get single template
router.get('/:id', templateController.getTemplate);

// Create template (Admin only)
router.post('/', templateController.createTemplate);

// Update template (Admin only)
router.put('/:id', templateController.updateTemplate);

// Delete template (Admin only)
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
