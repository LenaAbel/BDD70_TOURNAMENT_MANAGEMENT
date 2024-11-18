const express = require('express');
const rewardsController = require('../controllers/rewards.controller');

const router = express.Router();

// Define rewards routes
router.post('/', rewardsController.createReward);
router.get('/activity/:activity_id', rewardsController.getRewardsByGameId);
router.post('/assignments', rewardsController.createRewardAssignment);
router.delete('/assignments/:id', rewardsController.deleteRewardAssignment);
router.get('/assignments', rewardsController.getAllRewardAssignments);
router.get('/:id', rewardsController.getReward);
router.put('/:id', rewardsController.updateReward);
router.delete('/:id', rewardsController.deleteReward);
router.get('/', rewardsController.getAllRewards);

module.exports = router;
