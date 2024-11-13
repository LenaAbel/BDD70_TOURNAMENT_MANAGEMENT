const db = require("../database/db_init");

// Créer un matchpairing
const createMatchPairing = (match_id, player_id, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO matchpairing (match_id, player_id, team_id) VALUES (?, ?, ?)',
            [match_id, player_id, team_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ matchpairing_id: result.insertId, match_id, player_id, team_id });
            }
        );
    });
};

// Obtenir un matchpairing par ID
const getMatchPairingById = (matchpairing_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM matchpairing WHERE matchpairing_id = ?', [matchpairing_id], (err, result) => {
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

// Obtenir tous les matchpairings
const getAllMatchPairings = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM matchpairing', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Mettre à jour un matchpairing par ID
const updateMatchPairing = (matchpairing_id, match_id, player_id, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE matchpairing SET match_id = ?, player_id = ?, team_id = ? WHERE matchpairing_id = ?',
            [match_id, player_id, team_id, matchpairing_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ matchpairing_id, match_id, player_id, team_id });
            }
        );
    });
};

// Supprimer un matchpairing par ID
const deleteMatchPairing = (matchpairing_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM matchpairing WHERE matchpairing_id = ?', [matchpairing_id], (err, result) => {
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
    createMatchPairing,
    getMatchPairingById,
    getAllMatchPairings,
    updateMatchPairing,
    deleteMatchPairing
};