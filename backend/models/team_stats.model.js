const db = require("../database/db_init");

// Créer des statistiques pour une équipe
const createTeamStats = (team_id, activity_id, total_matches, wins, losses, draws) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO team_stats (team_id, activity_id, team_stats_total_matches, team_stats_wins, team_stats_losses, team_stats_draws) VALUES (?, ?, ?, ?, ?, ?)',
            [team_id, activity_id, total_matches, wins, losses, draws],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ team_id, activity_id, total_matches, wins, losses, draws });
            }
        );
    });
};

// Obtenir les statistiques d'une équipe par ID d'équipe
const getTeamStatsByTeamId = (team_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_stats WHERE team_id = ?', [team_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Obtenir les statistiques d'une équipe par ID d'activité
const getTeamStatsByActivityId = (activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_stats WHERE activity_id = ?', [activity_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Obtenir toutes les statistiques des équipes
const getAllTeamStats = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_stats', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Mettre à jour les statistiques d'une équipe
const updateTeamStats = (team_id, activity_id, total_matches, wins, losses, draws) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE team_stats SET team_stats_total_matches = ?, team_stats_wins = ?, team_stats_losses = ?, team_stats_draws = ? WHERE team_id = ? AND activity_id = ?',
            [total_matches, wins, losses, draws, team_id, activity_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ team_id, activity_id, total_matches, wins, losses, draws });
            }
        );
    });
};

// Supprimer les statistiques d'une équipe
const deleteTeamStats = (team_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM team_stats WHERE team_id = ? AND activity_id = ?', [team_id, activity_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
};

module.exports = {
    createTeamStats,
    getTeamStatsByTeamId,
    getTeamStatsByActivityId,
    getAllTeamStats,
    updateTeamStats,
    deleteTeamStats
};