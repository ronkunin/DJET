// =====================================================
// LAYOUT BUILDER - Dynamically builds PC or Phone layout
// =====================================================

const BREAKPOINT = 768; // Width threshold for mobile/desktop

function buildSite() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth < BREAKPOINT) {
        buildPhone();
    } else {
        buildPc();
    }
}

function buildPc() {
    const body = document.body;
    
    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar';
    sidebar.innerHTML = `
        <div class="logo" style="direction:ltr; padding: 12px; align-content: center; justify-content: center; align-items: center;" onclick="homepage();">
            <i class="fas fa-gamepad" aria-hidden="true" style="font-size:1.1em; color: var(--icon-color); filter: drop-shadow(0 0 8px rgb(154, 140, 255));"></i>
            <span style="background-clip:text; color:transparent; font-weight:800;">DJET</span>
        </div>

        <div class="sidebar-tabs">
            <button class="sidebar-tab active" data-tab="activity" onclick="switchTab('activity');" id="activity-but">
                <i class="fas fa-bolt"></i>
                <span>פעילות</span>
                <div class="unread-indicator"></div>
            </button>
            <button class="sidebar-tab" data-tab="chat" onclick="switchTab('chat');" id="chat-but">
                <i class="fas fa-comments"></i>
                <span>צ'אט</span>
                <div class="unread-indicator"></div>
            </button>
            <button class="sidebar-tab" data-tab="music" onclick="switchTab('music');" id="music-but">
                <i class="fas fa-music"></i>
                <span>מוזיקה</span>
                <div class="unread-indicator"></div>
            </button>
        </div>

        <div class="sidebar-content">
            <div class="sidebar-section active" id="activity-section">
                <div class="activity-section" id="activity-sec">
                    <div class="activity-header">
                        <i class="fas fa-bolt"></i>
                        <h4>פעילות בזמן אמת</h4>
                    </div>
                    <div class="activity-list" id="activity-list"></div>
                </div>
            </div>

            <div class="sidebar-section" id="chat-section">
                <div class="chat-section" id="chat-sec">
                    <div class="chat-header">
                        <i class="fas fa-comments"></i>
                        <h4>הצ'אט (הלא) מבצעי</h4>
                    </div>
                    <div class="chat-messages" id="chat-messages"></div>
                    <div class="gif-picker-container" id="gif-picker">
                        <div class="gif-picker-header">
                            <h5><i class="fas fa-images"></i> הדמויות שלך</h5>
                            <button class="close-gif-picker" id="close-gif-picker"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="owned-gifs-grid" id="owned-gifs-grid"></div>
                    </div>
                    <div class="chat-input-container">
                        <button class="send-gif-button" id="send-gif-button" title="שלח דמות"><i class="fas fa-theater-masks"></i></button>
                        <textarea class="chat-input" id="message-input" placeholder="הקלד הודעה..." rows="1"></textarea>
                        <button class="send-button" id="send-button"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>

            <div class="sidebar-section" id="music-section">
                <div class="activity-section" id="music-sec">
                    <div class="music-header">
                        <i class="fas fa-music"></i>
                        <h4>מוזיקה איכותית</h4>
                    </div>
                    <div class="nav_container" id="top_bar">
                        <nav id="top_nav" class="glass">
                            <div id="searchbox">
                                <div id="search_controls"><label id="search_icon" for="search" title="חיפוש"><i class="fa fa-search"></i></label></div>
                                <input id="search" name="search" oninput="show_results()" type="text" placeholder="חיפוש שיר או פלייליסט" autocomplete="off">
                            </div>
                        </nav>
                        <div id="results" class="result_box glass"></div>
                    </div>
                    <div id="inside_boxspotlights">
                        <h3 class="titleinleft">המומלצים</h3>
                        <ul id="highlight" style="max-height: 265px; overflow-y: hidden;"><div style="justify-content: center; align-items: center; display: flex; width: 100%; height: 100%; position: relative;"><div class="loader"></div></div></ul>
                        <h3 class="titleinleft">הפלייליסטים שלי</h3>
                        <ul id="myplaylists" style="max-height: 250px; overflow-y: hidden;"><div style="justify-content: center; align-items: center; display: flex; width: 100%; height: 100%; position: relative;"><div class="loader"></div></div></ul>
                    </div>
                    <div class="glass playbox" id="bot_nav">
                        <div id="song_title" class="song_title">DJET</div>
                        <div class="flex"><audio class="" id="timeline" controls src="https://ronkunin.github.io/DJET/scripts/features/music/DJET.mp3"></audio></div>
                        <div class="flex">
                            <div class="main_controls">
                                <div onclick="addLikedSong()" class="concon disable" id="like"><i class="fa fa-heart"></i></div>
                                <div onclick="playPrevius()" class="prev disable" id="button_prev"><i class="fa fa-backward-step"></i></div>
                                <div onclick="togglePlay()" class="play disable" id="button_play"><i class="fa fa-play"></i></div>
                                <div onclick="playNext()" class="next disable" id="button_next"><i class="fa fa-forward-step"></i></div>
                                <div onclick="create_playlist()" class="concon" id="plus"><i class="fa fa-circle-plus"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    `;
    
    // Create main content
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    mainContent.id = 'main-content';
    mainContent.innerHTML = getMainContentHTML();
    
    body.appendChild(sidebar);
    body.appendChild(mainContent);
}

function buildPhone() {
    const body = document.body;
    body.style.flexDirection = 'column';
    body.classList.add('mobile-layout');
    
    // Create simplified display structure for mobile
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.width = '100%';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    
    // Header
    const header = document.createElement('header');
    header.style.flexShrink = '0';
    header.innerHTML = getHeaderHTML();
    
    // Main display area
    const mainDisplay = document.createElement('div');
    mainDisplay.className = 'main-display-mobile';
    mainDisplay.id = 'main-display-mobile';
    mainDisplay.style.flex = '1';
    mainDisplay.style.overflowY = 'auto';
    mainDisplay.style.overflowX = 'hidden';
    mainDisplay.style.touchAction = 'pan-y';
    mainDisplay.innerHTML = getMobileDisplaysHTML();
    
    // Bottom navigation
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-nav';
    bottomNav.id = 'mobile-nav';
    bottomNav.style.flexShrink = '0';
    bottomNav.innerHTML = getBottomNavHTML();
    
    container.appendChild(header);
    container.appendChild(mainDisplay);
    container.appendChild(bottomNav);
    
    body.appendChild(container);
    setupMobileNavigationInteractions();
}

function getHeaderHTML() {
    return `
        <div class="nav-container glass">
            <div class="containerN">
                <nav>
                    <div class="header-left">
                        <div class="logo nav-logo" style="direction:ltr;" onclick="homepage();">
                            <i class="fas fa-gamepad" aria-hidden="true"></i>
                            <span>DJET</span>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="streak-counter" id="streak-counter">
                            <i class="fas fa-fire" id="streak-icon"></i>
                            <div class="streak-info">
                                <span class="streak-days" id="streak-days">0</span>
                                <span class="streak-label" id="streak-label">רצף יומי</span>
                            </div>
                            <div class="streak-details" id="streak-details" dir="rtl">
                                <div id="streak-title"></div>
                                <div id="streak-status"></div>
                                <div id="streak-warning"></div>
                            </div>
                        </div>
                        <div class="dcoins-counter" id="dcoins-counter">
                            <i class="fas fa-coins"></i>
                            <div class="dcoins-info">
                                <span class="dcoins-amount" id="dcoins-amount">500</span>
                                <span class="dcoins-label">DCoins</span>
                            </div>
                            <div class="dcoins-details" id="dcoins-details" dir="rtl">
                                <h4><i class="fas fa-coins"></i> DCoins שלך</h4>
                                <p class="dcoins-explanation">
                                    DCoins הם המטבע הווירטואלי של DJET. ניתן להרוויח אותם על ידי משחקים, הזמנת חברים
                                    והגעה לרמות גבוהות.
                                </p>
                                <button class="transfer-open-button" id="transfer-open-button">
                                    <i class="fas fa-exchange-alt"></i> העבר DCoins לשחקן אחר
                                </button>
                                <div class="transfer-history">
                                    <h5><i class="fas fa-history"></i> היסטוריית העברות</h5>
                                    <div id="transfer-history-list">
                                        <!-- Transfer history will be loaded here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    `;
}

function getMainContentHTML() {
    return `
        <header>
            <div class="nav-container glass">
                <div class="containerN">
                    <nav>
                        <div class="share-counter" onclick="copyShareLink();"><i class="fas fa-share-nodes"></i></div>
                        <div class="streak-counter" id="streak-counter">
                            <i class="fas fa-fire" id="streak-icon"></i>
                            <div class="streak-info">
                                <span class="streak-days" id="streak-days">0</span>
                                <span class="streak-label" id="streak-label">רצף יומי</span>
                            </div>
                            <div class="streak-details" id="streak-details" dir="rtl">
                                <div id="streak-title"></div>
                                <div id="streak-status"></div>
                                <div id="streak-warning"></div>
                            </div>
                        </div>
                        <div class="dcoins-counter" id="dcoins-counter">
                            <i class="fas fa-coins"></i>
                            <div class="dcoins-info">
                                <span class="dcoins-amount" id="dcoins-amount">500</span>
                                <span class="dcoins-label">DCoins</span>
                            </div>
                            <div class="dcoins-details" id="dcoins-details" dir="rtl">
                                <h4><i class="fas fa-coins"></i> DCoins שלך</h4>
                                <p class="dcoins-explanation">
                                    DCoins הם המטבע הווירטואלי של DJET. ניתן להרוויח אותם על ידי משחקים, הזמנת חברים
                                    והגעה לרמות גבוהות.
                                </p>
                                <button class="transfer-open-button" id="transfer-open-button">
                                    <i class="fas fa-exchange-alt"></i> העבר DCoins לשחקן אחר
                                </button>
                                <div class="transfer-history">
                                    <h5><i class="fas fa-history"></i> היסטוריית העברות</h5>
                                    <div id="transfer-history-list">
                                        <!-- Transfer history will be loaded here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nav-links">
                            <a href="old_djet/index.html">D-History</a>
                            <a onclick="shop();">DShop</a>
                            <a href="#" class="leaderboards-link">לוח תוצאות</a>
                        </div>
                        <div class="user-profile" id="user-profile" onclick="openSettings();">
                            <div class="user-avatar" id="user-avatar">U</div>
                            <div class="user-info">
                                <span class="username" id="username">GuestUser</span>
                                <span class="user-group" id="user-group">General</span>
                            </div>
                        </div>
                        <button class="cta-button" id="play-now-btn" onclick="homepage();">דף הבית</button>
                    </nav>
                </div>
            </div>
        </header>
        <section class="hero" id="hero">
            <div class="container">
                <div class="hero-logo" style="text-align:center; margin-bottom:20px;">
                    <h1 style="display:inline-flex; align-items:center; gap:12px; font-size:3.5rem; line-height:1; margin:0;">
                        <i class="fas fa-gamepad" aria-hidden="true" style="font-size:1.1em; color: var(--icon-color); filter: drop-shadow(0 0 8px rgb(154, 140, 255));"></i>
                        <span style="background-clip:text; color:transparent; font-weight:800;">DJET</span>
                    </h1>
                    <p style="color:#b0b0d0; margin-top:8px; font-size:1.05rem;">להעביר את הזמן בטוב</p>
                </div>
            </div>
        </section>
        <section id="dgames" class="games">
            <div class="container">
                <div class="games-grid" id="games-grid"></div>
            </div>
        </section>
        <section class="dshop-section" id="dshop" style="display:none;">
            <div class="container" style="display: flex; flex-direction: column; align-items: center;">
                <div class="daily-timer" id="daily-timer">
                    <div class="timer-label">החנות מתחלפת בעוד:</div>
                    <div class="timer-display" id="timer-display">
                        <div class="timer-segment"><span class="timer-value" id="timer-hours">00</span><span class="timer-unit">שעות</span></div>
                        <div class="timer-separator">:</div>
                        <div class="timer-segment"><span class="timer-value" id="timer-minutes">00</span><span class="timer-unit">דקות</span></div>
                        <div class="timer-separator">:</div>
                        <div class="timer-segment"><span class="timer-value" id="timer-seconds">00</span><span class="timer-unit">שניות</span></div>
                    </div>
                </div>
                <div class="all-gifs-header">
                    <h3><i class="fas fa-th-large"></i><span id="dshoptitle">כל הדמויות בחנות</span></h3>
                    <div class="gifs-filter" id="gifs-filter"></div>
                </div>
                <div class="gifs-grid" id="all-gifs"></div>
            </div>
        </section>
        <div class="queen-div" style="display: none;" id="game_zone"></div>
        <footer><div class="contact-fab-wrap"><button class="contact-fab" id="contact-fab" onclick="openContactModal()" title="צור קשר"><i class="fas fa-envelope"></i><span class="contact-notif-badge" id="contact-notif-badge" style="display:none;"></span></button></div></footer>
    `;
}

function getMobileDisplaysHTML() {
    return `
        <div id="mobile-home-display" class="mobile-display active">
            <section class="hero" id="hero-mobile">
                <div class="container">
                    <div class="hero-logo" style="text-align:center; margin-bottom:20px;">
                        <h1 style="display:inline-flex; align-items:center; gap:12px; font-size:2.5rem; line-height:1; margin:0;">
                            <i class="fas fa-gamepad" aria-hidden="true" style="font-size:1em; color: var(--icon-color); filter: drop-shadow(0 0 8px rgb(154, 140, 255));"></i>
                            <span style="background-clip:text; color:transparent; font-weight:800;">DJET</span>
                        </h1>
                        <p style="color:#b0b0d0; margin-top:8px; font-size:0.95rem;">להעביר את הזמן בטוב</p>
                    </div>
                </div>
            </section>
            <section id="games-mobile">
                <div class="container">
                    <div class="games-grid" id="games-grid-mobile"></div>
                </div>
            </section>
        </div>

        <div id="mobile-shop-display" class="mobile-display">
            <section class="dshop-section" id="dshop-mobile">
                <div class="container" style="display: flex; flex-direction: column; align-items: center;">
                    <div class="daily-timer" id="daily-timer-mobile">
                        <div class="timer-label">החנות מתחלפת בעוד:</div>
                        <div class="timer-display" id="timer-display-mobile">
                            <div class="timer-segment"><span class="timer-value" id="timer-hours-mobile">00</span><span class="timer-unit">שעות</span></div>
                            <div class="timer-separator">:</div>
                            <div class="timer-segment"><span class="timer-value" id="timer-minutes-mobile">00</span><span class="timer-unit">דקות</span></div>
                            <div class="timer-separator">:</div>
                            <div class="timer-segment"><span class="timer-value" id="timer-seconds-mobile">00</span><span class="timer-unit">שניות</span></div>
                        </div>
                    </div>
                    <div class="all-gifs-header">
                        <h3><i class="fas fa-th-large"></i><span id="dshoptitle-mobile">כל הדמויות בחנות</span></h3>
                        <div class="gifs-filter" id="gifs-filter-mobile"></div>
                    </div>
                    <div class="gifs-grid" id="all-gifs-mobile"></div>
                </div>
            </section>
        </div>

        <div id="mobile-game-display" class="mobile-display">
            <div class="queen-div" id="game_zone_mobile"></div>
        </div>

        <div id="mobile-activity-display" class="mobile-display">
            <div class="activity-section" id="activity-mobile">
                <div class="activity-header"><i class="fas fa-bolt"></i><h4>פעילות בזמן אמת</h4></div>
                <div class="activity-list" id="activity-list-mobile"></div>
            </div>
        </div>

        <div id="mobile-chat-display" class="mobile-display">
            <div class="chat-section" id="chat-mobile">
                <div class="chat-header"><i class="fas fa-comments"></i><h4>הצ'אט (הלא) מבצעי</h4></div>
                <div class="chat-messages" id="chat-messages-mobile"></div>
                <div class="gif-picker-container" id="gif-picker-mobile">
                    <div class="gif-picker-header"><h5><i class="fas fa-images"></i> הדמויות שלך</h5><button class="close-gif-picker" id="close-gif-picker-mobile"><i class="fas fa-times"></i></button></div>
                    <div class="owned-gifs-grid" id="owned-gifs-grid-mobile"></div>
                </div>
                <div class="chat-input-container">
                    <button class="send-gif-button" id="send-gif-button-mobile" title="שלח דמות"><i class="fas fa-theater-masks"></i></button>
                    <textarea class="chat-input" id="message-input-mobile" placeholder="הקלד הודעה..." rows="1"></textarea>
                    <button class="send-button" id="send-button-mobile"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>

        <div id="mobile-music-display" class="mobile-display">
            <div class="activity-section" id="music-mobile">
                <div class="music-header"><i class="fas fa-music"></i><h4>מוזיקה איכותית</h4></div>
                <div class="nav_container" id="top_bar_mobile">
                    <nav id="top_nav_mobile" class="glass">
                        <div id="searchbox_mobile">
                            <div id="search_controls_mobile"><label id="search_icon_mobile" for="search_mobile" title="חיפוש"><i class="fa fa-search"></i></label></div>
                            <input id="search_mobile" name="search_mobile" oninput="show_results()" type="text" placeholder="חיפוש שיר או פלייליסט" autocomplete="off">
                        </div>
                    </nav>
                    <div id="results_mobile" class="result_box glass"></div>
                </div>
                <div id="inside_boxspotlights_mobile">
                    <h3 class="titleinleft">המומלצים</h3>
                    <ul id="highlight_mobile" style="max-height: 265px; overflow-y: hidden;"><div style="justify-content: center; align-items: center; display: flex; width: 100%; height: 100%; position: relative;"><div class="loader"></div></div></ul>
                    <h3 class="titleinleft">הפלייליסטים שלי</h3>
                    <ul id="myplaylists_mobile" style="max-height: 250px; overflow-y: hidden;"><div style="justify-content: center; align-items: center; display: flex; width: 100%; height: 100%; position: relative;"><div class="loader"></div></div></ul>
                </div>
                <div class="glass playbox" id="bot_nav_mobile">
                    <div id="song_title_mobile" class="song_title">DJET</div>
                    <div class="flex"><audio class="" id="timeline_mobile" controls src="https://ronkunin.github.io/DJET/scripts/features/music/DJET.mp3"></audio></div>
                    <div class="flex">
                        <div class="main_controls">
                            <div onclick="addLikedSong()" class="concon disable" id="like_mobile"><i class="fa fa-heart"></i></div>
                            <div onclick="playPrevius()" class="prev disable" id="button_prev_mobile"><i class="fa fa-backward-step"></i></div>
                            <div onclick="togglePlay()" class="play disable" id="button_play_mobile"><i class="fa fa-play"></i></div>
                            <div onclick="playNext()" class="next disable" id="button_next_mobile"><i class="fa fa-forward-step"></i></div>
                            <div onclick="create_playlist()" class="concon" id="plus_mobile"><i class="fa fa-circle-plus"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="mobile-leaderboard-display" class="mobile-display">
            <div class="leaderboard-section" id="leaderboard-mobile">
                <div class="leaderboards-header"><h3><i class="fas fa-trophy"></i> לוח תוצאות</h3></div>
                <div class="leaderboards-controls">
                    <div class="filter-group">
                        <label for="game-select-mobile">
                            <i class="fas fa-gamepad"></i>
                            בחר משחק:
                        </label>
                        <select id="game-select-mobile" class="filter-select"></select>
                    </div>
                    <div class="filter-group">
                        <label for="unit-filter-mobile">
                            <i class="fas fa-filter"></i>
                            סינון:
                        </label>
                        <select id="unit-filter-mobile" class="filter-select">
                            <option value="all">כל היחידות</option>
                            <option value="my_unit">היחידה שלי בלבד</option>
                            <option value="units_ranking">דירוג יחידות</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="sort-by-mobile">
                            <i class="fas fa-sort"></i>
                            מיון לפי:
                        </label>
                        <select id="sort-by-mobile" class="filter-select">
                            <option value="max_score">ניקוד גבוה ביותר</option>
                            <option value="games_played">כמות משחקים</option>
                            <option value="recent">הכי עדכני</option>
                        </select>
                    </div>
                </div>
                <div class="leaderboards-content">
                    <div class="leaderboards-table-container">
                        <table class="leaderboards-table" id="leaderboards-table-mobile">
                            <thead id="leaderboards-header-mobile"></thead>
                            <tbody id="leaderboards-body-mobile"></tbody>
                        </table>
                        <div class="no-data-message" id="no-data-message-mobile" style="display: none;">
                            <i class="fas fa-chart-bar"></i>
                            <p>אין נתונים להצגה. נסה לשנות את הסינונים.</p>
                        </div>
                    </div>
                    <div class="current-user-stats" id="current-user-stats-mobile" style="display: none;">
                        <div class="current-user-info">
                            <div class="current-user-rank">
                                <div class="rank" id="current-user-rank-mobile">0</div>
                                <div class="current-user-details">
                                    <div class="current-user-avatar" id="current-user-avatar-mobile">א</div>
                                    <div class="current-user-text">
                                        <div class="current-user-name" id="current-user-name-mobile">אורח</div>
                                        <div class="current-user-unit" id="current-user-unit-mobile">המטה</div>
                                    </div>
                                </div>
                            </div>
                            <div class="current-user-score">
                                <div class="current-user-score-value" id="current-user-score-mobile">0</div>
                                <div class="current-user-score-label">הניקוד שלך</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getBottomNavHTML() {
    return `
        <div class="mobile-nav-indicator"></div>
        <button class="mobile-nav-btn active" data-display="mobile-home-display" onclick="switchMobileDisplay('mobile-home-display')">
            <i class="fas fa-home"></i>
            <span>בית</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-game-display" onclick="switchMobileDisplay('mobile-game-display')">
            <i class="fas fa-gamepad"></i>
            <span>משחק</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-activity-display" onclick="switchMobileDisplay('mobile-activity-display')">
            <i class="fas fa-bolt"></i>
            <span>פעילות</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-chat-display" onclick="switchMobileDisplay('mobile-chat-display')">
            <i class="fas fa-comments"></i>
            <span>צ'אט</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-leaderboard-display" onclick="switchMobileDisplay('mobile-leaderboard-display')">
            <i class="fas fa-trophy"></i>
            <span>לוח תוצאות</span>
        </button>
    `;
}

// Mobile display switching
function switchMobileDisplay(displayId) {
    // Hide all displays
    document.querySelectorAll('.mobile-display').forEach(d => d.classList.remove('active'));
    // Show selected display
    const selectedDisplay = document.getElementById(displayId);
    if (!selectedDisplay) return;
    selectedDisplay.classList.add('active');
    
    // Update button active state
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-display="${displayId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Special handling for displays
    if (displayId === 'mobile-home-display') {
        homepage();
    } else if (displayId === 'mobile-shop-display') {
        shop();
    }
    
    // Move indicator bar
    const indicator = document.querySelector('.mobile-nav-indicator');
    if (indicator && activeBtn) {
        indicator.style.width = `${activeBtn.offsetWidth}px`;
        indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    }
    
    // Scroll display to top
    const mainDisplay = document.getElementById('main-display-mobile');
    if (mainDisplay) {
        mainDisplay.scrollTop = 0;
    }
    
    // Refresh content based on displayed section
    if (displayId === 'mobile-activity-display' && typeof loadActivities === 'function') {
        loadActivities();
    } else if (displayId === 'mobile-chat-display' && typeof loadChatMessages === 'function') {
        loadChatMessages();
    } else if (displayId === 'mobile-music-display' && typeof loadPlaylistsAndHighlights === 'function') {
        loadPlaylistsAndHighlights();
    } else if (displayId === 'mobile-leaderboard-display' && typeof loadLeaderboards === 'function') {
        loadLeaderboards();
    }
}

function setupMobileNavigationInteractions() {
    const nav = document.getElementById('mobile-nav');
    const mainDisplay = document.getElementById('main-display-mobile');
    if (!nav || !mainDisplay) return;

    const buttons = Array.from(nav.querySelectorAll('.mobile-nav-btn'));
    const displayIds = ['mobile-home-display', 'mobile-game-display', 'mobile-activity-display', 'mobile-chat-display', 'mobile-leaderboard-display'];
    let isDragging = false;
    let dragStarted = false;
    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDeltaX = 0;
    let touchDeltaY = 0;
    const dragThreshold = 12;

    const clampIndex = (index) => Math.max(0, Math.min(displayIds.length - 1, index));
    const highlightIndex = (index) => {
        buttons.forEach((btn, idx) => btn.classList.toggle('nav-hovered', idx === index));
    };
    const clearHighlight = () => buttons.forEach(btn => btn.classList.remove('nav-hovered'));

    const indicator = document.querySelector('.mobile-nav-indicator');
    const updateIndicator = () => {
        const activeButton = document.querySelector('.mobile-nav-btn.active');
        if (indicator && activeButton) {
            indicator.style.width = `${activeButton.offsetWidth}px`;
            indicator.style.transform = `translateX(${activeButton.offsetLeft}px)`;
        }
    };

    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            button.classList.add('tab-bounce');
            button.addEventListener('animationend', () => button.classList.remove('tab-bounce'), { once: true });
            updateIndicator();
        });
    });

    updateIndicator();

    nav.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'touch' && event.pointerType !== 'pen' && event.pointerType !== 'mouse') return;
        isDragging = true;
        touchStartX = event.clientX;
        nav.setPointerCapture(event.pointerId);
    });

    nav.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        const rect = nav.getBoundingClientRect();
        const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
        const targetIndex = clampIndex(Math.floor((x / rect.width) * buttons.length));
        if (Math.abs(event.clientX - touchStartX) > dragThreshold) {
            dragStarted = true;
        }
        highlightIndex(targetIndex);
        currentIndex = targetIndex;
    });

    nav.addEventListener('pointerup', (event) => {
        if (!isDragging) return;
        isDragging = false;
        if (event.pointerId) nav.releasePointerCapture(event.pointerId);
        if (dragStarted) {
            const targetId = displayIds[currentIndex];
            if (targetId) switchMobileDisplay(targetId);
        }
        dragStarted = false;
        clearHighlight();
    });

    nav.addEventListener('pointercancel', () => {
        isDragging = false;
        clearHighlight();
    });

    mainDisplay.addEventListener('touchstart', (event) => {
        if (event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchDeltaX = 0;
        touchDeltaY = 0;
    }, { passive: true });

    mainDisplay.addEventListener('touchmove', (event) => {
        if (event.touches.length !== 1) return;
        touchDeltaX = event.touches[0].clientX - touchStartX;
        touchDeltaY = event.touches[0].clientY - touchStartY;
        if (Math.abs(touchDeltaX) > 20 && Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
            event.preventDefault();
        }
    }, { passive: false });

    mainDisplay.addEventListener('touchend', () => {
        const activeDisplay = displayIds.find(id => document.getElementById(id)?.classList.contains('active')) || displayIds[0];
        const activeIndex = displayIds.indexOf(activeDisplay);

        if (Math.abs(touchDeltaX) > 50 && Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
            if (touchDeltaX < 0 && activeIndex < displayIds.length - 1) {
                switchMobileDisplay(displayIds[activeIndex + 1]);
            } else if (touchDeltaX > 0 && activeIndex > 0) {
                switchMobileDisplay(displayIds[activeIndex - 1]);
            }
        }
    });
}
