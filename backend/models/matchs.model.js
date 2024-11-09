const db = require("../database/db_init");
const { get } = require("../routes/favoriteActivity_routes");

//create a new match
const createMatch = (matchs) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO matchs SET ?", matchs, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ matchs_id: result.insertId, ...match });
        });
    });
};

// Obtenir tous les matchs
const getAllMatchs = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM matchs", (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    getAllMatchs,
    createMatch
};