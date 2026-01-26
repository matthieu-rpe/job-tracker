# 🛡️ Job Tracker API

A production-ready NestJS backend focused on security, performance, and developer experience.

## ✨ Technical Features

### 🔒 Security & Protection

- **Helmet**: Secure HTTP headers (HSTS, CSP, etc.).
- **CORS**: Dynamic whitelist-based origin validation via `ConfigService`.
- **Rate Limiting**: `ThrottlerGuard` implemented to prevent brute-force and DDoS.
- **Trust Proxy**: Configured for reverse-proxy deployments (Nginx, Docker).
- **Validation**: Strict `ValidationPipe` with DTO transformation and non-whitelisted property rejection.

### 📊 Observability & Logging

- **Pino HTTP**: Ultra-fast JSON logging.
- **Request Tracking**: Unique `X-Request-ID` injected into every log and exception for easy debugging.
- **Global Filter**: Standardized error response format across the entire application.

### ⚙️ Architecture & Data

- **Global Config**: Environment variables strictly validated via `ConfigService`.
- **Database**: Prisma ORM with PostgreSQL adapter, optimized with shutdown hooks.
- **Serialization**: `ClassSerializerInterceptor` with `excludeAll` strategy (manual `@Expose()` required) to prevent data leaks.

## 🛠️ Development (Root Commands Only)

To ensure consistency across the monorepo, **all commands must be executed from the project root**, using `npm run api:{command}`

```bash
######
# DB #
######

# Database migrations
$ npm run api:migrate

# Generate TypeScripts types
$ npm run api:generate

# Run prisma studio to visualize db
$ npm run api:studio

##########
# Launch #
##########

# Launch API in watch mode
$ npm run api:dev

# Build API
$ npm run api:build

#########
# Tools #
#########

# Run unit tests
$ npm run api:test

# Linting
$ npm run api:lint
```
