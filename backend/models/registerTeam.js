const db = require('../database/db_init');

// Créer une inscription
const registerTeam = (team_id, tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO team_register (team_id, tournament_id) VALUES (?, ?)',
            [team_id, tournament_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ team_id, tournament_id });
            }
        );
    });
};

const getTeamsInTournament = (tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT team_id FROM team_register WHERE tournament_id = ?',
            [tournament_id],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);  // Array of teams registered in the tournament
            }
        );
    });
};

const getTournamentsForTeam = (team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT tournament_id FROM team_register WHERE team_id = ?',
            [team_id],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);  // Array of tournaments the team is registered in
            }
        );
    });
};

const removeTeamFromTournament = (team_id, tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM team_register WHERE team_id = ? AND tournament_id = ?',
            [team_id, tournament_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ message: 'Team removed from tournament successfully' });
            }
        );
    });
};

module.exports = {
    registerTeam,
    getTeamsInTournament,
    getTournamentsForTeam,
    removeTeamFromTournament
};
