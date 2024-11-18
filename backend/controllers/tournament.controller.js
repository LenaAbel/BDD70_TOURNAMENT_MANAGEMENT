// src/controllers/tournament.controller.js

const tournamentModel = require('../models/tournament.model');

const getAllTournaments = (req, res) => {
    tournamentModel.getAllTournaments()
        .then(tournaments => res.json(tournaments))
        .catch(err => {
            console.error('Error fetching tournaments:', err);
            res.status(500).json({ error: 'Error fetching tournaments' });
        });
};

const createTournament = (req, res) => {
    const {
        name,
        start_time,
        bestofX,
        poolSize,
        tournament_type_id,
        format_id,
        rule_id,
        organizer_id,
    } = req.body;

    // Validate required fields
    if (!name || !start_time || !tournament_type_id || !rule_id || !organizer_id) {
        return res.status(400).json({ error: "Required fields are missing" });
    }

    tournamentModel
        .createTournament(
            name,
            start_time,
            bestofX,
            poolSize,
            tournament_type_id,
            format_id,
            rule_id,
            organizer_id
        )
        .then((newTournament) => res.status(201).json(newTournament))
        .catch((err) => {
            console.error('Error creating tournament:', err);
            res.status(500).json({ error: 'Error adding tournament' });
        });
};

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

const updateTournament = (req, res) => {
    const { id: tournament_id } = req.params;
    const {
        name,
        start_time,
        bestofX,
        poolSize,
        tournament_type_id,
        format_id,
        rule_id,
        organizer_id,
    } = req.body;

    tournamentModel
        .updateTournament(
            tournament_id,
            name,
            start_time,
            bestofX,
            poolSize,
            tournament_type_id,
            format_id,
            rule_id,
            organizer_id
        )
        .then((updatedTournament) => {
            if (!updatedTournament) {
                return res.status(404).json({ error: 'Tournament not found or not updated' });
            }
            res.json(updatedTournament);
        })
        .catch((err) => {
            console.error('Error updating tournament:', err);
            res.status(500).json({ error: 'Error updating tournament' });
        });
};


const deleteTournament = (req, res) => {
    const { id } = req.params;

    tournamentModel.deleteTournament(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Tournament not found or not deleted' });
            }
            res.status(204).send(); // Send a 204 No Content response on success
        })
        .catch(err => {
            console.error('Error deleting tournament:', err);
            res.status(500).json({ error: 'Error deleting tournament' });
        });
};

const getFormatTypes = (req, res) => {
    tournamentModel.getFormatTypes()
        .then(formatTypes => res.json(formatTypes))
        .catch(err => {
            console.error('Error fetching format types:', err);
            res.status(500).json({ error: 'Error fetching format types' });
        });
};

const getTournamentTypes = (req, res) => {
    tournamentModel.getTournamentTypes()
        .then(tournamentTypes => res.json(tournamentTypes))
        .catch(err => {
            console.error('Error fetching tournament types:', err);
            res.status(500).json({ error: 'Error fetching tournament types' });
        });
};

module.exports = {
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    getFormatTypes,
    getTournamentTypes
};
