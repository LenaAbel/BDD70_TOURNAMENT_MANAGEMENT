const mysql = require("mysql2");
const dotenv = require("dotenv");
const fs = require('fs');

// Load environment variables
dotenv.config();

// Log environment variables to verify they are loaded correctly
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS ? '****' : 'Not Set');
console.log('DB_NAME:', process.env.DB_NAME);

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Connect to the database
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
        // Split the SQL file into individual commands
        const sqlCommands = sql.split(';').filter(command => command.trim());

        sqlCommands.forEach(command => {
            db.query(command, (error, results) => {
                if (error) {
                    console.error('Error executing command:', command, error);
                } else {
                    console.log('Executed command successfully:', command);
                }
            });
        });
        
    });
});

module.exports = db;