# 🍔 Kuicko Backend API

A production-ready backend built with **NestJS**, **Prisma ORM**, and **PostgreSQL** for the Kuicko Backend Developer Hiring Task.

---

## 🛠 Tech Stack

* NestJS 11
* Prisma ORM
* PostgreSQL
* Docker & Docker Compose
* TypeScript
* Class Validator & Class Transformer
* Prisma Adapter for PostgreSQL (pg)

---

# 📦 Project Setup

## 1. Clone the Repository

```bash
git clone <repository-url>
```

---

## 2. Navigate to the Project

```bash
cd kuicko-assignment
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

The `.env` file should automatically be set up in the root directory. If not, create one with the following:

```env
PORT=8000
DATABASE_URL="postgresql://prashant:prashant342@localhost:5432/kuicko-assignment-db?schema=public"
```

---

## 5. Start PostgreSQL

Make sure Docker Desktop (or Docker Engine) is running.

```bash
docker-compose up -d
```

Verify the database is running:

```bash
docker ps
```

---

## 6. Generate Prisma Client

```bash
npm run prisma:generate
```

---

## 7. Run Database Migrations

Create the database schema.

```bash
npm run prisma:migrate
```

---

## 8. Apply Existing Migrations (Production)

For production deployments:

```bash
npm run prisma:deploy
```

---

## 9. Seed the Database

Populate the database with sample data so you can test the endpoints immediately.

```bash
npm run dummyData:seed
```

The seed script dynamically creates:

* 5 Stores (Domino's, Pizza Hut, Burger King, etc.)
* 10 Global Items (Margherita Pizza, Garlic Bread, etc.)
* Store-specific catalog (StoreItems) mapping products to stores
* Different randomized prices and stock levels per store

---

## 10. Start the Development Server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:8000/api
```

---

# 📬 API Testing

Import the provided Postman collection into your workspace:

```text
postman/Kuicko_Backend.postman_collection.json
```

You can then easily trigger and test all the available endpoints.

---

# 📖 Available APIs

| Method | Endpoint                 | Description                    |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/api/stores`            | Get all stores                 |
| GET    | `/api/stores/:storeId`   | Get store details              |
| GET    | `/api/stores/:storeId/items` | Get items available in a store |
| GET    | `/api/items`             | Get global item catalog        |
| POST   | `/api/orders`            | Create a new order             |
| GET    | `/api/orders/:orderId`   | Get order details              |
| GET    | `/api/health`            | Health check                   |

*Note: All APIs strictly return a unified `AbstractResponse` wrapper containing `status`, `message`, and `data` objects.*

---

# 📁 Project Structure

```text
src
├── common
│   ├── dto
│   └── filters
├── generated
├── modules
│   ├── item
│   ├── order
│   ├── order-item
│   ├── prisma
│   ├── store
│   └── store-item
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts

prisma
├── migrations
├── schema.prisma
└── seed.ts

postman
└── Kuicko_Backend.postman_collection.json
```

---

# 🗄 Database Model

```text
Store
│
├── StoreItem
│      └── Item
│
└── Order
       └── OrderItem
              └── StoreItem
```

This design explicitly supports:

* A global item catalog
* Store-specific pricing
* Store-specific inventory scaling
* Multi-store ordering validation
* Efficient relational queries avoiding N+1 loops

---

# 🚀 Useful Commands

| Command                   | Description                 |
| ------------------------- | --------------------------- |
| `npm run start:dev`       | Start development server    |
| `npm run build`           | Build project               |
| `npm run prisma:generate` | Generate Prisma Client      |
| `npm run prisma:migrate`  | Run development migrations  |
| `npm run prisma:deploy`   | Apply production migrations |
| `npm run prisma:studio`   | Open Prisma Studio          |
| `npm run dummyData:seed`  | Seed database               |

---

# ✅ Features

* NestJS 11 Implementation
* Prisma ORM
* PostgreSQL
* Dockerized Database Ecosystem
* Prisma Migrations & Automatic Sync
* Dynamic Database Seeder
* Request DTO Input Validation (Class Validator)
* Unified Generic Responses (`AbstractResponse`)
* Global Exception Handling (`HttpExceptionFilter`)
* RESTful Architectured APIs
* Robust Transaction-based Order Creation (`prisma.$transaction`)
* Efficient Prisma Queries (Strictly 1 query handling relations—No N+1)
* Clean Modular Architecture
* Production-ready Project Structure

---

# 👨💻 Author

Developed as part of the **Kuicko Backend Developer Hiring Task** utilizing modern NestJS and Prisma best practices.
