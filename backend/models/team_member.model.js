const db = require('../database/db_init');

// create ou ajouter un membre d'équipe
const addTeamMember = (team_id, player_id) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO team_member (team_id, player_id) VALUES (?, ?)', [team_id, player_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ team_id, player_id });
        });
    });
};

// Obtenir les membres d'une équipe par ID d'équipe
const getTeamMembersByTeamId = (team_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_member WHERE team_member.team_id = ?', [team_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Supprimer un membre d'une équipe
const removeTeamMember = (team_id, player_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM team_member WHERE team_id = ? AND player_id = ?', [team_id, player_id], (err, result) => {
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

// Obtenir toutes les équipes d'un joueur par ID de joueur
const getTeamsByPlayerId = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_member WHERE team_member.player_id = ?', [player_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Obtenir tous les membres d'équipe avec détails
const getAllTeamMembers = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_member', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    addTeamMember,
    getTeamMembersByTeamId,
    removeTeamMember,
    getTeamsByPlayerId,
    getAllTeamMembers
};