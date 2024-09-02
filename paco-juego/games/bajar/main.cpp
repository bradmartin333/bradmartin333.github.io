#include <raylib.h>

#define WIDTH 320
#define HEIGHT 240

enum SolidIcon {
  ICON_WATER_BOTTLE,
  ICON_MOUNTAIN,
  ICON_DIGGING,
  ICON_DOWN,
  ICON_LEFT,
  ICON_RIGHT,
  ICON_UP,
  ICON_AT,
  ICON_BOMB,
  ICON_MAX,
};

int codepoints[ICON_MAX] = {
  0xe4c5,
  0xf6fc,
  0xf85e,
  0xf358,
  0xf359,
  0xf35a,
  0xf35b,
  0x40,
  0xf1e2,
};

int icon_idx = 0;
float x = (float)((WIDTH-40)/2);
float y = (float)((HEIGHT-36)/2);
float speed = 1.0;
int icon_wid = 0;
int icon_hgt = 36;

int main(int argc, char *argv[])
{
    InitWindow(WIDTH, HEIGHT, "game");
    SetTargetFPS(60);
    Font fa_solid = LoadFontEx("../include/fa-solid.ttf", icon_hgt, codepoints, ICON_MAX);
    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(WHITE);
        
        if (IsKeyDown(KEY_LEFT)) x -= 1 * speed;
        if (IsKeyDown(KEY_RIGHT)) x += 1 * speed;
        if (IsKeyDown(KEY_DOWN)) y += 1 * speed;
        if (IsKeyDown(KEY_UP)) y -= 1 * speed;
        if (IsKeyPressed(KEY_SPACE)) speed *= 2;
        if (IsKeyPressed(KEY_A)) {
          if (++icon_idx >= ICON_MAX)
            icon_idx = 0;
        }

        icon_wid = fa_solid.glyphs[icon_idx].advanceX;

        if (x < 0)
          x = 0;
        if (x > WIDTH-icon_wid)
          x = WIDTH-icon_wid;
        if (y < 0)
          y = 0;
        if (y > HEIGHT-icon_hgt)
          y = HEIGHT-icon_hgt;

        DrawRectangle(x, y, icon_wid, icon_hgt, BLACK);
        DrawTextCodepoint(fa_solid, codepoints[icon_idx], (Vector2){x, y}, icon_hgt, YELLOW);

        EndDrawing();
    }
    CloseWindow();
    return 0;
}
