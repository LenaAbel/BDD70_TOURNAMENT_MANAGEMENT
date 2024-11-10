const playerStatsModel = require('../models/player_stats.model');

// Créer des statistiques pour un joueur
const createPlayerStats = (req, res) => {
    const { player_id, activity_id, total_matches, wins, losses, draws } = req.body;
    playerStatsModel.createPlayerStats(player_id, activity_id, total_matches, wins, losses, draws)
        .then(newStats => res.status(201).json(newStats))
        .catch(err => {
            console.error('Error creating player stats:', err);
            res.status(500).json({ error: 'Error creating player stats' });
        });
};

// Obtenir les statistiques d'un joueur par ID de joueur
const getPlayerStatsByPlayerId = (req, res) => {
    const { player_id } = req.params;
    playerStatsModel.getPlayerStatsByPlayerId(player_id)
        .then(stats => res.json(stats))
        .catch(err => {
            console.error('Error fetching player stats:', err);
            res.status(500).json({ error: 'Error fetching player stats' });
        });
};

// Obtenir toutes les statistiques des joueurs
const getAllPlayerStats = (req, res) => {
    playerStatsModel.getAllPlayerStats()
        .then(stats => res.json(stats))
        .catch(err => {
            console.error('Error fetching player stats:', err);
            res.status(500).json({ error: 'Error fetching player stats' });
        });
};

// Mettre à jour les statistiques d'un joueur
const updatePlayerStats = (req, res) => {
    const { player_id, activity_id } = req.params;
    const { total_matches, wins, losses, draws } = req.body;
    playerStatsModel.updatePlayerStats(player_id, activity_id, total_matches, wins, losses, draws)
        .then(updatedStats => {
            if (!updatedStats) {
                return res.status(404).json({ error: 'Player stats not found' });
            }
            res.json(updatedStats);
        })
        .catch(err => {
            console.error('Error updating player stats:', err);
            res.status(500).json({ error: 'Error updating player stats' });
        });
};

// Supprimer les statistiques d'un joueur
const deletePlayerStats = (req, res) => {
    const { player_id, activity_id } = req.params;
    playerStatsModel.deletePlayerStats(player_id, activity_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Player stats not found' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting player stats:', err);
            res.status(500).json({ error: 'Error deleting player stats' });
        });
};

const getPlayerStatsByActivityId = (req, res) => {
    const { activity_id } = req.params;
    playerStatsModel.getPlayerStatsByActivityId(activity_id)
        .then(stats => res.json(stats))
        .catch(err => {
            console.error('Error fetching player stats:', err);
            res.status(500).json({ error: 'Error fetching player stats' });
        });
};

module.exports = {
    createPlayerStats,
    getPlayerStatsByPlayerId,
    getAllPlayerStats,
    updatePlayerStats,
    deletePlayerStats,
    getPlayerStatsByActivityId
};