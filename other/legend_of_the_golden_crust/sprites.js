// Sprite Generation Module
const SpriteGenerator = {
    sprites: {
        player: null,
        token: null,
        tree: null,
        enemy: null,
        powerupArmor: null,
        powerupSpeed: null,
        powerupHealth: null,
        enemyRA: null,
        enemyGrad: null,
        enemyProf: null,
        building: null,
        statue: null,
        heater: null,
        couch: null,
        sterno: null,
        // Weapon upgrades
        upgradeMultishot: null,
        upgradeSpeed: null,
        upgradeFlame: null,
        // Bad items
        badSpeed: null,
        badHealth: null,
        badWarmth: null
    },

    generateAll() {
        this.generatePlayer();
        this.generateToken();
        this.generateEnemies();
        this.generatePowerups();
        this.generateObstacles();
        this.generateWeaponUpgrades();
        this.generateBadItems();
        this.generateWarmthItems();
    },

    generatePlayer() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#F4C430'; // Crust
        ctx.beginPath();
        ctx.arc(16, 20, 14, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#D4A017';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#D4A017'; // Crimp
        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.arc(4 + (i * 4.5), 20, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        // Face
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 14, 4, 4);
        ctx.fillRect(18, 14, 4, 4);
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(8, 18, 3, 2);
        ctx.fillRect(21, 18, 3, 2);
        
        this.sprites.player = canvas;
    },

    generateToken() {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FFF';
        ctx.fillRect(6, 4, 12, 16);
        ctx.strokeStyle = '#AAA';
        ctx.strokeRect(6, 4, 12, 16);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(7, 8, 10, 11);
        ctx.fillStyle = '#008000';
        ctx.fillRect(5, 2, 14, 4);
        
        this.sprites.token = canvas;
    },

    generateEnemies() {
        // RA (Easy - hoodie student)
        const raCanvas = document.createElement('canvas');
        raCanvas.width = 32;
        raCanvas.height = 40;
        const raCtx = raCanvas.getContext('2d');
        raCtx.fillStyle = '#88cc88';
        raCtx.beginPath();
        raCtx.arc(16, 12, 10, 0, Math.PI * 2);
        raCtx.fill();
        raCtx.fillRect(8, 20, 16, 14);
        raCtx.fillStyle = '#eec';
        raCtx.fillRect(12, 8, 8, 8);
        raCtx.fillStyle = '#333';
        raCtx.fillRect(13, 11, 2, 2);
        raCtx.fillRect(17, 11, 2, 2);
        raCtx.fillStyle = '#222';
        raCtx.fillRect(10, 34, 5, 6);
        raCtx.fillRect(17, 34, 5, 6);
        this.sprites.enemyRA = raCanvas;

        // Grad Student
        const gradCanvas = document.createElement('canvas');
        gradCanvas.width = 32;
        gradCanvas.height = 40;
        const gradCtx = gradCanvas.getContext('2d');
        gradCtx.fillStyle = '#6688cc';
        gradCtx.beginPath();
        gradCtx.arc(16, 12, 10, 0, Math.PI * 2);
        gradCtx.fill();
        gradCtx.fillRect(8, 20, 16, 14);
        gradCtx.fillStyle = '#ddc';
        gradCtx.fillRect(12, 8, 8, 8);
        gradCtx.fillStyle = '#222';
        gradCtx.fillRect(13, 11, 3, 2);
        gradCtx.fillRect(17, 11, 3, 2);
        gradCtx.fillStyle = '#500';
        gradCtx.globalAlpha = 0.5;
        gradCtx.fillRect(12, 13, 4, 2);
        gradCtx.fillRect(17, 13, 4, 2);
        gradCtx.globalAlpha = 1.0;
        gradCtx.fillStyle = '#6F4E37';
        gradCtx.fillRect(14, 26, 4, 6);
        gradCtx.fillStyle = '#222';
        gradCtx.fillRect(10, 34, 5, 6);
        gradCtx.fillRect(17, 34, 5, 6);
        this.sprites.enemyGrad = gradCanvas;

        // Professor
        const profCanvas = document.createElement('canvas');
        profCanvas.width = 32;
        profCanvas.height = 40;
        const profCtx = profCanvas.getContext('2d');
        profCtx.fillStyle = '#ddc';
        profCtx.beginPath();
        profCtx.arc(16, 10, 8, 0, Math.PI * 2);
        profCtx.fill();
        profCtx.fillStyle = '#888';
        profCtx.fillRect(10, 9, 5, 3);
        profCtx.fillRect(17, 9, 5, 3);
        profCtx.fillStyle = '#000';
        profCtx.fillRect(12, 10, 2, 1);
        profCtx.fillRect(18, 10, 2, 1);
        profCtx.fillStyle = '#222';
        profCtx.fillRect(8, 18, 16, 16);
        profCtx.fillStyle = '#fff';
        profCtx.fillRect(14, 20, 4, 10);
        profCtx.fillStyle = '#8B0000';
        profCtx.fillRect(15, 22, 2, 8);
        profCtx.fillStyle = '#333';
        profCtx.fillRect(10, 34, 5, 6);
        profCtx.fillRect(17, 34, 5, 6);
        this.sprites.enemyProf = profCanvas;
        this.sprites.enemy = raCanvas;
    },

    generatePowerups() {
        // Armor (Foil)
        const aCanvas = document.createElement('canvas');
        aCanvas.width = 24;
        aCanvas.height = 24;
        const aCtx = aCanvas.getContext('2d');
        aCtx.fillStyle = '#C0C0C0';
        aCtx.fillRect(4, 4, 16, 16);
        aCtx.strokeStyle = '#fff';
        aCtx.lineWidth = 2;
        aCtx.strokeRect(4, 4, 16, 16);
        aCtx.fillStyle = '#fff';
        aCtx.font = '12px Arial';
        aCtx.fillText('Ag', 6, 18);
        this.sprites.powerupArmor = aCanvas;

        // Speed (Coffee)
        const sCanvas = document.createElement('canvas');
        sCanvas.width = 24;
        sCanvas.height = 24;
        const sCtx = sCanvas.getContext('2d');
        sCtx.fillStyle = '#6F4E37';
        sCtx.fillRect(6, 6, 12, 14);
        sCtx.fillStyle = '#fff';
        sCtx.fillRect(6, 6, 12, 2);
        sCtx.globalAlpha = 0.5;
        sCtx.fillRect(10, 2, 2, 4);
        sCtx.fillRect(14, 0, 2, 6);
        sCtx.globalAlpha = 1.0;
        this.sprites.powerupSpeed = sCanvas;

        // Health (First Aid)
        const hCanvas = document.createElement('canvas');
        hCanvas.width = 24;
        hCanvas.height = 24;
        const hCtx = hCanvas.getContext('2d');
        hCtx.fillStyle = '#fff';
        hCtx.fillRect(2, 2, 20, 20);
        hCtx.fillStyle = '#f00';
        hCtx.fillRect(10, 6, 4, 12);
        hCtx.fillRect(6, 10, 12, 4);
        this.sprites.powerupHealth = hCanvas;
    },

    generateObstacles() {
        // Tree
        const trCanvas = document.createElement('canvas');
        trCanvas.width = 40;
        trCanvas.height = 40;
        const trCtx = trCanvas.getContext('2d');
        trCtx.fillStyle = '#8B4513';
        trCtx.fillRect(16, 20, 8, 20);
        trCtx.fillStyle = '#228B22';
        trCtx.fillRect(4, 10, 32, 12);
        trCtx.fillRect(8, 0, 24, 12);
        this.sprites.tree = trCanvas;

        // Building
        const buildCanvas = document.createElement('canvas');
        buildCanvas.width = 80;
        buildCanvas.height = 100;
        const buildCtx = buildCanvas.getContext('2d');
        buildCtx.fillStyle = '#8B4513';
        buildCtx.fillRect(0, 20, 80, 80);
        buildCtx.fillStyle = '#fff';
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                buildCtx.fillRect(8 + c * 18, 30 + r * 20, 12, 15);
            }
        }
        buildCtx.fillStyle = '#654321';
        buildCtx.beginPath();
        buildCtx.moveTo(0, 20);
        buildCtx.lineTo(40, 0);
        buildCtx.lineTo(80, 20);
        buildCtx.fill();
        buildCtx.fillStyle = '#333';
        buildCtx.fillRect(32, 75, 16, 25);
        this.sprites.building = buildCanvas;

        // Statue
        const statCanvas = document.createElement('canvas');
        statCanvas.width = 40;
        statCanvas.height = 60;
        const statCtx = statCanvas.getContext('2d');
        statCtx.fillStyle = '#999';
        statCtx.fillRect(8, 40, 24, 20);
        statCtx.fillStyle = '#666';
        statCtx.fillRect(14, 10, 12, 30);
        statCtx.beginPath();
        statCtx.arc(20, 10, 6, 0, Math.PI * 2);
        statCtx.fill();
        statCtx.fillRect(10, 20, 6, 15);
        statCtx.fillRect(24, 20, 6, 15);
        this.sprites.statue = statCanvas;
    },

    generateWeaponUpgrades() {
        // Multishot
        const multiCanvas = document.createElement('canvas');
        multiCanvas.width = 24;
        multiCanvas.height = 24;
        const multiCtx = multiCanvas.getContext('2d');
        multiCtx.fillStyle = '#FFA500';
        multiCtx.fillRect(2, 10, 20, 4);
        multiCtx.fillRect(10, 2, 4, 20);
        multiCtx.fillRect(4, 4, 16, 2);
        multiCtx.fillRect(4, 18, 16, 2);
        this.sprites.upgradeMultishot = multiCanvas;

        // Speed Shot
        const speedCanvas = document.createElement('canvas');
        speedCanvas.width = 24;
        speedCanvas.height = 24;
        const speedCtx = speedCanvas.getContext('2d');
        speedCtx.fillStyle = '#00FFFF';
        for (let i = 0; i < 3; i++) {
            speedCtx.fillRect(4 + i * 6, 10 - i * 2, 4, 4 + i * 4);
        }
        this.sprites.upgradeSpeed = speedCanvas;

        // Flame
        const flameCanvas = document.createElement('canvas');
        flameCanvas.width = 24;
        flameCanvas.height = 24;
        const flameCtx = flameCanvas.getContext('2d');
        flameCtx.fillStyle = '#FF4500';
        flameCtx.beginPath();
        flameCtx.moveTo(12, 4);
        flameCtx.lineTo(8, 20);
        flameCtx.lineTo(16, 20);
        flameCtx.fill();
        flameCtx.fillStyle = '#FFD700';
        flameCtx.beginPath();
        flameCtx.moveTo(12, 8);
        flameCtx.lineTo(10, 18);
        flameCtx.lineTo(14, 18);
        flameCtx.fill();
        this.sprites.upgradeFlame = flameCanvas;
    },

    generateBadItems() {
        // Bad Speed (Slime)
        const badSpeedCanvas = document.createElement('canvas');
        badSpeedCanvas.width = 24;
        badSpeedCanvas.height = 24;
        const badSpeedCtx = badSpeedCanvas.getContext('2d');
        badSpeedCtx.fillStyle = '#00FF00';
        badSpeedCtx.beginPath();
        badSpeedCtx.arc(12, 16, 8, 0, Math.PI * 2);
        badSpeedCtx.fill();
        badSpeedCtx.fillStyle = '#008000';
        badSpeedCtx.fillRect(8, 16, 8, 4);
        this.sprites.badSpeed = badSpeedCanvas;

        // Bad Health (Poison)
        const badHealthCanvas = document.createElement('canvas');
        badHealthCanvas.width = 24;
        badHealthCanvas.height = 24;
        const badHealthCtx = badHealthCanvas.getContext('2d');
        badHealthCtx.fillStyle = '#800080';
        badHealthCtx.beginPath();
        badHealthCtx.arc(12, 12, 8, 0, Math.PI * 2);
        badHealthCtx.fill();
        badHealthCtx.fillStyle = '#FF00FF';
        badHealthCtx.fillRect(10, 10, 4, 4);
        this.sprites.badHealth = badHealthCanvas;

        // Bad Warmth (Ice)
        const badWarmthCanvas = document.createElement('canvas');
        badWarmthCanvas.width = 24;
        badWarmthCanvas.height = 24;
        const badWarmthCtx = badWarmthCanvas.getContext('2d');
        badWarmthCtx.fillStyle = '#00CED1';
        badWarmthCtx.fillRect(6, 8, 12, 8);
        badWarmthCtx.fillRect(8, 6, 8, 12);
        badWarmthCtx.fillStyle = '#E0FFFF';
        badWarmthCtx.fillRect(10, 10, 4, 4);
        this.sprites.badWarmth = badWarmthCanvas;
    },

    generateWarmthItems() {
        // Space Heater
        const heaterCanvas = document.createElement('canvas');
        heaterCanvas.width = 32;
        heaterCanvas.height = 32;
        const heaterCtx = heaterCanvas.getContext('2d');
        heaterCtx.fillStyle = '#888';
        heaterCtx.fillRect(8, 8, 16, 20);
        heaterCtx.fillStyle = '#FF4500';
        heaterCtx.fillRect(10, 10, 12, 4);
        heaterCtx.fillRect(10, 16, 12, 4);
        heaterCtx.fillRect(10, 22, 12, 4);
        heaterCtx.fillStyle = '#333';
        heaterCtx.fillRect(12, 28, 8, 3);
        this.sprites.heater = heaterCanvas;

        // Burning Couch
        const couchCanvas = document.createElement('canvas');
        couchCanvas.width = 60;
        couchCanvas.height = 40;
        const couchCtx = couchCanvas.getContext('2d');
        couchCtx.fillStyle = '#8B4513';
        couchCtx.fillRect(5, 15, 50, 20);
        couchCtx.fillRect(5, 10, 10, 15);
        couchCtx.fillRect(45, 10, 10, 15);
        // Flames
        couchCtx.fillStyle = '#FF4500';
        for (let i = 0; i < 5; i++) {
            couchCtx.beginPath();
            couchCtx.moveTo(10 + i * 10, 15);
            couchCtx.lineTo(8 + i * 10, 5);
            couchCtx.lineTo(12 + i * 10, 5);
            couchCtx.fill();
        }
        couchCtx.fillStyle = '#FFD700';
        for (let i = 0; i < 5; i++) {
            couchCtx.beginPath();
            couchCtx.moveTo(10 + i * 10, 15);
            couchCtx.lineTo(9 + i * 10, 8);
            couchCtx.lineTo(11 + i * 10, 8);
            couchCtx.fill();
        }
        this.sprites.couch = couchCanvas;

        // Sterno Fuel
        const sternoCanvas = document.createElement('canvas');
        sternoCanvas.width = 24;
        sternoCanvas.height = 24;
        const sternoCtx = sternoCanvas.getContext('2d');
        sternoCtx.fillStyle = '#C0C0C0';
        sternoCtx.fillRect(6, 8, 12, 14);
        sternoCtx.fillStyle = '#4169E1';
        sternoCtx.fillRect(8, 10, 8, 10);
        sternoCtx.fillStyle = '#FF4500';
        sternoCtx.fillRect(10, 6, 4, 4);
        this.sprites.sterno = sternoCanvas;
    }
};
