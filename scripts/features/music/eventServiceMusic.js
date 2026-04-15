let my_library_playlist = [];
let liked_playlist;

let library = [];

let library_playlist = [];
let library_highlights = [];

let playlist = [{
    id: 'djet',
    title: 'DJET',
    link: 'https://ronkunin.github.io/DJET/scripts/features/music/DJET.mp3'
}];
let playlistData = null;

let results = [];
let results_playlist = [];

let song_index_playlist = 0;
let audio = document.getElementById("timeline");
let max_results = 15;
let mode = "none"; //shuffle, loop, radio, none
let visual_mode = "song";
let loaded = -1;

async function loadAPI_songs() {
    audio.addEventListener("ended", playNext);
    audio.addEventListener("play", updatePlayButtonState);
    audio.addEventListener("pause", updatePlayButtonState);
    // event listeners
    // the playlist appearance .................................................................
    document.getElementById("results").addEventListener('scroll', function() {
    if(document.getElementById("results").scrollHeight - document.getElementById("results").scrollTop === document.getElementById("results").clientHeight) {
        max_results += 5;
        show_results();
    }
    });

    load_all_highlights_from_API ();

    let listName = "Songs";
    //getting the list's item-count
    let count_response = await fetch(api + `/lists/getbytitle('${listName}')/ItemCount`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let count_json = await count_response.json();
    let count = count_json.d.ItemCount;

    let response = await fetch(api + `/lists/getbytitle('${listName}')/items?$select=*,FileLeafRef&$top=${count}&$orderby=Views desc`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let json = await response.json();
    
    json.d.results.forEach((song,index) => {
        library.push({
            id: song.Id,
            title: song.FileLeafRef.slice(0,-4),
            link: `${site_url}/${listName}/${song.FileLeafRef}`,
            views: song.Views,
        });
    });
    show_highlights();

    // Initialize play button state
    updatePlayButtonState();
    disableBtn();
}

function updatePlayButtonState() {
    const btn = document.getElementById('button_play');
    if (!btn) return;
    if (playlist.length == 0) {
        btn.classList.add('disable');
    } else {
        btn.classList.remove('disable');
    }
    btn.innerHTML = audio && !audio.paused ? '<i class="fa fa-pause"></i>' : '<i class="fa fa-play"></i>';
}



async function load_all_highlights_from_API () {
    let listName = "Highlights";

    //getting the list's item-count
    let count_response = await fetch(api + `/lists/getbytitle('${listName}')/ItemCount`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let count_json = await count_response.json();
    let count = count_json.d.ItemCount;
    
    //getting the songs
    let response = await fetch(api + `/lists/getbytitle('${listName}')/items?&$top=${count}&$orderby=Must desc&$filter=Must ne true`,{
            method: "GET",
            headers: {"Accept": "application/json; odata=verbose"}
        });
        
    let json = await response.json();
    
    json.d.results.forEach((highlight, index) => {
        library_highlights.push({
            title: highlight.Title,
            id: highlight.Code,
            type: highlight.Type,
            must: highlight.Must,
            clicks: highlight.Clicks,
            id_hl: highlight.Id,
        });
    });

}

async function loadAPI_All_Playlists () {
    
    let listName = "Playlists";
    //getting the list's item-count
    try {
        let count_response = await fetch(api + `/lists/getbytitle('${listName}')/ItemCount`,{
            method: "GET",
            headers: {"Accept": "application/json; odata=verbose"}
        });
        if (!count_response.ok) {
            console.error(`Failed to fetch playlist count: ${count_response.status} ${count_response.statusText}`);
            return;
        }
        let count_json = await count_response.json();
        let count = count_json.d.ItemCount;

        //getting
        
        let filter =  `&$filter=(AuthorId eq ${userId} or isPublic ne true) and Title ne 'Deleted'`;
        if(PREMISSIONS_TYPE[PREMISSIONS[userEmail]] == 'Full')
            filter =  `&$filter=Title ne 'Deleted'`;
        let response = await fetch(api + `/lists/getbytitle('${listName}')/items?&$top=${count}&$orderby=Views desc${filter}`,{
                method: "GET",
                headers: {"Accept": "application/json; odata=verbose"}
            });
        
        if (!response.ok) {
            console.error(`Failed to fetch playlists: ${response.status} ${response.statusText}`);
            return;
        }
        
        let json = await response.json();
        let data;

        json.d.results.forEach((playlist, index) => {
            data = library_playlist;
            if(playlist.AuthorId == userId)
                data = my_library_playlist;

            data.push({
                id: playlist.Id,
                title: playlist.Title,
                string: playlist.Text,
                version: playlist.Version,
                views: playlist.Views,
                author: playlist.AuthorId,
                isPublic: playlist.isPublic,
            });
        });

        show_myplaylists();
    } catch (error) {
        console.error("Error loading playlists:", error);
    }
}

async function savePlaylistOnSP(title, string){
    let logger = document.getElementById(loggerID);
    if (logger == null) {return;} //page logger still did not load, we cancel the logging process
    let listName = "Playlists";
    let response = await fetch(api + `/lists/getbytitle('${listName}')/items`,{
        method: "POST",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose",
            "X-RequestDigest": logger.contentWindow.document.getElementById("__REQUESTDIGEST").value,
            "X-HTTP-Method": "POST"
        },
        body: JSON.stringify({
            "__metadata": {
                "type": `SP.Data.${listName}ListItem`
            },
            "Title": title,
            "Text": string,
            "Views": 0,
            "Version":0,
            "isPublic":true,
        })
    });
    let json = await response.json();
    
    playlistData = {
        "id": json.d.Id,
        "title": json.d.Title,
        "string": json.d.Text,
        "version": json.d.Version,
        "views": json.d.Views,
        "author": json.d.AuthorId,
        "isPublic": json.d.isPublic,
    };
    my_library_playlist.unshift(playlistData);
    show_myplaylists();
    visualise(true, false);

}

async function updateSPValueInLibrary(libraryName, columnName, itemID, newValue, force_data_save = false){
    let logger = document.getElementById(loggerID);
    if (logger == null) {return;} //page logger still did not load, we cancel the logging process
    let requestData = {
        '__metadata': {'type': `SP.Data.${libraryName}Item`}
    };
    requestData[columnName] = newValue;
    let response = await fetch(api + `/web/lists/getbytitle('${libraryName}')/items/getbyid(${itemID})`,{
        method: "POST",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose",
            "X-HTTP-Method": "MERGE",
            "IF-MATCH": "*",
            "X-RequestDigest": logger.contentWindow.document.getElementById("__REQUESTDIGEST").value,
        },
        body: JSON.stringify(requestData),
    });
}


async function logView(id, amount=1) {
    let current_views = await getSPValue("Songs","Views",id);
    updateSPValueInLibrary("Songs","Views",id,current_views+amount);
}
async function logViewList(id, amount=1) {
    let get_playlist = playlistFromId(id);
    get_playlist.views += amount;
    updateSPValueInList("Playlists", "Views", id, (get_playlist.views), true);
}

function spotlight_load(id, clicks, id_hl) {
    updateSPValueInList('Highlights', 'Clicks', id_hl, clicks, true);
    
}