-- name: GetPlayerTournamentActionCounts :many
SELECT 
    ma.type::text AS type,
    COUNT(*) AS count
FROM match_actions ma
JOIN matches m ON ma.match_id = m.id
WHERE ma.actor_id = @actor_id 
  AND m.tournament_id = @tournament_id
GROUP BY ma.type;

-- name: GetMaxTournamentActionCounts :many
SELECT 
    t.type::text AS type,
    MAX(t.action_count) AS max_count
FROM (
    SELECT 
        ma.actor_id, 
        ma.type, 
        COUNT(*) AS action_count
    FROM match_actions ma
    JOIN matches m ON ma.match_id = m.id
    WHERE m.tournament_id = @tournament_id
    GROUP BY ma.actor_id, ma.type
) t
GROUP BY t.type;

-- name: GetPlayerTournamentMatchStats :many
SELECT
    m.id AS match_id,
    m.date,
    COUNT(*) FILTER (WHERE ma.type = 'grab')     AS grab,
    COUNT(*) FILTER (WHERE ma.type = 'move')     AS move,
    COUNT(*) FILTER (WHERE ma.type = 'steal')    AS steal,
    COUNT(*) FILTER (WHERE ma.type = 'knockout') AS knockout,
    COUNT(*) FILTER (WHERE ma.type = 'score')    AS score
FROM matches m
JOIN match_actions ma
    ON ma.match_id = m.id
   AND ma.actor_id = @actor_id
WHERE m.tournament_id = @tournament_id
GROUP BY m.id, m.date
ORDER BY m.date ASC;