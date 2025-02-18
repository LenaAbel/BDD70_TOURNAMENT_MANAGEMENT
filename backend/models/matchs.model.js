const db = require("../database/db_init");

// Créer un nouveau match
const createMatch = (match) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO matchs SET ?", match, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ matchs_id: result.insertId, ...match });
        });
    });
};

// Obtenir un match par son ID
const getMatchById = (matchId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM matchs WHERE matchs_id = ?", [matchId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]);
        });
    });
};

// Obtenir tous les matchs
const getAllMatchs = async () => {
    const startTime = process.hrtime(); // Start timing
    try {
        const [results] = await db.query("SELECT * FROM matchs"); // Use promise-based query
        const endTime = process.hrtime(startTime); // End timing
        const executionTime = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(3); // Convert to ms
        console.log(`getAllMatchs execution time: ${executionTime} ms`); // Log execution time
        return results; // Return query results
    } catch (err) {
        console.error("Error fetching matches:", err);
        throw err; // Re-throw error to be handled upstream
    }
};

// Mettre à jour un match par son ID
const updateMatch = (matchId, updatedMatch) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE matchs SET ? WHERE matchs_id = ?", [updatedMatch, matchId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Supprimer un match par son ID
const deleteMatch = (matchId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM matchs WHERE matchs_id = ?", [matchId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {
    createMatch,
    getMatchById,
    getAllMatchs,
    updateMatch,
    deleteMatch
};
