// ==============================================
// SIDEBAR FUNCTIONS
// ==============================================
function switchTab(tabId) {
    // Update tabs
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.sidebar-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${tabId}-section`).classList.add('active');

    // If switching to chat, mark messages as read
    if (tabId === 'chat') {
        chatOpen = true;
        unreadMessages = 0;
        updateUnreadIndicator();
        lastReadTime = new Date();
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    } else {
        chatOpen = false;
    }
    if (tabId === "activity") {
        loadActivities();
    }
}

function updateUnreadIndicator() {
    const chatTabElement = document.querySelector('[data-tab="chat"]');
    if (unreadMessages > 0) {
        chatTabElement.classList.add('has-unread');
    } else {
        chatTabElement.classList.remove('has-unread');
    }
}

// ==============================================
// HOMEPAGE FUNCTIONS
// ==============================================
function homepage() {
    // Hide game zone if visible
    const gameZone = document.getElementById('game_zone');
    const gameZoneMobile = document.getElementById('game_zone_mobile');
    if (gameZone) {
        gameZone.style.display = 'none';
        gameZone.innerHTML = '';
    }
    if (gameZoneMobile) {
        gameZoneMobile.style.display = 'none';
        gameZoneMobile.innerHTML = '';
    }

    // Show games grid
    const gamesGrid = document.getElementById('games-grid');
    const gamesGridMobile = document.getElementById('games-grid-mobile');
    if (gamesGrid) {
        gamesGrid.style.display = 'grid';
    }
    if (gamesGridMobile) {
        gamesGridMobile.style.display = 'grid';
    }

    // Hide shop screens and show home content
    const dshop = document.getElementById('dshop');
    const dshopMobile = document.getElementById('dshop-mobile');
    if (dshop) dshop.style.display = 'none';
    if (dshopMobile) dshopMobile.style.display = 'none';

    const mobileHome = document.getElementById('mobile-home-display');
    const mobileShop = document.getElementById('mobile-shop-display');
    if (mobileHome) mobileHome.classList.add('active');
    if (mobileShop) mobileShop.classList.remove('active');
}

function loadGames() {
    const gamesGrid = document.getElementById('games-grid') || document.getElementById('games-grid-mobile');
    if (!gamesGrid) return;
    
    const games = [
        { name: 'Block Blast', file: 'blockBlast.html', icon: 'fa-cubes' },
        { name: 'Bubbles', file: 'bubbles.html', icon: 'fa-circle' },
        { name: 'Checkers', file: 'checkers.html', icon: 'fa-chess-board' },
        { name: 'Connect 4', file: 'connect4.html', icon: 'fa-circle-dot' },
        { name: 'Minesweeper', file: 'minesweeper.html', icon: 'fa-bomb' },
        { name: 'Numbers', file: 'numbers.html', icon: 'fa-calculator' },
        { name: 'Queens', file: 'queens.html', icon: 'fa-crown' },
        { name: 'Sudoku', file: 'soduku.html', icon: 'fa-grid-3x3' },
        { name: 'Tetris', file: 'tetris.html', icon: 'fa-shapes' },
        { name: 'Tic Tac Toe', file: 'ticTacToe.html', icon: 'fa-hashtag' },
        { name: 'Tower', file: 'tower.html', icon: 'fa-building' },
        { name: 'Wordle', file: 'wordle.html', icon: 'fa-spell-check' }
    ];
    
    gamesGrid.innerHTML = '';
    
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-card-img">
                <i class="fas ${game.icon}"></i>
            </div>
            <div class="game-card-content">
                <h3>${game.name}</h3>
            </div>
        `;
        gameCard.onclick = () => openGame(game.file);
        gamesGrid.appendChild(gameCard);
    });
}

function openGame(gameFile) {
    const gameZone = document.getElementById('game_zone') || document.getElementById('game_zone_mobile');
    const gamesGrid = document.getElementById('games-grid') || document.getElementById('games-grid-mobile');
    
    if (gamesGrid) gamesGrid.style.display = 'none';
    if (gameZone) {
        gameZone.style.display = 'block';
        gameZone.style.width = '100%';
        gameZone.style.height = '80vh';
        gameZone.innerHTML = `
            <iframe src="games/${gameFile}" frameborder="0" style="width: 100%; height: 100%; border-radius: 10px;"></iframe>
        `;
    }
}
