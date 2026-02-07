# ABP Enhancements — @abpjs/schematics

Enhancements added on top of the `@abp/ng.schematics` v3.2.0 translation. Preserve these when re-running the translator.

## React Query Hook Generation (NEW)

- **`src/templates/hook.ts.ejs`** — Generates a grouped React Query hook per service (no Angular equivalent)
- **`src/commands/api.ts`** — `writeHookFile()`, `getQueryKeyType()`, `getMutationVariablesType()`, `getMutationFnParams()`, `getHookImports()` are all new
- GET methods -> `useQuery`, non-GET -> `useMutation` with auto-invalidation
- Query key factory pattern: `<name>QueryKeys.all / .lists() / .list(params) / .details() / .detail(...args)`
- Hook imports `@tanstack/react-query` and `useRestService` from `@abpjs/core`

## CLI with Commander (NEW)

- **`src/cli.ts`** — CLI entry point using `commander` (Angular used `@angular-devkit/schematics-cli`)
- **`src/commands/proxy-add.ts`**, **`proxy-refresh.ts`**, **`proxy-remove.ts`** — Standalone async commands (Angular used schematics Rule/Tree)
- `package.json` `"bin": { "abpjs": "./dist/cli.js" }`

## EJS Templating Engine

- All code generation uses EJS (`src/templates/*.ejs`) instead of Angular schematics string concatenation
- `service.ts.ejs`, `hook.ts.ejs`, `models.ts.ejs`, `enum.ts.ejs`
- Templates are rendered at runtime via `ejs.render()` with utility helpers passed as data
- Runtime dep: `ejs` in `package.json`

## Native Node.js Instead of Angular DevKit

- `node:fs` / `node:path` replace `@angular-devkit/schematics` Tree
- Native `fetch` replaces `got`
- `src/utils/text.ts` replaces `@angular-devkit/core/strings`
- `src/utils/source.ts` — direct fs read/write instead of Tree operations

## Import Path Changes

- `@abpjs/core` replaces `@abp/ng.core` in all generated imports
- `@abpjs/core` `RestService`, `useRestService`, `mapEnumToOptions` referenced in templates

## Build Configuration

- `tsup` dual entry: `index.ts` + `cli.ts`
- `onSuccess` hook copies `src/templates/` to `dist/templates/`
- `src/templates/` included in `package.json` `"files"` array
