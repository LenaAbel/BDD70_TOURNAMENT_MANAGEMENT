DROP PROCEDURE IF EXISTS UpdateIncompleteMatches;

CREATE PROCEDURE UpdateIncompleteMatches()
BEGIN
    DECLARE done INT DEFAULT 0;

    -- Process incomplete matches in batches
    WHILE EXISTS (SELECT 1 FROM matchs WHERE matchs_status != 'Completed' AND matchs_status != 'Ended') DO

        -- Select a random match with incomplete status
        SET @match_id = (
            SELECT matchs_id 
            FROM matchs 
            WHERE matchs_status != 'Completed' AND matchs_status != 'Ended' 
            LIMIT 1
        );

        -- Fetch players for this match
        SELECT 
            MAX(CASE WHEN rn = 1 THEN player_id END) AS player1_id,
            MAX(CASE WHEN rn = 2 THEN player_id END) AS player2_id
        INTO @player1_id, @player2_id
        FROM (
            SELECT player_id, ROW_NUMBER() OVER (ORDER BY matchpairing_id) AS rn
            FROM matchpairing
            WHERE match_id = @match_id
        ) ranked_players;

        -- Ensure valid and distinct players
        IF @player1_id IS NOT NULL AND @player2_id IS NOT NULL AND @player1_id != @player2_id THEN
            -- Decide winner and loser randomly
            IF RAND() > 0.5 THEN
                SET @winner_player_id = @player1_id;
                SET @loser_player_id = @player2_id;
            ELSE
                SET @winner_player_id = @player2_id;
                SET @loser_player_id = @player1_id;
            END IF;

            -- Get tournament ID from the match
            SELECT tournament_id INTO @tournament_id
            FROM matchs
            WHERE matchs_id = @match_id;

            -- Update match status to 'Ended'
            UPDATE matchs
            SET matchs_status = 'Ended'
            WHERE matchs_id = @match_id;

            -- Insert results
            INSERT INTO results (match_id, winner_player_id, loser_player_id)
            VALUES (@match_id, @winner_player_id, @loser_player_id);

            -- Queue loser for removal
            INSERT INTO player_tournament_queue (player_id, tournament_id, action)
            VALUES (@loser_player_id, @tournament_id, 'remove');
        ELSE
            -- Handle invalid matches
            UPDATE matchs
            SET matchs_status = 'Invalid'
            WHERE matchs_id = @match_id;
        END IF;
    END WHILE;
END;
