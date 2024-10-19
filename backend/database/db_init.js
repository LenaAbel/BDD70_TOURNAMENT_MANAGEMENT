const mysql = require("mysql2");
const dotenv = require("dotenv");
const fs = require('fs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: 'root',
    password: '',
    database: 'bd70_tournament'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');

    fs.readFile('./database/db.sql', 'utf8', (err, sql) => {
        if (err) {
            console.error('Error reading SQL file:', err);
            return;
        }

        const sqlCommands = sql.split(';').filter(command => command.trim());

        sqlCommands.forEach(command => {
            db.query(command, (error, results) => {
                if (error) {
                    console.error('Error executing command:', command, error);
                } else {
                    console.log('Executed command successfully:');
                }
            });
        });

        db.end(err => {
            if (err) {
                console.error('Error closing the connection:', err);
            } else {
                console.log('Connection closed successfully.');
            }
        });
    });
});


module.exports = db;