const express = require('express');
const playerController = require('../controllers/player.controller'); // Adjust path as necessary

const router = express.Router();

// Define player routes
router.get('/', playerController.getAllPlayers);
router.post('/', playerController.createPlayer);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);

module.exports = router;