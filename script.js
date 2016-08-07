//Все необходимые константы для рисования областей на экране

//Координаты и размеры всего полотна
var xCanvas = 0;
var yCanvas = 0;
var heightCanvas = 640;
var widthCanvas = 1460;

//Координаты и размеры области столкновений шаров
var xField = 20;
var yField = 20;
var heightField = 600;
var widthField = 1000;

//Координаты и размеры области в которой находятся ожидающие шары
var xStore = 1040;
var yStore = 20;
var heightStore = 600;
var widhtStore = 400;

//Координаты и размеры меню
var xMenu = 1500;
var yMenu = 0;
var heightMenu = 640;
var widthMenu = 300;

//Массивы шаров находящихся в двух областях
var countStoreBalls = 0;
var storeBalls = [];
var countFieldBalls = 0;
var fieldBalls = [];

//Перетаскиваемый шар
var draggedBall = null;

var Canvas = document.getElementById("TestCanvas");
var Context = Canvas.getContext('2d');

//Класс описывающий объект шара на экране
function Ball(rad, coordX, coordY, speedX, speedY){
	
	this.x = coordX;
	this.y = coordY;
	this.vx = speedX;
	this.vy = speedY;
	this.r = rad;
	
	var self = this;
	
	this.drawBall = function(Context){
		Context.beginPath();
		Context.arc(self.x, self.y, self.r, 0, 2 * Math.PI, false);
		Context.fill();
	};
}

function initStore(){
	
	for(i=0; i<5; i++){
		storeBalls[i] = new Ball(15, xStore + i * 20 + 20 , yStore + i * 20 + 20, 0, 0);
		countStoreBalls++;
	}
}

function drawCanvas(){
	Context.strokeRect(0, 0, widthCanvas, heightCanvas);
	if(draggedBall != null){
		draggedBall.drawBall(Context);
	}
}

function drawField(){
	Context.strokeRect(xField, yField, widthField, heightField);
}

function drawStore(){
	Context.strokeRect(xStore, yStore, widhtStore, heightStore);
	
	for(i = 0; i < countStoreBalls; i++){
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
}

function Clear(){
	Context.clearRect(0, 0, widthCanvas, heightCanvas);
}

function Render(){
	Clear();
	Draw();
}

function mouseDownHandler(event){
	//костыль для указателя мыши, ибо приходящая в событии находится не на кончике стрелки на экране
	var mouseX = event.clientX - 7;
	var mouseY = event.clientY - 7;
	
	for(i = 0; i < countStoreBalls; i++){
		var xBall = storeBalls[i].x;
		var yBall = storeBalls[i].y;
		var rBall = storeBalls[i].r;
		
		if( Math.pow((mouseX - xBall),2) + Math.pow((mouseY - yBall),2) <= Math.pow(rBall,2) ){
			draggedBall = storeBalls[i];
			storeBalls.splice(i, 1);
			countStoreBalls--;
			break;
		}
	}
	
	for(i = 0; i < countFieldBalls; i++){
		var xBall = fieldBalls[i].x;
		var yBall = fieldBalls[i].y;
		var rBall = fieldBalls[i].r;
		
		if( Math.pow((mouseX - xBall),2) + Math.pow((mouseY - yBall),2) <= Math.pow(rBall,2) ){
			draggedBall = fieldBalls[i];
			fieldBalls.splice(i, 1);
			countFieldBalls--;
			break;
		}
	}
}

function mouseMoveHandler(event){
	
	if(draggedBall != null){
		draggedBall.x = event.clientX;
		draggedBall.y = event.clientY;
	}
}

function mouseUpHandler(event){
	if(draggedBall != null){
		storeBalls[countStoreBalls] = draggedBall;
		countStoreBalls++;
		draggedBall = null;
	}
}

Canvas.onmousedown = mouseDownHandler;
Canvas.onmouseup = mouseUpHandler;
Canvas.onmousemove = mouseMoveHandler;
initStore();
setInterval(Render,20);
