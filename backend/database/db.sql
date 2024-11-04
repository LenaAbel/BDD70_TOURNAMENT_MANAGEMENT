-- Table activity avec des colonnes supplémentaires
CREATE TABLE IF NOT EXISTS activity (
    activity_id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    number_of_players int NOT NULL,
    type enum('solo', 'team') NOT NULL,
    description text,
    category varchar(50),
    PRIMARY KEY (activity_id)
);

-- Table team
CREATE TABLE IF NOT EXISTS team (
    team_id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    PRIMARY KEY (team_id)
);

-- Table player avec team_id ajouté
CREATE TABLE IF NOT EXISTS player (
    player_id int NOT NULL AUTO_INCREMENT,
    email varchar(128) NOT NULL UNIQUE,
    name varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    nickname varchar(50),
    password varchar(256) NOT NULL,
    account_type enum('player', 'organizer', 'admin') DEFAULT 'player',
    team_id int DEFAULT NULL,  -- Added team_id column
    PRIMARY KEY (player_id),
    FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE SET NULL  -- Added foreign key constraint for team_id
);

-- Table team_member pour gérer les membres des équipes
CREATE TABLE IF NOT EXISTS team_member (
    team_id int NOT NULL,
    player_id int NOT NULL,
    PRIMARY KEY (team_id, player_id),
    CONSTRAINT fk_team_member_team FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE CASCADE,
    CONSTRAINT fk_team_member_player FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE
);

-- Table rules
CREATE TABLE IF NOT EXISTS rules (
    rules_id int NOT NULL AUTO_INCREMENT,
    ruleSet text,
    activity_id int NOT NULL,
    PRIMARY KEY (rules_id),
    KEY idx_activity_id (activity_id),
    CONSTRAINT fk_rules_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);

-- Table tournament avec corrections
CREATE TABLE IF NOT EXISTS tournament (
    tournament_id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    start_time datetime NOT NULL,
    bestOfX int DEFAULT NULL,
    poolSize int DEFAULT NULL,
    type enum('solo', 'team') NOT NULL,
    format enum('elimination', 'round_robin', 'swiss') DEFAULT 'elimination',
    rule_id int NOT NULL,
    organizer_id int NOT NULL,
    PRIMARY KEY (tournament_id),
    KEY idx_rule_id (rule_id),
    KEY idx_organizer_id (organizer_id),
    CONSTRAINT fk_tournament_rules FOREIGN KEY (rule_id) REFERENCES rules (rules_id) ON DELETE CASCADE,
    CONSTRAINT fk_tournament_organizer FOREIGN KEY (organizer_id) REFERENCES player (player_id) ON DELETE CASCADE
);

-- Table favoriteactivity corrigée
CREATE TABLE IF NOT EXISTS favoriteactivity (
    player_id int NOT NULL,
    activity_id int NOT NULL,
    PRIMARY KEY (player_id, activity_id),
    KEY idx_activity_id (activity_id),
    CONSTRAINT fk_favoriteactivity_player FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    CONSTRAINT fk_favoriteactivity_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);

-- Table matchs
CREATE TABLE IF NOT EXISTS matchs (
    matchs_id int NOT NULL AUTO_INCREMENT,
    start_time datetime NOT NULL,
    status varchar(50) DEFAULT NULL,
    location varchar(50) DEFAULT NULL,
    tournament_id int NOT NULL,
    round_id INT DEFAULT NULL, /*nouvelle colonne*/
    PRIMARY KEY (matchs_id),
    KEY idx_tournament_id (tournament_id),
    CONSTRAINT fk_matchs_round FOREIGN KEY (round_id) REFERENCES tournament_round (round_id) ON DELETE SET NULL; --nouvelle add 
    CONSTRAINT fk_matchs_tournament FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON DELETE CASCADE
);

-- Table register corrigée
CREATE TABLE IF NOT EXISTS register (
    player_id INT NOT NULL,
    team_id INT DEFAULT NULL,
    tournament_id INT NOT NULL,
    PRIMARY KEY (player_id, tournament_id),
    UNIQUE KEY unique_team (team_id, player_id, tournament_id),
    FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE SET NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON DELETE CASCADE
);

-- Table results avec identifiants des gagnants et des perdants
CREATE TABLE IF NOT EXISTS results (
    results_id int NOT NULL AUTO_INCREMENT,
    match_id int NOT NULL,
    winner_player_id int DEFAULT NULL,
    loser_player_id int DEFAULT NULL,
    winner_team_id int DEFAULT NULL,
    loser_team_id int DEFAULT NULL,
    winner_score int DEFAULT NULL,
    loser_score int DEFAULT NULL,
    PRIMARY KEY (results_id),
    UNIQUE KEY idx_match_id (match_id),
    CONSTRAINT fk_results_match FOREIGN KEY (match_id) REFERENCES matchs (matchs_id) ON DELETE CASCADE,
    CONSTRAINT fk_results_winner_player FOREIGN KEY (winner_player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    CONSTRAINT fk_results_loser_player FOREIGN KEY (loser_player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    CONSTRAINT fk_results_winner_team FOREIGN KEY (winner_team_id) REFERENCES team (team_id) ON DELETE CASCADE,
    CONSTRAINT fk_results_loser_team FOREIGN KEY (loser_team_id) REFERENCES team (team_id) ON DELETE CASCADE
);

-- Table matchpairing unique pour les joueurs et les équipes
CREATE TABLE IF NOT EXISTS matchpairing (
    matchpairing_id int NOT NULL AUTO_INCREMENT,
    match_id int NOT NULL,
    player_id int DEFAULT NULL,
    team_id int DEFAULT NULL,
    PRIMARY KEY (matchpairing_id),
    KEY idx_match_id (match_id),
    KEY idx_player_id (player_id),
    KEY idx_team_id (team_id),
    CONSTRAINT fk_matchpairing_match FOREIGN KEY (match_id) REFERENCES matchs (matchs_id) ON DELETE CASCADE,
    CONSTRAINT fk_matchpairing_player FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    CONSTRAINT fk_matchpairing_team FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE CASCADE
);

-- Table ranking avec tournament_id
CREATE TABLE IF NOT EXISTS ranking (
    ranking_id INT NOT NULL AUTO_INCREMENT,
    tournament_id INT NOT NULL,
    player_id INT DEFAULT NULL,
    team_id INT DEFAULT NULL,
    points INT DEFAULT 0,
    ranking INT DEFAULT NULL,
    PRIMARY KEY (ranking_id),
    KEY idx_tournament_id (tournament_id),
    CONSTRAINT fk_ranking_tournament FOREIGN KEY (tournament_id) REFERENCES tournament(tournament_id) ON DELETE CASCADE,
    CONSTRAINT fk_ranking_player FOREIGN KEY (player_id) REFERENCES player(player_id) ON DELETE CASCADE,
    CONSTRAINT fk_ranking_team FOREIGN KEY (team_id) REFERENCES team(team_id) ON DELETE CASCADE
);

-- Table player_stats pour les statistiques des joueurs
CREATE TABLE IF NOT EXISTS player_stats (
    player_id int NOT NULL,
    activity_id int NOT NULL,
    total_matches int DEFAULT 0,
    wins int DEFAULT 0,
    losses int DEFAULT 0,
    draws int DEFAULT 0,
    PRIMARY KEY (player_id, activity_id),
    CONSTRAINT fk_player_stats_player FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    CONSTRAINT fk_player_stats_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);

-- Table team_stats pour les statistiques des équipes
CREATE TABLE IF NOT EXISTS team_stats (
    team_id int NOT NULL,
    activity_id int NOT NULL,
    total_matches int DEFAULT 0,
    wins int DEFAULT 0,
    losses int DEFAULT 0,
    draws int DEFAULT 0,
    PRIMARY KEY (team_id, activity_id),
    CONSTRAINT fk_team_stats_team FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE CASCADE,
    CONSTRAINT fk_team_stats_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);
-- nouvelle table
CREATE TABLE IF NOT EXISTS tournament_round (
    round_id INT NOT NULL AUTO_INCREMENT,
    tournament_id INT NOT NULL,
    round_number INT NOT NULL,
    PRIMARY KEY (round_id),
    UNIQUE KEY unique_round (tournament_id, round_number),
    FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON DELETE CASCADE
);


