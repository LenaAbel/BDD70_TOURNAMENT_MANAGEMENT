const tournamentModel = require('../models/tournament.model');

// Get all tournaments
const getAllTournaments = (req, res) => {
    tournamentModel.getAllTournaments()
        .then(tournaments => res.json(tournaments))
        .catch(err => {
            console.error('Error fetching tournaments:', err);
            res.status(500).json({ error: 'Error fetching tournaments' });
        });
};

// Create a new tournament
const createTournament = (req, res) => {
    const { name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id } = req.body;
    tournamentModel.createTournament(name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id)
        .then(newTournament => res.status(201).json(newTournament))
        .catch(err => {
            console.error('Error creating tournament:', err);
            res.status(500).json({ error: 'Error adding tournament' });
        });
};

// Get a tournament by ID
const getTournamentById = (req, res) => {
    const { id } = req.params;
    tournamentModel.getTournamentById(id)
        .then(tournament => {
            if (!tournament) {
                return res.status(404).json({ error: 'Tournament not found' });
            }
            res.json(tournament);
        })
        .catch(err => {
            console.error('Error fetching tournament by ID:', err);
            res.status(500).json({ error: 'Error fetching tournament' });
        });
};

// Update a tournament by ID
const updateTournament = (req, res) => {
    const { id } = req.params;
    const { name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id } = req.body;
    tournamentModel.updateTournament(id, name, start_time, bestofX, poolSize, type, format, rule_id, organizer_id)
        .then(updatedTournament => {
            if (!updatedTournament) {
                return res.status(404).json({ error: 'Tournament not found or not updated' });
            }
            res.json(updatedTournament);
        })
        .catch(err => {
            console.error('Error updating tournament:', err);
            res.status(500).json({ error: 'Error updating tournament' });
        });
};

// Delete a tournament by ID
const deleteTournament = (req, res) => {
    const { id } = req.params;
    tournamentModel.deleteTournament(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Tournament not found or not deleted' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting tournament:', err);
            res.status(500).json({ error: 'Error deleting tournament' });
        });
};

module.exports = {
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament
};
