#include <raylib.h>

#define WIDTH 320
#define HEIGHT 240

enum SolidIcon {
  ICON_WATER_BOTTLE, // solid
  ICON_MOUNTAIN, // solid
  ICON_MAX
};

int codepoints[ICON_MAX] = {
  0xe4c5, // solid
  0xf6fc, // solid
};

float x = 0.0f;
float y = 0.0f;

int main(int argc, char *argv[])
{
    InitWindow(WIDTH, HEIGHT, "game");
    SetTargetFPS(60);
    Font fa_regular = LoadFontEx("../include/fa-regular.ttf", 36, codepoints, ICON_MAX);
    Font fa_solid = LoadFontEx("../include/fa-solid.ttf", 36, codepoints, ICON_MAX);
    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(RAYWHITE);
        DrawTextCodepoint(fa_solid, codepoints[ICON_WATER_BOTTLE], (Vector2){x, y}, 36, MAROON);
        x += 1.0f;
        y += 3.0f;
        if (y + 36 > HEIGHT)
          y = 0;
        if (x + 36 > WIDTH)
          x = 0;
        EndDrawing();
    }
    CloseWindow();
    return 0;
}
