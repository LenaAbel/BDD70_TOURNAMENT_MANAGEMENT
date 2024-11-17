-- Insert Activities
CALL InsertActivity('Chess', 2, 'solo', 'A strategy board game played between two players on an 8x8 grid.', 'Strategy');
CALL InsertActivity('Checkers', 2, 'solo', 'A simple game where two players try to capture each other\'s pieces.', 'Classic');
CALL InsertActivity('Monopoly', 2, 'team', 'Players compete to buy, trade, and build properties to bankrupt opponents.', 'Economic');
CALL InsertActivity('Scrabble', 2, 'solo', 'A word game where players score points by creating words from letter tiles.', 'Word');
CALL InsertActivity('Catan', 3, 'team', 'Players collect resources and build roads, settlements, and cities to gain points.', 'Strategy');
CALL InsertActivity('Risk', 2, 'team', 'A game of world domination where players control armies to conquer territories.', 'Strategy');
CALL InsertActivity('Clue', 3, 'solo', 'A mystery game where players solve a murder by identifying the culprit, weapon, and room.', 'Mystery');
CALL InsertActivity('Battleship', 2, 'solo', 'A guessing game where players try to sink each other\'s ships.', 'Strategy');
CALL InsertActivity('Connect Four', 2, 'solo', 'A game where players aim to connect four of their discs in a row.', 'Classic');
CALL InsertActivity('Uno', 2, 'team', 'A fast-paced card game where players try to get rid of all their cards.', 'Card');
CALL InsertActivity('Ticket to Ride', 2, 'solo', 'A game where players collect train cards to claim railway routes across the map.', 'Adventure');
CALL InsertActivity('Pandemic', 4, 'team', 'Players work together to stop the spread of diseases around the world.', 'Cooperative');
CALL InsertActivity('Carcassonne', 2, 'solo', 'A tile-placement game where players build a medieval landscape and score points.', 'Strategy');
CALL InsertActivity('Dominoes', 2, 'solo', 'A classic game where players connect tiles with matching numbers.', 'Classic');
CALL InsertActivity('Life', 4, 'team', 'Players navigate through life stages from college to retirement.', 'Family');
CALL InsertActivity('Candy Land', 4, 'team', 'A simple racing game where players move along a colorful path.', 'Kids');
CALL InsertActivity('Sorry!', 4, 'team', 'Players try to move their pieces around the board and return to the home base.', 'Classic');
CALL InsertActivity('Stratego', 2, 'solo', 'A strategy game where players capture the enemy flag.', 'Strategy');
CALL InsertActivity('Othello', 2, 'solo', 'A game where players flip discs to have the most of their color on the board.', 'Classic');
CALL InsertActivity('Pictionary', 4, 'team', 'A drawing and guessing game where teams compete to identify sketches.', 'Party');
-- Insert Rules with activity IDs
CALL InsertRule('The game is played on an 8x8 board with pieces moving in specific ways.', 1);  -- Chess
CALL InsertRule('Players move pieces diagonally and capture opponent pieces by jumping over them.', 2);  -- Checkers
CALL InsertRule('Players roll two dice to move around the board and can buy properties they land on.', 3);  -- Monopoly
CALL InsertRule('Players create words on the board using letter tiles to score points.', 4);  -- Scrabble
CALL InsertRule('Players collect resources to build roads, settlements, and cities.', 5);  -- Catan
CALL InsertRule('Players control armies to conquer territories and eliminate opponents.', 6);  -- Risk
CALL InsertRule('Players must deduce the murderer, weapon, and location of the murder.', 7);  -- Clue
CALL InsertRule('Players hide their ships on a grid and take turns guessing coordinates.', 8);  -- Battleship
CALL InsertRule('Players take turns dropping colored discs into a grid to connect four in a row.', 9);  -- Connect Four
CALL InsertRule('Players aim to be the first to play all their cards by matching colors or numbers.', 10);  -- Uno
CALL InsertRule('Players collect cards to claim railway routes across the board.', 11);  -- Ticket to Ride
CALL InsertRule('Players work together to stop outbreaks of diseases worldwide.', 12);  -- Pandemic
CALL InsertRule('Players place tiles to build cities, roads, and fields for points.', 13);  -- Carcassonne
CALL InsertRule('Players match tiles with the same number and aim to play all their tiles.', 14);  -- Dominoes
CALL InsertRule('Players navigate through life stages and can make life choices along the way.', 15);  -- Life
CALL InsertRule('Players draw cards to move along a colorful path to reach the end.', 16);  -- Candy Land
CALL InsertRule('Players aim to move their pieces around the board to reach home.', 17);  -- Sorry!
CALL InsertRule('Players set up pieces and attempt to capture the opponent\'s flag.', 18);  -- Stratego
CALL InsertRule('Players aim to have the majority of their color discs on the board by flipping opponent discs.', 19);  -- Othello
CALL InsertRule('Teams take turns drawing clues for their teammates to guess the word or phrase.', 20);  -- Pictionary
-- Insert Teams
CALL InsertTeam('Knights');
CALL InsertTeam('Bishops');
CALL InsertTeam('Rooks');
CALL InsertTeam('Pawns');
CALL InsertTeam('Queens');


-- Insert Tournaments
CALL InsertTournament('Chess Championship', '2024-01-15 09:00:00', 3, 16, 1, 'elimination', 1, 3);
CALL InsertTournament('Team Scrabble Tournament', '2024-02-20 10:00:00', NULL, 8, 2, 'round_robin', 4, 3);
CALL InsertTournament('Monopoly Masters', '2024-03-25 14:00:00', 3, 16, 2 , 'elimination', 3, 3);

-- Insert Tournament rounds
CALL InsertTournamentRound(1, 1);
CALL InsertTournamentRound(1, 2);
CALL InsertTournamentRound(1, 3);

-- Insert Favorite Activities
CALL InsertFavoriteActivity(1, 1); -- Alice likes Chess
CALL InsertFavoriteActivity(2, 2); -- Bob likes Checkers
CALL InsertFavoriteActivity(3, 5); -- Carol likes Catan

CALL InsertMatch('2024-01-15 09:00:00', 'Scheduled', 'Main Hall', 1);
CALL InsertMatch('2024-01-15 10:00:00', 'Scheduled', 'Main Hall', 1);

CALL InsertRegister(1, NULL, 1); -- Alice registers for Chess Championship
CALL InsertRegister(2, NULL, 1); -- Bob registers for Chess Championship
CALL InsertRegister(4, 2, 2);    -- Dave registers with team Bishops for Scrabble Tournament

CALL InsertResult(1, 1, 2, NULL, NULL, 1, 0); -- Alice wins over Bob in match 1

CALL InsertMatchPairing(1, 1, NULL); -- Alice in match 1
CALL InsertMatchPairing(1, 2, NULL); -- Bob in match 1

CALL InsertRanking(1, 1, NULL, 10, 1); -- Alice ranks first in tournament 1
CALL InsertRanking(1, 2, NULL, 5, 2);  -- Bob ranks second in tournament 1

CALL InsertPlayerStats(1, 1, 10, 7, 3, 0); -- Alice's stats in Chess
CALL InsertPlayerStats(2, 1, 10, 5, 5, 0); -- Bob's stats in Chess

CALL InsertTeamStats(1, 4, 15, 10, 5, 0); -- Knights' stats in Scrabble
CALL InsertTeamStats(2, 4, 15, 8, 7, 0);  -- Bishops' stats in Scrabble

CALL InsertRegister(1, NULL, 1); -- Alice registers solo
CALL InsertRegister(4, 2, 2);    -- Dave registers with team Bishops
