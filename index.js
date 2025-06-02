var game = {
  player: {
    start_pos: {
      x: 100,
      y: 255
    }
  }
};

// Ground
var ground = createGroup();
var g1 = createSprite(0, 400);
var g2 = createSprite(400, 400);

ground.add(g1);
ground.add(g2);

ground.setAnimationEach("ground");
ground.setVelocityXEach(-5);

ground.setWidthEach(800);
ground.setHeightEach(250);

// Background
var background = createGroup();
var b1 = createSprite(0, 130);
var b2 = createSprite(400, 130);

background.add(b1);
background.add(b2);

background.setAnimationEach("background");
background.setVelocityXEach(-1.25);

background.setWidthEach(800);
background.setHeightEach(300);

// Player
var player_dead = false;
var player_jumping = false;

var player = createSprite(
  game.player.start_pos.x,
  game.player.start_pos.y
);

player.setAnimation("player");

player.width = 50;
player.height = 50;

// Lobotomy
var lobotomy1 = createSprite(200, 200);

lobotomy1.setAnimation("normal");
lobotomy1.alpha = 0.1;

lobotomy1.width = 400;
lobotomy1.height = 400;

// More Lobotomy
var feeted = false;
var lobotomy2 = createSprite(
  game.player.start_pos.x - 70,
  game.player.start_pos.y
);

lobotomy2.setAnimation("normal");
lobotomy2.tint = "red";

lobotomy2.height = 50;
lobotomy2.width = 50;

lobotomy2.alpha = 0.001;

// Spikes
var spikes = [0, 0, 0].map(function(_, i) {
  var spike = createSprite(50 * i, game.player.start_pos.y;

  spike.setCollider("rectangle", 0, 0, 50, 50, 0);

  spike.setAnimation("spike");
  spike.alpha = 0;
  
  spike.height = 50;
  spike.width = 50;
  
  return spike;
});

// End screen
var end_screen = createSprite(200, 200);

end_screen.setAnimation("black");

end_screen.height = 400;
end_screen.width = 400;

end_screen.alpha = 0;
end_screen.depth = 69;

/* set depth after spikes are declared */
lobotomy1.depth = 420;

function draw() {
  if (player_dead) {
    lobotomy1.alpha *= 1.05;
    
    drawSprites();

    return;
  }
  // Ground animation
  if (ground.get(0).x < -400) ground.get(0).x = 400;
  if (ground.get(1).x < -400) ground.get(1).x = 400;
  
  // Background animation
  if (background.get(0).x < -400) background.get(0).x = 400;
  if (background.get(1).x < -400) background.get(1).x = 400;
  
  // Player jump animation
  /* Initial jump */
  if (keyDown("space") && !player_jumping) {
    player_jumping = true;

    player.velocityY = -5;
    player.rotationSpeed = 5.5;
  }
    
  /* Deceleration */
  if (!(player.y > game.player.start_pos.y - 100))
    player.velocityY += 5;
    
  /* Landing */
  if (player.y > game.player.start_pos.y) {
    player.y = game.player.start_pos.y;
    player.velocityY = 0;
      
    player.rotation = Math.round(player.rotation / 90) * 90;
    player.rotationSpeed = 0;

    player_jumping = false;
  }
  
  // Lobotomy
  lobotomy1.alpha *= 0.9;
  
  if (lobotomy1.alpha < 0.01) {
    var rand1 = Math.random() < 0.2;

    lobotomy1.setAnimation(rand1 ? "extreme" : "normal");
    lobotomy1.alpha = rand1 ? 7.5 : 3;
    
    setTimeout(function() {
      playSound(rand1
        ? "fire-in-the-hole-low.mp3"
        : "fire-in-the-hole-high.mp3");
    }, 50);
    
    playSound("vine-boom.mp3");
  }
  
  // More Lobotomy
  if (lobotomy2.alpha < 1) lobotomy2.alpha *= 1.1;
  else if (!feeted) {
    playSound("feet.mp3", true);
    
    feeted = true;
  }

  lobotomy2.y = player.y;
  
  // Spike generation
  var rand2 = Math.random();

  if (spikes[spikes.length - 1].x < 0) {
    spikes.forEach(function(spike, i) {
      spike.alpha = rand2 > (i / spikes.length) ? 1 : 0;

      spike.x = 400 + 40 * i;
    });
  }
    
  spikes.forEach(function(spike) {
    if (!player_dead && spike.alpha === 1 && spike.isTouching(player)) {
      player_dead = true;
      
      if (!feeted) playSound("feet.mp3", true);
      
      lobotomy1.setAnimation("normal");
      lobotomy1.tint = "red";
      lobotomy1.alpha = 0.001;
      
      end_screen.alpha = 1;
    }

    spike.x -= 10;
  });

  drawSprites();
}

