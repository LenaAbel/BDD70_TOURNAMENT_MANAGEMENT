const playerModel = require('../models/player.model');
const pool = require("../database/db_init");

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
    const account_type = 'player'; // Default account type
    const team_id = null; // Default team

    playerModel.registerPlayer(email, name, lastname, nickname, password, account_type, team_id, pool)
        .then(newPlayer => res.status(201).json(newPlayer))
        .catch(err => {
            console.error('Error registering player:', err);
            if (err.message === 'Email already exists') {
                res.status(409).json({ error: 'Email already exists' });
            } else {
                res.status(500).json({ error: 'Error registering player' });
            }
        });
};

// Login a player
const loginPlayer = (req, res) => {
    const { email, password } = req.body;
    playerModel.loginPlayer(email, password, pool)
        .then(player => {
            if (!player) {
                console.log('Invalid credentials');
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            res.json(player);
        })
        .catch(err => {
            console.error('Error logging in player:', err);
            res.status(500).json({ error: 'Error logging in player' });
        });
};




// Get a player by ID
const getPlayerById = (req, res) => {
    const { id } = req.params;
    playerModel.getPlayerById(id)
        .then(player => {
            if (!player) {
                return res.status(404).json({ error: 'Player not found' });
            }
            res.json(player);
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
        .then(updatedPlayer => {
            if (!updatedPlayer) {
                return res.status(404).json({ error: 'Player not found or not updated' });
            }
            res.json(updatedPlayer);
        })
        .catch(err => {
            console.error('Error updating player:', err);
            res.status(500).json({ error: 'Error updating player' });
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
