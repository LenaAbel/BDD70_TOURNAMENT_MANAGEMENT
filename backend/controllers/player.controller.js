const playerModel = require('../models/player.model');
const pool = require("../database/db_init");
const jwt = require('jsonwebtoken');

// Get all players
const getAllPlayers = (req, res) => {
    const { account_type } = req.query;
    playerModel.getAllPlayers(account_type)
        .then(players => res.json(players))
        .catch(err => {
            console.error('Error fetching players:', err);
            res.status(500).json({ error: 'Error fetching players' });
        });
};

// Create a new player
const createPlayer = (req, res) => {
    const { email, name, lastname, nickname, password, account_type, team_id } = req.body;
    playerModel.createPlayer(email, name, lastname, nickname, password, account_type, team_id)
        .then(newPlayer => res.status(201).json(newPlayer))
        .catch(err => {
            console.error('Error creating player:', err);
            res.status(500).json({ error: 'Error adding player' });
        });
};

const registerPlayer = (req, res) => {
    const { email, name, lastname, nickname, password } = req.body;
    const account_type = 'player';
    const team_id = null;

    // Ensure all required fields are present
    if (!email || !name || !lastname || !nickname || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    playerModel
        .registerPlayer(email, name, lastname, nickname, password, account_type, team_id)
        .then((newPlayer) => {
            const token = jwt.sign(
                { id: newPlayer.player_id, email: newPlayer.email, account_type: newPlayer.account_type },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({
                token,
                user: {
                    player_id: newPlayer.player_id,
                    email: newPlayer.email,
                    name: newPlayer.name,
                    lastname: newPlayer.lastname,
                    nickname: newPlayer.nickname,
                    account_type: newPlayer.account_type,
                },
            });
        })
        .catch((err) => {
            console.error('Error registering player:', err.message);

            if (err.message === 'Email already exists') {
                res.status(409).json({ error: 'Email already exists' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
};
const loginPlayer = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.warn("Missing email or password in login request");
        return res.status(400).json({ error: "Email and password are required." });
    }

    playerModel
        .loginPlayer(email, password)
        .then((player) => {
            if (!player) {
                console.warn("Unauthorized login attempt for email:", email);
                return res.status(401).json({ error: "Invalid email or password." }); // Return specific error message
            }

            // Generate token
            const token = jwt.sign(
                { id: player.player_id, email: player.email, account_type: player.account_type },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Send response
            res.json({
                token,
                user: {
                    player_id: player.player_id,
                    email: player.email,
                    name: player.name,
                    lastname: player.lastname,
                    nickname: player.nickname,
                    account_type: player.account_type,
                    team_id: player.team_id,
                },
            });
        })
        .catch((err) => {
            console.error("Error logging in player:", err);
            res.status(500).json({ error: "Internal server error." });
        });
};

// Get a player by ID
// Modify getPlayerById to exclude password
const getPlayerById = (req, res) => {
    const { id } = req.params;
    playerModel.getPlayerById(id)
        .then(player => {
            if (!player) {
                return res.status(404).json({ error: 'Player not found' });
            }
            // Exclude the password from the response
            const { player_password, ...playerData } = player;
            res.json(playerData);
        })
        .catch(err => {
            console.error('Error fetching player by ID:', err);
            res.status(500).json({ error: 'Error fetching player' });
        });
};

// Update a player by ID
const updatePlayer = (req, res) => {
    const { id } = req.params;
    const { email, name, lastname, nickname, password, account_type, team_id } = req.body;

    playerModel.updatePlayer(id, email, name, lastname, nickname, password, account_type, team_id)
        .then((updatedPlayer) => {
            if (!updatedPlayer) {
                return res.status(404).json({ error: "Player not found or not updated" });
            }
            res.json(updatedPlayer);
        })
        .catch((err) => {
            console.error("Error in updatePlayer controller:", err);
            res.status(500).json({ error: "Error updating player" });
        });
};


// Delete a player by ID
const deletePlayer = (req, res) => {
    const { id } = req.params;
    playerModel.deletePlayer(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Player not found or not deleted' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting player:', err);
            res.status(500).json({ error: 'Error deleting player' });
        });
};

// Set favorite activity
const setFavoriteActivity = (req, res) => {
    const { player_id, activity_id } = req.body;
    playerModel.setFavoriteActivity(player_id, activity_id)
        .then(result => res.status(204).send())
        .catch(err => {
            console.error("Error setting favorite activity:", err);
            res.status(500).json({ error: 'Error setting favorite activity' });
        });
};

const getBestPlayerByActivity = (req, res) => {
    const { activity_id } = req.params;

    playerModel.getBestPlayerByActivity(activity_id)
        .then(bestPlayer => {
            if (!bestPlayer) {
                return res.status(404).json({ error: 'No player found for this activity' });
            }
            res.json(bestPlayer); // Return the best player for this activity
        })
        .catch(err => {
            console.error('Error fetching best player for activity:', err);
            res.status(500).json({ error: 'Error fetching best player for activity' });
        });
};

module.exports = {
    getAllPlayers,
    createPlayer,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    setFavoriteActivity,
    getBestPlayerByActivity,
    registerPlayer,
    loginPlayer
};
