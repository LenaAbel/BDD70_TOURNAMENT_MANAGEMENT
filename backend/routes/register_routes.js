const express = require('express');
const registerController = require('../controllers/register.controller'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Définir les routes pour les inscriptions
router.post('/', registerController.createRegister);
router.get('/:player_id/:tournament_id', registerController.getRegisterById);
router.get('/', registerController.getAllRegisters);
router.put('/:player_id/:tournament_id', registerController.updateRegister);
router.delete('/:player_id/:tournament_id', registerController.deleteRegister);
router.post('/player', registerController.registerPlayerToTournament);
router.post('/team', registerController.registerTeamToTournament);

module.exports = router;