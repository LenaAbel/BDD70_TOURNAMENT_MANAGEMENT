// models/team.model.js
const db = require('../database/db_init');

// Create a new team
const createTeam = (name) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO team (name) VALUES (?)', [name], (err, result) => {
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
        db.query('SELECT * FROM team WHERE team_id = ?', [team_id], (err, result) => {
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
        db.query('UPDATE team SET name = ? WHERE team_id = ?', [name, team_id], (err, result) => {
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
        db.query('SELECT * FROM team', (err, results) => {
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
