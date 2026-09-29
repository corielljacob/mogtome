# MogTome Frontend

The website for the MogTome FFXIV Free Company. React + TypeScript, frontend
only. The backend lives in its own repo and is already running at
`api.mogtome.com`, so you can clone this, install, and run with nothing else to
set up.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

That's it. The dev server quietly forwards API and realtime calls to the live
backend, so there's no server to spin up locally. Build for production with
`npm run build` (output lands in `dist/`). Needs Node 20.19+.

## Stack

React 19, Vite 7, TypeScript, Tailwind 4, [`motion`](https://motion.dev) for
animation, TanStack Query for data fetching, React Router, and SignalR for the
live Chronicle feed. Tests run on Vitest + Testing Library.

## Scripts

| Script                  | What it does                          |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Dev server on port 3000               |
| `npm run build`         | Type-check and build into `dist/`     |
| `npm run preview`       | Serve the built `dist/` locally       |
| `npm run lint`          | ESLint                                |
| `npm run format`        | Prettier (run this before committing) |
| `npm run test`          | Vitest in watch mode                  |
| `npm run test:run`      | Run the tests once                    |
| `npm run test:coverage` | Tests with a coverage report          |

## How it's laid out

Grouped by feature instead of by file type, so each part of the site mostly
lives in one folder.

```
src/
  app/       the shell: App, routing, nav, route guards
  shared/    stuff used all over: ui kit, hooks, api client, theme, contexts...
  features/  one folder per area of the site
             home, members, chronicle, about, settings,
             profile, auth, knights, characterMapping, debug
```

A few habits the code follows (nothing strict, just keeps things tidy):

- Follow [COPY_STYLE.md](COPY_STYLE.md) for user-facing wording.
- `@/` is an alias for `src/`, so imports read `@/shared/ui/Button` instead of
  `../../../`.
- No barrel/index files; import straight from the file you want.
- Roughly: if only one feature uses something it lives in that feature; if lots
  of them do, it goes in `shared/`.
- There's a lint rule so `shared/` doesn't accidentally reach into a feature.
  If `npm run lint` complains about that, that's why.

## Search and scrolling conventions

- The document is the main scroller. Titles, introductions, decorative cards,
  and results scroll together; compact browsing controls stay visible within
  their section. Toolbars taller than 40% of the viewport scroll normally.
- Members and Chronicle use live search with a short debounce; Enter applies
  immediately. Smaller local lists filter immediately. Clear and Escape keep
  focus in the search field and preserve other filters.
- New filters reveal the start of obscured results. Pagination reveals the
  requested page or new entries. Neither action moves keyboard focus out of
  search. Reapplying an equivalent member search keeps the current page.
- Settings and dashboard tabs reveal a newly selected panel when its start is
  offscreen, while keeping focus on the tab. Back to top respects reduced motion
  and returns keyboard focus to the main content.
- Use `useStickyToolbar` for measured scroll clearance; avoid fixed offsets
  that break with wrapped controls or larger text. Chronicle's desktop day index
  sits below search; its mobile day chooser scrolls with the page. Character
  linking uses separate comparison lists on desktop and one outer scroller on
  phones.

## Backend

There isn't one in here anymore. The app talks to `api.mogtome.com` (REST at
`/api`, realtime websocket at `/eventsHub`), and `vite.config.ts` proxies both
in dev. The old .NET backend that used to live here is gone, but it's tucked
away under the git tag `archive/dotnet-backend` if anyone ever wants it.

## Deploy

Pushes go out to Azure Static Web Apps through the GitHub Actions workflow in
`.github/`. It builds and ships `dist/`.
