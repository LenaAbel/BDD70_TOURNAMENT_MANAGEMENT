const teamModel = require('../models/team.model');
const db = require('../database/db_init');

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
    const { team_name, player_ids } = req.body;
    console.log('Received data on backend:', { team_name, player_ids })

    if (!team_name) {
        return res.status(400).json({ error: 'Team name is required' });
    }

    teamModel.createTeam(team_name)
        .then(newTeam => {
            if (player_ids && Array.isArray(player_ids) && player_ids.length > 0) {
                return teamModel.assignPlayersToTeam(newTeam.team_id, player_ids)
                    .then(() => res.status(201).json(newTeam));
            } else {
                res.status(201).json(newTeam);
            }
        })
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
    const { team_name } = req.body;

    console.log("Updating team with ID:", id, "and name:", team_name);

    if (!team_name) {
        return res.status(400).json({ error: 'Team name is required' });
    }

    teamModel.updateTeam(id, team_name)
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

// Assign players to a team
const assignPlayersToTeam = (req, res) => {
    const teamId = req.params.id;
    const { player_ids } = req.body;

    if (!player_ids || !Array.isArray(player_ids)) {
        return res.status(400).json({ error: 'player_ids must be an array of player IDs.' });
    }

    // First, check if all player_ids belong to players with account_type "player"
    const query = 'SELECT player_id FROM player WHERE player_id IN (?) AND player_account_type = "player"';
    db.query(query, [player_ids], (err, results) => {
        if (err) {
            console.error('Error verifying player account types:', err);
            return res.status(500).json({ error: 'Failed to verify player account types.' });
        }

        const validPlayerIds = results.map(row => row.player_id);

        // Filter out any invalid player IDs from the original list
        const filteredPlayerIds = player_ids.filter(id => validPlayerIds.includes(id));

        // Call the model function with the filtered player IDs
        teamModel.assignPlayersToTeam(teamId, filteredPlayerIds)
            .then(() => res.json({ message: 'Players successfully assigned to the team.' }))
            .catch(err => {
                console.error('Error assigning players to team:', err);
                res.status(500).json({ error: 'Failed to assign players to team.' });
            });
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

const getBestTeamByActivity = (req, res) => {
    const { activity_id } = req.params;

    teamModel.getBestTeamByActivity(activity_id)
        .then(bestTeam => {
            if (!bestTeam) {
                return res.status(404).json({ error: 'No team found for this activity' });
            }
            res.json(bestTeam); // Return the best team for this activity
        })
        .catch(err => {
            console.error('Error fetching best team for activity:', err);
            res.status(500).json({ error: 'Error fetching best team for activity' });
        });
};

module.exports = {
    getAllTeams,
    createTeam,
    getTeamById,
    updateTeam,
    deleteTeam,
    getBestTeamByActivity,
    assignPlayersToTeam,
};
