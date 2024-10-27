const express = require('express');
const activityController = require('../controllers/activity.controller'); // Adjust path as necessary

const router = express.Router();

// Define activity routes
router.get('/', activityController.getAllActivities);
router.post('/', activityController.createActivity);
router.get('/:id', activityController.getActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
