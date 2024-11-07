const db = require('../database/db_init');

const createPlayer = (email, name, lastname, nickname, password, account_type, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO player (player_email, player_name, player_lastname, player_nickname, player_password, player_account_type, team_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, name, lastname, nickname, password, account_type, team_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ player_id: result.insertId, email, name, lastname, nickname, account_type, team_id });
            }
        );
    });
};

// Get all players with their favorite activities
const getAllPlayers = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT p.player_id, p.player_email, p.player_name, p.player_lastname, p.player_nickname, p.player_account_type, 
                    p.team_id, GROUP_CONCAT(a.activity_name) AS preferredGames
                FROM player p 
                LEFT JOIN favoriteactivity f ON p.player_id = f.player_id 
                LEFT JOIN activity a ON f.activity_id = a.activity_id 
                GROUP BY p.player_id`,
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            }
        );
    });
};

// Get a player by ID
const getPlayerById = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM player WHERE player_id = ?', 
            [player_id], 
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            }
        );
    });
};

// Update a player by ID
const updatePlayer = (player_id, email, name, lastname, nickname, password, account_type, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE player SET player_email = ?, player_name = ?, player_lastname = ?, player_nickname = ?, player_password = ?, player_account_type = ?, team_id = ? WHERE player_id = ?',
            [email, name, lastname, nickname, password, account_type, team_id, player_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ player_id, email, name, lastname, nickname, account_type, team_id });
            }
        );
    });
};

// Delete a player by ID
const deletePlayer = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM player WHERE player_id = ?', 
            [player_id], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ message: 'Player deleted successfully' });
            }
        );
    });
};

// Set a favorite activity
const setFavoriteActivity = (player_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO favoriteactivity (player_id, activity_id) VALUES (?, ?)',
            [player_id, activity_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ id: result.insertId, player_id, activity_id });
            }
        );
    });
};

// Delete a favorite activity
const deleteFavoriteActivity = (player_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM favoriteactivity WHERE player_id = ? AND activity_id = ?',
            [player_id, activity_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ message: 'Favorite activity deleted successfully' });
            }
        );
    });
};

module.exports = {
    createPlayer,
    getAllPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    setFavoriteActivity,
    deleteFavoriteActivity,
};
