import {
  Graphics,
  Application as PixiApp,
  Text as PixiText,
  Sprite as PixiSprite,
  ParticleContainer as PixiParticleContainer,
} from "pixi.js";
import { boids, init, keepWithinBounds, updateBoids } from "./boid";

declare namespace PIXI {
  let Application: any;
  let Text: any;
  let Graphics: any;
  let Sprite: any;
  let Texture: any;
  let ParticleContainer: any;
}

let app: PixiApp = new PIXI.Application({
  width: 0,
  height: 0,
  resizeTo: window,
  backgroundColor: 0x919191,
});

// app.renderer.context.mozImageSmoothingEnabled = false;
// renderer.context.webkitImageSmoothingEnabled = false;
document.body.appendChild(app.view as any);

//@ts-expect-error
const stats = new Stats();
stats.domElement.id = "stats";
document.body.append(stats.domElement);

const appScreen = {
  width: window.innerWidth,
  height: window.innerHeight,
};

init(appScreen);

let boidGraphics: PixiSprite[] = new Array(boids.length);
let container = new PIXI.ParticleContainer(boids.length, [
  false,
  true,
  false,
  false,
  false,
]);

app.stage.addChild(container);

for (let i = 0; i < boids.length; i += 1) {
  const size = boids[i].size;
  const color = 0x303030;

  var sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
  sprite.tint = color; //Change with the color wanted
  sprite.width = size;
  sprite.height = size;

  boidGraphics[i] = sprite;
  container.addChild(sprite);

  //   const g = new PIXI.Graphics();
  //   g.beginFill(color);
  //   boidGraphics[i] = g;
  //   g.drawRect(0, 0, size, size);
  //   app.stage.addChild(g);
}

const screenMargin = 200;

const turnFactor = 100;

app.ticker.add(() => {
  stats.begin();
  const delta = app.ticker.deltaMS;
  // updateBoids(delta / 1000, appScreen);

  const d = delta / 1000;
  for (let i = 0; i < boids.length; i += 1) {
    const boid = boids[i];
    boid.x += boid.dx * d;
    boid.y += boid.dy * d;

    // keepWithinBounds(boid, d, screen);

    if (boid.x < screenMargin) boid.dx += turnFactor * d;
    if (boid.x > screen.width - screenMargin) boid.dx -= turnFactor * d;
    if (boid.y < screenMargin) boid.dy += turnFactor * d;
    if (boid.y > screen.height - screenMargin) boid.dy -= turnFactor * d;

    boidGraphics[i].position.x = boids[i].x;
    boidGraphics[i].position.y = boids[i].y;
  }
  stats.end();
});

function onResize() {
  appScreen.width = window.innerWidth;
  appScreen.height = window.innerHeight;
}
window.addEventListener("resize", onResize);
