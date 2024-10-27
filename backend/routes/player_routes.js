const express = require('express');
const playerController = require('../controllers/player.controller'); // Adjust path as necessary

const router = express.Router();

// Define player routes
router.get('/players', playerController.getAllPlayers);
router.post('/players', playerController.createPlayer);
router.get('/players/:id', playerController.getPlayerById);
router.put('/players/:id', playerController.updatePlayer);
router.delete('/players/:id', playerController.deletePlayer);

module.exports = router;