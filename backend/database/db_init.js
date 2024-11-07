const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const fs = require("fs").promises;

// Create connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Helper function to read and execute SQL files
const executeSqlFile = async (filePath, delimiter = ';') => {
    try {
        const sql = await fs.readFile(filePath, 'utf8');
        const sqlStatements = sql.split(delimiter).filter(statement => statement.trim());
        
        for (const statement of sqlStatements) {
            await new Promise((resolve, reject) => {
                db.query(statement, (queryErr, results) => {
                    if (queryErr) {
                        reject('Error executing SQL query: ' + queryErr);
                    } else {
                        console.log('Query results:', results);
                        resolve();
                    }
                });
            });
        }
    } catch (err) {
        console.error(`Error reading SQL file (${filePath}):`, err);
    }
};

// Execute SQL files sequentially
const executeSqlFiles = async () => {
    await executeSqlFile('./database/db.sql');
    await executeSqlFile('./database/procedures.sql', '//');
    await executeSqlFile('./database/inserts.sql');
};

// Start the execution
executeSqlFiles()
    .then(() => {
        console.log("All SQL files executed successfully.");
    })
    .catch(err => {
        console.error(err);
    });

module.exports = db;
