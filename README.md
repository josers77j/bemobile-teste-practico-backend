# BeMobile — Practical Backend Test

A RESTful multi-gateway payment management API built with AdonisJS 6, TypeScript, and MySQL.

---

## Requirements

- [Node.js 24+](https://nodejs.org/)
- [Docker](https://www.docker.com/) and Docker Compose
- [npm](https://www.npmjs.com/)

---

## Installation & Setup

### Using Docker (recommended)

1. Clone the repository:

```bash
git clone https://github.com/your-username/bemobile-teste-practico-backend.git
cd bemobile-teste-practico-backend
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Start all services (app + MySQL + gateway mocks):

```bash
docker compose up --build
```

4. In a separate terminal, run migrations and seeders:

```bash
docker compose exec test-service node ace migration:run
docker compose exec test-service node ace db:seed
```

The API will be available at `http://localhost:3333`.

---

### Without Docker (local)

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/bemobile-teste-practico-backend.git
cd bemobile-teste-practico-backend
npm install
```

2. Copy and configure environment variables:

```bash
cp .env.example .env
```

3. Start the gateway mocks:

```bash
docker run -p 3001:3001 -p 3002:3002 matheusprotzen/gateways-mock
```

4. Run migrations and seeders:

```bash
node ace migration:run
node ace db:seed
```

5. Start the development server:

```bash
npm run dev
```

---

## Running Tests

```bash
node ace test
```

---

## Environment Variables

```env
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development
LOG_LEVEL=info
APP_KEY=
APP_URL=http://${HOST}:${PORT}
SESSION_DRIVER=cookie
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=user_example
DB_PASSWORD=password_example
DB_DATABASE=db_example
GATEWAY1_URL=http://localhost:3001
GATEWAY1_EMAIL=gateway1_email
GATEWAY1_TOKEN=gateway1_token
GATEWAY2_URL=http://localhost:3002
GATEWAY2_AUTH_TOKEN=gateway2_auth_token
GATEWAY2_AUTH_SECRET=gateway2_auth_secret
```

---

## Default Credentials (after seeding)

```
Email:    admin@bemobile.com
Password: AdminBeMobile1234!
Role:     ADMIN
```

---

## API Endpoints

All private endpoints require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint              | Auth | Description                |
| ------ | --------------------- | ---- | -------------------------- |
| `POST` | `/api/v1/auth/login`  | No   | Login and get access token |
| `POST` | `/api/v1/auth/logout` | Yes  | Invalidate current token   |

**POST /api/v1/auth/login**

```json
// Request body
{
  "email": "admin@bemobile.com",
  "password": "AdminBeMobile1234!"
}

// Response 200
{
  "token": "oat_...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@bemobile.com",
    "role": "ADMIN"
  }
}
```

---

### Users

| Method   | Endpoint            | Roles          | Description                |
| -------- | ------------------- | -------------- | -------------------------- |
| `GET`    | `/api/v1/users`     | ADMIN, MANAGER | List all users (paginated) |
| `GET`    | `/api/v1/users/:id` | ADMIN, MANAGER | Get user by ID             |
| `POST`   | `/api/v1/users`     | ADMIN, MANAGER | Create user                |
| `PUT`    | `/api/v1/users/:id` | ADMIN, MANAGER | Update user                |
| `DELETE` | `/api/v1/users/:id` | ADMIN          | Delete user                |

**POST /api/v1/users**

```json
// Request body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "MANAGER"
}
```

Available roles: `ADMIN`, `MANAGER`, `FINANCE`, `USER`

Query params for listing: `?page=1&limit=10`

---

### Products

| Method   | Endpoint               | Roles                   | Description                   |
| -------- | ---------------------- | ----------------------- | ----------------------------- |
| `GET`    | `/api/v1/products`     | Authenticated           | List all products (paginated) |
| `GET`    | `/api/v1/products/:id` | Authenticated           | Get product by ID             |
| `POST`   | `/api/v1/products`     | ADMIN, MANAGER, FINANCE | Create product                |
| `PUT`    | `/api/v1/products/:id` | ADMIN, MANAGER, FINANCE | Update product                |
| `DELETE` | `/api/v1/products/:id` | ADMIN, MANAGER          | Delete product                |

**POST /api/v1/products**

```json
// Request body
{
  "name": "Product Name",
  "amount": 1000
}
```

`amount` is in cents (e.g., `1000` = $10.00)

---

### Clients

| Method | Endpoint              | Roles         | Description                           |
| ------ | --------------------- | ------------- | ------------------------------------- |
| `GET`  | `/api/v1/clients`     | Authenticated | List all clients (paginated)          |
| `GET`  | `/api/v1/clients/:id` | Authenticated | Get client with full purchase history |

Clients are created automatically on checkout. There is no manual creation endpoint.

---

### Transactions

| Method | Endpoint                          | Roles          | Description                       |
| ------ | --------------------------------- | -------------- | --------------------------------- |
| `GET`  | `/api/v1/transactions`            | Authenticated  | List all transactions (paginated) |
| `GET`  | `/api/v1/transactions/:id`        | Authenticated  | Get transaction details           |
| `POST` | `/api/v1/transactions/:id/refund` | ADMIN, FINANCE | Refund a transaction              |

---

### Gateways

| Method  | Endpoint                        | Roles | Description                  |
| ------- | ------------------------------- | ----- | ---------------------------- |
| `PATCH` | `/api/v1/gateways/:id/toggle`   | ADMIN | Toggle gateway active status |
| `PATCH` | `/api/v1/gateways/:id/priority` | ADMIN | Update gateway priority      |

**PATCH /api/v1/gateways/:id/priority**

```json
// Request body
{
  "priority": 1
}
```

Returns `409 Conflict` if the priority is already assigned to another gateway.

---

### Checkout (Public)

| Method | Endpoint           | Auth | Description        |
| ------ | ------------------ | ---- | ------------------ |
| `POST` | `/api/v1/checkout` | No   | Process a purchase |

**POST /api/v1/checkout**

```json
// Request body
{
  "name": "John Doe",
  "email": "john@example.com",
  "cardNumber": "5569000000006063",
  "cvv": "010",
  "products": [
    { "id": 1, "quantity": 2 },
    { "id": 2, "quantity": 1 }
  ]
}

// Response 201
{
  "transaction": {
    "id": 1,
    "status": "paid",
    "amount": 32500,
    "cardLastNumbers": "6063",
    "client": { "..." },
    "gateway": { "..." },
    "transactionProducts": [ "..." ]
  }
}
```

- The total `amount` is calculated server-side from product prices × quantities
- The card number is never stored — only the last 4 digits
- If Gateway 1 fails, the system automatically falls over to Gateway 2

---

## Architecture Decisions

### Multi-Gateway Pattern

Gateways are implemented using the Adapter pattern. Each gateway has its own adapter (`Gateway1Adapter`, `Gateway2Adapter`) that implements a common `GatewayInterface`. The `GatewayService` orchestrates the retry logic, iterating active gateways ordered by priority until one succeeds.

Adding a new gateway requires only:

1. Creating a new adapter implementing `GatewayInterface`
2. Registering it in the `GatewayService` adapter map
3. Adding a record to the `gateways` table

### Module Structure

The project follows a modular structure inspired by NestJS, grouping controllers, services, and validators by domain module under `app/modules/`.

### Role-Based Access Control

Roles are enforced via a custom `RoleMiddleware` applied at the route level. ADMIN has unrestricted access to all routes.
