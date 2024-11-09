const express = require('express');
const matchsController = require('../controllers/matchs.controller');
const router = express.Router();

// Définir les routes pour les matchs
router.get('/', matchsController.getAllMatchs);
router.post('/', matchsController.createMatch);

module.exports = router;
