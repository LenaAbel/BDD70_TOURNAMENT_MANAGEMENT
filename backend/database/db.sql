-- Table activity with prefixed columns
CREATE TABLE IF NOT EXISTS activity (
    activity_id int NOT NULL AUTO_INCREMENT,
    activity_name varchar(50) NOT NULL,
    activity_number_of_players int NOT NULL,
    activity_type enum('solo', 'team') NOT NULL,
    activity_description text,
    activity_category varchar(50),
    PRIMARY KEY (activity_id)
);

-- Table team with prefixed columns
CREATE TABLE IF NOT EXISTS team (
    team_id int NOT NULL AUTO_INCREMENT,
    team_name varchar(50) NOT NULL,
    PRIMARY KEY (team_id)
);

-- Table player with prefixed columns and team_id added
CREATE TABLE IF NOT EXISTS player (
    player_id int NOT NULL AUTO_INCREMENT,
    player_email varchar(128) NOT NULL UNIQUE,
    player_name varchar(50) NOT NULL,
    player_lastname varchar(50) NOT NULL,
    player_nickname varchar(50),
    player_password varchar(256) NOT NULL,
    player_registragtionDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    player_account_type enum('player', 'organizer', 'admin') DEFAULT 'player',
    team_id int DEFAULT NULL,
    PRIMARY KEY (player_id),
    FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE SET NULL
);

-- Table team_member with prefixed columns
CREATE TABLE IF NOT EXISTS team_member (
    team_id int NOT NULL,
    player_id int NOT NULL,
    PRIMARY KEY (team_id, player_id),
    CONSTRAINT fk_team_member_team FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE CASCADE,
    CONSTRAINT fk_team_member_player FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE
);

-- Table rules with prefixed columns
CREATE TABLE IF NOT EXISTS rules (
    rules_id int NOT NULL AUTO_INCREMENT,
    rules_ruleSet text,
    activity_id int NOT NULL,
    PRIMARY KEY (rules_id),
    KEY idx_activity_id (activity_id),
    CONSTRAINT fk_rules_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS format_type (
    format_id INT NOT NULL AUTO_INCREMENT,
    format_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (format_id)
);

CREATE TABLE IF NOT EXISTS tournament_type (
    type_id INT NOT NULL AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (type_id)
);

-- Table tournament with prefixed columns
CREATE TABLE IF NOT EXISTS tournament (
    tournament_id int NOT NULL AUTO_INCREMENT,
    tournament_name varchar(50) NOT NULL,
    tournament_start_time datetime NOT NULL,
    tournament_bestOfX int DEFAULT NULL,
    tournament_poolSize int DEFAULT NULL,
    tournament_type_id int NOT NULL,
    format_id int DEFAULT 1,
    rule_id int NOT NULL,
    organizer_id int NOT NULL,
    PRIMARY KEY (tournament_id),
    KEY idx_rule_id (rule_id),
    KEY idx_organizer_id (organizer_id),
    CONSTRAINT fk_tournament_rules FOREIGN KEY (rule_id) REFERENCES rules (rules_id) ON DELETE CASCADE,
    CONSTRAINT fk_tournament_organizer FOREIGN KEY (organizer_id) REFERENCES player (player_id) ON DELETE CASCADE,
    CONSTRAINT fk_tournament_format FOREIGN KEY (format_id) REFERENCES format_type (format_id) ON DELETE CASCADE,
    CONSTRAINT fk_tournament_type FOREIGN KEY (tournament_type_id) REFERENCES tournament_type (type_id) ON DELETE CASCADE
);

-- Table favoriteactivity with prefixed columns
CREATE TABLE IF NOT EXISTS favoriteactivity (
    player_id int NOT NULL,
    activity_id int NOT NULL,
    PRIMARY KEY (player_id, activity_id),
    KEY idx_activity_id (activity_id),
    CONSTRAINT fk_favoriteactivity_player FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    CONSTRAINT fk_favoriteactivity_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);

-- Table matchs with prefixed columns
CREATE TABLE IF NOT EXISTS matchs (
    matchs_id int NOT NULL AUTO_INCREMENT,
    matchs_start_time datetime NOT NULL,
    matchs_status varchar(50) DEFAULT NULL,
    matchs_location varchar(50) DEFAULT NULL,
    tournament_id int NOT NULL,
    PRIMARY KEY (matchs_id),
    KEY idx_tournament_id (tournament_id),
    CONSTRAINT fk_matchs_tournament FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON DELETE CASCADE
);

-- Table register with prefixed columns
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

CREATE TABLE IF NOT EXISTS team_register (
    team_id INT NOT NULL,
    tournament_id INT NOT NULL,
    PRIMARY KEY (team_id, tournament_id),
    FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON DELETE CASCADE
);


-- Table results with prefixed columns
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

-- Table matchpairing with prefixed columns
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

-- Table ranking with prefixed columns
CREATE TABLE IF NOT EXISTS ranking (
    ranking_id INT NOT NULL AUTO_INCREMENT,
    tournament_id INT NOT NULL,
    player_id INT DEFAULT NULL,
    team_id INT DEFAULT NULL,
    ranking_points INT DEFAULT 0,
    ranking_ranking INT DEFAULT NULL,
    PRIMARY KEY (ranking_id),
    KEY idx_tournament_id (tournament_id),
    CONSTRAINT fk_ranking_tournament FOREIGN KEY (tournament_id) REFERENCES tournament(tournament_id) ON DELETE CASCADE,
    CONSTRAINT fk_ranking_player FOREIGN KEY (player_id) REFERENCES player(player_id) ON DELETE CASCADE,
    CONSTRAINT fk_ranking_team FOREIGN KEY (team_id) REFERENCES team(team_id) ON DELETE CASCADE
);

-- Table player_stats with prefixed columns
CREATE TABLE IF NOT EXISTS player_stats (
    player_id int NOT NULL,
    activity_id int NOT NULL,
    player_stats_total_matches int DEFAULT 0,
    player_stats_wins int DEFAULT 0,
    player_stats_losses int DEFAULT 0,
    player_stats_draws int DEFAULT 0,
    PRIMARY KEY (player_id, activity_id),
    CONSTRAINT fk_player_stats_player FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    CONSTRAINT fk_player_stats_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);

-- Table team_stats with prefixed columns
CREATE TABLE IF NOT EXISTS team_stats (
    team_id int NOT NULL,
    activity_id int NOT NULL,
    team_stats_total_matches int DEFAULT 0,
    team_stats_wins int DEFAULT 0,
    team_stats_losses int DEFAULT 0,
    team_stats_draws int DEFAULT 0,
    PRIMARY KEY (team_id, activity_id),
    CONSTRAINT fk_team_stats_team FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE CASCADE,
    CONSTRAINT fk_team_stats_activity FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tournament_round (
    round_id INT NOT NULL AUTO_INCREMENT,
    tournament_id INT NOT NULL,
    round_number INT NOT NULL,
    PRIMARY KEY (round_id),
    UNIQUE KEY unique_round (tournament_id, round_number),
    FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS debug_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255),
    tournament_id INT,
    activity_players INT,
    tournament_type_id INT,
    tournament_format VARCHAR(50),
    player_count INT,
    match_start_time DATETIME,
    matchs_id INT,
    player_id INT,
    team_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reward table
CREATE TABLE IF NOT EXISTS reward (
    reward_id INT NOT NULL AUTO_INCREMENT,
    reward_name VARCHAR(100) NOT NULL,
    reward_type ENUM('medal', 'trophy', 'points', 'badge') NOT NULL,
    reward_points INT DEFAULT 0,
    reward_description TEXT,
    PRIMARY KEY (reward_id)
);

CREATE TABLE IF NOT EXISTS reward_assignment (
    reward_assignment_id INT NOT NULL AUTO_INCREMENT,
    tournament_id INT NOT NULL,
    reward_id INT NOT NULL,
    player_id INT DEFAULT NULL,
    team_id INT DEFAULT NULL,
    award_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reward_assignment_id),
    FOREIGN KEY (tournament_id) REFERENCES tournament (tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (reward_id) REFERENCES reward (reward_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES player (player_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE CASCADE,
    CHECK ((player_id IS NOT NULL AND team_id IS NULL) OR (player_id IS NULL AND team_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS trigger_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    log_message VARCHAR(255),
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS player_tournament_queue (
    player_id INT,
    tournament_id INT,
    action VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS team_tournament_queue (
    team_id INT,
    tournament_id INT,
    action VARCHAR(10)
);
