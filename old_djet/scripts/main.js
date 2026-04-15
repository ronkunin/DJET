let site_url = `http://spellcaster.sites.airnet/DJet`;
let playlist = [];
let playlistData = null;
let results = [];
let results_playlist = [];
let song_index_playlist = 0;
let max_results = 15;
let mode = "none"; //shuffle, loop, radio, none
const DEV_MODE = false; //boolean value, SHOULD BE TURNED ON WHEN PUBLISHING

let white_list = [];
let black_list = [];

let userId, userEmail, userTitle;

// Get audio element safely
let audio = null;
setTimeout(() => {
    audio = document.getElementById("timeline");
}, 100);

async function load_user_id() {
    const user = window.firebaseRTDB.auth.currentUser;
    if (user) {
        userId = user.uid;
        userEmail = user.email ? user.email.toUpperCase() : '';
        userTitle = user.displayName || '';
    } else {
        // Guest user
        userId = `guest_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        userEmail = '';
        userTitle = 'Guest';
    }
}

async function onLoad() {
    // Wait for Firebase to be ready
    await window.firebaseReadyPromise;
    
    // Load user ID from Firebase auth
    await load_user_id();
    
    // Load user details using same method as START.js
    user_details = await loadUserById(userId);
    
    if (!user_details || !user_details.Id) {
        // Try to find user by Google UID
        const storedGoogleUid = window.getStoredDjetGoogleUid?.();
        if (storedGoogleUid) {
            const existingByUid = await findUserByGoogleUid(storedGoogleUid);
            if (existingByUid) {
                user_details = existingByUid;
                userId = existingByUid.Id || existingByUid.ID || userId;
                if (typeof window.setStoredDjetUserId === 'function') {
                    window.setStoredDjetUserId(userId);
                }
            }
        }
    }

    if (!user_details || !user_details.Id) {
        // Try to find user by email
        const storedGoogleEmail = window.getStoredDjetGoogleEmail?.();
        if (storedGoogleEmail) {
            const existingByEmail = await findUserByEmail(normalizeEmail(storedGoogleEmail));
            if (existingByEmail) {
                user_details = existingByEmail;
                userId = existingByEmail.Id || existingByEmail.ID || userId;
                if (typeof window.setStoredDjetUserId === 'function') {
                    window.setStoredDjetUserId(userId);
                }
            }
        }
    }

    // If still no user, create guest user
    if (!user_details || !user_details.Id) {
        console.warn('No user details found, using guest');
        user_details = {
            Id: userId || `guest_${Date.now()}`,
            username: 'Guest',
            unit: 'Guest',
            Modified: new Date(),
            Created: new Date(),
            fluppyjet_games: 0,
            fluppyjet_max: 0,
            skyDome_games: 0,
            skyDome_maxS: 0,
            skyDome_maxT: 0,
            longArm_games: 0,
            longArm_max: 0,
            streams: 0
        };
    }

    // Initialize user data with defaults if missing
    if (!user_details.fluppyjet_games) user_details.fluppyjet_games = 0;
    if (!user_details.fluppyjet_max) user_details.fluppyjet_max = 0;
    if (!user_details.skyDome_games) user_details.skyDome_games = 0;
    if (!user_details.skyDome_maxS) user_details.skyDome_maxS = 0;
    if (!user_details.skyDome_maxT) user_details.skyDome_maxT = 0;
    if (!user_details.longArm_games) user_details.longArm_games = 0;
    if (!user_details.longArm_max) user_details.longArm_max = 0;
    if (!user_details.streams) user_details.streams = 0;

    exit_loader();
    
    // Skip playlist/music loading
    // Music library, playlists, and search results remain empty
    
    // event listeners
    if (audio) {
        audio.addEventListener("ended", playNext);
    }
    window.addEventListener('keydown', key_click);
    
    // Setup results scroll listener if needed
    const resultsEl = document.getElementById("results");
    if (resultsEl) {
        resultsEl.addEventListener('scroll', function() {
            if(resultsEl.scrollHeight - resultsEl.scrollTop === resultsEl.clientHeight) {
                max_results += 5;
                show_results();
            }
        });
    }
}

function key_click(event) {
    if(event.key === " " && event.target.nodeName !== 'INPUT' && !document.getElementById("button_play").classList.contains('disable'))
        togglePlay();
    if(event.key === "ArrowRight" && event.target.nodeName !== 'INPUT' && !document.getElementById("button_next").classList.contains('disable'))
        playNext();
    if(event.key === "ArrowLeft" && event.target.nodeName !== 'INPUT' && !document.getElementById("button_prev").classList.contains('disable'))
        playPrevius();
}

function songFromId(id, source="library") {
    let data = (source=="results")? results:library;
    for(let  i = 0; i < data.length; i++) {
        if(data[i].id == id)
           return data[i];
    }
    return false;
}
function playlistFromId(id, source="library") {
    let data = (source=="results")? results_playlist:library_playlist;
    for(let  i = 0; i < data.length; i++) {
        if(data[i].id == id)
           return data[i];
    }
    return false;
}


async function logView (id, amount=1) {
    let current_views = await getSPValue("Songs","Views",id);
    updateSPValueInLibrary("Songs","Views",id,current_views+amount);
}

async function logViewList(id, amount=1) {
    let current_views = playlistFromId(id).views;
    updateSPValueInList("Playlists", "Views", id, (playlistData.views+amount), true);
}

function apply_dev_mode () {
    let body = document.querySelector("body");
    let admin_page = document.createElement("a");
    admin_page.innerHTML = `
        <img src="http://spellcaster.sites.airnet/DJet/icons/%D7%9E%D7%97%D7%95%D7%9C%D7%9C%20%D7%94%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA%20(arrow-left-long).png" style="width:60px; height:60px; border-radius:50%;">
    `;
    admin_page.setAttribute("href",`http://spellcaster.sites.airnet/DJet/DJet/index.html`);
    admin_page.setAttribute("style",`position:absolute; top:20px; left:20px; cursor:pointer`);
    body.appendChild(admin_page);
}
apply_dev_mode();

onLoad();