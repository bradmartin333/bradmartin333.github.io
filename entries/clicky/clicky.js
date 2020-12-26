let item = document.querySelector("#item1");
let container = document.querySelector("#container1");

let timePressed = 0;
let press = false;

item.addEventListener("mousedown", pressingDown, false);
item.addEventListener("mouseup", notPressingDown, false);
item.addEventListener("touchstart", pressingDown, false);
item.addEventListener("touchend", notPressingDown, false);
container.addEventListener("mousemove", onMouseMove);

function onMouseMove(e) {
	var rect = container.getBoundingClientRect();
	var x = (e.clientX - rect.left)/(rect.right - rect.left)*rect.width;
	var y = (e.clientY - rect.top)/(rect.bottom - rect.top)*rect.height;
	var xAdj = x - 50;
	var yAdj = y - 50;
	
	item.style.setProperty("--transX-value", xAdj.toString() + "px");
	item.style.setProperty("--transY-value", yAdj.toString() + "px");
}

function counter() {
  if (press) {
	timePressed++;
	scaleItem();
  } else {
	timePressed = 0;
	resetItem();
  }
  requestAnimationFrame(counter);
}

counter();

function pressingDown(e) {
  press = true;
  e.preventDefault();
}

function notPressingDown(e) {
  var color = (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
  item.style.setProperty("background-color", "#" + color);
  item.style.setProperty("border", "5px solid #" + invertColor(color));
  press = false;
}

function scaleItem() {
  let size = 1 + timePressed / 25;
  item.style.transitionDuration = "0s";
  item.style.setProperty("--scale-value", size);
}

function resetItem() {
  item.style.transitionDuration = "0.2s";
  item.style.setProperty("--scale-value", 1);
}

function invertColor(hex) {
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}