DELIMITER //
CREATE TRIGGER after_match_result
AFTER INSERT ON results
FOR EACH ROW
BEGIN
    DECLARE tournamentType ENUM('solo', 'team');
    DECLARE currentTournamentID INT;

    SET currentTournamentID = (SELECT tournament_id FROM matchs WHERE matchs_id = NEW.match_id);
    SET tournamentType = (SELECT tournament_type FROM tournament WHERE tournament_id = currentTournamentID);

    IF tournamentType = 'solo' AND NEW.winner_player_id IS NOT NULL THEN
        INSERT INTO reward_assignment (tournament_id, reward_id, player_id)
        VALUES (
            currentTournamentID,
            (SELECT reward_id FROM reward WHERE reward_type = 'points' LIMIT 1),
            NEW.winner_player_id
        );
    ELSEIF tournamentType = 'team' AND NEW.winner_team_id IS NOT NULL THEN
        INSERT INTO reward_assignment (tournament_id, reward_id, team_id)
        VALUES (
            currentTournamentID,
            (SELECT reward_id FROM reward WHERE reward_type = 'points' LIMIT 1),
            NEW.winner_team_id
        );
    END IF;
END //
DELIMITER //

DELIMITER //
CREATE EVENT IF NOT EXISTS auto_add_and_register_player
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    DECLARE new_email VARCHAR(128);
    DECLARE new_nickname VARCHAR(50);

    SET new_email = CONCAT('player', FLOOR(RAND() * 10000), '@example.com');
    SET new_nickname = CONCAT('player', FLOOR(RAND() * 10000));

    INSERT INTO player (
        player_email, player_name, player_lastname, player_nickname, player_password
    ) VALUES (
        new_email, 'Generated', 'Player', new_nickname, 'securepasswordhash'
    );

    SET @new_player_id = LAST_INSERT_ID();

    INSERT INTO register (player_id, tournament_id)
    VALUES (@new_player_id, 1)
    ON DUPLICATE KEY UPDATE player_id = player_id;
END //
DELIMITER //
CREATE DEFINER=`root`@`localhost` TRIGGER `update_stats_after_result`
AFTER INSERT ON `results`
FOR EACH ROW
BEGIN
    DECLARE is_draw BOOLEAN DEFAULT FALSE;

    -- Log trigger firing
    INSERT INTO trigger_log (log_message) VALUES ('update_stats_after_result triggered');

    -- Check if the match is a draw
    IF NEW.winner_score = NEW.loser_score THEN
        SET is_draw = TRUE;
    END IF;

    -- Update player stats if players are involved
    IF NEW.winner_player_id IS NOT NULL AND NEW.loser_player_id IS NOT NULL THEN
        UPDATE player_stats
        SET player_stats_total_matches = player_stats_total_matches + 1,
            player_stats_wins = player_stats_wins + IF(is_draw = FALSE, 1, 0),
            player_stats_draws = player_stats_draws + IF(is_draw = TRUE, 1, 0)
        WHERE player_id = NEW.winner_player_id AND activity_id = (
            SELECT activity_id FROM rules WHERE rules_id = (
                SELECT rule_id FROM tournament WHERE tournament_id = (
                    SELECT tournament_id FROM matchs WHERE matchs_id = NEW.match_id
                )
            )
        );

        UPDATE player_stats
        SET player_stats_total_matches = player_stats_total_matches + 1,
            player_stats_losses = player_stats_losses + IF(is_draw = FALSE, 1, 0),
            player_stats_draws = player_stats_draws + IF(is_draw = TRUE, 1, 0)
        WHERE player_id = NEW.loser_player_id AND activity_id = (
            SELECT activity_id FROM rules WHERE rules_id = (
                SELECT rule_id FROM tournament WHERE tournament_id = (
                    SELECT tournament_id FROM matchs WHERE matchs_id = NEW.match_id
                )
            )
        );
    END IF;

    -- Update team stats if teams are involved
    IF NEW.winner_team_id IS NOT NULL AND NEW.loser_team_id IS NOT NULL THEN
        UPDATE team_stats
        SET team_stats_total_matches = team_stats_total_matches + 1,
            team_stats_wins = team_stats_wins + IF(is_draw = FALSE, 1, 0),
            team_stats_draws = team_stats_draws + IF(is_draw = TRUE, 1, 0)
        WHERE team_id = NEW.winner_team_id AND activity_id = (
            SELECT activity_id FROM rules WHERE rules_id = (
                SELECT rule_id FROM tournament WHERE tournament_id = (
                    SELECT tournament_id FROM matchs WHERE matchs_id = NEW.match_id
                )
            )
        );

        UPDATE team_stats
        SET team_stats_total_matches = team_stats_total_matches + 1,
            team_stats_losses = team_stats_losses + IF(is_draw = FALSE, 1, 0),
            team_stats_draws = team_stats_draws + IF(is_draw = TRUE, 1, 0)
        WHERE team_id = NEW.loser_team_id AND activity_id = (
            SELECT activity_id FROM rules WHERE rules_id = (
                SELECT rule_id FROM tournament WHERE tournament_id = (
                    SELECT tournament_id FROM matchs WHERE matchs_id = NEW.match_id
                )
            )
        );
    END IF;
END //
DELIMITER ;