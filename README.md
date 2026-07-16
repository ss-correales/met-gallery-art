# MET Gallery Art

An immersive art browsing experience built with the [Metropolitan Museum of Art public API](https://metmuseum.github.io/). No API key required.

## Live Demo

[ss-correales.github.io/met-gallery-art](https://ss-correales.github.io/met-gallery-art/)

## What it does

- Loads a random artwork on entry for a contemplative, museum-like experience
- Browse artworks by department through a collapsible sidebar
- Each department has its own color atmosphere
- Thumbnail grid with a blur/reveal hover effect to build curiosity before starting the exhibition

## Technical decisions worth noting

- **Fisher-Yates shuffle** to randomize artwork selection without repetition
- **Sequential retry pattern** — shuffles the ID list once, then walks it in order rather than picking randomly each time, guaranteeing no repeated requests
- **Request throttling** — 200ms delay between API calls to avoid rate limiting (the MET API returns 403 on rapid sequential requests)
- **Two distinct views** — department grid vs. single artwork exhibition, each with its own UX intent

## Tech stack

HTML · CSS · Vanilla JavaScript

## Status

Work in progress — UI refinements and animations pending.
