//Все необходимые константы для рисования областей на экране

//Размеры всей канвы
var height = 800;
var width = 1920;

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
var heightStore = 300;
var widhtStore = 400;

//Координаты и размеры меню
var xMenu = 1040;
var yMenu = 340;
var heightMenu = 280;
var widthMenu = 400;

//Массивы шаров находящихся в двух областях
var countStoreBalls = 0;
var storeBalls = [];
var countFieldBalls = 0;
var fieldBalls = [];

//Текущее положение стика управления скоростью и направлением движения шарика
var xStick = xMenu + widthMenu / 2;
var yStick = yMenu + heightMenu / 2;
var stickAllocated = 0;
var xCenterStick = xMenu + widthMenu / 2;
var yCenterStick = yMenu + heightMenu / 2;

//Перетаскиваемый шар
var draggedBall = null;
//Выделенный шар
var allocatedBall = null;

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

//Класс двумерного вектора
function vector2D(x, y){
	this.x = x;
	this.y = y;
	
	var self = this;
	
	this.length = function(){
		return Math.sqrt( Math.pow(self.x, 2) + Math.pow(self.y, 2));
	}
	
	this.scalarMultiply = function(vector){
		return (self.x * vector.x + self.y + vector.y);
	}
	
	this.cosAngle = function(vector){
		return ((self.length() * vector.length()) / self.scalarMultiply(vector))	
	}
	
	this.normalize = function(){
		var length = self.length();
		self.x = self.x / length;
		self.y = self.y / length;
	}
	//умножение вектора на число
	this.multiply = function(value){
		var result = new vector2D(self.x * value, self.y * value)
		return result;
	}
	//сложение векторов
	this.plus = function(vector){
		var result = new vector2D(self.x + vector.x, self.y + vector.y)
		return result;
	}
	//проверка на не превышение максимального значения
	this.checkMax = function(maxValue){
		if(self.x > maxValue){
			self.x = maxValue;
		}
		if(self.x < -maxValue){
			self.x = -maxValue;
		}
		
		if(self.y > maxValue){
			self.y = maxValue;
		}
		if(self.y < -maxValue){
			self.y = -maxValue;
		}
	}
	//проверка на не превышение максимального значения
	this.checkMin = function(minValue){
		if(self.x < minValue && self.x >= 0 ){
			self.x = minValue;
		}
		if(self.x > -minValue && self.x < 0){
			self.x = -minValue;
		}
		
		if(self.y < minValue && self.y >= 0){
			self.y = minValue;
		}
		if(self.y > -minValue && self.y < 0){
			self.y = -minValue;
		}
	}
}

function calculateCollisionWithBorders(){
	for(i = 0; i < countFieldBalls; i++){
		
		var CoefExtrude = 1;
		var xBall = fieldBalls[i].x;
		var yBall = fieldBalls[i].y;
		var rBall = fieldBalls[i].r;
		
		//определяем столкнулся ли шар со стеной
		//если столкнулся - меняем нужную составляющую скорости на противоположную
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
	
	for(i = 0; i < countStoreBalls; i++){
		
		var CoefExtrude = 1;
		var xBall = storeBalls[i].x;
		var yBall = storeBalls[i].y;
		var rBall = storeBalls[i].r;
		
		
		if( (xBall - rBall) <= xStore ){
			storeBalls[i].x = xStore + rBall + CoefExtrude;
			storeBalls[i].vx *= -1;
		} 
		
		if( (xBall + rBall) >= (xStore + widhtStore) ){
			storeBalls[i].x = xStore - rBall + widhtStore - CoefExtrude;
			storeBalls[i].vx *= -1;	
		} 
		
		if( (yBall - rBall) <= yStore ){
			storeBalls[i].y = yStore + rBall + CoefExtrude;
			storeBalls[i].vy *= -1;
			
		} 
		
		if( (yBall + rBall) >= (yField + heightStore) ){
			storeBalls[i].y = yField - rBall + heightStore - CoefExtrude;
			storeBalls[i].vy *= -1;	
		} 
	}
	
}

function calculateCollisionsBallsWithBallsIntoStore(){
	for(i = 0; i < countStoreBalls; i++){
		
		for(j = i + 1; j < countStoreBalls; j++){	
			var xBall1 = storeBalls[i].x;
			var yBall1 = storeBalls[i].y;
			var rBall1 = storeBalls[i].r;
			var speed1 = new vector2D(storeBalls[i].vx, storeBalls[i].vy);
			
			var xBall2 = storeBalls[j].x;
			var yBall2 = storeBalls[j].y;
			var rBall2 = storeBalls[j].r;
			var speed2 = new vector2D(storeBalls[j].vx, storeBalls[j].vy);
			
			var requiredDistanse = rBall1 + rBall2;
			var currentDistanse = Math.sqrt( Math.pow((xBall1 - xBall2), 2) + Math.pow((yBall1 - yBall2), 2)); 
			
			//определяем коллизию шаров путем сравнения расстояния между их центрами
			if(currentDistanse <= requiredDistanse){
				//оси соединяющие центры шаров
				//одна направлена к первому шару другая ко второму
				var axis2 = (new vector2D(xBall2-xBall1, yBall2-yBall1));
				var axis1 = (new vector2D(xBall1-xBall2, yBall1-yBall2));
	
				
				axis1.normalize();
				axis2.normalize();
				
				//производит расталкивание шаров вдоль оси содиняющей центры шаров
				storeBalls[i].x += axis1.x * 2;
				storeBalls[i].y += axis1.y * 2;
				
				storeBalls[j].x += axis2.x * 2;
				storeBalls[j].y += axis2.y * 2;
			}
		}
	}
}

function calculateCollisionBallsWithBalls(){
	for(i = 0; i < countFieldBalls; i++){
		
		for(j = i + 1; j < countFieldBalls; j++){	
			var xBall1 = fieldBalls[i].x;
			var yBall1 = fieldBalls[i].y;
			var rBall1 = fieldBalls[i].r;
			var speed1 = new vector2D(fieldBalls[i].vx, fieldBalls[i].vy);
			
			var xBall2 = fieldBalls[j].x;
			var yBall2 = fieldBalls[j].y;
			var rBall2 = fieldBalls[j].r;
			var speed2 = new vector2D(fieldBalls[j].vx, fieldBalls[j].vy);
			
			var requiredDistanse = rBall1 + rBall2;
			var currentDistanse = Math.sqrt( Math.pow((xBall1 - xBall2), 2) + Math.pow((yBall1 - yBall2), 2)); 
			
			//проверяем дистанцию между шарами 
			if(currentDistanse <= requiredDistanse){
				var axis2 = (new vector2D(xBall2-xBall1, yBall2-yBall1));
				var axis1 = (new vector2D(xBall1-xBall2, yBall1-yBall2));
				
				var currentSpeedVector = speed1.plus(speed2);
				//значение скоростей шаров после соударения (принимаем как равную)
				var currentSpeed = currentSpeedVector.length();
				
				//получаем вектора скоростей шаров после соударения
				var vectorSpeed1 = speed1.plus(axis1);
				vectorSpeed1.normalize(); 
				var vectorSpeed2 = speed2.plus(axis2);
				vectorSpeed2.normalize();
				
				//увеличиваем длины векторов на значение скорости после удара
				vectorSpeed1 = vectorSpeed1.multiply(currentSpeed);
				vectorSpeed2 = vectorSpeed2.multiply(currentSpeed);
				
				fieldBalls[i].vx = vectorSpeed1.x;
				fieldBalls[i].vy = vectorSpeed1.y;
				
				fieldBalls[j].vx = vectorSpeed2.x;
				fieldBalls[j].vy = vectorSpeed2.y;
				
				//расталкиваем шары вдоль оси соединяющие их центры
				axis1.normalize();
				axis2.normalize();
				
				fieldBalls[i].x += axis1.x * 2;
				fieldBalls[i].y += axis1.y * 2;
				
				fieldBalls[j].x += axis2.x * 2;
				fieldBalls[j].y += axis2.y * 2;
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

function checkMinBallSpeed(){
	for(i = 0; i < countFieldBalls; i++){
		var speedVector = new vector2D(fieldBalls[i].vx, fieldBalls[i].vy);
		speedVector.checkMin(1);
		fieldBalls[i].vx = speedVector.x;
		fieldBalls[i].vy = speedVector.y;
	}
}

function checkMaxBallSpeed(){
	for(i = 0; i < countFieldBalls; i++){
		var speedVector = new vector2D(fieldBalls[i].vx, fieldBalls[i].vy);
		speedVector.checkMax(7);
		fieldBalls[i].vx = speedVector.x;
		fieldBalls[i].vy = speedVector.y;
	}
}

//функция для произведения всех расчетов
function calculate(){
	calculatePositions();
	calculateCollisionWithBorders();
	calculateCollisionBallsWithBalls();
	calculateCollisionsBallsWithBallsIntoStore();
	checkMaxBallSpeed();
	checkMinBallSpeed();
}

function initStore(){
	var count = Math.random()*20 % 11 + 5;
	for(i=0; i<count; i++){
		storeBalls[i] = new Ball(30, xStore + widhtStore/2 + Math.random(), yStore + heightStore/2 + Math.random(), 1, 1);
		//storeBalls[i] = new Ball(30, -100 , -, 0.1, 0.1);
		countStoreBalls++;
	}
}

//рисование всего холста
function drawCanvas(){
	Context.strokeRect(0, 0, widthCanvas, heightCanvas);
	if(draggedBall != null){
		draggedBall.drawBall(Context);
	}
}

//рисование первой области
function drawField(){
	Context.strokeRect(xField, yField, widthField, heightField);
	
	for(i = 0; i < countFieldBalls; i++){
		fieldBalls[i].drawBall(Context);
	}
}

//рисование второй области
function drawStore(){
	Context.strokeRect(xStore, yStore, widhtStore, heightStore);
	
	for(i = 0; i < countStoreBalls; i++){
		storeBalls[i].drawBall(Context);
	}
}

//рисование джостика
function drawMenu(){
	Context.strokeRect(xMenu, yMenu, widthMenu, heightMenu);
	
	Context.beginPath();
	Context.arc(xMenu + widthMenu / 2, yMenu + heightMenu / 2, 100, 0, 2 * Math.PI, false);
	Context.stroke();
	
	Context.beginPath();
	Context.arc(xMenu + widthMenu / 2, yMenu + heightMenu / 2, 5, 0, 2 * Math.PI, false);
	Context.stroke();
	
	if(allocatedBall != null && stickAllocated != 1){
		var vector = new vector2D(allocatedBall.vx, allocatedBall.vy);
		var speed = vector.length() * 10;
		vector.normalize();
		vector = vector.multiply(speed);
		xStick = vector.x + xMenu + widthMenu / 2;
		yStick = vector.y + yMenu + heightMenu / 2;
		Context.beginPath();
		Context.arc(xStick, yStick, 20, 0, 2 * Math.PI, false);
		Context.fill();
	}
	else{
		Context.beginPath();
		Context.arc(xStick, yStick, 20, 0, 2 * Math.PI, false);
		Context.fill();
	}
}

function drawAllocatedBall(){
	if(allocatedBall != null){
		Context.beginPath();
		Context.strokeStyle = "red";
		Context.arc(allocatedBall.x, allocatedBall.y, allocatedBall.r+5, 0, 2 * Math.PI, false);
		Context.stroke();
		Context.strokeStyle = "black";
	}
}

function draw() {
		drawCanvas();
		drawField();
		drawStore();
		drawMenu();
		drawAllocatedBall();
}

function clear(){
	Context.clearRect(0, 0, width, height);
}

function mouseDownHandler(event){
	//костыль для указателя мыши, ибо приходящая в событии находится не на кончике стрелки на экране
    var mouseX = event.pageX - 7;
	var mouseY = event.pageY - 7;
	//проверяем, нажали ли на шар во второй области
	for(i = 0; i < countStoreBalls; i++){
		var xBall = storeBalls[i].x;
		var yBall = storeBalls[i].y;
		var rBall = storeBalls[i].r;
		
		//если нажали,, то выделяем его и удаляем из очереди на обработку столкновений
		if( Math.pow((mouseX - xBall),2) + Math.pow((mouseY - yBall),2) <= Math.pow(rBall,2) ){
			draggedBall = storeBalls[i];
			allocatedBall = storeBalls[i];
			storeBalls.splice(i, 1);
			countStoreBalls--;
			break;
		}
	}
	//проверяем, нажали ли на шар в первой области
	for(i = 0; i < countFieldBalls; i++){
		var xBall = fieldBalls[i].x;
		var yBall = fieldBalls[i].y;
		var rBall = fieldBalls[i].r;
		//если нажали,, то выделяем его и удаляем из очереди на обработку столкновений
		if( Math.pow((mouseX - xBall),2) + Math.pow((mouseY - yBall),2) <= Math.pow(rBall,2) ){
			draggedBall = fieldBalls[i];
			allocatedBall = fieldBalls[i];;
			fieldBalls.splice(i, 1);
			countFieldBalls--;
			break;
		}
	}
	
	//если нажали на джостик, то ставим переменную уведомляющую об этом в единицу
	if( Math.pow((mouseX - xStick),2) + Math.pow((mouseY - yStick),2) <= Math.pow(20,2) ){
		stickAllocated = 1;
	}
	
}

function mouseMoveHandler(event){
	
	if(draggedBall != null){
		draggedBall.x = event.pageX;
		draggedBall.y = event.pageY;
	}
	
	if(stickAllocated == 1){
	    if (Math.sqrt(Math.pow((event.pageX - xCenterStick), 2) + Math.pow((event.pageY - yCenterStick), 2)) < 100) {
	        xStick = event.pageX;
	        yStick = event.pageY;
			allocatedBall.vx = (xStick - xCenterStick)/10;
			allocatedBall.vy = (yStick - yCenterStick)/10;
		}
		else{
	        var vectorToCenterStick = new vector2D(event.pageX - xCenterStick, event.pageY - yCenterStick);
			vectorToCenterStick.normalize();
			vectorToCenterStick = vectorToCenterStick.multiply(90);
			xStick = vectorToCenterStick.x + xCenterStick;
			yStick = vectorToCenterStick.y + yCenterStick;
			allocatedBall.vx = (xStick - xCenterStick)/10;
			allocatedBall.vy = (yStick - yCenterStick)/10;
		}
	}
}

//проверка, где отпустили клавишу мыши с шариком
function mouseUpHandler(event){
	if(draggedBall != null){
		var xBall = draggedBall.x;
		var yBall = draggedBall.y;
		//если отпустили над первой областью то добавляем шар в очередь
		if( ((xBall >= xField) && (xBall <= xField + widthField)) && ((yBall >= yField) && (yBall <= yField + heightField)) ){
			fieldBalls[countFieldBalls] = draggedBall;
			countFieldBalls++;
			draggedBall = null;
			  
		  }
		else{
			//если отпустили над второй областью то добавляем шар в очередь, меняем его скорость 
			if(((xBall >= xStore) && (xBall <= xStore + widhtStore)) && ((yBall >= yStore) && (yBall <= yStore + heightStore))){
				draggedBall.vx = 1;
				draggedBall.vy = 1;
				storeBalls[countStoreBalls] = draggedBall;
				countStoreBalls++;
				draggedBall = null;
			}
			else{
				//если отпустили ни над одной из областей, то добавляем шар в очередь во вторую область, устанавливаем координаты 
				draggedBall.x = xStore + widhtStore/2 + Math.random();
				draggedBall.y = yStore + heightStore/2 + Math.random();
				storeBalls[countStoreBalls] = draggedBall;
				countStoreBalls++;
				draggedBall = null;
			}	
		}	
	}
	
	if(stickAllocated == 1){
		stickAllocated = 0;
	}
}

//Основной цикл
function render(){
	clear();
	calculate();
	draw();
}

Canvas.onmousedown = mouseDownHandler;
Canvas.onmouseup = mouseUpHandler;
Canvas.onmousemove = mouseMoveHandler;
initStore();
setInterval(render,20);
