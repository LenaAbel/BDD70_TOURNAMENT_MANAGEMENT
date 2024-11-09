const favoriteActivityModel = require('../models/favoriteActivity.model');

// Créer une nouvelle activité favorite
const createFavoriteActivity = (req, res) => {
    const { player_id, activity_id } = req.body;
    favoriteActivityModel.createFavoriteActivity(player_id, activity_id)
        .then(newActivity => res.status(201).json(newActivity))
        .catch(err => {
            console.error('Error creating favorite activity:', err);
            res.status(500).json({ error: 'Error creating favorite activity' });
        });
};

// Obtenir toutes les activités favorites par player_id
const getFavoriteActivitiesByPlayerId = (req, res) => {
    const { player_id } = req.params;
    favoriteActivityModel.getFavoriteActivitiesByPlayerId(player_id)
        .then(activities => res.json(activities))
        .catch(err => {
            console.error('Error fetching favorite activities:', err);
            res.status(500).json({ error: 'Error fetching favorite activities' });
        });
};

// Obtenir toutes les activités favorites
const getAllFavoriteActivities = (req, res) => {
    favoriteActivityModel.getAllFavoriteActivities()
        .then(activities => res.json(activities))
        .catch(err => {
            console.error('Error fetching favorite activities:', err);
            res.status(500).json({ error: 'Error fetching favorite activities' });
        });
};

// Obtenir une activité favorite par activity_id
const getFavoriteActivityByActivityId = (req, res) => {
    const { activity_id } = req.params;
    favoriteActivityModel.getFavoriteActivityByActivityId(activity_id)
        .then(activity => res.json(activity))
        .catch(err => {
            console.error('Error fetching favorite activity:', err);
            res.status(500).json({ error: 'Error fetching favorite activity' });
        });
};

// Mettre à jour une activité favorite
const updateFavoriteActivity = (req, res) => {
    const { player_id, activity_id } = req.params;
    const { new_activity_id } = req.body;
    favoriteActivityModel.updateFavoriteActivity(player_id, activity_id, new_activity_id)
        .then(updatedActivity => {
            if (!updatedActivity) {
                return res.status(404).json({ error: 'Favorite activity not found' });
            }
            res.json(updatedActivity);
        })
        .catch(err => {
            console.error('Error updating favorite activity:', err);
            res.status(500).json({ error: 'Error updating favorite activity' });
        });
};

// Supprimer une activité favorite
const deleteFavoriteActivity = (req, res) => {
    const { player_id, activity_id } = req.params;
    favoriteActivityModel.deleteFavoriteActivity(player_id, activity_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Favorite activity not found' });
            }
            res.json(result);
        })
        .catch(err => {
            console.error('Error deleting favorite activity:', err);
            res.status(500).json({ error: 'Error deleting favorite activity' });
        });
};

module.exports = {
    createFavoriteActivity,
    getFavoriteActivitiesByPlayerId,
    getAllFavoriteActivities,
    getFavoriteActivityByActivityId,
    updateFavoriteActivity,
    deleteFavoriteActivity
};