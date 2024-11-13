const matchsModel = require('../models/matchs.model');

// Créer un match
const createMatch = async (req, res) => {
    const { matchs_start_time, matchs_status, matchs_location, tournament_id } = req.body;
    const match = {
        matchs_start_time,
        matchs_status,
        matchs_location,
        tournament_id
    };
    try {
        const newMatch = await matchsModel.createMatch(match);
        res.status(201).json(newMatch);
    } catch (err) {
        console.error('Error creating match:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir un match par ID
const getMatch = async (req, res) => {
    const { id } = req.params;
    try {
        const match = await matchsModel.getMatchById(id);
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }
        res.json(match);
    } catch (err) {
        console.error('Error getting match:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir tous les matchs
const getAllMatchs = async (req, res) => {
    try {
        const matchs = await matchsModel.getAllMatchs();
        res.json(matchs);
    } catch (err) {
        console.error('Error getting matchs:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Mettre à jour un match par ID
const updateMatch = async (req, res) => {
    const { id } = req.params;
    const { matchs_start_time, matchs_status, matchs_location, tournament_id } = req.body;
    const updatedMatch = {
        matchs_start_time,
        matchs_status,
        matchs_location,
        tournament_id
    };
    try {
        const result = await matchsModel.updateMatch(id, updatedMatch);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }
        res.json(updatedMatch);
    } catch (err) {
        console.error('Error updating match:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Supprimer un match par ID
const deleteMatch = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await matchsModel.deleteMatch(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting match:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

module.exports = {
    createMatch,
    getMatch,
    getAllMatchs,
    updateMatch,
    deleteMatch
};
