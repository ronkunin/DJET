// Storage Utilities - Local Storage helper functions
// Loaded before firebase to ensure availability

// User ID and Profile Storage
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

// Google Auth Storage Functions
window.getStoredDjetGoogleUid = () => window.localStorage.getItem('djet_google_uid');
window.setStoredDjetGoogleUid = uid => {
    if (!uid) {
        window.localStorage.removeItem('djet_google_uid');
        window.localStorage.removeItem('djet_google_email');
        window.localStorage.removeItem('djet_google_display_name');
        return;
    }
    window.localStorage.setItem('djet_google_uid', uid);
    return uid;
};
window.getStoredDjetGoogleEmail = () => window.localStorage.getItem('djet_google_email') || '';
window.getStoredDjetGoogleDisplayName = () => window.localStorage.getItem('djet_google_display_name') || '';
window.storeGoogleAuthData = user => {
    if (!user) {
        window.localStorage.removeItem('djet_google_uid');
        window.localStorage.removeItem('djet_google_email');
        window.localStorage.removeItem('djet_google_display_name');
        return;
    }
    window.localStorage.setItem('djet_google_uid', user.uid);
    window.localStorage.setItem('djet_google_email', user.email || '');
    window.localStorage.setItem('djet_google_display_name', user.displayName || '');
};
window.isUserGoogleAuthenticated = () => !!window.getStoredDjetGoogleUid();
