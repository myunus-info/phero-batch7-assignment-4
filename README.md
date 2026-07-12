# GearUp API

A robust, production-ready **RESTful backend API** for **GearUp**, a gear-rental marketplace where customers rent outdoor, photography, and adventure equipment from providers. The platform supports role-based access (customer, provider, admin), gear listings with inventory management, rental order placement with automatic payment integration, reviews, and administrative oversight.

Built with **Node.js**, **Express 5**, **TypeScript**, and **Prisma** (PostgreSQL), following a clean, modular, and layered architecture.

---

## Features

- **Authentication & Authorization** — Register/login with JWT (access + refresh tokens as httpOnly cookies), bcrypt password hashing, and role-based access control (`CUSTOMER`, `PROVIDER`, `ADMIN`).
- **Role-based access control** — Protected routes restrict actions by user role.
- **Category management** — Providers can create categories; anyone can view them.
- **Gear listings** — Providers create, update, and delete gear items with pricing, quantity, condition, and images. Inventory is automatically decremented on order.
- **Public gear catalog** — Anyone can browse and view gear items.
- **Rental orders** — Customers create rental orders (with date range + multiple items); the platform computes totals, validates stock, and initiates payment.
- **Payments** — Integrated with **SSLCommerz** payment gateway (Stripe-friendly model) with transaction tracking and status updates.
- **Reviews** — Customers leave ratings/comments per gear item per rental (duplicate-proof).
- **Provider dashboard** — Manage own gear, view rental orders, and update order status (confirm, picked up, returned).
- **Admin panel** — Admins manage users, view all gear listings and rental orders.
- **Centralized error handling** — Uniform error responses for Zod validation, Prisma, and unknown errors.

---

## Tech Stack

| Category   | Technology                                                 |
| ---------- | ---------------------------------------------------------- |
| Runtime    | Node.js (ESM)                                              |
| Framework  | Express 5                                                  |
| Language   | TypeScript                                                 |
| Database   | PostgreSQL                                                 |
| ORM        | Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`)          |
| Auth       | JSON Web Token (`jsonwebtoken`), `bcryptjs`                |
| Validation | Zod 4                                                      |
| Payments   | SSLCommerz (via `axios`)                                   |
| Utilities  | `cors`, `cookie-parser`, `morgan`, `dotenv`, `http-status` |
| Deployment | Vercel (`vercel.json`)                                     |

---

## Project Structure

```
assignment-4/
├── prisma/
│   ├── schema/                 # Prisma models (split per entity)
│   │   ├── schema.prisma       # Generator + datasource config
│   │   ├── user.prisma
│   │   ├── providerProfile.prisma
│   │   ├── category.prisma
│   │   ├── gearItem.prisma
│   │   ├── rentalOrder.prisma
│   │   ├── rentalOrderItem.prisma
│   │   ├── payment.prisma
│   │   └── review.prisma
│   ├── migrations/             # Database migration history
│   └── prisma.config.ts
├── src/
│   ├── app/
│   │   ├── modules/            # Feature modules (auth, admin, category, gear, provider, order, payment, review)
│   │   │   └── <module>/
│   │   │       ├── <module>.controller.ts
│   │   │       ├── <module>.service.ts
│   │   │       ├── <module>.route.ts
│   │   │       ├── <module>.validation.ts
│   │   │       └── <module>.interface.ts
│   │   ├── middleware/         # auth, validateRequest, errorHandler, notFoundHandler
│   │   ├── errors/             # ApiError + error handlers (zod, prisma, unknown)
│   │   └── routes/index.ts     # Module route aggregation
│   ├── config/                 # Environment configuration
│   ├── lib/                    # prisma client, sslcommerz client
│   ├── utils/                  # catchAsync, jwt, hash, sendResponse, sendErrorResponse
│   ├── shared/                 # shared helpers (pick)
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Entry point (DB connect + server listen)
├── .env.example
├── vercel.json
└── package.json
```

Each feature module follows the same layered pattern: **route → validation → controller → service → database**, keeping concerns cleanly separated.

---

## Prerequisites

- Node.js (v18+ recommended)
- A PostgreSQL database (local or hosted)
- An SSLCommerz merchant account (sandbox for development)
- npm (or any package manager)

---

## Getting Started

### 1. Clone & install dependencies

```bash
git clone <repository-url>
cd assignment-4
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) for the full list.

### 3. Run database migrations

```bash
npm run migrate
```

This applies Prisma migrations and generates the Prisma client.

### 4. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:8000/api/v1`.

---

## Available Scripts

| Script            | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start the server in watch mode (`tsx --watch`)  |
| `npm run build`   | Compile TypeScript to `dist/`                   |
| `npm start`       | Run the compiled server (`node dist/server.js`) |
| `npm run migrate` | Run Prisma migrations and generate the client   |

---

## Environment Variables

Create a `.env` file in the project root using `.env.example` as a template:

| Variable                 | Required | Description                            |
| ------------------------ | -------- | -------------------------------------- |
| `NODE_ENV`               | Yes      | `development` \| `production`          |
| `PORT`                   | Yes      | Server port (e.g. `8000`)              |
| `DATABASE_URL`           | Yes      | PostgreSQL connection string           |
| `APP_URL`                | Yes      | Frontend origin (used for CORS)        |
| `BCRYPT_SALT_ROUNDS`     | Yes      | Salt rounds for password hashing       |
| `JWT_ACCESS_SECRET`      | Yes      | Secret for signing access tokens       |
| `JWT_REFRESH_SECRET`     | Yes      | Secret for signing refresh tokens      |
| `JWT_ACCESS_EXPIRES_IN`  | Yes      | Access token expiry (e.g. `1d`)        |
| `JWT_REFRESH_EXPIRES_IN` | Yes      | Refresh token expiry (e.g. `7d`)       |
| `STORE_ID`               | Yes      | SSLCommerz store ID                    |
| `STORE_PASS`             | Yes      | SSLCommerz store password              |
| `SUCCESS_URL`            | Yes      | Payment success redirect URL           |
| `FAIL_URL`               | Yes      | Payment failure redirect URL           |
| `CANCEL_URL`             | Yes      | Payment cancel redirect URL            |
| `SSL_PAYMENT_API`        | Yes      | SSLCommerz payment initiation endpoint |
| `SSL_VALIDATIOIN_API`    | Yes      | SSLCommerz payment validation endpoint |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Base Response Shape

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 1 }
}
```

### Authentication

| Method | Endpoint                     | Access        | Description                    |
| ------ | ---------------------------- | ------------- | ------------------------------ |
| POST   | `/api/v1/auth/register`      | Public        | Register a new user (any role) |
| POST   | `/api/v1/auth/login`         | Public        | Login and receive JWT cookies  |
| GET    | `/api/v1/auth/me`            | Authenticated | Get the current user's profile |
| POST   | `/api/v1/auth/refresh-token` | Public        | Refresh the access token       |

**Register payload example**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "CUSTOMER",
  "phone": "+8801XXXXXXXXX",
  "address": "Dhaka, Bangladesh",
  "shopName": "Jane's Shop" // required only when role = PROVIDER
}
```

---

### Categories

| Method | Endpoint             | Access     | Description         |
| ------ | -------------------- | ---------- | ------------------- |
| POST   | `/api/v1/categories` | `PROVIDER` | Create a category   |
| GET    | `/api/v1/categories` | Public     | List all categories |

---

### Gears (Public Catalog)

| Method | Endpoint            | Access | Description            |
| ------ | ------------------- | ------ | ---------------------- |
| GET    | `/api/v1/gears`     | Public | List all gear items    |
| GET    | `/api/v1/gears/:id` | Public | Get a single gear item |

---

### Provider

| Method | Endpoint                      | Access     | Description                         |
| ------ | ----------------------------- | ---------- | ----------------------------------- |
| POST   | `/api/v1/provider/gear`       | `PROVIDER` | Add a new gear item                 |
| GET    | `/api/v1/provider/gear`       | `PROVIDER` | List the provider's gear items      |
| GET    | `/api/v1/provider/gear/:id`   | `PROVIDER` | Get a single gear item (own)        |
| PUT    | `/api/v1/provider/gear/:id`   | `PROVIDER` | Update a gear item (own)            |
| DELETE | `/api/v1/provider/gear/:id`   | `PROVIDER` | Delete a gear item (own)            |
| GET    | `/api/v1/provider/orders`     | `PROVIDER` | List rental orders for the provider |
| PATCH  | `/api/v1/provider/orders/:id` | `PROVIDER` | Update a rental order status        |

---

### Rentals (Orders)

| Method | Endpoint              | Access     | Description                       |
| ------ | --------------------- | ---------- | --------------------------------- |
| POST   | `/api/v1/rentals`     | `CUSTOMER` | Create a rental order + payment   |
| GET    | `/api/v1/rentals`     | `CUSTOMER` | List the customer's rental orders |
| GET    | `/api/v1/rentals/:id` | `CUSTOMER` | Get a rental order by ID          |

**Create rental order payload example**

```json
{
  "startDate": "2026-07-20",
  "endDate": "2026-07-23",
  "items": [{ "gearItemId": "<gear-id>", "quantity": 2 }]
}
```

Creating an order validates stock, decrements available quantity, calculates the total (`pricePerDay × quantity × days`), records a pending payment, and returns a payment gateway URL.

---

### Payments

| Method | Endpoint               | Access     | Description                          |
| ------ | ---------------------- | ---------- | ------------------------------------ |
| POST   | `/api/v1/payments`     | `CUSTOMER` | Confirm a payment (webhook/callback) |
| GET    | `/api/v1/payments`     | `CUSTOMER` | List the customer's payments         |
| GET    | `/api/v1/payments/:id` | `CUSTOMER` | Get a payment by ID                  |

---

### Reviews

| Method | Endpoint          | Access     | Description                     |
| ------ | ----------------- | ---------- | ------------------------------- |
| POST   | `/api/v1/reviews` | `CUSTOMER` | Create a review for a gear item |

**Review payload example**

```json
{
  "gearItemId": "<gear-id>",
  "rentalOrderId": "<order-id>",
  "rating": 5,
  "comment": "Excellent gear, worked perfectly!"
}
```

A customer may leave only one review per gear item per rental order.

---

### Admin

| Method | Endpoint                  | Access  | Description                       |
| ------ | ------------------------- | ------- | --------------------------------- |
| GET    | `/api/v1/admin/users`     | `ADMIN` | List all users                    |
| GET    | `/api/v1/admin/users/:id` | `ADMIN` | (Validate +) update a user status |
| GET    | `/api/v1/admin/gear`      | `ADMIN` | List all gear listings            |
| GET    | `/api/v1/admin/rentals`   | `ADMIN` | List all rental orders            |

---

## Authentication & Authorization

- On login, the API sets `accessToken` (1 day) and `refreshToken` (7 days) as **httpOnly cookies** and also returns them in the response body.
- Protected routes use the `auth(...roles)` middleware. The token is read from the `accessToken` cookie or the `Authorization: Bearer <token>` header.
- The middleware verifies the JWT, checks the user's role, confirms the user still exists, and rejects `SUSPENDED` accounts.
- Roles: `CUSTOMER`, `PROVIDER`, `ADMIN`.

---

## Data Models (Prisma)

The database is modeled with the following core entities:

- **User** — `name`, `email`, `password`, `role`, `phone`, `address`, `status`, `avatarUrl`. Relations: `ProviderProfile`, `GearItem[]`, `RentalOrder[]`, `Review[]`.
- **ProviderProfile** — `shopName`, `businessAddress`, `isVerified` (1:1 with User).
- **Category** — `name` (unique), `description`.
- **GearItem** — `providerId`, `categoryId`, `name`, `description`, `brand`, `pricePerDay`, `depositAmount`, `quantityTotal`, `quantityAvailable`, `condition`, `images[]`, `isActive`.
- **RentalOrder** — `customerId`, `status`, `startDate`, `endDate`, `totalAmount`, timestamps. Status: `PLACED → CONFIRMED → PICKED_UP → RETURNED` (or `CANCELLED`).
- **RentalOrderItem** — snapshot of `pricePerDay`, `quantity`, `subtotal` per gear item in an order.
- **Payment** — `rentalOrderId`, `transactionId`, `amount`, `provider` (`SSLCOMMERZ`/`STRIPE`), `method`, `status` (`PENDING`/`PAID`/`FAILED`/`REFUNDED`), `gatewayResponse`.
- **Review** — `customerId`, `gearItemId`, `rentalOrderId`, `rating`, `comment` (unique per customer+gear+order).

---

## Error Handling

The API uses a centralized error-handling layer that converts:

- **Zod validation errors** → `400` with field-level messages.
- **Prisma errors** (e.g. unique constraint, not found, validation) → appropriate HTTP statuses with readable messages.
- **Known application errors** (`ApiError`) → their defined status and message.
- **Unknown errors** → `500` with a safe fallback.

A `catchAsync` wrapper ensures async errors are forwarded to the error middleware, and a `notFoundHandler` returns `404` for unmatched routes.

---

## Deployment (Vercel)

The project is configured for Vercel via `vercel.json`, which builds `dist/src/server.js` with `@vercel/node` and routes all traffic to it.

```bash
npm run build      # compile to dist/
vercel deploy      # deploy to Vercel
```

Make sure to set all required [environment variables](#environment-variables) in your Vercel project settings.

---

## License

ISC — Author: Muhammad Yunus
