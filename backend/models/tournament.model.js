const db = require('../database/db_init');

// Créer un tournoi
const createTournament = (name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id) => {
    if (!name || !start_time || !type || !rule_id || !organizer_id) {
        return Promise.reject(new Error("Required fields cannot be null"));
    }

    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO tournament (tournament_name, tournament_start_time, tournament_bestOfX, tournament_poolSize, tournament_type, tournament_format, rule_id, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ id: result.insertId, name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id });
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

const getTournamentById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tournament WHERE tournament_id = ?', [id], (err, results) => {
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

const deleteTournament = (tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tournament WHERE tournament_id = ?', [tournament_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null); // No rows affected, meaning the tournament was not found
            }
            resolve({ message: 'Tournament deleted successfully' });
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