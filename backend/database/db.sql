-- Active: 1729350260190@@127.0.0.1@3306@bd70_tournament


CREATE TABLE activity (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(50) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

-- bd70_tournament.team definition
CREATE TABLE team (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(50) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

-- bd70_tournament.player definition
CREATE TABLE player (
    id int NOT NULL AUTO_INCREMENT,
    email varchar(128) DEFAULT NULL,
    name varchar(50) DEFAULT NULL,
    lastname varchar(50) DEFAULT NULL,
    nickname varchar(50) DEFAULT NULL,
    password varchar(256) DEFAULT NULL,
    account_type int DEFAULT NULL,
    team_id int DEFAULT NULL,
    PRIMARY KEY (id),
    KEY id_1 (team_id),
    CONSTRAINT player_ibfk_1 FOREIGN KEY (team_id) REFERENCES team (id)
) ENGINE = InnoDB;

-- bd70_tournament.rules definition
CREATE TABLE rules (
    id int NOT NULL AUTO_INCREMENT,
    ruleSet text,
    activity_id int NOT NULL,
    PRIMARY KEY (id),
    KEY id_1 (activity_id),
    CONSTRAINT rules_ibfk_1 FOREIGN KEY (activity_id) REFERENCES activity (id)
) ENGINE = InnoDB;

-- bd70_tournament.tournament definition
CREATE TABLE tournament (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(50) DEFAULT NULL,
    start_time datetime DEFAULT NULL,
    bestOfX int DEFAULT NULL,
    poolSize int DEFAULT NULL,
    type enum('solo', 'team') DEFAULT NULL,
    rule_id int NOT NULL,
    regi int NOT NULL,
    PRIMARY KEY (id),
    KEY id_1 (rule_id),
    KEY id_2 (regi),
    CONSTRAINT tournament_ibfk_1 FOREIGN KEY (rule_id) REFERENCES rules (id),
    CONSTRAINT tournament_ibfk_2 FOREIGN KEY (regi) REFERENCES player (id)
) ENGINE = InnoDB;

-- bd70_tournament.favoriteactivity definition
CREATE TABLE favoriteactivity (
    player_id int NOT NULL AUTO_INCREMENT,
    activity_id int NOT NULL,
    PRIMARY KEY (player_id, activity_id),
    KEY id_1 (activity_id),
    CONSTRAINT favoriteactivity_ibfk_1 FOREIGN KEY (player_id) REFERENCES player (id),
    CONSTRAINT favoriteactivity_ibfk_2 FOREIGN KEY (activity_id) REFERENCES activity (id)
) ENGINE = InnoDB;

-- bd70_tournament.matchs definition
CREATE TABLE matchs (
    id int NOT NULL AUTO_INCREMENT,
    start_time datetime DEFAULT NULL,
    status varchar(50) DEFAULT NULL,
    location varchar(50) DEFAULT NULL,
    tournament_id int NOT NULL,
    PRIMARY KEY (id),
    KEY id_1 (tournament_id),
    CONSTRAINT matchs_ibfk_1 FOREIGN KEY (tournament_id) REFERENCES tournament (id)
) ENGINE = InnoDB;

-- bd70_tournament.register definition
CREATE TABLE register (
    player_id int NOT NULL AUTO_INCREMENT,
    team_id int NOT NULL,
    tournament_id int NOT NULL,
    PRIMARY KEY (player_id, team_id, tournament_id),
    KEY id_1 (team_id),
    KEY id_2 (tournament_id),
    CONSTRAINT register_ibfk_1 FOREIGN KEY (player_id) REFERENCES player (id),
    CONSTRAINT register_ibfk_2 FOREIGN KEY (team_id) REFERENCES team (id),
    CONSTRAINT register_ibfk_3 FOREIGN KEY (tournament_id) REFERENCES tournament (id)
) ENGINE = InnoDB;

-- bd70_tournament.results definition
CREATE TABLE results (
    id int NOT NULL AUTO_INCREMENT,
    winner_score varchar(50) DEFAULT NULL,
    loser_score varchar(50) DEFAULT NULL,
    match_id int NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY id_1 (match_id),
    CONSTRAINT results_ibfk_1 FOREIGN KEY (match_id) REFERENCES matchs (id)
) ENGINE = InnoDB;

-- bd70_tournament.matchpairing definition
CREATE TABLE matchpairing (
    player_id int NOT NULL AUTO_INCREMENT,
    team_id int NOT NULL,
    match_id int NOT NULL,
    PRIMARY KEY (player_id, team_id, match_id),
    KEY id_1 (team_id),
    KEY id_2 (match_id),
    CONSTRAINT matchpairing_ibfk_1 FOREIGN KEY (player_id) REFERENCES player (id),
    CONSTRAINT matchpairing_ibfk_2 FOREIGN KEY (team_id) REFERENCES team (id),
    CONSTRAINT matchpairing_ibfk_3 FOREIGN KEY (match_id) REFERENCES matchs (id)
) ENGINE = InnoDB;