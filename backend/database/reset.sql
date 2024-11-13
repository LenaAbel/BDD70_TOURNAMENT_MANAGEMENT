SET FOREIGN_KEY_CHECKS = 0;

-- Drop dependent tables first to avoid foreign key conflicts
DROP TABLE IF EXISTS team_member;
DROP TABLE IF EXISTS player_stats;
DROP TABLE IF EXISTS team_stats;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS matchpairing;
DROP TABLE IF EXISTS ranking;
DROP TABLE IF EXISTS register;
DROP TABLE IF EXISTS matchs;
DROP TABLE IF EXISTS favoriteactivity;
DROP TABLE IF EXISTS tournament_round;
DROP TABLE IF EXISTS tournament;
DROP TABLE IF EXISTS rules;
DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS debug_log;

SET FOREIGN_KEY_CHECKS = 1;
