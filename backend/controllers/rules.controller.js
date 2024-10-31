const rulesModel = require('../models/rules.model');

// Crée une règle

const createRule = async (req, res) => {
    const { ruleSet, activity_id } = req.body;
    try {
        const newRule = await rulesModel.createRule(ruleSet, activity_id);
        res.status(201).json(newRule);
    } catch (err) {
        console.error('Error creating rule:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Obtenir une règle par ID

const getRule = async (req, res) => {
    const { id } = req.params;
    try {
        const rule = await rulesModel.getRuleById(id);
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        res.json(rule);
    } catch (err) {
        console.error('Error getting rule:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
}

// Mettre à jour une règle par ID

const updateRule = async (req, res) => {
    const { id } = req.params;
    const { ruleSet, activity_id } = req.body;
    try {
        const updatedRule = await rulesModel.updateRule(id, ruleSet, activity_id);
        if (!updatedRule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        res.json(updatedRule);
    } catch (err) {
        console.error('Error updating rule:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
}

// Supprimer une règle par ID

const deleteRule = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await rulesModel.deleteRule(id);
        if (!result) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Error deleting rule:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
}

// Obtenir toutes les règles

const getAllRules = async (req, res) => {
    try {
        const rules = await rulesModel.getAllRules();
        res.json(rules);
    } catch (err) {
        console.error('Error getting rules:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
}

// Obtenir toutes les règles par game_id

const getRulesByGameId = async (req, res) => {
    const { game_id } = req.params;
    try {
        const rules = await rulesModel.getRulesByGameId(game_id);
        res.json(rules);
    } catch (err) {
        console.error('Error getting rules:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
}

module.exports = {
    createRule,
    getRule,
    updateRule,
    deleteRule,
    getRulesByGameId,
    getAllRules
};