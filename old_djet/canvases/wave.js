let noiseIntensity = 0;
let time = 0;

function setup () {
    let c = createCanvas(500,500);
    c.parent('canvas_container');
    background(255);
}

function draw () {
    background("#0e162719");
    translate(0, height/2);

    noiseIntensity = mouseY*0.01;

    noFill();
    stroke(255);
    strokeWeight(noiseIntensity*2+0.02);

    beginShape();
    for (let x = 0 ; x <= width ; x++) {
        let noiseValueX = noise(x*0.005,time);
        let noiseValueY = noise(x*0.005,time+1000);
        let waveLength = map(noiseValueX,0,1,50,5);
        let waveHeight = map(noiseValueX,0,1,50,75);
        let waveResolution = map(noiseValueY, 0, 1, 0.02, 0.04);

        let y = sin(x*waveResolution+time+noiseIntensity)*waveHeight*noiseIntensity - sin(x/8)*10*noiseIntensity + sin(time)*20*noiseIntensity + sin(noiseIntensity)*20;
        vertex(x,y);
    }
    endShape();
    time += 0.05;
}