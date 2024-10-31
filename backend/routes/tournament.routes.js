const express = require('express');
const tournamentController = require('../controllers/tournament.controller');

const router = express.Router();

// Define tournament routes
router.get('/', tournamentController.getAllTournaments);
router.post('/', tournamentController.createTournament);
router.get('/:id', tournamentController.getTournamentById);
router.put('/:id', tournamentController.updateTournament);
router.delete('/:id', tournamentController.deleteTournament);

module.exports = router;
