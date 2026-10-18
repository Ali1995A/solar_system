# Mobile layout and one-tap teaching hints

## Cause and scope

The control panel, eclipse panel, information card, dock and load-status message were independently positioned. At 375×667 the Earth card ended at y=474 while the eclipse panel began at y=431; the persistent texture warning at y=280 covered the card. Expanded observation controls also extended into the eclipse panel. Later responsive rules replaced the earlier safe-area offsets, and landscape phones wider than 768px used the desktop positioning.

The original local repository is `D:\Soft\MyCode\test-demo\solar-system`, remote `Ali1995A/solar_system`, clean at `8d901405e7e3fb4152b3c9a1125de4c002237be4`. It was found using the repository's nested-location handoff. It remains untouched. Work uses a separate worktree on `codex/solar-mobile-layout-20261017` based on that production commit. No repository `.agents/skills` directory was present; AGENTS.md, README and the relevant upgrade reports were read.

## Changes

- Add `mobile.css`, required in static deployments. Compact controls and eclipse demonstrations share a bounded scroll container above the dock.
- Start with a clear scene on every screen. One tap on a body opens its existing key fact in Chinese, above an optional `更多数据` disclosure. Repeated selection keeps the card open; switching bodies resets the disclosure and scroll position.
- Put `日月食` in the main toolbar with a short explanation and the existing demonstration controls. Keep advanced settings and the preserved north-view action under `更多控制`. Only one of facts, eclipse controls or advanced controls is visible at a time.
- A canvas tap on empty space closes the current panel; dragging still rotates the scene. The dismiss handler is canvas-only, so dock clicks cannot immediately dismiss their own card. Rotation/resizing preserves the open/closed state.
- Use `viewport-fit=cover`, four safe-area offsets and dynamic viewport height, with a viewport-height fallback. Handle short landscape layouts up to 1000px wide.
- Keep all ten bodies available in the horizontal dock. A sticky title bar keeps the 44px close target reachable without covering data text; long cards have bounded scrolling.
- Keep texture/load warnings inside the controls rather than across the middle of the scene. A lost WebGL context opens the controls so the fatal message is visible.
- Preserve orbital math, eclipse simulation, assets, external texture URLs and all feature controls. No authentication or new dependency.

## Verification

Local user Chrome (LEO profile), browser viewport overrides:

| Portrait | Landscape |
| --- | --- |
| 320×568 | 568×320 |
| 375×667 | 667×375 |
| 390×844 | 844×390 |
| 430×932 | 932×430 |

At all eight sizes, Earth facts, eclipse controls and advanced controls were checked: no document horizontal overflow or sheet/card overlap with the dock. After the final sticky-header adjustment, Earth facts were rechecked at all eight sizes: the entire key sentence was visible and the close button hit-testable. The dock horizontally scrolls intentionally. All ten body selections showed the correct Chinese heading and existing fact at 390×844, with optional data collapsed. The first layout pass also exercised all ten at 568×320.

Additional checks: repeated Earth selection; expanded data followed by switching to Moon; close button; blank-canvas dismissal without opening controls; drag without dismissal; solar demonstration, lunar demonstration and restore; retained advanced controls; 1280×800 desktop fact display. Short landscape Sun details were scrolled to the end, with the title/close bar remaining visible above the last data row. Nonzero safe-area stress fixture at 320×568 used top/right/left=44px and bottom=34px. This fixture is local test infrastructure, not production application code. The initial layout records and the later teaching-interaction records are kept separately in the task workspace.

`node tests/check.cjs`, `node tests/eclipses.cjs` and `git diff --check` passed. These cover existing simulation behavior and source/DOM consistency in addition to the browser layout checks. No packages were installed. Material generation was not changed; its canvas-dependent test was not rerun.

## Limits and delivery

Viewport overrides and injected safe-area CSS values in desktop Chrome are simulations, not real iPhone/Safari verification. iOS browser chrome, touch scrolling and actual notch/home-indicator behavior still need a physical-device acceptance pass. Existing external NASA rocky-planet texture loading can fail and use procedural fallback; that unrelated network/texture issue was reproduced before this change and remains outside scope.

This branch is for a draft PR/preview only. Production merge and release require the user's separate approval. The previous six-site release approval does not apply here.
