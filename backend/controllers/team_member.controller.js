const team_memberModel = require("../models/team_member.model");

const addTeamMember = async (req, res) => {
    const { team_id, player_id } = req.body;
    try {
        const newTeamMember = await team_memberModel.addTeamMember(team_id, player_id);
        res.status(201).json(newTeamMember);
    } catch (err) {
        console.error('Error adding team member:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

const getTeamMembersByTeamId = async (req, res) => {
    const { team_id } = req.params;
    try {
        const teamMembers = await team_memberModel.getTeamMembersByTeamId(team_id);
        if (!teamMembers) {
            return res.status(404).json({ error: 'Team members not found' });
        }
        res.json(teamMembers);
    } catch (err) {
        console.error('Error getting team members:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

const removeTeamMember = async (req, res) => {
    const { team_id, player_id } = req.params;
    try {
        const result = await team_memberModel.removeTeamMember(team_id, player_id);
        if (!result) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Error removing team member:', err);
        res.status(500).json({ error: 'Error removing team member' });
    }
};

const getTeamsByPlayerId = async (req, res) => {
    const { player_id } = req.params;
    try {
        const teams = await team_memberModel.getTeamsByPlayerId(player_id);
        if (!teams) {
            return res.status(404).json({ error: 'Teams not found' });
        }
        res.json(teams);
    } catch (err) {
        console.error('Error getting teams:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

const getAllTeamMembers = async (req, res) => {
    try {
        const teamMembers = await team_memberModel.getAllTeamMembers();
        res.json(teamMembers);
    } catch (err) {
        console.error('Error getting team members:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

module.exports = {
    addTeamMember,
    getTeamMembersByTeamId,
    removeTeamMember,
    getTeamsByPlayerId,
    getAllTeamMembers
};