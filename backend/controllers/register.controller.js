const registerModel = require('../models/register.model');

// Créer une inscription
const createRegister = (req, res) => {
    const { player_id, team_id, tournament_id } = req.body;
    registerModel.createRegister(player_id, team_id, tournament_id)
        .then(newRegister => res.status(201).json(newRegister))
        .catch(err => {
            console.error('Error creating register:', err);
            res.status(500).json({ error: 'Error creating register' });
        });
};

// Obtenir une inscription par ID de joueur et ID de tournoi
const getRegisterById = (req, res) => {
    const { player_id, tournament_id } = req.params;
    registerModel.getRegisterById(player_id, tournament_id)
        .then(register => {
            if (!register) {
                return res.status(404).json({ error: 'Register not found' });
            }
            res.json(register);
        })
        .catch(err => {
            console.error('Error fetching register:', err);
            res.status(500).json({ error: 'Error fetching register' });
        });
};

// Obtenir toutes les inscriptions
const getAllRegisters = (req, res) => {
    registerModel.getAllRegisters()
        .then(registers => res.json(registers))
        .catch(err => {
            console.error('Error fetching registers:', err);
            res.status(500).json({ error: 'Error fetching registers' });
        });
};

// Mettre à jour une inscription par ID de joueur et ID de tournoi
const updateRegister = (req, res) => {
    const { player_id, tournament_id } = req.params;
    const { team_id } = req.body;
    registerModel.updateRegister(player_id, tournament_id, team_id)
        .then(updatedRegister => {
            if (!updatedRegister) {
                return res.status(404).json({ error: 'Register not found' });
            }
            res.json(updatedRegister);
        })
        .catch(err => {
            console.error('Error updating register:', err);
            res.status(500).json({ error: 'Error updating register' });
        });
};

// Supprimer une inscription par ID de joueur et ID de tournoi
const deleteRegister = (req, res) => {
    const { player_id, tournament_id } = req.params;
    registerModel.deleteRegister(player_id, tournament_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Register not found' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting register:', err);
            res.status(500).json({ error: 'Error deleting register' });
        });
};

module.exports = {
    createRegister,
    getRegisterById,
    getAllRegisters,
    updateRegister,
    deleteRegister
};