const site_url = `http://spellcaster.sites.airnet/DJet`;
const site_url2 = `/DJet/newDjet/main.html`;
const api = `${site_url}/_api`;
let user_details;
let library_top = [];

let userEmail;
let userId;
let userTitle;

function isBrowserOnline() {
    return window.isBrowserOnline ? window.isBrowserOnline() : (typeof navigator !== 'undefined' ? navigator.onLine : true);
}

async function isRealtimeDbOnline() {
    return window.isRealtimeDbOnline ? await window.isRealtimeDbOnline() : false;
}

function getStoredUserId() {
    return window.localStorage.getItem('djet_user_id');
}

function setStoredUserId(id) {
    if (!id) return id;
    window.localStorage.setItem('djet_user_id', id);
    return id;
}

function getStoredUserName() {
    return window.localStorage.getItem('djet_user_name') || 'חייל';
}

function getStoredUserUnit() {
    return window.localStorage.getItem('djet_user_unit') || 'חיל האוויר';
}

function getOrCreateLocalUserId() {
    let id = getStoredUserId();
    if (!id && window._spPageContextInfo?.userId) {
        id = String(window._spPageContextInfo.userId);
    }
    if (!id) {
        id = `guest_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    }
    return setStoredUserId(id);
}

function buildIdFilter(id) {
    if (id === null || id === undefined) return '';
    const normalized = String(id);
    if (/^-?\d+$/.test(normalized)) {
        return `Id eq ${normalized}`;
    }
    return `Id eq '${normalized.replace(/'/g, "''")}'`;
}

function getOfflineUserProfile() {
    const id = getOrCreateLocalUserId();
    return {
        Id: id,
        ID: id,
        Title: `${id}`,
        username: getStoredUserName(),
        unit: getStoredUserUnit(),
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
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
    };
}

async function load_from_api() {
    // loads user and his premission to the site
    await load_user_details();
    showScreen();
    hideLoadingScreen();
}


async function load_user_details() {

    let data = [];
    try {
        data = await loadItemsFromSP("Settings", { select: "Title,value,permission,details", top: 100 });
    } catch (err) {
        console.warn('Settings load failed', err);
    }
    data.forEach((value) => {
        if (value.Title === 'SOS' || value.value === 'SOS' || value.permission === 'SOS' || value.details === 'SOS') {
            if (isBrowserOnline()) {
                window.location.href = 'http://spellcaster.sites.airnet/DJet/DJet/main.html';
            }
        }
    });

    await load_user_id();

    let userItems = [];
    try {
        userItems = await loadItemsFromSP("Users", {
            select: `ID,username,unit,Queens_Level,
    numbers_games,numbers_max,tetris_games,tetris_max,blockblast_games,blockblast_max,minesweeper_games,minesweeper_score,soduku_level,bubbles_games,bubbles_max,tower_games,tower_max,wordle_games`,
            top: 1,
            filter: buildIdFilter(userId)
        });
    } catch (err) {
        console.warn('User lookup failed', err);
    }

    user_details = userItems?.[0];
    if (user_details) {
        if (user_details.Id === undefined && user_details.ID !== undefined) {
            user_details.Id = user_details.ID;
        }
        if (user_details.ID === undefined && user_details.Id !== undefined) {
            user_details.ID = user_details.Id;
        }
    }

    if (!user_details) {
        user_details = getOfflineUserProfile();
        user_details.Id = userId;
        user_details.ID = userId;
        if (await isRealtimeDbOnline()) {
            const created = await addItemToList("Users", user_details);
            if (created) {
                user_details = created;
            }
        }
    }

    fillNullsReturnFilled(user_details, {
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
        dcoins: 0,
        LogInStreak: 0,
        logs: 0
    });
}

async function load_user_id() {
    userId = getOrCreateLocalUserId();
    userEmail = (window._spPageContextInfo?.userEmail || getStoredUserName() || '').toUpperCase();
    userTitle = window._spPageContextInfo?.userDisplayName || getStoredUserName() || '';
}

async function updateSPValueInList1(listName, columnName, itemID, newValue) {
    let requestData = { [columnName]: newValue };
    return updateSPValuesInList(listName, itemID, requestData);
}
async function updateSPValueInList2(listName, columnName, columnName2, itemID, newValue, newValue2) {
    let requestData = { [columnName]: newValue, [columnName2]: newValue2 };
    return updateSPValuesInList(listName, itemID, requestData);
}

function normalizeId(id) {
    return String(id);
}

function parseFilterValue(value) {
    const trimmed = value.trim();
    if (/^'.*'$/.test(trimmed) || /^".*"$/.test(trimmed)) {
        return trimmed.slice(1, -1);
    }
    if (/^null$/i.test(trimmed)) return null;
    if (/^true$/i.test(trimmed)) return true;
    if (/^false$/i.test(trimmed)) return false;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    return trimmed;
}

function evaluateCondition(item, expression) {
    const substringMatch = expression.match(/^substringof\(['"](.+)['"],\s*([A-Za-z_][A-Za-z0-9_]*)\)$/i);
    if (substringMatch) {
        const [, needle, field] = substringMatch;
        return String(item[field] ?? '').includes(needle);
    }

    const match = expression.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+(eq|ne)\s+(.+)$/i);
    if (!match) {
        return false;
    }

    const [, field, operator, rawValue] = match;
    const fieldValue = item[field];
    const compareValue = parseFilterValue(rawValue);

    if (operator.toLowerCase() === 'eq') {
        return fieldValue == compareValue;
    }
    return fieldValue != compareValue;
}

function evaluateFilter(item, filter) {
    if (!filter) return true;
    const lower = filter.toLowerCase();
    if (lower.includes(' or ')) {
        return filter.split(/\s+or\s+/i).some(part => evaluateFilter(item, part));
    }
    if (lower.includes(' and ')) {
        return filter.split(/\s+and\s+/i).every(part => evaluateFilter(item, part));
    }
    return evaluateCondition(item, filter.trim());
}

function projectItem(item, select) {
    if (!select) return { ...item };
    const keys = select.split(',').map(key => key.trim()).filter(Boolean);
    const projected = {};
    keys.forEach(key => {
        if (key === 'ID') {
            projected.ID = item.ID !== undefined ? item.ID : item.Id;
            return;
        }
        if (key === 'Id') {
            projected.Id = item.Id !== undefined ? item.Id : item.ID;
            return;
        }
        if (item.hasOwnProperty(key)) {
            projected[key] = item[key];
        }
    });
    return projected;
}

function normalizeSortValue(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
        return new Date(value).getTime();
    }
    return value;
}

function sortItems(items, orderBy) {
    const parts = orderBy.trim().split(/\s+/);
    const field = parts[0];
    const direction = (parts[1] || 'asc').toLowerCase();

    return items.sort((a, b) => {
        const aValue = normalizeSortValue(a[field]);
        const bValue = normalizeSortValue(b[field]);

        if (aValue === bValue) return 0;
        const result = aValue > bValue ? 1 : -1;
        return direction === 'desc' ? -result : result;
    });
}

async function ensureFirebaseReady() {
    if (!window.firebaseReadyPromise) {
        throw new Error('Firebase is not initialized');
    }
    await window.firebaseReadyPromise;
    if (!window.firebaseRTDB || !await isRealtimeDbOnline()) {
        throw new Error('Firebase RTDB is not available');
    }
}

async function firebaseListSnapshot(listName) {
    if (!await isRealtimeDbOnline()) return {};
    try {
        await ensureFirebaseReady();
        const listRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/${listName}`);
        const snapshot = await window.firebaseRTDB.get(listRef);
        return snapshot.exists() ? snapshot.val() : {};
    } catch (err) {
        console.warn('Realtime DB snapshot failed', err);
        return {};
    }
}

async function updateSPValuesInList(listName, itemID, data, IF_MATCH = "*") {
    if (!await isRealtimeDbOnline()) {
        console.warn('Realtime DB offline, skipping updateSPValuesInList', listName, itemID);
        return null;
    }
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

// ==============================================
// LOADING SCREEN FUNCTIONS
// ==============================================

addLoadingScreen();
showLoadingScreen();
window.addEventListener('load', load_from_api);

// =============================================
// All ranks
// ==============================================

async function loadAPI_topPlayers(col) {
    library_top = await loadItemsFromSP("Users", {
        select: `ID,Queens_Level,numbers_max,tetris_max,blockblast_max,minesweeper_score,soduku_level,bubbles_max,${col}`, top: 5, orderBy: `${col} desc`
    });
}

async function saveActivityOnSP(message, type = "level_up") {
    //if(!user_details["username"]) return;
    addItemToList("Activity", {
        "name": user_details['username']? user_details['username']:"חייל",
        "unit": user_details['unit']? user_details['unit']:"חיל האוויר",
        "message": message,
        "type": type,
    });
}

async function addTransactionOnSP(amount, reason = "פעילות במערכת") {
    if (amount <= 1) return;
    addItemToList("Transactions", {
        "Title": "earnings",
        "sender_id": 0,
        "sender_name": "DBank",
        "reciver_id": user_details['Id'],
        "reciver_name": user_details['username']? user_details['username']:"חייל",
        "amount": amount,
        "reason": reason,
        "status": "Waiting",
    });
}

async function loadItemsFromSP(listName, options = {}) {
    if (!await isRealtimeDbOnline()) return [];
    let {
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
    if (orderBy) {
        items = sortItems(items, orderBy);
    }
    if (top && items.length > top) {
        items = items.slice(0, top);
    }
    if (select) {
        items = items.map(item => projectItem(item, select));
    }

    return items;
}

function fillNullsReturnFilled(data, map = {}) {
    const filled = {};
    for (const key in map) {
        if (data[key] === null || data[key] === undefined) {
            data[key] = map[key];
            filled[key] = map[key];
        }
    }
    return filled;
}

async function addItemToList(listName, fields) {
    if (!await isRealtimeDbOnline()) {
        console.warn('Realtime DB offline, skipping addItemToList', listName);
        return null;
    }
    try {
        const listRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/${listName}`);
        const now = new Date().toISOString();
        const item = {
            ...fields,
            Created: fields.Created || now,
            Modified: fields.Modified || now
        };

        if (item.Id !== undefined && item.Id !== null) {
            const itemRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/${listName}/${normalizeId(item.Id)}`);
            item.ID = item.Id;
            await window.firebaseRTDB.set(itemRef, item);
            return item;
        }

        const newRef = window.firebaseRTDB.push(listRef);
        item.Id = isNaN(Number(newRef.key)) ? newRef.key : Number(newRef.key);
        item.ID = item.Id;
        await window.firebaseRTDB.set(newRef, item);
        return item;
    } catch (err) {
        console.warn('Realtime DB addItemToList failed', err);
        return null;
    }
}


async function createRoomOnSp(game) {
    return addItemToList("Rooms", {
        "playerName": user_details['username']? user_details['username']:"חייל",
        "playerUnit": user_details['unit']? user_details['unit']:"חיל האוויר",
        "playerID": user_details['Id'],
        "gameStatus": "waiting",
        "gameInfo": "",
        "Title": game,
    });
}