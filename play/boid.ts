export type Boid = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
};

export type AppScreen = {
  width: number;
  height: number;
};

const boidsCount = 200000;
const screenMargin = 200;
const maxSpeed = 180;
const turnFactor = 100;

export const boids: Boid[] = new Array(boidsCount);

export function init(screen: AppScreen) {
  for (let i = 0; i < boidsCount; i += 1) {
    boids[i] = {
      x: randomNumber(0, screen.width),
      y: randomNumber(0, screen.height),
      dx: randomNumber(-maxSpeed, maxSpeed),
      dy: randomNumber(-maxSpeed, maxSpeed),
      size: 2,
    };
  }
}

export function keepWithinBounds(
  boid: Boid,
  deltaTime: number,
  screen: AppScreen
) {
  if (boid.x < screenMargin) boid.dx += turnFactor * deltaTime;
  if (boid.x > screen.width - screenMargin) boid.dx -= turnFactor * deltaTime;
  if (boid.y < screenMargin) boid.dy += turnFactor * deltaTime;
  if (boid.y > screen.height - screenMargin) boid.dy -= turnFactor * deltaTime;
}

export function updateBoids(deltaTime: number, screen: AppScreen) {
  for (let i = 0; i < boidsCount; i += 1) {
    const boid = boids[i];
    boid.x += boid.dx * deltaTime;
    boid.y += boid.dy * deltaTime;

    keepWithinBounds(boid, deltaTime, screen);
  }
}

// helpers

function randomNumber(from: number, to: number) {
  return from + Math.random() * (to - from);
}
