const rewardsModel = require('../models/rewards.model');

// Crée une récompense
const createReward = async (req, res) => {
    const { rewardSet, activity_id } = req.body;
    try {
        const newReward = await rewardsModel.createReward(rewardSet, activity_id);
        res.status(201).json(newReward);
    } catch (err) {
        console.error('Error creating reward:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir une récompense par ID
const getReward = async (req, res) => {
    
    const { id } = req.params;
    try {
        const reward = await rewardsModel.getRewardById(id);
        if (!reward) {
            return res.status(404).json({ error: 'Reward not found' });
        }
        res.json(reward);
    } catch (err) {
        console.error('Error getting reward:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Mettre à jour une récompense par ID
const updateReward = async (req, res) => {
    const { id } = req.params;
    const { rewardSet, activity_id } = req.body;
    try {
        const updatedReward = await rewardsModel.updateReward(id, rewardSet, activity_id);
        if (!updatedReward) {
            return res.status(404).json({ error: 'Reward not found' });
        }
        res.json(updatedReward);
    } catch (err) {
        console.error('Error updating reward:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Supprimer une récompense par ID
const deleteReward = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await rewardsModel.deleteReward(id);
        if (!result) {
            return res.status(404).json({ error: 'Reward not found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Error deleting reward:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir toutes les récompenses
const getAllRewards = async (req, res) => {
    try {
        const rewards = await rewardsModel.getAllRewards();
        res.json(rewards);
    } catch (err) {
        console.error('Error getting rewards:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir toutes les récompenses par game_id
const getRewardsByGameId = async (req, res) => {
    const { activity_id } = req.params;
    try {
        const rewards = await rewardsModel.getRewardsByGameId(activity_id);
        res.json(rewards);
    } catch (err) {
        console.error('Error getting rewards:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Crée une assignation de récompense
const createRewardAssignment = async (req, res) => {
    const { reward_id, user_id } = req.body;
    try {
        const newAssignment = await rewardsModel.createRewardAssignment(reward_id, user_id);
        res.status(201).json(newAssignment);
    } catch (err) {
        console.error('Error creating reward assignment:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Supprimer une assignation de récompense par ID
const deleteRewardAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await rewardsModel.deleteRewardAssignment(id);
        if (!result) {
            return res.status(404).json({ error: 'Reward assignment not found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Error deleting reward assignment:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir toutes les assignations de récompenses
const getAllRewardAssignments = async (req, res) => {
    try {
        const assignments = await rewardsModel.getAllRewardAssignments();

        res.json(assignments);
    } catch (err) {
        console.error('Error getting reward assignments:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

module.exports = {
    createReward,
    getReward,
    updateReward,
    deleteReward,
    getRewardsByGameId,
    getAllRewards,
    createRewardAssignment,
    deleteRewardAssignment,
    getAllRewardAssignments
};