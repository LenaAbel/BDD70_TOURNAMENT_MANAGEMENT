DROP PROCEDURE IF EXISTS GenerateEliminationBracketTeam;

CREATE PROCEDURE GenerateEliminationBracketTeam(
    p_tournament_id INT, 
    p_tournament_type_id INT
)
BEGIN
    DECLARE remaining_teams INT;
    DECLARE new_match_id INT;
    DECLARE team1_id INT;
    DECLARE team2_id INT;

    -- Temporary table to hold participating teams
    DROP TEMPORARY TABLE IF EXISTS temp_participants;
    CREATE TEMPORARY TABLE temp_participants AS
    SELECT DISTINCT team_id
    FROM team_register
    WHERE tournament_id = p_tournament_id AND team_id IS NOT NULL;

    -- Initial count of participating teams
    SELECT COUNT(*) INTO remaining_teams FROM temp_participants;

    -- Main elimination loop
    main_loop: WHILE remaining_teams > 1 DO
        -- Handle special case for exactly two teams (final match)
        IF remaining_teams = 2 THEN
            -- Create a single final match
            INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
            VALUES (NOW(), 'Pending', 'Final Location', p_tournament_id);

            SET new_match_id = LAST_INSERT_ID();

            -- Pair the two remaining teams
            SELECT team_id INTO team1_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE team_id = team1_id;

            SELECT team_id INTO team2_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE team_id = team2_id;

            -- Insert pairings
            INSERT INTO matchpairing (match_id, team_id)
            VALUES (new_match_id, team1_id), (new_match_id, team2_id);

            -- Process the final match
            CALL UpdateIncompleteMatchesTeams();

            -- Exit the loop as the tournament is concluded
            LEAVE main_loop;
        END IF;

        -- Regular elimination round (pair teams and create matches)
        WHILE (SELECT COUNT(*) FROM temp_participants) > 1 DO
            -- Create a new match
            INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
            VALUES (NOW(), 'Pending', 'Location TBD', p_tournament_id);

            SET new_match_id = LAST_INSERT_ID();

            -- Pair two teams for the match
            SELECT team_id INTO team1_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE team_id = team1_id;

            SELECT team_id INTO team2_id FROM temp_participants LIMIT 1;
            DELETE FROM temp_participants WHERE team_id = team2_id;

            -- Insert pairings
            INSERT INTO matchpairing (match_id, team_id)
            VALUES (new_match_id, team1_id), (new_match_id, team2_id);
        END WHILE;

        -- Process the current round and update participants with winning teams
        CALL UpdateIncompleteMatchesTeams();

        -- Refresh participants for the next round
        DROP TEMPORARY TABLE IF EXISTS temp_participants;
        CREATE TEMPORARY TABLE temp_participants AS
        SELECT winner_team_id AS team_id
        FROM results
        WHERE match_id IN (
            SELECT matchs_id 
            FROM matchs 
            WHERE tournament_id = p_tournament_id AND matchs_status = 'Ended'
        );

        -- Update remaining teams count
        SELECT COUNT(*) INTO remaining_teams FROM temp_participants;
    END WHILE;

    -- Clean up temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_participants;
END;
