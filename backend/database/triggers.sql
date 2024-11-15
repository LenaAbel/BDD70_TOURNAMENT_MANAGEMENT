DROP TRIGGER IF EXISTS after_register_insert;

CREATE TRIGGER after_register_insert
AFTER INSERT ON register
FOR EACH ROW
BEGIN
    DECLARE activity_players INT;
    DECLARE tournament_type VARCHAR(50);
    DECLARE player_count INT;
    DECLARE match_start_time DATETIME;
    DECLARE matchs_id INT;
    DECLARE new_id_tournament INT;

    -- Assign the NEW.tournament_id to new_id_tournament
    SET new_id_tournament = NEW.tournament_id;

    -- Log the value of NEW.tournament_id
    INSERT INTO debug_log (message, tournament_id) 
    VALUES ('Inserted tournament_id', new_id_tournament);

    -- Récupérer le nombre de joueurs requis pour l'activité du tournoi via la règle associée
    SELECT activity_number_of_players INTO activity_players
    FROM activity
    WHERE activity_id = (
        SELECT activity_id
        FROM rules
        WHERE rules_id = (
            SELECT rule_id
            FROM tournament
            WHERE tournament_id = new_id_tournament
        )
    );

    -- Log the retrieved activity_players
    INSERT INTO debug_log (message, tournament_id, activity_players) 
    VALUES ('Retrieved activity_players', new_id_tournament, activity_players);

    -- Récupérer le type de tournoi (solo ou team)
    SELECT tournament_type INTO tournament_type
    FROM tournament
    WHERE tournament_id = new_id_tournament;

    -- Log the retrieved tournament_type
    INSERT INTO debug_log (message, tournament_id, tournament_type) 
    VALUES ('Retrieved tournament_type', new_id_tournament, tournament_type);

    -- Vérifier si le nombre de joueurs dans le tournoi est suffisant
    SELECT COUNT(*) INTO player_count
    FROM register
    WHERE tournament_id = new_id_tournament;

    -- Log the retrieved player_count
    INSERT INTO debug_log (message, tournament_id, player_count) 
    VALUES ('Retrieved player_count', new_id_tournament, player_count);

    IF player_count >= activity_players THEN
        -- Si assez de joueurs sont inscrits, créer des matchs
        SET match_start_time = NOW();

        -- Insérer un nouveau match dans la table matchs
        INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
        VALUES (match_start_time, 'Pending', 'Location TBD', new_id_tournament);

        -- Récupérer l'ID du match créé
        SET matchs_id = LAST_INSERT_ID();

        -- Log the created match ID
        INSERT INTO debug_log (message, tournament_id, matchs_id) 
        VALUES ('Created match', new_id_tournament, matchs_id);

        -- Créer les paires de joueurs ou d'équipes en fonction du type de tournoi
        IF tournament_type = 'solo' THEN
            -- Si tournoi de type solo, associer les joueurs aux matchs
            INSERT INTO matchpairing (match_id, player_id, team_id)
            SELECT matchs_id, player_id, NULL
            FROM register
            WHERE tournament_id = new_id_tournament
            ORDER BY player_id;

            -- Log the player_id and team_id
            INSERT INTO debug_log (message, tournament_id, player_id, team_id) 
            SELECT 'Player paired', new_id_tournament, player_id, NULL
            FROM register
            WHERE tournament_id = new_id_tournament
            ORDER BY player_id
            LIMIT activity_players;
        ELSE
            -- Si tournoi de type team, associer les équipes aux matchs
            INSERT INTO matchpairing (match_id, player_id, team_id)
            SELECT matchs_id, player_id, team_id
            FROM register
            WHERE tournament_id = new_id_tournament
            ORDER BY team_id
            LIMIT activity_players;

            -- Log the player_id and team_id
            INSERT INTO debug_log (message, tournament_id, player_id, team_id) 
            SELECT 'Team paired', new_id_tournament, NULL, team_id
            FROM register
            WHERE tournament_id = new_id_tournament
            ORDER BY team_id
            LIMIT activity_players;
        END IF;
    END IF;
END;
