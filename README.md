# Mikinch

Personal portfolio / contact site for the Mikinch alias.

## Structure

- `index.html` — main page
- `services.html` — services
- `portfolio.html` — portfolio archive
- `about.html` — personal dossier
- `contact.html` — contact channels
- `profile.html` — compact public profile
- `style.css` — visual system
- `script.js` — interactions, terminals, boot transition
- `data/profile.js` — editable profile and contact links
- `assets/avatar/` — avatar files
- `assets/portfolio/` — portfolio media

## GitHub Pages

Repository name: `mik1nch.github.io`

GitHub:
`Settings` → `Pages` → `Deploy from a branch` → `main` → `/ (root)`.

## Profile and contacts

Edit `data/profile.js` to change the public profile text or social links.

## Avatar

Put the preferred avatar at:

`assets/avatar/mikinch-avatar.webp`

The layout contains a fallback monogram until an avatar file is present.

## Portfolio

Public portfolio is intentionally empty until projects are selected for publication.
Visitors are directed to the contact page for private examples.

## Motion

The site uses:
- fast boot transitions,
- page-to-page boot overlays,
- terminal typewriter effects,
- rare glitch bursts.

Motion is reduced automatically when the browser reports `prefers-reduced-motion`.
