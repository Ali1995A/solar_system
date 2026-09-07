# Solar System Explorer

A static interactive 3D solar system built with Three.js and vanilla JavaScript. The recommended version consists of `index.html`, `surfaces.js` and `eclipses.js`. This is the independent repository `Ali1995A/solar_system`, nested in a local `test-demo` directory.

## Features

- 8 planets with illustrative enlarged sizes and log-scaled orbital distances
- Sun glow with emissive material + point light
- Planet axial tilt, rotation, and orbit animation
- Saturn rings and Earth moon
- Click to open a planet info card
- Time speed slider and pause/play
- Camera focus selector + OrbitControls
- Starfield background and subtle fog
- Responsive layout optimized for desktop and iPhone/iPad
- Procedural illustrative surfaces: terrestrial planets, gas bands, Jupiter storm, solar granulation-like detail
- Chinese observation controls, ten-body dock, north-side view, optional rotation markers and axial lines (off by default)
- Sidereal rotation periods and unified Earth-days-per-second simulation, independent of frame rate

## Run

Open `index.html` in a modern browser with WebGL and network access to the two CDN libraries. Keep `surfaces.js` and `eclipses.js` alongside it. Static hosting must publish all three files; there is no build step or terminal-dependent backend. No dependency installation is required.

## Controls

- Drag to orbit the camera
- Scroll / pinch to zoom
- Click a planet to see details
- Use the control panel to adjust simulation speed or focus a planet

## Notes

Earth, Moon and Jupiter use bundled NASA observation-based global composites in assets/. Other surfaces are generated locally. Publish the assets directory with the three application files. Three.js and OrbitControls still require network access, so this is not an offline bundle.

Planetary orbits are circular and coplanar with illustrative random initial phases; the Moon orbit is tilted approximately 5.145 degrees except during aligned demonstrations. This is not an ephemeris, a scale model, or a map of the current sky. The constellation sketches are not astronomical coordinates. Except for Earth, surface illustrations are not satellite images. The Sun surface is a static illustration and does not simulate differential rotation. High time speeds can cause apparent reversed rotation through temporal aliasing.

Coordinate convention: +Y is ecliptic north. A prograde orbit uses x = r cos(theta), z = -r sin(theta); positive local Y rotation is prograde before tilt. Venus (177.4°) and Uranus (97.8°) have positive local rotation magnitudes with inverted axis projections, so no additional negative rate is applied. Moon orbit is attached to Earth's translating pivot, independent of Earth's axial tilt/spin; its rotating orbit frame keeps one lunar hemisphere Earth-facing in this simplified model.

Rotation periods use [NASA/JPL planetary physical parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html), checked 2026-09-07. The distinction between tilted rotation axes and retrograde motion is explained by [NASA's planet overview](https://pwg.gsfc.nasa.gov/stargaze/SplanetsA.htm). Other original rounded diameter, distance and orbital-period values remain illustrative approximations.

## Verification and status

Run `node tests/check.cjs`. Checks cover syntax, DOM references, direction, rates, frame independence, pause/background time, lunar hierarchy/period and Saturn's ring plane. Browser visual acceptance is pending: the available browser rejected local-file preview by policy. No online deployment was performed. See `docs/upgrade-20260907.md` and `AGENTS.md` for handoff.

## Material refinement (2026-09-07)

The persistent white surface dot was a teaching marker, not a city, specular glint, or astronomical feature. It and the axial guides are now off by default; enable them with the teaching-aids switch.

Earth uses NASA's cloud-free July 2004 composite, Moon uses NASA/LRO's WAC color mosaic, and Jupiter uses NASA/Hubble's global color map. Their fictional procedural surface maps are disabled. Other bodies retain procedural materials, rock relief, softened craters, gas bands, Saturn ring texture and the Sun's granular appearance with soft corona.

`tests/surfaces.cjs` uses the existing bundled `@napi-rs/canvas` (resolve via NODE_PATH) to test procedural texture generators, map dimensions/variation, ring gap and corona center. NASA Earth/Moon/Jupiter assets are checked separately. An optional output-path argument writes a CPU material preview; this is not WebGL rendering or browser interaction validation. Do not install packages to run it. See assets/README.md for NASA source, credit and SHA256.

## Eclipse demonstrations

Use 演示日食 / 演示月食 for automatic alignment and close-up camera positioning. Each opens at mid-eclipse; drag the progress slider or use 播放过程 for a 24-second illustrative passage. 恢复运行 restores the previous orbit position, Moon inclination/distance, camera, focus and pause state. Selecting another body or overview exits the demo.

`eclipses.js` computes finite solar-disk occultation at each receiving surface point using apparent angular radii and circle-overlap area. Earth receives the lunar shadow; the Moon receives Earth's shadow, with dark red tint illustrating atmospheric refraction (not a radiative-transfer simulation). It is an analytic shadow overlay, not a point-source shadow map or a prepainted dark spot. Earth/Moon diameter ratio uses the existing diameter data; demo distance and orbital plane are temporarily changed for clear totality. This exaggerated scene does not reproduce real eclipse frequency, duration, path or date.

Reference: [NASA eclipse geometry](https://science.nasa.gov/eclipses/geometry/) and [NASA Moon eclipses](https://science.nasa.gov/moon/eclipses/), checked 2026-09-07. Run `node tests/eclipses.cjs` for overlap, alignment, totality proportions, playback and restoration checks. GPU shader compilation and browser visual acceptance remain pending.
