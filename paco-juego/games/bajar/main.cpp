#include <raylib.h>

#define WIDTH 320
#define HEIGHT 240
#define GRID_X 7
#define GRID_Y 6
#define ICON_WID 44
#define ICON_HGT 36
#define INSET_X 6
#define INSET_Y 12

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
};

int grid[GRID_Y][GRID_X];

int main(int argc, char *argv[])
{
    InitWindow(WIDTH, HEIGHT, "game");
    SetTargetFPS(60);
    Font fa_solid = LoadFontEx("../include/fa-solid.ttf", ICON_HGT, codepoints, ICON_MAX);

    grid[0][0] = ICON_HEART;
    grid[0][5] = ICON_AT;
    grid[3][3] = ICON_BOMB;
    grid[GRID_Y - 1][0] = ICON_WATER_BOTTLE;

    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(WHITE);
        for (int i = 0; i < GRID_X; i++) {
          for (int j = 0; j < GRID_Y; j++) {
            int wid = fa_solid.glyphs[grid[j][i]].advanceX;
            int padding = (ICON_WID - wid) / 2;
            DrawTextCodepoint(fa_solid, 
                              codepoints[grid[j][i]], 
                              (Vector2){(float)(INSET_X + padding + i * ICON_WID), 
                                        (float)(INSET_Y + j * ICON_HGT)}, 
                              ICON_HGT, 
                              BLACK);
          }
        }
        EndDrawing();
    }
    CloseWindow();
    return 0;
}
