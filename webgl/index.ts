import { AppScreen, boids, boidsCount, init, onBoidsTick } from "./boid";

const canvas = document.createElement("canvas");

const app: AppScreen = {
  width: window.innerWidth,
  height: window.innerHeight,
};

canvas.width = app.width;
canvas.height = app.height;

document.body.appendChild(canvas);

const gl = canvas.getContext("webgl2")!;

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

init();

const program = gl.createProgram()!;

function createShader(code: string, c: any) {
  const shader = gl.createShader(c)!;
  gl.shaderSource(shader, code);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  gl.attachShader(program, shader);
}

// Shaders
type Precision = "lowp" | "mediump" | "highp";

const vertextSharedCode = `#version 300 es
precision mediump float;
in vec2 position;
void main(){
    gl_Position = vec4(position.x, position.y, 0.0, 1.0); //x,y,z,w
    gl_PointSize = 1.0;
}
`;

const fragmentShaderCode = `#version 300 es
precision mediump float;
out vec4 color;
void main(){
    color = vec4(0.8, 0.8, 0.8, 1.0); //r,g,b,a
}
`;

createShader(vertextSharedCode, gl.VERTEX_SHADER);
createShader(fragmentShaderCode, gl.FRAGMENT_SHADER);

gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
}

// Buffers
const buffer = gl.createBuffer();

// Link GPU variable to CPU and sending data to GPU
gl.useProgram(program);
const position = gl.getAttribLocation(program, "position");

gl.enableVertexAttribArray(position);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

// gl.drawArrays(gl.POINTS, 0, POINTS_COUNT);
//@ts-expect-error
const stats = new Stats();
stats.domElement.id = "stats";
document.body.append(stats.domElement);

let time = 0;
function onTick(newTime: number) {
  stats.begin();
  onBoidsTick(newTime - time);

  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.bufferData(gl.ARRAY_BUFFER, boids, gl.DYNAMIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, boidsCount);

  requestAnimationFrame(onTick);
  time = newTime;

  stats.end();
}

requestAnimationFrame(onTick);
// gl.bindBuffer(gl.ARRAY_BUFFER, null);
