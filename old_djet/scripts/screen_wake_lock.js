let awakeInterval;
/*
// Makes the screen unable to sleep so the music could keep playing even if the user is AFK
*/
function keepAwake () {
    awakeInterval = setInterval(function() {
        console.log("reseting timer...");
    },3000);
}

/*
// Makes sure screen able to sleep again
*/
function releaseAwake () {
    clearInterval(awakeInterval);
    awakeInterval = null;
}

function toggleAwake () {
    if (awakeInterval) {
        releaseAwake();
    } else {
        keepAwake();
    }
}