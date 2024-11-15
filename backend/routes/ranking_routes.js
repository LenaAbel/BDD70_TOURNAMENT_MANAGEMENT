const express = require('express');
const rankingController = require('../controllers/ranking.controller'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Définir les routes pour les classements
router.post('/', rankingController.createRanking);
router.get('/:ranking_id', rankingController.getRankingById);
router.get('/', rankingController.getAllRankings);
router.put('/:ranking_id', rankingController.updateRanking);
router.delete('/:ranking_id', rankingController.deleteRanking);
router.get('/player/:player_id', rankingController.getRankingByPlayerId);

module.exports = router;