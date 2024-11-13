const express = require('express');
const playerStatsController = require('../controllers/player_stats.controller'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Définir les routes pour les statistiques des joueurs
router.post('/', playerStatsController.createPlayerStats);
router.get('/:player_id', playerStatsController.getPlayerStatsByPlayerId);
router.get('/', playerStatsController.getAllPlayerStats);
router.put('/player/:player_id/activity/:activity_id', playerStatsController.updatePlayerStats);
router.delete('/player/:player_id/activity/:activity_id', playerStatsController.deletePlayerStats);
router.get('/activity/:activity_id', playerStatsController.getPlayerStatsByActivityId);

module.exports = router;