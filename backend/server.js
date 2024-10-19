const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const server = express();

dotenv.config();

server.use(cors());
server.use(express.json());
server.use(bodyParser.json());


