// Utility Functions
const Utils = {
    // Check collision between two rectangles
    checkRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 &&
               y1 < y2 + h2 && y1 + h1 > y2;
    },

    // More forgiving collision check for player with padding
    checkPlayerCollision(player, obj, objWidth, objHeight) {
        const padding = CONFIG.PLAYER_COLLISION_PADDING;
        return this.checkRectCollision(
            player.x + padding, 
            player.y + padding, 
            CONFIG.PLAYER_SIZE - padding * 2, 
            CONFIG.PLAYER_SIZE - padding * 2,
            obj.x, 
            obj.y, 
            objWidth, 
            objHeight
        );
    },

    // Simple collision check for pickup items
    checkCollision(a, b, size) {
        const aSize = CONFIG.PLAYER_SIZE;
        return a.x < b.x + size && a.x + aSize > b.x &&
               a.y < b.y + size && a.y + aSize > b.y;
    },

    // Check if a position is safe (no obstacles nearby)
    isSafePosition(x, y, width, height, obstacles) {
        for (let obs of obstacles) {
            if (this.checkRectCollision(x, y, width, height, obs.x, obs.y, obs.w, obs.h)) {
                return false;
            }
        }
        return true;
    },

    // Create particle effects
    createParticles(particles, x, y, color, count) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 100,
                vy: (Math.random() - 0.5) * 100,
                color: color,
                life: 0.5
            });
        }
    },

    // Get random position in world
    getRandomPosition(minX = 0, maxX = CONFIG.WORLD_WIDTH, minY = 0, maxY = CONFIG.WORLD_HEIGHT) {
        return {
            x: minX + Math.random() * (maxX - minX),
            y: minY + Math.random() * (maxY - minY)
        };
    },

    // Distance between two points
    distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    },

    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
};
