import { Application } from "pixi.js";
//@ts-expect-error
let app: Application = new PIXI.Application({
  width: 640,
  height: 360,
  resizeTo: window,
});

document.body.appendChild(app.view as any);

//@ts-expect-error
var graphics = new PIXI.Graphics();

graphics.beginFill(0xffff00);

// set the line style to have a width of 5 and set the color to red
graphics.lineStyle(5, 0xff0000);

// draw a rectangle
graphics.drawRect(0, 0, 300, 200);

app.stage.addChild(graphics);
