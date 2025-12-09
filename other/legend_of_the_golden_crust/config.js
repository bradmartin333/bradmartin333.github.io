// Game Configuration and Constants
const CONFIG = {
    WORLD_WIDTH: 2400,  // 3x canvas width
    WORLD_HEIGHT: 1800, // 3x canvas height
    
    PLAYER_SPEED: 250,
    PLAYER_SIZE: 32,
    PLAYER_COLLISION_PADDING: 8, // More forgiving collision detection
    
    ENEMY_SPEED: 110,
    PROJECTILE_SPEED: 450,
    
    // Temperature System
    WARMTH_DECAY_RATE: 3, // Warmth points per second
    WARMTH_MAX: 100,
    WARMTH_HEATER_RADIUS: 80,
    WARMTH_HEATER_RATE: 25, // Warmth per second near heater
    WARMTH_STERNO_BOOST: 40,
    WARMTH_COUCH_RATE: 50, // Rare couch event
    COUCH_SPAWN_CHANCE: 0.001, // Very rare
    
    // MEGA MODE
    MEGA_MODE_HEALTH_THRESHOLD: 80,
    MEGA_MODE_WARMTH_THRESHOLD: 80,
    MEGA_MODE_KILLS_REQUIRED: 10,
    MEGA_MODE_DURATION: 10, // seconds
    
    // Weapon Upgrades
    WEAPON_UPGRADE_DURATION: 8, // seconds
    WEAPON_UPGRADE_SPAWN_CHANCE: 0.15, // From enemy kills
    
    // Bad Items
    BAD_ITEM_SPAWN_CHANCE: 0.08, // From enemy kills
    HORDE_SIZE: 5,
    
    // Spawn settings
    TREES_COUNT: 150,
    BUILDINGS_COUNT: 15,
    STATUES_COUNT: 20,
    TOKENS_TOTAL: 5,
    INITIAL_RA_COUNT: 15,
    INITIAL_GRAD_COUNT: 8,
    INITIAL_PROF_COUNT: 4,
    POWERUPS_COUNT: 15,
    SPACE_HEATERS_COUNT: 20,
    
    // Safe spawn distances
    SAFE_SPAWN_DISTANCE: 100,
    TOKEN_SPAWN_DISTANCE: 300
};

// Lore text
const LORE = {
    clues: [
        "First, the Baker took the Golden Corn, dried by the noon sun...",
        "Then came the Spicy Meat, seasoned with the whispers of chili spirits...",
        "He wept tears of joy into the Onions, caramelizing them instantly...",
        "He folded the edges thirteen times, sealing the flavor for eternity...",
        "Finally, he baked it in the Volcano of Crunch. The Legend is real!"
    ]
};
