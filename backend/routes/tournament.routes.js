const express = require('express');
const tournamentController = require('../controllers/tournament.controller');

const router = express.Router();

router.get('/format_types', tournamentController.getFormatTypes);
router.get('/tournament_types', tournamentController.getTournamentTypes);

router.get('/', tournamentController.getAllTournaments);
router.post('/', tournamentController.createTournament);
router.put('/:id', tournamentController.updateTournament);
router.delete('/:id', tournamentController.deleteTournament);
router.get('/:id', tournamentController.getTournamentById);

module.exports = router;
