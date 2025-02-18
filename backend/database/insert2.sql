-- insert2.sql

-- Insert Team Members
CALL InsertTeamMember(1, 1); -- Alice to Knights
CALL InsertTeamMember(2, 2); -- Bob to Knights
CALL InsertTeamMember(3, 3); -- Dave to Bishops
CALL InsertTeamMember(4, 4); -- Eve to Bishops

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
CALL InsertTournament('Catan Classic', '2024-04-30 12:00:00', 3, 16, 1, 1, 1, 3);
CALL InsertTournament('Risk Rumble', '2024-05-15 09:00:00', 3, 16, 2, 1, 2, 3);
CALL InsertTournament('Uno Challenge', '2024-06-20 10:00:00', 3, 4, 1, 1, 1, 3);
CALL InsertTournament('Ticket to Ride Tour', '2024-07-25 14:00:00', 3, 4, 2, 1, 3, 3); 
CALL InsertTournament('Pandemic Panic', '2024-08-30 12:00:00', 3, 4, 1, 1, 1, 3);
CALL InsertTournament('Carcassonne Clash', '2024-09-15 09:00:00', 3, 4, 2, 1, 2, 3);
CALL InsertTournament('Dominoes Duel', '2024-10-20 10:00:00', 3, 4, 1, 1, 1, 3);
CALL InsertTournament('Life Ladder', '2024-11-25 14:00:00', 3, 4, 2, 1, 3, 3);
CALL InsertTournament('Candy Land Challenge', '2024-12-30 12:00:00', 3, 4, 1, 1, 1, 3);
CALL InsertTournament('Sorry! Showdown', '2025-01-15 09:00:00', 3, 4, 2, 1, 2, 3);

-- Insert Tournament Rounds
CALL InsertTournamentRound(1, 1);
CALL InsertTournamentRound(1, 2);
CALL InsertTournamentRound(1, 3);

-- Insert Favorite Activities
CALL InsertFavoriteActivity(1, 1); -- Alice likes Chess
CALL InsertFavoriteActivity(2, 2); -- Bob likes Checkers
CALL InsertFavoriteActivity(3, 5); -- Carol likes Catan
CALL InsertFavoriteActivity(4, 6); -- Dave likes Risk
CALL InsertFavoriteActivity(5, 10); -- Eve likes Uno
CALL InsertFavoriteActivity(6, 11); -- Frank likes Ticket to Ride
CALL InsertFavoriteActivity(7, 12); -- Grace likes Pandemic
CALL InsertFavoriteActivity(8, 13); -- Hank likes Carcassonne
CALL InsertFavoriteActivity(9, 14); -- Iris likes Dominoes
CALL InsertFavoriteActivity(10, 15); -- Jack likes Life
CALL InsertFavoriteActivity(11, 16); -- Karen likes Candy Land
CALL InsertFavoriteActivity(12, 17); -- Louis likes Sorry!
CALL InsertFavoriteActivity(13, 18); -- Maria likes Stratego
CALL InsertFavoriteActivity(14, 19); -- Nathan likes Othello
CALL InsertFavoriteActivity(15, 20); -- Olivia likes Pictionary
CALL InsertFavoriteActivity(16, 3); -- Peter likes Monopoly
CALL InsertFavoriteActivity(17, 4); -- Quinn likes Scrabble
CALL InsertFavoriteActivity(18, 7); -- Rachel likes Clue
CALL InsertFavoriteActivity(19, 8); -- Sam likes Battleship
CALL InsertFavoriteActivity(20, 9); -- Tina likes Connect Four
CALL InsertFavoriteActivity(21, 1); -- Ursula likes Chess
CALL InsertFavoriteActivity(22, 2); -- Vince likes Checkers
CALL InsertFavoriteActivity(23, 5); -- Wendy likes Catan
CALL InsertFavoriteActivity(24, 6); -- Xander likes Risk
CALL InsertFavoriteActivity(25, 10); -- Yara likes Uno
CALL InsertFavoriteActivity(26, 11); -- Zane likes Ticket to Ride
CALL InsertFavoriteActivity(27, 12); -- Zoe likes Pandemic



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

INSERT INTO reward_assignment (tournament_id, reward_id, player_id, team_id)
VALUES
    (1, 1, 1, NULL), -- Gold Medal assigned to player 101 in tournament 1
    (1, 2, NULL, 1), -- Silver Trophy assigned to team 201 in tournament 1
    (2, 3, 2, NULL), -- Participation Points assigned to player 102 in tournament 2
    (3, 4, NULL, 2);

Select * from reward;
Select * from reward_assignment;