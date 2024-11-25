const db = require('../database/db_init');

// Créer un tournoi
const createTournament = (
    name,
    start_time,
    bestofX,
    poolSize,
    tournament_type_id,
    format_id,
    rule_id,
    organizer_id
) => {
    if (!name || !start_time || !tournament_type_id || !rule_id || !organizer_id) {
        return Promise.reject(new Error("Required fields cannot be null"));
    }

    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO tournament (tournament_name, tournament_start_time, tournament_bestOfX, tournament_poolSize, tournament_type_id, format_id, rule_id, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, start_time, bestofX, poolSize, tournament_type_id, format_id, rule_id, organizer_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({
                    tournament_id: result.insertId,
                    name,
                    start_time,
                    bestofX,
                    poolSize,
                    tournament_type_id,
                    format_id,
                    rule_id,
                    organizer_id,
                });
            }
        );
    });
};


// Obtenir tous les tournois
const getAllTournaments = () => {
    return new Promise((resolve, reject) => {
        db.query(`
      SELECT 
        t.*, 
        r.*, 
        a.*, 
        f.format_name,
        tt.type_name AS tournament_type_name,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('player_id', p.player_id, 'player_nickname', p.player_nickname)) 
          FROM register rg 
          INNER JOIN player p ON rg.player_id = p.player_id 
          WHERE rg.tournament_id = t.tournament_id) AS players 
      FROM tournament t 
      INNER JOIN rules r ON t.rule_id = r.rules_id 
      INNER JOIN activity a ON r.activity_id = a.activity_id
      INNER JOIN format_type f ON t.format_id = f.format_id
      INNER JOIN tournament_type tt ON t.tournament_type_id = tt.type_id
    `, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};


const getTournamentById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT 
                t.*, 
                r.*, 
                a.*, 
                f.format_name,
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('matchs_id', m.matchs_id, 'matchs_start_time', m.matchs_start_time, 'matchpairings', 
                    (SELECT JSON_ARRAYAGG(JSON_OBJECT('matchpairing_id', mp.matchpairing_id, 'player_id', mp.player_id, 'team_id', mp.team_id)) 
                    FROM matchpairing mp WHERE mp.match_id = m.matchs_id))) 
                FROM matchs m WHERE m.tournament_id = t.tournament_id) AS matchs, 
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('player_id', p.player_id, 'player_nickname', p.player_nickname)) 
                FROM register rg 
                INNER JOIN player p ON rg.player_id = p.player_id 
                WHERE rg.tournament_id = t.tournament_id) AS players 
            FROM tournament t 
            INNER JOIN rules r ON t.rule_id = r.rules_id 
            INNER JOIN activity a ON r.activity_id = a.activity_id
            INNER JOIN format_type f ON t.format_id = f.format_id
            WHERE t.tournament_id = ?
        `, [id], (err, results) => {
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

const updateTournament = (
    tournament_id,
    name,
    start_time,
    bestofX,
    poolSize,
    tournament_type_id, // Changed from 'type'
    format_id,          // Changed from 'format'
    rule_id,
    organizer_id
) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE tournament SET tournament_name = ?, tournament_start_time = ?, tournament_bestOfX = ?, tournament_poolSize = ?, tournament_type_id = ?, format_id = ?, rule_id = ?, organizer_id = ? WHERE tournament_id = ?',
            [name, start_time, bestofX, poolSize, tournament_type_id, format_id, rule_id, organizer_id, tournament_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({
                    tournament_id,
                    name,
                    start_time,
                    bestofX,
                    poolSize,
                    tournament_type_id,
                    format_id,
                    rule_id,
                    organizer_id,
                });
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

const getFormatTypes = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM format_type', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getTournamentTypes = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tournament_type', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


module.exports = {
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    getFormatTypes,
    getTournamentTypes,
};