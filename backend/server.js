const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const server = express();

const Routeur = require("./routes/routes.js");

dotenv.config();

server.use(cors());
server.use(express.json());
server.use(bodyParser.json());

server.use("/", Routeur);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});