const db = require('../database/db_init');

// Mettre à jour une activité favorite par player_id et activity_id
const updateFavoriteActivity = (player_id, activity_id, new_activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE favoriteactivity SET activity_id = ? WHERE player_id = ? AND activity_id = ?', [new_activity_id, player_id, activity_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ player_id, activity_id: new_activity_id });
        });
    });
};

// Supprimer une activité favorite par player_id et activity_id
const deleteFavoriteActivity = (player_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM favoriteactivity WHERE player_id = ? AND activity_id = ?', [player_id, activity_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ message: 'FavoriteActivity deleted successfully' });
        });
    });
};

// Obtenir toutes les activités favorites par player_id
const getFavoriteActivitiesByPlayerId = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM favoriteactivity WHERE player_id = ?', [player_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Obtenir toutes les activités favorites
const getAllFavoriteActivities = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM favoriteactivity', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

//obtenir une activité favorite par activity_id
const getFavoriteActivityByActivityId = (activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM favoriteactivity WHERE activity_id = ?', [activity_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

//create favorite activity
const createFavoriteActivity = (player_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO favoriteactivity (player_id, activity_id) VALUES (?, ?)', [player_id, activity_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ player_id, activity_id });
        });
    });
};

module.exports = {
    updateFavoriteActivity,
    deleteFavoriteActivity,
    getFavoriteActivitiesByPlayerId,
    getAllFavoriteActivities,
    getFavoriteActivityByActivityId,
    createFavoriteActivity
};