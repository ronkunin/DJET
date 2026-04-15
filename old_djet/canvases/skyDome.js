let skyDome_bulletsFired = [];
let skyDome_targetBalloons = [];
let	skyDome_mainTurrent;
let skyDome_turPosX = 250;
let skyDome_turPosY = 250;
let skyDome_targetTimer = 0;
let balloonSpawnMultiplier = 2;
let balloonSizeMultiplier = 2;

let skyDome_score = 0;

let skyDome_missle;
let skyDome_uav;
let skyDome_background;
let skyDome_irondome;
let skyDome_start_img;
let skyDome_end_img;
// skyDome_
function skyDome_preload() {
  skyDome_missle = loadImage("../old_djet/images/skyDome_missle.png");
  skyDome_uav = loadImage("../old_djet/images/skyDome_enemy.png");
  skyDome_background = loadImage("../old_djet/images/skyDome_background.png");
  skyDome_irondome = loadImage("../old_djet/images/skyDome_iron.png");
  skyDome_start_img = loadImage("../old_djet/images/skyDome_startImg.png");
  skyDome_end_img = loadImage("../old_djet/images/skyDome_endImg.png");
}
function skyDome_setup() {


    angleMode(DEGREES);
	skyDome_mainTurrent = new turrent();
	background(skyDome_start_img);	

	textStyle(BOLD);
    textAlign(CENTER,CENTER);
    textSize(40);

}


function mousePressed2(){
	if(game_code == 20) {
	if(game_status == 20) {
		game_status=21;
		return;
	}
	if(game_status == 22) {
		game_status=21;
		skyDome_reset();
		return;
	}
	let mouseVector = getMouseVector();
	oneBullet = new bullet(mouseVector.x, mouseVector.y);
	skyDome_bulletsFired.push(oneBullet);
	print(mouseVector.x + " " +  mouseVector.y);
}
}

class balloon{
	constructor(){
		this.side = int(random(4));
		switch (this.side)
		{
			case 0:
				this.x = 0;
				this.y = int(random(height));
				break;
			case 1:
				this.x = int(random(width));
				this.y = 0;
				break;
			case 2:
				this.x = width;
				this.y = int(random(height));
				break;
			case 3:
				this.x = int(random(width));
				this.y = height;
				break;
		}
		this.targetX = skyDome_turPosX;
		this.targetY = skyDome_turPosY;
		this.targetDir = createVector(this.targetX - this.x, this.targetY - this.y);
		this.targetDir.normalize();
		this.xSpd = this.targetDir.x*balloonSpawnMultiplier*0.8;
		this.ySpd = this.targetDir.y*balloonSpawnMultiplier*0.8;
		this.r = 12*balloonSizeMultiplier;
        this.d = 45 + (Math.atan2(this.ySpd, this.xSpd) * (180 / Math.PI) + 360) % 360;

		
	}
	
	display(){
		push();
		noStroke();
		fill(255, 0, 0);
		ellipse(this.x, this.y, this.r);
        translate(this.x, this.y);
        rotate(this.d);
        imageMode(CENTER);
        image(skyDome_uav, 0, 0, this.r, this.r);
		pop();
	}
	
	update(){
		this.x += this.xSpd;
		this.y += this.ySpd;	
	}
	
	outOfBounds(){
		return(this.x > width+10 || this.x < -10 || this.y > height+10 || this.y < -10);
	}
	
	myX(){
		return this.x;
	}
	
	myY(){
		return this.y;
	}
	
	myR(){
		return this.r;
	}
	
		
}

class bullet{
	constructor(xSpd, ySpd){
		this.x = skyDome_turPosX;
		this.y = skyDome_turPosY;
		this.xSpd = 12*xSpd;
		this.ySpd = 12*ySpd;
        this.d = 45 + (Math.atan2(this.ySpd, this.xSpd) * (180 / Math.PI) + 360) % 360;
	}
	
	display(){
		push()
        translate(this.x, this.y);
        rotate(this.d);
        imageMode(CENTER);
        image(skyDome_missle, 0, 0, 30, 30);
		pop();
	}
	
	update(){
		this.x += this.xSpd;
		this.y += this.ySpd;
		this.xSpd *= 0.994;
		this.ySpd *= 0.994;
	}
	
	outOfBounds(){
		return(this.x > width+10 || this.x < -10 || this.y > height+10 || this.y < -10);
	}
	
	hitScan(){
		for (var i = 0; i < skyDome_targetBalloons.length; i++){
			var collideOrNot = boom(this.x, this.y, 10, skyDome_targetBalloons[i].myX(), skyDome_targetBalloons[i].myY(), skyDome_targetBalloons[i].myR())
			if (collideOrNot){
				skyDome_targetBalloons.splice(i,1);
				skyDome_score += 1;
				return true;
			}
		}
		return false;
	}
}
function boom(x1, y1, r1, x2, y2, r2) {
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)) <= (r1/2)+(r2/2);
}
class turrent{
	constructor(){
      this.step = 2;
	}
	
	display(){
		push()
		stroke(230, 255, 0);
		fill(230, 255, 0);
		ellipse(skyDome_turPosX, skyDome_turPosY, 30);
		translate(skyDome_turPosX, skyDome_turPosY);
		let mouseVector2 = getMouseVector();
		let d =  90 + (Math.atan2(mouseVector2.y, mouseVector2.x) * (180 / Math.PI) + 360) % 360;

        rotate(d);
        imageMode(CENTER);
        image(skyDome_irondome, 0, 0, 45, 45);
		pop();
	}
	
	move(){
			if ((keyIsDown(65) || keyIsDown(LEFT_ARROW)) && skyDome_turPosX > 5) {
    			skyDome_turPosX -= this.step;
	  		}
  			if ((keyIsDown(68) || keyIsDown(RIGHT_ARROW)) && skyDome_turPosX < width-5) {
    			skyDome_turPosX += this.step;
  			}
  			if ((keyIsDown(87) || keyIsDown(UP_ARROW)) && skyDome_turPosY > 5) {
    			skyDome_turPosY -= this.step;
  			}

  			if ((keyIsDown(83) || keyIsDown(DOWN_ARROW)) && skyDome_turPosY < height-5) {
    			skyDome_turPosY += this.step;
  			}
		}
	
	hitScan(){
		for (var i = 0; i < skyDome_targetBalloons.length; i++){
			var collideOrNot = boom(skyDome_turPosX, skyDome_turPosY, 30, skyDome_targetBalloons[i].myX(), skyDome_targetBalloons[i].myY(), skyDome_targetBalloons[i].myR())
			if (collideOrNot){
				return true;
			}
		}
		return false;
	}
}
function skyDome_draw() {

  // H, S & B values.
  
	if(game_status == 20) 
		background(skyDome_start_img);	
	if(game_status == 21) {
		background(skyDome_background);	
	drawReticle();
	//----------------------------------------BALLOONS-SPAWN--------------------------------------
	skyDome_targetTimer += 1;
	let spawnInterval = int(100 / balloonSpawnMultiplier);
	if (skyDome_targetTimer % spawnInterval == 0){
		let newBalloon = new balloon();
		skyDome_targetBalloons.push(newBalloon);
		//skyDome_score += 5;
	}
	
	
	//----------------------------------------------BULLETS----------------------------------------
	for (var i = 0; i < skyDome_bulletsFired.length; i++){
		skyDome_bulletsFired[i].display();
		skyDome_bulletsFired[i].update();
		if (skyDome_bulletsFired[i].outOfBounds()){
      		skyDome_bulletsFired.splice(i,1);
    	}
		else if (skyDome_bulletsFired[i].hitScan()){
      		skyDome_bulletsFired.splice(i,1);
    	}
	}
	
	
	//-------------------------------------------EVIL-BALLOONS----------------------------------------
	for (var i = 0; i < skyDome_targetBalloons.length; i++){
		skyDome_targetBalloons[i].display();
		skyDome_targetBalloons[i].update();
		if (skyDome_targetBalloons[i].outOfBounds()){
      		skyDome_targetBalloons.splice(i,1);
    	}
	}
	
	balloonSpawnMultiplier += 0.001;
	if (balloonSizeMultiplier < 5){
		balloonSizeMultiplier += 0.001;
	}
	
	//------------------------------------------HERO-AND-HERO-DED---------------------------------------a
	skyDome_mainTurrent.display();
	skyDome_mainTurrent.move();
	if (skyDome_mainTurrent.hitScan()){
		skyDome_gameOver();
	}
	    // Display skyDome_score
		textSize(32);
		fill(255);
		text(skyDome_score, 20, 50);
		text(user_details["skyDome_maxS"], 475, 50);
	}
}

function getMouseVector(){
	let mouseXalt = mouseX - skyDome_turPosX;
	let mouseYalt = mouseY - skyDome_turPosY;
	let mouseDir = createVector(mouseXalt, mouseYalt);
	mouseDir.normalize();
	return mouseDir;
}
	
function drawReticle(){
	noFill();
	strokeWeight(1.5);
	stroke(0, 100, 125, 125);
	ellipse(mouseX, mouseY, 20);
	stroke(80, 160, 200, 125);
	line(mouseX-14, mouseY-14, mouseX+14, mouseY+14);
	line(mouseX+14, mouseY-14, mouseX-14, mouseY+14);
	stroke(80, 160, 200, 125);
	line(skyDome_turPosX, skyDome_turPosY, mouseX, mouseY);
}

function skyDome_gameOver(){
	push()
	game_status=22;
	textAlign(CENTER);
        imageMode(CENTER);
        image(skyDome_end_img, 250, 250, 500, 225.476);
	
	textFont('Helvetica');
	textSize(30);
	fill(235);
	text(skyDome_score, 110, 297);
	text(int(skyDome_targetTimer/60), 110, 333);


	user_details["skyDome_games"] += 1;
	updateSPValueInList("Users", "skyDome_games", user_details["Id"], user_details["skyDome_games"], true);

  	let maxS = Math.max(skyDome_score, user_details["skyDome_maxS"]);
  	user_details["skyDome_maxS"] = maxS;
  	if(maxS == skyDome_score)
    	updateSPValueInList("Users", "skyDome_maxS", user_details["Id"], user_details["skyDome_maxS"], true);

	let maxT = Math.max(int(skyDome_targetTimer/60), user_details["skyDome_maxT"]);
	user_details["skyDome_maxT"] = maxT;
	if(maxT == int(skyDome_targetTimer/60))
		updateSPValueInList("Users", "skyDome_maxT", user_details["Id"], user_details["skyDome_maxT"], true);
	
	pop();
	noLoop();
	
}

function skyDome_reset(){
	skyDome_bulletsFired = [];
	skyDome_targetBalloons = [];
	skyDome_turPosX = 200;
	skyDome_turPosY = 300;
	skyDome_targetTimer = 0;
	balloonSpawnMultiplier = 2;
	balloonSizeMultiplier = 2;
	skyDome_score = 0;
	
	loop();
}

	
























