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

## Local infrastructure

Postgres and Temporal run in Docker. Ports are offset from the defaults because
other stacks on this machine (`globals-cognit`) already hold 5432/7233/8233.

```sh
pnpm infra:up      # start   (docker compose up -d)
pnpm infra:ps      # status
pnpm infra:logs    # tail logs
pnpm infra:down    # stop, keeping data
pnpm infra:reset   # stop, wipe the Postgres volume, start again
```

| service         | host port | notes                                                             |
| --------------- | --------- | ----------------------------------------------------------------- |
| Postgres        | `5442`    | `postgresql://postgres:postgres@localhost:5442/cognit_engine_poc` |
| Temporal (gRPC) | `7333`    | client address `localhost:7333`, namespace `default`              |
| Temporal UI     | `8333`    | http://localhost:8333                                             |

One Postgres instance backs everything: `cognit_engine_poc` for the app, plus
`temporal` and `temporal_visibility`, which the `auto-setup` image creates and
migrates on first boot. Workflow state therefore survives `infra:down`; use
`infra:reset` to start from an empty database.

The `temporal` CLI is available without a local install:

```sh
docker compose exec temporal-admin-tools temporal workflow list
```

Copy `.env.example` to `.env` to override ports, credentials or image versions.
Image versions are pinned in `docker-compose.yml`; the app itself is not
containerised, it runs on the host against these services.

## Adding projects

```sh
nx g @nx/nest:application apps/<name>
nx g @nx/next:application apps/<name>
nx g @nx/js:library libs/<name> --importPath=@cognit-engine-poc/<name>
```

After adding a library, run `nx sync` to update the TypeScript project references.
