const express = require('express');
const activityController = require('../controllers/activity.controller'); // Adjust path as necessary

const router = express.Router();

// Define activity routes
router.get('/activity', activityController.getAllActivities);
router.post('/activity', activityController.createActivity);
router.get('/activity/:id', activityController.getActivity);
router.put('/activity/:id', activityController.updateActivity);
router.delete('/activity/:id', activityController.deleteActivity);

module.exports = router;
