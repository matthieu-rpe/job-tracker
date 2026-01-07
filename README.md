# Job Tracker - Home Lab Edition 🚀

A personal control center designed to manage job applications and monitor home-lab infrastructure (Raspberry Pi).

## 📌 Project Vision
The goal is to build a full-stack CRM to track job applications while learning to manage a real-world infrastructure using Docker and the Prometheus/Grafana monitoring stack.

## 🏗️ Architecture (Monorepo)
This project uses a monorepo structure to separate concerns while maintaining technical consistency:

- **apps/**: Executable applications (API, Web client, etc.).
- **packages/**: Shared libraries, utilities, and TypeScript types.
- **infra/**: Docker configurations and deployment scripts for Raspberry Pi.

## 🛠️ Tech Stack (Target)
- **Backend:** NestJS (Node v22 LTS)
- **Database:** PostgreSQL with Prisma ORM
- **Frontend:** Vue 3 or React (TBD)
- **Ops/Monitoring:** Docker, Prometheus, Loki, Grafana

## 🚀 Quick Start
1. Ensure `nvm` is installed.
2. Run `nvm use` to switch to Node v22.
3. Run `npm install` at the root level.

---
*Work in progress.*