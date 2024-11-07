const db = require('../database/db_init');

// Créer un tournoi
const createTournament = (name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO tournament (tournament_name, tournament_start_time, tournament_bestOfX, tournament_poolSize, tournament_type, tournament_format, rule_id, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ tournament_id: result.insertId, name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id });
            }
        );
    });
};

// Obtenir tous les tournois
const getAllTournaments = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tournament t INNER JOIN rules r ON t.rule_id = r.rules_id INNER JOIN activity a ON r.activity_id = a.activity_id', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Obtenir un tournoi par ID
const getTournamentById = (tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tournament WHERE tournament_id = ?', [tournament_id], (err, result) => {
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

// Mettre à jour un tournoi par ID
const updateTournament = (tournament_id, name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE tournament SET tournament_name = ?, tournament_start_time = ?, tournament_bestOfX = ?, tournament_poolSize = ?, tournament_type = ?, tournament_format = ?, rule_id = ?, organizer_id = ? WHERE tournament_id = ?',
            [name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id, tournament_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ tournament_id, name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id });
            }
        );
    });
};

// Supprimer un tournoi par ID
const deleteTournament = (tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tournament WHERE tournament_id = ?', [tournament_id], (err, result) => {
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
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament
};