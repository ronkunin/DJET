let r = 150;
let spacing = 10;
let points = [];

function setup () {
    let c = createCanvas(500,500,WEBGL);
    c.parent('canvas_container');
    colorMode(HSB);
    angleMode(DEGREES);

    noFill();

    for (let phi = spacing ; phi < 180 ; phi += spacing) {
        for (let theta = 0 ; theta < 360 ; theta += spacing) {
            points.push(new Point(phi,theta));
        }
    }
}

function draw () {
    background("#0e1627");
    orbitControl(4,4);

    rotateZ(80);
    rotateY(35);

    for (let i = 0 ; i < points.length ; i++) {
        let p = points[i];
        p.update();
        let cords = p.cords();
        let alpha = map(abs(cords.x),r,0,1,0.1);
        stroke(200,80,88,alpha);
        strokeWeight(4);
        point(cords.x,cords.y,cords.z);
    }
}

function keyPressed () {
    if (key == ' '){
        for (let i = 0 ; i < points.length ; i++) {
            let p = points[i];
            p.jump();
        }
    }
}




class Point {

    constructor(phi, theta) {
        this.phi = phi;
        this.theta = theta;
        this.dis = 50;
    }

    cords () {
        let x = (r+this.dis) * cos(this.phi);
        let y = (r+this.dis) * sin(this.phi) * sin(this.theta);
        let z = (r+this.dis) * sin(this.phi) * cos(this.theta);
        return createVector(x,y,z);
    }

    update () {
        this.dis *= 0.95;
        this.theta += 0.2;
    }

    jump () {
        this.dis += Math.abs(noise(this.phi,this.theta)*40);
    }
}