// Main Game Engine
const Game = {
    // Canvas and context
    canvas: null,
    ctx: null,

    // Game state
    state: 'LORE',
    lastTime: 0,

    // Input state
    keys: {
        ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
        w: false, s: false, a: false, d: false,
        ' ': false, // Spacebar
        Space: false
    },

    // Camera
    camera: { x: 0, y: 0 },

    // Player
    player: {
        x: 400, y: 300, dir: 1,
        hp: 100, maxHp: 100,
        warmth: 100, maxWarmth: CONFIG.WARMTH_MAX,
        invulnerable: 0,
        armor: false,
        speedBoost: 0,
        // Weapon upgrade
        weaponUpgrade: null,
        weaponUpgradeTime: 0,
        // MEGA MODE
        megaMode: false,
        megaModeTime: 0,
        killStreak: 0,
        killStreakTime: 0
    },

    // Collections
    tokens: [],
    tokensFound: 0,
    collectedClues: [],
    trees: [],
    obstacles: [],
    enemies: [],
    projectiles: [],
    powerups: [],
    particles: [],
    weaponUpgrades: [],
    badItems: [],
    spaceHeaters: [],
    burningCouches: [],
    sternoFuels: [],

    // Timing
    nextShotTime: 0,
    lastCouchSpawnCheck: 0,
    
    // Death tracking
    deathReason: '',

    // Initialize game
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        SpriteGenerator.generateAll();
        this.setupEventListeners();
        this.resetGame();
        this.loop(0);
    },

    // Reset game state
    resetGame() {
        this.tokensFound = 0;
        this.collectedClues = [];
        
        // Reset player
        this.player.x = 200;
        this.player.y = 200;
        this.player.hp = 100;
        this.player.warmth = 100;
        this.player.armor = false;
        this.player.speedBoost = 0;
        this.player.invulnerable = 0;
        this.player.weaponUpgrade = null;
        this.player.weaponUpgradeTime = 0;
        this.player.megaMode = false;
        this.player.megaModeTime = 0;
        this.player.killStreak = 0;
        this.player.killStreakTime = 0;

        // Clear all collections
        this.tokens = [];
        this.trees = [];
        this.obstacles = [];
        this.enemies = [];
        this.projectiles = [];
        this.powerups = [];
        this.particles = [];
        this.weaponUpgrades = [];
        this.badItems = [];
        this.spaceHeaters = [];
        this.burningCouches = [];
        this.sternoFuels = [];

        this.generateWorld();
        this.updateHUD();
    },

    // Generate game world
    generateWorld() {
        // Generate obstacles first (for spawn collision checking)
        for (let i = 0; i < CONFIG.BUILDINGS_COUNT; i++) {
            this.obstacles.push({
                x: Math.random() * (CONFIG.WORLD_WIDTH - 80),
                y: Math.random() * (CONFIG.WORLD_HEIGHT - 100),
                w: 80, h: 100,
                type: 'building'
            });
        }

        for (let i = 0; i < CONFIG.STATUES_COUNT; i++) {
            this.obstacles.push({
                x: Math.random() * (CONFIG.WORLD_WIDTH - 40),
                y: Math.random() * (CONFIG.WORLD_HEIGHT - 60),
                w: 40, h: 60,
                type: 'statue'
            });
        }

        // Generate trees
        for (let i = 0; i < CONFIG.TREES_COUNT; i++) {
            this.trees.push({
                x: Math.random() * (CONFIG.WORLD_WIDTH - 40),
                y: Math.random() * (CONFIG.WORLD_HEIGHT - 40),
                w: 40, h: 40
            });
        }

        // Combine obstacles for collision checking
        const allObstacles = [...this.obstacles, ...this.trees];

        // Find safe spawn position for player
        let playerSpawned = false;
        let attempts = 0;
        while (!playerSpawned && attempts < 100) {
            const px = 100 + Math.random() * (CONFIG.WORLD_WIDTH - 200);
            const py = 100 + Math.random() * (CONFIG.WORLD_HEIGHT - 200);
            
            if (Utils.isSafePosition(px, py, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE, allObstacles)) {
                this.player.x = px;
                this.player.y = py;
                playerSpawned = true;
            }
            attempts++;
        }
        
        // Fallback if no safe position found (unlikely)
        if (!playerSpawned) {
            this.player.x = 200;
            this.player.y = 200;
        }

        // Generate space heaters near buildings
        for (let obs of this.obstacles) {
            if (obs.type === 'building' && Math.random() < 0.8) {
                // Place heater near building
                const side = Math.floor(Math.random() * 4);
                let hx, hy;
                if (side === 0) { // Top
                    hx = obs.x + Math.random() * obs.w;
                    hy = obs.y - 50;
                } else if (side === 1) { // Bottom
                    hx = obs.x + Math.random() * obs.w;
                    hy = obs.y + obs.h + 20;
                } else if (side === 2) { // Left
                    hx = obs.x - 50;
                    hy = obs.y + Math.random() * obs.h;
                } else { // Right
                    hx = obs.x + obs.w + 20;
                    hy = obs.y + Math.random() * obs.h;
                }
                
                if (hx >= 0 && hx < CONFIG.WORLD_WIDTH - 32 && hy >= 0 && hy < CONFIG.WORLD_HEIGHT - 32) {
                    this.spaceHeaters.push({
                        x: hx, y: hy,
                        w: 32, h: 32
                    });
                }
            }
        }

        // Generate tokens (avoid obstacles)
        while (this.tokens.length < CONFIG.TOKENS_TOTAL) {
            let tx = 100 + Math.random() * (CONFIG.WORLD_WIDTH - 200);
            let ty = 100 + Math.random() * (CONFIG.WORLD_HEIGHT - 200);
            let dist = Utils.distance(tx, ty, this.player.x, this.player.y);
            
            if (dist > CONFIG.TOKEN_SPAWN_DISTANCE && 
                Utils.isSafePosition(tx, ty, 24, 24, allObstacles)) {
                this.tokens.push({ 
                    x: tx, y: ty, 
                    id: this.tokens.length, 
                    collected: false 
                });
            }
        }

        // Spawn initial enemies
        for (let i = 0; i < CONFIG.INITIAL_RA_COUNT; i++) this.spawnEnemy(true, 'RA');
        for (let i = 0; i < CONFIG.INITIAL_GRAD_COUNT; i++) this.spawnEnemy(true, 'GRAD');
        for (let i = 0; i < CONFIG.INITIAL_PROF_COUNT; i++) this.spawnEnemy(true, 'PROF');

        // Generate powerups (avoid obstacles)
        for (let i = 0; i < CONFIG.POWERUPS_COUNT; i++) {
            let attempts = 0;
            while (attempts < 50) {
                let px = 100 + Math.random() * (CONFIG.WORLD_WIDTH - 200);
                let py = 100 + Math.random() * (CONFIG.WORLD_HEIGHT - 200);
                
                if (Utils.isSafePosition(px, py, 24, 24, allObstacles)) {
                    let type = Math.random();
                    let pType = 'HEALTH';
                    if (type > 0.6) pType = 'SPEED';
                    if (type > 0.85) pType = 'ARMOR';

                    this.powerups.push({
                        x: px, y: py,
                        type: pType,
                        active: true
                    });
                    break;
                }
                attempts++;
            }
        }

        // Generate sterno fuels (avoid obstacles)
        for (let i = 0; i < 10; i++) {
            let attempts = 0;
            while (attempts < 50) {
                let sx = 100 + Math.random() * (CONFIG.WORLD_WIDTH - 200);
                let sy = 100 + Math.random() * (CONFIG.WORLD_HEIGHT - 200);
                
                if (Utils.isSafePosition(sx, sy, 24, 24, allObstacles)) {
                    this.sternoFuels.push({
                        x: sx, y: sy,
                        active: true
                    });
                    break;
                }
                attempts++;
            }
        }
    },

    // Spawn enemy
    spawnEnemy(farAway, type = 'RA') {
        let ex, ey;
        let safe = false;
        let attempts = 0;
        const allObstacles = [...this.obstacles, ...this.trees];
        
        while (!safe && attempts < 100) {
            ex = Math.random() * (CONFIG.WORLD_WIDTH - 32);
            ey = Math.random() * (CONFIG.WORLD_HEIGHT - 40);
            let dist = Utils.distance(ex, ey, this.player.x, this.player.y);
            
            if (farAway && dist > 600 && Utils.isSafePosition(ex, ey, 32, 40, allObstacles)) {
                safe = true;
            } else if (!farAway && dist > 400 && Utils.isSafePosition(ex, ey, 32, 40, allObstacles)) {
                safe = true;
            }
            attempts++;
        }

        if (!safe) return; // Failed to find safe spot

        let stats = { type: type, x: ex, y: ey };
        if (type === 'RA') {
            stats.hp = 15;
            stats.speed = CONFIG.ENEMY_SPEED * 0.8;
            stats.damage = 15;
        } else if (type === 'GRAD') {
            stats.hp = 25;
            stats.speed = CONFIG.ENEMY_SPEED * 1.0;
            stats.damage = 25;
        } else if (type === 'PROF') {
            stats.hp = 40;
            stats.speed = CONFIG.ENEMY_SPEED * 1.2;
            stats.damage = 35;
        }
        this.enemies.push(stats);
    },

    // Spawn weapon upgrade at position
    spawnWeaponUpgrade(x, y) {
        const types = ['MULTISHOT', 'SPEED', 'FLAME'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.weaponUpgrades.push({
            x: x, y: y,
            type: type,
            active: true,
            life: 10 // Disappears after 10 seconds
        });
    },

    // Spawn bad item at position
    spawnBadItem(x, y) {
        const types = ['SLOW', 'DAMAGE', 'COLD', 'HORDE'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.badItems.push({
            x: x, y: y,
            type: type,
            active: true,
            life: 10
        });
    },

    // Spawn burning couch
    spawnBurningCouch() {
        const allObstacles = [...this.obstacles, ...this.trees];
        let attempts = 0;
        
        while (attempts < 50) {
            let cx = 100 + Math.random() * (CONFIG.WORLD_WIDTH - 200);
            let cy = 100 + Math.random() * (CONFIG.WORLD_HEIGHT - 200);
            
            if (Utils.isSafePosition(cx, cy, 60, 40, allObstacles)) {
                this.burningCouches.push({
                    x: cx, y: cy,
                    w: 60, h: 40,
                    life: 15 // Burns for 15 seconds
                });
                this.showMessage("A COUCH IS BURNING! Get warm near it!");
                break;
            }
            attempts++;
        }
    },

    // Update game logic
    update(dt) {
        if (this.state !== 'PLAY') return;

        // Check for burning couch spawn (rare)
        if (Date.now() - this.lastCouchSpawnCheck > 5000) {
            if (Math.random() < CONFIG.COUCH_SPAWN_CHANCE && this.burningCouches.length === 0) {
                this.spawnBurningCouch();
            }
            this.lastCouchSpawnCheck = Date.now();
        }

        this.updatePlayer(dt);
        this.updateCamera();
        this.updateProjectiles(dt);
        this.updateEnemies(dt);
        this.updateTokens();
        this.updatePowerups();
        this.updateWeaponUpgrades(dt);
        this.updateBadItems();
        this.updateWarmthSystem(dt);
        this.updateParticles(dt);
        this.updateBurningCouches(dt);
        this.checkMegaMode();
    },

    updatePlayer(dt) {
        // Movement
        let dx = 0;
        let dy = 0;
        if (this.keys.ArrowUp || this.keys.w) dy = -1;
        if (this.keys.ArrowDown || this.keys.s) dy = 1;
        if (this.keys.ArrowLeft || this.keys.a) { dx = -1; this.player.dir = -1; }
        if (this.keys.ArrowRight || this.keys.d) { dx = 1; this.player.dir = 1; }

        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        let currentSpeed = CONFIG.PLAYER_SPEED;
        
        // Speed boost/debuff system
        if (this.player.speedBoost !== 0) {
            if (this.player.speedBoost > 0) {
                currentSpeed *= 1.5; // Boost
                this.player.speedBoost -= dt;
                if (this.player.speedBoost <= 0) {
                    this.player.speedBoost = 0;
                    this.clearPowerupStatus();
                }
            } else {
                currentSpeed *= 0.5; // Slow (negative speedBoost)
                this.player.speedBoost += dt; // Count back up to 0
                if (this.player.speedBoost >= 0) {
                    this.player.speedBoost = 0;
                    this.clearPowerupStatus();
                }
            }
        }

        // MEGA MODE speed boost
        if (this.player.megaMode) {
            currentSpeed *= 1.3;
        }

        let newX = this.player.x + dx * currentSpeed * dt;
        let newY = this.player.y + dy * currentSpeed * dt;

        newX = Utils.clamp(newX, 0, CONFIG.WORLD_WIDTH - CONFIG.PLAYER_SIZE);
        newY = Utils.clamp(newY, 0, CONFIG.WORLD_HEIGHT - CONFIG.PLAYER_SIZE);

        // Collision detection with improved precision
        let collides = false;
        for (let tree of this.trees) {
            if (Utils.checkPlayerCollision(
                { x: newX, y: newY }, 
                tree, 
                tree.w, 
                tree.h
            )) {
                collides = true;
                break;
            }
        }

        if (!collides) {
            for (let obs of this.obstacles) {
                if (Utils.checkPlayerCollision(
                    { x: newX, y: newY }, 
                    obs, 
                    obs.w, 
                    obs.h
                )) {
                    collides = true;
                    break;
                }
            }
        }

        if (!collides) {
            this.player.x = newX;
            this.player.y = newY;
        }

        if (this.player.invulnerable > 0) this.player.invulnerable -= dt;

        // Weapon upgrade timer
        if (this.player.weaponUpgradeTime > 0) {
            this.player.weaponUpgradeTime -= dt;
            if (this.player.weaponUpgradeTime <= 0) {
                this.player.weaponUpgrade = null;
                this.clearPowerupStatus();
            }
        }

        // MEGA MODE timer
        if (this.player.megaModeTime > 0) {
            this.player.megaModeTime -= dt;
            if (this.player.megaModeTime <= 0) {
                this.player.megaMode = false;
                document.getElementById('game-container').classList.remove('mega-mode-active');
                this.clearPowerupStatus();
            }
        }

        // Kill streak decay
        if (this.player.killStreakTime > 0) {
            this.player.killStreakTime -= dt;
            if (this.player.killStreakTime <= 0) {
                this.player.killStreak = 0;
            }
        }

        // Shooting
        if (this.keys[' '] || this.keys['Space']) {
            if (Date.now() > this.nextShotTime) {
                this.shoot();
                let fireRate = 300;
                if (this.player.weaponUpgrade === 'SPEED') fireRate = 150;
                if (this.player.megaMode) fireRate = 200;
                this.nextShotTime = Date.now() + fireRate;
            }
        }
    },

    shoot() {
        const shootDir = this.player.dir;
        const baseX = this.player.x + 16;
        const baseY = this.player.y + 16;

        if (this.player.weaponUpgrade === 'MULTISHOT' || this.player.megaMode) {
            // Multishot: 3 projectiles in a spread
            for (let i = -1; i <= 1; i++) {
                this.projectiles.push({
                    x: baseX,
                    y: baseY,
                    vx: shootDir * CONFIG.PROJECTILE_SPEED,
                    vy: i * 100,
                    life: 1.5,
                    type: this.player.weaponUpgrade === 'FLAME' ? 'FLAME' : 'NORMAL'
                });
            }
        } else {
            // Single shot
            this.projectiles.push({
                x: baseX,
                y: baseY,
                vx: shootDir * CONFIG.PROJECTILE_SPEED,
                vy: 0,
                life: 1.5,
                type: this.player.weaponUpgrade === 'FLAME' ? 'FLAME' : 'NORMAL'
            });
        }
    },

    updateCamera() {
        this.camera.x = this.player.x - this.canvas.width / 2 + CONFIG.PLAYER_SIZE / 2;
        this.camera.y = this.player.y - this.canvas.height / 2 + CONFIG.PLAYER_SIZE / 2;
        
        this.camera.x = Utils.clamp(this.camera.x, 0, CONFIG.WORLD_WIDTH - this.canvas.width);
        this.camera.y = Utils.clamp(this.camera.y, 0, CONFIG.WORLD_HEIGHT - this.canvas.height);
    },

    updateProjectiles(dt) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            let p = this.projectiles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;

            // Hit enemy?
            let hit = false;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                let e = this.enemies[j];
                if (p.x > e.x && p.x < e.x + 32 && p.y > e.y && p.y < e.y + 40) {
                    let damage = 15;
                    if (p.type === 'FLAME') damage = 25;
                    if (this.player.megaMode) damage *= 1.5;
                    
                    e.hp -= damage;
                    Utils.createParticles(this.particles, e.x + 16, e.y + 20, '#fff', 3);
                    
                    if (e.hp <= 0) {
                        this.onEnemyKilled(e, j);
                    }
                    hit = true;
                    break;
                }
            }

            if (p.life <= 0 || hit || 
                p.x < 0 || p.x > CONFIG.WORLD_WIDTH || 
                p.y < 0 || p.y > CONFIG.WORLD_HEIGHT) {
                this.projectiles.splice(i, 1);
            }
        }
    },

    onEnemyKilled(enemy, index) {
        this.enemies.splice(index, 1);
        Utils.createParticles(this.particles, enemy.x + 16, enemy.y + 20, '#aa0000', 8);
        
        // Kill streak
        this.player.killStreak++;
        this.player.killStreakTime = 3; // Reset timer

        // Chance to drop weapon upgrade
        if (Math.random() < CONFIG.WEAPON_UPGRADE_SPAWN_CHANCE) {
            this.spawnWeaponUpgrade(enemy.x, enemy.y);
        }

        // Chance to drop bad item
        if (Math.random() < CONFIG.BAD_ITEM_SPAWN_CHANCE) {
            this.spawnBadItem(enemy.x, enemy.y);
        }

        // Respawn enemy later
        setTimeout(() => {
            if (this.state === 'PLAY') {
                this.spawnEnemy(true, enemy.type);
            }
        }, 2000);
    },

    updateEnemies(dt) {
        for (let e of this.enemies) {
            let angle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
            e.x += Math.cos(angle) * e.speed * dt;
            e.y += Math.sin(angle) * e.speed * dt;

            if (this.player.invulnerable <= 0) {
                if (this.player.x < e.x + 20 && this.player.x + 20 > e.x &&
                    this.player.y < e.y + 30 && this.player.y + 30 > e.y) {
                    this.takeDamage(e.damage, 'enemy');
                }
            }
        }
    },

    updateTokens() {
        for (let t of this.tokens) {
            if (!t.collected && Utils.checkCollision(this.player, t, 24)) {
                this.collectToken(t);
            }
        }
    },

    updatePowerups() {
        for (let p of this.powerups) {
            if (p.active && Utils.checkCollision(this.player, p, 24)) {
                this.activatePowerup(p);
            }
        }
    },

    updateWeaponUpgrades(dt) {
        for (let i = this.weaponUpgrades.length - 1; i >= 0; i--) {
            let w = this.weaponUpgrades[i];
            
            if (w.active) {
                w.life -= dt;
                if (w.life <= 0) {
                    this.weaponUpgrades.splice(i, 1);
                    continue;
                }

                if (Utils.checkCollision(this.player, w, 24)) {
                    this.player.weaponUpgrade = w.type;
                    this.player.weaponUpgradeTime = CONFIG.WEAPON_UPGRADE_DURATION;
                    w.active = false;
                    
                    let msg = "WEAPON UPGRADE!";
                    if (w.type === 'MULTISHOT') msg = "MULTISHOT!";
                    else if (w.type === 'SPEED') msg = "RAPID FIRE!";
                    else if (w.type === 'FLAME') msg = "FLAME SHOT!";
                    
                    this.setPowerupStatus(msg);
                    setTimeout(() => {
                        if (this.player.weaponUpgradeTime <= 0) {
                            this.clearPowerupStatus();
                        }
                    }, 2000);
                }
            }
        }
    },

    updateBadItems() {
        for (let i = this.badItems.length - 1; i >= 0; i--) {
            let b = this.badItems[i];
            
            if (b.active && Utils.checkCollision(this.player, b, 24)) {
                this.applyBadItem(b);
                this.badItems.splice(i, 1);
            }
        }
    },

    applyBadItem(item) {
        if (item.type === 'SLOW') {
            // Reduce speed temporarily
            this.player.speedBoost = -5; // Negative boost = slow
            this.setPowerupStatus("SLOWED!");
            setTimeout(() => {
                this.player.speedBoost = 0;
                this.clearPowerupStatus();
            }, 5000);
        } else if (item.type === 'DAMAGE') {
            this.takeDamage(20, 'poison');
            this.setPowerupStatus("POISON!");
        } else if (item.type === 'COLD') {
            this.player.warmth = Math.max(0, this.player.warmth - 30);
            this.setPowerupStatus("FREEZING!");
            this.updateHUD();
        } else if (item.type === 'HORDE') {
            // Spawn enemy horde
            this.setPowerupStatus("HORDE INCOMING!");
            for (let i = 0; i < CONFIG.HORDE_SIZE; i++) {
                setTimeout(() => {
                    this.spawnEnemy(false, 'RA');
                }, i * 200);
            }
        }
        
        setTimeout(() => {
            this.clearPowerupStatus();
        }, 2000);
    },

    updateWarmthSystem(dt) {
        // Decay warmth over time
        this.player.warmth -= CONFIG.WARMTH_DECAY_RATE * dt;
        
        // Check if near space heater
        let nearHeater = false;
        for (let heater of this.spaceHeaters) {
            let dist = Utils.distance(
                this.player.x + CONFIG.PLAYER_SIZE / 2,
                this.player.y + CONFIG.PLAYER_SIZE / 2,
                heater.x + 16,
                heater.y + 16
            );
            if (dist < CONFIG.WARMTH_HEATER_RADIUS) {
                this.player.warmth = Math.min(CONFIG.WARMTH_MAX, 
                    this.player.warmth + CONFIG.WARMTH_HEATER_RATE * dt);
                nearHeater = true;
                break;
            }
        }

        // Check if near burning couch
        for (let couch of this.burningCouches) {
            let dist = Utils.distance(
                this.player.x + CONFIG.PLAYER_SIZE / 2,
                this.player.y + CONFIG.PLAYER_SIZE / 2,
                couch.x + 30,
                couch.y + 20
            );
            if (dist < 100) {
                this.player.warmth = Math.min(CONFIG.WARMTH_MAX, 
                    this.player.warmth + CONFIG.WARMTH_COUCH_RATE * dt);
                nearHeater = true;
                break;
            }
        }

        // Check sterno fuel pickups
        for (let i = this.sternoFuels.length - 1; i >= 0; i--) {
            let s = this.sternoFuels[i];
            if (s.active && Utils.checkCollision(this.player, s, 24)) {
                this.player.warmth = Math.min(CONFIG.WARMTH_MAX, 
                    this.player.warmth + CONFIG.WARMTH_STERNO_BOOST);
                s.active = false;
                this.setPowerupStatus("WARMED UP!");
                setTimeout(() => {
                    this.clearPowerupStatus();
                }, 2000);
            }
        }

        this.player.warmth = Utils.clamp(this.player.warmth, 0, CONFIG.WARMTH_MAX);

        // Take damage if too cold
        if (this.player.warmth <= 0) {
            this.takeDamage(5 * dt, 'cold'); // Gradual damage when frozen
        }

        this.updateHUD();
    },

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let pt = this.particles[i];
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            pt.life -= dt;
            if (pt.life <= 0) this.particles.splice(i, 1);
        }
    },

    updateBurningCouches(dt) {
        for (let i = this.burningCouches.length - 1; i >= 0; i--) {
            let c = this.burningCouches[i];
            c.life -= dt;
            if (c.life <= 0) {
                this.burningCouches.splice(i, 1);
            }
        }
    },

    checkMegaMode() {
        if (this.player.megaMode) return; // Already in mega mode

        const healthPercent = (this.player.hp / this.player.maxHp) * 100;
        const warmthPercent = (this.player.warmth / this.player.maxWarmth) * 100;

        if (healthPercent > CONFIG.MEGA_MODE_HEALTH_THRESHOLD &&
            warmthPercent > CONFIG.MEGA_MODE_WARMTH_THRESHOLD &&
            this.player.killStreak >= CONFIG.MEGA_MODE_KILLS_REQUIRED) {
            
            this.activateMegaMode();
        }
    },

    activateMegaMode() {
        this.player.megaMode = true;
        this.player.megaModeTime = CONFIG.MEGA_MODE_DURATION;
        document.getElementById('game-container').classList.add('mega-mode-active');
        this.setPowerupStatus("MEGA MODE!", '#FFD700');
        
        // Visual feedback - particles from center
        const centerX = this.player.x + CONFIG.PLAYER_SIZE / 2;
        const centerY = this.player.y + CONFIG.PLAYER_SIZE / 2;
        Utils.createParticles(this.particles, centerX, centerY, '#FFD700', 30);
    },

    takeDamage(amount, source = 'enemy') {
        if (this.player.armor) {
            this.player.armor = false;
            this.setPowerupStatus("ARMOR BROKEN!");
            this.player.invulnerable = 1;
            const centerX = this.player.x + CONFIG.PLAYER_SIZE / 2;
            const centerY = this.player.y + CONFIG.PLAYER_SIZE / 2;
            Utils.createParticles(this.particles, centerX, centerY, '#C0C0C0', 10);
            return;
        }

        this.player.hp -= amount;
        this.player.invulnerable = 1.5;
        
        // Create particles from player center
        const centerX = this.player.x + CONFIG.PLAYER_SIZE / 2;
        const centerY = this.player.y + CONFIG.PLAYER_SIZE / 2;
        
        // Different particle colors for different damage sources
        let particleColor = '#F4C430'; // Default yellow
        if (source === 'cold') {
            particleColor = '#00CED1'; // Cyan for cold
        }
        
        Utils.createParticles(this.particles, centerX, centerY, particleColor, 5);
        this.updateHUD();

        if (this.player.hp <= 0) {
            // Set death reason
            if (source === 'cold') {
                this.deathReason = 'Frozen to Death';
            } else if (source === 'poison') {
                this.deathReason = 'Poisoned';
            } else {
                this.deathReason = 'Devoured by Students';
            }
            
            this.state = 'GAMEOVER';
            this.showGameOver();
        }
    },

    activatePowerup(p) {
        p.active = false;
        if (p.type === 'HEALTH') {
            this.player.hp = Math.min(this.player.hp + 30, this.player.maxHp);
            this.setPowerupStatus("HEALED!");
        } else if (p.type === 'ARMOR') {
            this.player.armor = true;
            this.setPowerupStatus("FOIL ARMOR EQUIPPED!");
        } else if (p.type === 'SPEED') {
            this.player.speedBoost = 5;
            this.setPowerupStatus("CAFFEINE RUSH!");
        }
        this.updateHUD();
        setTimeout(() => {
            this.clearPowerupStatus();
        }, 2000);
    },

    collectToken(token) {
        token.collected = true;
        this.tokensFound++;
        this.collectedClues.push(LORE.clues[token.id]);
        this.updateHUD();
        this.showMessage(LORE.clues[token.id]);

        let types = ['RA', 'RA', 'GRAD', 'PROF'];
        this.spawnEnemy(false, types[Math.floor(Math.random() * types.length)]);
        this.spawnEnemy(false, types[Math.floor(Math.random() * types.length)]);
    },

    showMessage(text) {
        this.state = 'DIALOGUE';
        const box = document.getElementById('message-box');
        const txt = document.getElementById('message-text');
        txt.innerHTML = `<span class="clue-text">FOUND SALSA!</span><br><br>${text}`;
        box.style.display = 'flex';
    },

    closeMessage() {
        document.getElementById('message-box').style.display = 'none';
        if (this.tokensFound >= CONFIG.TOKENS_TOTAL) {
            this.winGame();
        } else {
            this.state = 'PLAY';
        }
    },

    showGameOver() {
        const gameOverScreen = document.getElementById('game-over-screen');
        const gameOverTitle = gameOverScreen.querySelector('h1');
        const gameOverText = gameOverScreen.querySelector('p');
        
        gameOverTitle.textContent = this.deathReason.toUpperCase() + '!';
        
        if (this.deathReason === 'Frozen to Death') {
            gameOverText.textContent = 'You failed to stay warm in the harsh campus winter.';
        } else if (this.deathReason === 'Poisoned') {
            gameOverText.textContent = 'A toxic enemy drop proved to be your undoing.';
        } else {
            gameOverText.textContent = 'The hungry students enjoyed a delicious empanada meal.';
        }
        
        gameOverScreen.classList.remove('hidden');
    },

    winGame() {
        this.state = 'WIN';
        document.getElementById('win-screen').classList.remove('hidden');
        document.getElementById('final-lore').innerHTML = 
            "<strong>THE SCROLL OF TRUTH:</strong><br><br>" + 
            this.collectedClues.join('<br><br>');
    },

    updateHUD() {
        document.getElementById('tokens-found').innerText = this.tokensFound;
        document.getElementById('hp-fill').style.width = (this.player.hp / this.player.maxHp * 100) + '%';
        document.getElementById('warmth-fill').style.width = (this.player.warmth / this.player.maxWarmth * 100) + '%';
        
        if (this.player.hp < 30) {
            document.getElementById('hp-fill').style.background = '#f00';
        } else {
            document.getElementById('hp-fill').style.background = '#0f0';
        }

        if (this.player.warmth < 30) {
            document.getElementById('warmth-fill').style.background = '#0088ff';
        } else {
            document.getElementById('warmth-fill').style.background = '#ff8800';
        }
    },

    // UI Helper functions
    setPowerupStatus(text, color = 'yellow') {
        const statusEl = document.getElementById('powerup-status');
        statusEl.innerText = text;
        statusEl.style.color = color;
    },

    clearPowerupStatus() {
        const statusEl = document.getElementById('powerup-status');
        if (statusEl.innerText !== "MEGA MODE!") {
            statusEl.innerText = "";
            statusEl.style.color = 'yellow';
        }
    },

    // Draw game
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Ground
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);

        // Grid
        this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        this.ctx.beginPath();
        for (let x = 0; x < CONFIG.WORLD_WIDTH; x += 100) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, CONFIG.WORLD_HEIGHT);
        }
        for (let y = 0; y < CONFIG.WORLD_HEIGHT; y += 100) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(CONFIG.WORLD_WIDTH, y);
        }
        this.ctx.stroke();

        this.drawTrees();
        this.drawObstacles();
        this.drawSpaceHeaters();
        this.drawBurningCouches();
        this.drawPowerups();
        this.drawWeaponUpgrades();
        this.drawBadItems();
        this.drawSternoFuels();
        this.drawTokens();
        this.drawEnemies();
        this.drawProjectiles();
        this.drawParticles();
        this.drawPlayer();

        this.ctx.restore();
    },

    drawTrees() {
        for (let t of this.trees) {
            if (this.isVisible(t.x, t.y, 50, 50)) {
                this.ctx.drawImage(SpriteGenerator.sprites.tree, t.x, t.y);
            }
        }
    },

    drawObstacles() {
        for (let obs of this.obstacles) {
            if (this.isVisible(obs.x, obs.y, 100, 120)) {
                if (obs.type === 'building') {
                    this.ctx.drawImage(SpriteGenerator.sprites.building, obs.x, obs.y);
                } else if (obs.type === 'statue') {
                    this.ctx.drawImage(SpriteGenerator.sprites.statue, obs.x, obs.y);
                }
            }
        }
    },

    drawSpaceHeaters() {
        for (let h of this.spaceHeaters) {
            if (this.isVisible(h.x, h.y, 32, 32)) {
                this.ctx.drawImage(SpriteGenerator.sprites.heater, h.x, h.y);
                
                // Draw warmth radius indicator (subtle)
                let dist = Utils.distance(
                    this.player.x + CONFIG.PLAYER_SIZE / 2,
                    this.player.y + CONFIG.PLAYER_SIZE / 2,
                    h.x + 16,
                    h.y + 16
                );
                if (dist < CONFIG.WARMTH_HEATER_RADIUS) {
                    this.ctx.strokeStyle = 'rgba(255, 136, 0, 0.3)';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(h.x + 16, h.y + 16, CONFIG.WARMTH_HEATER_RADIUS, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }
        }
    },

    drawBurningCouches() {
        for (let c of this.burningCouches) {
            if (this.isVisible(c.x, c.y, 60, 40)) {
                this.ctx.drawImage(SpriteGenerator.sprites.couch, c.x, c.y);
            }
        }
    },

    drawPowerups() {
        for (let p of this.powerups) {
            if (p.active) {
                let s = SpriteGenerator.sprites.powerupHealth;
                if (p.type === 'ARMOR') s = SpriteGenerator.sprites.powerupArmor;
                if (p.type === 'SPEED') s = SpriteGenerator.sprites.powerupSpeed;
                this.ctx.drawImage(s, p.x, p.y);
            }
        }
    },

    drawWeaponUpgrades() {
        for (let w of this.weaponUpgrades) {
            if (w.active) {
                let s = SpriteGenerator.sprites.upgradeMultishot;
                if (w.type === 'SPEED') s = SpriteGenerator.sprites.upgradeSpeed;
                if (w.type === 'FLAME') s = SpriteGenerator.sprites.upgradeFlame;
                
                // Bob animation
                const bob = Math.sin(Date.now() / 200) * 3;
                this.ctx.drawImage(s, w.x, w.y + bob);
            }
        }
    },

    drawBadItems() {
        for (let b of this.badItems) {
            if (b.active) {
                let s = SpriteGenerator.sprites.badHealth;
                if (b.type === 'SLOW') s = SpriteGenerator.sprites.badSpeed;
                if (b.type === 'COLD') s = SpriteGenerator.sprites.badWarmth;
                if (b.type === 'HORDE') s = SpriteGenerator.sprites.badHealth;
                
                const bob = Math.sin(Date.now() / 200) * 3;
                this.ctx.drawImage(s, b.x, b.y + bob);
            }
        }
    },

    drawSternoFuels() {
        for (let s of this.sternoFuels) {
            if (s.active) {
                this.ctx.drawImage(SpriteGenerator.sprites.sterno, s.x, s.y);
            }
        }
    },

    drawTokens() {
        const bob = Math.sin(Date.now() / 200) * 3;
        for (let t of this.tokens) {
            if (!t.collected) {
                this.ctx.drawImage(SpriteGenerator.sprites.token, t.x, t.y + bob);
            }
        }
    },

    drawEnemies() {
        for (let e of this.enemies) {
            let sprite = SpriteGenerator.sprites.enemyRA;
            if (e.type === 'GRAD') sprite = SpriteGenerator.sprites.enemyGrad;
            if (e.type === 'PROF') sprite = SpriteGenerator.sprites.enemyProf;
            this.ctx.drawImage(sprite, e.x, e.y);
            
            if (e.type === 'PROF' || e.type === 'GRAD') {
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(e.x, e.y - 6, 32, 4);
                this.ctx.fillStyle = e.type === 'PROF' ? '#ff4444' : '#ff8844';
                let hpPercent = e.hp / (e.type === 'PROF' ? 40 : 25);
                this.ctx.fillRect(e.x, e.y - 6, 32 * hpPercent, 4);
            }
        }
    },

    drawProjectiles() {
        for (let p of this.projectiles) {
            if (p.type === 'FLAME') {
                this.ctx.fillStyle = '#FF4500';
            } else {
                this.ctx.fillStyle = '#FFA500';
            }
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
        }
    },

    drawParticles() {
        for (let pt of this.particles) {
            this.ctx.fillStyle = pt.color;
            this.ctx.globalAlpha = pt.life * 2;
            this.ctx.fillRect(pt.x, pt.y, 3, 3);
            this.ctx.globalAlpha = 1.0;
        }
    },

    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x + 16, this.player.y + 16);
        this.ctx.scale(this.player.dir, 1);

        if (this.player.invulnerable > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            this.ctx.globalAlpha = 0.5;
        }

        this.ctx.drawImage(SpriteGenerator.sprites.player, -16, -16);

        if (this.player.armor) {
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 18, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        if (this.player.megaMode) {
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 20 + Math.sin(Date.now() / 100) * 2, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        this.ctx.restore();
    },

    isVisible(x, y, w, h) {
        return x + w > this.camera.x && x < this.camera.x + this.canvas.width &&
               y + h > this.camera.y && y < this.camera.y + this.canvas.height;
    },

    // Main game loop
    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    },

    // Event listeners
    setupEventListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
            if (e.code === 'Space') {
                this.keys['Space'] = true;
                e.preventDefault(); // Prevent page scroll
            }
            if ((e.key === ' ' || e.key === 'Enter') && this.state === 'DIALOGUE') {
                this.closeMessage();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
            if (e.code === 'Space') this.keys['Space'] = false;
        });

        // Touch controls
        this.bindTouch('.up', 'ArrowUp');
        this.bindTouch('.down', 'ArrowDown');
        this.bindTouch('.left', 'ArrowLeft');
        this.bindTouch('.right', 'ArrowRight');
        this.bindTouch('.action-btn', 'Space');

        // UI buttons
        document.getElementById('lore-continue-btn').addEventListener('click', () => {
            document.getElementById('lore-screen').classList.add('hidden');
            document.getElementById('start-screen').classList.remove('hidden');
            this.state = 'START';
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            this.resetGame();
            this.state = 'PLAY';
        });

        document.getElementById('close-msg').addEventListener('click', () => this.closeMessage());

        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('win-screen').classList.add('hidden');
            this.resetGame();
            this.state = 'PLAY';
        });

        document.getElementById('retry-btn').addEventListener('click', () => {
            document.getElementById('game-over-screen').classList.add('hidden');
            this.resetGame();
            this.state = 'PLAY';
        });
    },

    bindTouch(selector, keyName) {
        const el = document.querySelector(selector);
        if (!el) return;
        
        const handleStart = (e) => {
            e.preventDefault();
            this.keys[keyName] = true;
        };
        const handleEnd = (e) => {
            e.preventDefault();
            this.keys[keyName] = false;
        };
        
        el.addEventListener('touchstart', handleStart);
        el.addEventListener('touchend', handleEnd);
        el.addEventListener('mousedown', handleStart);
        el.addEventListener('mouseup', handleEnd);
        el.addEventListener('mouseleave', handleEnd);
    }
};

// Start game when page loads
window.addEventListener('load', () => {
    Game.init();
});
