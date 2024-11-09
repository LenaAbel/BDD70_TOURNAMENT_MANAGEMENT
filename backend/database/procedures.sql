-- Change the delimiter to $$
DELIMITER $$

CREATE PROCEDURE InsertActivity (
    IN activity_name VARCHAR(255),
    IN activity_number_of_players INT,
    IN activity_type VARCHAR(50),
    IN activity_description TEXT,
    IN category VARCHAR(50)
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            -- Handle the exception
            SELECT 'Activity insertion failed or already exists';
        END;

    INSERT INTO activity (
        activity_name, activity_number_of_players, activity_type, activity_description, activity_category
    )
    VALUES (
               activity_name, activity_number_of_players, activity_type, activity_description, category
           );
END $$

CREATE PROCEDURE InsertRule (
    IN rule_set TEXT,
    IN activity_id INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Rule insertion failed or already exists';
        END;

    INSERT INTO rules (
        rules_ruleSet, activity_id
    )
    VALUES (
               rule_set, activity_id
           );
END $$

CREATE PROCEDURE InsertTeam (
    IN team_name VARCHAR(50)
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Team insertion failed or already exists';
        END;

    INSERT INTO team (
        team_name
    )
    VALUES (
               team_name
           );
END $$

CREATE PROCEDURE InsertPlayer (
    IN player_email VARCHAR(128),
    IN player_name VARCHAR(50),
    IN player_lastname VARCHAR(50),
    IN player_nickname VARCHAR(50),
    IN player_password VARCHAR(256),
    IN player_account_type VARCHAR(10),
    IN team_id INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Player insertion failed or already exists';
        END;

    INSERT INTO player (
        player_email, player_name, player_lastname, player_nickname,
        player_password, player_account_type, team_id
    )
    VALUES (
               player_email, player_name, player_lastname, player_nickname,
               player_password, player_account_type, team_id
           );
END $$

CREATE PROCEDURE InsertTeamMember (
    IN team_id INT,
    IN player_id INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Team member insertion failed or already exists';
        END;

    INSERT INTO team_member (
        team_id, player_id
    )
    VALUES (
               team_id, player_id
           );
END $$

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
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Tournament insertion failed or already exists';
        END;

    INSERT INTO tournament (
        tournament_name, tournament_start_time, tournament_bestOfX,
        tournament_poolSize, tournament_type, tournament_format, rule_id, organizer_id
    )
    VALUES (
               tournament_name, tournament_start_time, tournament_bestOfX,
               tournament_poolSize, tournament_type, tournament_format, rule_id, organizer_id
           );
END $$

CREATE PROCEDURE InsertTournamentRound (
    IN tournament_id INT,
    IN round_number INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Tournament round insertion failed or already exists';
        END;

    INSERT INTO tournament_round (
        tournament_id, round_number
    )
    VALUES (
               tournament_id, round_number
           );
END $$

CREATE PROCEDURE InsertFavoriteActivity (
    IN player_id INT,
    IN activity_id INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Favorite activity insertion failed or already exists';
        END;

    INSERT INTO favoriteactivity (
        player_id, activity_id
    )
    VALUES (
               player_id, activity_id
           );
END $$

CREATE PROCEDURE InsertMatch (
    IN matchs_start_time DATETIME,
    IN matchs_status VARCHAR(50),
    IN matchs_location VARCHAR(50),
    IN tournament_id INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Match insertion failed or already exists';
        END;

    INSERT INTO matchs (
        matchs_start_time, matchs_status, matchs_location, tournament_id
    )
    VALUES (
               matchs_start_time, matchs_status, matchs_location, tournament_id
           );
END $$

CREATE PROCEDURE InsertRegister (
    IN player_id INT,
    IN team_id INT,
    IN tournament_id INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Registration insertion failed or already exists';
        END;

    INSERT INTO register (
        player_id, team_id, tournament_id
    )
    VALUES (
               player_id, team_id, tournament_id
           );
END $$

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
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Result insertion failed or already exists';
        END;

    INSERT INTO results (
        match_id, winner_player_id, loser_player_id,
        winner_team_id, loser_team_id, winner_score, loser_score
    )
    VALUES (
               match_id, winner_player_id, loser_player_id,
               winner_team_id, loser_team_id, winner_score, loser_score
           );
END $$

CREATE PROCEDURE InsertMatchPairing (
    IN match_id INT,
    IN player_id INT,
    IN team_id INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Match pairing insertion failed or already exists';
        END;

    INSERT INTO matchpairing (
        match_id, player_id, team_id
    )
    VALUES (
               match_id, player_id, team_id
           );
END $$

CREATE PROCEDURE InsertRanking (
    IN tournament_id INT,
    IN player_id INT,
    IN team_id INT,
    IN ranking_points INT,
    IN ranking_ranking INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Ranking insertion failed or already exists';
        END;

    INSERT INTO ranking (
        tournament_id, player_id, team_id, ranking_points, ranking_ranking
    )
    VALUES (
               tournament_id, player_id, team_id, ranking_points, ranking_ranking
           );
END $$

CREATE PROCEDURE InsertPlayerStats (
    IN player_id INT,
    IN activity_id INT,
    IN player_stats_total_matches INT,
    IN player_stats_wins INT,
    IN player_stats_losses INT,
    IN player_stats_draws INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Player stats insertion failed or already exists';
        END;

    INSERT INTO player_stats (
        player_id, activity_id, player_stats_total_matches,
        player_stats_wins, player_stats_losses, player_stats_draws
    )
    VALUES (
               player_id, activity_id, player_stats_total_matches,
               player_stats_wins, player_stats_losses, player_stats_draws
           );
END $$

CREATE PROCEDURE InsertTeamStats (
    IN team_id INT,
    IN activity_id INT,
    IN team_stats_total_matches INT,
    IN team_stats_wins INT,
    IN team_stats_losses INT,
    IN team_stats_draws INT
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SELECT 'Team stats insertion failed or already exists';
        END;

    INSERT INTO team_stats (
        team_id, activity_id, team_stats_total_matches,
        team_stats_wins, team_stats_losses, team_stats_draws
    )
    VALUES (
               team_id, activity_id, team_stats_total_matches,
               team_stats_wins, team_stats_losses, team_stats_draws
           );
END $$

-- Revert back to the default delimiter
DELIMITER ;
