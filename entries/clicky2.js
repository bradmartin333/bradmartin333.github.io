var canvas = document.getElementById("clicky_viewport");
var context = canvas.getContext("2d");

var circle = {
	x: 0,
	y: 0,
	radius: 0,
	color: "#000000"
};

var buffer = {
	x: 0,
	y: 0
}

var growInterval = -1;
var dropInterval = -1;
var velocity = 1;

function init() {
	canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseup", 	 onMouseUp);
	
	main(0);
}

function main(tframe) {
	window.requestAnimationFrame(main);
	
	context.fillStyle = "#000000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = circle.color;
	context.beginPath();
	context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
	context.fill();
	
	if (dropInterval != -1) {
		dropCircle();
	}
	else{
		circle.x = buffer.x;
		circle.y = buffer.y;
	}
}

function onMouseMove(e) {
	var pos = getMousePos(canvas, e);
	buffer.x = pos.x;
	buffer.y = pos.y;
}

function onMouseDown(e) {
	if (growInterval == -1 && dropInterval == -1) {
		circle.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
		growInterval = setInterval(function(){circle.radius += 0.5;}, 20);
	}
}

function onMouseUp(e) {
	if (growInterval != -1 && dropInterval == -1) {
		clearInterval(growInterval);
		growInterval = -1;
		dropInterval = setInterval(dropCircle(), 20);
	}
}

function getMousePos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
		y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
	};
}

function dropCircle() {
	if (circle.y - circle.radius >= canvas.height) {
		circle.radius = 0;
		clearInterval(dropInterval);
		dropInterval = -1;
		velocity = 1;
	}
	else {
		circle.y += velocity * 2;
		velocity++;
	}
}

init();