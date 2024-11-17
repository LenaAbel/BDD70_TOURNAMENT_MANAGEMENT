DROP PROCEDURE IF EXISTS ProcessPlayerQueue;

CREATE PROCEDURE ProcessPlayerQueue()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE player_id INT;
    DECLARE tournament_id INT;
    DECLARE action VARCHAR(10);

    -- Cursor to process queued actions
    DECLARE queue_cursor CURSOR FOR
    SELECT player_id, tournament_id, action
    FROM player_tournament_queue;

    -- Handler for cursor end
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Open the cursor
    OPEN queue_cursor;

    queue_loop: LOOP
        -- Fetch the next queued action
        FETCH queue_cursor INTO player_id, tournament_id, action;

        IF done THEN
            LEAVE queue_loop;
        END IF;

        -- Process the action
        IF action = 'remove' THEN
            DELETE FROM register
            WHERE player_id = player_id
            AND tournament_id = tournament_id;
        END IF;

    END LOOP;

    -- Close the cursor
    CLOSE queue_cursor;

    -- Clear the queue after processing
    TRUNCATE TABLE player_tournament_queue;
END;
