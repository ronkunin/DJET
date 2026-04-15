function renderPlaylist () {
    const playlist_element = document.getElementById("playlist");
    const indicator_element = document.getElementById("drop_indicator");
    playlist_element.innerHTML = `<div id="drop_indicator"></div>`;
    if (playlist.length == 0) {
        playlist_element.innerHTML += `<div class="center" ><img style="height:310px; user-select:none;" src="http://spellcaster.sites.airnet/DJet/Images1/innit_tutorial.png"></div>`;
        return;
    }
    playlist.forEach((item,index) => {
        let li_element = document.createElement("li");
        li_element.setAttribute("draggable","true");
        li_element.classList.add("playlist_song");
        if (song_index_playlist == index) {li_element.classList.add("playing");}
        li_element.innerHTML += `
        <div class="handle"><i class="fa fa-bars"></i><p>.${index+1}</p></div>
        <p class="title" onclick="song_index_playlist=${index};playNewSong();">${item.title}</p>
        <div class="song_controls"><i class="fa fa-trash" onclick="deleteSong(${index});"></i></div>
        <div class="play_indicators">
        <div></div><div></div><div></div>
        </div>
        `;
        
        //start dragging
        li_element.addEventListener("dragstart",(e)=>{
            e.dataTransfer.setData("text/plain",index);
        });

        //while dragging
        li_element.addEventListener("dragover",(e)=>{
            e.preventDefault();
            drop_indicator.classList.add("active");
            drop_indicator.style.top = `${(index+1)*50}px`;
        });

        //stop dragging
        li_element.addEventListener("drop",(e)=>{
            e.preventDefault();
            drop_indicator.classList.remove("active");
            let fromIndex = parseInt(e.dataTransfer.getData("text/plain"),10);
            let toIndex = index;

            if (fromIndex == toIndex) {return;}
            if (fromIndex > toIndex) {toIndex++;}

            if(fromIndex < song_index_playlist && toIndex >= song_index_playlist) // jump forward on top of this song
                song_index_playlist--;
            else
                if(fromIndex > song_index_playlist && toIndex <= song_index_playlist) // jump backward on top of this song
                    song_index_playlist++;
                else
                    if(fromIndex == song_index_playlist) // move this song
                        song_index_playlist = toIndex;
            playlist.splice(toIndex,0,playlist.splice(fromIndex,1)[0]);
            playlist_changed();
            visualise();
        });
        
        playlist_element.appendChild(li_element);

    });
}

function visualise(updatePlaylist=true, updateSong=false) {

    if(updateSong) {
        audio.src = playlist[song_index_playlist].link;
        document.getElementById("song_title").textContent = playlist[song_index_playlist].title;
    }
    document.getElementById("playlist_len").textContent = Math.max((song_index_playlist+((playlist.length==0)?0:1)),0) + "/" + playlist.length;
    renderPlaylist();
    disableBtn();


}

function loadPlaylist(new_playlist) {
    audio.pause();
    let arr = []
    if(new_playlist.string != null)
        arr = new_playlist.string.split(',').map(Number);
    playlist = [];
    song_index_playlist = 0;
    for (id of arr) {
        playlist.push(songFromId(id));
    }

    playlistData = new_playlist;
    document.getElementById("playlist_title").textContent = playlistData.title;
    if(playlistData.author == userId)
        document.getElementById("playlist_buttons").innerHTML = 
        `
        <button class="playlist_control" onclick="create_playlist_window();" title="פתח את הגדרות הפלייליסט">הגדרות<i class="fa fa-save"></i></button>
        <button class="playlist_control" onclick="updateSongsOnly();" title="עדכן את השירים וסידורם">עדכן פלייליסט<i class="fa fa-save"></i></button>
        `;
    else
        document.getElementById("playlist_buttons").innerHTML = 
        `
        `;
    document.getElementById("signout").style.display = "block";
    visualise();
    playNewSong();
}

function playlistToStr() {
    let str = "";
    for (song of playlist) {
        str+= song.id + ",";
    }
    return str.slice(0,-1);
}


function savePlaylist() {
    document.body.focus();
    if(playlist.length <= 1) {
        notify("yellow", "לא ניתן לשמור");
        return;
    }

    let new_playlist_name = document.getElementById("name_input").value;
    let new_isPublic = document.getElementById("checkbox_input").checked;


    if(!playlist_name_check(new_playlist_name) || (playlistData!=null && !new_playlist_name==playlistData.title)){
        notify("danger", "השם לא תקין");
        return;
    }
    if(playlistData == null)
    {
        
        savePlaylistOnSP(new_playlist_name, playlistToStr(playlist), new_isPublic);
        document.getElementById("playlist_title").textContent =  new_playlist_name;
        notify("good", "הפלייליסט נשמר");
        document.getElementById("playlist_buttons").innerHTML = 
        `
        <button class="playlist_control" onclick="create_playlist_window();" title="פתח את הגדרות הפלייליסט">הגדרות<i class="fa fa-save"></i></button>
        <button class="playlist_control" onclick="updateSongsOnly();" title="עדכן את השירים וסידורם">עדכן פלייליסט<i class="fa fa-save"></i></button>
        `;
        document.getElementById("signout").style.display = "block";


    }
    else {
        if(playlistData.author == userId)
        {
        playlistData.version++;
        updateSPValueInList("Playlists", "Text", playlistData.id, playlistToStr(playlist), true);
        updateSPValueInList("Playlists", "isPublic", playlistData.id, new_isPublic, true);
        updateSPValueInList("Playlists", "Title", playlistData.id, new_playlist_name, true);
        updateSPValueInList("Playlists", "Version", playlistData.id, playlistData.version, true);
        document.getElementById("playlist_title").textContent = new_playlist_name;

        notify("good", "הפלייליסט עודכן");

        }
    }
}
function updateSongsOnly() {
    playlistData.version++;
    updateSPValueInList("Playlists", "Text", playlistData.id, playlistToStr(playlist), true);
    updateSPValueInList("Playlists", "Version", playlistData.id, playlistData.version, true);
    notify("good", "הפלייליסט עודכן");

}
function playlist_name_check(name) {
    if(name==null || name.length < 2) return false;
    for(let i = 0; i < library_playlist.length; i++) {
        if(library_playlist[i].title == name)
            return false;
    }
    return true;
}

function playlist_changed(signout = false) {
    if((playlistData != null && playlistData.author != userId) || signout)
    {
        playlistData = null;
        document.getElementById("playlist_title").textContent =  ":רשימת ההאזנה הנוכחית";
        document.getElementById("signout").style.display = "none";
        document.getElementById("playlist_buttons").innerHTML = 
        `
        <button class="playlist_control" onclick="create_playlist_window();" title="שמור את רשימת ההאזנה">שמור פלייליסט<i class="fa fa-save"></i></button>
        `;

    }
}