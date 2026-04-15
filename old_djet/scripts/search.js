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
        <p class="title" onclick='addPlayLast(songFromId(${song.id}))'>${song.title}</p>
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
        let indicator_hue = (Math.sin((i-1) * indicator_hue_speed)+1)*75 + 140;
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
    /*
    for(let i = 0; i < Math.min(max_results,results_playlist.length); i++) {
        let indicator_hue = (Math.sin((i-1) * indicator_hue_speed)+1)*75 + 140;
        code += `
        <div class='option'>
            <i class="indicator fa fa-list-alt" style="color: hsl(${indicator_hue}deg ,75%, 60%);"></i>
            <p class="title" onclick='loadPlaylist(playlistFromId(${results_playlist[i].id})); logViewList(${results_playlist[i].id})'>${results_playlist[i].title}</p>
        </div>
        `;
    }*/
    if (results.length == 0 && results_playlist.length == 0) {
        code = `<div class="center" style="margin-top: 5px;font-size: 20px;">אזל במלאי, נסה לחפש שיר אחר</div>`;
    }
    document.getElementById("results").innerHTML = code;
    document.getElementById("results").classList.add('shown');

}