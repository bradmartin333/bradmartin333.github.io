#include <raylib.h>

#define WIDTH 320
#define HEIGHT 240

enum SolidIcon {
  ICON_WATER_BOTTLE,
  ICON_MOUNTAIN,
  ICON_DIGGING,
  ICON_MAX,
};

int codepoints[ICON_MAX] = {
  0xe4c5,
  0xf6fc,
  0xf85e,
};

float x = (float)((WIDTH-40)/2);
float y = (float)((HEIGHT-36)/2);
float speed = 1.0;

int main(int argc, char *argv[])
{
    InitWindow(WIDTH, HEIGHT, "game");
    SetTargetFPS(60);
    Font fa_solid = LoadFontEx("../include/fa-solid.ttf", 36, codepoints, ICON_MAX);
    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(BLACK);
        
        DrawTextCodepoint(fa_solid, codepoints[ICON_DIGGING], (Vector2){x, y}, 36, YELLOW);
        
        if (IsKeyDown(KEY_LEFT)) x -= 1 * speed;
        if (IsKeyDown(KEY_RIGHT)) x += 1 * speed;
        if (IsKeyDown(KEY_DOWN)) y += 1 * speed;
        if (IsKeyDown(KEY_UP)) y -= 1 * speed;
        if (IsKeyPressed(KEY_SPACE)) speed *= 2;

        if (x < 0)
          x = 0;
        if (x > WIDTH-40)
          x = WIDTH-40;
        if (y < 0)
          y = 0;
        if (y > HEIGHT-36)
          y = HEIGHT-36;
        
        EndDrawing();
    }
    CloseWindow();
    return 0;
}
