const db = require('../database/db_init');

// Crée une activité
const createActivity = (name) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO activity (name) VALUES (?)', [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: result.insertId, name });
        });
    });
};

// Obtenir une activité par ID
const getActivityById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM activity WHERE id = ?', [id], (err, result) => {
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
const updateActivity = (id, name) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE activity SET name = ? WHERE id = ?', [name, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ id, name });
        });
    });
};

// Supprimer une activité par ID
const deleteActivity = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM activity WHERE id = ?', [id], (err, result) => {
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