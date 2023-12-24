/**
 * a Stickman Walking game
 */

/** environmental config */
const Engin = Object.freeze({
  // the force which pulls object down
  gravity: 0.8,
  // what slows down movement, ?inversely proportional?
  friction: 0.93,
});

/** game content config */
const Game = {
  foreground: new Map(),
  background: new Map(),
  seaLevel: 800,
  x: 0,
  y: 0,
  z: 0,
  zoff: 0.1,
  df: 2000,
  getLightSource() {
    return {
      x: Xmax - 250,
      y: this.seaLevel,
      z: 1,
      radius: 1500,
    };
  },
  createBlock(x, y, w = 200, h = 10) {
    this.foreground.set(
      "block_" + this.foreground.size,
      new Platform(x, y, w, h)
    );
  },
  renderBackground() {
    this.background.forEach((i) => i.show());
  },
  renderForeground() {
    const pos = getLightingShade(this, Game.getLightSource());
    this.foreground.forEach((i) => i.show());
    shade("green", 0, 0, 0);
    this.foreground.forEach((i) => i.show());
  },
};

// player
let Player = null;
// background
const bg = ctx.createLinearGradient(0, 300, 0, Ymax + 300);
bg.addColorStop(0, "#000");
bg.addColorStop(1, "#000");
// ground
const grd = ctx.createLinearGradient(0, 300, 0, Ymax + 300);
grd.addColorStop(0, "#511");
grd.addColorStop(1, "#000");

/**  (BETA) applying physics to element */
function applyPhysics() {
  /** REQUIRED variabled
        this.y = 0
        this.x = 100
        this.Z
        this.xVelocity = 0
        this.yVelocity = 0
        this.xAcceleration = 0
        this.yAcceleration = 0
        this.elasticity = 0.4
        this.mass = 10

        this.sizeX = 50
        this.sizeY = 50
     */
  let isOnPlatform = false;
  let currentPlatform = Game.seaLevel;

  // if is above platform
  for (const [k, v] of Game.foreground.entries()) {
    if (
      floor(this.y) >= floor(v.y) &&
      floor(this.y) != currentPlatform &&
      this.x >= v.x &&
      this.x < v.x + v.w
    ) {
      currentPlatform = v.y;
    }
  }

  // smooth de/acceleration of y velocity
  if (this.yAcceleration > 0) {
    if (this.yAcceleration < 2) this.yAcceleration = 0;
    this.yAcceleration *= Engin.friction; //* Engin.gravity
    if (this.yAcceleration < 0.1) this.yAcceleration = 0;
    else this.yVelocity -= this.yAcceleration;
  }

  // Y  under the ground, bounce
  if (this.y > currentPlatform && !isOnPlatform) {
    this.y = currentPlatform;
    this.yAcceleration = 0;
    this.yVelocity *= this.elasticity;
    // bounce
    if (posInt(this.yVelocity) > 0.1) {
      this.yAcceleration = this.yVelocity * Engin.friction * this.elasticity;
      this.yVelocity = 0;
    }
  }
  // Y in air, apply gravity
  else if (this.y < currentPlatform) {
    this.yVelocity += this.mass * Engin.gravity;
  }

  // safe shizzle
  if (posInt(this.xVelocity) < 0.01 && posInt(this.xVelocity) > 0)
    this.xVelocity = 0;
  if (
    (this.yVelocity < 0.01 && this.yVelocity > 0) ||
    (this.yVelocity > -0.01 && this.yVelocity < 0)
  ) {
    this.yVelocity = 0;
  }

  // friction
  this.xVelocity *= Engin.friction;
  this.yVelocity *= Engin.friction;

  // apply forces, depending on preference, go true walls or not
  if (!this.boudingdBox) {
    this.y += this.yVelocity;
    this.x += this.xVelocity;

    if (this.x > Xmax) this.x = Xmin;
    else if (this.x < Xmin) this.x = Xmax;
  } else {
    if (this.x > Xmax) this.x += -5;
    else this.x += this.x - this.sizeX <= Xmin ? 5 : this.xVelocity;
    this.y += this.y > currentPlatform ? 0 : this.yVelocity;
  }
}

/** sets ctx shadow from corrent angle */
function getLightingShade(targ, src) {
  if (!targ.z) targ.z = 1;
  if (!src.z) src.z = 1;

  const z = 100 * (targ.z + src.z);
  const dis = z - distanceTo(targ, src) / 10;
  const pos = posTowards(src, targ, dis);

  ctx.shadowColor = "#0008";
  ctx.shadowOffsetX = -pos.x;
  ctx.shadowOffsetY = -pos.y;
  ctx.shadowBlur = dis / 15;
  return pos;
}

/**  stickmna/player class */
class Stickman {
  constructor() {
    this.y = Game.seaLevel;
    this.x = 100;
    this.z = 1;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAcceleration = 0;
    this.yAcceleration = 0;
    this.elasticity = 0.45;
    this.mass = 10;
    this.jumpingPower = 9;
    this.speedX = 1;
    this.speedY = 1.7;

    this.sizeX = 50;
    this.sizeY = 50;
    this.direction = "";
    this.cl = "#f00";
    this.boudingdBox = false;

    this.legs = {
      spread: 30 * this.z,
      speed: 0.05 * this.z,
      height: 50 * this.z,
    };
    this.arms = {
      spread: 20 * this.z,
      speed: 0.05 * this.z,
      height: 40 * this.z,
      pos: 35 * this.z,
    };
    this.headSize = 20 * this.z;

    this.updatePhysics = applyPhysics.bind(this);
    this.puppetMasterY = Ymin - 100;
  }
  move(direction = null) {
    if (direction) this.direction = direction;
    switch (direction) {
      case "up":
        if (floor(this.yAcceleration) === 0 && this.yVelocity === 0) {
          this.yAcceleration = this.jumpingPower * this.speedY;
        }
        break;
      case "left":
        this.xVelocity -= this.speedX;
        break;
      case "right":
        this.xVelocity += this.speedX;
        break;
    }
    this.updatePhysics();
  }

  show() {
    this.move();
    const { arms, legs, headSize } = this;

    const y = this.y - 50 + Game.y;
    const x = this.x + Game.x;
    const z = this.z;

    const acc = 1 + this.yAcceleration / 10;
    const isLeft = this.direction === "left";
    const dis = distanceTo(this, Game.getLightSource());
    const cl = hsl(0, 100 - dis / 20, 100 - dis / 20);

    // legs, top
    const legy = y + legs.height;
    const leg1x = x + sin(x * legs.speed) * legs.spread * acc;
    const leg2x = x - sin(x * legs.speed) * legs.spread * acc;
    const shoeSize = isLeft ? -8 : 8;

    // arms
    const army = y - arms.pos + arms.height;
    const arm1x = x + sin(x * arms.speed) * arms.spread * acc;
    const arm2x = x - sin(x * arms.speed) * arms.spread * acc;
    // head
    const bodyHeight = 50 * z + sin(x * legs.speed * 2) * 2;

    // have to run in 2 loops otherwise shadow will go ontop of objets
    const lineToDraw = [
      [x, y - arms.pos, arm2x, army], //arm back
      [x, y, leg2x, legy], // leg back
      [leg2x - 2, legy - 2, leg2x + shoeSize, legy - 2], // shoe back
      [x, y - bodyHeight, x, y], // body
      [x, y, leg1x, legy], // kleg front
      [leg1x - 2, legy - 2, leg1x + shoeSize, legy - 2], // shoe front
      [x, y - arms.pos, arm1x, army], // arm front
    ];
    getLightingShade(this, Game.getLightSource());
    ctx.lineWidth = 6 * z;

    // puppet master lines
    lineToDraw.forEach((i) => {
      line(this.x, this.puppetMasterY, i[2], i[3], hsl(0, 10, 10, 0.1));
    });

    // body shadow
    ctx.lineWidth = 6 * z;
    lineToDraw.forEach((i) => {
      line(i[0], i[1], i[2], i[3], "#000");
    });
    point(x, y - bodyHeight, headSize, "#000");

    // actual body
    ctx.shadowColor = "rgba(0,0,0,0)";
    shade();
    lineToDraw.forEach((i) => {
      line(i[0], i[1], i[2], i[3], cl);
    });
    point(x, y - bodyHeight, headSize, cl);

    // ctx.lineWidth = 2
    // const sizeX =  (arm1x - arm2x)
    // const sizeY = (bodyHeight + (this.y-army) + headSize/2)
    // rect(x-sizeX, this.y, x+sizeX, this.y-sizeY, "#00f")
  }
}

class PerlinLine {
  constructor() {
    this.x = 0.1;
    this.y = Game.seaLevel - 300;
    this.zoff = randint(1000);
  }
  show() {
    // this.y+= 1
    // this.y = overCount(this.y, Game.seaLevel)
    let x = 0;
    let lx = x;
    let y = this.y;
    let ly = y;
    while (x < Xmax) {
      const value = noise.perlin3(
        x / Game.df,
        y / Game.df,
        Game.zoff + this.zoff
      );
      const angle = ((1 + value) * 1.1 * 128) / PI2;
      const p = rotateVector(x, y, angle);

      line(lx, ly, x + p.x, y + p.y, "#00F9");
      lx = x;
      ly = y;
      x += posInt(p.x);
      y -= p.y / 10;
    }
  }
}

/** background triangles */
class FloatingShape {
  constructor(id) {
    this.id = id;
    this.x = randint(Xmax);
    this.y = randint(Ymin, Game.seaLevel);
    this.z = randfloat();
    this.size = (randfloat() + 1) * 100;
    this.cl = hsl(randfloat() * 36, 30, 20);
    this.rotation = randint(360);
    this.rotSpeed = (2 - (1 * this.size) / 100) / 1.2;
    if (this.rotSpeed < 0.3) this.rotSpeed += 1;
    this.falling = false;
    this.mountain = false;
    this.speed = {
      x: 0, // randfloat(-1, 1),
      y: 0, // randfloat(-1, 1)
    };
  }
  show() {
    const pos = getLightingShade(this, Game.getLightSource());
    if (!this.mountain) {
      if (this.falling) {
        if (this.y < Game.seaLevel) this.y += this.speed.y;
        else this.mountain = true;
      }

      if (floor(this.rotation) >= 360 && !this.falling) {
        this.speed.y = 2;
        this.falling = true;
      } else if (!this.falling) this.rotation += this.rotSpeed;
    }
    const y = this.y - 50;
    const x = this.x + Game.x;
    const z = this.z + Game.z;

    const value = noise.perlin3(x / Game.df, y / Game.df, z);
    const angle = ((1 + value) * 1.1 * 128) / PI2;
    const v = rotateVector(x, y, angle);

    triangle(x + v.x, y + v.y, this.size, this.cl, {
      rotate: overCount(this.rotation, 360),
    });
    if (x > Xmax || x < Xmin) this.speed.x *= -1;
    if (y > Game.seaLevel || y < Ymin) this.speed.y *= -1;
    ctx.shadowColor = "rgba(0,0,0,0)";
  }
}

/** platform */
class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.z = 1;
    this.cl = "#222";
  }
  show() {
    rect(this.x, this.y, this.x + this.w, this.y + this.h, null, this.cl);
  }
}

async function animate() {
  clear();
  rect(0, 0, Xmax, Ymax, null, bg);
  /** INSERT: back */
  Game.renderBackground();
  // lightsource
  setLightSpot({ ...Game.getLightSource(), cl: "#f44", varLight: 2 });
  /** INSERT: front */

  Game.renderForeground();
  Game.zoff += 0.002;

  Player.show();
  /** END  */
  rect(0, Game.seaLevel, Xmax, Ymax, null, grd);
  await pauseHalt();
  if (!exit) requestAnimationFrame(animate);
}

const init = async () => {
  Player = new Stickman();
  // Game.background.set('line', new PerlinLine())
  // Game.background.set('line2', new PerlinLine())
  range(10).forEach((i, idx) =>
    Game.background.set("square_" + idx, new FloatingShape("square_" + idx))
  );
  // Game.background.set('line3', new PerlinLine())
  //Game.background.set('line4', new PerlinLine())

  Game.createBlock(Xmid - 400, Game.seaLevel - 100);
  Game.createBlock(Xmid - 220, Game.seaLevel - 190);
  Game.createBlock(Xmid, Game.seaLevel - 290);

  Events.setKeys(
    [
      ["ArrowRight", () => Player.move("right")],
      ["ArrowLeft", () => Player.move("left")],
      ["ArrowUp", () => Player.move("up")],
      ["ArrowDown", () => Player.move("down")],
    ],
    "player_1"
  );

  Events.setKey("r", () => window.location.reload());
  animate();
};
init();
