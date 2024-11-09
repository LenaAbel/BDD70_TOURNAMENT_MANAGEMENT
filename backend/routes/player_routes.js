const express = require('express');
const playerController = require('../controllers/player.controller'); // Adjust path as necessary

const router = express.Router();

// Define player routes
router.get('/', playerController.getAllPlayers);
router.post('/setFavorite/', playerController.setFavoriteActivity);
router.post('/', playerController.createPlayer);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);
router.post('/register', playerController.registerPlayer);
router.post('/login', playerController.loginPlayer);

module.exports = router;