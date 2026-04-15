/*
definition: 
    song = {id:"...", title:"...", link:"..."};
    plalist = [song, song, song....];
    playlist[song_index_playlist] --> npw played song

*/
// audio



// playlist ---------------------------------------------------
function addNext(song) {
    playlist.splice(song_index_playlist+1, 0, song);
    song_index_playlist = Math.max(0,song_index_playlist);
    visualise(true, song_index_playlist+1==playlist.length);
    playlist_changed();

}

function addLast(song) {
    playlist.push(song);
    song_index_playlist = Math.max(0,song_index_playlist);
    visualise(true, song_index_playlist+1==playlist.length);
    playlist_changed();

}

function addPlayLast(song) {
    addLast(song);
    song_index_playlist = playlist.length-1;
    playNewSong();
    playlist_changed();

}

function playNewSong() {

    if(playlist.length == 0)
    {
        if(mode != "radio")
        {
            pauseAudio();
            document.getElementById("song_title").textContent = "_________";
            audio.src = "";
        }
        else
            playNext();

        return;
    }
    visualise(false, true);
    playAudio();
}

function resetPlaylist() {
    let answer = confirm("?אתה בטוח שבאלך למחוק את רשימת ההאזנה");
    if(!answer)
        return;
    playlist = [];
    song_index_playlist = 0;
    pauseAudio();
    document.getElementById("song_title").textContent = "_________";
    audio.src = "";
    visualise(true, false);
    playlist_changed();


}

function deleteSong(index) {
    playlist.splice(index, 1);
    if(index < song_index_playlist)
        song_index_playlist--;
    else if(index == song_index_playlist)
    {
        if(index == playlist.length)
            song_index_playlist--;
        audio.pause();
        playNewSong();
    }
    visualise();
    playlist_changed();

}
 

// buttons ---------------------------------------------------
function disableBtn() {
    if(playlist.length == 0)
        document.getElementById("button_play").classList.add('disable');
    else
        document.getElementById("button_play").classList.remove('disable');

    if(mode == "none" && song_index_playlist + 1 >= playlist.length)
        document.getElementById("button_next").classList.add('disable');
    else
        document.getElementById("button_next").classList.remove('disable');

    if((mode=="none" || mode == "radio") && song_index_playlist <= 0)
        document.getElementById("button_prev").classList.add('disable');
    else
        document.getElementById("button_prev").classList.remove('disable');
    
}

function togglePlay() {
    if(playlist.length == 0) return;
    if (audio.paused) {playAudio();} else {pauseAudio();}
}

function playAudio() {
    audio.play();   
    document.querySelector(".play").innerHTML = `<i class="fa fa-pause"></i>`;
    document.querySelector("#vinyl").setAttribute("style","animation-play-state:running");
    [...document.querySelectorAll(".playlist_song.playing>.play_indicators>*")].map((item)=>{item.setAttribute("style","animation-play-state:running")});
}

function pauseAudio() {
    audio.pause();
    document.querySelector(".play").innerHTML = `<i class="fa fa-play"></i>`;
    document.querySelector("#vinyl").setAttribute("style","animation-play-state:paused");
    [...document.querySelectorAll(".playlist_song.playing>.play_indicators>*")].map((item)=>{item.setAttribute("style","animation-play-state:paused")});
}

function playNext() {
    if(mode == "shuffle")
        song_index_playlist = getRndIndex();
    if(mode == "loop")
        song_index_playlist = (song_index_playlist + 1) % playlist.length;
    if(mode == "radio" & song_index_playlist + 1 >= playlist.length)
        addRndSongLast();
    if(mode == "none" & song_index_playlist + 1 >= playlist.length)
        {pauseAudio(); return;}
    if((mode == "radio"  || mode == "none" ) && song_index_playlist + 1 <  playlist.length)
        song_index_playlist++;

    playNewSong();
}

function playPrevius() {
    if(mode == "shuffle")
        song_index_playlist = getRndIndex();
    if(mode == "loop")
        song_index_playlist = (song_index_playlist  - 1 + playlist.length) % playlist.length;
    if((mode == "radio"  || mode == "none" ) && song_index_playlist - 1 >=  0)
        song_index_playlist--;
    playNewSong();
}
// modes ------------------------------------------------------------------

function getRndIndex() {
    let index = Math.floor(Math.random() * playlist.length);
    while(playlist.length != 1 && index == song_index_playlist)
        index = Math.floor(Math.random() * playlist.length);
    return index;
}

function addRndSongLast() {
    addLast(library[Math.floor(Math.random() * library.length)]);
}


function changeMode(new_mode) {
    if(mode != 'none')
        document.getElementById(mode).classList.remove("active");

    if(new_mode == mode)
        mode = 'none';
    else 
    {
        document.getElementById(new_mode).classList.add("active");
        mode = new_mode;
    }
    if(mode=="radio" && playlist.length == 0)
        playNext();
    visualise();

}

//if changing time using the built-in timeline in the audio element, get it out of focus (so we could detect other events)
document.getElementById('timeline').addEventListener("timeupdate", (e) => {
    document.getElementById('timeline').blur();
})




