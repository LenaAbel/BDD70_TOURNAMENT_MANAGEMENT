const db = require("../database/db_init");

// Create player stats
const createPlayerStats = (player_id, activity_id, total_matches, wins, losses, draws) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO player_stats (player_id, activity_id, player_stats_total_matches, player_stats_wins, player_stats_losses, player_stats_draws) VALUES (?, ?, ?, ?, ?, ?)',
            [player_id, activity_id, total_matches, wins, losses, draws],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ player_id, activity_id, total_matches, wins, losses, draws });
            }
        );
    });
};

// Get player stats by player ID
const getPlayerStatsByPlayerId = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM player_stats WHERE player_id = ?', [player_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Get player stats by activity ID
const getPlayerStatsByActivityId = (activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM player_stats WHERE activity_id = ?', [activity_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Get all player stats
const getAllPlayerStats = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM player_stats', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Update player stats
const updatePlayerStats = (player_id, activity_id, total_matches, wins, losses, draws) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE player_stats SET player_stats_total_matches = ?, player_stats_wins = ?, player_stats_losses = ?, player_stats_draws = ? WHERE player_id = ? AND activity_id = ?',
            [total_matches, wins, losses, draws, player_id, activity_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null); // No record was updated
                }
                resolve({ player_id, activity_id, total_matches, wins, losses, draws });
            }
        );
    });
};

// Delete player stats
const deletePlayerStats = (player_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM player_stats WHERE player_id = ? AND activity_id = ?', [player_id, activity_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0); // Indicates if any row was deleted
        });
    });
};

module.exports = {
    createPlayerStats,
    getPlayerStatsByPlayerId,
    getPlayerStatsByActivityId,
    getAllPlayerStats,
    updatePlayerStats,
    deletePlayerStats
};
