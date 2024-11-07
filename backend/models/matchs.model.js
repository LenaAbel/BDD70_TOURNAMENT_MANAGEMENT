const db = require("../database/db_init");

// Créer un nouveau match
const createMatch = (match) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO matchs SET ?", match, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ matchs_id: result.insertId, ...match });
        });
    });
};

// Obtenir un match par son ID
const getMatchById = (matchId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM matchs WHERE matchs_id = ?", [matchId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]);
        });
    });
};

// Obtenir tous les matchs
const getAllMatchs = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM matchs", (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Mettre à jour un match par son ID
const updateMatch = (matchId, updatedMatch) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE matchs SET ? WHERE matchs_id = ?", [updatedMatch, matchId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Supprimer un match par son ID
const deleteMatch = (matchId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM matchs WHERE matchs_id = ?", [matchId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {
    createMatch,
    getMatchById,
    getAllMatchs,
    updateMatch,
    deleteMatch
};
