/*
// This is a function that adds the spinning loading screen element
*/
function create_loader () {
    let body = document.querySelector("body");
    let loader_wrapper = document.createElement("div");
    loader_wrapper.setAttribute("class","loader_wrapper");
    loader_wrapper.setAttribute("id","loader_wrapper");
    loader_wrapper.innerHTML = `<div class="loader"></div>`;
    body.appendChild(loader_wrapper);
    document.querySelector("html").style.overflowY = "hidden";
}

create_loader();

//handling the spinning screen-loader (only when the page is loading)
/*
window.addEventListener("load", function(){
    document.getElementById("loader_wrapper").style.display = "none";
    document.querySelector("html").style.overflowY = "";
});
*/

function exit_loader () {
    document.getElementById("loader_wrapper").style.display = "none";
    document.querySelector("html").style.overflowY = "";
}