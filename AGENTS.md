# AGENTS.md - Developer Guide for Uperhaps

This document provides guidance for AI agents working on the Uperhaps codebase.

## Project Overview

Uperhaps is a full-stack literary publishing platform built with Next.js 14 (App Router), Payload CMS, MongoDB, and tRPC for publishing poems, novels, and creative writing.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, React Hook Form, Zod
- **Backend**: Payload CMS 2.x, MongoDB, tRPC, Express
- **UI**: Shadcn/UI, Radix UI primitives, class-variance-authority
- **Rich Text**: Lexical editor

## Build Commands

```bash
# Development
yarn dev                    # Start dev server with Payload CMS

# Building
yarn build                  # Full production build (payload + server + next)
yarn build:payload          # Build Payload CMS only
yarn build:server           # Compile TypeScript server
yarn build:next             # Build Next.js app

# Type Generation
yarn generate:types         # Generate Payload CMS types

# Linting
yarn lint                   # Run ESLint (Next.js core-web-vitals)

# Starting Production
yarn start                  # Start production server
```

## Testing

This project currently has **no test suite**. When adding tests:
- Place test files adjacent to the code they test (e.g., `utils.ts` → `utils.test.ts`)
- Use Vitest or Jest as the test runner
- Run a single test file: `npx vitest run src/lib/utils.test.ts`

## Code Style Guidelines

### TypeScript

- **Always use strict mode** (enabled in `tsconfig.json`)
- Use explicit type annotations for function parameters and return types when not inferrable
- Prefer `type` over `interface` for simple object shapes
- Use `import type { ... }` for type-only imports to enable tree-shaking

### Imports

Use path aliases (`@/*`) defined in `tsconfig.json`. Order imports: 1) External (React, Next.js), 2) Internal utilities (`@/lib/*`), 3) Components, 4) Types.

### Naming Conventions

- **Components**: PascalCase (e.g., `ProductReel.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCart.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Collections**: PascalCase (e.g., `Users.ts`)
- **Multiple exports**: Index file pattern (`trpc/index.ts`)

### Component Structure

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ComponentProps {
  className?: string
}

export function Component({ className, ...props }: ComponentProps) {
  return <div className={cn("base-styles", className)} {...props} />
}
```

### Error Handling

- Use tRPC for API routes with proper error codes
- Throw `TRPCError` with codes like UNAUTHORIZED, NOT_FOUND
- Display user-friendly errors via `sonner` toasts

### Styling

- Use Tailwind CSS for all styling
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Use `cva` (class-variance-authority) for component variants

### Next.js App Router

- Use Server Components by default; add `'use client'` only when needed
- Use tRPC for data fetching with `@trpc/react-query`
- Use `constructMetadata()` from `@/lib/utils` for SEO metadata

### Payload CMS

- Define collections in `src/collections/`
- Use generated types from `payload-types.ts`
- Configure in `src/payload.config.ts`

## Environment Variables

```
PAYLOAD_SECRET=<secret>
MONGODB_URL=<mongodb-connection-string>
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
RESEND_API_KEY=<resend-key>
```

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # React components (ui/ for Shadcn)
├── collections/           # Payload CMS collections
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, validators
├── trpc/                  # tRPC router and procedures
├── payload.config.ts      # Payload CMS config
└── server.ts              # Express server
```

## Common Tasks

### Adding a new collection
1. Create file in `src/collections/`
2. Add to `src/payload.config.ts`
3. Run `yarn generate:types`

### Adding a new tRPC procedure
1. Define procedure in `src/trpc/`
2. Add to router in `src/trpc/index.ts`
3. Use in components via `trpc.*.useQuery()` or `useMutation()`

### Adding a new UI component
1. Use Shadcn CLI: `npx shadcn@latest add [component]`
2. Component goes in `src/components/ui/`
3. Export from component index
