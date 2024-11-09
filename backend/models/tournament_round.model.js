const db = require("../database/db_init");

// Créer un nouveau round
const createRound = (tournament_id, round_number) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO tournament_round (tournament_id, round_number) VALUES (?, ?)",
            [tournament_id, round_number],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ round_id: result.insertId, tournament_id, round_number });
            }
        );
    });
};

// Obtenir tous les rounds
const getAllRounds = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM tournament_round", (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Obtenir un round par ID
const getRoundById = (round_id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM tournament_round WHERE round_id = ?", [round_id], (err, result) => {
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

// Mettre à jour un round par ID
const updateRound = (round_id, tournament_id, round_number) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE tournament_round SET tournament_id = ?, round_number = ? WHERE round_id = ?",
            [tournament_id, round_number, round_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ round_id, tournament_id, round_number });
            }
        );
    });
};

// Supprimer un round par ID
const deleteRound = (round_id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM tournament_round WHERE round_id = ?", [round_id], (err, result) => {
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

// Obtenir tous les rounds par ID de tournoi
const getRoundsByTournamentId = (tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM tournament_round WHERE tournament_id = ?", [tournament_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Supprimer tous les rounds par ID de tournoi
const deleteRoundsByTournamentId = (tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM tournament_round WHERE tournament_id = ?", [tournament_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ message: "Rounds deleted successfully" });
        });
    });
};

module.exports = {
    createRound,
    getAllRounds,
    getRoundById,
    updateRound,
    deleteRound,
    getRoundsByTournamentId,
    deleteRoundsByTournamentId
};