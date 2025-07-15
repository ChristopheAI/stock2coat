# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stock2coat is a multi-tenant SaaS inventory management system specifically designed for powder coating companies. The project is currently in early development phase with an MVP target for September 2025.

### Business Context
- Target Market: ~800 Belgian powder coating companies (+ ~200 in Netherlands)
- Pilot Customer: Strameco (real-time testing from August 2025)
- Key Partners: Frank (40 years industry experience) & Laurens (operations)

## Technology Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS 4, shadcn/ui
- **State Management**: Supabase Realtime + minimal client state
- **Authentication**: Supabase Auth (magic-link) with JWT containing `tenant_id` & `role`
- **ORM**: Prisma
- **Database**: Supabase PostgreSQL 15 (shared schema with RLS)
- **Serverless**: Supabase Edge Functions
- **Hosting**: Vercel (Free tier)
- **Monitoring**: Sentry

## Development Guidelines

### Current State
The project currently consists of:
- HTML prototypes for the application interface
- Comprehensive PRD/Architecture documentation in README.md
- PDF documentation for setup guides

### Multi-tenant Architecture
- Subdomain routing with middleware setting `tenant_id` header
- Shared schema with `tenant_id` column on all tables
- RLS policy: `tenant_id = auth.jwt() ->> 'tenant_id'`

### Key Features (MVP)
1. **P0 (Must-have)**: Multi-tenant onboarding, Supabase Auth, RBAC, Inventory CRUD, Usage UI, Dashboard KPIs, RLS policies
2. **P1 (Should-have)**: Realtime updates, CSV/Excel export, Audit log, Sentry monitoring
3. **P2 (Nice-to-have)**: QR scanning, Batch/lot tracking, Public API, Advanced analytics, PWA

### Database Schema Extensions
The system includes audit logging, inventory transactions, and low stock alerts tables as defined in the README.md.

## Development Tasks

Since this is an early-stage project without an established codebase yet, the primary tasks involve:
1. Setting up the Makerkit clone with Supabase
2. Implementing the multi-tenant onboarding wizard
3. Building the inventory CRUD operations
4. Creating the dashboard with KPIs and low-stock warnings

## Important Dates & Milestones
- **July 15, 2025**: Visual prototype ready
- **July 29, 2025**: Makerkit clone + Supabase project live
- **August 5, 2025**: Onboarding wizard + tenant creation working
- **August 19, 2025**: Inventory CRUD + realtime & audit log live
- **September 2, 2025**: Strameco test with dashboard + warnings
- **September 15, 2025**: Public MVP launch (Belgian market)

## Success KPIs
- ≤10 min onboarding for new customers
- ≥75% reduction in counting errors vs Excel
- <500 ms 95-p API response
- ≥90% satisfaction (Strameco pilot)

## Security Considerations
- Implement Cypress e2e tests per tenant
- Unit tests for RLS policies
- GDPR compliance with Vercel & Supabase DPAs
- Weekly database backups to Backblaze

## Coding Conventions

### Code Style Guide
- Use Prettier with default configuration
- ESLint config: Next.js recommended + TypeScript strict
- Format on save enabled
- Line length: 100 characters
- Indent: 2 spaces
- Semicolons: always
- Single quotes for strings

## Project Structure

```
/apps/web          # Next.js frontend application
/supabase          # Database migrations, RLS policies, Edge Functions
/packages/ui       # Shared UI components (shadcn/ui based)
/packages/types    # Shared TypeScript types
/packages/utils    # Shared utilities
```

## QA & Testing Strategy

### Testing Stack
- **Unit Tests**: Vitest for components and utilities
- **E2E Tests**: Cypress with tenant-specific test suites
- **Database Tests**: pgTAP for RLS policy validation

### Test Commands
```bash
yarn test:unit       # Run Vitest unit tests
yarn test:e2e        # Run Cypress E2E tests
yarn test:db         # Run database policy tests
yarn test:all        # Run all test suites
```

## Commit Conventions

Follow Conventional Commits specification:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style changes (formatting, etc)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat(inventory): add low-stock alert notifications`

## Development Commands

### Build & Development
```bash
yarn dev             # Start development server
yarn build           # Build for production
yarn lint            # Run ESLint
yarn typecheck       # Run TypeScript compiler
```

### Pre-commit Hooks
Automatically run before commits:
```bash
yarn lint && yarn typecheck && yarn test:unit
```