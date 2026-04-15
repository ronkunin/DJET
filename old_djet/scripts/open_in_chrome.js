/*
// The Best Function EVER!!!!
// (opens the tab automatically in chrome (which is so much better than internet explorer EeEeWwWwW🤢🤮))
*/
function open_in_chrome () {
    if (!window.chrome) {
        var shell = new ActiveXObject("WScript.Shell");
        shell.run("Chrome "+ window.location.href);
        window.open('','_self', '');
        window.close();
    }
}

//calling the functions in this script:
open_in_chrome();