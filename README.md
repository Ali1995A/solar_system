# Solar System Explorer

A static interactive 3D solar system built with Three.js and vanilla JavaScript. The recommended local version consists of `index.html` and `surfaces.js`. This is the independent repository `Ali1995A/solar_system`, nested in a local `test-demo` directory.

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
- Chinese observation controls, ten-body dock, north-side view, rotation markers and axial lines
- Sidereal rotation periods and unified Earth-days-per-second simulation, independent of frame rate

## Run

Open `index.html` in a modern browser with WebGL and network access to the two CDN libraries. Keep `surfaces.js` alongside it. Static hosting must publish both files; there is no build step or terminal-dependent backend. No dependency installation is required.

## Controls

- Drag to orbit the camera
- Scroll / pinch to zoom
- Click a planet to see details
- Use the control panel to adjust simulation speed or focus a planet

## Notes

No external textures are used; textures are generated locally. Three.js and OrbitControls still require network access, so this is not an offline bundle.

All orbits are circular and coplanar with illustrative random initial phases. This is not an ephemeris, a scale model, or a map of the current sky. The constellation sketches are not astronomical coordinates. Surface illustrations are not satellite images. The Sun surface is a static illustration and does not simulate differential rotation. High time speeds can cause apparent reversed rotation through temporal aliasing.

Coordinate convention: +Y is ecliptic north. A prograde orbit uses x = r cos(theta), z = -r sin(theta); positive local Y rotation is prograde before tilt. Venus (177.4°) and Uranus (97.8°) have positive local rotation magnitudes with inverted axis projections, so no additional negative rate is applied. Moon orbit is attached to Earth's translating pivot, independent of Earth's axial tilt/spin; its rotating orbit frame keeps one lunar hemisphere Earth-facing in this simplified model.

Rotation periods use [NASA/JPL planetary physical parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html), checked 2026-09-07. The distinction between tilted rotation axes and retrograde motion is explained by [NASA's planet overview](https://pwg.gsfc.nasa.gov/stargaze/SplanetsA.htm). Other original rounded diameter, distance and orbital-period values remain illustrative approximations.

## Verification and status

Run `node tests/check.cjs`. Checks cover syntax, DOM references, direction, rates, frame independence, pause/background time, lunar hierarchy/period and Saturn's ring plane. Browser visual acceptance is pending: the available browser rejected local-file preview by policy. No online deployment was performed. See `docs/upgrade-20260907.md` and `AGENTS.md` for handoff.
