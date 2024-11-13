// DELIMITER //
// CREATE TRIGGER after_register_insert
// AFTER INSERT ON register
// FOR EACH ROW
// BEGIN
//     -- Step 1: Get necessary data from activity and tournament
//     SET @activity_players := (
//         SELECT activity_number_of_players
//         FROM activity
//         WHERE activity_id = (SELECT activity_id FROM tournament WHERE tournament_id = NEW.tournament_id)
//     );

//     SET @tournament_type := (
//         SELECT tournament_type
//         FROM tournament
//         WHERE tournament_id = NEW.tournament_id
//     );

//     -- Step 2: Get the current round or initialize a new one
//     SET @current_round := (
//         SELECT MAX(round_number)
//         FROM tournament_round
//         WHERE tournament_id = NEW.tournament_id
//     );
    
//     IF @current_round IS NULL THEN
//         SET @current_round := 1;
//         INSERT INTO tournament_round (tournament_id, round_number) VALUES (NEW.tournament_id, @current_round);
//     END IF;

//     -- Step 3: Count players ready for pairing (either new or winners from last round)
//     SET @player_count := (
//         SELECT COUNT(*)
//         FROM register r
//         LEFT JOIN results res ON r.player_id = res.winner_player_id AND res.match_id IN (
//             SELECT m.matchs_id
//             FROM matchs m
//             JOIN tournament_round tr ON m.tournament_id = tr.tournament_id AND tr.round_number = @current_round - 1
//             WHERE m.tournament_id = NEW.tournament_id
//         )
//         WHERE r.tournament_id = NEW.tournament_id
//           AND (res.winner_player_id IS NOT NULL OR res.winner_player_id IS NULL)
//     );

//     IF @player_count >= @activity_players THEN
//         SET @match_start_time := NOW();

//         -- Insert a new match for the round
//         INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
//         VALUES (@match_start_time, 'Pending', 'Location TBD', NEW.tournament_id);

//         -- Get the new match ID
//         SET @match_id := LAST_INSERT_ID();

//         -- Step 4: Pair players based on the tournament type
//         IF @tournament_type = 'solo' THEN
//             -- Solo type: Pair individual players for the match
//             INSERT INTO matchpairing (match_id, player_id, team_id)
//             SELECT @match_id, player_id, NULL
//             FROM register r
//             LEFT JOIN results res ON r.player_id = res.winner_player_id AND res.match_id IN (
//                 SELECT m.matchs_id
//                 FROM matchs m
//                 JOIN tournament_round tr ON m.tournament_id = tr.tournament_id AND tr.round_number = @current_round - 1
//                 WHERE m.tournament_id = NEW.tournament_id
//             )
//             WHERE r.tournament_id = NEW.tournament_id
//               AND (res.winner_player_id IS NOT NULL OR res.winner_player_id IS NULL)
//             LIMIT @activity_players;
//         ELSE
//             -- Team type: Pair teams for the match
//             INSERT INTO matchpairing (match_id, player_id, team_id)
//             SELECT @match_id, NULL, team_id
//             FROM register r
//             LEFT JOIN results res ON r.team_id = res.winner_team_id AND res.match_id IN (
//                 SELECT m.matchs_id
//                 FROM matchs m
//                 JOIN tournament_round tr ON m.tournament_id = tr.tournament_id AND tr.round_number = @current_round - 1
//                 WHERE m.tournament_id = NEW.tournament_id
//             )
//             WHERE r.tournament_id = NEW.tournament_id
//               AND (res.winner_team_id IS NOT NULL OR res.winner_team_id IS NULL)
//             LIMIT @activity_players;
//         END IF;

//         -- Step 5: Update round if all match pairings are complete
//         INSERT INTO tournament_round (tournament_id, round_number)
//         VALUES (NEW.tournament_id, @current_round + 1);
//     END IF;
// END;
// //
// DELIMITER ;

DELIMITER //
CREATE TRIGGER after_match_result
AFTER INSERT ON results
FOR EACH ROW
BEGIN
    DECLARE tournamentType ENUM('solo', 'team');
    DECLARE currentTournamentID INT;

    -- Get the tournament ID and type for the match
    SET currentTournamentID = (SELECT tournament_id FROM matchs WHERE matchs_id = NEW.match_id);
    SET tournamentType = (SELECT tournament_type FROM tournament WHERE tournament_id = currentTournamentID);

    -- Award points to the winner based on tournament type
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
END;
//
DELIMITER ;

DELIMITER //
CREATE EVENT IF NOT EXISTS auto_add_and_register_player
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    DECLARE new_email VARCHAR(128);
    DECLARE new_nickname VARCHAR(50);

    -- Generate unique values for email and nickname
    SET new_email = CONCAT('player', FLOOR(RAND() * 10000), '@example.com');
    SET new_nickname = CONCAT('player', FLOOR(RAND() * 10000));

    -- Step 1: Insert a new player with generated details
    INSERT INTO player (
        player_email, player_name, player_lastname, player_nickname, player_password
    ) VALUES (
        new_email, 'Generated', 'Player', new_nickname, 'securepasswordhash'
    );

    -- Step 2: Get the ID of the newly created player
    SET @new_player_id = LAST_INSERT_ID();

    -- Step 3: Register the new player in tournament ID 1
    INSERT INTO register (player_id, tournament_id)
    VALUES (@new_player_id, 1)
    ON DUPLICATE KEY UPDATE player_id = player_id;

END;
//
DELIMITER ;
