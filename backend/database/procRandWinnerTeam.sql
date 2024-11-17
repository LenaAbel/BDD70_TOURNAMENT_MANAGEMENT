DROP PROCEDURE IF EXISTS UpdateIncompleteMatchesTeams;

CREATE PROCEDURE UpdateIncompleteMatchesTeams()
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

        -- Fetch teams for this match
        SELECT 
            MAX(CASE WHEN rn = 1 THEN team_id END) AS team1_id,
            MAX(CASE WHEN rn = 2 THEN team_id END) AS team2_id
        INTO @team1_id, @team2_id
        FROM (
            SELECT team_id, ROW_NUMBER() OVER (ORDER BY matchpairing_id) AS rn
            FROM matchpairing
            WHERE match_id = @match_id
        ) ranked_teams;

        -- Ensure valid and distinct teams
        IF @team1_id IS NOT NULL AND @team2_id IS NOT NULL AND @team1_id != @team2_id THEN
            -- Decide winner and loser randomly
            IF RAND() > 0.5 THEN
                SET @winner_team_id = @team1_id;
                SET @loser_team_id = @team2_id;
            ELSE
                SET @winner_team_id = @team2_id;
                SET @loser_team_id = @team1_id;
            END IF;

            -- Get tournament ID from the match
            SELECT tournament_id INTO @tournament_id
            FROM matchs
            WHERE matchs_id = @match_id;

            -- Update match status to 'Ended'
            UPDATE matchs
            SET matchs_status = 'Ended'
            WHERE matchs_id = @match_id;

            -- Insert results with team details
            INSERT INTO results (match_id, winner_team_id, loser_team_id)
            VALUES (@match_id, @winner_team_id, @loser_team_id);

            -- Queue losing team for removal
            INSERT INTO player_tournament_queue (team_id, tournament_id, action)
            VALUES (@loser_team_id, @tournament_id, 'remove');
        ELSE
            -- Handle invalid matches
            UPDATE matchs
            SET matchs_status = 'Invalid'
            WHERE matchs_id = @match_id;
        END IF;
    END WHILE;
END;
