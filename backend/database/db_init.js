const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();
const fs = require("fs").promises;
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 5;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const executeSqlFile = async (filePath) => {
    try {
        const sql = await fs.readFile(filePath, "utf8");
        const cleanedSql = sql.replace(/^DELIMITER .*\n/mg, "").replace(/\nDELIMITER ;/g, "");

        const startTime = process.hrtime();
        await pool.query(cleanedSql);
        const endTime = process.hrtime(startTime);

        console.log(
            `Executed ${filePath} successfully in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(3)} ms.`
        );
    } catch (err) {
        console.error(`Error reading or executing SQL file (${filePath}):`, err);
    }
};

const insertHashedUsers = async () => {
    const BATCH_SIZE = 1000;
    const totalPlayers = 10000;
    const playerBatches = [];
    const preHashedPassword = bcrypt.hashSync("password123", SALT_ROUNDS);

    const startTime = process.hrtime();
    for (let i = 1; i <= totalPlayers; i++) {
        const team_id = i % 10 === 0 ? null : (i % 20) + 1;
        const account_type = i % 3 === 0 ? "player" : i % 3 === 1 ? "organizer" : "admin";

        playerBatches.push([
            `user${i}@example.com`,
            `User${i}`,
            `Lastname${i}`,
            `Nick${i}`,
            preHashedPassword,
            account_type,
            team_id,
        ]);

        if (playerBatches.length === BATCH_SIZE || i === totalPlayers) {
            const sql = `
                INSERT INTO player 
                (player_email, player_name, player_lastname, player_nickname, player_password, player_account_type, team_id) 
                VALUES ?`;

            try {
                const [result] = await pool.query(sql, [playerBatches]);
                console.log(`Inserted ${result.affectedRows} players successfully.`);
            } catch (error) {
                console.error("Error inserting players:", error);
            }

            playerBatches.length = 0;
        }
    }
    const endTime = process.hrtime(startTime);
    console.log(`Inserted ${totalPlayers} players in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(3)} ms.`);
};

const insertTeams = async () => {
    const teams = [];
    for (let i = 1; i <= 10000; i++) {
        teams.push([`Team_${i}`]);
    }

    const sql = "INSERT INTO team (team_name) VALUES ?";
    const startTime = process.hrtime();
    try {
        const [result] = await pool.query(sql, [teams]);
        const endTime = process.hrtime(startTime);
        console.log(`Inserted ${result.affectedRows} teams in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(3)} ms.`);
    } catch (error) {
        console.error("Error inserting teams:", error);
    }
};

const insertMatchs = async (totalMatches = 10000) => {
    const BATCH_SIZE = 100; // Batch size for bulk insertion
    const matchBatches = [];
    const startTime = process.hrtime(); // Start timing

    // Get valid tournament IDs from the database
    const [tournamentRows] = await pool.query("SELECT tournament_id FROM tournament");
    const validTournamentIds = tournamentRows.map(row => row.tournament_id);

    if (validTournamentIds.length === 0) {
        console.warn("Warning: No valid tournaments found in the database. Skipping match insertion.");
        return;
    }

    for (let i = 1; i <= totalMatches; i++) {
        const matchStartTime = new Date(Date.now() + i * 60000); // Staggered match times
        const matchStatus = i % 2 === 0 ? "scheduled" : "completed"; // Alternate statuses
        const tournamentId = validTournamentIds[i % validTournamentIds.length]; // Cycle through valid tournament IDs

        matchBatches.push([matchStartTime, matchStatus, `Location_${i}`, tournamentId]);

        if (matchBatches.length === BATCH_SIZE || i === totalMatches) {
            const sql = `
                INSERT INTO matchs
                    (matchs_start_time, matchs_status, matchs_location, tournament_id)
                VALUES ?`;

            try {
                const batchStartTime = process.hrtime(); // Batch start time
                const [result] = await pool.query(sql, [matchBatches]);
                const batchEndTime = process.hrtime(batchStartTime);
                console.log(
                    `Inserted ${result.affectedRows} matches in ${(batchEndTime[0] * 1000 + batchEndTime[1] / 1e6).toFixed(
                        3
                    )} ms.`
                );
            } catch (error) {
                console.error("Error inserting matches:", error);
            }

            matchBatches.length = 0; // Clear the batch for the next loop
        }
    }

    const endTime = process.hrtime(startTime); // Total execution time
    console.log(`Inserted ${totalMatches} matches in ${(endTime[0] * 1000 + endTime[1] / 1e6).toFixed(3)} ms.`);
};

const executeSqlFiles = async () => {
    try {
        const startTotalTime = process.hrtime();

        await executeSqlFile("./database/db.sql");
        await executeSqlFile("./database/reset.sql");
        await executeSqlFile("./database/db.sql");
        await executeSqlFile("./database/procedures.sql");

        await insertTeams();
        await insertHashedUsers();

        console.log("Inserting tournaments...");
        await executeSqlFile("./database/insert1.sql");
        await executeSqlFile("./database/insert2.sql");

        // Verify tournaments before inserting matches
        const [tournamentRows] = await pool.query("SELECT COUNT(*) AS count FROM tournament");
        if (tournamentRows[0].count === 0) {
            console.warn("Warning: No tournaments found in the database. Match insertion will be skipped.");
        } else {
            await insertMatchs(10000); // Insert 1,000 matches
        }

        await executeSqlFile("./database/triggers.sql");
        await executeSqlFile("./database/procElimTeams.sql");
        await executeSqlFile("./database/procRandWinnerTeam.sql");

        const endTotalTime = process.hrtime(startTotalTime);
        console.log(`Database initialization completed in ${(endTotalTime[0] * 1000 + endTotalTime[1] / 1e6).toFixed(3)} ms.`);
    } catch (error) {
        console.error("Error during database setup:", error);
    }
};

executeSqlFiles().catch((err) => console.error("Execution error:", err));

module.exports = pool;
