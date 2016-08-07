
var X = 0;
var Y = 0;

var PX = -100;
var PY = -100

var Canvas = document.getElementById("TestCanvas");
var Context = Canvas.getContext('2d');

function Draw() {
		Context.moveTo(X,Y);
		Context.fillRect(X, Y, 20, 20);
		Context.moveTo(0,0);
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
	Context.clearRect(X, Y, 20, 20);
}


function Render(){
	Clear();
	Calculate();
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

document.getElementById("TestCanvas").onmousemove = Test;
setInterval(Render,500);
