/*
// This is a function that loads the notification element
// (without triggering it, in order to do that, you need to use the "notify" function)
*/
function create_notification () {
    let body = document.querySelector("body");
    let notification = document.createElement("div");
    notification.setAttribute("class","notification");
    notification.innerHTML = `<p class="notification_message"><p><i class="notification_icon fas"><i>`;
    body.appendChild(notification);
}

/*
// This is a KEY function that displays and handles the notification
// The arguments are:
// *-mode: (changes the mood of the function so it looks different) accepts "danger|warning|good|copy" or "red|yellow|green"
// *-message: accepts Strings and displays them inside the notification
// *-time: accepts ints and displays the notification for "time" seconds (OPTIONAL, default: 5 seconds)
*/
function notify (mode, message, time = 5) {
    let notification = document.querySelector(".notification");
    let notification_icon = document.querySelector(".notification_icon");
    let notification_message = document.querySelector(".notification_message");
    //animation
    notification.style.animation = "none";
    notification.offsetHeight; //trigers the reset
    notification.style.animation = "pop_up_notification " + time + "s";
    //style
    notification.style.backgroundColor = mode_color_coder(mode)[0];
    notification_message.innerHTML = message;
    notification_icon.setAttribute("class", "notification_icon fas"); //reset icon
    notification_icon.classList.add(mode_color_coder(mode)[1]);
}

/*
// Helper function used in the "notify" function to match mode with color/icon to display in the notification
// if mode gets nothing real --> return the regular/default result
// return format: [color, icon-class]
*/
function mode_color_coder (mode) {
    if (mode == "danger" || mode == "red" || mode == "Hapoel")                  {return ["#FF7878","fa-circle-xmark"];}
    if (mode == "warning" || mode == "yellow")                                  {return ["#FFF89A","fa-triangle-exclamation"];}
    if (mode == "good" || mode == "green")                                      {return ["#C6D57E","fa-thumbs-up"];}
    if (mode == "info" || mode == "blue")                                       {return ["#82D3FF","fa-circle-info"];}
    if (mode == "copy")                                                         {return ["#C6D57E","fa-copy"];}
    return ["#D1D1D1","fa-code"]; //base case
}

create_notification();