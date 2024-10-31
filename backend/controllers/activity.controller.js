const activityModel = require('../models/activity.model');

// Crée une activité
const createActivity = async (req, res) => {
    const { name } = req.body;
    try {
        const newActivity = await activityModel.createActivity(name);
        res.status(201).json(newActivity);
    } catch (err) {
        console.error('Error creating activity:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir une activité par ID
const getActivity = async (req, res) => {
    const { id } = req.params;
    try {
        const activity = await activityModel.getActivityById(id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity);
    } catch (err) {
        console.error('Error getting activity:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Mettre à jour une activité par ID
const updateActivity = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedActivity = await activityModel.updateActivity(id, name);
        if (!updatedActivity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(updatedActivity);
    } catch (err) {
        console.error('Error updating activity:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Supprimer une activité par ID
const deleteActivity = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await activityModel.deleteActivity(id);
        if (!result) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Error deleting activity:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir toutes les activités
const getAllActivities = async (req, res) => {
    try {
        const activities = await activityModel.getAllActivities();
        res.json(activities);
    } catch (err) {
        console.error('Error getting all activities:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

module.exports = {
    createActivity,
    getActivity,
    updateActivity,
    deleteActivity,
    getAllActivities,
};