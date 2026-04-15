// Firebase Realtime Database utilities for old_djet
let library = [];
let library_playlist = [];
let user_details;
let PREMISSIONS = [];       // {userEmail:Premission,....}
let PREMISSIONS_TYPE = [];  // {Premission:what it can do,....}

// Skip loading songs/playlists - focused on user data
async function load_innit_songs_from_API () {
    // Music loading skipped - using Firebase user data instead
    // onLoad will be called from main.js
}

// Firebase helper functions

function normalizeId(id) {
    return isNaN(Number(id)) ? String(id) : String(Number(id));
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

// Helper function to evaluate filter conditions
function evaluateFilter(item, filter) {
    // Simple filter implementation for common patterns
    if (filter.includes(' eq ')) {
        const [leftPart, rightPart] = filter.split(' eq ');
        const field = leftPart.trim();
        const value = rightPart.trim().replace(/['"]/g, '');
        return String(item[field]) === String(value);
    }
    
    if (filter.includes(' ne ')) {
        const [leftPart, rightPart] = filter.split(' ne ');
        const field = leftPart.trim();
        const value = rightPart.trim().replace(/['"]/g, '');
        return String(item[field]) !== String(value);
    }
    
    return true;
}

// Get Firebase snapshot of a list
async function firebaseListSnapshot(listName) {
    try {
        const listRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/${listName}`);
        const snapshot = await window.firebaseRTDB.get(listRef);
        return snapshot.exists() ? snapshot.val() : {};
    } catch (err) {
        console.warn('Realtime DB snapshot failed', err);
        return {};
    }
}

// Load items from Firebase
async function loadItemsFromSP(listName, options = {}) {
    if (!await window.isRealtimeDbOnline?.()) return [];
    const {
        select = "",
        filter = "",
        orderBy = "",
        top = 5000
    } = options;

    const rawItems = await firebaseListSnapshot(listName);
    let items = Object.entries(rawItems).map(([key, item]) => {
        const normalized = { ...item };
        normalized.Id = normalized.Id !== undefined ? normalized.Id : isNaN(Number(key)) ? key : Number(key);
        if (normalized.ID === undefined) normalized.ID = normalized.Id;
        return normalized;
    });

    if (filter) {
        items = items.filter(item => evaluateFilter(item, filter));
    }
    if (top && items.length > top) {
        items = items.slice(0, top);
    }

    return items;
}

// Get a specific value from Firebase
async function getSPValue(listName, columnName, itemID) {
    if (!await window.isRealtimeDbOnline?.()) return null;
    try {
        const itemRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/${listName}/${normalizeId(itemID)}`);
        const snapshot = await window.firebaseRTDB.get(itemRef);
        if (!snapshot.exists()) return null;
        const item = snapshot.val();
        if (columnName === 'ID') return item.Id;
        return item[columnName];
    } catch (err) {
        console.warn('Realtime DB getSPValue failed', err);
        return null;
    }
}

// Update a value in Firebase
async function updateSPValueInList(listName, columnName, itemID, newValue, force_data_save = false) {
    if (!await window.isRealtimeDbOnline?.()) return null;
    try {
        const itemRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/${listName}/${normalizeId(itemID)}`);
        const updateData = { [columnName]: newValue };
        if (columnName !== 'Modified') {
            updateData.Modified = new Date().toISOString();
        }
        await window.firebaseRTDB.update(itemRef, updateData);
    } catch (err) {
        console.warn('Realtime DB updateSPValueInList failed', err);
        return null;
    }
}

// Update multiple values in Firebase
async function updateSPValuesInList(listName, itemID, data, force_data_save = false) {
    if (!await window.isRealtimeDbOnline?.()) return null;
    try {
        const itemRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/${listName}/${normalizeId(itemID)}`);
        const updateData = { ...data };
        if (!Object.prototype.hasOwnProperty.call(updateData, 'Modified')) {
            updateData.Modified = new Date().toISOString();
        }
        await window.firebaseRTDB.update(itemRef, updateData);
    } catch (err) {
        console.warn('Realtime DB updateSPValuesInList failed', err);
        return null;
    }
}

// Find user by email
async function findUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !await window.isRealtimeDbOnline?.()) return null;
    const items = await loadItemsFromSP("Users", { filter: `Email eq '${normalizedEmail}'`, top: 1 });
    return items && items.length > 0 ? items[0] : null;
}

// Find user by Google UID
async function findUserByGoogleUid(uid) {
    if (!uid || !await window.isRealtimeDbOnline?.()) return null;
    const items = await loadItemsFromSP("Users", { filter: `GoogleUid eq '${uid}'`, top: 1 });
    return items && items.length > 0 ? items[0] : null;
}

// Load a specific user by ID
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

// Log activity to Firebase
async function log(title, message, force_data_save = false) {
    if (!await window.isRealtimeDbOnline?.()) return null;
    try {
        const logsRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/Logs`);
        await window.firebaseRTDB.push(logsRef, {
            title: title,
            message: message,
            userId: userId,
            Created: new Date().toISOString()
        });
    } catch (err) {
        console.warn('Log failed', err);
    }
}

// Skip loading playlists - focused on user data
async function load_all_playlists_from_API () {
    // Playlists loading skipped
}
