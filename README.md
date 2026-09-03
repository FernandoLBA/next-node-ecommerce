# ProStore

Modern ecommerce application built with Next.js, Prisma, PostgreSQL, NextAuth, and external payment services.

## 1. Site description

ProStore is a product marketplace with a full purchase flow:

- product catalog,
- search and filters,
- shopping cart,
- user authentication,
- shipping address,
- payment method,
- orders and payments with Stripe/PayPal,
- admin panel,
- multilingual support,
- product reviews,
- UploadThing image integration and Resend email integration.

The app is designed as a realistic ecommerce platform, with business logic separated from the presentation layer and external services encapsulated to keep the project modular and maintainable.

---

## 2. Main stack

### Frontend
- Next.js 16
- React 19
- App Router
- Tailwind CSS
- Reusable components under `components/ui` and `components/shared`

### Backend and data
- Prisma ORM
- PostgreSQL
- Next.js Server Actions

### Authentication
- NextAuth v5 beta
- Credentials provider
- bcrypt for passwords
- JWT sessions

### Internationalization
- next-intl
- locale-based routes (`en`, `es`)

### Payments and external services
- Stripe
- PayPal
- UploadThing
- Resend

---

## 3. Project architecture

```text
.
├── app/                     # App Router and pages
│   ├── api/                 # API routes and webhooks
│   ├── [locale]/            # locale-based routes
│   │   ├── (auth)/          # login / sign up
│   │   ├── (root)/          # catalog, cart, checkout
│   │   ├── admin/           # administration
│   │   └── user/            # user profile and orders
│   ├── layout.tsx
│   └── not-found.tsx
├── components/              # reusable UI
│   ├── admin/
│   ├── providers/
│   ├── shared/
│   └── ui/
├── lib/                     # logic, services, and utilities
│   ├── actions/
│   ├── constants/
│   ├── generated/prisma/
│   ├── paypal.ts
│   ├── stripe.ts
│   ├── resend.ts
│   ├── uploadthing.ts
│   ├── utils.ts
│   └── validators.ts
├── prisma/                  # schema and migrations
├── db/                      # DB access, seed, and sample data
├── i18n/                    # i18n config
├── messages/                # locale messages
├── email/                   # email templates
├── public/                  # public assets
├── tests/                   # tests
├── auth.ts                  # main auth configuration
├── auth.config.ts           # config for middleware/edge
├── middleware.ts            # protection + locale routing
├── package.json
├── next.config.ts
├── .env
├── README.md
└── architecture.md
```

### Design pattern

The application is organized by feature and layer:

- UI: components, pages, and layouts
- domain: business rules, validators, and server actions
- infrastructure: Prisma, Stripe, PayPal, UploadThing, Resend
- authentication: NextAuth + middlewares

This keeps the project scalable and makes it easier to evolve each module without introducing tight coupling.

---

## 4. Main functional flow

### Purchases
1. The user browses products.
2. Adds items to the cart.
3. Signs in or signs up.
4. Completes the shipping address and payment method.
5. Creates the order.
6. Subtotal, shipping, and taxes are calculated.
7. The payment is processed with Stripe or PayPal.
8. The order is updated as paid or pending depending on the flow.

### Administrator
- add/edit products,
- review orders,
- manage categories,
- view users,
- monitor store status.

### Reviews
Buyers can rate products with comments and scores, reinforcing trust in the catalog.

---

## 5. Security and authentication

The app uses NextAuth with a credentials-based flow and JWT. Authentication integrates with Prisma to store users, accounts, and sessions in PostgreSQL.

This project also follows several good practices:

- private routes are controlled via middleware,
- secret keys are kept out of source code,
- external services use credentials from `.env`,
- incoming data is validated with Zod before persistence or processing.

---

## 6. Internationalization

The project uses `next-intl` and structures routes with a locale prefix:

- `/es/...`
- `/en/...`

This allows the app to scale to additional languages without duplicating the functional structure.

---

## 7. Development guidelines

### General conventions
- Use App Router for new routes.
- Keep business logic in `lib/actions`.
- Keep reusable components in `components/shared` and `components/ui`.
- Prefer Server Actions over logic embedded in components.
- Use `@/` as the import alias.

### Security
- Do not expose secrets to the client.
- Keep sensitive variables only in `.env`.
- Validate inputs with Zod before saving or running transactions.
- Protect sensitive routes with middleware and session checks.

### Persistence
- Use Prisma as the central data access layer.
- Adjust models and migrations carefully.
- Keep transactions for critical operations such as orders and payments.

### Style and maintainability
- Separate UI, logic, and services.
- Avoid business logic inside reusable components.
- Organize by feature/domain.
- Use clear naming for files, functions, and variables.

### External integrations
- Encapsulate Stripe, PayPal, UploadThing, and Resend clients in `lib/`.
- Avoid duplicating logic across pages and actions.
- Test critical payment and order flows before release.

---

## 8. Required environment variables

The project requires a `.env` file with variables such as:

```bash
NODE_ENV=development
NEXT_PUBLIC_APP_SERVER_URL=http://localhost:3000/
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

> Important: `AUTH_SECRET`, `DATABASE_URL`, `STRIPE_SECRET_KEY`, `PAYPAL_APP_SECRET`, and similar values should not be shared or committed publicly.

---

## 9. Useful scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma studio
pnpm test
```

---

## 10. Final notes

This project is well structured as a modern ecommerce application with clear separation between layers and external services. Its main strength is modularization: UI, authentication, business logic, payments, and persistence are organized to support development and maintenance.

When working on new features, the recommended pattern is to keep logic in `lib/actions`, reusable components in `components`, and data access centralized with Prisma.

---

## 11. Recommendation

The more detailed technical documentation for the project is available in [ARCHITECTURE.md](ARCHITECTURE.md).
