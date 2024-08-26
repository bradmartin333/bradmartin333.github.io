#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <raylib.h>

#if defined(PLATFORM_WEB)
#include <emscripten/emscripten.h>
#endif

int framesCounter = 0;
int screenWidth = 320;
int screenHeight = 240;

void UpdateGame(void)
{
    framesCounter++;
}

void DrawGame(void)
{
    BeginDrawing();
    ClearBackground(RAYWHITE);
    EndDrawing();
}

void UpdateDrawFrame(void)
{
    UpdateGame();
    DrawGame();
}

int main(void)
{
    SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_VSYNC_HINT);
    InitWindow(screenWidth, screenHeight, "bajar");

#if defined(PLATFORM_WEB)
    emscripten_set_main_loop(UpdateDrawFrame, 60, 1);
#else
    SetTargetFPS(60);
    while (!WindowShouldClose()) // Detect window close button or ESC key
    {
        UpdateDrawFrame();
    }
#endif
    CloseWindow();
    return 0;
}
