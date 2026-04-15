function renderPlaylist () {
    const songsList = document.getElementById('songs-list');
    const noSongsMessage = document.getElementById('no-songs-message');
    const songsCount = document.getElementById('songs-count');
    const playlistName = document.getElementById('playlist-name');
    const playlistStatus = document.getElementById('playlist-status');

// Update playlist info
            if(playlistData) 
                 playlistName.value = playlistData.title;
            else
                playlistName.value = "רשימת האזנה:"
            songsCount.textContent = playlist.length;
            
            
            // Update status indicator
            /*playlistStatus.className = `playlist-status ${playlistState.status}`;
            let statusText = "";
            let statusIcon = "";
            
            switch(playlistState.status) {
                case "published":
                    statusText = "פורסם";
                    statusIcon = "fa-globe";
                    break;
                case "hidden":
                    statusText = "מוסתר";
                    statusIcon = "fa-eye-slash";
                    break;
                case "draft":
                default:
                    statusText = "טיוטה";
                    statusIcon = "fa-file";
                    break;
            }
            
            playlistStatus.innerHTML = `<i class="fas ${statusIcon}"></i> ${statusText}`;*/
            
            // Clear songs list
            songsList.innerHTML = '';
            
            // Show/hide no songs message
            if (playlist.length === 0) {
                noSongsMessage.style.display = 'flex';
            } else {
                noSongsMessage.style.display = 'none';
                
                // Populate songs list
                playlist.forEach((song, index) => {
                    if (!song) return;
                    
                    const songItem = document.createElement('li');
                    songItem.className = 'song-item';
                    if (index === song_index_playlist) {
                        songItem.classList.add('current-playing');
                    }
                    songItem.dataset.id = song.id;
                    songItem.dataset.index = index;
                    songItem.draggable = true;
                    
                    const isPlaying = index === song_index_playlist;
                    
                    songItem.innerHTML = `
                        <div class="drag-handle">
                            <i class="fas fa-grip-vertical"></i>
                        </div>
                        <div class="song-number">${index + 1}</div>
                        <div class="song-info">
                            <div class="song-title">${song.title}</div>
                            ${isPlaying ? `
                            <div class="song-status">
                                <div class="song-playing-indicator">
                                    <div class="pulse"></div>
                                    <span>מנגן כעת</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        <div class="song-actions">
                            <button class="song-action-btn play-btn" data-id="${song.id}" aria-label="השמע" onclick="song_index_playlist=${index}; playNewSong();">
                                <i class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                            </button>
                            <button class="song-action-btn remove-btn" data-id="${song.id}" aria-label="הסר"  onclick="deleteSong(${index});">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    songsList.appendChild(songItem);
                });
            }
            
            // Add drag and drop event listeners
            setupDragAndDrop();
        }



function visualise(updatePlaylist=true, updateSong=false) {
    if(updateSong) {
        audio.src = playlist[song_index_playlist].link;
        //document.getElementById("playlist_song_name").textContent = playlist[song_index_playlist].title;
        document.getElementById("song_title").textContent = playlist[song_index_playlist].title;
        // if(document.getElementById("playlist_mode").style.display == "" || document.getElementById("playlist_mode").style.display == "none")
        //    document.getElementById("song_title").textContent = playlist[song_index_playlist].title;

        if(isLiked(user_details["liked"], playlist[song_index_playlist].id))
            document.getElementById("like").style.color = `#FF8080`;
        else
            document.getElementById("like").style.color = "WHITE";

        
    }
    if(updatePlaylist) {
        if(playlistData)
            openPlaylist();
        if(playlistData  && playlistData.author == userId) 
        {
            document.getElementById("play_bar").style.display = "flex";
            if(playlistData.isPublic) {
                document.getElementById("publish-playlist-btn").style.display = "none";
                document.getElementById("hide-playlist-btn").style.display = "block";
            }
            else {
                document.getElementById("publish-playlist-btn").style.display = "block";
                document.getElementById("hide-playlist-btn").style.display = "none";
            }
        }
        else
            document.getElementById("play_bar").style.display = "none";
        
        //document.getElementById("playlist_len").textContent = Math.max((song_index_playlist+((playlist.length==0)?0:1)),0) + " / " + playlist.length;
        renderPlaylist();
        disableBtn();
    }


}
function create_playlist() {
    openPlaylist();
    let title = generateName();
    savePlaylistOnSP(title, playlistToStr());

}
function generateName() {
    return `הפלייליסט של ${user_details["username"]}`;
}

function loadPlaylist(new_playlist) {
    if(new_playlist == false)
        return;
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
    playlistData["views"]++;
    updateSPValueInList("Playlists", "Views", playlistData.id, playlistData["views"], true);
    //document.getElementById("playlist_title").textContent = playlistData.title;
    /*if(playlistData.author == userId){
        //document.getElementById("playlist_buttons").innerHTML = 
        `
        <button class="playlist_control" onclick="create_playlist_window();" title="פתח את הגדרות הפלייליסט">הגדרות<i class="fa fa-save"></i></button>
        <button class="playlist_control" onclick="updateSongsOnly();" title="עדכן את השירים וסידורם">שמור פלייליסט<i class="fa fa-save"></i></button>
        <button class="playlist_control" onclick="deletePlaylist();" title="מחק את הפלייליסט">מחק פלייליסט<i class="fa fa-save"></i></button>
        `;
        let i = 0;
}
    else
        document.getElementById("playlist_buttons").innerHTML = 
        `
        `;*/
   /* document.getElementById("signout").style.display = "block";
    document.getElementById("playlist_mode").style.display = "block";
    document.getElementById("song_mode").style.display = "none";

    document.getElementById("loop").style.display = "flex";
    document.getElementById("shuffle").style.display = "flex";
    document.getElementById("stream").style.display = "none";
    document.getElementById("plus").style.display = "none";*/
    visualise();
    playNewSong();
}

function playlistToStr(s = 0) {
    let str = "";
    for(let i = s; i < playlist.length; i++) {
        str+= playlist[i].id + ",";
    }
    return str.slice(0,-1);
}


function savePlaylist() {
    document.body.focus();
    if(playlist.length < 1) {
        showSystemNotification("error", "לא ניתן לשמור");
        return;
    }
    playlistData.string = playlistToStr();
    playlistData["version"]++;
    updateSPValueInList2("Playlists", "Text", "Version", playlistData.id, playlistData.string, playlistData.version, true);
    showSystemNotification("success", "הפלייליסט עודכן");
/*
    if(playlistData == null)
    {
        playlist.splice(0, song_index_playlist);
        song_index_playlist = 0;
        visualise();
        savePlaylistOnSP(new_playlist_name, playlistToStr(), new_isPublic);
        document.getElementById("playlist-name").textContent =  new_playlist_name;
        showSystemNotification("success", "הפלייליסט נשמר");
    }
    else {
        if(playlistData.author == userId)
        {
            let str = playlistToStr();
            if(playlistData.string != str)
            {
                playlistData.string = str;
                updateSPValueInList("Playlists", "Text", playlistData.id, playlistData.string, true);
            }
            if(playlistData.isPublic != new_isPublic)
            {
                playlistData.isPublic = new_isPublic;
                updateSPValueInList("Playlists", "isPublic", playlistData.id, playlistData.isPublic, true);
            }
            if(playlistData.title != new_playlist_name)
            {
                playlistData.title = new_playlist_name;
                updateSPValueInList("Playlists", "Title", playlistData.id, playlistData.title, true);
                document.getElementById("playlist-name").textContent = new_playlist_name;
                show_myplaylists();
            }

       

        }
    }*/
}
function updateSongsOnly() {

    let str = playlistToStr();
    if(playlistData.string != str)
    {
        playlistData.string = str;
        updateSPValueInList("Playlists", "Text", playlistData.id, playlistData.string, true);
        showSystemNotification("success", "הפלייליסט עודכן");
    }

}

function deletePlaylist() {
    let answer = confirm("?בטוח שבאלך למחוק את הפלייליסט");
    if(!answer)
        return;
    playlistData.title = "Deleted";
    deleteItemInSP("Playlists", playlistData.id);
    document.getElementById("playlist-name").value = playlistData.title;
    show_myplaylists();

    playlist = [];
    playlistData = null;

    song_index_playlist = 0;
    pauseAudio();
    document.getElementById("song_title").textContent = "_________";
    audio.src = "";
    visualise(true, false);
    playlist_changed();
    closePlaylist()
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
    if((playlistData != null && playlistData.author != userId && document.getElementById("playlist-name").textContent != "השירים שאהבתי:") || signout)
    {
        playlistData = null;
        document.getElementById("playlist-name").value =  "רשימת ההאזנה הנוכחית:";
        document.getElementById("song_title").textContent = playlist[song_index_playlist].title;


    }
}

function addLikedSong() {
    let new_string = updateString(user_details["liked"],  playlist[song_index_playlist].id)
    user_details["liked"] = new_string;
    try {
        updateSPValueInList("Users","liked", user_details["Id"], user_details["liked"],true);
        if(isLiked(user_details["liked"], playlist[song_index_playlist].id))
            document.getElementById("like").style.color = `#FF8080`;
        else
            document.getElementById("like").style.color = "WHITE";

        } catch (error) {
        showSystemNotification("error", "שגיאה בשמירה");
    }
}

function updateString(string, song_id) {
    let arr = []
    if(string != null)
        arr = string.split(',').map(Number);
    else
        return "" + song_id;

    if (arr.includes(song_id))
        {
            let index = arr.indexOf(song_id);
            arr.splice(index, 1);

            string = "";
            for (id of arr) {
                string += id + ",";
            }
            if(string == "")
                return null;
            return string.slice(0,-1);
        }
    else {
        return string + "," + song_id;
    }
}

function isLiked(string, song_id) {
    let arr = []
    if(string != null)
        arr = string.split(',').map(Number);
    else
        return false;

    return arr.includes(song_id);
}



function loadLikedPlaylist() {
    let new_playlist = user_details["liked"];
    if(new_playlist == null)
        return;
    audio.pause();
    let arr = []
    if(new_playlist != null)
        arr = new_playlist.split(',').map(Number);
    playlist = [];
    song_index_playlist = 0;
    for (id of arr) {
        playlist.push(songFromId(id));
    }

    playlistData = new_playlist;
    visualise();
    playNewSong();
    document.getElementById("playlist-name").value =  "השירים שאהבתי:";

}

function saveOnLiked() {
    user_details["liked"] = playlistToStr();
    updateSPValueInList("Users","liked", user_details["Id"], user_details["liked"],true);
    showSystemNotification("success", "הפלייליסט נשמר");


}

// ==============================================
    // DRAG AND DROP FUNCTIONS
    // ==============================================
        function setupDragAndDrop() {
            const songItems = document.querySelectorAll('.song-item');
            
            songItems.forEach(item => {
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragover', handleDragOver);
                item.addEventListener('dragenter', handleDragEnter);
                item.addEventListener('dragleave', handleDragLeave);
                item.addEventListener('drop', handleDrop);
                item.addEventListener('dragend', handleDragEnd);
            });
        }
        
        function handleDragStart(e) {
            draggedItem = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }
        
        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
        }
        
        function handleDragEnter(e) {
            this.classList.add('over');
        }
        
        function handleDragLeave(e) {
            this.classList.remove('over');
        }
        
        function handleDrop(e) {
            e.stopPropagation();
            e.preventDefault();
            
            if (draggedItem !== this) {
                // Get the indices of dragged and target items
                const draggedIndex = parseInt(draggedItem.dataset.index);
                const targetIndex = parseInt(this.dataset.index);
                
                // Swap the songs in the playlist array
                /*const temp = playlist[draggedIndex];
                playlist[draggedIndex] = playlist[targetIndex];
                playlist[targetIndex] = temp;*/arguments
                playlist.splice(targetIndex,0,playlist.splice(draggedIndex,1)[0]);

                
                // Update current song index if needed
                if (song_index_playlist === draggedIndex) {
                    song_index_playlist = targetIndex;
                } else if (song_index_playlist === targetIndex) {
                    song_index_playlist = draggedIndex;
                }
                
                // Update the display
                renderPlaylist();
            }
            
            this.classList.remove('over');
            return false;
        }
        
        function handleDragEnd(e) {
            const items = document.querySelectorAll('.song-item');
            items.forEach(item => {
                item.classList.remove('dragging');
                item.classList.remove('over');
            });
        }
        function changePlaylistName() {
            const playlistName = document.getElementById('playlist-name');
            playlistName.focus();
            playlistName.select();
        }

        function publishPlaylist() {
            playlistData["isPublic"] = true;
            updateSPValueInList("Playlists", "isPublic", playlistData.id, playlistData.isPublic, true);
            document.getElementById("publish-playlist-btn").style.display = "none";
            document.getElementById("hide-playlist-btn").style.display = "block";
        }
        
        function hidePlaylist() {
            playlistData["isPublic"] = false;
            updateSPValueInList("Playlists", "isPublic", playlistData.id, playlistData.isPublic, true);
            document.getElementById("publish-playlist-btn").style.display = "block";
            document.getElementById("hide-playlist-btn").style.display = "none";
        }
        // ==============================================
        // EVENT LISTENERS SETUP
        // ==============================================
        function setupEventListeners() {
            // Playlist modal
           // document.getElementById('open-playlist-btn').addEventListener('click', openPlaylist);
            const closePlaylistBtn = document.getElementById('close-playlist');
            if (closePlaylistBtn) closePlaylistBtn.addEventListener('click', closePlaylist);
            const savePlaylistBtn = document.getElementById('save-playlist-btn');
            if (savePlaylistBtn) savePlaylistBtn.addEventListener('click', savePlaylist);
            const publishPlaylistBtn = document.getElementById('publish-playlist-btn');
            if (publishPlaylistBtn) publishPlaylistBtn.addEventListener('click', publishPlaylist);
            const hidePlaylistBtn = document.getElementById('hide-playlist-btn');
            if (hidePlaylistBtn) hidePlaylistBtn.addEventListener('click', hidePlaylist);
            const changeNameBtn = document.getElementById('change-name-btn');
            if (changeNameBtn) changeNameBtn.addEventListener('click', changePlaylistName);
            const deletePlaylistBtn = document.getElementById('delete-playlist-btn');
            if (deletePlaylistBtn) deletePlaylistBtn.addEventListener('click', deletePlaylist);
            //document.getElementById('play-random-btn').addEventListener('click', playRandomSong);
            
            // Playlist name input
            const playlistName = document.getElementById('playlist-name');
            if (playlistName) playlistName.addEventListener('change', function() {
                playlistData.title = this.value;
                if(playlistData  && playlistData.author == userId) 
                    updateSPValueInList("Playlists", "Title", playlistData.id, playlistData.title, true);
            
            });
            
            if (playlistName) playlistName.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    this.blur();
                    playlistData.title = this.value;
                    if(playlistData  && playlistData.author == userId) 
                        updateSPValueInList("Playlists", "Title", playlistData.id, playlistData.title, true)
                }
            });

                // Close when clicking outside
        const playlistModal = document.getElementById('playlist-modal');
        if (playlistModal) playlistModal.addEventListener('click', (e) => {
        if (e.target.id === 'playlist-modal') {
            closePlaylist();
        }
        });
            
            // Music player
            /*
            document.getElementById('close-player').addEventListener('click', () => {
                document.getElementById('music-player').classList.remove('active');
                pausePlayback();
            });
            
            // Play/Pause button
            document.getElementById('play-pause-btn').addEventListener('click', () => {
                if (musicPlayer.currentSongIndex === -1) {
                    if (playlist.length > 0) {
                        playSong(playlist[0]);
                    }
                } else {
                    if (musicPlayer.isPlaying) {
                        pausePlayback();
                    } else {
                        playPlayback();
                    }
                }
            });
            
            // Next/Previous buttons
            document.getElementById('next-btn').addEventListener('click', playNextSong);
            document.getElementById('prev-btn').addEventListener('click', playPrevSong);
            
            // Volume control
            document.getElementById('volume-slider').addEventListener('input', function() {
                const volume = this.value / 100;
                musicPlayer.audio.volume = volume;
            });
            
            // Audio player events
            const audioPlayer = document.getElementById('audio-player');
            audioPlayer.addEventListener('play', () => {
                musicPlayer.isPlaying = true;
                updatePlayerControls();
                updatePlaylistDisplay();
            });
            
            audioPlayer.addEventListener('pause', () => {
                musicPlayer.isPlaying = false;
                updatePlayerControls();
                updatePlaylistDisplay();
            });
            
            audioPlayer.addEventListener('ended', () => {
                playNextSong();
            });
            
            // Close modal when clicking outside
            document.addEventListener('click', (e) => {
                const modal = document.getElementById('playlist-modal');
                const openBtn = document.getElementById('open-playlist-btn');
                const playlistLink = document.getElementById('playlist-link');
                
                if (modal.classList.contains('active') && 
                    !modal.contains(e.target) && 
                    e.target !== openBtn && 
                    !openBtn.contains(e.target) &&
                    e.target !== playlistLink &&
                    !playlistLink.contains(e.target)) {
                    closePlaylist();
                }
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Spacebar to play/pause (if audio player is not focused)
                if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    if (musicPlayer.currentSongIndex !== -1) {
                        if (musicPlayer.isPlaying) {
                            pausePlayback();
                        } else {
                            playPlayback();
                        }
                    }
                }
                
                // Escape to close modals
                if (e.key === 'Escape') {
                    closePlaylist();
                    document.getElementById('music-player').classList.remove('active');
                }
            });
            
            // Event delegation for dynamic elements
            document.addEventListener('click', (e) => {
                // Remove song from playlist
                if (e.target.closest('.remove-btn')) {
                    const songId = parseInt(e.target.closest('.remove-btn').dataset.id);
                    removeSongFromPlaylist(songId);
                }
                
                // Play song from playlist
                if (e.target.closest('.play-btn')) {
                    const songId = parseInt(e.target.closest('.play-btn').dataset.id);
                    const songIndex = playlist.indexOf(songId);
                    
                    // If clicking on currently playing song, toggle play/pause
                    if (songIndex === musicPlayer.currentSongIndex) {
                        if (musicPlayer.isPlaying) {
                            pausePlayback();
                        } else {
                            playPlayback();
                        }
                    } else {
                        // Play new song
                        playSong(songId);
                    }
                }
            });*/
        }
        setupEventListeners();

        function closePlaylist() {
            playlistData = null;
            const modal = document.getElementById('playlist-modal');
            modal.classList.remove('active');
        }
        
        const closePlaylistBtn = document.getElementById('close-playlist');
        if (closePlaylistBtn) closePlaylistBtn.addEventListener('click', closePlaylist);

        function openPlaylist() {
            const modal = document.getElementById('playlist-modal');
            modal.classList.add('active');
        }