let width = window.innerWidth;
let height = window.innerHeight;

var stage;
var stats;
var counter;
var currentTexture;

var bunnys = [];
var gravity = 1.2; //1.5 ;

const maxX = width;
const minX = 0;
const maxY = height;
const minY = 0;

const SQUARE_COUNT = 50_000;
const SQUARE_SIZE = 1;

// const app = new PIXI.Application({
//   width: 0,
//   height: 0,
//   resizeTo: window,
//   backgroundColor: 0x919191,
// });

const renderer = PIXI.autoDetectRenderer({
  width,
  height,
  backgroundColor: 0x002200,
});
console.log(renderer);
// stage = new PIXI.Stage(0xffffff);
var container = new PIXI.ParticleContainer(SQUARE_COUNT, [
  false,
  true,
  false,
  false,
  false,
]);

// app.stage.addChild(container);

document.body.appendChild(renderer.view);
stats = new Stats();

document.body.appendChild(stats.domElement);
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";
requestAnimationFrame(update);

// var wabbitTexture = PIXI.Texture.from("");

var t = new PIXI.Texture(
  PIXI.Texture.WHITE,
  new PIXI.Rectangle(0, 0, SQUARE_SIZE, SQUARE_SIZE)
);

// const t = PIXI.Texture.WHITE;

for (var i = 0; i < SQUARE_COUNT; i++) {
  var bunny = new PIXI.Sprite(t);
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

  renderer.render(container);
  requestAnimationFrame(update);
  stats.end();
}
