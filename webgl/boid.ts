// min:-1
// max: 1

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

export const boidsCount = 1_000;
const screenMargin = 0.9;
const maxSpeed = 0.003;
const turnFactor = 0.000005;

export const boids = new Float32Array(boidsCount * 2);
export const speeds = new Float32Array(boidsCount * 2);

// export const boids: Boid[] = new Array(boidsCount);

export function init() {
  for (let i = 0; i < boidsCount; i += 1) {
    setPoint(
      boids,
      i,
      randomNumber(-screenMargin, screenMargin),
      randomNumber(-screenMargin, screenMargin)
    );
    setPoint(
      speeds,
      i,
      randomNumber(-maxSpeed, maxSpeed),
      randomNumber(-maxSpeed, maxSpeed)
    );
  }
}

export function onBoidsTick(deltaTime: number) {
  for (let i = 0; i < boidsCount; i += 1) {
    const cellIndex = i * 2;
    const x = boids[cellIndex] + speeds[cellIndex];
    const y = boids[cellIndex + 1] + speeds[cellIndex + 1];
    boids[cellIndex] = x;
    boids[cellIndex + 1] = y;

    keepWithinBounds(i, deltaTime);
  }
}

export function keepWithinBounds(boidIndex: number, deltaTime: number) {
  const cellIndex = boidIndex * 2;
  const x = boids[cellIndex];
  const y = boids[cellIndex + 1];
  if (x < -screenMargin)
    speeds[cellIndex] = Math.min(
      maxSpeed,
      speeds[cellIndex] + turnFactor * deltaTime
    );
  if (x > screenMargin)
    speeds[cellIndex] = Math.max(
      -maxSpeed,
      speeds[cellIndex] - turnFactor * deltaTime
    );

  if (y < -screenMargin)
    speeds[cellIndex + 1] = Math.min(
      maxSpeed,
      speeds[cellIndex + 1] + turnFactor * deltaTime
    );

  if (y > screenMargin)
    speeds[cellIndex + 1] = Math.max(
      -maxSpeed,
      speeds[cellIndex + 1] - turnFactor * deltaTime
    );
}

function setPoint(buffer: Float32Array, index: number, x: number, y: number) {
  const cellIndex = index * 2;

  buffer[cellIndex] = x;
  buffer[cellIndex + 1] = y;
}

// helpers

function randomNumber(from: number, to: number) {
  return from + Math.random() * (to - from);
}
