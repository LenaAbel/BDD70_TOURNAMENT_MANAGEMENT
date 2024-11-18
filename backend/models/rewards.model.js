const db = require('../database/db_init');

// Create a reward
const createReward = (reward_name, reward_type, reward_points, reward_description) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO reward (reward_name, reward_type, reward_points, reward_description) VALUES (?, ?, ?, ?)', 
            [reward_name, reward_type, reward_points, reward_description], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ reward_id: result.insertId, reward_name, reward_type, reward_points, reward_description });
            }
        );
    });
};

// Get a reward by ID
const getRewardById = (reward_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM reward WHERE reward_id = ?', 
            [reward_id], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.length === 0) {
                    return resolve(null);
                }
                resolve(result[0]);
            }
        );
    });
};

// Assign a reward
const assignReward = (tournament_id, reward_id, player_id, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO reward_assignment (tournament_id, reward_id, player_id, team_id) VALUES (?, ?, ?, ?)', 
            [tournament_id, reward_id, player_id, team_id], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ reward_assignment_id: result.insertId, tournament_id, reward_id, player_id, team_id });
            }
        );
    });
};

// Get reward assignment by ID
const getRewardAssignmentById = (reward_assignment_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM reward_assignment WHERE reward_assignment_id = ?', 
            [reward_assignment_id], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.length === 0) {
                    return resolve(null);
                }
                resolve(result[0]);
            }
        );
    });
};
// Get all reward assignments
const getAllRewardAssignments = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT ra.*, COALESCE(p.player_nickname, '') AS player_nickname, COALESCE(t.team_name, '') AS team_name 
             FROM reward_assignment ra
             LEFT JOIN player p ON ra.player_id = p.player_id
             LEFT JOIN team t ON ra.team_id = t.team_id`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Get all rewards
// Delete a reward by ID
const deleteRewardById = (reward_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM reward WHERE reward_id = ?', 
            [reward_id], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ message: 'Reward deleted successfully' });
            }
        );
    });
};

// Delete a reward assignment by ID
const deleteRewardAssignmentById = (reward_assignment_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM reward_assignment WHERE reward_assignment_id = ?', 
            [reward_assignment_id], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ message: 'Reward assignment deleted successfully' });
            }
        );
    });
};
const createRewardAssignment = (tournament_id, reward_id, player_id, team_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO reward_assignment (tournament_id, reward_id, player_id, team_id) VALUES (?, ?, ?, ?)', 
            [tournament_id, reward_id, player_id, team_id], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ reward_assignment_id: result.insertId, tournament_id, reward_id, player_id, team_id });
            }
        );
    });
};

const getAllRewards = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM reward', (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};


module.exports = {
    createReward,
    getRewardById,
    assignReward,
    getRewardAssignmentById,
    getAllRewards,
    getAllRewardAssignments,
};