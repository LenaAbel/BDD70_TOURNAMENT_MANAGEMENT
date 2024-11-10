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


CREATE OR REPLACE VIEW meilleur_equipe_par_activité AS
SELECT
    a.activity_id,
    a.activity_name,
    ts.team_id,
    t.team_name,
    SUM(ts.team_stats_wins) AS total_wins
FROM
    activity a
JOIN
    team_stats ts ON a.activity_id = ts.activity_id
JOIN
    team t ON ts.team_id = t.team_id
GROUP BY
    a.activity_id, ts.team_id
ORDER BY
    a.activity_id, total_wins DESC;
