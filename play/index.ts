import { Boid, boids, init, updateBoids } from "./boid";

const canvas = document.createElement("canvas");
const app = {
  width: window.innerWidth,
  height: window.innerHeight,
};
document.body.appendChild(canvas);

canvas.width = app.width;
canvas.height = app.height;

const ctx = canvas.getContext("2d")!;

function draw() {
  ctx.fillStyle = "#919191";
  ctx.fillRect(0, 0, app.width, app.height);

  ctx.fillStyle = "#303030";
  ctx.beginPath();
  for (let i = 0; i < boids.length; i += 1) {
    const boid = boids[i];

    ctx.fillRect(boid.x, boid.y, boid.size, boid.size);
  }

  drawFps();
}

let time = 0;
function onTick(newtime: number) {
  const delta = newtime - time;

  updateBoids(delta / 1000, app);

  updateFps(delta / 1000);
  draw();

  time = newtime;
  requestAnimationFrame(onTick);
}

requestAnimationFrame(onTick);

function onResize() {
  app.width = window.innerWidth;
  app.height = window.innerHeight;

  canvas.width = app.width;
  canvas.height = app.height;
}
window.addEventListener("resize", onResize);

//FPS counter
let fps = new Array(100);
let currentFps = 0;
let averageFps = 0;
function updateFps(deltaTime: number) {
  fps[currentFps] = deltaTime;
  currentFps += 1;
  if (currentFps >= fps.length) currentFps = 0;

  averageFps = 0;
  let nonZeroCount = 0;
  for (let i = 0; i < fps.length; i += 1) {
    if (fps[i]) {
      averageFps += fps[i] * 1000;
      nonZeroCount += 1;
    }
  }
  averageFps /= nonZeroCount;
}

function drawFps() {
  ctx.fillStyle = "#303030";
  ctx.fillText(Math.round(1000 / averageFps) + "fps", app.width - 80, 20);
}

init(app);
draw();
