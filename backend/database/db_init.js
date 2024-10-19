const mysql = require("mysql2");
const dotenv = require("dotenv");
const fs = require('fs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: 'bd_70',
    password: 'bd_70',
    database: 'bd70_tournament'
});


function setupDatabase() {
    const sqlFilePath = './database/db.sql';
    fs.readFile(sqlFilePath, 'utf8', (err, sql) => {
        if (err) {
            console.error('Error reading SQL file:', err.message);
            return;
        }

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error importing SQL file:', err.message);
                return;
            }
            console.log('Database imported successfully.');
        });
    });
}

setupDatabase();

module.exports = db;