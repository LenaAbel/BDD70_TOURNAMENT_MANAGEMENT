-- insert2.sql

-- Insert Team Members
CALL InsertTeamMember(1, 1); -- Alice to Knights
CALL InsertTeamMember(1, 2); -- Bob to Knights
CALL InsertTeamMember(2, 4); -- Dave to Bishops

CALL InsertTournamentType('solo');
CALL InsertTournamentType('team');

-- Insert FormatsType
CALL InsertFormatType('elimination');
CALL InsertFormatType('round_robin');
CALL InsertFormatType('swiss');



-- Insert Tournaments
CALL InsertTournament('Chess Championship', '2024-01-15 09:00:00', 3, 16, 1, 1, 1, 3);
CALL InsertTournament('Team Scrabble Tournament', '2024-02-20 10:00:00', NULL, 8, 2, 2, 4, 3);
CALL InsertTournament('Monopoly Masters', '2024-03-25 14:00:00', 3, 16, 2, 1, 3, 3);

-- Insert Tournament Rounds
CALL InsertTournamentRound(1, 1);
CALL InsertTournamentRound(1, 2);
CALL InsertTournamentRound(1, 3);

-- Insert Favorite Activities
CALL InsertFavoriteActivity(1, 1); -- Alice likes Chess
CALL InsertFavoriteActivity(2, 2); -- Bob likes Checkers
CALL InsertFavoriteActivity(3, 5); -- Carol likes Catan

-- Insert Matches


-- Insert Register records
CALL InsertRegister(1, NULL, 1); -- Alice registers for Chess Championship
CALL InsertRegister(2, NULL, 1); -- Bob registers for Chess Championship
CALL InsertRegister(4, 2, 2);    -- Dave registers with team Bishops for Scrabble Tournament

-- Insert Results


-- Insert Match Pairings


-- Insert Rankings
CALL InsertRanking(1, 1, NULL, 10, 1); -- Alice ranks first in tournament 1
CALL InsertRanking(1, 2, NULL, 5, 2);  -- Bob ranks second in tournament 1

-- Insert Player Stats
CALL InsertPlayerStats(1, 1, 10, 7, 3, 0); -- Alice's stats in Chess
CALL InsertPlayerStats(2, 1, 10, 5, 5, 0); -- Bob's stats in Chess

-- Insert Team Stats
CALL InsertTeamStats(1, 4, 15, 10, 5, 0); -- Knights' stats in Scrabble
CALL InsertTeamStats(2, 4, 15, 8, 7, 0);  -- Bishops' stats in Scrabble


-- Insert a medal reward
CALL InsertReward('Gold Medal', 'medal', 0, 'Awarded to the top player or team in a tournament.');
CALL InsertReward('Champion Trophy', 'trophy', 0, 'Given to the winner of the championship.');
CALL InsertReward('Participation Points', 'points', 100, 'Awarded for participation in a tournament.');
CALL InsertReward('Top Scorer Badge', 'badge', 0, 'Given to the player with the highest score in a tournament.');
