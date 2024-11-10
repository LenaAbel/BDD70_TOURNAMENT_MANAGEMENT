const resultsModel = require('../models/results.model');

// Créer un résultat
const createResult = (req, res) => {
    const { match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score } = req.body;
    resultsModel.createResult(match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score)
        .then(newResult => res.status(201).json(newResult))
        .catch(err => {
            console.error('Error creating result:', err);
            res.status(500).json({ error: 'Error creating result' });
        });
};

// Obtenir un résultat par ID
const getResultById = (req, res) => {
    const { results_id } = req.params;
    resultsModel.getResultById(results_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Result not found' });
            }
            res.json(result);
        })
        .catch(err => {
            console.error('Error fetching result:', err);
            res.status(500).json({ error: 'Error fetching result' });
        });
};

// Obtenir tous les résultats
const getAllResults = (req, res) => {
    resultsModel.getAllResults()
        .then(results => res.json(results))
        .catch(err => {
            console.error('Error fetching results:', err);
            res.status(500).json({ error: 'Error fetching results' });
        });
};

// Mettre à jour un résultat par ID
const updateResult = (req, res) => {
    const { results_id } = req.params;
    const { match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score } = req.body;
    resultsModel.updateResult(results_id, match_id, winner_player_id, loser_player_id, winner_team_id, loser_team_id, winner_score, loser_score)
        .then(updatedResult => {
            if (!updatedResult) {
                return res.status(404).json({ error: 'Result not found' });
            }
            res.json(updatedResult);
        })
        .catch(err => {
            console.error('Error updating result:', err);
            res.status(500).json({ error: 'Error updating result' });
        });
};

// Supprimer un résultat par ID
const deleteResult = (req, res) => {
    const { results_id } = req.params;
    resultsModel.deleteResult(results_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Result not found' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting result:', err);
            res.status(500).json({ error: 'Error deleting result' });
        });
};

module.exports = {
    createResult,
    getResultById,
    getAllResults,
    updateResult,
    deleteResult
};