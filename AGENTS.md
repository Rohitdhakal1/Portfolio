# AGENTS.md — Rohit's World

## Stack
- React 19 + TypeScript (Vite)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router DOM 7

## Execution & Model Preferences
- Default Model: Gemini 3.8 Flash (Low Reasoning)
- Task Execution: Single-file edits ONLY. Never scan entire directories.
- Clear workspace context (`/clear`) after completing individual component tasks.

## Rules & Priorities
- Focus ONLY on Megan's actual component structure (`ui/`, `home/`, `casestudy/`).
- Do NOT invent or build generic web components (like Navbar, Footer, or Contact forms) that do not exist in the original repository.
- Do NOT edit or expand Web Audio API files (`sunrise-sound.ts`, `wallet-sound.ts`).
- Do NOT edit complex canvas signature pads until the main UI primitives are stable.
- Work on ONE component file at a time inside `Sandbox.tsx`.

## CSS & Styling Architecture
- Design tokens are defined in `src/styles/tokens.css` inside Tailwind v4 `@theme`.
- Fonts are defined in `src/styles/fonts.css` and applied via `global.css`.
- Styling Rule: Use `@theme` generated Tailwind v4 utilities (e.g., `bg-[var(--color-bg-neutral-2)]`, `text-ink-dim`, `font-mono`, `font-display`).
- Do NOT use arbitrary hardcoded hex colors (e.g. `#ffffff` or `#bf5a7a`)—always reference custom properties from `tokens.css`.