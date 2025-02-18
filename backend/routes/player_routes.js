const express = require('express');
const playerController = require('../controllers/player.controller');

const router = express.Router();

// Define player routes
router.get('/', async (req, res) => {
    const routeStart = Date.now(); // Start time for the route

    try {
        await playerController.getAllPlayers(req, res);
    } finally {
        const routeEnd = Date.now(); // End time for the route
        const routeDuration = routeEnd - routeStart;
        console.log(`Route (GET /players) took ${routeDuration} ms`); // Log the duration
    }
});

router.post('/setFavorite/', playerController.setFavoriteActivity);
router.post('/', playerController.createPlayer);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);
router.get('/best/:activity_id', playerController.getBestPlayerByActivity);
router.post('/register', playerController.registerPlayer);
router.post('/login', playerController.loginPlayer);

module.exports = router;
