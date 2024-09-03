#include <raylib.h>
#include "gamevars.h"

int main(int argc, char *argv[])
{
    InitWindow(WID, HGT, "game");
    SetTargetFPS(60);
    Font fa_solid = LoadFontEx("../include/fa-solid.ttf", ICON_HGT, codepoints, ICON_MAX);
    gen_rects();

    grid[0][0] = ICON_HEART;
    grid[GRID_Y - 2][0] = ICON_WATER_BOTTLE;
    grid[GRID_Y - 2][1] = ICON_EQUALS;
    grid[GRID_Y - 2][2] = ICON_W;

    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(WHITE);

        Vector2 touch = GetTouchPosition(0);
        Vector2 mouse = GetMousePosition();

        if (playing && (IsMouseButtonPressed(MOUSE_BUTTON_LEFT) || GetGestureDetected() == GESTURE_TAP))
            for (int i = player_x - 1; i <= player_x + 1; i++)
                for (int j = player_y - 1; j <= player_y + 1; j++) {
                    Rectangle r = rects[j][i];
                    if (CheckCollisionPointRec(touch, r) || CheckCollisionPointRec(mouse, r)) {
                        player_x = i;
                        player_y = j;
                        int icon = grid[j][i];
                        if (icon == ICON_BOMB) {
                            hearts--;
                            gen_grid();
                            //TODO check game over
                        }
                        if (j == GRID_Y - 1) {
                            //TODO win game
                            playing = false;
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
        grid[1][0] = int_icon(hearts);
        grid[GRID_Y - 1][0] = int_icon(waters);
        
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
