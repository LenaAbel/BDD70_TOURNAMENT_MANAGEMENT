const matchPairingModel = require('../models/matchpairing.model');

// Créer un matchpairing
const createMatchPairing = (req, res) => {
    const { match_id, player_id, team_id } = req.body;
    matchPairingModel.createMatchPairing(match_id, player_id, team_id)
        .then(newMatchPairing => res.status(201).json(newMatchPairing))
        .catch(err => {
            console.error('Error creating matchpairing:', err);
            res.status(500).json({ error: 'Error creating matchpairing' });
        });
};

// Obtenir un matchpairing par ID
const getMatchPairingById = (req, res) => {
    const { matchpairing_id } = req.params;
    matchPairingModel.getMatchPairingById(matchpairing_id)
        .then(matchpairing => {
            if (!matchpairing) {
                return res.status(404).json({ error: 'Matchpairing not found' });
            }
            res.json(matchpairing);
        })
        .catch(err => {
            console.error('Error fetching matchpairing:', err);
            res.status(500).json({ error: 'Error fetching matchpairing' });
        });
};

// Obtenir tous les matchpairings
const getAllMatchPairings = (req, res) => {
    matchPairingModel.getAllMatchPairings()
        .then(matchpairings => res.json(matchpairings))
        .catch(err => {
            console.error('Error fetching matchpairings:', err);
            res.status(500).json({ error: 'Error fetching matchpairings' });
        });
};

// Mettre à jour un matchpairing par ID
const updateMatchPairing = (req, res) => {
    const { matchpairing_id } = req.params;
    const { match_id, player_id, team_id } = req.body;
    matchPairingModel.updateMatchPairing(matchpairing_id, match_id, player_id, team_id)
        .then(updatedMatchPairing => {
            if (!updatedMatchPairing) {
                return res.status(404).json({ error: 'Matchpairing not found' });
            }
            res.json(updatedMatchPairing);
        })
        .catch(err => {
            console.error('Error updating matchpairing:', err);
            res.status(500).json({ error: 'Error updating matchpairing' });
        });
};

// Supprimer un matchpairing par ID
const deleteMatchPairing = (req, res) => {
    const { matchpairing_id } = req.params;
    matchPairingModel.deleteMatchPairing(matchpairing_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Matchpairing not found' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting matchpairing:', err);
            res.status(500).json({ error: 'Error deleting matchpairing' });
        });
};

module.exports = {
    createMatchPairing,
    getMatchPairingById,
    getAllMatchPairings,
    updateMatchPairing,
    deleteMatchPairing
};