#import "@preview/acorn-resume:0.1.0": *

#let name = "Brad Martin"
#let email = "bradmartin333@gmail.com"
#let linkedin = "https://www.linkedin.com/in/bradmartin333/"
#let personal-site = "https://bradmartin333.github.io/"

#show: resume.with(
  author: name,
  margin: (
    x: 1.5cm,
    y: 1.5cm,
  ),
  font: "Libertinus Serif",
  font-size: 11pt,
  link-style: (
    underline: true,
    color: black,
  )
)

#header(
  name: name,
  contacts: (
   ("mailto:" + email, email),
   (linkedin, linkedin),
   (personal-site, personal-site),
  )
)

== Experience
#exp(
  role: "Software Engineer",
  date: "2024 - Present",
  organization: "Advanced Electronic Designs",
  location: "Bozeman, MT",
  details: [
    - Developing robust software for the Las Vegas Sphere's Big Sky Camera system
    - Designed a modular architecture for embedded Linux management, networking and package deployment
    - Optimize the NVIDIA Jetson hardware encoding process and take advantage of the .h265 specification
  ]
)

#exp(
  role: "Research Engineer",
  date: "2023 - 2024",
  organization: "Teledyne Scientific",
  location: "Research Triangle Park, NC",
  details: [
    - Led front-end development for military and research applications
    - Redesign of mobile apps that interact with BLE wearables for 25 channel EEG-based biometrics
    - Distributed UIs for processing multiple 250 Hz data streams using WebSockets, MQTT and Kafka
  ],
)

#exp(
  role: "Systems Engineer",
  date: "2022 - 2023",
  organization: "Parata Systems",
  location: "Durham, NC",
  details: [
    - Responsible for PLC development of international pharmaceutical vision inspection systems
    - Integrated firmware and software to incorporate new tooling into existing systems
    - Enhanced motion control and data communications for robotic tooling
  ],
)

#exp(
  role: "Systems Engineer",
  date: "2020 - 2022",
  organization: "X Display Company",
  location: "Durham, NC",
  details: [
    - Identified and solve customer problems regarding micro transfer printing hardware and software
    - Optimized control of 9 axis micron-accurate CNC for use in large-scale semiconductor facilities
    - Controlled international release documentation and templates
  ],
)

#exp(
  role: "Engineer",
  date: "2019 - 2020",
  organization: "Hi Fidelity Genetics",
  location: "Durham, NC",
  details: [
    - Large-scale deployment of agricultural environmental sensors for 24/7 monitoring
    - Created asset tracking tools for warehouse management and field deployments
    - Succeeded in RF optimization for 200 device deployments on ISM band
  ],
)

#exp(
  role: "Electronics Process Engineer",
  date: "2017 - 2019",
  organization: "Wavelength Electronics",
  location: "Bozeman, MT",
  details: [
    - Responsible for selective and wave soldering meeting 99% accuracy
    - Rework of surface mount parts SMD 0201 and larger
    - Performed assembly and test adhering to IPC standards
  ],
)

== Skills
#pad(
  top: 0.15em,
  [
    *Languages:* C++, C\#, Python, Shell, JavaScript, Rust, Dart \
    *Frameworks/Libraries:* FFmpeg, Shared Memory IPC, NVENC, LVGL, .NET, Flutter \
    *Tools/Databases/Platforms:* Git, CI/CD, CMake, PostgreSQL, MCP, Typst/LaTeX, Onshape, Scrum \
  ]
)

== Education

#edu(
  degree: "Bachelor of Science in Marine & Atmospheric Science",
  date: "2013 - 2017",
  institution: "University of Miami | Marine Science / Chemistry Major | 3D Fine Art / Business Minor\nChemistry Courses: Organic, Structural, Analytical and Physical",
  location: "Coral Gables, FL",
)
