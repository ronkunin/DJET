let flappyJet_score;
let flappyJet_bird;
let flappyJet_pipes = [];

let flappyJet_start_img;
let flappyJet_flappy_img;
let flappyJet_building_img;
let flappyJet_background_img;
let flappyJet_end_img;

function flappyJet_preload() {
  flappyJet_start_img = loadImage('http://spellcaster.sites.airnet/DJet/GameImages/flappyJet_startImg.png');
  flappyJet_building_img = loadImage('http://spellcaster.sites.airnet/DJet/GameImages/flappyJet_building.png'); // Image  building
  flappyJet_background_img = loadImage('http://spellcaster.sites.airnet/DJet/GameImages/flappyJet_background.jpg'); // Background image
  flappyJet_flappy_img = loadImage('http://spellcaster.sites.airnet/DJet/GameImages/flappyJet_uav.png');
  flappyJet_end_img = loadImage('http://spellcaster.sites.airnet/DJet/GameImages/flappyJet_endImg.png');

}
//flappyJet_


function flappyJet_keyPressed(keyCode) {
  if(keyCode == UP_ARROW) {
    if(game_status == 12)
    {
      game_status--;
      flappyJet_start_game();
      return;
    }
    if(game_status == 11)
    {
        flappyJet_bird.up();
        return;
    }
    if(game_status == 10)
    {
      game_status++;
      flappyJet_start_game();
    }
  }
}


function flappyJet_setup() {
    textStyle(BOLD);
    textAlign(CENTER,CENTER);
    image(flappyJet_start_img, 0, 0, 500, 500);
}

function flappyJet_start_game() {
    frameCount = 0;
    flappyJet_score = 0;
    flappyJet_bird = new Bird();
    flappyJet_pipes = [];
    flappyJet_pipes.push(new Pipe());
}

function flappyJet_draw() {
  if(game_status == 10) {
    background(flappyJet_start_img);
    return;
  }
  if (game_status == 11) {
      image(flappyJet_background_img, 0, 0, 500, 500);

      flappyJet_bird.update();
      flappyJet_bird.show();

      // Handle pipes
      if (frameCount % 90 === 0) {
          flappyJet_pipes.push(new Pipe(3+frameCount/200));
      }
      for (let i = flappyJet_pipes.length - 1; i >= 0; i--) {
          flappyJet_pipes[i].update();
          flappyJet_pipes[i].show();

          // Check for collisions
          if (flappyJet_pipes[i].hits(flappyJet_bird)) {
            game_status++;
            log_game();
          }

          // Remove off-screen pipes
          if (flappyJet_pipes[i].offscreen()) {
            flappyJet_pipes.splice(i, 1);
            flappyJet_score++; // Increment flappy_score when passing pipes
        }
      }

      // Display flappy_score
      textSize(32);
      fill(255);
      text(flappyJet_score, 20, 50);
      if(user_details != null)
        text(user_details["fluppyjet_max"], 475, 50);
  } 
  if(game_status == 12){
      // Game over screen
      textSize(64);
      fill(255, 255, 255);
      textAlign(CENTER, CENTER);
      image(flappyJet_end_img, 10, 10, 500, 500);
      textSize(50);
      text(flappyJet_score, width / 2 - 120, height / 2 + 30);

  }
}

class Bird {
    constructor() {
      this.y = height / 2;
      this.x = 64;
      this.gravity = 0.6;
      this.lift = -15;
      this.velocity = 0;
      this.deg = 0;
      this.icon = flappyJet_flappy_img;
    }
  
    show() {
      //image(this.icon, this.x, this.y, 50, 50);
      push();
      translate(this.x, this.y);
      rotate(this.deg);
      imageMode(CENTER);
      image(this.icon,0, 0, 50, 30);
      pop();
  
    }
  
    up() {
      this.velocity += this.lift;
    }
  
    update() {
      this.velocity += this.gravity;
      this.velocity *= 0.9; // Air resistance
      this.y += this.velocity;
      this.deg = lerp(this.deg, radians(this.velocity * 2), 0.1);

  
      // Bird hits ground
      if (this.y > height) {
        this.y = height;
        this.velocity = 0;
        game_status++;
        log_game();
      }
  
      // Bird hits ceiling
      if (this.y < 0) {
        this.y = 0;
        this.velocity = 0;
      }
    }
  }
  
  class Pipe {
    constructor(sp=3) {
      this.spacing = 175;
      this.top = random(height / 6, 3 / 4 * height);
      this.bottom = height - (this.top + this.spacing);
      this.x = width;
      this.w = 80;
      this.speed = sp;
    }
  
    show() {
      // Display top building image
      push();
      translate(0, this.top);
      scale(1,-1);
      image(flappyJet_building_img, this.x, 0, this.w, this.top);
      pop();

      // Display bottom building image
      
      image(flappyJet_building_img, this.x, height - this.bottom, this.w, this.bottom);
    }
  
    update() {
      this.x -= this.speed;
    }
  
    offscreen() {
      return this.x < -this.w;
    }
  
    hits(bird) {
      if (bird.y < this.top || bird.y > height - this.bottom) {
        if (bird.x > this.x && bird.x < this.x + this.w) {
          return true;
        }
      }
      return false;
    }
  }



  function log_game() {
    if(flappyJet_score < 1)
      return;
  
    user_details["fluppyjet_games"] += 1;
    updateSPValueInList("Users", "fluppyjet_games", user_details["Id"], user_details["fluppyjet_games"], true);
  
    let max = Math.max(flappyJet_score, user_details["fluppyjet_max"]);
    user_details["fluppyjet_max"] = max;
    if(max == flappyJet_score)
      updateSPValueInList("Users", "fluppyjet_max", user_details["Id"], user_details["fluppyjet_max"], true);
  
  }