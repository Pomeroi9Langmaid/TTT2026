TTT2026 v24 global full-width fix

Upload all files over the repo root.

This applies a hard full-width override to every HTML page in the package, including:
- homepage
- main solution pages
- EntryDocs detailed overview
- other overview/detail pages if present in the package

It removes/replaces max-width and min(...) wrapper restrictions that were making pages narrow again.
