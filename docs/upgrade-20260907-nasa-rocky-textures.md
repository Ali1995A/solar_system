# NASA rocky-planet texture upgrade — 2026-09-07

## Scope

Replaced the procedural surface fallback for Mercury, Venus, and Mars with official NASA/JPL Solar System Simulator global maps. Earth, Moon, and Jupiter remain on their existing local NASA observation assets.

## Implementation

- `index.html`: added NASA/JPL texture URLs for Mercury, Venus, and Mars; enabled cross-origin loading for remote textures.
- `assets/README.md`: recorded source pages, exact runtime URLs, provenance, and Venus radar-color caveat.

## Verification

- `node tests/check.cjs`: passed.
- `node tests/eclipses.cjs`: passed.
- `node tests/surfaces.cjs`: blocked by the existing unavailable `@napi-rs/canvas` runtime; no dependency was installed.
- `git diff --check`: passed.
- Browser visual verification: pending.

## Delivery status

Local code changes are complete. No commit or push was performed in this turn.
