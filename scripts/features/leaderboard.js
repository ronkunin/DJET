// ==============================================
// GAMES CONFIGURATION
// ==============================================
const gamesConfig = {
    "tetris": {
        id: "tetris",
        name: "טטריס",
        dataProperty: "tetris_max",
        gamesProperty: "tetris_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "שיא" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "queens": {
        id: "queens",
        name: "משחק המלכות",
        dataProperty: "Queens_Level",
        gamesProperty: null,
        formatScore: (score) => `רמה ${score}`,
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_level", name: "שלב" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "numbers": {
        id: "numbers",
        name: "2048",
        dataProperty: "numbers_max",
        gamesProperty: "numbers_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "שיא" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "blockBlast": {
        id: "blockBlast",
        name: "בלוקבלאסט",
        dataProperty: "blockblast_max",
        gamesProperty: "blockblast_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "שיא" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "minesweeper": {
        id: "minesweeper",
        name: "שולה המוקשים",
        dataProperty: "minesweeper_score",
        gamesProperty: "minesweeper_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "ניקוד" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "soduku": {
        id: "soduku",
        name: "סודוקו",
        dataProperty: "soduku_level",
        gamesProperty: null,
        formatScore: (score) => `רמה ${score}`,
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_level", name: "שלב" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "bubbles": {
        id: "bubbles",
        name: "Bubbles",
        dataProperty: "bubbles_max",
        gamesProperty: "bubbles_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "שיא" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "tower": {
        id: "tower",
        name: "מגדל בלוקים",
        dataProperty: "tower_max",
        gamesProperty: "tower_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "שיא" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "wordle": {
        id: "wordle",
        name: "וורדל",
        dataProperty: "wordle_games",
        gamesProperty: null,
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_level", name: "הצלחות" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "flappyJet": {
        id: "flappyJet",
        name: "flappyJet",
        dataProperty: "fluppyjet_max",
        gamesProperty: "fluppyjet_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "ניקוד" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "skyDome": {
        id: "skyDome",
        name: "כיפת ברזל",
        dataProperty: "skyDome_maxS",
        gamesProperty: "skyDome_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "ניקוד" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
    "longArm": {
        id: "longArm",
        name: "סנייק",
        dataProperty: "longArm_max",
        gamesProperty: "longArm_games",
        formatScore: (score) => score.toLocaleString(),
        columns: [
            { id: "position", name: "מיקום" },
            { id: "player", name: "שחקן" },
            { id: "unit", name: "יחידה" },
            { id: "max_score", name: "ניקוד" },
            { id: "games_played", name: "משחקים" },
            { id: "last_update", name: "פעילות אחרונה" }
        ]
    },
};
// Add current user to the players list
// ==============================================
// LEADERBOARDS VARIABLES
// ==============================================
let currentFilter = {
    game: 'tetris',
    unitFilter: 'all',
    sortBy: 'max_score'
};

// ==============================================
// GAME CONFIG FUNCTIONS
// ==============================================

function updateTableHeaders(gameId) {
    const gameConfig = gamesConfig[gameId];
    const tableHeader = document.getElementById('leaderboards-header');
    const tableHeaderMobile = document.getElementById('leaderboards-header-mobile');

    if (!gameConfig || !gameConfig.columns) {
        console.error(`No columns defined for game: ${gameId}`);
        return;
    }

    const createHeader = (headerElement) => {
        headerElement.innerHTML = '';
        const headerRow = document.createElement('tr');
        gameConfig.columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.name;
            headerRow.appendChild(th);
        });
        headerElement.appendChild(headerRow);
    };

    if (tableHeader) createHeader(tableHeader);
    if (tableHeaderMobile) createHeader(tableHeaderMobile);
}

// ==============================================
// LEADERBOARDS FUNCTIONS
// ==============================================


function filterPlayers() {
    let filtered = [...library_users];
    const gameConfig = gamesConfig[currentFilter.game];

    // Filter by game
    filtered = filtered.map(player => {
        let score = 0;
        let games = 0;

        // Get score based on game data property
        if (gameConfig.dataProperty) {
            score = player[gameConfig.dataProperty] || 0;
        }

        // Get games count if available
        if (gameConfig.gamesProperty) {
            games = player[gameConfig.gamesProperty] || 0;
        }

        return {
            ...player,
            currentScore: score,
            currentGames: games
        };
    }).filter(player => player.currentScore > 0);

    // Filter by unit
    if (currentFilter.unitFilter === 'my_unit') {
        filtered = filtered.filter(player => player.unit === user_details["unit"]);
    } else if (currentFilter.unitFilter === 'units_ranking') {
        // Group by units and calculate unit totals
        const unitsMap = {};

        filtered.forEach(player => {
            if (!unitsMap[player.unit]) {
                unitsMap[player.unit] = {
                    unit: player.unit,
                    totalScore: 0,
                    totalGames: 0,
                    playerCount: 0,
                    Modified: new Date(0)
                };
            }

            const unit = unitsMap[player.unit];
            unit.totalScore = Math.max(unit.totalScore, player.currentScore || 0);
            unit.totalGames += player.currentGames || 0;
            unit.playerCount++;

            if (player.Modified > unit.Modified) {
                unit.Modified = new Date(player.Modified);
            }
        });

        // Convert to array format for display
        filtered = Object.values(unitsMap).map(unit => ({
            username: `${unit.unit}`,
            unit: unit.unit,
            currentScore: unit.totalScore,
            currentGames: unit.totalGames,
            Modified: unit.Modified,
            isUnit: true
        }));
    }

    // Sort players
    filtered.sort((a, b) => {
        switch (currentFilter.sortBy) {
            case 'max_score':
                return (b.currentScore || 0) - (a.currentScore || 0);
            case 'games_played':
                return (b.currentGames || 0) - (a.currentGames || 0);
            case 'recent':
                const aModified = new Date(a.Modified);
                const bModified = new Date(b.Modified);
                return bModified - aModified;
            default:
                return 0;
        }
    });

    return filtered;
}

function updateLeaderboardsDisplay(filteredPlayers) {
    const tbody = document.getElementById('leaderboards-body');
    const tbodyMobile = document.getElementById('leaderboards-body-mobile');
    const noDataMessage = document.getElementById('no-data-message');
    const noDataMessageMobile = document.getElementById('no-data-message-mobile');
    const currentUserStats = document.getElementById('current-user-stats');
    const currentUserStatsMobile = document.getElementById('current-user-stats-mobile');
    const gameConfig = gamesConfig[currentFilter.game];

    // Function to update a tbody
    const updateTbody = (tbodyElement) => {
        // Clear table
        tbodyElement.innerHTML = '';

        if (filteredPlayers.length === 0) {
            if (noDataMessage) noDataMessage.style.display = 'block';
            if (noDataMessageMobile) noDataMessageMobile.style.display = 'block';
            if (currentUserStats) currentUserStats.style.display = 'none';
            if (currentUserStatsMobile) currentUserStatsMobile.style.display = 'none';
            return;
        }

        if (noDataMessage) noDataMessage.style.display = 'none';
        if (noDataMessageMobile) noDataMessageMobile.style.display = 'none';
        if (currentUserStats) currentUserStats.style.display = 'block';
        if (currentUserStatsMobile) currentUserStatsMobile.style.display = 'block';

        // Find current user's position
        let currentUserRank = 0;
        let currentUserScore = 0;
        let isCurrentUserInTop10 = false;

        // Get top 10 players for display
        const topPlayers = filteredPlayers.slice(0, 10);

        // Populate table with top 10 players
        topPlayers.forEach((player, index) => {
            const rank = index + 1;

            // Check if this is the current user
            if (!player.isUnit && player.username === user_details["username"]) {
                currentUserRank = rank;
                currentUserScore = player.currentScore || 0;
                isCurrentUserInTop10 = true;
            }

            const row = document.createElement('tr');
            if (!player.isUnit && player.username === user_details["username"]) {
                row.classList.add('current-user');
            }
            if (rank <= 3) {
                row.classList.add('top-three');
            }

            const playerScore = player.currentScore || 0;
            const playerGames = player.currentGames || 0;
            const lastActivity = formatTimeAgo(player.Modified);

            // Format score based on game configuration
            let scoreDisplay;
            if (gameConfig.formatScore) {
                scoreDisplay = gameConfig.formatScore(playerScore);
            } else {
                scoreDisplay = playerScore.toLocaleString();
            }

            // Build row HTML based on game configuration columns
            let rowHTML = '';

            if (gameConfig.id === 'queens' || gameConfig.id === 'soduku' || gameConfig.id === 'wordle') {
                // Special handling for Queens game (no games count)
                rowHTML = `
            <td>
                <div class="rank">${rank}</div>
            </td>
            <td>
                <div class="player-info">
                <div class="player-avatar">
                    ${player.isUnit ? player.username.substring(0, 2) : player.username.charAt(0)}
                </div>
                <div>
                    <div class="player-name">${player.isUnit ? player.username : player.username}</div>
                    ${!player.isUnit ? `<div class="player-unit">${player.unit}</div>` : ''}
                </div>
                </div>
            </td>
            <td>${player.unit}</td>
            <td>
                <span class="score-value">${scoreDisplay}</span>
            </td>
            <td>
                <span class="last-log">${lastActivity}</span>
            </td>
            `;
            } else {
                // Standard game format
                rowHTML = `
            <td>
                <div class="rank">${rank}</div>
            </td>
            <td>
                <div class="player-info">
                <div class="player-avatar">
                    ${player.isUnit ? player.username.substring(0, 2) : player.username.charAt(0)}
                </div>
                <div>
                    <div class="player-name">${player.isUnit ? player.username : player.username}</div>
                    ${!player.isUnit ? `<div class="player-unit">${player.unit}</div>` : ''}
                </div>
                </div>
            </td>
            <td>${player.unit}</td>
            <td>
                <span class="score-value">${scoreDisplay}</span>
            </td>
            <td>
                <span class="games-count">${playerGames}</span>
            </td>
            <td>
                <span class="last-log">${lastActivity}</span>
            </td>
            `;
            }

            row.innerHTML = rowHTML;
            tbodyElement.appendChild(row);
        });

        // If current user is not in top 10, find their actual rank
        if (!isCurrentUserInTop10) {
            const currentUserInFullList = filteredPlayers.find(player =>
                !player.isUnit && player.username === user_details["username"]
            );

            if (currentUserInFullList) {
                currentUserRank = filteredPlayers.findIndex(player =>
                    !player.isUnit && player.username === user_details["username"]
                ) + 1;
                currentUserScore = currentUserInFullList.currentScore || 0;
            }
        }

        // Update current user stats at bottom
        updateCurrentUserStats(currentUserRank, currentUserScore);
    };

    if (tbody) updateTbody(tbody);
    if (tbodyMobile) updateTbody(tbodyMobile);
}

function updateCurrentUserStats(rank, score) {
    const gameConfig = gamesConfig[currentFilter.game];

    const updateElement = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    updateElement('current-user-rank', rank);
    updateElement('current-user-rank-mobile', rank);
    updateElement('current-user-avatar', (user_details["username"]) ? user_details["username"].charAt(0) : "א");
    updateElement('current-user-avatar-mobile', (user_details["username"]) ? user_details["username"].charAt(0) : "א");
    updateElement('current-user-name', (user_details["username"]) ? user_details["username"] : "אורח");
    updateElement('current-user-name-mobile', (user_details["username"]) ? user_details["username"] : "אורח");
    updateElement('current-user-unit', (user_details["unit"]) ? user_details["unit"] : "המטה");
    updateElement('current-user-unit-mobile', (user_details["unit"]) ? user_details["unit"] : "המטה");

    let scoreDisplay;
    if (gameConfig.formatScore) {
        scoreDisplay = gameConfig.formatScore(score);
    } else {
        scoreDisplay = score.toLocaleString();
    }

    updateElement('current-user-score', scoreDisplay);
    updateElement('current-user-score-mobile', scoreDisplay);
}
function setLeaderboardsGame(gameName) {
    const gameSelect = document.getElementById('game-select');
    gameSelect.value = gameName;
    loadLeaderboards();
}

function loadLeaderboards() {
    // Check if library_users is loaded
    if (!library_users || library_users.length === 0) {
        setTimeout(loadLeaderboards, 500);
        return;
    }

    // Update current filter from UI - check for desktop or mobile elements
    const gameSelect = document.getElementById('game-select') || document.getElementById('game-select-mobile');
    const unitFilter = document.getElementById('unit-filter') || document.getElementById('unit-filter-mobile');
    const sortBy = document.getElementById('sort-by') || document.getElementById('sort-by-mobile');
    
    if (gameSelect) {
        currentFilter.game = gameSelect.value;
    }
    if (unitFilter) {
        currentFilter.unitFilter = unitFilter.value;
    }
    if (sortBy) {
        currentFilter.sortBy = sortBy.value;
    }

    // Update table headers based on selected game
    updateTableHeaders(currentFilter.game);

    // Filter players
    const filteredPlayers = filterPlayers();

    // Update display
    updateLeaderboardsDisplay(filteredPlayers);
}

function initializeLeaderboards() {
    // Populate game select dropdowns
    const gameSelect = document.getElementById('game-select');
    const gameSelectMobile = document.getElementById('game-select-mobile');
    
    const populateSelect = (selectElement) => {
        if (!selectElement) return;
        selectElement.innerHTML = '';
        Object.keys(gamesConfig).forEach(gameKey => {
            const game = gamesConfig[gameKey];
            const option = document.createElement('option');
            option.value = game.id;
            option.textContent = game.name;
            selectElement.appendChild(option);
        });
    };
    
    populateSelect(gameSelect);
    populateSelect(gameSelectMobile);
    
    // Event listeners - check if elements exist before adding listeners
    if (gameSelect) gameSelect.addEventListener('change', loadLeaderboards);
    if (gameSelectMobile) gameSelectMobile.addEventListener('change', loadLeaderboards);
    if (document.getElementById('unit-filter')) document.getElementById('unit-filter').addEventListener('change', loadLeaderboards);
    if (document.getElementById('unit-filter-mobile')) document.getElementById('unit-filter-mobile').addEventListener('change', loadLeaderboards);
    if (document.getElementById('sort-by')) document.getElementById('sort-by').addEventListener('change', loadLeaderboards);
    if (document.getElementById('sort-by-mobile')) document.getElementById('sort-by-mobile').addEventListener('change', loadLeaderboards);

    const leaderboardsLinks = document.querySelectorAll('#leaderboards-link, .leaderboards-link');
    leaderboardsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.innerWidth < 768 || document.body.classList.contains('mobile-layout')) {
                switchMobileDisplay('mobile-leaderboard-display');
            } else {
                openLeaderboards();
            }
        });
    });

    document.getElementById('close-leaderboards').addEventListener('click', closeLeaderboards);

    // Add keyboard support for closing
    document.addEventListener('keydown', (e) => {
        const leaderboardsModal = document.getElementById('leaderboards-modal');
        if (leaderboardsModal.classList.contains('active') && e.key === 'Escape') {
            closeLeaderboards();
        }
        if (document.getElementById('settings-modal').classList.contains('active') && e.key === 'Escape') {
            closeSettings();
        }
    });

    // Close when clicking outside
    document.getElementById('leaderboards-modal').addEventListener('click', (e) => {
        if (e.target.id === 'leaderboards-modal') {
            closeLeaderboards();
        }
    });
}
