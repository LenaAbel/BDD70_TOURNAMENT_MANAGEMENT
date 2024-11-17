DROP TRIGGER IF EXISTS after_teamregister_insert;

CREATE TRIGGER after_teamregister_insert
AFTER INSERT ON team_register
FOR EACH ROW
BEGIN
    DECLARE activity_players INT;
    DECLARE type_id INT; -- Elimination Type (1 = Solo, 2 = Team)
    DECLARE p_format_id INT; -- Tournament Format (1 = Elimination, 2 = Round Robin, 3 = Swiss)
    DECLARE participant_count INT;
    DECLARE new_id_tournament INT;

    -- Set the NEW.tournament_id for use in the trigger
    SET new_id_tournament = NEW.tournament_id;

    -- Retrieve tournament type and format
    SELECT tournament_type_id, format_id INTO type_id, p_format_id
    FROM tournament 
    WHERE tournament_id = new_id_tournament;
    
    INSERT INTO debug_log (message, tournament_id) VALUES ('Trigger started', NEW.tournament_id);

    -- Get the required number of participants for the activity
    SELECT activity_number_of_players INTO activity_players
    FROM activity
    WHERE activity_id = (SELECT activity_id FROM rules WHERE rules_id = 
                         (SELECT rule_id FROM tournament WHERE tournament_id = new_id_tournament));

    -- Count current participants based on the type_id (1 = Solo, 2 = Team)
    IF type_id = 1 THEN -- Solo elimination tournament
        SELECT COUNT(*) INTO participant_count 
        FROM register 
        WHERE tournament_id = new_id_tournament AND team_id IS NULL;
    ELSEIF type_id = 2 THEN -- Team elimination tournament
        SELECT COUNT(DISTINCT team_id) INTO participant_count 
        FROM team_register 
        WHERE tournament_id = new_id_tournament;
    END IF;

    INSERT INTO debug_log (message, tournament_id) VALUES (CONCAT('participant_count: ', participant_count), new_id_tournament);

    -- If sufficient participants are registered, generate the bracket
    IF participant_count >= activity_players THEN
        INSERT INTO debug_log (message, tournament_id) VALUES ('Generating bracket', new_id_tournament);
        
        IF p_format_id = 1 THEN -- Elimination format
            INSERT INTO debug_log (message, tournament_id) VALUES ('Elimination format is 1', new_id_tournament);
            
            IF type_id = 1 THEN -- Solo elimination
                -- Log before calling the procedure
                INSERT INTO debug_log (message, tournament_id) 
                VALUES ('Calling GenerateEliminationBracket for Solo', new_id_tournament);

                -- Call the procedure to generate the elimination bracket for solo
                CALL GenerateEliminationBracket(new_id_tournament, 1);

                -- Log after calling the procedure
                INSERT INTO debug_log (message, tournament_id) 
                VALUES ('Called GenerateEliminationBracket for Solo', new_id_tournament);
            ELSEIF type_id = 2 THEN -- Team elimination
                -- Log before calling the procedure
                INSERT INTO debug_log (message, tournament_id) 
                VALUES ('Calling GenerateEliminationBracket for Teams', new_id_tournament);

                -- Call the procedure to generate the elimination bracket for teams
                CALL GenerateEliminationBracket(new_id_tournament, 2);

                -- Log after calling the procedure
                INSERT INTO debug_log (message, tournament_id) 
                VALUES ('Called GenerateEliminationBracket for Teams', new_id_tournament);
            END IF;
        ELSEIF p_format_id = 2 THEN -- Round Robin format
            -- Log before calling the procedure
            INSERT INTO debug_log (message, tournament_id) 
            VALUES ('Calling GenerateRoundRobinBracket', new_id_tournament);

            -- Call the procedure to generate the round robin bracket
            CALL GenerateRoundRobinBracket(new_id_tournament, type_id);

            -- Log after calling the procedure
            INSERT INTO debug_log (message, tournament_id) 
            VALUES ('Called GenerateRoundRobinBracket', new_id_tournament);
        ELSEIF p_format_id = 3 THEN -- Swiss format
            -- Log before calling the procedure
            INSERT INTO debug_log (message, tournament_id) 
            VALUES ('Calling GenerateSwissBracket', new_id_tournament);

            -- Call the procedure to generate the Swiss bracket
            CALL GenerateSwissBracket(new_id_tournament, type_id);

            -- Log after calling the procedure
            INSERT INTO debug_log (message, tournament_id) 
            VALUES ('Called GenerateSwissBracket', new_id_tournament);
        END IF;
    END IF;
END;
