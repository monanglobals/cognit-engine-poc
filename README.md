# cognit-engine-poc

Nx monorepo (pnpm workspaces).

## Structure

```
apps/
  web/      Next.js 16 (App Router, React 19)  — @cognit-engine-poc/web
  api/      NestJS 11 (webpack build)          — api
libs/
  shared/   shared types & utils               — @cognit-engine-poc/shared
```

`libs/shared` is consumed from source by both apps through the `@cognit-engine-poc/shared`
TypeScript path mapping in `tsconfig.base.json`.

## Getting started

```sh
pnpm install
pnpm dev:api     # http://localhost:3333/api
pnpm dev:web     # http://localhost:3000
```

## Tasks

| command          | what it does                         |
| ---------------- | ------------------------------------ |
| `pnpm build`     | build every project                  |
| `pnpm test`      | run every Jest suite                 |
| `pnpm lint`      | ESLint (flat config) across the repo |
| `pnpm typecheck` | `tsc --build` across the repo        |
| `pnpm graph`     | open the Nx project graph            |

Target a single project with `nx <target> <project>`, e.g. `nx test shared`.

## Adding projects

```sh
nx g @nx/nest:application apps/<name>
nx g @nx/next:application apps/<name>
nx g @nx/js:library libs/<name> --importPath=@cognit-engine-poc/<name>
```

After adding a library, run `nx sync` to update the TypeScript project references.
