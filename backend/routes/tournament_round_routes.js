const express = require("express");
const tournamentRoundController = require("../controllers/tournament_round.controller");

const router = express.Router();

// Define tournament round routes
router.get("/", tournamentRoundController.getAllRounds);
router.post("/", tournamentRoundController.createRound);
router.get("/:round_id", tournamentRoundController.getTournamentRoundById);
router.put("/:round_id", tournamentRoundController.updateTournamentRound);
router.get("/tournament/:tournament_id", tournamentRoundController.getTournamentRoundsByTournamentId);
router.delete("/:round_id", tournamentRoundController.deleteTournamentRound);
router.delete("/tournament/:tournament_id", tournamentRoundController.deleteTournamentRoundsByTournamentId);

module.exports = router;