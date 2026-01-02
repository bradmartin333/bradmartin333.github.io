# Tips and Tricks

## This is a list of some of my favorite tools as well as a cheatsheet for code snippets

- [numbat](https://numbat.dev/): high precision scientific calculator with full support for physical units
- [typst](https://typst.app/): like [overleaf](https://overleaf.com/), but with optimizations and built with rust
- [ScreenToGif](https://www.screentogif.com/): screen, webcam and sketchboard recorder with an integrated editor
- [iwanthue](https://medialab.github.io/iwanthue/): generate and refine palettes of optimally distinct colors
- [cobalt](https://co.wukko.me/): simple content downloader
- [tldraw](https://www.tldraw.com/): collaborative whiteboard app
- [image2cpp](https://javl.github.io/image2cpp/): convert images to byte arrays for use with microcontrollers and LED matrices
- [jsonformatter](https://jsonformatter.curiousconcept.com/#): validate and format JSON data
- [onlineide](https://www.onlineide.pro/): online IDE with support for many languages
- [bitwisecmd](https://bitwisecmd.com/): command line tool for bitwise operations

# ImageMagick

### GIFs
- Make `magick -delay 20 *.png movie.gif`
- Extract frames `magick mogrify -format png *.gif`
- Crop `magick input.gif -coalesce -repage 0x0 -gravity Center -crop 25% +repage output.gif`
- Spin an image `magick convert input.jpg -duplicate 23 -distort SRT %[fx:t*360/n] -set delay 10 -loop 0 output.gif`
- Compress `magick mogrify -layers 'optimize' -fuzz 7% movie.gif`

### Filters
- Crop `magick mogrify -crop 300x300+150+150 -path ./cropped *.png`
- Grayscale `magick <img_in> -set colorspace Gray -separate -evaluate-sequence Mean <img_out>`
- Resize `magick mogrify ./ -resize 20% -quality 80  *.png`

### Other
- Make icon `magick Capture.png -define icon:auto-resize=256,64,48,32,16 capture.ico`

# Bash

### Change to script dir if user is not already there

```bash
#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
if [[ $SCRIPT_DIR != $(pwd) ]]; then cd $SCRIPT_DIR; fi
```

### Quietly serve a directory with python

```bash
nohup python3 -m http.server 8080 --directory webpages > server.log 2>&1 &
```

# CI/CD

### Tidy GitLab example with artifacts

```yaml
stages:
  - build

demo_build:
  stage: build
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      changes:
        - a_folder/*.cpp
        - build.sh
        - .gitlab-ci.yml
  tags:
    - runner_tag
  script:
    - ./build.sh
  artifacts:
    paths:
      - ./build/*
    when: on_success
    expire_in: 1 yr
```

# FFMPEG

- Trim `ffmpeg -ss 00:07 -to 00:59 -i <input> -c:v copy -c:a copy <output>`
- Add timestamp `ffmpeg -i input.mp4 -filter:v drawtext="fontfile=/Windows/Fonts/cour.ttf:fontsize=150:fontcolor='white':box=1:boxcolor='black@0.5':boxborderw=5:timecode='00\:00\:00;00':timecode_rate=(30*1000/1001):x=(w-text_w):y=(h-text_h)" output.mp4`
- Strip audio `ffmpeg -i $input_file -c copy -an $output_file`
- Extract audio `ffmpeg -i input_file.mp4 -q:a 0 -map a output_file.mp3`
- Equalizers `ffmpeg -i .\DSCN2375.MOV -vf eq=brightness=0.5:saturation=2 -c:a copy output3.mov` see [the docs](https://ffmpeg.org/ffmpeg-filters.html#eq)
- [Picture in pictire](https://www.oodlestechnologies.com/blogs/PICTURE-IN-PICTURE-effect-using-FFMPEG/)
- [MP4 to GIF](https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality)
- Get frame count `ffmpeg -i $1 -vcodec  copy -f null /dev/null 2>&1 | grep 'frame='`
- Split video into frames `ffmpeg -i output.mp4 -f segment -segment_time 0.01 frames/%d.yuv` (Or another format)

# PowerShell

### Regex

- Regex from file `Get-Content .\regex15.txt | Select-String -Pattern "x*[#:.]y*" | Write-Host`
- Find and replace regex groups `(Get-Content .\regex25.txt) -replace '(?<a>([0-9]+))x(?<b>([0-9]+))','${a} px, ${b} px'`
  - The order of parentheses and <> and $ are very important here
  - This example takes
  ```
  1280x720
  1920x1080
  1600x900
  1280x1024
  800x600
  1024x768
  ```
  and returns
  ```
  1280 px, 720 px
  1920 px, 1080 px
  1600 px, 900 px
  1280 px, 1024 px
  800 px, 600 px
  1024 px, 768 px
  ```
- Output specific groups
```
> 'my name is "rodeo" and I like "tacos"' | Select-String -Pattern '"(.+?)"' | % {"$($_.matches.groups[0])"}

> "rodeo"
```

### File Management

- Delete files that match pattern ``Get-ChildItem | Where-Object Name -Like '*`~*' | ForEach-Object { Remove-Item -LiteralPath $_.Name }``

### Parsing

- JSON `$users = $response | ConvertFrom-Json`
- JSON and regex
```
$matches = (Get-Content -Raw -Path 'data.json' | Out-String | ConvertFrom-Json) | Where-Object { $_.id -lt 4 }
$matches | ConvertTo-Json | Out-File 'matches.json'
```

### USB Devices

- Get video sources `Get-PnpDevice -PresentOnly | Where-Object { $_.Description -match '.*(?:Video|Camera).*' }`

### Executables

- Capture output `$output = .\my.exe -f flags 2>&1 | Out-String`

# Visual Studio

- Publish NuGet `dotnet nuget push <package>.nupkg --api-key <key> --source https://api.nuget.org/v3/index.json`

# BOM

- Best wire: *Silicone Stranded Wire, Digikey: 3239-22-1-*

# Flutter

### MaterialColor from Color

```dart
extension ColorExtension on Color {
  MaterialColor get toMaterial {
    return MaterialColor(toARGB32(), {
      50: Color.lerp(this, Colors.white, 0.95)!,
      100: Color.lerp(this, Colors.white, 0.9)!,
      200: Color.lerp(this, Colors.white, 0.8)!,
      300: Color.lerp(this, Colors.white, 0.7)!,
      400: Color.lerp(this, Colors.white, 0.6)!,
      500: Color.lerp(this, Colors.white, 0.5)!,
      600: Color.lerp(this, Colors.white, 0.4)!,
      700: Color.lerp(this, Colors.white, 0.3)!,
      800: Color.lerp(this, Colors.white, 0.2)!,
      900: Color.lerp(this, Colors.white, 0.1)!,
    });
  }
}
```

### Safe Filename
```dart
String pad0(dynamic val, int number) {
  return val.toString().padLeft(number, '0');
}

extension SafeFilename on DateTime {
  String _p(int field) {
    return pad0(field, 2);
  }

  String safeFilename(String p) {
    final thisDate = DateTime.now();
    return '${p}_${thisDate.year}-${_p(thisDate.month)}-${_p(thisDate.day)}'
        '_${_p(thisDate.hour)}-${_p(thisDate.minute)}-${_p(thisDate.second)}';
  }
}

```

# [Return to Home](../index.html)
