let plane;
let theta = 0;

function setup() {
    let c = createCanvas(500,500,WEBGL);
    c.parent('canvas_container');
    plane = loadModel("http://spellcaster.sites.airnet/DJet/SiteAssets/3D_Models/Jet.obj");
}

function draw() {
    background(9,17,29);
    push();
    noStroke();
    stroke(0,0,0);
    fill(255,215,0);
    //specularLight(1000,1000,1000);
    directionalLight(1000,1000,1000,0,0,-1);
    specularMaterial(1000);
    emissiveMaterial(1000);
    shininess(800);
    rotateY(theta / 2);
    rotateZ((PI / 6)*7);
    scale(50);
    model(plane);
    pop();
    theta += 0.05;
}