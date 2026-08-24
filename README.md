# RIU-Frontend-Diego_Caro

A superhero maintenance SPA built with Angular 22 and Angular Material.

## Tech stack

- **Angular 22** (standalone components, new control flow, zoneless)
- **Angular Material** — table, pagination, forms, dialogs
- **RxJS** — reactive store and filtering
- **Vitest** — unit tests + coverage
- **Docker** — multi-stage build served with `serve`

## Requirements covered

**Core**

- Full hero CRUD (create, edit, delete, get by id, search by name).
- Data kept in memory inside the service (no backend).
- Paginated list with reactive name filter.
- Create/edit form with validations.
- Confirmation before delete (dialog).
- Unit tests for service and components — 80%+ coverage.

**Optional**

- Routing and navigation.
- Loading indicator during operations (add/edit/delete)
- Directive that displays the hero name in uppercase.
- Event-oriented communication and reactive programming.
- Dockerization.

## Getting started

### Local

```bash
cd frontend
npm install
npm start
# http://localhost:4200
```

### Tests

```bash
npm test                          # run the tests
npm test -- --coverage --no-watch # with coverage report
```

### Docker

```bash
docker compose up --build
# http://localhost:8080
```

## Technical decisions

- **`BehaviorSubject` store**: hero state lives in the service as a reactive stream. I chose RxJS over signals because the flow is
  asynchronous (I simulate backend latency), which lets me consume the stream reactively end to end. Mutations are immutable
  (`map`/`filter`, never in-place mutation).
- **No backend**: data is stored in memory in the service, as required. Ids are generated with `crypto.randomUUID()`.
- **Reactive filter**: the search input uses `debounceTime` + `distinctUntilChanged` + `switchMap` over the service method, unifying initial
  load and filtering into a single stream with `startWith`.
- **Single form component**: create and edit share the same component, which switches mode based on the presence of the `:id` route param,
  avoiding duplicated validations.
- **Delete via confirmation dialog** instead of a page, following the "ask before deleting" requirement.
- **Typed model**: `Hero` with `NewHero = Omit<Hero, 'id'>` for creation, leveraging TypeScript utility types.

## Project structure

```
frontend/
  src/app/
    models/          # Hero model
    services/        # HeroService (store + CRUD), LoadingService
    features/heroes/
      hero-list/     # paginated list + filter + delete
      hero-editor/   # create/edit form
    shared/
      components/
        confirm-dialog/  # reusable confirmation dialog
      directives/   # uppercase directive
```

## Trade-offs & production considerations

- **Persistence**: data is in-memory inside the service, per the requirement (no backend). On reload, state resets to the seed. In
  production I would add a REST layer with `HttpClient` and persistence (or `localStorage` for a persistent mock).
- **Loading / interceptor**: with no backend there are no HTTP request to intercept. I simulate latency and the loading indicator with a
  `LoadingService`. With a real API this would be a functional interceptor (`HttpInterceptorFn`), which would also centralize error
  handling.
- **Editing after reload**: ids are regenerated on each load (in-memory UUIDs), so a stale edit link is no longer valid; this is handled by
  redirecting back to the list.
- **Uppercase**: the directive applies uppercase display to the name input, as required. Normalizing the stored value would be done on save
  if the domain required it.
- **State management**: I chose `BehaviorSubject` over signals because the flow is async; I'm comfortable with both and their interop
  (`toSignal`).
