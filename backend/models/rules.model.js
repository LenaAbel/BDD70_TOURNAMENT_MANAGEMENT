const db = require('../database/db_init');

// Créer une règle
const createRule = (ruleSet, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO rules (ruleSet, activity_id) VALUES (?, ?)', [ruleSet, activity_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ rules_id: result.insertId, ruleSet, activity_id });
        });
    });
};

// Obtenir une règle par ID
const getRuleById = (rules_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM rules WHERE rules_id = ?', [rules_id], (err, result) => {
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

// Mettre à jour une règle par ID
const updateRule = (rules_id, ruleSet, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE rules SET ruleSet = ?, activity_id = ? WHERE rules_id = ?', [ruleSet, activity_id, rules_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ rules_id, ruleSet, activity_id });
        });
    });
};

// Supprimer une règle par ID
const deleteRule = (rules_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM rules WHERE rules_id = ?', [rules_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve(result);
        });
    });
};

// Obtenir toutes les règles par ID de jeu [NE MARCHE PAS]
const getRulesByGameId = (activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM rules WHERE activity_id = ?', [activity_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Obtenir toutes les règles
const getAllRules = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM rules', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    createRule,
    getRuleById,
    updateRule,
    deleteRule,
    getRulesByGameId,
    getAllRules
};