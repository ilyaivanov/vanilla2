let width = window.innerWidth;
let height = window.innerHeight;

var stats;
var counter;
var currentTexture;

var bunnys = [];
var gravity = 1.2; //1.5 ;

const maxX = width;
const minX = 0;
const maxY = height;
const minY = 0;

const SQUARE_COUNT = 250_000;
const SQUARE_SIZE = 1;

const renderer = PIXI.autoDetectRenderer(width, height, {
  backgroundColor: 0xffffff,
});
const stage = new PIXI.Stage(0xffffff);
var container = new PIXI.ParticleContainer(SQUARE_COUNT, [
  false,
  true,
  false,
  false,
  false,
]);

stage.addChild(container);

document.body.appendChild(renderer.view);
stats = new Stats();

document.body.appendChild(stats.domElement);
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";
requestAnimationFrame(update);

var wabbitTexture = new PIXI.Texture.fromImage("");

var t = new PIXI.Texture(
  wabbitTexture.baseTexture,
  new PIXI.math.Rectangle(0, 0, SQUARE_SIZE, SQUARE_SIZE)
);
// t.tint = 0x000000;

// const t = PIXI.Texture.WHITE;

for (var i = 0; i < SQUARE_COUNT; i++) {
  var bunny = new PIXI.Sprite(t);
  bunny.cacheAsBitmap = true;
  bunny.speedX = Math.random() * 10;
  bunny.speedY = Math.random() * 10 - 5;

  bunny.anchor.x = 0.5;
  bunny.anchor.y = 1;

  bunnys.push(bunny);

  container.addChild(bunny);
}

function update() {
  stats.begin();

  for (var i = 0; i < bunnys.length; i++) {
    var bunny = bunnys[i];

    bunny.position.x += bunny.speedX;
    bunny.position.y += bunny.speedY;
    bunny.speedY += gravity;

    if (bunny.position.x > maxX) {
      bunny.speedX *= -1;
      bunny.position.x = maxX;
    } else if (bunny.position.x < minX) {
      bunny.speedX *= -1;
      bunny.position.x = minX;
    }

    if (bunny.position.y > maxY) {
      bunny.speedY *= -0.85;
      bunny.position.y = maxY;
      bunny.spin = (Math.random() - 0.5) * 0.2;
      if (Math.random() > 0.5) {
        bunny.speedY -= Math.random() * 6;
      }
    } else if (bunny.position.y < minY) {
      bunny.speedY = 0;
      bunny.position.y = minY;
    }
  }

  renderer.render(stage);
  requestAnimationFrame(update);
  stats.end();
}
