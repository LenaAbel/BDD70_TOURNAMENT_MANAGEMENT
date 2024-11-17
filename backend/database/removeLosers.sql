DROP PROCEDURE IF EXISTS RemoveLosers;

CREATE PROCEDURE RemoveLosers(
    IN p_loser_player_id INT,
    IN p_tournament_id INT
)
BEGIN
    -- Remove the loser from the tournament
    DELETE FROM register
    WHERE player_id = p_loser_player_id
    AND tournament_id = p_tournament_id;
END;
