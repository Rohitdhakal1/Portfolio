# Rohit's World — Portfolio

A cosmos-themed personal portfolio built with React, TypeScript, and Vite. Features an immersive starfield, shooting stars, custom cursor, interactive click-to-birth stars, and parallax text effects.

## Tech Stack

- **React 19** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool & dev server
- **Tailwind CSS v4** — Styling
- **Gelica & Source Code Pro** — Custom fonts

## Features

- **Animated Starfield** — Three-layer rotating starfield with twinkling stars
- **Shooting Stars** — Periodic shooting star animations across the sky
- **Interactive Stars** — Click anywhere to birth new stars with ripple pulse effects
- **Custom Cursor** — Animated cursor that reacts to hoverable elements
- **Parallax Text** — Title and quote words respond to pointer proximity
- **Live Clock** — Real-time clock displayed in the corner
- **Reduced Motion** — Full accessibility support for motion preferences
- **Scalable Architecture** — Structured for multi-page expansion with dedicated `pages/` and `components/` directories

## Scripts

| Command       | Description                     |
| ------------- | ------------------------------- |
| `npm run dev`      | Start development server        |
| `npm run build`    | Build for production            |
| `npm run lint`     | Run ESLint                      |
| `npm run preview`  | Preview production build        |

## Project Structure

```
src/
├── components/
│   ├── welcome/                 # Shared welcome/landing components
│   │   ├── Starfield.tsx        # Three-layer animated starfield
│   │   ├── ShootingStars.tsx    # Shooting star animations
│   │   ├── WelcomeHero.tsx      # Hero section with parallax text
│   │   └── WelcomeCursor.tsx    # Custom animated cursor
│   └── <shared>/                # Reusable components across pages
├── pages/
│   ├── HomePage.tsx             # Landing / welcome page
│   └── <new-page>.tsx           # Future pages
├── App.tsx                      # Root component (router entry)
├── main.tsx                     # Entry point
└── index.css                    # Global styles, theme variables, animations
```

The `App.tsx` currently renders `HomePage` directly. Future pages will be added
under `src/pages/` and wired in via a router (e.g. React Router) at
`src/App.tsx`. Shared UI lives under `src/components/` and is organized by
domain (e.g. `welcome/`).

## Design Tokens

The project uses CSS custom properties for theming, organized in `src/index.css`:

| Variable              | Value      | Usage             |
| --------------------- | ---------- | ----------------- |
| `--color-cosmos`      | `#242424`  | Primary background |
| `--color-ink`         | `#242424`  | Dark text          |
| `--color-ink-inverted`| `#ffffff`  | Light text         |
| `--color-ink-mute`    | `#a2a2a2`  | Muted text         |
| `--color-pink`        | `#bf5a7a`  | Accent             |
| `--color-teal`        | `#168b9d`  | Accent             |
| `--color-orange`      | `#cb7836`  | Accent             |

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)

Supports `prefers-reduced-motion` for users who prefer minimal animation.
