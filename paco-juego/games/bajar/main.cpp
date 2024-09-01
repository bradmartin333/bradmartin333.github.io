#include <raylib.h>

#define WIDTH 320
#define HEIGHT 240

enum Icon {
  ICON_WATER_BOTTLE,
  ICON_MOUNTAIN,
  ICON_MAX
};

int codepoints[ICON_MAX] = {
  0xe4c5,
  0xf6fc
};

int main(int argc, char *argv[])
{
    InitWindow(WIDTH, HEIGHT, "game");
    SetTargetFPS(60);
    Font fa_regular = LoadFontEx("../include/fa-regular-400.ttf", 36, codepoints, ICON_MAX);
    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(RAYWHITE);
        DrawTextCodepoint(fa_regular, codepoints[ICON_WATER_BOTTLE], (Vector2){20.0f, 20.0f}, 36, MAROON);
        EndDrawing();
    }
    CloseWindow();
    return 0;
}
