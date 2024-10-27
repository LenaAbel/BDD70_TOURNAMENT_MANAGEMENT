const db = require('../database/db_init');

const createPlayer = (email, name, lastname, nickname, password, account_type, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO player (email, name, lastname, nickname, password, account_type, team_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, name, lastname, nickname, password, account_type, team_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ id: result.insertId, email, name, lastname, nickname, account_type, team_id });
            }
        );
    });
};

// Get all players
const getAllPlayers = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM player', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Get a player by ID
const getPlayerById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM player WHERE id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve(null);
            }
            resolve(results[0]);
        });
    });
};

// Update a player by ID
const updatePlayer = (id, email, name, lastname, nickname, password, account_type, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE player SET email = ?, name = ?, lastname = ?, nickname = ?, password = ?, account_type = ?, team_id = ? WHERE id = ?',
            [email, name, lastname, nickname, password, account_type, team_id, id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ id, email, name, lastname, nickname, account_type, team_id });
            }
        );
    });
};

// Delete a player by ID
const deletePlayer = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM player WHERE id = ?', [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ message: 'Player deleted successfully' });
        });
    });
};

module.exports = {
    createPlayer,
    getAllPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer
};