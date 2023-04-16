const canvas = document.createElement("canvas");
const app = {
  width: window.innerWidth,
  height: window.innerHeight,
};
document.body.appendChild(canvas);

canvas.width = app.width;
canvas.height = app.height;

const ctx = canvas.getContext("2d")!;

type Boid = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
};
const boidsCount = 110000;
const screenMargin = 200;
const maxSpeed = 180;
const turnFactor = 100;

const boids: Boid[] = new Array(boidsCount);
for (let i = 0; i < boidsCount; i += 1) {
  boids[i] = {
    x: randomNumber(0, app.width),
    y: randomNumber(0, app.height),
    dx: randomNumber(-maxSpeed, maxSpeed),
    dy: randomNumber(-maxSpeed, maxSpeed),
    size: randomNumber(0.5, 1.5),
  };
}

function draw() {
  ctx.fillStyle = "#919191";
  ctx.fillRect(0, 0, app.width, app.height);

  ctx.fillStyle = "#303030";
  ctx.beginPath();
  for (let i = 0; i < boidsCount; i += 1) {
    const boid = boids[i];

    ctx.fillRect(boid.x, boid.y, boid.size, boid.size);
  }

  drawFps();
}

function keepWithinBounds(boid: Boid, deltaTime: number) {
  if (boid.x < screenMargin) boid.dx += turnFactor * deltaTime;
  if (boid.x > app.width - screenMargin) boid.dx -= turnFactor * deltaTime;
  if (boid.y < screenMargin) boid.dy += turnFactor * deltaTime;
  if (boid.y > app.height - screenMargin) boid.dy -= turnFactor * deltaTime;
}

function update(deltaTime: number) {
  for (let i = 0; i < boidsCount; i += 1) {
    const boid = boids[i];
    boid.x += boid.dx * deltaTime;
    boid.y += boid.dy * deltaTime;

    keepWithinBounds(boid, deltaTime);
  }

  updateFps(deltaTime);
}

let time = 0;
function onTick(newtime: number) {
  const delta = newtime - time;

  update(delta / 1000);

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
  draw();
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

// helpers

function randomNumber(from: number, to: number) {
  return from + Math.random() * (to - from);
}

draw();
