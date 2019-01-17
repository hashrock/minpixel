<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import * as PIXI from "pixi.js";
import { ImageBuffer } from "./image-buffer";

const renderer = PIXI.autoDetectRenderer(160, 160 + 10, { antialias: true });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//https://androidarts.com/palette/16pal.htm
const colors = [
  0x000000,
  0x9d9d9d,
  0xffffff,
  0xbe2633,
  0xe06f8b,
  0x493c2b,
  0xa46422,
  0xeb8931,
  0xf7e26b,
  0x2f484e,
  0x44891a,
  0xa3ce27,
  0x1b2632,
  0x005784,
  0x31a2f2,
  0xb2dcef
];

renderer.view.oncontextmenu = function(e) {
  e.preventDefault();
  const point = convertPoint(new PIXI.Point(e.offsetX, e.offsetY));
  penColor = buffer.getPixel(point.x, point.y);
  console.log(penColor);
  console.log([e.offsetX, e.offsetY]);
};

const gridSize = 160 / 16;
let penColor = 0x000000;
function drawGrid(ctx: PIXI.Graphics) {
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      const fill =
        (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)
          ? 0xeeeeee
          : 0xcccccc;
      ctx.beginFill(fill);
      ctx.drawRect(i * gridSize, j * gridSize, gridSize, gridSize);
      ctx.endFill();
    }
  }
}

function drawFromBuffer(ctx: PIXI.Graphics, buffer: ImageBuffer) {
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      const color = buffer.getPixel(j, i);
      if (color >= 0) {
        setPixel(ctx, new PIXI.Point(j, i), color);
      }
    }
  }
}

function drawPallete(ctx: PIXI.Graphics) {
  ctx.clear();
  for (let i = 0; i < 16; i++) {
    const fill = colors[i];
    let offsetTop = 2;
    ctx.lineStyle(1, 0x000000, 1);
    if (penColor === fill) {
      ctx.lineStyle(1, 0xffffff, 1);
      offsetTop = 0;
    }
    ctx.beginFill(fill);
    ctx.drawRect(i * gridSize, offsetTop, gridSize, gridSize);
    ctx.endFill();
  }
}

const stage: PIXI.Container = new PIXI.Container();
stage.interactive = true;
const canvas: PIXI.Graphics = new PIXI.Graphics();
const background: PIXI.Graphics = new PIXI.Graphics();
const pallete: PIXI.Graphics = new PIXI.Graphics();
const buffer: ImageBuffer = new ImageBuffer();

drawGrid(background);
stage.addChild(background);
stage.addChild(canvas);
drawPallete(pallete);
pallete.y = 160;
stage.addChild(pallete);

function setPixel(ctx: PIXI.Graphics, pointM: PIXI.Point, color: number) {
  ctx.beginFill(color);
  ctx.drawRect(pointM.x * gridSize, pointM.y * gridSize, gridSize, gridSize);
  ctx.endFill();
}

function convertPoint(point: PIXI.Point) {
  return new PIXI.Point(
    Math.floor(point.x / gridSize),
    Math.floor(point.y / gridSize)
  );
}

interface LocalInteractionData extends PIXI.interaction.InteractionData {
  data: any;
}

const mouseEvent = function(iData: LocalInteractionData) {
  const point: PIXI.Point = iData.data.getLocalPosition(iData.target);
  const pointM: PIXI.Point = convertPoint(point);
  if (pointM.y > 15) {
    penColor = colors[pointM.x];
    drawPallete(pallete);
    return;
  }
  buffer.setPixel(pointM.x, pointM.y, penColor);
  canvas.clear();
  drawFromBuffer(canvas, buffer);
};

let mousedown = false;

stage.on("mousedown", function(iData: LocalInteractionData) {
  mouseEvent(iData);
  mousedown = true;
});
stage.on("mousemove", function(iData: LocalInteractionData) {
  if (mousedown) {
    mouseEvent(iData);
  }
});
stage.on("mouseup", function(iData: LocalInteractionData) {
  mousedown = false;
});

animate();

function animate() {
  renderer.render(stage);
  requestAnimationFrame(animate);
}

export default {
  mounted() {
    this.$el.appendChild(renderer.view);
  }
};
</script>

<style>
</style>
