DELIMITER //

CREATE TRIGGER after_register_insert
AFTER INSERT ON register
FOR EACH ROW
BEGIN
    -- Récupérer le nombre de joueurs requis pour l'activité du tournoi
    SET @activity_players := (
        SELECT activity_number_of_players
        FROM activity
        WHERE activity_id = (SELECT activity_id FROM tournament WHERE tournament_id = NEW.tournament_id)
    );

    -- Récupérer le type de tournoi (solo ou team)
    SET @tournament_type := (
        SELECT tournament_type
        FROM tournament
        WHERE tournament_id = NEW.tournament_id
    );

    -- Vérifier si le nombre de joueurs dans le tournoi est suffisant
    SET @player_count := (
        SELECT COUNT(*)
        FROM register
        WHERE tournament_id = NEW.tournament_id
    );

    IF @player_count >= @activity_players THEN
        -- Si assez de joueurs sont inscrits, créer des matchs
        SET @match_start_time = NOW();

        -- Insérer un nouveau match dans la table matchs
        INSERT INTO matchs (matchs_start_time, matchs_status, matchs_location, tournament_id)
        VALUES (@match_start_time, 'Pending', 'Location TBD', NEW.tournament_id);

        -- Récupérer l'ID du match créé
        SET @matchs_id = LAST_INSERT_ID();

        -- Créer les paires de joueurs ou d'équipes en fonction du type de tournoi
        IF @tournament_type = 'solo' THEN
            -- Si tournoi de type solo, associer les joueurs aux matchs
            INSERT INTO matchpairing (match_id, player_id, team_id)
            SELECT @matchs_id, player_id, NULL
            FROM register
            WHERE tournament_id = NEW.tournament_id
            LIMIT @activity_players;
        ELSE
            -- Si tournoi de type team, associer les équipes aux matchs
            INSERT INTO matchpairing (match_id, player_id, team_id)
            SELECT @matchs_id, NULL, team_id
            FROM register
            WHERE tournament_id = NEW.tournament_id
            LIMIT @activity_players;
        END IF;
    END IF;
END//

DELIMITER ;
