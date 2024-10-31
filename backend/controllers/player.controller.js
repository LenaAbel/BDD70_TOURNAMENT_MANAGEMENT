// controllers/player.controller.js
const playerModel = require('../models/player.model');

// Get all players
const getAllPlayers = (req, res) => {
    playerModel.getAllPlayers()
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

const setFavoriteActivity = (req, res) => {
    const { player_id, activity_id } = req.body;
    console.log(player_id);
    console.log(activity_id);
    
    playerModel.setFavoriteActivity(player_id, activity_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Activity or player not found'});
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error("Error setting up favorite activity:", err);
            res.status(500).json({error: 'error setting fav activity'})
        })
}

module.exports = {
    getAllPlayers,
    createPlayer,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    setFavoriteActivity
};
