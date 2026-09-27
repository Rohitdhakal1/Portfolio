# Rohit's World — Portfolio

A design-focused personal portfolio built with React 19, TypeScript, and Vite. The site blends a cosmic space aesthetic with a warm, cream-paper design system featuring custom UI primitives, interactive cards, and a token-based layout.

> **Design & Inspiration Credit:** Original portfolio design, visual aesthetics, and component concepts credit go to **Megan** ([@megan128](https://github.com/megany128/portfolio)). This repository is a React 19 + TypeScript SPA migration and customization built for my personal projects.

## Tech Stack

- **React 19** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool & dev server
- **Tailwind CSS v4** — Styling via `@tailwindcss/vite`
- **React Router DOM 7** — Client-side routing
- **Gelica & Source Code Pro** — Custom typography

## Project Status

Currently migrating from the original Astro/Cloudflare architecture to a pure React SPA using a component-by-component conversion workflow.

### Component Conversion Progress

- [x] **UI Primitives:** `Tag.tsx`, `Button.tsx`, `Logo.tsx`, `Field.tsx`
- [x] **Layout & Navigation:** `Sidebar.tsx`, `Footer.tsx`, `StatusClock.tsx`
- [ ] **Data Display & Projects:** `ProjectCard.tsx` (In Progress), `ProjectIndexCard.tsx`, `LatestLog.tsx`
- [ ] **Interactive Features:** Onboarding flow, Visitor Card, and Site Pet

## Features & Highlights

- **Design System Tokens** — Consistent styling built on custom CSS variables mapped in `tokens.css`.
- **Isolated Sandbox (`/sandbox`)** — Dedicated routing workspace for testing and previewing UI primitives without modifying live pages.
- **SPA Routing** — Client-side navigation via React Router DOM (`Link` for internal, `<a>` for external).
- **Reduced Motion Support** — Accessible fallbacks for animations based on user system preferences.

## Routing

| Path           | Component        | Description                          |
| -------------- | ---------------- | ------------------------------------ |
| `/`            | `HomePage`       | Portfolio landing page               |
| `/onboarding`  | `OnboardingPage` | Visitor onboarding flow              |
| `/sandbox`     | `Sandbox`        | Component development & test harness |

## Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Starts the Vite development server |
| `npm run build`   | Builds the app for production    |
| `npm run lint`    | Runs ESLint to check code quality |
| `npm run preview` | Previews the production build    |

## Project Structure

```text
src/
├── components/
│   ├── home/                  # Layout and card components
│   │   ├── Footer.tsx         # Color-themed interactive footer
│   │   ├── ProjectCard.tsx    # Portfolio project showcase card
│   │   └── Sidebar.tsx        # Navigation sidebar
│   ├── scenery/               # Decorative and status widgets
│   │   └── StatusClock.tsx    # Live time display widget
│   └── ui/                    # Base UI primitives
│       ├── Button.tsx         # Polymorphic button (primary/ghost/outline)
│       ├── Field.tsx          # Styled input field
│       ├── Logo.tsx           # Brand logo mark
│       └── Tag.tsx            # Accent badge tag
├── pages/
│   ├── HomePage.tsx           # Home view
│   └── OnboardingPage.tsx     # Onboarding view
├── styles/
│   ├── fonts.css              # Custom font face imports
│   ├── global.css             # Base CSS reset
│   └── tokens.css             # CSS variable design tokens
├── App.tsx                    # React Router configuration
├── Sandbox.tsx                # Isolated UI component playground
└── main.tsx                   # Vite entry point
