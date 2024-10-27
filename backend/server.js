const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const db = require("./database/db_init");

//instanciation des routes
const playerRoutes = require("./routes/player_routes");
const activityRoutes = require("./routes/activity_routes");


dotenv.config();

server.use(cors());
server.use(express.json());
server.use(bodyParser.json());

// call des routes
server.use("/api/players", playerRoutes);
server.use("/api/activity", activityRoutes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});