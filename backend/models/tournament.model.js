const db = require('../database/db_init');

const createTournament = (name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO tournament (name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
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

const getAllTournaments = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tournament', (err, results) => {
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

const updateTournament = (id, name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE tournament SET name = ?, start_time = ?, bestofX = ?, poolSize = ?, type = ?, format = ?, rule_id = ?, organizer_id = ? WHERE tournament_id = ?',
            [name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id, id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ id, name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id });
            }
        );
    });
};

const deleteTournament = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tournament WHERE tournament_id = ?', [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
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
