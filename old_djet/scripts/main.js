let site_url = `http://spellcaster.sites.airnet/DJet`;
let api = `${site_url}/_api`;
let userId;

let library = [];
let library_playlist = [];

let playlist = [];
let playlistData = null;

let results = [];
let results_playlist = [];

let song_index_playlist = 0;
let audio = document.getElementById("timeline");
let max_results = 15;
let mode = "none"; //shuffle, loop, radio, none
const DEV_MODE = false; //boolean value, SHOULD BE TURNED ON WHEN PUBLISHING


let white_list = [];
let black_list = [];
async function onLoad() {
    await load_user_id();
     // get premissions
     let data = await loadItemsFromSP("Settings", { select: "Title,value,permission,details", top: 100 });
     data.forEach((value, index) => {
         if (value.Title === 'SOS' || value.value === 'SOS' || value.permission === 'SOS' || value.details === 'SOS')
             window.location.href = 'http://spellcaster.sites.airnet/DJet/DJet/main.html';
         if (value.Title === "רישוי")
             PREMISSIONS[value.value.toUpperCase() + "@IAF.IDF.IL"] = value.permission;
         if (value.Title === "סוג רישוי")
             PREMISSIONS_TYPE[value.permission] = value.value;
     });

     exit_loader();

    let keys = Object.keys(PREMISSIONS);
    if (keys.includes(userEmail)) {
        if (PREMISSIONS[userEmail] === "מנהל DJET") {
            notify("info", "מחובר כמנהל");
        }
        else if (PREMISSIONS[userEmail] === "נאמן DJET") {
            notify("info", "מחובר כנאמן");
        }
        else  if (PREMISSIONS[userEmail] === `חפ"ש DJET`) {
            notify("info", `מחובר כחפ"ש`)
        }
    }
    else
        PREMISSIONS[userEmail] = "משתמש DJET";

    if(PREMISSIONS_TYPE[PREMISSIONS[userEmail]].includes("Out"))
        window.location.href = 'http://spellcaster.sites.airnet/DJet/DJet/main.html';
    if(PREMISSIONS_TYPE[PREMISSIONS[userEmail]].includes("Loader"))
        return;


    user_details = (await loadItemsFromSP("Users", {
        select: `ID,username,unit,streams,liked,logs,fluppyjet_games,fluppyjet_max,skyDome_games,skyDome_maxS,skyDome_maxT,longArm_games,longArm_max`, top: 1, filter: `AuthorId eq ${userId}`
    }))[0];

    if (user_details === undefined) {
        window.location.href = 'http://spellcaster.sites.airnet/DJet/DJet/index.html';
    }


    // create first random playlist
    if (DEV_MODE) {
        for(let i = 0; i < 4; i++) {
            let song = library[Math.floor((Math.random()*library.length))];
            playlist.push(song);
        }
        audio.src = playlist[song_index_playlist].link;
        document.getElementById("song_title").textContent = playlist[song_index_playlist].title;
        changeMode("none");
        visualise();
    }

    


    // event listeners
    audio.addEventListener("ended", playNext);
    window.addEventListener('keydown', key_click);
    // the playlist appearance .................................................................
    document.getElementById("results").addEventListener('scroll', function() {
    if(document.getElementById("results").scrollHeight - document.getElementById("results").scrollTop === document.getElementById("results").clientHeight) {
        max_results += 5;
        show_results();
    }
});
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


function create_logger () {
    const logging_delay_in_secs = 1;
    setTimeout(function() {
        let body = document.querySelector("body");
        let logger = document.createElement("iframe");
        logger.setAttribute("id","logger");
        logger.setAttribute("style","display:none");
        logger.setAttribute("src",`http://spellcaster.sites.airnet/DJet/SitePages/logger.aspx`);
        body.appendChild(logger);
    }, logging_delay_in_secs*1000);
}
create_logger();


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