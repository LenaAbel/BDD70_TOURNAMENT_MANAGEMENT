const db = require('../database/db_init');

// Create a new team
const createTeam = (name) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO team (team_name) VALUES (?)', [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ team_id: result.insertId, team_name: name });
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
const updateTeam = (team_id, team_name) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE team SET team_name = ? WHERE team_id = ?', [team_name, team_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve(null);
            }
            resolve({ team_id, team_name });
        });
    });
};

// Assign players to a team by updating their team_id
const assignPlayersToTeam = (teamId, playerIds) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(playerIds) || playerIds.length === 0) {
            return reject(new Error("playerIds must be a non-empty array."));
        }

        // Reset `team_id` for all players in this team to null, then set it for selected players
        const resetQuery = 'UPDATE player SET team_id = NULL WHERE team_id = ? AND player_account_type = "player"';
        const updateQuery = 'UPDATE player SET team_id = ? WHERE player_id IN (?) AND player_account_type = "player"';

        // Reset players in the team to NULL first
        db.query(resetQuery, [teamId], (err) => {
            if (err) return reject(err);

            // Update only players with the role 'player' for the given player IDs
            db.query(updateQuery, [teamId, playerIds], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
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

// Get all teams with player count
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

module.exports = {
    createTeam,
    getTeamById,
    updateTeam,
    deleteTeam,
    getAllTeams,
    assignPlayersToTeam,
};
