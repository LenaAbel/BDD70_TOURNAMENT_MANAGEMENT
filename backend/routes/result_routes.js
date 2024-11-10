const express = require('express');
const resultsController = require('../controllers/results.controller'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Définir les routes pour les résultats
router.post('/', resultsController.createResult);
router.get('/:results_id', resultsController.getResultById);
router.get('/', resultsController.getAllResults);
router.put('/:results_id', resultsController.updateResult);
router.delete('/:results_id', resultsController.deleteResult);

module.exports = router;