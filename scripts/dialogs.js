/////// DIALOGS OPEN AND CLOSE ONLY

function addSettingsModal() {
    const modalHTML = `
    <!-- Settings Modal -->
    <div class="settings-modal" id="settings-modal">
        <div class="settings-container glass" dir="rtl">
            <div class="settings-header">
                <h3><i class="fas fa-user-cog"></i> הגדרות משתמש</h3>
                <button class="close-settings" id="close-settings" aria-label="סגור" onclick="closeSettings();">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="settings-content">
                <div class="settings-group">
                    <h4><i class="fas fa-user"></i> שינוי שם משתמש</h4>
                    <input type="text" class="settings-input" id="username-input" placeholder="הזן שם מלא" maxlength="20">
                </div>

                <div class="settings-group">
                    <h4><i class="fas fa-users"></i> שנה יחידה</h4>
                    <select id="settings-group" class="settings-input">
                        <option value="" disabled selected>בחר יחידה...</option>
                        ${generateOptions()}
                    </select>
                </div>

                <p id="settings-warning">שים לב: שם המשתמש והיחידה יוצגו לכולם</p>

                <button class="settings-button" id="save-settings" onclick="saveSettings();">שמור שינויים</button>
                
                <div style="border-top: 1px solid rgba(255,255,255,0.2); margin-top: 20px; padding-top: 20px;">
                    <button class="settings-button" id="logout-button" onclick="googleSignOut();" style="background-color: #ff6b6b; color: white;">
                        <i class="fas fa-sign-out-alt"></i> התחבר עם חשבון אחר
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close when clicking outside
    document.getElementById('settings-modal').addEventListener('click', (e) => {
        if (e.target.id === 'settings-modal') {
            closeSettings();
        }
    });
}

function openSettings() {
    document.getElementById('settings-modal').classList.add('active');
    document.getElementById('username-input').value = user_details["username"];
    document.getElementById('settings-group').value = user_details["unit"];
    document.body.style.overflow = 'hidden';
    closePlaylist();
}

function closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

//////////////////////////////////////////////////


function addContactModal() {
    const modalHTML = `
        <!-- Contact Modal -->
    <div class="contact-modal" id="contact-modal">
        <div class="contact-container glass">
            <div class="contact-header">
                <h3><i class="fas fa-envelope"></i> צור קשר</h3>
                <button class="close-contact" onclick="closeContactModal()"><i class="fas fa-times"></i></button>
            </div>
            <div class="contact-tabs" id="contact-tabs">
                <!-- Tabs injected by JS based on permission -->
            </div>
            <div class="contact-body" id="contact-body">
                <!-- Content injected by JS -->
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);


    // Close contact modal when clicking outside
    document.getElementById('contact-modal').addEventListener('click', function (e) {
        if (e.target === this) closeContactModal();
    });
}


function openContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    contactCurrentTab = (PREMISSIONS[userEmail] === "מנהל DJET") ? 'list' : 'new';
    contactSelectedId = null;
    count_newcontacts = 0;
    updateNotifBadge();
    renderContactTabs();
    renderContactBody();
}

function closeContactModal() {
    document.getElementById('contact-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    contactSelectedId = null;
}

function initSettings() {
    // Populate list
    const list = document.getElementById('settings-link-list');
    list.innerHTML = settingsLinks.map(item => `
                <li>
                    <a href="${item.link}" target="_blank" rel="noopener">
                        <span class="settings-link-emoji">${item.emoji}</span>
                        <span>${item.text}</span>
                    </a>
                </li>
            `).join('');

    // Toggle popup
    const btn = document.getElementById('settings-btn');
    const popup = document.getElementById('settings-popup');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = popup.classList.contains('open');
        popup.classList.toggle('open', !isOpen);
        btn.classList.toggle('open', !isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!document.getElementById('settings-wrap').contains(e.target)) {
            popup.classList.remove('open');
            btn.classList.remove('open');
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            popup.classList.remove('open');
            btn.classList.remove('open');
        }
    });
}
//////////////////////////////////////////////////

function addTransferModal() {
    const modalHTML = `
    <!-- transfer Modal -->
    <div class="transfer-modal" id="transfer-modal">
        <div class="transfer-container glass" dir="rtl">
            <div class="transfer-header">
                <h3><i class="fas fa-exchange-alt"></i> העברת DCoins</h3>
                <button class="transfer-close" id="transfer-close" aria-label="סגור">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="transfer-content">
                <div class="transfer-form">
                    <div class="form-group user-search-container">
                        <label for="transfer-to">
                            <i class="fas fa-user"></i>
                            העבר ל:
                        </label>
                        <input type="text" id="transfer-to" class="transfer-input" placeholder="חפש משתמשים..."
                            autocomplete="off">
                        <div class="search-results" id="search-results"></div>
                    </div>

                    <div class="form-group">
                        <label for="transfer-reason">
                            <i class="fas fa-comment"></i>
                            סיבה (אופציונלי):
                        </label>
                        <input type="text" id="transfer-reason" class="transfer-input" placeholder="למה אתה מעביר?">
                    </div>

                    <div class="form-group">
                        <label for="transfer-amount">
                            <i class="fas fa-coins"></i>
                            סכום:
                        </label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="number" id="transfer-amount" class="transfer-input" placeholder="כמות" min="1"
                                max="1000" value="50">
                            <span style="color: var(--dcoin-color); font-weight: 600;">DCoins</span>
                        </div>
                        <div class="available-balance">
                            יתרה זמינה: <span id="available-balance">500</span> DCoins
                        </div>
                    </div>

                    <div class="quick-amount-buttons">
                        <button class="quick-amount-button" id="quick-amount-10">10</button>
                        <button class="quick-amount-button" id="quick-amount-50">50</button>
                        <button class="quick-amount-button" id="quick-amount-100">100</button>
                        <button class="quick-amount-button" id="quick-amount-500">500</button>
                    </div>

                    <button class="transfer-button" id="confirm-transfer">
                        <i class="fas fa-paper-plane"></i>
                        בצע העברה
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openTransferModal() {
    const modal = document.getElementById('transfer-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update available balance
    document.getElementById('available-balance').textContent = user_details.dcoins;

    // Clear previous search
    document.getElementById('transfer-to').value = '';
    document.getElementById('transfer-reason').value = '';
    document.getElementById('transfer-amount').value = '50';
    hideSearchResults();

    // Focus on search input
    setTimeout(() => {
        document.getElementById('transfer-to').focus();
    }, 300);
}

function closeTransferModal() {
    document.getElementById('transfer-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function initializeTransfer() {
    // User search functionality
    const transferToInput = document.getElementById('transfer-to');
    if (transferToInput) transferToInput.addEventListener('input', function () {
        const query = this.value;
        if (query.length >= 1) {
            const results = searchUsers(query);
            displaySearchResults(results);
        } else {
            hideSearchResults();
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.user-search-container')) {
            hideSearchResults();
        }
    });

    // Close when clicking outside
    const transferModal = document.getElementById('transfer-modal');
    if (transferModal) transferModal.addEventListener('click', (e) => {
        if (e.target.id === 'transfer-modal') {
            closeTransferModal();
        }
    });

    // Amount validation
    const transferAmount = document.getElementById('transfer-amount');
    if (transferAmount) transferAmount.addEventListener('input', function () {
        const amount = parseInt(this.value);
        const available = user_details.dcoins;

        if (amount > available) {
            this.style.borderColor = 'red';
            this.style.boxShadow = '0 0 8px rgba(255, 0, 128, 0.2)';
        } else {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        }
    });

    // Enter key to submit transfer
    if (transferAmount) transferAmount.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performTransfer();
        }
    });

    // Also on reason input
    const transferReason = document.getElementById('transfer-reason');
    if (transferReason) transferReason.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performTransfer();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && transferModal && transferModal.classList.contains('active')) {
            closeTransferModal();
        }
    });

    // DCoins Transfer Event Listeners
    const transferOpenButton = document.getElementById('transfer-open-button');
    if (transferOpenButton) transferOpenButton.addEventListener('click', openTransferModal);
    const transferClose = document.getElementById('transfer-close');
    if (transferClose) transferClose.addEventListener('click', closeTransferModal);
    const confirmTransfer = document.getElementById('confirm-transfer');
    if (confirmTransfer) confirmTransfer.addEventListener('click', performTransfer);

    const quickAmount10 = document.getElementById('quick-amount-10');
    if (quickAmount10) quickAmount10.addEventListener('click', () => {
        if (transferAmount) transferAmount.value = 10;
    });

    const quickAmount50 = document.getElementById('quick-amount-50');
    if (quickAmount50) quickAmount50.addEventListener('click', () => {
        if (transferAmount) transferAmount.value = 50;
    });

    const quickAmount100 = document.getElementById('quick-amount-100');
    if (quickAmount100) quickAmount100.addEventListener('click', () => {
        if (transferAmount) transferAmount.value = 100;
    });

    const quickAmount500 = document.getElementById('quick-amount-500');
    if (quickAmount500) quickAmount500.addEventListener('click', () => {
        if (transferAmount) transferAmount.value = 500;
    });
}

//////////////////////////////////////////////////

function addPurchaserModal() {
    const modalHTML = `
    <!-- Purchase Confirmation Modal -->
    <div class="purchase-modal" id="purchase-modal">
        <div class="purchase-container glass">
            <div class="purchase-header">
                <h3><i class="fas fa-shopping-cart"></i> אישור רכישה</h3>
            </div>
            <div class="purchase-content">
                <div class="purchase-gif" id="purchase-gif">
                    <!-- GIF preview -->
                </div>
                <div class="purchase-details">
                    <div class="purchase-price">
                        <i class="fas fa-coins"></i>
                        <span id="purchase-price">100</span> DCoins
                    </div>
                    <p class="purchase-balance">יתרה נוכחית: <span><span class="balance-amount"
                                id="current-balance">0</span>
                            DCoins</span></p>
                </div>
                <div class="purchase-buttons">
                    <button class="confirm-buy" id="confirm-buy">קנה עכשיו</button>
                    <button class="cancel-buy" id="cancel-buy">ביטול</button>
                </div>
            </div>
        </div>
    </div>

    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showPurchaseModal(gif, price) {
    selectedGif = gif;

    const modal = document.getElementById('purchase-modal');
    const purchaseGif = document.getElementById('purchase-gif');
    const purchasePrice = document.getElementById('purchase-price');
    const currentBalance = document.getElementById('current-balance');

    purchaseGif.innerHTML = `<img src="${gif.FileRef}">`;
    purchasePrice.textContent = price;
    currentBalance.textContent = user_details.dcoins;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hidePurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    selectedGif = null;
}

function initializeShop() {

    // Purchase modal buttons
    document.getElementById('confirm-buy').addEventListener('click', function () {
        if (selectedGif) {
            const discountedPrice = selectedGif.discount ?
                Math.floor(selectedGif.price * (1 - selectedGif.discount / 100)) :
                selectedGif.price;
            purchaseGIF(selectedGif, discountedPrice);
        }
    });

    document.getElementById('cancel-buy').addEventListener('click', hidePurchaseModal);

    document.getElementById('purchase-modal').addEventListener('click', function (e) {
        if (e.target.id === 'purchase-modal') {
            hidePurchaseModal();
        }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter2 = this.dataset.filter;
            loadAllGIFs();
        });
    });
}

//////////////////////////////////////////////////

function addLeaderBoardModal() {
    const modalHTML = `
    <!-- Leaderboard Modal -->
    <div class="leaderboards-modal" id="leaderboards-modal">
        <div class="leaderboards-container glass" dir="rtl">
            <div class="leaderboards-header">
                <h3><i class="fas fa-trophy"></i> לוח תוצאות</h3>
                <button class="close-leaderboards" id="close-leaderboards" aria-label="סגור">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="leaderboards-controls">
                <div class="filter-group">
                    <label for="game-select">
                        <i class="fas fa-gamepad"></i>
                        בחר משחק:
                    </label>
                    <select id="game-select" class="filter-select">
                        <!-- Options will be populated from gamesConfig -->
                    </select>
                </div>

                <div class="filter-group">
                    <label for="unit-filter">
                        <i class="fas fa-filter"></i>
                        סינון:
                    </label>
                    <select id="unit-filter" class="filter-select">
                        <option value="all">כל היחידות</option>
                        <option value="my_unit">היחידה שלי בלבד</option>
                        <option value="units_ranking">דירוג יחידות</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="sort-by">
                        <i class="fas fa-sort"></i>
                        מיון לפי:
                    </label>
                    <select id="sort-by" class="filter-select">
                        <option value="max_score">ניקוד גבוה ביותר</option>
                        <option value="games_played">כמות משחקים</option>
                        <option value="recent">הכי עדכני</option>
                    </select>
                </div>
            </div>

            <div class="leaderboards-content">
                <div class="leaderboards-table-container">
                    <table class="leaderboards-table" id="leaderboards-table">
                        <thead id="leaderboards-header">
                            <!-- Table headers will be populated from gamesConfig -->
                        </thead>
                        <tbody id="leaderboards-body">
                            <!-- Data will be populated here -->
                        </tbody>
                    </table>

                    <div class="no-data-message" id="no-data-message" style="display: none;">
                        <i class="fas fa-chart-bar"></i>
                        <p>אין נתונים להצגה. נסה לשנות את הסינונים.</p>
                    </div>
                </div>

                <div class="current-user-stats" id="current-user-stats" style="display: none;">
                    <div class="current-user-info">
                        <div class="current-user-rank">
                            <div class="rank" id="current-user-rank">0</div>
                            <div class="current-user-details">
                                <div class="current-user-avatar" id="current-user-avatar">א</div>
                                <div class="current-user-text">
                                    <div class="current-user-name" id="current-user-name">אורח</div>
                                    <div class="current-user-unit" id="current-user-unit">המטה</div>
                                </div>
                            </div>
                        </div>
                        <div class="current-user-score">
                            <div class="current-user-score-value" id="current-user-score">0</div>
                            <div class="current-user-score-label">הניקוד שלך</div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.body.addEventListener('click', function (e) {
        const target = e.target.closest('#leaderboards-link, .leaderboards-link');
        if (!target) return;
        e.preventDefault();
        openLeaderboards();
    });
}

function openLeaderboards() {
    const modal = document.getElementById('leaderboards-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Refresh leaderboards data
    loadLeaderboards();
    closePlaylist();
}

function closeLeaderboards() {
    const modal = document.getElementById('leaderboards-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

//////////////////////////////////////////////////

function addPlaylistModal() {
    const modalHTML = `
    <!-- Playlist Modal -->
    <div class="playlist-modal" id="playlist-modal">
        <div class="playlist-container glass">
            <div class="playlist-header">
                <input type="text" class="playlist-name" id="playlist-name" value="הפלייליסט שלי" maxlength="30">
                <button class="close-playlist" id="close-playlist" aria-label="סגור">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="playlist-controls-bar" id="play_bar">
                <div class="playlist-actions">
                    <button class="action-btn save-btn" id="save-playlist-btn">
                        <i class="fas fa-save"></i>
                        שמור
                    </button>
                    <button class="action-btn publish-btn" id="publish-playlist-btn">
                        <i class="fas fa-globe"></i>
                        פרסם
                    </button>
                    <button class="action-btn hide-btn" id="hide-playlist-btn">
                        <i class="fas fa-eye-slash"></i>
                        הסתר
                    </button>
                    <button class="action-btn" id="change-name-btn">
                        <i class="fas fa-edit"></i>
                        שנה שם
                    </button>
                    <button class="action-btn delete-btn" id="delete-playlist-btn">
                        <i class="fas fa-trash"></i>
                        מחק
                    </button>
                </div>

                <div class="playlist-stats">
                    <div class="stat-item">
                        <div class="stat-value" id="songs-count">0</div>
                        <div class="stat-label">שירים</div>
                    </div>
                </div>
            </div>

            <div class="playlist-content">
                <div class="songs-list-container">
                    <ul class="songs-list" id="songs-list">
                        <!-- Songs will be populated here -->
                    </ul>

                    <div class="no-songs-message" id="no-songs-message">
                        <i class="fas fa-music"></i>
                        <p>אין שירים בפלייליסט.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

//////////////////////////////////////////////////

function addWelcomeModal() {
    const modalHTML = `
    <!-- Welcome Modal for New Users -->
    <div class="welcome-modal" id="welcome-modal">
        <div class="welcome-container glass">
            <div class="welcome-header">
                <h2>ברוך הבא ל-DJET החדש!</h2>
                <p>בוא נגדיר רגע את הפרופיל שלך</p>
            </div>
            <div class="welcome-content">
                <!-- Google Sign-In Section (shown first) -->
                <div id="google-signin-section" style="display: none; text-align: center; padding: 20px 0;">
                    <p style="margin-bottom: 20px; font-size: 1em;">
                        ✅ התחברות עם Google תבטיח שפרופילך יישמר ויהיה זמין בכל מכשיר
                    </p>
                    <button class="welcome-button" id="google-signin-btn" onclick="signInWithGoogle();" style="font-size: 1.1em; padding: 12px 24px; margin-bottom: 10px;">
                        🔐 התחבר עם Google
                    </button>
                </div>

                <!-- Profile Setup Section (shown after auth) -->
                <div id="profile-setup-section">
                    <div class="welcome-form-group">
                        <label for="welcome-username">
                            <i class="fas fa-user"></i>
                            הזן את שם + שם משפחה
                        </label>
                        <input type="text" id="welcome-username" class="welcome-input" placeholder="הזן שם משתמש" maxlength="20">
                    </div>

                    <div class="welcome-form-group">
                        <label for="welcome-group">
                            <i class="fas fa-users"></i>
                            תבחר את היחידה שלך
                        </label>
                        <select id="welcome-group" class="welcome-input" required aria-required="true" title="בחר את היחידה">
                            <option value="" disabled selected>בחר יחידה...</option>
                            ${generateOptions()}
                        </select>
                    </div>


                    <div class="welcome-form-group welcome-terms">
                        <label class="checkbox-label" for="welcome-terms">
                            <input type="checkbox" id="welcome-terms" class="checkbox-input" aria-required="true" required>
                            <span class="custom-checkbox" aria-hidden="true"></span>
                            <span class="checkbox-text">
                                אני מתחייב להשתמש באתר באופן שהולם את חוקי החיל
                        </label>
                    </div>

                    <p id="welcome-warning">שים לב: שם המשתמש והיחידה יוצגו לכולם</p>
                    <button class="welcome-button" id="welcome-submit" onclick="setupNewUser();">
                        <i class="fas fa-rocket"></i>
                        בוא נתחיל!
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateWelcomeModalView();
}

/**
 * Update welcome modal view based on authentication status
 */
function updateWelcomeModalView() {
    const isGoogleAuth = window.isUserGoogleAuthenticated && window.isUserGoogleAuthenticated();
    const googleSigninSection = document.getElementById('google-signin-section');
    const profileSetupSection = document.getElementById('profile-setup-section');
    
    if (isGoogleAuth) {
        // User is already authenticated, show profile setup
        if (googleSigninSection) googleSigninSection.style.display = 'none';
        if (profileSetupSection) profileSetupSection.style.display = 'block';
    } else {
        // User not authenticated, show Google sign-in
        if (googleSigninSection) googleSigninSection.style.display = 'block';
        if (profileSetupSection) profileSetupSection.style.display = 'none';
    }
}

function showWelcomeModal() {
    document.getElementById('welcome-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideWelcomeModal() {
    document.getElementById('welcome-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}
