const tournamentRoundModel = require('../models/tournament_round.model');

// Obtenir tous les tours de tous les tournois
const getAllRounds = (req, res) => {
    tournamentRoundModel.getAllRounds()
        .then(tournamentRounds => res.json(tournamentRounds))
        .catch(err => {
            console.error('Error fetching tournament rounds:', err);
            res.status(500).json({ error: 'Error fetching tournament rounds' });
        });
};

// Créer un nouveau tour
const createRound = (req, res) => {
    const { tournament_id, round_number } = req.body;
    tournamentRoundModel.createRound(tournament_id, round_number)
        .then(newRound => res.status(201).json(newRound))
        .catch(err => {
            console.error('Error creating round:', err);
            res.status(500).json({ error: 'Error creating round' });
        });
};

// Mettre à jour un round par ID sans changer le round_id
const updateTournamentRound = (req, res) => {
    const { round_id } = req.params;
    const { tournament_id, round_number } = req.body;
    tournamentRoundModel.updateRound(round_id, tournament_id, round_number)
        .then(updatedRound => {
            if (!updatedRound) {
                return res.status(404).json({ error: 'Round not found' });
            }
            res.json(updatedRound);
        })
        .catch(err => {
            console.error('Error updating round:', err);
            res.status(500).json({ error: 'Error updating round' });
        });
};

// Obtenir un tour par ID
const getTournamentRoundById = (req, res) => {
    const { round_id } = req.params;
    tournamentRoundModel.getRoundById(round_id)
        .then(round => {
            if (!round) {
                return res.status(404).json({ error: 'Round not found' });
            }
            res.json(round);
        })
        .catch(err => {
            console.error('Error fetching round:', err);
            res.status(500).json({ error: 'Error fetching round' });
        });
};

// Obtenir les tours d'un tournoi
const getTournamentRoundsByTournamentId = (req, res) => {
    const { tournament_id } = req.params;
    tournamentRoundModel.getRoundsByTournamentId(tournament_id)
        .then(rounds => res.json(rounds))
        .catch(err => {
            console.error('Error fetching rounds:', err);
            res.status(500).json({ error: 'Error fetching rounds' });
        });
};

// Supprimer les tours d'un tournoi
const deleteTournamentRoundsByTournamentId = (req, res) => {
    const { tournament_id } = req.params;
    tournamentRoundModel.deleteRoundsByTournamentId(tournament_id)
        .then(result => res.json(result))
        .catch(err => {
            console.error('Error deleting rounds:', err);
            res.status(500).json({ error: 'Error deleting rounds' });
        });
};

// Supprimer un tour par ID
const deleteTournamentRound = (req, res) => {
    const { round_id } = req.params;
    tournamentRoundModel.deleteRound(round_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Round not found' });
            }
            res.json(result);
        })
        .catch(err => {
            console.error('Error deleting round:', err);
            res.status(500).json({ error: 'Error deleting round' });
        });
};
//testpush

module.exports = {
    getAllRounds,
    createRound,
    updateTournamentRound,
    getTournamentRoundById,
    getTournamentRoundsByTournamentId,
    deleteTournamentRoundsByTournamentId,
    deleteTournamentRound,
};