#!/bin/bash

# Create emscripten environment variables
source ~/emsdk/emsdk_env.sh

# Execute emscripten build command specific to raylib, wasm and c++ with packed resources
cd $1
mkdir -p build
emcc main.cpp -o ./build/$1.html -Wall -std=c++14 -D_DEFAULT_SOURCE -Wmissing-braces -Wunused-result -Os -I. -I ~/raylib/src/ -I ~/raylib/src/external/ -L. -L ~/raylib/src/ -s USE_GLFW=3 -s ASYNCIFY -s TOTAL_MEMORY=67108864 -s FORCE_FILESYSTEM=1 --shell-file ../shell.html ~/raylib/src/libraylib.a  -DPLATFORM_WEB -s EXPORTED_FUNCTIONS=[\"_free\",\"_malloc\",\"_main\"] -s EXPORTED_RUNTIME_METHODS=ccall
