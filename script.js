//Все необходимые константы для рисования областей на экране

//Размеры всей канвы
var height = 640;
var width = 1800;

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

function vector2D(x, y){
	this.x = x;
	this.y = y;
	
	var self = this;
	
	function length(){
		return Math.sqrt( pow(self.x, 2) + pow(self.y, 2));
	}
	
	function scalarMultiply(vector){
		return (self.x * vector.x + self.y + vector.y);
	}
	
	function cosAngle(vector){
		return ((self.length() * vector.length()) / self.scalarMultiply(vector))	
	}
	
	function normalize(){
		var length = self.length();
		self.x = self.x / length;
		self.y = self.y / length;
	}
}

function calculateCollisionWithBorders(){
	for(i = 0; i < countFieldBalls; i++){
		
		var CoefExtrude = 1;
		var xBall = fieldBalls[i].x;
		var yBall = fieldBalls[i].y;
		var rBall = fieldBalls[i].r;
		
		
		if( (xBall - rBall) <= xField ){
			fieldBalls[i].x = xField + rBall + CoefExtrude;
			fieldBalls[i].vx *= -1;
		} 
		
		if( (xBall + rBall) >= (xField + widthField) ){
			fieldBalls[i].x = xField - rBall + widthField - CoefExtrude;
			fieldBalls[i].vx *= -1;	
		} 
		
		if( (yBall - rBall) <= yField ){
			fieldBalls[i].y = yField + rBall + CoefExtrude;
			fieldBalls[i].vy *= -1;
			
		} 
		
		if( (yBall + rBall) >= (yField + heightField) ){
			fieldBalls[i].y = yField - rBall + heightField - CoefExtrude;
			fieldBalls[i].vy *= -1;	
		} 
	}
}

function calculateCollisionBallsWithBalls(){
	for(i = 0; i < countFieldBalls; i++){
		
		for(j = i + 1; j < countFieldBalls; j++){
			
			var xBall1 = fieldBalls[i].x;
			var yBall1 = fieldBalls[i].y;
			var rBall1 = fieldBalls[i].r;
			var speed1 = vector2D(fieldBalls[i].vx, fieldBalls[i].vy);
			
			var xBall2 = fieldBalls[j].x;
			var yBall2 = fieldBalls[j].y;
			var rBall2 = fieldBalls[j].r;
			var speed2 = vector2D(fieldBalls[j].vx, fieldBalls[j].vy);
			
			var requiredDistanse = rBall1 + rBall2;
			var currentDistanse = Math.sqrt( pow((xBall1 - xBall2), 2) + pow((yBall1 - yBall2), 2)); 
			
			if(currentDistanse <= requiredDistanse){
				var axis = vector2D(xBall1-xBall2, yBall1-yBall2);
				var speed = vector2D(fieldBalls[i].vx + fieldBalls[j].vx, fieldBalls[i].vy + fieldBalls[j].vy).length();
				var cosAngle = speed1.cosAngle(speed2);
				
				if( cosAngle > ((Math.PI)/2) ){
					
					
					
				}
				else{
					
					
				}
			}
		}
	}
}

function calculatePositions(){
	for(i = 0; i < countFieldBalls; i++){
		fieldBalls[i].x += fieldBalls[i].vx;
		fieldBalls[i].y += fieldBalls[i].vy;
	}
}

function calculate(){
	calculatePositions();
	calculateCollisionWithBorders();
}

function initStore(){
	
	for(i=0; i<5; i++){
		storeBalls[i] = new Ball(15, xStore + i * 20 + 20 , yStore + i * 20 + 20, 1, 1);
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
	
	for(i = 0; i < countFieldBalls; i++){
		fieldBalls[i].drawBall(Context);
	}
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

function draw() {
		drawCanvas();
		drawField();
		drawStore();
		drawMenu();
}

function clear(){
	Context.clearRect(0, 0, width, height);
}

function render(){
	clear();
	calculate();
	draw();
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
		var xBall = draggedBall.x;
		var yBall = draggedBall.y;
		
		if( ((xBall >= xField) && (xBall <= xField + widthField)) && ((yBall >= yField) && (yBall <= yField + heightField)) ){
			fieldBalls[countFieldBalls] = draggedBall;
			countFieldBalls++;
			draggedBall = null;
			  
		  }
		else{
			draggedBall.x = xStore + widhtStore - 100;
			draggedBall.y = yStore + heightStore - 100;
			storeBalls[countStoreBalls] = draggedBall;
			countStoreBalls++;
			draggedBall = null;
		}	
		
	}
}

Canvas.onmousedown = mouseDownHandler;
Canvas.onmouseup = mouseUpHandler;
Canvas.onmousemove = mouseMoveHandler;
initStore();
setInterval(render,20);
