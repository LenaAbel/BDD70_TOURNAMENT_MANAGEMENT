const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const db = require("./database/db_init");

//instanciation des routes
const playerRoutes = require("./routes/player_routes");
const activityRoutes = require("./routes/activity_routes");
const teamRoutes = require("./routes/team_routes");
const rulesRoutes = require("./routes/rules_routes");
const tournamentRoutes = require("./routes/tournament.routes");
const team_memberRoutes = require("./routes/team_member_routes");
const favoriteActivityRoutes = require("./routes/favoriteActivity_routes");
const matchsRoutes = require("./routes/matchs_routes");
const tournamentRoundRoutes = require("./routes/tournament_round_routes");
const playerStatsRoutes = require("./routes/player_stats_routes");


dotenv.config();

server.use(cors());
server.use(express.json());
server.use(bodyParser.json());

// call des routes
server.use("/api/players", playerRoutes);
server.use("/api/activity", activityRoutes);
server.use("/api/team", teamRoutes);
server.use("/api/rules", rulesRoutes);
server.use("/api/tournament", tournamentRoutes);
server.use("/api/team_member", team_memberRoutes);
server.use("/api/favoriteActivity", favoriteActivityRoutes);
server.use("/api/matchs", matchsRoutes);
server.use("/api/tournamentRound", tournamentRoundRoutes);
server.use("/api/playerStats", playerStatsRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});