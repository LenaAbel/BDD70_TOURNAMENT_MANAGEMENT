const db = require("../database/db_init");

// Créer un classement
const createRanking = (tournament_id, player_id, team_id, ranking_points, ranking_ranking) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO ranking (tournament_id, player_id, team_id, ranking_points, ranking_ranking) VALUES (?, ?, ?, ?, ?)',
            [tournament_id, player_id, team_id, ranking_points, ranking_ranking],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ ranking_id: result.insertId, tournament_id, player_id, team_id, ranking_points, ranking_ranking });
            }
        );
    });
};

// Obtenir un classement par ID
const getRankingById = (ranking_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM ranking WHERE ranking_id = ?', [ranking_id], (err, result) => {
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

// Get ranking by player ID
const getRankingByPlayerId = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM ranking WHERE player_id = ?', [player_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Obtenir tous les classements
const getAllRankings = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM ranking', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Mettre à jour un classement par ID
const updateRanking = (ranking_id, tournament_id, player_id, team_id, ranking_points, ranking_ranking) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE ranking SET tournament_id = ?, player_id = ?, team_id = ?, ranking_points = ?, ranking_ranking = ? WHERE ranking_id = ?',
            [tournament_id, player_id, team_id, ranking_points, ranking_ranking, ranking_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ ranking_id, tournament_id, player_id, team_id, ranking_points, ranking_ranking });
            }
        );
    });
};

// Supprimer un classement par ID
const deleteRanking = (ranking_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM ranking WHERE ranking_id = ?', [ranking_id], (err, result) => {
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
    createRanking,
    getRankingById,
    getAllRankings,
    updateRanking,
    deleteRanking,
    getRankingByPlayerId,
};