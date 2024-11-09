const express = require('express');
const router = express.Router();
const teamMemberController = require('../controllers/team_member.controller');

router.post('/add', teamMemberController.addTeamMember);
router.get('/team/:team_id', teamMemberController.getTeamMembersByTeamId);
router.delete('/team/:team_id/player/:player_id', teamMemberController.removeTeamMember);
router.get('/player/:player_id', teamMemberController.getTeamsByPlayerId);
router.get('/', teamMemberController.getAllTeamMembers);

module.exports = router;