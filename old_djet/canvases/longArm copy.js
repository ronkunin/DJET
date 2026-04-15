let longArm_score;
let longArm_mode;
let longArm_modes;

let longArm_start_img;
let longArm_end_imgs = [];
let longArm_end_imgs_i = 0;
let longArm_background;
let longArm_food_types_imgs;

let snake;
let longArm_food_coordinates;
let longArm_food_type_i;

const longArm_rez = 25;
let LA_w;
let LA_h;

// longArm_
function longArm_preload() {
  longArm_start_img = loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_startimg.png');
    longArm_background = loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_background.png');
    longArm_modes = [
        {name: "arm", headImg: loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_arm.png'), headR: PI*0.75, bodyImg: loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_body.png'), sizeH: 1.2, sizeW: 1},
        {name: "plane", headImg: loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_b707.png'), headR: PI, bodyImg: loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_f35.png'), sizeH: 1, sizeW: 0.8},
    ];
    longArm_food_types_imgs = [
        loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_food_m16.png'),
        loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_food_missle.png'),
        loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_food_uav.png'),
    ];
    longArm_end_imgs = [loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_endimg1.png'),loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_endimg2.png'),loadImage('http://spellcaster.sites.airnet/DJet/GameImages/longArm_endimg3.png')];

}

function saveGame_snake() {
	if(longArm_score < 1)
	  return;
  
	user_details["longArm_games"] += 1;
	updateSPValueInList("Users", "longArm_games", user_details["Id"], user_details["longArm_games"], true);
  
	let max = Math.max(longArm_score, user_details["longArm_max"]);
	user_details["longArm_max"] = max;
	if(max == longArm_score)
	  updateSPValueInList("Users", "longArm_max", user_details["Id"], user_details["longArm_max"], true);
  }


function longArm_setup() {
    longArm_mode = longArm_modes[1];
	  LA_w = floor(width / longArm_rez);
    LA_h = floor(height / longArm_rez);
}


function longArm_keyPressed(keyCode) {
      if(game_status == 32)
      {
          game_status -= 0.5;
          return;
      }
      if(keyCode >= 37 && keyCode <= 40 && game_status - game_code != 1)
          longArm_start_game();
      if (keyCode === LEFT_ARROW) {
      snake.setDir(-1, 0);
      } else if (keyCode === RIGHT_ARROW) {
      snake.setDir(1, 0);
      } else if (keyCode === DOWN_ARROW) {
      snake.setDir(0, 1);
      } else if (keyCode === UP_ARROW) {
      snake.setDir(0, -1);
      }
  }
  
function longArm_start_game() {
      game_status = 31;
      longArm_mode = longArm_modes[floor(random(longArm_modes.length))];
      longArm_score = 0;
      frameRate(10);
      snake = new Snake();
      longArm_newFood();
}

function longArm_newFood() {
  longArm_food_type_i = floor(random(longArm_food_types_imgs.length));
  longArm_food_coordinates = createVector(floor(random(LA_w)), floor(random(LA_h)));
}
  
function longArm_draw() {
    if(game_status == 30) {
        background(longArm_start_img);
        textStyle(BOLD);
        return;
    }
    scale(longArm_rez);
    background(longArm_background);

    if (round(game_status) == 32) {
        image(longArm_end_imgs[longArm_end_imgs_i], 0, LA_h/4, LA_w, LA_h/2);
        longArm_end_imgs_i = (longArm_end_imgs_i+1)%3;
        textSize(3);
        fill(0);

        text(longArm_score, LA_w / 2 + 0.5, LA_h / 2 + 4.25);
        
    

        fill(60);
        textAlign(CENTER);
        textSize(0.5);
        text("לחיצה כפולה על החצים למשחק חדש", LA_w / 2, LA_h - 0.75);

        return;
    }
    if (game_status == 31) {

        if (snake.eat(longArm_food_coordinates)) {
            longArm_newFood();
            longArm_score++;
        }
    
        snake.update();
        snake.show();
    
        if (snake.endGame()) {
            game_status++;
            return;
        }
    
        noStroke();
        fill(255, 0, 0);
        circle(longArm_food_coordinates.x+0.5, longArm_food_coordinates.y+0.5, 1);
        image(longArm_food_types_imgs[longArm_food_type_i], longArm_food_coordinates.x-0.25, longArm_food_coordinates.y-0.25, 1.5, 1.5);

        fill(255);
        textSize(32/longArm_rez);
    textStyle(BOLD);
    stroke(0);
    strokeWeight(2/longArm_rez);
        text(longArm_score, 20/longArm_rez, 50/longArm_rez);
        text(user_details["longArm_max"], 450/longArm_rez, 50/longArm_rez);
    strokeWeight(0);

    }
}
  class Snake {
    constructor() {
      this.body = [];
      this.body[0] = createVector(floor(LA_w / 2), floor(LA_h / 2));
      this.xdir = 0;
      this.ydir = 0;
      this.len = 0;
      this.prevDir = createVector(0, 0);
    }
  
    setDir(x, y) {
      if((x * this.xdir == -1 || y * this.ydir == -1) && this.len > 1)
        return;
      this.prevDir = createVector(this.xdir, this.ydir);
      this.xdir = x;
      this.ydir = y;
    }
  
    update() {
      let head = this.body[this.body.length - 1].copy();
      this.body.shift();
      head.x += this.xdir;
      head.y += this.ydir;
      this.body.push(head);
    }
  
    grow() {
      this.len++;
      this.body.unshift(this.body[this.body.length - 1].copy());
    }
  
    eat(pos) {
      let head = this.body[this.body.length - 1];
      if (head.x === pos.x && head.y === pos.y) {
        this.grow();
        return true;
      }
      return false;
    }
  
    endGame() {
      let head = this.body[this.body.length - 1];
      if (head.x > LA_w - 1 || head.x < 0 || head.y > LA_h - 1 || head.y < 0) {
		saveGame_snake();
        return true;
      }
      for (let i = 0; i < this.body.length - 1; i++) {
        let part = this.body[i];
        if (part.x === head.x && part.y === head.y) {
			saveGame_snake();
			return true;
        }
      }
      return false;
    }
  
    show() {
      for (let i = 0; i < this.body.length; i++) {
        push();
        translate(this.body[i].x + 0.5, this.body[i].y + 0.5);
        if (i === this.body.length - 1) {
            let angle = atan2(this.ydir, this.xdir);
            rotate(angle + longArm_mode.headR);
            image(longArm_mode.headImg, -1, -1, 2, 2);
        } else {
          let next = this.body[i + 1] || this.body[i];
          let angle = atan2(next.y - this.body[i].y, next.x - this.body[i].x);
          let isCorner = false;
          if(i > 0)
            isCorner = (this.body[i-1].x !== next.x && this.body[i-1].y !== next.y);
          if (isCorner && longArm_mode.name == "plane") {
            let prev = this.body[i - 1] || this.body[i];
            let prevAngle = atan2(this.body[i].y - prev.y, this.body[i].x - prev.x) ;
            
            let angleDiff = (angle - prevAngle + PI) % TWO_PI - PI;
            let angleAdjustment = (angleDiff === PI / 2 || angleDiff === -3 * PI / 2) ? PI / 4 :
                                (angleDiff === -PI / 2 || angleDiff === 3 * PI / 2) ? -PI / 4 :
                                (angleDiff === PI || angleDiff === -PI) ? PI / 2 : 0;
            
            rotate(prevAngle + angleAdjustment + random(-0.1, 0.1));


          } else {
            rotate(angle + random(-0.1, 0.1));
          }
          image(longArm_mode.bodyImg, random(-0.55, -0.45), random(-0.55, -0.45), longArm_mode.sizeH, longArm_mode.sizeW);
        }
        pop();
      }
    }
  }