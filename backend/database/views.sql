CREATE OR REPLACE VIEW meilleur_joueur_par_activité AS
SELECT
    a.activity_id,
    a.activity_name,
    ps.player_id,
    p.player_name,
    p.player_lastname,
    SUM(ps.player_stats_wins) AS total_wins
FROM
    activity a
JOIN
    player_stats ps ON a.activity_id = ps.activity_id
JOIN
    player p ON ps.player_id = p.player_id
GROUP BY
    a.activity_id, ps.player_id
ORDER BY
    a.activity_id, total_wins DESC;
