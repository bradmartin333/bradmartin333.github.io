// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("clicky_viewport");
    var context = canvas.getContext("2d");
    
    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;
	
	// Player
    var player = {
        x: 0,
        y: 0,
		radius: 50
	}
    
    // Initialize the game
    function init() {
        // Add mouse events
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);
  
        // Enter main loop
        main(0);
    }
    
    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);
		
		// Update and render the game
		update(tframe);
    }
    
    // Update the game state
    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;
        drawFrame()
		
        // Update the fps counter
        updateFps(dt);
    }
    
    function updateFps(dt) {
        if (fpstime > 0.25) {
            // Calculate fps
            fps = Math.round(framecount / fpstime);
            
            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }
        
        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }
    
    // Draw a frame around the game
    function drawFrame() {
        // Draw background
        context.fillStyle = "#e8eaec";
        context.fillRect(0, 0, canvas.width, canvas.height);
        
		// Draw player
		context.fillStyle = "#000000";
		context.beginPath();
		context.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
		context.fill();
		
        // Draw header
        context.fillStyle = "#303030";
        context.fillRect(0, 0, canvas.width, 79);
        
        // Draw title
        context.fillStyle = "#ffffff";
        context.font = "24px Verdana";
        context.fillText("First project: Clicking makes the circle bigger!", 10, 37);
        
        // Display fps
        context.fillStyle = "#ffffff";
        context.font = "12px Verdana";
        context.fillText("Fps: " + fps, 13, 57);
    }
    
    // On mouse movement
    function onMouseMove(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
		player.x = pos.x;
		player.y = pos.y;
		needRefresh = true;
    }
    
    // On mouse button click
    function onMouseDown(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
		player.radius += 5;
		needRefresh = true;
    }
    
    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
    
    // Call init to start the game
    init();
};