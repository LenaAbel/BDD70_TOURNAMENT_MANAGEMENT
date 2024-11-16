DROP PROCEDURE IF EXISTS GenerateEliminationBracket;

CREATE PROCEDURE GenerateEliminationBracket(
    p_tournament_id INT,
    p_tournament_type_id INT
)
BEGIN
    DECLARE remaining_players INT;
    DECLARE new_match_id INT;
    DECLARE player1_id INT;
    DECLARE player2_id INT;
    DECLARE exit_loop BOOLEAN DEFAULT FALSE;

    -- Temporary table to hold participants
    DROP TEMPORARY TABLE IF EXISTS temp_participants;
    CREATE TEMPORARY TABLE temp_participants AS
    SELECT player_id
    FROM register
    WHERE tournament_id = p_tournament_id;

    -- Initial count of participants
    SELECT COUNT(*) INTO remaining_players FROM temp_participants;

    -- Main elimination loop
    WHILE NOT exit_loop DO
        -- Handle special case for exactly two players (final match)
        IF remaining_players = 2 THEN
            -- Create a single final match
            INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
            VALUES (NOW(), 'Pending', 'Final Location', p_tournament_id);

            SET new_match_id = LAST_INSERT_ID();

            -- Pair the two remaining players
            SELECT player_id INTO player1_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE player_id = player1_id;

            SELECT player_id INTO player2_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE player_id = player2_id;

            -- Insert pairings
            INSERT INTO matchpairing (match_id, player_id)
            VALUES (new_match_id, player1_id), (new_match_id, player2_id);

            -- Process the final match
            CALL UpdateIncompleteMatches();

            -- Exit the loop as the tournament is concluded
            SET exit_loop = TRUE;
        ELSE
            -- Regular elimination round (pair players and create matches)
            WHILE (SELECT COUNT(*) FROM temp_participants) > 1 DO
                -- Create a new match
                INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
                VALUES (NOW(), 'Pending', 'Location TBD', p_tournament_id);

                SET new_match_id = LAST_INSERT_ID();

                -- Pair two players for the match
                SELECT player_id INTO player1_id FROM temp_participants LIMIT 1;
                DELETE FROM temp_participants WHERE player_id = player1_id;

                SELECT player_id INTO player2_id FROM temp_participants LIMIT 1;
                DELETE FROM temp_participants WHERE player_id = player2_id;

                -- Insert pairings
                INSERT INTO matchpairing (match_id, player_id)
                VALUES (new_match_id, player1_id), (new_match_id, player2_id);
            END WHILE;

            -- Process the current round and update participants with winners
            CALL UpdateIncompleteMatches();

            -- Refresh participants for the next round
            DROP TEMPORARY TABLE IF EXISTS temp_participants;
            CREATE TEMPORARY TABLE temp_participants AS
            SELECT winner_player_id AS player_id
            FROM results
            WHERE match_id IN (
                SELECT matchs_id 
                FROM matchs 
                WHERE tournament_id = p_tournament_id AND matchs_status = 'Ended'
            );

            -- Update remaining players count
            SELECT COUNT(*) INTO remaining_players FROM temp_participants;

            -- Check if we should exit the loop
            IF remaining_players <= 1 THEN
                SET exit_loop = TRUE;
            END IF;
        END IF;
    END WHILE;

    -- Clean up temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_participants;
END;
