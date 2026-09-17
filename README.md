# MIKINCH — Personal Digital Node

Static personal site for GitHub Pages.

## Structure

```
index.html          Home
services.html       Services
portfolio.html      Works (archive locked)
about.html          Dossier
contact.html        Channels
profile.html        Short profile
style.css           Styles
script.js           Boot, terminals, glitch, nav
data/profile.js     Profile data
assets/avatar/      Avatar image (optional)
assets/portfolio/   Portfolio assets (optional)
```

## Deploy

Push to `main` (or `gh-pages`) branch of repository `mik1nch/mik1nch.github.io`.

GitHub Pages will serve from the root.

## Local preview

Open `index.html` in a browser, or use any static server:

```bash
npx serve .
# or
python -m http.server 8080
```

## Notes

- No build step. Vanilla HTML / CSS / JS.
- Avatar: place `assets/avatar/avatar.png`. Missing image shows fallback.
- `prefers-reduced-motion` is respected.
- All profile/contact data lives in `data/profile.js`.
