const db = require("../database/db_init");

// Créer une inscription
const createRegister = (player_id, team_id, tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO register (player_id, team_id, tournament_id) VALUES (?, ?, ?)',
            [player_id, team_id, tournament_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ player_id, team_id, tournament_id });
            }
        );
    });
};

// Obtenir une inscription par ID de joueur et ID de tournoi
const getRegisterById = (player_id, tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM register WHERE player_id = ? AND tournament_id = ?', [player_id, tournament_id], (err, result) => {
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

// Obtenir toutes les inscriptions
const getAllRegisters = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM register', (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Mettre à jour une inscription par ID de joueur et ID de tournoi
const updateRegister = (player_id, tournament_id, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE register SET team_id = ? WHERE player_id = ? AND tournament_id = ?',
            [team_id, player_id, tournament_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ player_id, team_id, tournament_id });
            }
        );
    });
};

// Supprimer une inscription par ID de joueur et ID de tournoi
const deleteRegister = (player_id, tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM register WHERE player_id = ? AND tournament_id = ?",
            [player_id, tournament_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.affectedRows > 0); // Return `true` if deletion was successful
            }
        );
    });
};

//register just one player to a tournament
const registerPlayerToTournament = (player_id, tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO register (player_id, tournament_id) VALUES (?, ?)', [player_id, tournament_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ player_id, tournament_id });
        });
    });
};

const isPlayerRegistered = (player_id, tournament_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM register WHERE player_id = ? AND tournament_id = ?",
            [player_id, tournament_id],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.length > 0); // Return `true` if a record exists
            }
        );
    });
};

const registerTeam = (team_id, tournament_id) => {
    return new Promise((resolve, reject) => {
        // First, get one player from the team
        db.query('SELECT player_id FROM player WHERE team_id = ? LIMIT 1', [team_id], (err, players) => {
            if (err) {
                return reject(err);
            }
            
            if (players.length === 0) {
                return reject(new Error('No players found for the specified team.'));
            }

            // Use the first player found in the team
            //const player_id = players[0].player_id;

            // Register this player along with the team to the tournament
            db.query(
                'INSERT INTO register (player_id, team_id, tournament_id) VALUES (?, ?, ?)',
                [player_id, team_id, tournament_id],
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({ player_id, team_id, tournament_id });
                }
            );
        });
    });
};

module.exports = {
    createRegister,
    getRegisterById,
    getAllRegisters,
    updateRegister,
    deleteRegister,
    registerPlayerToTournament,
    registerTeam,
    isPlayerRegistered
};