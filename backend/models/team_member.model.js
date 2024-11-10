const db = require('../database/db_init');

// create ou ajouter un membre d'équipe
const addTeamMember = (team_id, player_id) => {
    return new Promise((resolve, reject) => {
        // Ajouter le joueur à la table team_member
        db.query('INSERT INTO team_member (team_id, player_id) VALUES (?, ?)', [team_id, player_id], (err, result) => {
            if (err) {
                return reject(err);
            }

            // Mettre à jour l'entité team pour refléter l'ajout du joueur
            db.query('UPDATE player SET team_id = ? WHERE player_id = ?', [team_id, player_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ team_id, player_id });
            });
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

            // Mettre à jour l'entité player pour refléter la suppression du joueur de l'équipe
            db.query('UPDATE player SET team_id = NULL WHERE player_id = ?', [player_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
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

const updateTeamMember = (team_id, player_id, new_team_id) => {
    return new Promise((resolve, reject) => {
        // Mettre à jour la table team_member
        db.query('UPDATE team_member SET team_id = ? WHERE team_id = ? AND player_id = ?', [new_team_id, team_id, player_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }

            // Mettre à jour l'entité player pour refléter le changement d'équipe
            db.query('UPDATE player SET team_id = ? WHERE player_id = ?', [new_team_id, player_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ team_id: new_team_id, player_id });
            });
        });
    });
};

module.exports = {
    addTeamMember,
    getTeamMembersByTeamId,
    removeTeamMember,
    getTeamsByPlayerId,
    getAllTeamMembers,
    updateTeamMember
};