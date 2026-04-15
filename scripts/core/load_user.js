async function setupNewUser() {
    // Check if user is Google authenticated
    if (!window.isUserGoogleAuthenticated || !window.isUserGoogleAuthenticated()) {
        showGoogleSignInPrompt();
        return;
    }

    const username = document.getElementById('welcome-username').value.trim();
    const selectedGroup = document.getElementById('welcome-group').value;
    const termsChecked = document.getElementById('welcome-terms').checked;
    const letterCount = (username.match(/\p{L}/gu) || []).length; // counts Unicode letters
    const welcomeWarningEl = document.getElementById('welcome-warning');

    if (letterCount < 3) {
        welcomeWarningEl.textContent = '⚠️ נא להזין לפחות 3 אותיות';
        return;
    }
    if (letterCount > 15) {
        welcomeWarningEl.textContent = '⚠️ נא להזין עד 15 אותיות';
        return;
    }
    if (hasBadWords(username)) {
        welcomeWarningEl.textContent = '⚠️ נא לבחור שם ראוי';
        return;
    }
    if (!selectedGroup) {
        welcomeWarningEl.textContent = '⚠️ בחר יחידה';
        return;
    }
    if (!termsChecked) {
        welcomeWarningEl.textContent = '⚠️ יש לאשר את התנאים';
        return;
    }

    welcomeWarningEl.textContent = '';

    user_details["username"] = username;
    user_details["unit"] = selectedGroup;
    if (!user_details || !user_details.Id) {
        user_details = await createUserOnSP();
    }

    window.localStorage.setItem('djet_user_name', user_details["username"]);
    window.localStorage.setItem('djet_user_unit', user_details["unit"]);

    showLoadingScreen();
    hideWelcomeModal();
    await updateSPValueInList2("Users", "username", "unit", user_details["Id"], user_details["username"], user_details["unit"], true);
    thanksShare();
    saveActivityOnSP(`הצטרף לראשונה ל-DJET!`, "new_account");
    scanUser();

}
// ==============================================
// USER SETTINGS FUNCTIONS
// ==============================================

function updateUserDisplay() {

    document.getElementById('username').textContent = user_details["username"];
    document.getElementById('user-group').textContent = user_details["unit"];
    document.getElementById('user-avatar').textContent = user_details["username"].charAt(0).toUpperCase();;
    document.getElementById('dcoins-amount').textContent = user_details["dcoins"];

}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

async function findUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !await window.isRealtimeDbOnline?.()) return null;
    const items = await loadItemsFromSP("Users", { filter: `Email eq '${normalizedEmail}'`, top: 1 });
    return items && items.length > 0 ? items[0] : null;
}

async function findUserByGoogleUid(uid) {
    if (!uid || !await window.isRealtimeDbOnline?.()) return null;
    const items = await loadItemsFromSP("Users", { filter: `GoogleUid eq '${uid}'`, top: 1 });
    return items && items.length > 0 ? items[0] : null;
}

async function loadUserById(id) {
    if (!id || !await window.isRealtimeDbOnline?.()) return null;
    try {
        const userRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/Users/${normalizeId(id)}`);
        const snapshot = await window.firebaseRTDB.get(userRef);
        if (!snapshot.exists()) return null;
        const user = snapshot.val();
        if (user.Id === undefined) user.Id = isNaN(Number(id)) ? id : Number(id);
        if (user.ID === undefined) user.ID = user.Id;
        return user;
    } catch (err) {
        console.warn('loadUserById failed', err);
        return null;
    }
}

function saveSettings() {
    const newUsername = document.getElementById('username-input').value.trim();
    const selectedGroup = document.getElementById('settings-group').value;
    const letterCount = (newUsername.match(/\p{L}/gu) || []).length; // counts Unicode letters
    const welcomeWarningEl = document.getElementById('settings-warning');

    if (letterCount < 3) {
        welcomeWarningEl.textContent = '⚠️ נא להזין לפחות 3 אותיות';
        return;
    }
    if (hasBadWords(newUsername)) {
        welcomeWarningEl.textContent = '⚠️ נא לבחור שם ראוי';
        return;
    }
    if (!selectedGroup) {
        welcomeWarningEl.textContent = '⚠️ בחר יחידה';
        return;
    }
    if (selectedGroup != user_details["unit"])
        saveActivityOnSP(`עבר לבסיס ${selectedGroup}`, "group_join")
    user_details["username"] = newUsername;
    user_details["unit"] = selectedGroup;
    window.localStorage.setItem('djet_user_name', user_details["username"]);
    window.localStorage.setItem('djet_user_unit', user_details["unit"]);

    updateSPValueInList2("Users", "username", "unit", user_details["Id"], user_details["username"], user_details["unit"], true)

    updateUserDisplay();
    closeSettings();
}


function addAdminPage() {
    let body = document.querySelector("body");
    let admin_page = `
<!-- Settings Icon -->
    <div class="settings-wrap" id="settings-wrap">
        <button class="settings-icon-btn" id="settings-btn" title="הגדרות" aria-label="פתח הגדרות">
            <i class="fas fa-cog"></i>
        </button>
        <div class="settings-popup" id="settings-popup">
            <div class="settings-popup-header">⚙️ &nbsp;Quick Links</div>
            <ul class="settings-link-list" id="settings-link-list">
                <!-- Populated by JS -->
            </ul>
        </div>
    </div>    `;
        document.body.insertAdjacentHTML('beforeend', admin_page);
        initSettings();
}



function scanUser() {
    // fills defualt columns
    let missing_data = fillNullsReturnFilled(user_details, {
        Queens_Level: 1, numbers_games: 0, numbers_max: 0, tetris_games: 0, tetris_max: 0, blockblast_games: 0,
        blockblast_max: 0, minesweeper_games: 0, minesweeper_score: 0, soduku_level: 1, dcoins: 0, LogInStreak: 0, bubbles_games: 0, bubbles_max: 0,tower_games:0,tower_max:0,wordle_games:0,
    })

    user_details.Modified = new Date(user_details.Modified);
    user_details.Created = new Date(user_details.Created);
    user_details["logs"] += 1;

    if ((user_details["logs"] % 25 == 0))
        saveActivityOnSP(`התחבר ל-Djet כבר ${user_details["logs"]} פעמים!`, "counter");
    missing_data["logs"] = user_details["logs"];

    applyColorScheme(user_details.LogInStreak);
    user_details["LogInStreak"] = calculateCurrentStreak();
    missing_data["LogInStreak"] = user_details["LogInStreak"];

    if (missing_data && Object.keys(missing_data).length > 0)
        updateSPValuesInList("Users", user_details["Id"], missing_data, true)



    if (user_details["username"] == null || user_details["unit"] == null) {
        hideLoadingScreen();
        
        // Check if user is Google authenticated
        const isGoogleAuth = window.isUserGoogleAuthenticated && window.isUserGoogleAuthenticated();
        if (!isGoogleAuth) {
            // Show Google sign-in prompt for first-time users
            showGoogleSignInPrompt();
        } else {
            // User is authenticated, show welcome modal for profile setup
            showWelcomeModal();
            updateWelcomeModalView();
        }
    }
    else {
        updateUserDisplay();
        updateStreakDisplay();
        setTimeout(() => triggerStreakAnimation(), 700);
        hideLoadingScreen();
        if (contacts_library.length > 0 && user_details.Modified < new Date(contacts_library[0].Modified))
            count_newcontacts = 1;
        updateNotifBadge();
    }

}




function calculateCurrentStreak() {

    const today = new Date();
    const daysSinceLastLog = getDaysBetweenDates(user_details["Modified"], today);
    if (daysSinceLastLog == 0) {
        if (user_details["LogInStreak"] == 0) return 1;
        return user_details["LogInStreak"];
    } else
        if (daysSinceLastLog < 50) {

            if ((user_details["LogInStreak"] + 1) % 5 == 0) {
                saveActivityOnSP(`התחבר ${(user_details["LogInStreak"] + 1)} ימים ברציפות`, "streak");
            }

            return user_details["LogInStreak"] + 1;
        } else {
            return 0;
        }
}




async function createUserOnSP() {
    const storedGoogleUid = window.getStoredDjetGoogleUid && window.getStoredDjetGoogleUid();
    const storedGoogleEmail = normalizeEmail(window.getStoredDjetGoogleEmail());
    let id = userId || localStorage.getItem('djet_user_id') || storedGoogleUid || `guest_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    if (storedGoogleUid) {
        const existingByUid = await findUserByGoogleUid(storedGoogleUid);
        if (existingByUid) {
            const existingId = existingByUid.Id || existingByUid.ID || id;
            id = existingId;
            userId = id;
            window.setStoredDjetUserId(id);
            return existingByUid;
        }
    }

    if (storedGoogleEmail) {
        const existingByEmail = await findUserByEmail(storedGoogleEmail);
        if (existingByEmail) {
            const existingId = existingByEmail.Id || existingByEmail.ID || id;
            id = existingId;
            userId = id;
            window.setStoredDjetUserId(id);
            return existingByEmail;
        }
    }

    if (!userId) {
        userId = id;
        window.setStoredDjetUserId(id);
    }

    const now = new Date().toISOString();
    const profile = user_details || {};
    const newUser = {
        Id: isNaN(Number(id)) ? id : Number(id),
        ID: isNaN(Number(id)) ? id : Number(id),
        Title: `${id}`,
        username: user_details.username || null,
        unit: user_details.unit || null,
        Created: now,
        Modified: now,
        dcoins: 0,
        LogInStreak: 0,
        logs: 0,
        Queens_Level: 1,
        numbers_games: 0,
        numbers_max: 0,
        tetris_games: 0,
        tetris_max: 0,
        blockblast_games: 0,
        blockblast_max: 0,
        minesweeper_games: 0,
        minesweeper_score: 0,
        soduku_level: 1,
        bubbles_games: 0,
        bubbles_max: 0,
        tower_games: 0,
        tower_max: 0,
        wordle_games: 0,
        streams: 0,
        liked: "",
        items: "",
        fluppyjet_games: 0,
        fluppyjet_max: 0,
        skyDome_games: 0,
        skyDome_maxS: 0,
        skyDome_maxT: 0,
        longArm_games: 0,
        longArm_max: 0,
        Email: storedGoogleEmail || null,
        GoogleUid: storedGoogleUid || null,
    };

    if (!await window.isRealtimeDbOnline?.()) {
        window.localStorage.setItem('djet_user_name', newUser.username || '');
        window.localStorage.setItem('djet_user_unit', newUser.unit || '');
        window.storeLocalDjetUserProfile(newUser);
        return newUser;
    }
    const userRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/Users/${normalizeId(id)}`);
    await window.firebaseRTDB.set(userRef, newUser);
    window.storeLocalDjetUserProfile(newUser);
    return newUser;
}

function thanksShare() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = Number(urlParams.get('shareId'));
    let username = urlParams.get('shareName');
    if (id != 0 && username != null) {
        saveTransactionOnSP("transaction", 0, "DBank", id, username, 50, "שיתוף DJET");
        //saveTransactionOnSP("transaction", 0, "DBank", user_details["Id"], user_details["username"], 10, "שיתוף DJET");

    }
}

const textarea = document.createElement('textarea');
textarea.style.opacity = '0';
textarea.style.position = "fixed";
textarea.style.zIndex = `-1`;
document.body.appendChild(textarea);

function copyShareLink() {
    let url = `https://ronkunin.github.io/DJET/?shareId=${user_details["Id"]}&shareName=${encodeURIComponent(user_details["username"])}`;

    textarea.value = url;
    textarea.focus();
    textarea.select();
    //notify("copy","הקישור הועתק");
    showSystemNotification("success", "הקישור הועתק");
    return new Promise((res, rej) => {
        document.execCommand('copy') ? res() : rej();
    })

}