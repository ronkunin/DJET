const games_library = {"FlappyJet":10, "SkyDome": 20, "LongArm": 30};
let game_name = Object.keys(games_library)[Math.floor(Math.random() * Object.keys(games_library).length)];
let game_code = games_library[game_name];
let game_status = game_code; // game_code = before || game_code+1 = on || game_code+2 = over



function preload() {
    if(game_name == "FlappyJet")
        flappyJet_preload();
    if(game_name == "SkyDome")
        skyDome_preload();
    if(game_name == "LongArm")
        longArm_preload();
}

function setup() {
    console.log("hi");
    let c = createCanvas(500,500);
    c.parent('canvas_container');
    console.log(c);

    if(game_name == "FlappyJet")
        flappyJet_setup();
    if(game_name == "SkyDome")
        skyDome_setup();
    if(game_name == "LongArm")
        longArm_setup();
}

function draw() {
    if(game_name == "FlappyJet")
        flappyJet_draw();
    if(game_name == "SkyDome")
        skyDome_draw();
    if(game_name == "LongArm")
        longArm_draw();
}

function keyPressed() {
    if(game_name == "FlappyJet")
        flappyJet_keyPressed(keyCode);

    if(game_name == "LongArm")
        longArm_keyPressed(keyCode);
}

function loadGame(name) {
    
    if(name == game_name)
        return;
    game_code = games_library[name];
    game_name = name;
    game_status = game_code; 
    preload();
    setup();
}