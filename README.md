# Arabian Night

A React + Vite frontend application with Keycloak authentication, running fully containerized via Docker Compose.

## Stack

- **Frontend**: React 18, React Router v6, Vite
- **Auth**: Keycloak 26 (realm: `agrabah`, client: `city-app`)
- **Database**: PostgreSQL 16 (backing Keycloak)
- **Container**: Docker Compose

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### Run

```bash
docker compose up --build
```

Services will be available at:

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Keycloak | http://localhost:8080      |

Keycloak admin console: http://localhost:8080/admin (credentials: `admin` / `admin`)

## Development

```bash
cd frontend
npm install
npm run dev
```

> The dev server runs at http://localhost:5173 by default. Ensure Keycloak is running (`docker compose up keycloak`) before starting the frontend.

## Project Structure

```
.
├── docker-compose.yml   # Orchestrates all services
├── frontend/            # React + Vite app
└── keycloak/            # Keycloak realm import config
```
