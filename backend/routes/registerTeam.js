const express = require('express');
const registerTeamController = require('../controllers/registerTeam.controller');

const router = express.Router();

// Définir les routes pour les inscriptions
router.post('/', registerTeamController.registerTeam);
router.get('/tournament/:tournament_id', registerTeamController.getTeamsInTournament);
router.get('/team/:team_id', registerTeamController.getTournamentsForTeam);

router.delete('/', registerTeamController.removeTeamFromTournament);

module.exports = router;