# GNCore website UI is frozen

Preserve the approved website theme, colors, typography, page structure, component layout, navigation, animations, and responsive breakpoints. This applies to every page.

Routine requests may update displayed release data, counts, catalog content, copy, links, and metadata. Do not redesign components or modify CSS, JavaScript behavior, branding, or the video card unless the user explicitly requests that visual change in the current task.

After a permitted data update, run `python scripts/ui_guard.py` and `git diff --check`. The guard permits text and data attribute changes while checking existing page structure and protected visual assets. Any structural or asset change needs an explicit UI request; do not bypass a failing check by silently updating the baseline.

For an explicitly authorized UI change, inspect desktop and mobile renderings first, then refresh asset cache keys with `python scripts/ui_guard.py --refresh-cache`, and record the approved result using `python scripts/ui_guard.py --write-baseline`. Review the baseline diff before committing.

The demo uses a local poster, loads YouTube only after Play, and starts at 0:00. Preserve its external YouTube fallback. Keep content-based CSS/JS cache keys on every HTML page so the live UI does not reuse stale styles.
