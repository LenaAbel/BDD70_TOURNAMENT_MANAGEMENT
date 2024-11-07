const db = require('../database/db_init');

// Create a new team
const createTeam = (name) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO team (team_name) VALUES (?)', [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: result.insertId, name });
        });
    });
};

// Get a team by ID
const getTeamById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT team_id, team_name FROM team WHERE team_id = ?', [id], (err, result) => {
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
const updateTeam = (id, name) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE team SET team_name = ? WHERE team_id = ?', [name, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ id, name });
        });
    });
};

// Delete a team by ID
const deleteTeam = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM team WHERE team_id = ?', [id], (err, result) => {
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
        db.query('SELECT team_id, team_name FROM team', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    createTeam,
    getTeamById,
    updateTeam,
    deleteTeam,
    getAllTeams
};
