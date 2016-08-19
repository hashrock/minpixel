import Component from 'vue-class-component'
import * as Vue from "vue";

import * as PIXI from "pixi.js"

var renderer = PIXI.autoDetectRenderer(160, 160, { antialias: true });

//https://androidarts.com/palette/16pal.htm
var colors = [
  0x000000,
  0x9D9D9D,
  0xFFFFFF,
  0xBE2633,
  0xE06F8B,
  0x493C2B,
  0xA46422,
  0xEB8931,
  0xF7E26B,
  0x2F484E,
  0x44891A,
  0xA3CE27,
  0x1B2632,
  0x005784,
  0x31A2F2,
  0xB2DCEF,
]

renderer.view.oncontextmenu = function (e) {
    e.preventDefault();
	console.log([e.offsetX, e.offsetY])
};

var gridSize = 160 / 16;
var penColor = 0x000000;
function drawGrid(ctx: PIXI.Graphics){

	for(var i = 0; i < 16; i++){
		for(var j = 0; j < 16; j++){
			var fill = (i % 2 === 0 && j % 2 === 0 || i % 2 === 1 && j % 2 === 1) ? 0xEEEEEE : 0xCCCCCC;
			ctx.beginFill(fill);
			ctx.drawRect(i * gridSize, j *  gridSize, gridSize, gridSize);
			ctx.endFill();
		}
	}
}

var stage:PIXI.Container = new PIXI.Container();
stage.interactive = true;
var ctx: PIXI.Graphics = new PIXI.Graphics();
drawGrid(ctx);
stage.addChild(ctx);

var setPixel = function(ctx: PIXI.Graphics, pointM: PIXI.Point){
	ctx.beginFill(penColor);
	ctx.drawRect(pointM.x * gridSize, pointM.y *  gridSize, gridSize, gridSize);
	ctx.endFill();
}

var mouseEvent = function(iData: any){ //InteractionDataに出来なかった
	var point:PIXI.Point = iData.data.getLocalPosition(iData.target);
	var pointM: PIXI.Point = 
    new PIXI.Point(Math.floor(point.x / gridSize), Math.floor(point.y / gridSize))
	setPixel(ctx, pointM);
}

var mousedown = false;

stage.on("mousedown", function(iData: PIXI.interaction.InteractionData){
	mouseEvent(iData);
	mousedown = true;
})
stage.on("mousemove", function(iData: PIXI.interaction.InteractionData){
	if(mousedown){
		mouseEvent(iData);
	}
})
stage.on("mouseup", function(iData: PIXI.interaction.InteractionData){
	mousedown = false;
})

animate();

function animate() {
	renderer.render(stage);
	requestAnimationFrame( animate );
}

@Component({
  props: {
  },
  template: `
    <div>
      <h1>Component</h1>
      	<div class="container"></div>
    </div>
  `
})
export class App extends Vue {
  ready(){
    document.querySelector(".container").appendChild(renderer.view)
  }
}