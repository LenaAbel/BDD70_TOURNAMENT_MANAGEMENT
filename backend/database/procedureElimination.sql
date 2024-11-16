DROP PROCEDURE IF EXISTS GenerateEliminationBracket;

CREATE PROCEDURE GenerateEliminationBracket(
    p_tournament_id INT, 
    p_tournament_type_id INT
)
BEGIN
    DECLARE remaining_players INT;
    DECLARE match_id INT;
    DECLARE match_count INT DEFAULT 0;
    DECLARE current_player_id INT;
    DECLARE current_team_id INT;

    -- Temporary table to hold participants
    CREATE TEMPORARY TABLE temp_participants AS
    SELECT player_id, team_id
    FROM register
    WHERE tournament_id = p_tournament_id;

    -- Log fetched data for debugging
    INSERT INTO debug_log (message) 
    SELECT CONCAT('Fetched participants: player_id=', player_id, ', team_id=', team_id)
    FROM temp_participants;

    -- Count remaining players
    SELECT COUNT(*) INTO remaining_players FROM temp_participants;
    INSERT INTO debug_log (message, tournament_id, player_count) 
    VALUES ('Retrieved remaining players', p_tournament_id, remaining_players);

    -- If only 2 players, create a single match
    IF remaining_players = 2 THEN
        SET match_count = 0;

        -- Create a single match
        INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
        VALUES (NOW(), 'Pending', 'Location TBD', p_tournament_id);
        SET match_id = LAST_INSERT_ID();

        -- Add participants to the matchpairing table
        WHILE (SELECT COUNT(*) FROM temp_participants) > 0 DO
            SELECT player_id, team_id
            INTO current_player_id, current_team_id
            FROM temp_participants
            LIMIT 1;

            -- Insert into matchpairing
            IF p_tournament_type_id = 1 THEN
                INSERT INTO matchpairing (match_id, player_id)
                VALUES (match_id, current_player_id);
            ELSE
                INSERT INTO matchpairing (match_id, team_id)
                VALUES (match_id, current_team_id);
            END IF;

            -- Remove processed player
            DELETE FROM temp_participants WHERE player_id = current_player_id;

            -- Log progress
            INSERT INTO debug_log (message, tournament_id, player_id, team_id) 
            VALUES ('Processed participant', p_tournament_id, current_player_id, current_team_id);
        END WHILE;
    ELSE
        -- Standard elimination logic for more than 2 players
        WHILE remaining_players > 1 DO
            SET match_count = 0;

            -- Create matches for the round
            WHILE (SELECT COUNT(*) FROM temp_participants) > 0 DO
                -- Insert a new match
                IF match_count = 0 THEN
                    INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
                    VALUES (NOW(), 'Pending', 'Location TBD', p_tournament_id);
                    SET match_id = LAST_INSERT_ID();
                END IF;

                -- Fetch a player for the current match
                SELECT player_id, team_id
                INTO current_player_id, current_team_id
                FROM temp_participants
                LIMIT 1;

                -- Insert into matchpairing
                IF p_tournament_type_id = 1 THEN
                    INSERT INTO matchpairing (match_id, player_id)
                    VALUES (match_id, current_player_id);
                ELSE
                    INSERT INTO matchpairing (match_id, team_id)
                    VALUES (match_id, current_team_id);
                END IF;

                -- Remove processed player
                DELETE FROM temp_participants WHERE player_id = current_player_id;

                SET match_count = match_count + 1;

                -- Log pairing
                INSERT INTO debug_log (message, tournament_id, player_id, team_id, matchs_id) 
                VALUES ('Round pairing created', p_tournament_id, current_player_id, current_team_id, match_id);

                -- Reset match count after 2 participants
                IF match_count = 2 THEN
                    SET match_count = 0;
                END IF;
            END WHILE;

            -- Reduce players by half
            SET remaining_players = CEIL(remaining_players / 2);
        END WHILE;
    END IF;

    -- Drop the temporary table
    DROP TEMPORARY TABLE temp_participants;
END;
