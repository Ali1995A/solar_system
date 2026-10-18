# Mobile overlay correction

## Cause and scope

The control panel, eclipse panel, information card, dock and load-status message were independently positioned. At 375×667 the Earth card ended at y=474 while the eclipse panel began at y=431; the persistent texture warning at y=280 covered the card. Expanded observation controls also extended into the eclipse panel. Later responsive rules replaced the earlier safe-area offsets, and landscape phones wider than 768px used the desktop positioning.

The original local repository is `D:\Soft\MyCode\test-demo\solar-system`, remote `Ali1995A/solar_system`, clean at `8d901405e7e3fb4152b3c9a1125de4c002237be4`. It was found using the repository's nested-location handoff. It remains untouched. Work uses a separate worktree on `codex/solar-mobile-layout-20261017` based on that production commit. No repository `.agents/skills` directory was present; AGENTS.md, README and the relevant upgrade reports were read.

## Changes

- Add `mobile.css`, required in static deployments. Compact controls and eclipse demonstrations share a bounded scroll container above the dock.
- Keep the initial compact panel collapsed. Details and the controls sheet are mutually exclusive; switching bodies resets details scroll. Existing coarse-pointer defaults remain supported.
- Use `viewport-fit=cover`, four safe-area offsets and dynamic viewport height, with a viewport-height fallback. Handle short landscape layouts up to 1000px wide.
- Keep all ten bodies available in the horizontal dock. Use an always-reachable sticky close button and bounded scrolling for long information cards.
- Keep texture/load warnings inside the controls rather than across the middle of the scene. A lost WebGL context opens the controls so the fatal message is visible.
- Preserve orbital math, eclipse simulation, assets, external texture URLs, all feature controls and desktop panel placement. No authentication or new dependency.

## Verification

Local user Chrome (LEO profile), browser viewport overrides:

| Portrait | Landscape |
| --- | --- |
| 320×568 | 568×320 |
| 375×667 | 667×375 |
| 390×844 | 844×390 |
| 430×932 | 932×430 |

At all eight sizes, both controls and Earth details were checked: no document horizontal overflow, no sheet/card overlap with the dock, and the close button was hit-testable. The dock horizontally scrolls intentionally. All ten body selections were exercised at 568×320 and updated the selected body and heading while closing controls.

Additional checks: solar demonstration, lunar demonstration and restore; 1280×800 desktop WebGL initialization and original panel placement; scroll to the end of the compact control sheet and short landscape details, with close still reachable. Nonzero safe-area stress fixture at 320×568 used top/right/left=44px and bottom=34px. This fixture is local test infrastructure, not production application code. Twenty recorded layout states and ten body selections passed geometric assertions.

`node tests/check.cjs`, `node tests/eclipses.cjs` and `git diff --check` passed. These cover existing simulation behavior and source/DOM consistency in addition to the browser layout checks. No packages were installed. Material generation was not changed; its canvas-dependent test was not rerun.

## Limits and delivery

Viewport overrides and injected safe-area CSS values in desktop Chrome are simulations, not real iPhone/Safari verification. iOS browser chrome, touch scrolling and actual notch/home-indicator behavior still need a physical-device acceptance pass. Existing external NASA rocky-planet texture loading can fail and use procedural fallback; that unrelated network/texture issue was reproduced before this change and remains outside scope.

This branch is for a draft PR/preview only. Production merge and release require the user's separate approval. The previous six-site release approval does not apply here.
