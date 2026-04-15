const firebaseConfig = {
    apiKey: "AIzaSyAwXu6yPcMXuc3vArAXnxXbuTWmeigN_NI",
    authDomain: "djet-f5eec.firebaseapp.com",
    databaseURL: "https://djet-f5eec-default-rtdb.firebaseio.com",
    projectId: "djet-f5eec",
    storageBucket: "djet-f5eec.firebasestorage.app",
    messagingSenderId: "398697034924",
    appId: "1:398697034924:web:0ca8bf5ba412a4e4545b09",
    measurementId: "G-HLMNVK9D0Y"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
import {
    getDatabase,
    ref,
    get,
    set,
    update,
    remove,
    push
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

window.firebaseReady = false;
window.firebaseReadyPromise = (async () => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const database = getDatabase(app);

    window.firebaseRTDB = {
        app,
        analytics,
        database,
        ref,
        get,
        set,
        update,
        remove,
        push
    };
    window.firebaseReady = true;
})();

window.isBrowserOnline = () => typeof navigator !== 'undefined' ? navigator.onLine : true;
window.isRealtimeDbOnline = async () => {
    if (!window.isBrowserOnline()) return false;
    if (!window.firebaseReadyPromise) return false;
    try {
        await window.firebaseReadyPromise;
        return Boolean(window.firebaseRTDB);
    } catch {
        return false;
    }
};
window.getStoredDjetUserId = () => window.localStorage.getItem('djet_user_id');
window.setStoredDjetUserId = id => {
    if (!id) return id;
    window.localStorage.setItem('djet_user_id', id);
    return id;
};
window.getStoredDjetUserName = () => window.localStorage.getItem('djet_user_name') || '';
window.getStoredDjetUserUnit = () => window.localStorage.getItem('djet_user_unit') || '';
window.storeLocalDjetUserProfile = profile => {
    if (!profile) return;
    if (profile.Id) window.localStorage.setItem('djet_user_id', String(profile.Id));
    if (profile.username) window.localStorage.setItem('djet_user_name', profile.username);
    if (profile.unit) window.localStorage.setItem('djet_user_unit', profile.unit);
};
