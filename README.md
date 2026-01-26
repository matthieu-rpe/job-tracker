# 🚀 Job Tracker - Monorepo Boilerplate

A professional-grade full-stack control center designed to manage job applications and monitor home-lab infrastructure.

## 🏗️ Architecture

This project is a **Monorepo** managed with npm workspaces. To maintain consistency, **all commands must be executed from this root directory**.

- **📂 apps/api**: The core NestJS API (Security hardened, Observability focused).
  > 💡 _For detailed API documentation, features, and setup, see [apps/api/README.md](./apps/api/README.md)._
- **📂 packages/**: (Placeholder) Future shared libraries and utilities.
- **📂 infra/**: Deployment blueprints (Docker Compose for Postgres, Monitoring).

## 🛠️ Tech Stack

- **Runtime**: Node.js v22 (LTS)
- **Database**: PostgreSQL + Prisma ORM
- **Security**: JWT (Stateless), RBAC ready, Helmet, Throttler
- **Monitoring**: Pino Logging (JSON format)

## ⌨️ Global Scripts (Root Only)

Do not `cd` into subfolders. Use these commands from the root:

### 🐳 Infrastructure

- `npm run db:up`: Start the local PostgreSQL container.
- `npm run db:down`: Stop the infrastructure.

### 🔑 Database (API)

- `npm run api:migrate`: Run Prisma migrations.
- `npm run api:studio`: Open Prisma Studio.
- `npm run api:generate`: Generate Prisma Client.

### 🚀 Development & Quality

- `npm run api:dev`: Launch the API in watch mode.
- `npm run api:test`: Run API unit tests.
- `npm run api:test:watch`: Run API unit tests with watch mode for development purpose.
- `npm run api:test:e2e`: Run API end-to-end tests.
- `npm run api:lint`: Run ESLint on the API project.
- `npm run format`: Format the entire monorepo with Prettier.

## 🚀 Getting Started

1. **Environment**: `nvm use` (requires Node 22).
2. **Install**: `npm install`.
3. **Infrastructure**: `cp infra/postgres/.env.example infra/postgres/.env` and fill the variables. Then run the local DB `npm run db:up`.
4. **Configuration**: `cp apps/api/.env.example apps/api/.env` and fill the variables from the DB you want to use.
5. **Database Setup**: `npm run db:migrate`.
6. **Launch**: `npm run api:dev`.
