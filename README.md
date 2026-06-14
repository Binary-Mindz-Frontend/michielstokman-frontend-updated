# Transform to Liberation

A Next.js 16 + React 19 frontend for the Transform to Liberation platform by Michiel Stokman.

This repository contains the frontend website and admin dashboard for Transform to Liberation, including:

- public landing pages for the main website
- user registration and login flows
- Firebase Google auth and guest login support
- authenticated profile and creation flows
- admin dashboard with journey management, moderation, photo management, metrics chat, voice review, and order history

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Redux Toolkit + RTK Query
- Firebase authentication (Google sign-in)
- Sonner toast notifications
- Docker / docker-compose

## Project structure

- `src/app` - Next.js App Router routes and layouts
- `src/redux` - Redux store, RTK Query API client, auth state
- `src/services` - backend API + auth helpers
- `src/components` - UI components for dashboard and main site
- `src/providers` - global providers and app wrappers
- `src/hooks` - custom React hooks

## Requirements

- Node.js 20+
- pnpm
- Docker (optional, for container builds)

## Local setup

1. Clone the repository:

```bash
git clone <repository-url>
cd michielstokman-frontend-updated
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a local environment file:

```bash
cp .env.example .env.local
```

If you do not have `.env.example`, create `.env.local` with at least:

```bash
NEXT_PUBLIC_BASE_API=https://your-api-base-url
```

4. Run the development server:

```bash
pnpm dev
```

Open http://localhost:3000 to view the app.

## Build & run

Build the production app:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Docker

### Build image

```bash
docker build --build-arg NEXT_PUBLIC_BASE_API=https://your-api-base-url -t michielstokman-frontend .
```

### Run container

```bash
docker run -e NEXT_PUBLIC_BASE_API=https://your-api-base-url -p 3000:3000 michielstokman-frontend
```

### docker-compose

```bash
docker compose up --build
```

This repository includes `Dockerfile` and `docker-compose.yml` for container deployment.

## Environment variables

This frontend expects at least the following variable:

- `NEXT_PUBLIC_BASE_API` - backend API base URL used by RTK Query and auth helpers

## Available scripts

- `pnpm dev` - start development server
- `pnpm build` - production build
- `pnpm start` - run production server
- `pnpm lint` - run ESLint
- `pnpm lint:fix` - fix lint issues
- `pnpm format` - check formatting
- `pnpm format:fix` - format files
- `pnpm typecheck` - run TypeScript typecheck
- `pnpm update-deps` - update dependencies using npm-check-updates and install
- `pnpm ci:check` - format, lint, build, and start checks
- `pnpm ci:fix` - fix formatting and lint issues

## Notes

- Firebase config is defined in `src/redux/features/auth/firebase.config.ts`.
- Route protection is handled by `src/proxy.ts` for `/dashboard`, `/login`, and `/register`.
- The Next.js app is configured for standalone output via `next.config.ts`.

## License

This project is private.
