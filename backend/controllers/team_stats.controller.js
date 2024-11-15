const teamStatsModel = require('../models/team_stats.model');

// Créer des statistiques pour une équipe
const createTeamStats = (req, res) => {
    const { team_id, activity_id, total_matches, wins, losses, draws } = req.body;
    teamStatsModel.createTeamStats(team_id, activity_id, total_matches, wins, losses, draws)
        .then(newStats => res.status(201).json(newStats))
        .catch(err => {
            console.error('Error creating team stats:', err);
            res.status(500).json({ error: 'Error creating team stats' });
        });
};

// Obtenir les statistiques d'une équipe par ID d'équipe
const getTeamStatsByTeamId = (req, res) => {
    const { team_id } = req.params;
    console.log(`Fetching stats for team ID: ${team_id}`); // Debug log
    teamStatsModel.getTeamStatsByTeamId(team_id)
        .then(stats => {
            console.log('Fetched stats:', stats); // Debug log
            res.json(stats);
        })
        .catch(err => {
            console.error('Error fetching team stats:', err);
            res.status(500).json({ error: 'Error fetching team stats' });
        });
};


// Obtenir les statistiques d'une équipe par ID d'activité
const getTeamStatsByActivityId = (req, res) => {
    const { activity_id } = req.params;
    teamStatsModel.getTeamStatsByActivityId(activity_id)
        .then(stats => res.json(stats))
        .catch(err => {
            console.error('Error fetching team stats:', err);
            res.status(500).json({ error: 'Error fetching team stats' });
        });
};

// Obtenir toutes les statistiques des équipes
const getAllTeamStats = (req, res) => {
    teamStatsModel.getAllTeamStats()
        .then(stats => res.json(stats))
        .catch(err => {
            console.error('Error fetching team stats:', err);
            res.status(500).json({ error: 'Error fetching team stats' });
        });
};

// Mettre à jour les statistiques d'une équipe
const updateTeamStats = (req, res) => {
    const { team_id, activity_id } = req.params;
    const { total_matches, wins, losses, draws } = req.body;
    teamStatsModel.updateTeamStats(team_id, activity_id, total_matches, wins, losses, draws)
        .then(updatedStats => {
            if (!updatedStats) {
                return res.status(404).json({ error: 'Team stats not found' });
            }
            res.json(updatedStats);
        })
        .catch(err => {
            console.error('Error updating team stats:', err);
            res.status(500).json({ error: 'Error updating team stats' });
        });
};

// Supprimer les statistiques d'une équipe
const deleteTeamStats = (req, res) => {
    const { team_id, activity_id } = req.params;
    teamStatsModel.deleteTeamStats(team_id, activity_id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Team stats not found' });
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error('Error deleting team stats:', err);
            res.status(500).json({ error: 'Error deleting team stats' });
        });
};

module.exports = {
    createTeamStats,
    getTeamStatsByTeamId,
    getTeamStatsByActivityId,
    getAllTeamStats,
    updateTeamStats,
    deleteTeamStats
};