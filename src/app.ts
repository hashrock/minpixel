import Component from 'vue-class-component'
import * as Vue from "vue";

import * as PIXI from "pixi.js"

var renderer = PIXI.autoDetectRenderer(160, 160, { antialias: true });

renderer.view.oncontextmenu = function (e) {
    e.preventDefault();
	console.log([e.offsetX, e.offsetY])
};

var gridSize = 160 / 16;
var penColor = 0x000000;
function drawGrid(ctx: any){

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
var ctx = new PIXI.Graphics();
drawGrid(ctx);
stage.addChild(ctx);

var setPixel = function(ctx: any, pointM: any){
	ctx.beginFill(penColor);
	ctx.drawRect(pointM.x * gridSize, pointM.y *  gridSize, gridSize, gridSize);
	ctx.endFill();
}

var mouseEvent = function(iData: any){
	var point = iData.data.getLocalPosition(iData.target);
	var pointM = {
		x : Math.floor(point.x / gridSize),
		y : Math.floor(point.y / gridSize)
	}
	setPixel(ctx, pointM);
}

var mousedown = false;

stage.on("mousedown", function(iData: any){
	mouseEvent(iData);
	mousedown = true;
})
stage.on("mousemove", function(iData: any){
	if(mousedown){
		mouseEvent(iData);
	}
})
stage.on("mouseup", function(iData: any){
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