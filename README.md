# ShoppName

Modern ecommerce application built with Next.js, Prisma, PostgreSQL, NextAuth, and external payment services.

The application provides a complete shopping experience with product browsing, search and filters, cart management, authentication, shipping, payments, orders, reviews, and an administration area.

## Features

- Product catalog, search, filters, categories, and product reviews.
- Shopping cart with persistent session support.
- User registration, sign-in, profile, and order history.
- Shipping address and checkout flows.
- Stripe and PayPal payment integrations.
- Admin area for products, categories, orders, and users.
- Image uploads through UploadThing.
- Purchase receipt emails through Resend.
- English and Spanish localized routes and messages.
- Light theme by default with dark-theme support.

## Technology stack

### Frontend

- Next.js 16 with App Router
- React 19
- Tailwind CSS v4
- Reusable components in `components/ui` and `components/shared`
- `next-intl` for localized routing and messages

### Backend and data

- Next.js Server Actions and API routes
- Prisma ORM
- PostgreSQL
- Zod for input validation

### Authentication and services

- NextAuth v5 beta with credentials and JWT sessions
- bcrypt-compatible password hashing through `bcrypt-ts-edge`
- Stripe and PayPal
- UploadThing
- Resend

## Project structure

```text
.
├── app/                     # App Router pages, layouts, and API routes
│   ├── api/                 # APIs and webhooks
│   ├── [locale]/            # English and Spanish localized routes
│   │   ├── (auth)/          # Sign-in and sign-up
│   │   ├── (root)/          # Catalog, cart, and checkout
│   │   ├── admin/           # Administration area
│   │   └── user/            # Profile and orders
│   ├── layout.tsx
│   └── not-found.tsx
├── assets/styles/           # Global CSS and theme tokens
├── components/              # Reusable UI and feature components
│   ├── admin/
│   ├── providers/
│   ├── shared/
│   └── ui/
├── db/                      # Prisma client, seed, and sample data
├── email/                   # React Email templates
├── i18n/                    # next-intl configuration
├── lib/                     # Actions, integrations, constants, and utilities
│   ├── actions/
│   ├── constants/
│   ├── generated/prisma/
│   ├── paypal.ts
│   ├── stripe.ts
│   ├── resend.ts
│   ├── uploadthing.ts
│   ├── utils.ts
│   └── validators.ts
├── messages/                # en.json and es.json translations
├── prisma/                  # Schema and migrations
├── public/                  # Static assets
├── tests/                   # Automated tests
├── auth.ts                  # Main authentication configuration
├── auth.config.ts           # Edge-compatible authentication configuration
├── proxy.ts                 # Auth, locale routing, and cart session cookie
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Architecture and development conventions

The codebase is organized by layer and feature:

- UI: pages, layouts, providers, and reusable components.
- Domain: validators, server actions, and business rules.
- Infrastructure: Prisma, Stripe, PayPal, UploadThing, and Resend.
- Authentication: NextAuth configuration and `proxy.ts`.

When adding a feature:

- Keep page components focused on composing views and loading data.
- Put mutations and business logic in `lib/actions/`.
- Keep generic primitives in `components/ui/` and ecommerce-specific reusable UI in `components/shared/`.
- Use `@/i18n/routing` for localized `Link`, `redirect`, `useRouter`, and `usePathname` APIs.
- Keep interactive behavior in small Client Components and prefer Server Components elsewhere.
- Validate external input with Zod on the server, even when the client also validates it.
- Use theme tokens such as `bg-background`, `text-foreground`, and `bg-primary` instead of hardcoded component colors.
- Keep global styles and CSS variables in `assets/styles/globals.css`.

## Main flows

### Purchase flow

1. The customer browses products and adds items to the cart.
2. The customer signs in or creates an account.
3. The customer completes shipping details and selects a payment method.
4. The application creates the order and calculates subtotal, shipping, and taxes.
5. Stripe or PayPal processes the payment.
6. The order is updated as paid or pending according to the provider flow.
7. A purchase receipt can be sent by email.

### Administration flow

Administrators can add and edit products, manage categories, review orders, view users, and monitor store operations. Each administrative action must verify authorization on the server.

### Reviews flow

Authenticated customers can rate products and add comments according to the product review rules.

## Security

- Keep secrets and private provider credentials in `.env`.
- Never expose private variables through the `NEXT_PUBLIC_` prefix.
- Validate all external input before persistence or provider calls.
- Protect private pages and write operations independently.
- Do not trust roles or permissions received from the client.
- Verify webhook authenticity and make payment handlers idempotent.
- Do not expose stack traces, secrets, or complete provider responses to users.
- Do not commit `.env` files or real credentials.

## Internationalization

Localized routes use the following prefixes:

- `/en/...`
- `/es/...`

Visible user-facing text belongs in both `messages/en.json` and `messages/es.json`. Internal navigation should use the routing helpers from `@/i18n/routing` rather than direct `next/link` imports.

## Environment variables

Create a local `.env` file with values similar to:

```bash
NODE_ENV=development
APP_SERVER_URL=http://localhost:3000
DATABASE_URL=...
AUTH_SECRET=...
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=...
PAYPAL_APP_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
UPLOADTHING_TOKEN=...
UPLOADTHING_SECRET=...
UPLOADTHING_APPID=...
RESEND_API_KEY=...
SENDER_EMAIL=...
```

`AUTH_SECRET`, `DATABASE_URL`, provider keys, and webhook secrets must never be shared or committed.

## Getting started

Requirements:

- Node.js compatible with the installed Next.js version.
- pnpm 9 or a compatible pnpm version.
- A PostgreSQL database.
- Provider credentials for the integrations used locally.

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The application is then available at `http://localhost:3000`.

## Database commands

```bash
pnpm prisma:generate
pnpm exec prisma migrate dev --name name-of-migration
pnpm prisma:studio
pnpm prisma:seed
```

Every schema change in `prisma/schema.prisma` must have a migration. Do not edit migrations that have already been applied to a shared environment.

## Validation commands

```bash
pnpm lint
pnpm test
pnpm build
```

For changes affecting UI, test desktop and mobile layouts, both themes, loading/error/empty states, and both locales. For changes affecting orders or payments, cover calculations, authorization, provider errors, retries, and idempotency.

## Commit and branch conventions

Use Conventional Commits with one clear intention per commit:

```text
feat: add product reviews
fix: correct shipping calculation
refactor: separate price calculation
chore: update dependencies
docs: document payment flow
test: cover cart behavior
style: adjust header spacing
```

Recommended branch names:

```text
feature/short-name
fix/issue-name
refactor/module-name
chore/task-name
```

For detailed coding rules, see [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md).
