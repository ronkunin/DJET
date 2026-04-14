function create_logger() {
    const logging_delay_in_secs = 1;
    setTimeout(function () {
        let body = document.querySelector("body");
        let logger = document.createElement("iframe");
        logger.setAttribute("id", `logger${loggerNum}`);
        logger.setAttribute("style", "display:none");
        logger.setAttribute("src", `http://spellcaster.sites.airnet/DJet/SitePages/logger.aspx`);
        if (loggerNum == 0)
            logger.setAttribute("onload", `load_from_api();`); //logging
        else
            logger.setAttribute("onload", `loggerID="logger${loggerNum}";document.getElementById("${loggerID}").remove();`); //logging

        body.appendChild(logger);
    }, logging_delay_in_secs * 1000);
}
let loggerID = "logger0";
let loggerNum = 0;
let loggerTimeMin = 5;
create_logger();


let user_details;
let PREMISSIONS = [];       // {userEmail:Premission,....}
let PREMISSIONS_TYPE = [];  // {Premission:what it can do,....}

let library_messages = [];
let library_activity = [];
let library_users = [];
let library_transactions = [];
let library_gifs = [];

async function load_from_api() {
    // loads user and his premission to the site
    load_user_details();

    // (async () => {
    //     library_activity = await loadItemsFromSP("Activity", { select: "ID,name,unit,Created,type,message", top: 500, orderBy: "Created desc" });
    //     loadActivities();
    // })();


  // loadAPI_songs();
}

async function load_user_details() {

    // // get premissions
    // let data = await loadItemsFromSP("Settings", { select: "Title,value,permission,details", top: 100 });
    // data.forEach((value, index) => {
    //     if (value.Title === 'SOS' || value.value === 'SOS' || value.permission === 'SOS' || value.details === 'SOS')
    //         window.location.href = 'http://spellcaster.sites.airnet/DJet/DJet/main.html';
    //     if (value.Title === "רישוי")
    //         PREMISSIONS[value.value.toUpperCase() + "@IAF.IDF.IL"] = value.permission;
    //     if (value.Title === "סוג רישוי")
    //         PREMISSIONS_TYPE[value.permission] = value.value;
    // });

    // // get userID
    // await load_user_id();
    // // scan your premission
    // let keys = Object.keys(PREMISSIONS);
    // if (keys.includes(userEmail)) {
    //     if (PREMISSIONS[userEmail] === "מנהל DJET") {
    //         showSystemNotification("info", "מחובר כמנהל");
    //         scanForOverUse();
    //         (async () => {
    //             contacts_library = await loadItemsFromSP("Supports", {
    //                 select: `ID,username,unit,Modified,message,reply,rate,Created,AuthorId,Title`, top: 100, orderBy: "Modified desc",
    //             });
                
    //         })();
    //     }
    //     else if (PREMISSIONS[userEmail] === "נאמן DJET") {
    //         showSystemNotification("info", "מחובר כנאמן");
    //         (async () => {
    //             contacts_library = await loadItemsFromSP("Supports", {
    //                 select: `ID,username,unit,Modified,message,reply,rate,Created,AuthorId,Title`, top: 100, orderBy: "Modified desc",

    //             });
            

    //         })();

    //     }
    //     else if (PREMISSIONS[userEmail] === `חפ"ש DJET`) {
    //         showSystemNotification("info", `מחובר כחפ"ש`)
    //     }
    // }
    // else {
    //     PREMISSIONS[userEmail] = "משתמש DJET";
    //     (async () => {
    //         contacts_library = await loadItemsFromSP("Supports", {
    //             select: `ID,username,unit,Modified,message,reply,rate,Created,AuthorId,Title`, top: 100, orderBy: "Modified desc",
    //             filter: `AuthorId eq ${userId}`
    //         });
            
    //     })();

    // }

    // if (PREMISSIONS_TYPE[PREMISSIONS[userEmail]].includes("Out")) {
    //     window.location.href = 'http://spellcaster.sites.airnet/DJet/DJet/main.html';
    //     return;
    // }
    // else
    //     if (PREMISSIONS_TYPE[PREMISSIONS[userEmail]].includes("Loader"))
    //         return;
    //     else
            buildSiteForPremission("Full");

    // user_details = (await loadItemsFromSP("Users", {
    //     select: `ID,username,unit,Modified,Queens_Level,Created,dcoins,LogInStreak,streams,liked,items,logs,fluppyjet_games,fluppyjet_max,skyDome_games,skyDome_maxS,skyDome_maxT,longArm_games,longArm_max,
    // numbers_games,numbers_max,tetris_games,tetris_max,blockblast_games,blockblast_max,minesweeper_games,minesweeper_score,soduku_level,bubbles_games,bubbles_max,tower_games,tower_max,wordle_games`, top: 1, filter: `AuthorId eq ${userId}`
    // }))[0];


    if (user_details === undefined) {
        user_details = {
            Id: null,
            username: "",
            unit: "",
            Modified: new Date(),
            Queens_Level: 0,
            Created: new Date(),
            dcoins: 0,
            LogInStreak: 0,
            streams: 0,
            liked: [],
            items: [],
            logs: [],
            fluppyjet_games: 0,
            fluppyjet_max: 0,
            skyDome_games: 0,
            skyDome_maxS: 0,
            skyDome_maxT: 0,
            longArm_games: 0,
            longArm_max: 0,
            numbers_games: 0,
            numbers_max: 0,
            tetris_games: 0,
            tetris_max: 0,
            blockblast_games: 0,
            blockblast_max: 0,
            minesweeper_games: 0,
            minesweeper_score: 0,
            soduku_level: 0,
            bubbles_games: 0,
            bubbles_max: 0,
            tower_games: 0,
            tower_max: 0,
            wordle_games: 0
        };
        hideLoadingScreen();
        showWelcomeModal();
    }
    else
        scanUser();

    (async () => {
        library_messages = await loadItemsFromSP("Messages", { select: "ID,AuthorId,name,text,verified,Created,unit", top: 100, orderBy: "Created desc" });
        library_messages.reverse();
        loadChatMessages();
        refreshFunctions();
        if (user_details.Modified < library_messages[library_messages.length - 1].Created && library_messages[library_messages.length - 1].AuthorId != userId)
            unreadMessages = 1;
        updateUnreadIndicator();

    })();

    (async () => {
        library_transactions = await loadItemsFromSP("Transactions", { select: "ID,Title,sender_id,sender_name,reciver_id,reciver_name,Created,amount,reason,status", top: 20, orderBy: "Created desc", filter: `reciver_id eq ${user_details['Id']} or sender_id eq ${user_details['Id']}` });
        await scanTransactions();
        updateTransferHistory();
    })();

    (async () => {
        library_users = await loadItemsFromSP("Users", {
            select: `ID,username,unit,Modified,Queens_Level,fluppyjet_games,fluppyjet_max,skyDome_games,skyDome_maxS,skyDome_maxT,longArm_games,longArm_max,
        numbers_games,numbers_max,tetris_games,tetris_max,blockblast_games,blockblast_max,minesweeper_games,minesweeper_score,soduku_level,bubbles_games,bubbles_max,tower_games,tower_max,wordle_games`, top: 10000, orderBy: "Modified desc",
            filter: "unit ne null and unit ne ''"
        });
        loadLeaderboards();
    })();

    (async () => {
        library_gifs = await loadItemsFromSP("Gifs", { select: "ID,FileRef,price,buyers_num,isPublic", top: 20 });
        loadAllGIFs();
        loadOwnedGifs();
        setupEventListeners();
    })();

    loadAPI_All_Playlists();

    setTimeout(onSessionExpired, 1000 * 60 * loggerTimeMin);
}

async function refreshFunctions() {
    while (true) {
        await load_new_messages();
        await load_new_activity();
        await load_new_transactions();
        await new Promise((resolve) => setTimeout(resolve, 5000))
    }
}
function initializeSite() {
    addLoadingScreen();
    showLoadingScreen();

    addWelcomeModal();
    addSettingsModal();

    addContactModal();

    addTransferModal();
    initializeTransfer();

    addLeaderBoardModal();
    initializeLeaderboards();

    addPurchaserModal();

    addPlaylistModal();

    initializeChat();

    initializeShop();
}
function buildSiteForPremission(premission) {
    if (premission.includes('Music') || premission.includes('Full') || premission.includes('Normal')) {
        document.getElementById("music-sec").style.display = 'flex';
        document.getElementById("music-but").style.display = 'block';
    }
    else
        switchTab("activity");

    if (premission.includes('Community') || premission.includes('Full') || premission.includes('Normal')) {
        document.getElementById("chat-sec").style.display = 'flex';
        document.getElementById("activity-sec").style.display = 'flex';
        document.getElementById("transfer-open-button").style.display = 'flex';
        document.getElementById("chat-but").style.display = 'block';
        document.getElementById("activity-but").style.display = 'block';
        document.getElementById("user-profile").style.display = 'flex';
        document.getElementById("leaderboards-link").style.display = 'block';
    }
    if (!(premission.includes('Music') || premission.includes('Community') || premission.includes('Full') || premission.includes('Normal'))) {
        document.getElementById("sidebar").style.display = 'none';
        document.getElementById("main-content").style.marginRight = "0px";
    }
    if (premission.includes("Full"))
        addAdminPage();


}
initializeSite();

function onSessionExpired() {
    minLOg = setInterval(() => {
        loggerNum++;
        create_logger();
        //showSystemNotification("warning", "יש לבצע רענון", "לאחר חצי שעה");
    }, loggerTimeMin * 60 * 1000)
}

async function scanForOverUse() {
    let scanOf = {"Transactions": 10000,"Messages": 7500, "Activity": 5000, "Rooms": 5000};
    for (let name in scanOf) {

        let count_response = await fetch(api + `/lists/getbytitle('${name}')/ItemCount`, {
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" }
        });
        let count_json = await count_response.json();
        let count = count_json.d.ItemCount;

        let num = count - scanOf[name];
        if (num > 0) {
            num = Math.min(750, num);
            if(num < 250)
                num+= 500;
            deleteOldest(name, num);
        }
    }
}