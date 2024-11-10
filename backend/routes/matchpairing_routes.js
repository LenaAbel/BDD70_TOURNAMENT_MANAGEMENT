const express = require('express');
const matchPairingController = require('../controllers/matchpairing.controller'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Définir les routes pour les matchpairings
router.post('/', matchPairingController.createMatchPairing);
router.get('/:matchpairing_id', matchPairingController.getMatchPairingById);
router.get('/', matchPairingController.getAllMatchPairings);
router.put('/:matchpairing_id', matchPairingController.updateMatchPairing);
router.delete('/:matchpairing_id', matchPairingController.deleteMatchPairing);

module.exports = router;