const db = require('../database/db'); // Adjust the path as necessary

// Crée une activité
const createActivity = (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO activity (name) VALUES (?)', [name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.status(201).json({ id: result.insertId, name });
    });
};

// obtenir une activité
const getActivity = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM activity WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(result[0]);
    });
};

// mettre à jour une activité
const updateActivity = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.query('UPDATE activity SET name = ? WHERE id = ?', [name, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json({ id, name });
    });
};

// supprimer une activité
const deleteActivity = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM activity WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted successfully' });
    });
};

// getAll activités
const getAllActivities = (req, res) => {
    db.query('SELECT * FROM activity', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        res.json(results);
    });
};

module.exports = {
    createActivity,
    getActivity,
    updateActivity,
    deleteActivity,
    getAllActivities,
};