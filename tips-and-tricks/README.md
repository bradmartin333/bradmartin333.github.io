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

### USB Devices
- Get video sources `Get-PnpDevice -PresentOnly | Where-Object { $_.Description -match '.*(?:Video|Camera).*' }`

### Executables
- Capture output `$output = .\my.exe -f flags 2>&1 | Out-String`

# ImageMagick
### GIFs
- Make `magick -delay 20 *.png movie.gif`
- Extract frames `magick mogrify -format png *.gif`
- Crop `magick input.gif -coalesce -repage 0x0 -gravity Center -crop 25% +repage output.gif`
- Spin an image `magick convert input.jpg -duplicate 23 -distort SRT %[fx:t*360/n] -set delay 10 -loop 0 output.gif`
### Filters
- Crop `magick mogrify -crop 300x300+150+150 -path ./cropped *.png`
- Grayscale `magick <img_in> -set colorspace Gray -separate -evaluate-sequence Mean <img_out>`
- Resize `magick mogrify ./ -resize 20% -quality 80  *.png`
### Other
- Make icon `magick Capture.png -define icon:auto-resize=256,64,48,32,16 capture.ico`

# Visual Studio
- Publish NuGet `dotnet nuget push <package>.nupkg --api-key <key> --source https://api.nuget.org/v3/index.json`

# FFMPEG
- Trim `ffmpeg -ss 00:07 -to 00:59 -i <input> -c:v copy -c:a copy <output>`
- Add timestamp `ffmpeg -i input.mp4 -filter:v drawtext="fontfile=/Windows/Fonts/cour.ttf:fontsize=150:fontcolor='white':box=1:boxcolor='black@0.5':boxborderw=5:timecode='00\:00\:00;00':timecode_rate=(30*1000/1001):x=(w-text_w):y=(h-text_h)" output.mp4`
- Strip audio `ffmpeg -i $input_file -c copy -an $output_file`
- Equalizers `ffmpeg -i .\DSCN2375.MOV -vf eq=brightness=0.5:saturation=2 -c:a copy output3.mov` see [the docs](https://ffmpeg.org/ffmpeg-filters.html#eq)
- [Picture in pictire](https://www.oodlestechnologies.com/blogs/PICTURE-IN-PICTURE-effect-using-FFMPEG/)
- [MP4 to GIF](https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality)

# BOM
- Best wire: *Silicone Stranded Wire, Digikey: 3239-22-1-*