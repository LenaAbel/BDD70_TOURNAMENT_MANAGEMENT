const express = require('express');
const teamController = require('../controllers/team.controller');

const router = express.Router();

// Define team routes
router.get('/', teamController.getAllTeams);
router.post('/', teamController.createTeam);
router.get('/:id', teamController.getTeamById);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);
router.get('/best/:activity_id', teamController.getBestTeamByActivity);
router.put('/:id/players', teamController.assignPlayersToTeam);

module.exports = router;
