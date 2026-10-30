# Approved UI baseline

The existing GNCore palette, fonts, page templates, navigation, and responsive layout are frozen. The final demo card has short text on the left, a compact poster/player on the right, and a stacked mobile layout. Playback starts at 0:00 after the visitor presses Play.

## Enforcement

`python scripts/ui_guard.py` compares protected visual assets and the HTML structure of every baseline page with `ui-baseline.json`. GitHub Actions runs the same check on pushes and pull requests. Text, metadata content, links, counts, and catalog JSON can change without changing the baseline.

The baseline protects page element order, CSS classes, IDs, roles, inline presentation attributes, stylesheet/script paths, and visual asset hashes. Adding/removing page elements or changing behavior/styles requires an explicit UI request and a reviewed baseline refresh. This is a repository check, not a filesystem lock or a guarantee of identical output in every browser. Repository owners can still change or remove the guard.

## Release workflow

1. Update requested data and copy.
2. Run `python scripts/ui_guard.py` and `git diff --check`.
3. Push and verify the production response contains the intended change.

For an explicitly requested visual change, inspect the result on desktop and mobile, run `python scripts/ui_guard.py --refresh-cache`, then `python scripts/ui_guard.py --write-baseline`. Review and commit that intentional baseline update together with the UI changes.
