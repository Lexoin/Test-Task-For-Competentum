
var xCanvas = 0;
var yCanvas = 0;
var heightCanvas = 640;
var widthCanvas = 1460;

var xField = 20;
var yField = 20;
var heightField = 600;
var widthField = 1000;

var xStore = 1040;
var yStore = 20;
var heightStore = 600;
var widhtStore = 400;

var xMenu = 1500;
var yMenu = 0;
var heightMenu = 640;
var widthMenu = 300;

var X = 0;
var Y = 0;

var PX = -100;
var PY = -100

var storeBalls = [];
var fieldBalls = [];

var Canvas = document.getElementById("TestCanvas");
var Context = Canvas.getContext('2d');


function Ball(r, x, y, vx, vy){
	
	var x = x;
	var y = y;
	var vx = vx;
	var vy = vy;
	var r = r;
	
	this.drawBall = function(Context){
		Context.beginPath();
		Context.arc(x, y, r, 0, 2 * Math.PI, false);
		Context.fill();
	};
}

function initStore(){
	
	for(i=0; i<5; i++){
		storeBalls[i] = new Ball(15, xStore + i * 20 + 20 , yStore + i * 20 + 20, 0, 0);
	}
}

function drawCanvas(){
	Context.strokeRect(0, 0, widthCanvas, heightCanvas);
}

function drawField(){
	Context.strokeRect(xField, yField, widthField, heightField);
}

function drawStore(){
	Context.strokeRect(xStore, yStore, widhtStore, heightStore);
	
	for(i = 0; i < 5; i++){
		storeBalls[i].drawBall(Context);
	}
}

function drawMenu(){
	Context.strokeRect(xMenu, yMenu, widthMenu, heightMenu);
}

function Draw() {
		drawCanvas();
		drawField();
		drawStore();
		drawMenu();
		//Context.fillRect(X, Y, 20, 20);
}

function Calculate(){
	
	if(X < 50)
	{
		X += 1;
		Y += 1;
	}
	else
	{
		X = 0;
		Y = 0;
	}
}

function Clear(){
	//Context.clearRect(0, 0, 600, 600);
	Context.clearRect(X, Y, widthCanvas, heightCanvas);
}

function Render(){
	Clear();
	//Calculate();
	Draw();
	
}

function Test(event){
	Context.clearRect(PX, PY, 50, 10);
	
	var XE = event.clientX;
	var YE = event.clientY;
	PX = XE;
	PY = YE;
	
	Context.moveTo(XE,YE);
	Context.fillRect(XE, YE, 50, 10);
	Context.moveTo(0,0);
}

initStore();
//document.getElementById("TestCanvas").onmousemove = Test;
setInterval(Render,20);
