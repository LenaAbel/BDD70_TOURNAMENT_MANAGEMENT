// Import connection to the database
import db from "../database/db_init";

// Get all truc truc you get me
export const getAllTrucTruc = async () => {
    db.query("SELECT * FROM truc_truc", (err, result) => {
        if (err) {
            console.log(err);
            throw new Error(`Error in getAllTrucTruc service: ${err.message}`);
        }
        return result;
    });
};