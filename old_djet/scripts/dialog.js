/*
// This is a function that creates the general dialog carpet which can host more content inside of it
// This function is meant to be used only as a helper function to other functions (that add more content to the dialog)
// the "specific_id" argument is just a string that you can add after the id "general_dialog" (if you want to create more than 1 dialog at the same time)
// so that you can specify which dialog you want to operate on
// the default is that there is not a specific_id
// How To Use: in the code, after calling the function, change the inner HTML of the element with the id: "general_dialog_carpet_*insert spesific-id here*"
// don't forget to add in that html code the option to exit the dialog (e.g: <button onclick="exit_general_dialog();">close</button> )
*/
function open_general_dialog (specific_id="", z_index = 1) {
    let body = document.querySelector("body");
    let general_dialog = document.createElement("div");
    body.setAttribute("style","overflow:hidden;");
    general_dialog.setAttribute("id",`general_dialog_carpet${specific_id}`);
    general_dialog.setAttribute("class",`general_dialog_carpet`);
    general_dialog.setAttribute("style",`z-index:${z_index*100}`);
    general_dialog.onclick = function(event) {
        if(event.target.classList.contains("general_dialog_carpet"))
            exit_general_dialog();
    };
    
    //exit_general_dialog;

    body.appendChild(general_dialog);

}

/*
// A function that closes the dialog
// the "there_is_more_than_one_dialog" argument is meant to handle cases when you have more than 1 dialog open and don't want to close all of them
*/
function exit_general_dialog (specific_id="", there_is_more_than_one_dialog=false) {
    let body = document.querySelector("body");
    let general_dialog_carpet = document.getElementById(`general_dialog_carpet`);
    if (!there_is_more_than_one_dialog) {body.removeAttribute("style");}
    body.removeChild(general_dialog_carpet);
}





function create_playlist_window(topic="שמירת רשימת ההאזנה") {
    if(playlist.length <= 1) {
        notify("yellow", "לא ניתן לשמור");
        return;
    }
    open_general_dialog();
    document.body.focus();
    
    let dialog = document.querySelector("#general_dialog_carpet");
    dialog.innerHTML = 
    `
    <div id="dialog_window" class="general_dialog_window">
    <button type="button" class="dialog_exit_button" onclick="exit_general_dialog();"><i class="fas fa-times"></i></button>
    <div id="dialog_nav_top" class="playlist_container_top_nav">

        <h3 class="dialog_title">
            ${topic}
        </h3>
    </div>
    <div id="dialog_main">
        <div class="flex">
            <div class="input_div">
            <lable class="input_lable">גלוי לכולם</lable>
                <input type="checkbox" class="checkbox_input input3" id="checkbox_input" checked="">
            </div>
            <div class="input_div">
                <lable class="input_lable">שם   </lable>
                <input type="url" class="text_input input2" id="name_input" placeholder="הקלד שם" value="${playlistData==null? "" :playlistData.title}">

            </div>
        </div>
    </div>
    <div onclick="savePlaylist(); exit_general_dialog();" id="dialog_nav_bottom" class="playlist_container_top_nav">
            <h3 class="dialog_save_button">
                שמור את השינויים
                <i class="fa fa-save"></i></h3>
    </div>
    
    </div>
    `;

}

function create_upload_window(topic="העלאת שיר חדש לרדיו") {
    open_general_dialog();
    document.body.focus();

    let dialog = document.querySelector("#general_dialog_carpet");
    dialog.innerHTML = 
    `
    <div id="dialog_window" class="general_dialog_window">
        <button type="button" class="dialog_exit_button" onclick="exit_general_dialog();"><i class="fas fa-times"></i></button>
        <div id="dialog_nav_top" class="playlist_container_top_nav">
            <h3 class="dialog_title">
                ${topic}
            </h3>
        </div>
        <div id="dialog_main">
            <div class="flex">
                <div class="input_div">
                    <lable class="input_lable">קראתי ואישרתי את התקנון</lable>
                    <input type="checkbox" class="checkbox_input input3" id="checkbox_input" checked="">
                </div>
                <div class="input_div">
                    <input type="file" onchange="fileUploaded()" class="file_input input3" id="file_input" title="&nbsp;" accept="audio/*">
                    <input type="checkbox" class="checkbox_input input3" id="uploaded_input" disabled>
                </div>
            </div>
        </div>
        <div onclick="createNewSong(); exit_general_dialog();" id="dialog_nav_bottom" class="playlist_container_top_nav">
            <h3 class="dialog_save_button">
                שמור את השיר במערכת
                <i class="fa fa-save"></i></h3>
        </div>
    </div>
    `;

}
function fileUploaded(){
    document.getElementById("uploaded_input").checked = true;
}





