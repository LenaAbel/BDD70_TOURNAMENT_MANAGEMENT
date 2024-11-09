const matchsModel = require('../models/matchs.model');

// Obtenir tous les matchs
const getAllMatchs = (req, res) => {
    matchsModel.getAllMatchs()
        .then(matchs => res.json(matchs))
        .catch(err => {
            console.error('Error fetching matchs:', err);
            res.status(500).json({ error: 'Error fetching matchs' });
        });
};

// Créer un nouveau match
const createMatch = (req, res) => {
    const match = req.body;
    matchsModel.createMatch(match)
        .then(newMatch => res.status(201).json(newMatch))
        .catch(err => {
            console.error('Error creating match:', err);
            res.status(500).json({ error: 'Error creating match' });
        });
};

module.exports = {
    getAllMatchs,
    createMatch
};