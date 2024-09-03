#include <raylib.h>
#include "gamevars.h"

int main(int argc, char *argv[])
{
    InitWindow(WID, HGT, "game");
    SetTargetFPS(60);
    Font fa_solid = LoadFontEx("../include/fa-solid.ttf", ICON_HGT, codepoints, ICON_MAX);

    grid[0][0] = ICON_HEART;
    grid[2][0] = ICON_FLAG;
    grid[4][0] = ICON_WATER_BOTTLE;
    grid[4][1] = ICON_EQUALS;
    grid[4][2] = ICON_W;
    grid[2][2] = ICON_FLAG;
    grid[4][4] = ICON_FLAG;
    grid[3][6] = ICON_FLAG;

    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(WHITE);

        Vector2 touch = GetTouchPosition(0);
        Vector2 mouse = GetMousePosition();

        if (playing && (IsMouseButtonPressed(MOUSE_BUTTON_LEFT) || GetGestureDetected() == GESTURE_TAP))
            for (int i = player_x - 1; i <= player_x + 1; i++)
                for (int j = player_y - 1; j <= player_y + 1; j++) {
                    Rectangle r = (Rectangle){(float)(i * ICON_WID + (i + 1) * ICON_GAP), 
                                              (float)(j * ICON_HGT + (j + 1) * ICON_GAP), 
                                              (float)ICON_WID, 
                                              (float)ICON_HGT};
                    if (CheckCollisionPointRec(touch, r) || CheckCollisionPointRec(mouse, r)) {
                        if (j == GRID_Y - 1) {
                            if (flags != 0)
                                continue;
                            playing = false;
                            //TODO win game
                        }
                        if (j == 0 && player_x > 0)
                            continue;
                        player_x = i;
                        player_y = j;
                        int icon = grid[j][i];
                        if (icon == ICON_BOMB) {
                            hearts--;
                            if (hearts == 0) {
                                playing = false;
                                //TODO lose game
                            }
                            gen_grid();
                        }
                        if (icon == ICON_FLAG) {
                            grid[j][i] = ICON_NONE;
                            flags--;
                            gen_grid();
                        }
                    }
                }                                
                    
        if (IsKeyPressed(KEY_W) && waters > 0) {
            if (waters == 3) {
                gen_grid();
                playing = true;
            }
            waters--;
            hearts = 2;
        }
        
        grid[1][0] = ICON_0 + hearts;
        grid[3][0] = ICON_0 + flags;
        grid[5][0] = ICON_0 + waters;
        
        DrawRectangle(0, 0, WID, ICON_HGT + 2 * ICON_GAP, SKYBLUE);
        DrawRectangle(0, HGT - ICON_HGT - 2 * ICON_GAP, WID, ICON_HGT + 2 * ICON_GAP, DARKGREEN);
        DrawRectangle(0, 0, ICON_WID + 2 * ICON_GAP, HGT, BLACK);
        
        for (int i = 0; i < GRID_X; i++)
          for (int j = 0; j < GRID_Y; j++) {
            int icon = (i == player_x && j == player_y) ? ICON_AT : grid[j][i];
            int wid = fa_solid.glyphs[icon].advanceX;
            int padding = (ICON_WID - wid) / 2;
            DrawTextCodepoint(fa_solid, 
                              codepoints[icon], 
                              (Vector2){(float)(padding + i * ICON_WID + (i + 1) * ICON_GAP), 
                                        (float)(j * ICON_HGT + (j + 1) * ICON_GAP)}, 
                              ICON_HGT, 
                              icon_colors[icon]);
          }

        EndDrawing();
    }
    CloseWindow();
    return 0;
}
