const INNIT_SONGS_COUNT = 200;

async function load_innit_songs_from_API () {
    let listName = "Songs";

    //getting the songs
    let response = await fetch(api + `/lists/getbytitle('${listName}')/items?$select=*,FileLeafRef&$top=${INNIT_SONGS_COUNT}&$orderby=Views desc`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let json = await response.json();

    library = json.d.results.map((song) => {return {
        id: song.Id,
        title: song.FileLeafRef.slice(0,-4),
        link: `${site_url}/${listName}/${song.FileLeafRef}`,
    }});

    onLoad();
    load_all_songs_from_API();
    load_all_playlists_from_API();

    
}

async function load_all_songs_from_API () {
    let listName = "Songs";

    //getting the list's item-count
    let songCount_response = await fetch(api + `/lists/getbytitle('${listName}')/ItemCount`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let songCount_json = await songCount_response.json();
    let songCount = songCount_json.d.ItemCount;

    //getting the songs
    let response = await fetch(api + `/lists/getbytitle('${listName}')/items?$select=*,FileLeafRef&$top=${songCount}&$orderby=Views desc`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let json = await response.json();
    
    json.d.results.forEach((song,index) => {
        if(index < INNIT_SONGS_COUNT) return;
        library.push({
            id: song.Id,
            title: song.FileLeafRef.slice(0,-4),
            link: `${site_url}/${listName}/${song.FileLeafRef}`,
            views: song.Views,
        });
    });

    onLoad();
}

load_innit_songs_from_API();

async function log(title, details, force_data_save = false){
    if (DEV_MODE && !force_data_save) {return;}
    let logger = document.getElementById("logger");
    if (logger == null) {return;} //page logger still did not load, we cancel the logging process
    let listName = "Logs";
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
            "details": details
        })
    });
    let json = await response.json();
}
async function newValueSPValueInLibrary(libraryName, value, force_data_save = false){
    if (DEV_MODE && !force_data_save) {return;}
    let logger = document.getElementById("logger");
    if (logger == null) {return;} //page logger still did not load, we cancel the logging process
    // let requestData = {
    //     '__metadata': {'type': `SP.Data.${libraryName}Item`}
    // };
    // requestData[columnName] = newValue;
    let response = await fetch(api + `/web/lists/getbytitle('${libraryName}')/items`,{
        method: "POST",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose",
            "X-HTTP-Method": "POST",
            "X-RequestDigest": logger.contentWindow.document.getElementById("__REQUESTDIGEST").value,
        },
        body: JSON.stringify({
            "__metadata": {
                "type": `SP.Data.${libraryName}ListItem`
            },
            "Title": title,
            "details": details
        }),
    });
}


async function createNewSong(){

    let file = document.getElementById('file_input').files[0];
    let logger = document.getElementById("logger");
    if (logger == null) {return;} //page logger still did not load, we cancel the logging process
    let libraryName = "Songs";
    
    const endpointURL = api + `/lists/getbytitle('${libraryName}')/RootFolder/Files/add(url='${file.name}', overwrite=false)`;
    const reader = new FileReader();
    reader.onload = readSuccess;
    function readSuccess (e) {
        console.log("hi");
        const fileContent = e.target.result;
        const fileBlob = new Blob([fileContent]);

        const metadata = {
            "__metadata": {
                "type": 'SP.Data.DocumentItem'
            },
            "Title":file.name,
            "FileName":file.name,
            "Views": 0
        }
    
        const formData = new FormData();
        formData.append("file",fileBlob,file.name);
        formData.append("data",JSON.stringify(metadata));
        
        fetch(endpointURL,{
            method: "POST",
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose",
                "X-RequestDigest": logger.contentWindow.document.getElementById("__REQUESTDIGEST").value,
                "X-HTTP-Method": "POST"
            },
            body: formData
        });
    };
}


// async function createNewSong(){

//     let file = document.getElementById('file_input').files[0];
//     let logger = document.getElementById("logger");
//     if (logger == null) {return;} //page logger still did not load, we cancel the logging process
//     let libraryName = "Songs";
    
//     const endpointURL = api + `/lists/getbytitle('${libraryName}')/RootFolder/Files/add(url='${file.name}', overwrite=false)`;
//     const reader = new FileReader();
//     let base64String;
//     reader.onload = function(e) {
//         console.log("1234");
//         const arrayBuffer = reader.result;
//         const byteArray = new Uint8Array(arrayBuffer);
//         base64String = btoa(String.fromCharCode.apply(null, byteArray));
//     };
    
    
//     let response = await fetch(endpointURL,{
//         method: "POST",
//         headers: {
//             "Accept": "application/json; odata=verbose",
//             "Content-Type": "application/json; odata=verbose",
//             "X-RequestDigest": logger.contentWindow.document.getElementById("__REQUESTDIGEST").value,
//             "X-HTTP-Method": "POST"
//         },
//         body: JSON.stringify({
//             "__metadata": {
//                 "type": 'SP.File'
//             },
//             "FileName":file.name,
//             "Content": base64String,
//             "Views": 0
//         })
//     });
//     let json = await response.json();
// }

async function updateSPValueInList(listName, columnName, itemID, newValue, force_data_save = false){
    if (DEV_MODE && !force_data_save) {return;}
    let logger = document.getElementById("logger");
    if (logger == null) {return;} //page logger still did not load, we cancel the logging process    
    let requestData = {
        '__metadata': {'type': `SP.Data.${listName}ListItem`}
    };
    requestData[columnName] = newValue;
    let response = await fetch(api + `/web/lists/getbytitle('${listName}')/items/getbyid(${itemID})`,{
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

async function updateSPValueInLibrary(libraryName, columnName, itemID, newValue, force_data_save = false){
    if (DEV_MODE && !force_data_save) {return;}
    let logger = document.getElementById("logger");
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


async function getSPValue(listName, columnName, itemID){
    let api = `${site_url}/_api`;

    //getting the list's item-count
    let response = await fetch(api + `/lists/getbytitle('${listName}')/items(${itemID})?$select=${columnName}`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });

    let json = await response.json();
    return json.d[columnName];
}







async function load_all_playlists_from_API () {
    
    let listName = "Playlists";

    //getting the list's item-count
    let playlistCount_response = await fetch(api + `/lists/getbytitle('${listName}')/ItemCount`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let playlistCount_json = await playlistCount_response.json();
    let playlistCount = playlistCount_json.d.ItemCount;

    //getting the songs
    let filter =  (DEV_MODE) ? `` : `&$filter=AuthorId eq ${userId} or isPublic ne true`;
    let response = await fetch(api + `/lists/getbytitle('${listName}')/items?&$top=${playlistCount}&$orderby=Views desc${filter}`,{
            method: "GET",
            headers: {"Accept": "application/json; odata=verbose"}
        });
        
    let json = await response.json();
    
    json.d.results.forEach((playlist, index) => {
        library_playlist.push({
            id: playlist.Id,
            title: playlist.Title,
            string: playlist.Text,
            version: playlist.Version,
            views: playlist.Views,
            author: playlist.AuthorId,
            isPublic: playlist.isPublic,
        });
    });

    onLoad();
}

async function savePlaylistOnSP(title, string, isPublic, force_data_save = false){
    //if (DEV_MODE && !force_data_save) {return;}
    let logger = document.getElementById("logger");
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
            "isPublic":isPublic,
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
}
let user_details;
let PREMISSIONS = [];       // {userEmail:Premission,....}
let PREMISSIONS_TYPE = [];  // {Premission:what it can do,....}


let userEmail;
let userTitle;

async function load_user_id() {
    let response = await fetch(api + `/web/currentuser`, {
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" }
    });
    let json = await response.json();

    userEmail = json.d.Email.toUpperCase();
    userId = json.d.Id;
    userTitle = json.d.Title;
}
async function loadItemsFromSP(listName, options = {}) {
    let {
        select = "",
        filter = "",
        orderBy = "",
        top = 5000
    } = options;

    let url = api + `/lists/getbytitle('${listName}')/items?$select=${select}&$top=${top}`
    if (filter) url += `&$filter=${encodeURIComponent(filter)}`;
    if (orderBy) url += `&$orderby=${orderBy}`;

    let response = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" }
    });
    if (!response.ok) {
        showSystemNotification("error", "שגיאה בטעינה, תבצע רענון")
        return;
    }
    let json = await response.json();

    let data = json.d.results.map(item => {
        const { __metadata, ...rest } = item;
        return rest;
    });

    return data;
}