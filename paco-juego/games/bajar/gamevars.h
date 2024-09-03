#include <ctime>

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
  ICON_AT,
  ICON_BOMB,
  ICON_HEART,
  ICON_0,
  ICON_1,
  ICON_2,
  ICON_3,
  ICON_W,
  ICON_EQUALS,
  ICON_FLAG,
  ICON_MAX,
};

int codepoints[ICON_MAX] = {
  0x0,
  0xe4c5,
  0x40,
  0xf1e2,
  0xf004,
  0x30,
  0x31,
  0x32,
  0x33,
  0x57,
  0x3d,
  0xf024,
};

Color icon_colors[ICON_MAX] = {
  WHITE,
  BLUE,
  BLACK,
  GOLD,
  RED,
  WHITE,
  WHITE,
  WHITE,
  WHITE,
  BLUE,
  BLACK,
  GREEN,
};

int grid[GRID_Y][GRID_X];
Rectangle rects[GRID_Y][GRID_X];
int hearts = 0;
int flags = 3;
int waters = 3;
int player_x = 5;
int player_y = 0;
bool playing = false;

int lost_nums[] = {4, 8, 15, 16, 23, 42};
void gen_grid() {
  unsigned int seed = time(0);
  unsigned int a = 1103515245;
  unsigned int c = 12345;
  unsigned int m = 6;
  unsigned int random_number = (a * seed + c) % m;
  for (int i = 1; i < GRID_X; i++)
    for (int j = 1; j < GRID_Y - 1; j++) {
      if (grid[j][i] == ICON_FLAG)
        continue;
      grid[j][i] = ICON_NONE;
      if (i == player_x && j == player_y)
        continue;
      if (lost_nums[random_number] % 2 == 0)
        grid[j][i] = ICON_BOMB;
      random_number++;
      if (random_number > m)
        random_number = 0;
    }      
}

