const db = require("../database/db_init")

const createPlayerStats = (player_id, activity_id, total_matches, wins, losses, draws) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO player_stats (player_id, activity_id, total_matches, wins, losses, draws) VALUES (?, ?, ?, ?, ?, ?)',
            [player_id, activity_id, total_matches, wins, losses, draws],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ player_id, activity_id, total_matches, wins, losses, draws });
            }
        );
    });
}

const getPlayerStatsByPlayerId = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM player_stats WHERE player_id = ?', [player_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

const getPlayerStatsByActivityId = (activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM player_stats WHERE activity_id = ?', [activity_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

const getAllPlayerStats = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM player_stats', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

const updatePlayerStats = (player_id, activity_id, total_matches, wins, losses, draws) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE player_stats SET total_matches = ?, wins = ?, losses = ?, draws = ? WHERE player_id = ? AND activity_id = ?',
            [total_matches, wins, losses, draws, player_id, activity_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ player_id, activity_id, total_matches, wins, losses, draws });
            }
        );
    });
}

const deletePlayerStats = (player_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM player_stats WHERE player_id = ? AND activity_id = ?', [player_id, activity_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.affectedRows > 0);
        });
    });
}

module.exports = {
    createPlayerStats,
    getPlayerStatsByPlayerId,
    getPlayerStatsByActivityId,
    getAllPlayerStats,
    updatePlayerStats,
    deletePlayerStats
};