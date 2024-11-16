DROP TRIGGER IF EXISTS after_register_insert;

CREATE TRIGGER after_register_insert
AFTER INSERT ON register
FOR EACH ROW
BEGIN
    DECLARE activity_players INT;
    DECLARE type_id INT;
    DECLARE tournament_format int;
    DECLARE player_count INT;
    DECLARE new_id_tournament INT;

    -- Set the NEW.tournament_id for use in the trigger
    SET new_id_tournament = NEW.tournament_id;

    -- Log the value of new_id_tournament
    INSERT INTO debug_log (message, tournament_type_id) VALUES ('new_id_tournament value', new_id_tournament);

    -- Retrieve tournament details (type, format, and required players)
    SELECT tournament_type_id INTO type_id
    FROM tournament 
    WHERE tournament_id = new_id_tournament;

    INSERT INTO debug_log (message, tournament_id, tournament_type_id) VALUES ('Retrieved tournament type', new_id_tournament, type_id);

    SELECT format_id INTO tournament_format
    FROM tournament 
    WHERE tournament_id = new_id_tournament;

    -- Log the retrieved tournament details
    INSERT INTO debug_log (message, tournament_id, tournament_type_id, tournament_format) 
    VALUES ('Retrieved tournament details', new_id_tournament, type_id, tournament_format);

    -- Get the required number of players for the activity
    SELECT activity_number_of_players INTO activity_players
    FROM activity
    WHERE activity_id = (SELECT activity_id FROM rules WHERE rules_id = 
                         (SELECT rule_id FROM tournament WHERE tournament_id = new_id_tournament));

    -- Log the retrieved activity_players
    INSERT INTO debug_log (message, tournament_id, activity_players) VALUES ('Retrieved activity_players', new_id_tournament, activity_players);

    -- Count current registered players
    SELECT COUNT(*) INTO player_count FROM register WHERE tournament_id = new_id_tournament;

    -- Log the retrieved player_count
    INSERT INTO debug_log (message, tournament_id, player_count) VALUES ('Retrieved player_count', new_id_tournament, player_count);

    IF player_count >= activity_players THEN
        -- Log that the condition is met
        INSERT INTO debug_log (message, tournament_id) VALUES ('Condition player_count >= activity_players met', new_id_tournament);

        -- Select the correct bracket generation procedure based on the format
        IF tournament_format  = 1 THEN
            -- Log before calling the procedure
            INSERT INTO debug_log (message, tournament_id) VALUES ('Calling GenerateEliminationBracket', new_id_tournament);

            -- Call the procedure to generate the elimination bracket
            CALL GenerateEliminationBracket(new_id_tournament, type_id);

            -- Log after calling the procedure
            INSERT INTO debug_log (message, tournament_id) VALUES ('Called GenerateEliminationBracket', new_id_tournament);
        ELSEIF tournament_format = 2 THEN
            CALL GenerateRoundRobinBracket(new_id_tournament, type_id);
        ELSEIF tournament_format = 3 THEN
            CALL GenerateSwissBracket(new_id_tournament, type_id);
        END IF;
    END IF;
END;