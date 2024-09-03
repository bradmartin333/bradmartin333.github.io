constexpr int WID = 320;
constexpr int HGT = 240;
constexpr int GRID_X = 7;
constexpr int GRID_Y = 6;
constexpr int ICON_GAP = 5;
constexpr int ICON_WID = (WID - (GRID_X + 1) * ICON_GAP) / GRID_X - ICON_GAP / GRID_X;
constexpr int ICON_HGT = (HGT - (GRID_Y + 1) * ICON_GAP) / GRID_Y - ICON_GAP / GRID_Y;

enum Icon {
  ICON_NONE,
  ICON_WATER_BOTTLE,
  ICON_MOUNTAIN,
  ICON_DIGGING,
  ICON_DOWN,
  ICON_LEFT,
  ICON_RIGHT,
  ICON_UP,
  ICON_AT,
  ICON_BOMB,
  ICON_HEART,
  ICON_3,
  ICON_2,
  ICON_1,
  ICON_0,
  ICON_W,
  ICON_EQUALS,
  ICON_MAX,
};

int codepoints[ICON_MAX] = {
  0x0,
  0xe4c5,
  0xf6fc,
  0xf85e,
  0xf358,
  0xf359,
  0xf35a,
  0xf35b,
  0x40,
  0xf1e2,
  0xf004,
  0x33,
  0x32,
  0x31,
  0x30,
  0x57,
  0x3d,
};

Color icon_colors[ICON_MAX] = {
  WHITE,
  BLUE,
  GREEN,
  YELLOW,
  MAROON,
  MAROON,
  MAROON,
  MAROON,
  BLACK,
  MAGENTA,
  RED,
  WHITE,
  WHITE,
  WHITE,
  WHITE,
  BLACK,
  BLACK,
};

int grid[GRID_Y][GRID_X];

