const express = require('express');
const playerController = require('../controllers/player.controller');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Define player routes
router.get('/', playerController.getAllPlayers);
router.post('/setFavorite/', playerController.setFavoriteActivity);
router.post('/', playerController.createPlayer);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);
router.get('/best/:activity_id', playerController.getBestPlayerByActivity);
router.post('/register', asyncHandler(playerController.registerPlayer));
router.post('/login', playerController.loginPlayer);

module.exports = router;