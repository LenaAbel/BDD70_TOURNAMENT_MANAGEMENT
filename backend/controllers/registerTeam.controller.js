const registerTeamModel = require('../models/registerTeam');

// Créer une inscription
const registerTeam = (req, res) => {
    const { team_id, tournament_id } = req.body;
    registerTeamModel.registerTeam(team_id, tournament_id)
        .then(newRegister => res.status(201).json(newRegister))
        .catch(err => {
            console.error('Error registering team:', err);
            res.status(500).json({ error: 'Error registering team' });
        });
};

// Obtenir les équipes inscrites dans un tournoi
const getTeamsInTournament = (req, res) => {
    const { tournament_id } = req.params;
    registerTeamModel.getTeamsInTournament(tournament_id)
        .then(teams => res.json(teams))
        .catch(err => {
            console.error('Error fetching teams:', err);
            res.status(500).json({ error: 'Error fetching teams' });
        });
};

// Obtenir les tournois dans lesquels une équipe est inscrite
const getTournamentsForTeam = (req, res) => {
    const { team_id } = req.params;
    registerTeamModel.getTournamentsForTeam(team_id)
        .then(tournaments => res.json(tournaments))
        .catch(err => {
            console.error('Error fetching tournaments:', err);
            res.status(500).json({ error: 'Error fetching tournaments' });
        });
};

// Supprimer une équipe d'un tournoi
const removeTeamFromTournament = (req, res) => {
    const { team_id, tournament_id } = req.body;
    registerTeamModel.removeTeamFromTournament(team_id, tournament_id)
        .then(() => res.json({ message: 'Team removed from tournament successfully' }))
        .catch(err => {
            console.error('Error removing team:', err);
            res.status(500).json({ error: 'Error removing team' });
        });
};

module.exports = {
    registerTeam,
    getTeamsInTournament,
    getTournamentsForTeam,
    removeTeamFromTournament
};