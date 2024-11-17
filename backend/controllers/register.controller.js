const registerModel = require('../models/register.model');
const db = require('../database/db_init');

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

const registerPlayerToTournament = (req, res) => {
    const { player_id, tournament_id } = req.body;

    if (!player_id || !tournament_id) {
        return res.status(400).json({ error: "Player ID and Tournament ID are required" });
    }

    // Fetch the team_id associated with the player
    db.query('SELECT team_id FROM player WHERE player_id = ?', [player_id], (err, results) => {
        if (err) {
            console.error("Error fetching team_id for player:", err);
            return res.status(500).json({ error: "Error fetching team information" });
        }

        const team_id = results[0]?.team_id || null; // Use `null` if no team is assigned

        // Check if the player is already registered for the tournament
        registerModel
            .isPlayerRegistered(player_id, tournament_id)
            .then((isRegistered) => {
                if (isRegistered) {
                    return res
                        .status(409)
                        .json({ error: "Player is already registered for this tournament." });
                }

                // Register the player with their team_id
                return registerModel
                    .createRegister(player_id, team_id, tournament_id)
                    .then((result) => {
                        res.status(201).json(result);
                    });
            })
            .catch((err) => {
                console.error("Error registering player to tournament:", err);
                res.status(500).json({ error: "Error registering player to tournament" });
            });
    });
};

const registerTeamToTournament = (req, res) => {
    const { team_id, tournament_id } = req.body;
    registerModel.registerTeam(team_id, tournament_id)
        .then(newRegister => res.status(201).json(newRegister))
        .catch(err => {
            console.error('Error registering team to tournament:', err);
            res.status(500).json({ error: 'Error registering team to tournament' });
        });
};

const unregisterPlayerFromTournament = (req, res) => {
    const { player_id, tournament_id } = req.params;

    if (!player_id || !tournament_id) {
        return res.status(400).json({ error: "Player ID and Tournament ID are required" });
    }

    registerModel
        .isPlayerRegistered(player_id, tournament_id)
        .then((isRegistered) => {
            if (!isRegistered) {
                return res.status(404).json({ error: "Player is not registered for this tournament." });
            }

            return registerModel.deleteRegister(player_id, tournament_id).then(() => {
                res.status(200).json({ message: "Successfully unregistered from the tournament." });
            });
        })
        .catch((err) => {
            console.error("Error unregistering player from tournament:", err);
            res.status(500).json({ error: "Error unregistering player from tournament" });
        });
};

module.exports = {
    createRegister,
    getRegisterById,
    getAllRegisters,
    updateRegister,
    deleteRegister,
    registerPlayerToTournament,
    registerTeamToTournament,
    unregisterPlayerFromTournament
};