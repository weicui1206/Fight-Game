const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.height = 576;
canvas.width = 1024;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 615,
    y: 121,
  },
  imageSrc: "./img/shop.png",
  scale: 2.8,
  frameMax: 6
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },

  velocity: {
    x: 0,
    y: 0,
  },

  color: "red",

  offset: {
    x: 0,
    y: 0,
  },
  imageSrc:'./img/samuraiMack/Idle.png',
  frameMax: 8,
  scale: 2,

  offset: {
    x: 125,
    y:95
  },

  sprites:{
    idle:{
      imageSrc:'./img/samuraiMack/Idle.png',
      frameMax: 8,

    },
    run:{
      imageSrc:'./img/samuraiMack/Run.png',
      frameMax: 8,
    },
    jump:{
      imageSrc:'./img/samuraiMack/Jump.png',
      frameMax: 2,
    },
    fall:{
      imageSrc:'./img/samuraiMack/Fall.png',
      frameMax: 2,
    },
    attack1:{
      imageSrc:'./img/samuraiMack/Attack1.png',
      frameMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit.png',
      frameMax: 4
    },
    death:{
      imageSrc: './img/samuraiMack/Death.png',
      frameMax: 6
    }
  },

  attackBox: {
    offset:{
      x: 100,
      y: 50
    }, 
    width: 84,
    height:50,
  }
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 0,
  },

  velocity: {
    x: 0,
    y: 0,
  },

  color: "blue",

  offset: {
    x: -50,
    y: 0,
  },

  imageSrc:'./img/kenji/Idle.png',
  frameMax: 8,
  scale: 2,

  offset: {
    x: 125,
    y:105
  },

  sprites:{
    idle:{
      imageSrc:'./img/kenji/Idle.png',
      frameMax: 4,

    },
    run:{
      imageSrc:'./img/kenji/Run.png',
      frameMax: 8,
    },
    jump:{
      imageSrc:'./img/kenji/Jump.png',
      frameMax: 2,
    },
    fall:{
      imageSrc:'./img/kenji/Fall.png',
      frameMax: 2,
    },
    attack1:{
      imageSrc:'./img/kenji/Attack1.png',
      frameMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take Hit.png',
      frameMax: 3
    },
    death:{
      imageSrc: './img/kenji/Death.png',
      frameMax: 7
    }
  },

  attackBox: {
    offset:{
      x: -120,
      y: 50
    }, 
    width: 100,
    height:50,
  }
});

const keys = {
  a: {
    pressed: false,
  },

  d: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  shop.update();
  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0;

  
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x -= 3; 
    player.switchSprite('run');
    
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x += 3;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  if(player.velocity.y < 0) {
    player.switchSprite('jump');
    
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  //enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x -= 3;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x += 3;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  if(enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
    
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }


  //detect collision and gethit
  if (retangularCollision(player, enemy) && player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
    enemy.takeHit()
    
    gsap.to('#enemyHealth', {
      width: enemy.health + "%"
    })
  }
  //if player misses
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }


  if (retangularCollision(enemy, player) && enemy.isAttacking) {
    player.takeHit()
    enemy.isAttacking = false;
   
    gsap.to('#playerHealth', {
      width: player.health + "%"
    })

  }
   //if enemy misses
   if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  

  //end game based on health
  if (player.health <= 0 || enemy.health <= 0) {
    determinWinner(player, enemy, timerId);
  }
}

decreaseTimer();

animate();

window.addEventListener("keydown", (event) => {
  if(!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
  
      case "a":
        player.lastKey = "a";
        keys.a.pressed = true;
        break;
  
      case "w":
        player.velocity.y -= 22;
        break;
  
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch(event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
  
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
  
      case "ArrowUp":
        enemy.velocity.y -= 22;
        break;
  
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
  
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
