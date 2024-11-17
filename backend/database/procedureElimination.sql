DROP PROCEDURE IF EXISTS GenerateEliminationBracket;

CREATE PROCEDURE GenerateEliminationBracket(
    p_tournament_id INT, 
    p_tournament_type_id INT -- 1 = Solo, 2 = Team
)
BEGIN
    DECLARE remaining_participants INT;
    DECLARE new_match_id INT;
    DECLARE participant1_id INT;
    DECLARE participant2_id INT;

    -- Temporary table to hold participants (player_id for solo, team_id for team)
    DROP TEMPORARY TABLE IF EXISTS temp_participants;
    IF p_tournament_type_id = 1 THEN
        -- Solo tournament
        CREATE TEMPORARY TABLE temp_participants AS
        SELECT DISTINCT player_id AS participant_id
        FROM register
        WHERE tournament_id = p_tournament_id AND team_id IS NULL;
    ELSEIF p_tournament_type_id = 2 THEN
        -- Team tournament
        CREATE TEMPORARY TABLE temp_participants AS
        SELECT DISTINCT team_id AS participant_id
        FROM register
        WHERE tournament_id = p_tournament_id AND team_id IS NOT NULL;
    END IF;

    -- Initial count of participants
    SELECT COUNT(*) INTO remaining_participants FROM temp_participants;

    INSERT INTO debug_log (message, tournament_id, player_count) VALUES ('participant_count', p_tournament_id,  remaining_participants);
    -- Main elimination loop
    main_loop: WHILE remaining_participants > 1 DO
        -- Handle special case for exactly two participants (final match)
        IF remaining_participants = 2 THEN
            -- Create a single final match
            INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
            VALUES (NOW(), 'Pending', 'Final Location', p_tournament_id);

            SET new_match_id = LAST_INSERT_ID();

            -- Pair the two remaining participants
            SELECT participant_id INTO participant1_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE participant_id = participant1_id;

            SELECT participant_id INTO participant2_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE participant_id = participant2_id;

            -- Insert pairings
            IF p_tournament_type_id = 1 THEN
                -- Solo: Use player_id
                INSERT INTO matchpairing (match_id, player_id)
                VALUES (new_match_id, participant1_id), (new_match_id, participant2_id);
            ELSE
                -- Team: Use team_id
                INSERT INTO matchpairing (match_id, team_id)
                VALUES (new_match_id, participant1_id), (new_match_id, participant2_id);
                INSERT INTO debug_log (message, tournament_id, player_id, team_id) VALUES ('participant_count', p_tournament_id,  participant1_id, participant2_id);
            END IF;

            -- Process the final match
            IF p_tournament_type_id = 1 THEN
                CALL UpdateIncompleteMatches(); -- Solo matches
            ELSE
                CALL UpdateIncompleteMatchesTeams(); -- Team matches
            END IF;

            -- Exit the loop as the tournament is concluded
            LEAVE main_loop;
        END IF;

        -- Regular elimination round (pair participants and create matches)
        WHILE (SELECT COUNT(*) FROM temp_participants) > 1 DO
            -- Create a new match
            INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
            VALUES (NOW(), 'Pending', 'Location TBD', p_tournament_id);

            SET new_match_id = LAST_INSERT_ID();

            -- Pair two participants for the match
            SELECT participant_id INTO participant1_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE participant_id = participant1_id;

            SELECT participant_id INTO participant2_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE participant_id = participant2_id;

            -- Insert pairings
            IF p_tournament_type_id = 1 THEN
                -- Solo: Use player_id
                INSERT INTO matchpairing (match_id, player_id)
                VALUES (new_match_id, participant1_id), (new_match_id, participant2_id);
            ELSE
                -- Team: Use team_id
                INSERT INTO matchpairing (match_id, team_id)
                VALUES (new_match_id, participant1_id), (new_match_id, participant2_id);
            END IF;
        END WHILE;

        -- Process the current round and update participants with winners
        IF p_tournament_type_id = 1 THEN
            CALL UpdateIncompleteMatches(); -- Solo matches
        ELSE
            CALL UpdateIncompleteMatchesTeams(); -- Team matches
        END IF;

        -- Refresh participants for the next round
        DROP TEMPORARY TABLE IF EXISTS temp_participants;
        IF p_tournament_type_id = 1 THEN
            -- Solo: Winners are players
            CREATE TEMPORARY TABLE temp_participants AS
            SELECT winner_player_id AS participant_id
            FROM results
            WHERE match_id IN (
                SELECT matchs_id 
                FROM matchs 
                WHERE tournament_id = p_tournament_id AND matchs_status = 'Ended'
            );
        ELSE
            -- Team: Winners are teams
            CREATE TEMPORARY TABLE temp_participants AS
            SELECT winner_team_id AS participant_id
            FROM results
            WHERE match_id IN (
                SELECT matchs_id 
                FROM matchs 
                WHERE tournament_id = p_tournament_id AND matchs_status = 'Ended'
            );
        END IF;

        -- Update remaining participants count
        SELECT COUNT(*) INTO remaining_participants FROM temp_participants;
    END WHILE;

    -- Clean up temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_participants;
END;
