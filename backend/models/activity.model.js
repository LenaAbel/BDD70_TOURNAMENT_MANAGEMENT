const db = require('../database/db_init');

// Crée une activité
const createActivity = (name, player_number, type, description, category) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO activity (activity_name, activity_number_of_players, activity_type, activity_description, activity_category) VALUES (?, ?, ?, ?, ?)', [name, player_number, type, description, category], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: result.insertId, name, player_number, type, description, category });
        });
    });
};

// Obtenir une activité par ID
const getActivityById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM activity WHERE activity_id = ?', [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.length === 0) {
                return resolve(null);
            }
            resolve(result[0]);
        });
    });
};

// Mettre à jour une activité par ID
const updateActivity = (id, name, player_number, type, description, category) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE activity SET activity_name = ?, activity_number_of_players = ?, activity_type = ?, activity_description = ?, activity_category = ? WHERE activity_id = ?', [name, player_number, type, description, category, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ id, name, player_number, type, description, category });
        });
    });
};

// Supprimer une activité par ID
const deleteActivity = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM activity WHERE activity_id = ?', [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ message: 'Activity deleted successfully' });
        });
    });
};

// Obtenir toutes les activités
const getAllActivities = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM activity', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    createActivity,
    getActivityById,
    updateActivity,
    deleteActivity,
    getAllActivities,
};