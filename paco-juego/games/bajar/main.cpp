#include <raylib.h>
#include "gamevars.h"

int main(int argc, char *argv[])
{
    InitWindow(WID, HGT, "game");
    SetTargetFPS(60);
    Font fa_solid = LoadFontEx("../include/fa-solid.ttf", ICON_HGT, codepoints, ICON_MAX);

    grid[0][0] = ICON_HEART;
    grid[1][0] = ICON_0;
    grid[GRID_Y - 2][0] = ICON_WATER_BOTTLE;
    grid[GRID_Y - 2][1] = ICON_EQUALS;
    grid[GRID_Y - 2][2] = ICON_W;
    grid[GRID_Y - 1][0] = ICON_3;
    grid[0][5] = ICON_AT;

    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(WHITE);

        DrawRectangle(0, 0, ICON_WID + 2 * ICON_GAP, HGT, BLACK);
        
        for (int i = 0; i < GRID_X; i++) {
          for (int j = 0; j < GRID_Y; j++) {
            int icon = grid[j][i];
            int wid = fa_solid.glyphs[icon].advanceX;
            int padding = (ICON_WID - wid) / 2;
            DrawTextCodepoint(fa_solid, 
                              codepoints[icon], 
                              (Vector2){(float)(padding + i * ICON_WID + (i + 1) * ICON_GAP), 
                                        (float)(j * ICON_HGT + (j + 1) * ICON_GAP)}, 
                              ICON_HGT, 
                              icon_colors[icon]);
          }
        }
        EndDrawing();
    }
    CloseWindow();
    return 0;
}
