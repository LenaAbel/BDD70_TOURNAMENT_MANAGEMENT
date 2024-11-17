const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const { exec } = require("child_process");

const SALT_ROUNDS = 5; // Lower salt rounds for faster hashing of dummy data

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper function to read and execute SQL files
const executeSqlFile = async (filePath) => {
    try {
        const sql = await fs.readFile(filePath, 'utf8');
        const cleanedSql = sql.replace(/^DELIMITER .*\n/mg, '').replace(/\nDELIMITER ;/g, '');

        await new Promise((resolve, reject) => {
            pool.query(cleanedSql, (queryErr, results) => {
                if (queryErr) {
                    reject('Error executing SQL query: ' + queryErr);
                } else {
                    console.log(`Executed ${filePath} successfully.`);
                    resolve();
                }
            });
        });
    } catch (err) {
        console.error(`Error reading SQL file (${filePath}):`, err);
    }
};

// Pre-hash common dummy password
const preHashedPassword = bcrypt.hashSync('password123', SALT_ROUNDS);

// Insert users with pre-hashed password
const insertHashedUsers = async () => {
    const users = [
        { email: 'alice@example.com', name: 'Alice', lastname: 'Smith', nickname: 'Ali', password: preHashedPassword, account_type: 'player', team_id: 1 },
        { email: 'bob@example.com', name: 'Bob', lastname: 'Brown', nickname: 'Bobby', password: preHashedPassword, account_type: 'player', team_id: 1 },
        { email: 'carol@example.com', name: 'Carol', lastname: 'Johnson', nickname: 'CJ', password: preHashedPassword, account_type: 'organizer', team_id: null },
        { email: 'dave@example.com', name: 'Dave', lastname: 'Williams', nickname: 'D', password: preHashedPassword, account_type: 'player', team_id: 2 },
        { email: 'eve@example.com', name: 'Eve', lastname: 'Davis', nickname: 'Evie', password: preHashedPassword, account_type: 'admin', team_id: null },

        // New users (doubled with unique names)
        { email: 'frank@example.com', name: 'Frank', lastname: 'Miller', nickname: 'Frankie', password: preHashedPassword, account_type: 'player', team_id: 1 },
        { email: 'grace@example.com', name: 'Grace', lastname: 'Taylor', nickname: 'Gracie', password: preHashedPassword, account_type: 'player', team_id: 1 },
        { email: 'hank@example.com', name: 'Hank', lastname: 'Moore', nickname: 'Hankster', password: preHashedPassword, account_type: 'organizer', team_id: null },
        { email: 'iris@example.com', name: 'Iris', lastname: 'Martin', nickname: 'Rissy', password: preHashedPassword, account_type: 'player', team_id: 2 },
        { email: 'jack@example.com', name: 'Jack', lastname: 'Anderson', nickname: 'Jax', password: preHashedPassword, account_type: 'admin', team_id: null },

        { email: 'karen@example.com', name: 'Karen', lastname: 'Thompson', nickname: 'Karry', password: preHashedPassword, account_type: 'player', team_id: 3 },
        { email: 'louis@example.com', name: 'Louis', lastname: 'Garcia', nickname: 'Lou', password: preHashedPassword, account_type: 'player', team_id: 3 },
        { email: 'maria@example.com', name: 'Maria', lastname: 'Hernandez', nickname: 'Mari', password: preHashedPassword, account_type: 'organizer', team_id: null },
        { email: 'nathan@example.com', name: 'Nathan', lastname: 'Lopez', nickname: 'Nate', password: preHashedPassword, account_type: 'player', team_id: 4 },
        { email: 'olivia@example.com', name: 'Olivia', lastname: 'Young', nickname: 'Liv', password: preHashedPassword, account_type: 'admin', team_id: null },

        { email: 'peter@example.com', name: 'Peter', lastname: 'King', nickname: 'Pete', password: preHashedPassword, account_type: 'player', team_id: 5 },
        { email: 'quinn@example.com', name: 'Quinn', lastname: 'Wright', nickname: 'Q', password: preHashedPassword, account_type: 'player', team_id: 5 },
        { email: 'rachel@example.com', name: 'Rachel', lastname: 'Scott', nickname: 'Rae', password: preHashedPassword, account_type: 'organizer', team_id: null },
        { email: 'sam@example.com', name: 'Sam', lastname: 'Adams', nickname: 'Sammy', password: preHashedPassword, account_type: 'player', team_id: 6 },
        { email: 'tina@example.com', name: 'Tina', lastname: 'Baker', nickname: 'Tee', password: preHashedPassword, account_type: 'admin', team_id: null },

        { email: 'ursula@example.com', name: 'Ursula', lastname: 'Nelson', nickname: 'Urs', password: preHashedPassword, account_type: 'player', team_id: 7 },
        { email: 'vince@example.com', name: 'Vince', lastname: 'Carter', nickname: 'Vinny', password: preHashedPassword, account_type: 'player', team_id: 7 },
        { email: 'wendy@example.com', name: 'Wendy', lastname: 'Evans', nickname: 'Wen', password: preHashedPassword, account_type: 'organizer', team_id: null },
        { email: 'xander@example.com', name: 'Xander', lastname: 'Perez', nickname: 'Xan', password: preHashedPassword, account_type: 'player', team_id: 8 },
        { email: 'yara@example.com', name: 'Yara', lastname: 'Roberts', nickname: 'Yari', password: preHashedPassword, account_type: 'admin', team_id: null },

        { email: 'zane@example.com', name: 'Zane', lastname: 'Walker', nickname: 'Z', password: preHashedPassword, account_type: 'player', team_id: 9 },
        { email: 'zoe@example.com', name: 'Zoe', lastname: 'Harris', nickname: 'Zoey', password: preHashedPassword, account_type: 'player', team_id: 9 }
    ];


    const sql = "INSERT INTO player (player_email, player_name, player_lastname, player_nickname, player_password, player_account_type, team_id) VALUES ?";
    const values = users.map(user => [
        user.email,
        user.name,
        user.lastname,
        user.nickname,
        user.password,
        user.account_type,
        user.team_id
    ]);

    await new Promise((resolve, reject) => {
        pool.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error inserting users:", err);
                reject(err);
            } else {
                console.log("Inserted users successfully.");
                resolve(result);
            }
        });
    });
};

// Execute SQL files, reset database, and insert hashed users
const executeSqlFiles = async () => {
    try {
        // First, create tables if they don't exist
        await executeSqlFile('./database/db.sql');

        // Reset (truncate or drop) tables if they exist, clearing old data
        await executeSqlFile('./database/reset.sql');

        // Recreate tables after reset
        await executeSqlFile('./database/db.sql');

        // Create procedures
        await executeSqlFile('./database/procedures.sql');

        // Insert initial data that doesn't rely on foreign keys (e.g., activities, teams)
        await executeSqlFile('./database/insert1.sql');
    

        await executeSqlFile('./database/procElimTeams.sql');

        await executeSqlFile('./database/procRandWinnerTeam.sql');

        // Insert users with hashed passwords
        await insertHashedUsers();

        // Insert dependent data that references initial inserts
        await executeSqlFile('./database/insert2.sql');

        //test
        await executeSqlFile('./database/triggers.sql');

        //test la procédure elimination Brackets
        await executeSqlFile('./database/procedureElimination.sql');

        //test la procédure random winner
        await executeSqlFile('./database/procedureRandomWinner.sql');

        await executeSqlFile('./database/triggerTeam.sql');

        console.log("All SQL files and user inserts executed successfully.");
    } catch (err) {
        console.error("Error during execution:", err);
    }
};


executeSqlFiles()
    .catch(err => {
        console.error("Execution error:", err);
    });

module.exports = pool;
