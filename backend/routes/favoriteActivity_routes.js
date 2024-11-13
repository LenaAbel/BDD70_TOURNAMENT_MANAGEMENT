const express = require('express');
const favoriteActivityController = require('../controllers/favoriteActivity.controller'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Définir les routes pour les activités favorites
router.post('/', favoriteActivityController.createFavoriteActivity);
router.get('/player/:player_id', favoriteActivityController.getFavoriteActivitiesByPlayerId);
router.get('/', favoriteActivityController.getAllFavoriteActivities);
router.get('/activity/:activity_id', favoriteActivityController.getFavoriteActivityByActivityId);
router.put('/player/:player_id/activity/:activity_id', favoriteActivityController.updateFavoriteActivity);
router.delete('/player/:player_id/activity/:activity_id', favoriteActivityController.deleteFavoriteActivity);
//gitpush test
module.exports = router;