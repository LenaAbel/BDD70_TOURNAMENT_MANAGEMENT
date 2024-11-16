DROP PROCEDURE IF EXISTS UpdateIncompleteMatches;

CREATE PROCEDURE UpdateIncompleteMatches()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE match_id INT;
    DECLARE winner_player_id INT DEFAULT NULL;
    DECLARE winner_team_id INT DEFAULT NULL;
    DECLARE participant_count INT;

    -- Create a temporary table for incomplete matches
    CREATE TEMPORARY TABLE temp_matches2 AS
    SELECT matchs_id
    FROM matchs
    WHERE matchs_status != 'Completed' AND matchs_status != 'Ended';

    -- Loop through each match in the temporary table
    WHILE (SELECT COUNT(*) FROM temp_matches2) > 0 DO
        -- Get the first match_id from the temporary table
        SELECT matchs_id INTO match_id
        FROM temp_matches2
        LIMIT 1;

        -- Check if the match is player-based or team-based
        SELECT COUNT(*) INTO participant_count
        FROM matchpairing
        WHERE match_id = match_id;

        -- If it's a player-based match, select a random winner
        IF participant_count > 1 THEN
            SELECT player_id INTO winner_player_id
            FROM matchpairing
            WHERE match_id = match_id
            ORDER BY RAND()
            LIMIT 1;

            -- Set winner_team_id to NULL for player-based match
            SET winner_team_id = NULL;

        -- If it's a team-based match, select a random team as winner
        ELSE
            SELECT team_id INTO winner_team_id
            FROM matchpairing
            WHERE match_id = match_id
            ORDER BY RAND()
            LIMIT 1;

            -- Set winner_player_id to NULL for team-based match
            SET winner_player_id = NULL;
        END IF;

        -- Update the match status to 'Ended'
        UPDATE matchs
        SET matchs_status = 'Ended'
        WHERE matchs_id = match_id;

        -- Insert the result into the results table (using the appropriate winner ID)
        INSERT INTO results (match_id, winner_player_id, winner_team_id)
        VALUES (match_id, winner_player_id, winner_team_id);

        -- Remove the processed match from the temporary table
        DELETE FROM temp_matches2 WHERE matchs_id = match_id;
    END WHILE;

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_matches2;
END;
