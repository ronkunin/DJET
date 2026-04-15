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
    
    // Header
    const header = document.createElement('header');
    header.innerHTML = getHeaderHTML();
    
    // Main display area
    const mainDisplay = document.createElement('div');
    mainDisplay.className = 'main-display-mobile';
    mainDisplay.id = 'main-display-mobile';
    mainDisplay.style.flex = '1';
    mainDisplay.style.overflowY = 'auto';
    mainDisplay.innerHTML = getMobileDisplaysHTML();
    
    // Bottom navigation
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-nav';
    bottomNav.id = 'mobile-nav';
    bottomNav.innerHTML = getBottomNavHTML();
    
    container.appendChild(header);
    container.appendChild(mainDisplay);
    container.appendChild(bottomNav);
    
    body.appendChild(container);
}

function getHeaderHTML() {
    return `
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
                        <div class="dcoins-details" id="dcoins-details" dir="rtl"></div>
                    </div>
                    <div class="nav-links">
                        <a href="old_djet/index.html">D-History</a>
                        <a onclick="shop();">DShop</a>
                        <a href="#" id="leaderboards-link">לוח תוצאות</a>
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
                            <div class="dcoins-details" id="dcoins-details" dir="rtl"></div>
                        </div>
                        <div class="nav-links">
                            <a href="old_djet/index.html">D-History</a>
                            <a onclick="shop();">DShop</a>
                            <a href="#" id="leaderboards-link">לוח תוצאות</a>
                        </div>
                        <div class="user-profile" id="user-profile" onclick="openSettings();">
                            <div class="user-avatar" id="user-avatar">U</div>
                            <div class="user-info">
                                <span class="username" id="username">GuestUser</span>
                                <span class="user-group" id="user-group">General</span>
                            </div>
                        </div>
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
            <section class="games" id="games-mobile">
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
                <div class="leaderboards-header"><h3><i class="fas fa-trophy"></i> לוח התוצאות</h3></div>
                <div class="leaderboards-content">
                    <div class="game-selector"><select id="game-select-mobile"></select></div>
                    <div class="leaderboards-table-container">
                        <table id="leaderboards-table-mobile">
                            <thead id="leaderboards-header-mobile"></thead>
                            <tbody id="leaderboards-body-mobile"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getBottomNavHTML() {
    return `
        <div class="mobile-nav-indicator"></div>
        <button class="mobile-nav-btn active" data-display="mobile-home-display">
            <i class="fas fa-home"></i>
            <span>בית</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-shop-display">
            <i class="fas fa-store"></i>
            <span>חנות</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-game-display">
            <i class="fas fa-gamepad"></i>
            <span>משחק</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-activity-display">
            <i class="fas fa-bolt"></i>
            <span>פעילות</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-chat-display">
            <i class="fas fa-comments"></i>
            <span>צ'אט</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-music-display">
            <i class="fas fa-music"></i>
            <span>מוזיקה</span>
        </button>
        <button class="mobile-nav-btn" data-display="mobile-leaderboard-display">
            <i class="fas fa-trophy"></i>
            <span>לוח תוצאות</span>
        </button>
    `;
}

// Mobile display switching
function switchMobileDisplay(displayId) {
    document.querySelectorAll('.mobile-display').forEach(d => d.classList.remove('active'));
    document.getElementById(displayId).classList.add('active');
    
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-display="${displayId}"]`).classList.add('active');
    
    // Move indicator
    const indicator = document.querySelector('.mobile-nav-indicator');
    const buttons = Array.from(document.querySelectorAll('.mobile-nav-btn'));
    const activeBtn = document.querySelector('.mobile-nav-btn.active');
    const index = buttons.indexOf(activeBtn);
    indicator.style.transform = `translateX(${index * (100 / 7)}%)`;
}
