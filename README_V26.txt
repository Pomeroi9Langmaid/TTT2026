TTT2026 v26 TravelAble overview route/cache fix

Upload all files over the repo root.

Why v25 may not have appeared:
- the live site was still loading travelable.html with an old cache query from index.html
- one of the buttons may have been pointing at an older/detail filename

This package:
- forces index.html to load travelable.html?v=26
- forces TravelAble detail CTA links to travelable-overview.html?v=26
- includes duplicate alias files for likely old route names so whichever route is called shows the new redesign
- includes marker TRAVELABLE_OVERVIEW_REDESIGN_V26_MARKER in the overview source for quick verification
