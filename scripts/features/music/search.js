// enter pressed
document.getElementById("search").addEventListener('keypress', enter_press);

function enter_press(event) {
    if(event.key === "Enter")
    {
        document.getElementById("results").classList.remove('shown');

        find_songs();
        if(results.length > 0)
            updateCurrentSong(results[0].id);
    }
}
function search_press() {
    document.getElementById("results").classList.remove('shown');
    find_songs();
        if(results.length > 0)
            updateCurrentSong(results[0].id);
}
// click press
document.addEventListener('click', function(event) {
    let nav_input = document.getElementById('search');
    let result_lines = document.getElementById('results');
    if(!nav_input.contains(event.target) && !result_lines.contains(event.target)) {
        document.getElementById("results").classList.remove('shown');
        max_results = 10;
    }
    else show_results();
});

function find_songs() {
    let input_words = document.getElementById("search").value.toLowerCase().split(' ');
    results = [];
    for(let i = 0; i < library.length; i++) {
        let valid = true;
        for(let j = 0; j < input_words.length; j++) {
            if(!library[i].title.toLowerCase().includes(input_words[j]))
            {
                valid = false;
                break;
            }
        }
        if(valid)
            results.push(library[i]);
    }
}
function find_playlists() {
    let input_words = document.getElementById("search").value.toLowerCase().split(' ');
    results_playlist = [];
    for(let i = 0; i < library_playlist.length; i++) {
        let valid = true;
        for(let j = 0; j < input_words.length; j++) {
            if(!library_playlist[i].title.toLowerCase().includes(input_words[j]))
            {
                valid = false;
                break;
            }
        }
        if(valid)
            results_playlist.push(library_playlist[i]);
    }
}


function getSongOption(song, indicator_hue) {
    return `
    <div class='option'>
        <i class="indicator fa fa-music" style="color: hsl(${indicator_hue}deg ,75%, 60%);"></i>
        <p class="title" onclick='addPlayLast(songFromId(${song.id}));logView(${song.id});'>${song.title}</p>
        <div class="controls">
            <i class="fa fa-play" title="נגן כעת" onclick='addPlayLast(songFromId(${song.id}));logView(${song.id});'></i>
            <i class="fa fa-indent" title="נגן לאחר השיר הנוכחי" onclick='addNext(songFromId(${song.id}));logView(${song.id});'></i>
            <i class="fa fa-list" title="נגן בסוף רשימת ההשמעה" onclick='addLast(songFromId(${song.id}));logView(${song.id});'></i>
        </div>
    </div>
    `;
}
function getPlaylistOption(playlist, indicator_hue) {
    return `
    <div class='option'>
    <i class="indicator fa fa-list-alt" style="color: hsl(${indicator_hue}deg ,75%, 60%);"></i>
    <p class="title" onclick='loadPlaylist(playlistFromId(${playlist.id})); logViewList(${playlist.id})'>${playlist.title}</p>
    <div class="controls">
    <i class="fa fa-play" title="נגן כעת" onclick='loadPlaylist(playlistFromId(${playlist.id})); logViewList(${playlist.id})'></i>
    </div>
</div>
`;
}
function show_results() {
    find_songs();
    find_playlists();

    let code = "";
    const indicator_hue_speed = 0.1;
    for(let i=0, s=0, p=0; i < Math.min(max_results,results.length+results_playlist.length); i++) {
        let indicator_hue = (Math.sin((i-1) * indicator_hue_speed))*75;
        if(s < results.length && p < results_playlist.length) {
            if(results[s].views < results_playlist[p].views)
                {
                    code+= getPlaylistOption(results_playlist[p], indicator_hue);
                    p++;
                }
            else 
                {
                    code+= getSongOption(results[s], indicator_hue);
                    s++; 
                }
         }
         else {
            if(s < results.length) {
                code+= getSongOption(results[s], indicator_hue);
                s++; 
            }
            else {
                code+= getPlaylistOption(results_playlist[p], indicator_hue);
                p++;  
            }
         }

    }
    if (results.length == 0 && results_playlist.length == 0) {
        code = `<div class="center" style="margin-top: 5px;font-size: 20px;">אזל במלאי, נסה לחפש שיר אחר</div>`;
    }
    
    const resultsElement = document.getElementById("results");
    const resultsMobileElement = document.getElementById("results_mobile");
    
    if (resultsElement) {
        resultsElement.innerHTML = code;
        resultsElement.classList.add('shown');
    }
    if (resultsMobileElement) {
        resultsMobileElement.innerHTML = code;
        resultsMobileElement.classList.add('shown');
    }
}


function show_myplaylists() {
    const highlight_element = document.getElementById("myplaylists");
    const highlight_element_mobile = document.getElementById("myplaylists_mobile");
    
    // Function to show playlists in an element
    const showInElement = (element) => {
        element.style.overflowY = 'scroll';
        element.innerHTML = "";
        if (library_highlights.length == 0) {
            element.innerHTML += `<div style="justify-content: center; align-items: center; display: flex; width: 100%; height: 100%; position: relative;"><div class="loader"></div></div>`;
            return;
        }
        const indicator_hue_speed = 0.5;
        if(user_details["liked"] != null)
            element.innerHTML += `
            <li><div class='option' style='padding-bottom: ${pad}px;padding-top: ${pad}px;' >
            <i class="indicator fa fa-heart" style="color: hsl(${(Math.cos((0) * indicator_hue_speed))*75 + 10}deg ,75%, 60%);"></i>
            <p class="title" style='flex: initial' onclick="loadLikedPlaylist();">שירים שסימנתי בלייק</p>
            </div></li>
            `;
        my_library_playlist.forEach((item,index) => {
            if(item.title != 'Deleted')
            {
                let indicator_hue = (Math.cos((index-1) * indicator_hue_speed))*75 + 10;
                let li_element = document.createElement("li");
                
                li_element.innerHTML += my_playlist(item, indicator_hue);
                
                element.appendChild(li_element);
            }
        });
    };

    if (highlight_element) showInElement(highlight_element);
    if (highlight_element_mobile) showInElement(highlight_element_mobile);
}


function show_highlights() {
    const highlight_element = document.getElementById("highlight");
    const highlight_element_mobile = document.getElementById("highlight_mobile");
    
    // Function to show highlights in an element
    const showInElement = (element) => {
        element.style.overflowY = 'scroll';
        element.innerHTML = "";
        if (library_highlights.length == 0) {
            element.innerHTML += `<div style="justify-content: center; align-items: center; display: flex; width: 100%; height: 100%; position: relative;"><div class="loader"></div></div>`;
            return;
        }
        const indicator_hue_speed = 0.5;
        library_highlights.forEach((item,index) => {
            if(index >= 6 && !item.must)
                return;
            let indicator_hue = (Math.sin((index-1) * indicator_hue_speed))*75 + 10;
            let li_element = document.createElement("li");

            if (item.type.toLowerCase() == 'playlist')
                li_element.innerHTML += high_playlist(item, indicator_hue);
            if (item.type.toLowerCase() == 'song')
                li_element.innerHTML += high_song(item, indicator_hue);

            element.appendChild(li_element);
        });
    };

    if (highlight_element) showInElement(highlight_element);
    if (highlight_element_mobile) showInElement(highlight_element_mobile);
}
let pad = 11.7;
function my_playlist(playlist, indicator_hue){
    
    return `
<div class='option' style='padding-bottom: ${pad}px;padding-top: ${pad}px;' >
<i class="indicator fa fa-list-alt" style="color: hsl(${indicator_hue}deg ,75%, 60%);"></i>
<p class="title" style='flex: initial' onclick="loadPlaylist(myplaylistFromId(${playlist.id})); logViewList(${playlist.id});">${playlist.title}</p>
</div>
`;
}
function high_playlist(playlist, indicator_hue){
    
        return `
    <div class='option' style='padding-bottom: ${pad}px;padding-top: ${pad}px;' >
    <i class="indicator fa fa-list-alt" style="color: hsl(${indicator_hue}deg ,75%, 60%);"></i>
    <p class="title" style='flex: initial' onclick="loadPlaylist(playlistFromId(${playlist.id})); logViewList(${playlist.id}); spotlight_load('${playlist.id}', '${(playlist.clicks+1)}', '${playlist.id_hl}'); ">${playlist.title}  <sub>${playlistFromId(playlist.id).title}</sub></p>
    </div>
`;
}
function high_song(song, indicator_hue){
    
    return `
    <div class='option' style='padding-bottom: ${pad}px;padding-top: ${pad}px;'>
    <i class="indicator fa fa-music" style="color: hsl(${indicator_hue}deg ,75%, 60%);"></i>
    <p class="title" style='flex: initial' onclick="addPlayLast(songFromId(${song.id})); logView(${song.id}); updateSPValueInList('Highlights', 'Clicks', '${song.id_hl}', '${(song.clicks+1)}', true);">${song.title}<sub>${songFromId(song.id).title}</sub></p>
    </div>`;

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
    for(let  i = 0; i < my_library_playlist.length; i++) {
        if(my_library_playlist[i].id == id)
           return my_library_playlist[i];
    }
    return false;
}
function myplaylistFromId(id) {
    for(let  i = 0; i < my_library_playlist.length; i++) {
        if(my_library_playlist[i].id == id)
           return my_library_playlist[i];
    }
    return false;
}
