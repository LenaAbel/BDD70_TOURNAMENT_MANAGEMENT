const express = require('express');
const rulesController = require('../controllers/rules.controller');

const router = express.Router();

// Define rules routes
router.post('/', rulesController.createRule);
router.get('/:id', rulesController.getRule);
router.put('/:id', rulesController.updateRule);
router.delete('/:id', rulesController.deleteRule);
router.get('/', rulesController.getAllRules);
router.get('/activity/:activity_id', rulesController.getRulesByGameId);

module.exports = router;
