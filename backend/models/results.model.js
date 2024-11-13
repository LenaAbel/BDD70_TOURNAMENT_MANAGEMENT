const db = require("../database/db_init");

// Créer un résultat
const createResult = (match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO results (match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ results_id: result.insertId, match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score });
            }
        );
    });
};

// Obtenir un résultat par ID
const getResultById = (results_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM results WHERE results_id = ?', [results_id], (err, result) => {
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

// Obtenir tous les résultats
const getAllResults = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM results', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Mettre à jour un résultat par ID
const updateResult = (results_id, match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE results SET match_id = ?, winner_player_id = ?, loser_player_id = ?, winner_team_id = ?, loser_team_id = ?, winner_score = ?, loser_score = ? WHERE results_id = ?',
            [match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score, results_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ results_id, match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score });
            }
        );
    });
};

// Supprimer un résultat par ID
const deleteResult = (results_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM results WHERE results_id = ?', [results_id], (err, result) => {
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

module.exports = {
    createResult,
    getResultById,
    getAllResults,
    updateResult,
    deleteResult
};