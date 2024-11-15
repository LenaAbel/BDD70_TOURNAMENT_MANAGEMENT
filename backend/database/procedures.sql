-- Drop and create InsertActivity procedure
DROP PROCEDURE IF EXISTS InsertActivity;
CREATE PROCEDURE InsertActivity (
    IN activity_name VARCHAR(255),
    IN activity_number_of_players INT,
    IN activity_type VARCHAR(50),
    IN activity_description TEXT,
    IN category VARCHAR(50)
)
BEGIN
    INSERT INTO activity (
        activity_name, activity_number_of_players, activity_type, activity_description, activity_category
    )
    VALUES (
               activity_name, activity_number_of_players, activity_type, activity_description, category
           );
END;

-- Drop and create InsertRule procedure
DROP PROCEDURE IF EXISTS InsertRule;
CREATE PROCEDURE InsertRule (
    IN rule_set TEXT,
    IN activity_id INT
)
BEGIN
    INSERT INTO rules (
        rules_ruleSet, activity_id
    )
    VALUES (
               rule_set, activity_id
           );
END;

-- Drop and create InsertTeam procedure
DROP PROCEDURE IF EXISTS InsertTeam;
CREATE PROCEDURE InsertTeam (
    IN team_name VARCHAR(50)
)
BEGIN
    INSERT INTO team (
        team_name
    )
    VALUES (
               team_name
           );
END;

-- Drop and create InsertTeamMember procedure
DROP PROCEDURE IF EXISTS InsertTeamMember;
CREATE PROCEDURE InsertTeamMember (
    IN team_id INT,
    IN player_id INT
)
BEGIN
    INSERT INTO team_member (
        team_id, player_id
    )
    VALUES (
               team_id, player_id
           );
END;

-- Drop and create InsertTournament procedure
DROP PROCEDURE IF EXISTS InsertTournament;
CREATE PROCEDURE InsertTournament (
    IN tournament_name VARCHAR(50),
    IN tournament_start_time DATETIME,
    IN tournament_bestOfX INT,
    IN tournament_poolSize INT,
    IN tournament_type VARCHAR(10),
    IN tournament_format VARCHAR(20),
    IN rule_id INT,
    IN organizer_id INT
)
BEGIN
    INSERT INTO tournament (
        tournament_name, tournament_start_time, tournament_bestOfX,
        tournament_poolSize, tournament_type, tournament_format, rule_id, organizer_id
    )
    VALUES (
               tournament_name, tournament_start_time, tournament_bestOfX,
               tournament_poolSize, tournament_type, tournament_format, rule_id, organizer_id
           );
END;

-- Drop and create InsertTournamentRound procedure
DROP PROCEDURE IF EXISTS InsertTournamentRound;
CREATE PROCEDURE InsertTournamentRound (
    IN tournament_id INT,
    IN round_number INT
)
BEGIN
    INSERT INTO tournament_round (
        tournament_id, round_number
    )
    VALUES (
               tournament_id, round_number
           );
END;

-- Drop and create InsertFavoriteActivity procedure
DROP PROCEDURE IF EXISTS InsertFavoriteActivity;
CREATE PROCEDURE InsertFavoriteActivity (
    IN player_id INT,
    IN activity_id INT
)
BEGIN
    INSERT INTO favoriteactivity (
        player_id, activity_id
    )
    VALUES (
               player_id, activity_id
           );
END;

-- Drop and create InsertMatch procedure
DROP PROCEDURE IF EXISTS InsertMatch;
CREATE PROCEDURE InsertMatch (
    IN matchs_start_time DATETIME,
    IN matchs_status VARCHAR(50),
    IN matchs_location VARCHAR(50),
    IN tournament_id INT
)
BEGIN
    INSERT INTO matchs (
        matchs_start_time, matchs_status, matchs_location, tournament_id
    )
    VALUES (
               matchs_start_time, matchs_status, matchs_location, tournament_id
           );
END;

-- Drop and create InsertRegister procedure
DROP PROCEDURE IF EXISTS InsertRegister;
CREATE PROCEDURE InsertRegister (
    IN player_id INT,
    IN team_id INT,
    IN tournament_id INT
)
BEGIN
    INSERT INTO register (
        player_id, team_id, tournament_id
    )
    VALUES (
               player_id, team_id, tournament_id
           );
END;

-- Drop and create InsertResult procedure
DROP PROCEDURE IF EXISTS InsertResult;
CREATE PROCEDURE InsertResult (
    IN match_id INT,
    IN winner_player_id INT,
    IN loser_player_id INT,
    IN winner_team_id INT,
    IN loser_team_id INT,
    IN winner_score INT,
    IN loser_score INT
)
BEGIN
    INSERT INTO results (
        match_id, winner_player_id, loser_player_id,
        winner_team_id, loser_team_id, winner_score, loser_score
    )
    VALUES (
               match_id, winner_player_id, loser_player_id,
               winner_team_id, loser_team_id, winner_score, loser_score
           );
END;

-- Drop and create InsertMatchPairing procedure
DROP PROCEDURE IF EXISTS InsertMatchPairing;
CREATE PROCEDURE InsertMatchPairing (
    IN match_id INT,
    IN player_id INT,
    IN team_id INT
)
BEGIN
    INSERT INTO matchpairing (
        match_id, player_id, team_id
    )
    VALUES (
               match_id, player_id, team_id
           );
END;

-- Drop and create InsertRanking procedure
DROP PROCEDURE IF EXISTS InsertRanking;
CREATE PROCEDURE InsertRanking (
    IN tournament_id INT,
    IN player_id INT,
    IN team_id INT,
    IN ranking_points INT,
    IN ranking_ranking INT
)
BEGIN
    INSERT INTO ranking (
        tournament_id, player_id, team_id, ranking_points, ranking_ranking
    )
    VALUES (
               tournament_id, player_id, team_id, ranking_points, ranking_ranking
           );
END;

-- Drop and create InsertPlayerStats procedure
DROP PROCEDURE IF EXISTS InsertPlayerStats;
CREATE PROCEDURE InsertPlayerStats (
    IN player_id INT,
    IN activity_id INT,
    IN player_stats_total_matches INT,
    IN player_stats_wins INT,
    IN player_stats_losses INT,
    IN player_stats_draws INT
)
BEGIN
    INSERT INTO player_stats (
        player_id, activity_id, player_stats_total_matches,
        player_stats_wins, player_stats_losses, player_stats_draws
    )
    VALUES (
               player_id, activity_id, player_stats_total_matches,
               player_stats_wins, player_stats_losses, player_stats_draws
           );
END;

-- Drop and create InsertTeamStats procedure
DROP PROCEDURE IF EXISTS InsertTeamStats;
CREATE PROCEDURE InsertTeamStats (
    IN team_id INT,
    IN activity_id INT,
    IN team_stats_total_matches INT,
    IN team_stats_wins INT,
    IN team_stats_losses INT,
    IN team_stats_draws INT
)
BEGIN
    INSERT INTO team_stats (
        team_id, activity_id, team_stats_total_matches,
        team_stats_wins, team_stats_losses, team_stats_draws
    )
    VALUES (
               team_id, activity_id, team_stats_total_matches,
               team_stats_wins, team_stats_losses, team_stats_draws
           );
END;

DROP PROCEDURE IF EXISTS InsertReward;
CREATE PROCEDURE InsertReward (
    IN reward_name VARCHAR(100),
    IN reward_type ENUM('medal', 'trophy', 'points', 'badge'),
    IN reward_points INT,
    IN reward_description TEXT
)
BEGIN
    INSERT INTO reward (
        reward_name, reward_type, reward_points, reward_description
    )
    VALUES (
               reward_name, reward_type, reward_points, reward_description
           );
END;