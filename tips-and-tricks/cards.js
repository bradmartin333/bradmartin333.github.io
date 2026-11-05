/*
  Tips & Tricks cards
  ===================
  Copy one of these into CARDS below. The order in this file is the order in the carousel.

  { id: 'short-id', type: 'snippet', title: 'What it does',
    lang: 'bash', note: 'optional line under the code',
    code: code`
      paste the snippet here
    ` },

  { id: 'short-id', type: 'site', title: 'Name',
    url: 'https://example.com/', blurb: 'Why it is worth a bookmark' },

  { id: 'short-id', type: 'insight', title: 'The lesson', topic: 'optional tag',
    body: 'A sentence or two.',
    steps: ['optional', 'numbered', 'steps'],
    code: code`optional snippet`,
    url: 'https://optional.link/', linkText: 'optional label' },

  Inside code`...`
    - backslashes are literal and the common indentation is trimmed
    - only two things need escaping: a backtick -> \`  and  ${ -> \${
  In text fields (note, blurb, body, steps), `backticks` render as inline code.
  The id is the share link: tips-and-tricks/#short-id
*/

function code(strings) {
  const lines = strings.raw[0]
    .replace(/\\(`|\$\{)/g, '$1')
    .replace(/^[ \t]*\n/, '')
    .replace(/\s+$/, '')
    .split('\n');
  const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^[ \t]*/)[0].length));
  return lines.map(l => l.slice(indent)).join('\n');
}

const CARDS = [
  {
    id: 'numbat', type: 'site', title: 'numbat', url: 'https://numbat.dev/',
    blurb: 'High precision scientific calculator with full support for physical units.',
  },
  {
    id: 'gif-make', type: 'snippet', title: 'PNGs to GIF', lang: 'imagemagick',
    code: code`magick -delay 20 *.png movie.gif`,
  },
  {
    id: 'script-dir', type: 'snippet', title: 'cd to the script\'s folder', lang: 'bash',
    note: 'Only changes directory if you are not already there.',
    code: code`
      #!/bin/bash

      SCRIPT_DIR=$(cd -- "$(dirname -- "\${BASH_SOURCE[0]}")" &>/dev/null && pwd)
      if [[ $SCRIPT_DIR != $(pwd) ]]; then cd $SCRIPT_DIR; fi
    `,
  },
  {
    id: 'typst', type: 'site', title: 'typst', url: 'https://typst.app/',
    blurb: 'Like Overleaf, but with optimizations and built with Rust. My CV is written in it.',
  },
  {
    id: 'ffmpeg-trim', type: 'snippet', title: 'Trim a video', lang: 'ffmpeg',
    note: 'Stream copy, so no re-encode.',
    code: code`ffmpeg -ss 00:07 -to 00:59 -i <input> -c:v copy -c:a copy <output>`,
  },
  {
    id: 'quiet-server', type: 'snippet', title: 'Quietly serve a folder', lang: 'bash',
    code: code`nohup python3 -m http.server 8080 --directory webpages > server.log 2>&1 &`,
  },
  {
    id: 'iwanthue', type: 'site', title: 'iwanthue', url: 'https://medialab.github.io/iwanthue/',
    blurb: 'Generate and refine palettes of optimally distinct colors.',
  },
  {
    id: 'socat-proxy', type: 'insight', title: 'Reach hardware behind another PC', topic: 'docker',
    body: 'Networked hardware plugged into a remote machine (like a DCS-100E light controller with a web page on port 80) can be exposed with one tiny socat container per port.',
    steps: [
      'SSH into the machine the controller is connected to',
      'Run the container below (repeat for any other port)',
      'Open `HOST_IP:1234` from your own machine',
    ],
    code: code`sudo docker run -d --name dcs-controller-proxy -p 1234:1234 --restart unless-stopped alpine/socat tcp-listen:1234,fork,reuseaddr tcp-connect:192.168.0.1:80`,
    url: 'https://pypi.org/project/pydcscontrol/', linkText: 'pydcscontrol ↗',
  },
  {
    id: 'gif-spin', type: 'snippet', title: 'Spin an image into a GIF', lang: 'imagemagick',
    code: code`magick convert input.jpg -duplicate 23 -distort SRT %[fx:t*360/n] -set delay 10 -loop 0 output.gif`,
  },
  {
    id: 'tldraw', type: 'site', title: 'tldraw', url: 'https://www.tldraw.com/',
    blurb: 'Collaborative whiteboard app.',
  },
  {
    id: 'tree', type: 'snippet', title: 'tree, without tree', lang: 'bash',
    code: code`find . -print | sed -e 's;[^/]*/;|--;g;s;--|; |;g' | tee tree_output.txt`,
  },
  {
    id: 'image2cpp', type: 'site', title: 'image2cpp', url: 'https://javl.github.io/image2cpp/',
    blurb: 'Convert images to byte arrays for microcontrollers and LED matrices.',
  },
  {
    id: 'best-wire', type: 'insight', title: 'The best wire', topic: 'bom',
    body: 'Silicone stranded wire. Digikey `3239-22-1-*`',
  },
  {
    id: 'gif-compress', type: 'snippet', title: 'Compress a GIF', lang: 'imagemagick',
    code: code`magick mogrify -layers 'optimize' -fuzz 7% movie.gif`,
  },
  {
    id: 'screentogif', type: 'site', title: 'ScreenToGif', url: 'https://www.screentogif.com/',
    blurb: 'Screen, webcam and sketchboard recorder with an integrated editor.',
  },
  {
    id: 'ffmpeg-audio', type: 'snippet', title: 'Extract the audio', lang: 'ffmpeg',
    code: code`ffmpeg -i input_file.mp4 -q:a 0 -map a output_file.mp3`,
  },
];
