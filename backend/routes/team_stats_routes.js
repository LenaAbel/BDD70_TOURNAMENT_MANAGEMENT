const express = require('express');
const teamStatsController = require('../controllers/team_stats.controller'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Définir les routes pour les statistiques des équipes
router.post('/', teamStatsController.createTeamStats);
router.get('/team/:team_id', teamStatsController.getTeamStatsByTeamId);
router.get('/activity/:activity_id', teamStatsController.getTeamStatsByActivityId);
router.get('/', teamStatsController.getAllTeamStats);
router.put('/team/:team_id/activity/:activity_id', teamStatsController.updateTeamStats);
router.delete('/team/:team_id/activity/:activity_id', teamStatsController.deleteTeamStats);

module.exports = router;