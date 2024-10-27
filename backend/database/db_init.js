const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const fs = require('fs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
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
    });
});


module.exports = db;