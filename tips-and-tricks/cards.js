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
    id: 'git-settings', type: 'insight', title: 'Two git settings worth turning on', topic: 'git',
    body: '`push.autoSetupRemote` makes the first push of a new branch just work, no `--set-upstream`. `fetch.prune` drops remote-tracking branches that were deleted upstream on every fetch.',
    code: code`
      git config --global push.autoSetupRemote true
      git config --global fetch.prune true
    `,
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
    id: 'git-gone', type: 'snippet', title: 'Clean up merged branches', lang: 'git',
    note: 'Deletes local branches whose remote is gone, e.g. after a PR merges. Uses `-d`, so anything unmerged is kept. Saved as `git gone` in my gitconfig.',
    code: code`git checkout main && git pull --prune && git branch -vv | awk '/: gone]/{print $1}' | xargs -r git branch -d`,
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
    id: 'wiz', type: 'insight', title: 'Control WiZ bulbs from the terminal', topic: 'smart home',
    body: 'WiZ bulbs listen for JSON on UDP port 38899, so a broadcast on the local network is enough. No app or account needed. Usage: `wiz on 60 2700` (brightness, colour temperature) or `wiz off`.',
    code: code`
      wiz() {
        local payload
        case "$1" in
          on)
            local dimming="\${2:-50}"
            local temp="\${3:-3000}"
            if (( dimming < 10 || dimming > 100 )); then
              echo "Brightness must be 10-100"; return 1
            fi
            if (( temp < 2200 || temp > 6500 )); then
              echo "Temp must be 2200-6500K"; return 1
            fi
            payload="{\"method\":\"setPilot\",\"params\":{\"state\":true,\"temp\":$temp,\"dimming\":$dimming}}"
            ;;
          off)
            payload='{"method":"setPilot","params":{"state":false}}'
            ;;
          *)
            echo "Usage: wiz on [brightness 10-100] [temp 2200-6500] | wiz off"
            return 1
            ;;
        esac
        python3 -c "
      import socket
      s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
      s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
      s.sendto('$payload'.encode(), ('255.255.255.255', 38899))
      s.close()
      "
      }
    `,
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
  {
    id: 'ssh-prompt', type: 'snippet', title: 'A prompt that knows where it is', lang: 'zsh',
    note: 'Shows the git branch, and the path turns cyan over SSH so you always know which machine you are typing into.',
    code: code`
      parse_git_branch() {
        git branch 2> /dev/null | sed -n -e 's/^\* \(.*\)/(\1)/p'
      }
      setopt PROMPT_SUBST
      # magenta path locally, cyan over ssh
      if [[ -n $SSH_CONNECTION ]]; then PROMPT_COLOR=cyan; else PROMPT_COLOR=magenta; fi
      export PROMPT='%F{$PROMPT_COLOR}%~%f %F{green}$(parse_git_branch)%f $ '
    `,
  },
  {
    id: 'etymonline', type: 'site', title: 'Etymonline', url: 'https://www.etymonline.com/',
    blurb: 'Online etymology dictionary.',
  },
  {
    id: 'nato-alphabet', type: 'insight', title: 'NATO phonetic alphabet', topic: 'reference',
    code: code`
      A  Alfa      N  November
      B  Bravo     O  Oscar
      C  Charlie   P  Papa
      D  Delta     Q  Quebec
      E  Echo      R  Romeo
      F  Foxtrot   S  Sierra
      G  Golf      T  Tango
      H  Hotel     U  Uniform
      I  India     V  Victor
      J  Juliett   W  Whiskey
      K  Kilo      X  X-ray
      L  Lima      Y  Yankee
      M  Mike      Z  Zulu
    `,
  },
];
