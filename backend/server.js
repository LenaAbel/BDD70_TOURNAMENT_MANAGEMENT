const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const db = require("./database/db_init");

dotenv.config();

server.use(cors());
server.use(express.json());
server.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
