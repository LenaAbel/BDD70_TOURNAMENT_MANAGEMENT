const mysql = require('mysql2');

const db = require('../database/db_init');

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
});

const getAllPlayers = (req, res) => {
    db.query('SELECT * FROM player', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching players' });
        }
        res.json(results);
    });
};

const createPlayer = (req, res) => {
    console.log("Gonna create a new player");
    
    const { email, name, lastname, nickname, password, account_type, team_id } = req.body;
    db.query(
        'INSERT INTO player (email, name, lastname, nickname, password, account_type, team_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, name, lastname, nickname, password, account_type, team_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error adding player' });
            }
            res.status(201).json({ id: result.insertId, email, name, lastname, nickname, account_type, team_id });
        }
    );
};

const getPlayerById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM player WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json(results[0]);
    });
};

const updatePlayer = (req, res) => {
    const { id } = req.params;
    const { email, name, lastname, nickname, password, account_type, team_id } = req.body;
    db.query(
        'UPDATE player SET email = ?, name = ?, lastname = ?, nickname = ?, password = ?, account_type = ?, team_id = ? WHERE id = ?',
        [email, name, lastname, nickname, password, account_type, team_id, id],
        (err, result) => {
            if (err || result.affectedRows === 0) {
                return res.status(404).json({ error: 'Error updating player or player not found' });
            }
            res.json({ id, email, name, lastname, nickname, account_type, team_id });
        }
    );
};

const deletePlayer = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM player WHERE id = ?', [id], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(404).json({ error: 'Error deleting player or player not found' });
        }
        res.status(204).send();
    });
};

process.on('SIGINT', () => {
    db.end(err => {
        if (err) {
            console.error('Error closing the database connection:', err);
        }
        process.exit(0);
    });
});

module.exports = {
    getAllPlayers,
    createPlayer,
    getPlayerById,
    updatePlayer,
    deletePlayer
};
