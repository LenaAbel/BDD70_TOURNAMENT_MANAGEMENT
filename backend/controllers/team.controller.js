// controllers/team.controller.js
const teamModel = require('../models/team.model');

// Get all teams
const getAllTeams = (req, res) => {
    teamModel.getAllTeams()
        .then(teams => res.json(teams))
        .catch(err => {
            console.error('Error fetching teams:', err);
            res.status(500).json({ error: 'Error fetching teams' });
        });
};

// Create a new team
const createTeam = (req, res) => {
    const { name } = req.body;
    teamModel.createTeam(name)
        .then(newTeam => res.status(201).json(newTeam))
        .catch(err => {
            console.error('Error creating team:', err);
            res.status(500).json({ error: 'Error adding team' });
        });
};

// Get a team by ID
const getTeamById = (req, res) => {
    const { id } = req.params;
    teamModel.getTeamById(id)
        .then(team => {
            if (!team) {
                return res.status(404).json({ error: 'Team not found' });
            }
            res.json(team);
        })
        .catch(err => {
            console.error('Error fetching team by ID:', err);
            res.status(500).json({ error: 'Error fetching team' });
        });
};

// Update a team by ID
const updateTeam = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    teamModel.updateTeam(id, name)
        .then(updatedTeam => {
            if (!updatedTeam) {
                return res.status(404).json({ error: 'Team not found or not updated' });
            }
            res.json(updatedTeam);
        })
        .catch(err => {
            console.error('Error updating team:', err);
            res.status(500).json({ error: 'Error updating team' });
        });
};

// Delete a team by ID
const deleteTeam = (req, res) => {
    const { id } = req.params;
    teamModel.deleteTeam(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Team not found or not deleted' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting team:', err);
            res.status(500).json({ error: 'Error deleting team' });
        });
};

module.exports = {
    getAllTeams,
    createTeam,
    getTeamById,
    updateTeam,
    deleteTeam
};
