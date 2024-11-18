const db = require('../database/db_init');
const bcrypt = require('bcrypt');
// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

const createPlayer = (email, name, lastname, nickname, password, account_type, team_id) => {
    return new Promise((resolve, reject) => {
        if (!password) {
            return reject(new Error("Password cannot be null"));
        }
        db.query(
            'INSERT INTO player (player_email, player_name, player_lastname, player_nickname, player_password, player_account_type, team_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, name, lastname, nickname, password, account_type, team_id],
            (err, result) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return reject(err);
                }
                if (!result || !result.insertId) {
                    console.error("Error: No insertId found in the result object.");
                    return reject(new Error("Failed to insert player - no insertId."));
                }
                resolve({ player_id: result.insertId, email, name, lastname, nickname, account_type, team_id });
            }
        );
    });
};

const registerPlayer = (email, name, lastname, nickname, password, account_type, team_id) => {
    return new Promise((resolve, reject) => {
        // Check if email already exists
        db.query('SELECT * FROM player WHERE player_email = ?', [email], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return reject(new Error('Database error occurred'));
            }
            if (results.length > 0) {
                console.warn('Attempt to register with an existing email:', email);
                return reject(new Error('Email already exists'));
            }

            // Hash the password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Password hashing error:', err);
                    return reject(new Error('Failed to hash password'));
                }

                // Insert the new player into the database
                db.query(
                    'INSERT INTO player (player_email, player_name, player_lastname, player_nickname, player_password, player_account_type, team_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [email, name, lastname, nickname, hashedPassword, account_type, team_id],
                    (err, result) => {
                        if (err) {
                            console.error('Error inserting player:', err);
                            return reject(new Error('Database error occurred'));
                        }

                        resolve({
                            player_id: result.insertId,
                            email,
                            name,
                            lastname,
                            nickname,
                            account_type,
                            team_id,
                        });
                    }
                );
            });
        });
    });
};


// Login a player by verifying password
const loginPlayer = (email, password) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM player WHERE player_email = ?',
            [email],
            (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return reject(err);
                }
                if (results.length === 0) {
                    console.warn('Login attempt with non-existent email:', email);
                    return resolve(null); // User not found
                }

                const player = results[0];

                // Compare the provided password with the stored hashed password
                bcrypt.compare(password, player.player_password, (err, isMatch) => {
                    if (err) {
                        console.error('Password comparison error:', err);
                        return reject(err);
                    }
                    if (isMatch) {
                        resolve({
                            player_id: player.player_id,
                            email: player.player_email,
                            name: player.player_name,
                            lastname: player.player_lastname,
                            nickname: player.player_nickname,
                            account_type: player.player_account_type,
                            team_id: player.team_id,
                        });
                    } else {
                        console.warn('Invalid password for email:', email);
                        resolve(null);
                    }
                });
            }
        );
    });
};


// Get all players with their favorite activities
const getAllPlayers = (account_type = null) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT
                p.player_id,
                p.player_email,
                p.player_name,
                p.player_lastname,
                p.player_nickname,
                p.player_account_type,
                p.team_id,
                t.team_name,
                (
                    SELECT GROUP_CONCAT(a.activity_name)
                    FROM favoriteactivity f
                             JOIN activity a ON f.activity_id = a.activity_id
                    WHERE f.player_id = p.player_id
                ) AS preferredGames
            FROM player p
                     LEFT JOIN team t ON p.team_id = t.team_id
        `;

        const params = [];

        // Apply filter if account_type is provided
        if (account_type) {
            query += ' WHERE p.player_account_type = ?';
            params.push(account_type);
        }

        db.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};


// Get a player by ID
const getPlayerById = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT 
                p.player_id, 
                p.player_email, 
                p.player_name, 
                p.player_lastname, 
                p.player_nickname, 
                p.player_account_type, 
                p.team_id, 
                t.team_name,
                (
                    SELECT GROUP_CONCAT(a.activity_name)
                    FROM favoriteactivity f
                    JOIN activity a ON f.activity_id = a.activity_id
                    WHERE f.player_id = p.player_id
                ) AS preferredGames,
                p.player_registragtionDate
            FROM player p
            LEFT JOIN team t ON p.team_id = t.team_id
            WHERE p.player_id = ?
            `,
            [player_id],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            }
        );
    });
};
const updatePlayer = (player_id, email, name, lastname, nickname, password, account_type, team_id) => {
    return new Promise((resolve, reject) => {
        // Fetch the existing player data first
        db.query('SELECT * FROM player WHERE player_id = ?', [player_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve(null); // Player not found
            }

            // Get existing player data
            const existingPlayer = results[0];

            // Use existing values if new values are not provided
            const updatedEmail = email || existingPlayer.player_email;
            const updatedName = name || existingPlayer.player_name;
            const updatedLastname = lastname || existingPlayer.player_lastname;
            const updatedNickname = nickname || existingPlayer.player_nickname;
            const updatedAccountType = account_type || existingPlayer.player_account_type;
            const updatedTeamId = team_id !== undefined ? team_id : existingPlayer.team_id; // Allow null for team_id

            // Hash the password if provided, else retain the existing hashed password
            if (password) {
                bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
                    if (err) {
                        return reject(err);
                    }
                    performUpdate(
                        player_id,
                        updatedEmail,
                        updatedName,
                        updatedLastname,
                        updatedNickname,
                        hashedPassword,
                        updatedAccountType,
                        updatedTeamId
                    );
                });
            } else {
                // Retain existing password if not provided
                performUpdate(
                    player_id,
                    updatedEmail,
                    updatedName,
                    updatedLastname,
                    updatedNickname,
                    existingPlayer.player_password,
                    updatedAccountType,
                    updatedTeamId
                );
            }

            function performUpdate(player_id, email, name, lastname, nickname, password, account_type, team_id) {
                db.query(
                    'UPDATE player SET player_email = ?, player_name = ?, player_lastname = ?, player_nickname = ?, player_password = ?, player_account_type = ?, team_id = ? WHERE player_id = ?',
                    [email, name, lastname, nickname, password, account_type, team_id, player_id],
                    (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        if (result.affectedRows === 0) {
                            return resolve(null);
                        }
                        resolve({
                            player_id,
                            email,
                            name,
                            lastname,
                            nickname,
                            account_type,
                            team_id,
                        });
                    }
                );
            }
        });
    });
};

// Delete a player by ID
const deletePlayer = (player_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM player WHERE player_id = ?', 
            [player_id], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ message: 'Player deleted successfully' });
            }
        );
    });
};

// Set a favorite activity
const setFavoriteActivity = (player_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO favoriteactivity (player_id, activity_id) VALUES (?, ?)',
            [player_id, activity_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ id: result.insertId, player_id, activity_id });
            }
        );
    });
};

// Delete a favorite activity
const deleteFavoriteActivity = (player_id, activity_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM favoriteactivity WHERE player_id = ? AND activity_id = ?',
            [player_id, activity_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ message: 'Favorite activity deleted successfully' });
            }
        );
    });
};

const getBestPlayerByActivity = (activity_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM meilleur_joueur_par_activité WHERE activity_id = ? ORDER BY total_wins DESC LIMIT 1`,
            [activity_id],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return resolve(null); 
                }
                resolve(results[0]);
            }
        );
    });
};


module.exports = {
    createPlayer,
    getAllPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    setFavoriteActivity,
    deleteFavoriteActivity,
    getBestPlayerByActivity,
    registerPlayer,
    loginPlayer
};
