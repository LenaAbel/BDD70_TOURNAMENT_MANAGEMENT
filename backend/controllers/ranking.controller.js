const rankingModel = require('../models/ranking.model');

// Créer un classement
const createRanking = (req, res) => {
    const { tournament_id, player_id, team_id, ranking_points, ranking_ranking } = req.body;
    rankingModel.createRanking(tournament_id, player_id, team_id, ranking_points, ranking_ranking)
        .then(newRanking => res.status(201).json(newRanking))
        .catch(err => {
            console.error('Error creating ranking:', err);
            res.status(500).json({ error: 'Error creating ranking' });
        });
};

// Obtenir un classement par ID
const getRankingById = (req, res) => {
    const { ranking_id } = req.params;
    rankingModel.getRankingById(ranking_id)
        .then(ranking => {
            if (!ranking) {
                return res.status(404).json({ error: 'Ranking not found' });
            }
            res.json(ranking);
        })
        .catch(err => {
            console.error('Error fetching ranking:', err);
            res.status(500).json({ error: 'Error fetching ranking' });
        });
};

// Obtenir tous les classements
const getAllRankings = (req, res) => {
    rankingModel.getAllRankings()
        .then(rankings => res.json(rankings))
        .catch(err => {
            console.error('Error fetching rankings:', err);
            res.status(500).json({ error: 'Error fetching rankings' });
        });
};

// Mettre à jour un classement par ID
const updateRanking = (req, res) => {
    const { ranking_id } = req.params;
    const { tournament_id, player_id, team_id, ranking_points, ranking_ranking } = req.body;
    rankingModel.updateRanking(ranking_id, tournament_id, player_id, team_id, ranking_points, ranking_ranking)
        .then(updatedRanking => {
            if (!updatedRanking) {
                return res.status(404).json({ error: 'Ranking not found' });
            }
            res.json(updatedRanking);
        })
        .catch(err => {
            console.error('Error updating ranking:', err);
            res.status(500).json({ error: 'Error updating ranking' });
        });
};

// Supprimer un classement par ID
const deleteRanking = (req, res) => {
    const { ranking_id } = req.params;
    rankingModel.deleteRanking(ranking_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Ranking not found' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting ranking:', err);
            res.status(500).json({ error: 'Error deleting ranking' });
        });
};

// Get ranking by player ID
const getRankingByPlayerId = (req, res) => {
    const { player_id } = req.params;
    rankingModel.getRankingByPlayerId(player_id)
        .then(ranking => res.json(ranking))
        .catch(err => {
            console.error('Error fetching ranking by player ID:', err);
            res.status(500).json({ error: 'Error fetching ranking by player ID' });
        });
};

module.exports = {
    createRanking,
    getRankingById,
    getAllRankings,
    updateRanking,
    deleteRanking,
    getRankingByPlayerId
};