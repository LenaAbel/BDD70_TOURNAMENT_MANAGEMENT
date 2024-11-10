const db = require('../database/db_init');

// Create a new team
const createTeam = (name) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO team (team_name) VALUES (?)', [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ team_id: result.insertId, name });
        });
    });
};

// Get a team by ID
const getTeamById = (team_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT team_id, team_name FROM team WHERE team_id = ?', [team_id], (err, result) => {
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

// Update a team by ID
const updateTeam = (team_id, name) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE team SET team_name = ? WHERE team_id = ?', [name, team_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ team_id, name });
        });
    });
};

// Delete a team by ID
const deleteTeam = (team_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM team WHERE team_id = ?', [team_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ message: 'Team deleted successfully' });
        });
    });
};

// Get all teams
const getAllTeams = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT t.team_id, t.team_name, COUNT(p.player_id) AS player_count FROM team t LEFT JOIN player p ON t.team_id = p.team_id GROUP BY t.team_id, t.team_name', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const getBestTeamByActivity = (activity_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM meilleur_equipe_par_activité WHERE activity_id = ? ORDER BY total_wins DESC LIMIT 1`,
            [activity_id],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return resolve(null); // No results found for this activity
                }
                resolve(results[0]); // Return the best team for this activity
            }
        );
    });
};

module.exports = {
    createTeam,
    getTeamById,
    updateTeam,
    deleteTeam,
    getAllTeams,
    getBestTeamByActivity
};
