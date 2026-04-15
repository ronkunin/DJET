const site_url = ``;
const site_url2 = `/DJet/newDjet/main.html`;
const api = `${site_url}/_api`;

let userEmail;
let userId;
let userTitle;

function isBrowserOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

async function isRealtimeDbOnline() {
    if (!isBrowserOnline()) return false;
    if (!window.firebaseReadyPromise) return false;
    try {
        await window.firebaseReadyPromise;
        return Boolean(window.firebaseRTDB);
    } catch {
        return false;
    }
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
    return window.localStorage.getItem('djet_user_name') || '';
}

function getStoredUserUnit() {
    return window.localStorage.getItem('djet_user_unit') || '';
}

function ensureLocalUserId() {
    let id = getStoredUserId();
    const storedGoogleUid = window.getStoredDjetGoogleUid && window.getStoredDjetGoogleUid();
    if (!id && storedGoogleUid) {
        id = String(storedGoogleUid);
    }
    if (window._spPageContextInfo?.userId) {
        id = String(window._spPageContextInfo.userId);
    }
    if (!id) {
        id = `guest_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    }
    return setStoredUserId(id);
}

async function load_user_id() {
    userId = ensureLocalUserId();
    userEmail = (window._spPageContextInfo?.userEmail || window.getStoredDjetGoogleEmail() || getStoredUserName() || '').toUpperCase();
    userTitle = window._spPageContextInfo?.userDisplayName || window.getStoredDjetGoogleDisplayName() || getStoredUserName() || '';
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
            projected.ID = item.Id;
            return;
        }
        if (key === 'Id') {
            projected.Id = item.Id;
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

async function loadItemsFromSP(listName, options = {}) {
    if (!await isRealtimeDbOnline()) return [];
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

async function getSPValue(listName, columnName, itemID) {
    if (!await isRealtimeDbOnline()) return null;
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

async function updateSPValuesInList(listName, itemID, data, force_data_save = false) {
    if (!await isRealtimeDbOnline()) return null;
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

async function updateSPValueInList(listName, columnName, itemID, newValue, force_data_save = false) {
    const requestData = { [columnName]: newValue };
    return updateSPValuesInList(listName, itemID, requestData, true);
}

async function updateSPValueInList2(listName, columnName, columnName2, itemID, newValue, newValue2, force_data_save = false) {
    const requestData = { [columnName]: newValue, [columnName2]: newValue2 };
    return updateSPValuesInList(listName, itemID, requestData, true);
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

async function deleteItemInSP(listName, itemID) {
    if (!await isRealtimeDbOnline()) {
        console.warn('Realtime DB offline, skipping deleteItemInSP', listName, itemID);
        return null;
    }
    try {
        const itemRef = window.firebaseRTDB.ref(window.firebaseRTDB.database, `lists/${listName}/${normalizeId(itemID)}`);
        await window.firebaseRTDB.remove(itemRef);
    } catch (err) {
        console.warn('Realtime DB deleteItemInSP failed', err);
        return null;
    }
}

async function deleteOldest(listName, top2 = 10, filter2) {
    if (PREMISSIONS_TYPE[PREMISSIONS[userEmail]] != "Full")
        return;
    if (listName === "Transactions")
        filter2 = `status eq 'Finished'`;
    let library_old = await loadItemsFromSP(listName, { select: `ID,Modified`, top: top2, orderBy: "Modified asc", filter: filter2 });
    if (top2 > library_old.length || listName == "Users") { console.log("רון חסם את האפשרות"); return; }
    for (let i = 0; i < library_old.length; i++) {
        await deleteItemInSP(listName, library_old[i].ID);
        console.log(i + " --> " + library_old[i].ID + " Deleted");
    };
    console.log("Done!");
    showSystemNotification("info", `${top2} נמחקו ב-${listName}!`)
}
