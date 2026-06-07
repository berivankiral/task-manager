# Task Manager API

A simple Task Management REST API built with NestJS, TypeScript, PostgreSQL, and Docker.

## Tech Stack

- **NestJS** — Backend framework
- **TypeScript** — Type safety
- **PostgreSQL** — Database
- **TypeORM** — ORM
- **JWT** — Authentication
- **Docker & Docker Compose** — Containerization
- **Nginx** — Load balancer
- **Swagger** — API documentation

## Architecture

The application runs as **3 separate backend instances** behind an Nginx load balancer.

```
Client → Nginx (port 8080) → api-1 (port 3000)
                           → api-2 (port 3000)
                           → api-3 (port 3000)
                           → PostgreSQL (port 5432)
```

## Getting Started

### Requirements

- Docker
- Docker Compose

### Run

```bash
git clone https://github.com/berivankiral/task-manager.git
cd task-manager
docker compose up --build
```

The API will be available at `http://localhost:8080`

### Stop

```bash
docker compose down
```

### Stop and remove database

```bash
docker compose down -v
```

## API Documentation

Swagger UI is available at:

```
http://localhost:8080/api
```

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login and get JWT token | No |
| GET | /auth/me | Get current user info | Yes |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /tasks | Create a task | Yes |
| GET | /tasks | List all tasks | Yes |
| GET | /tasks?status=todo | Filter by status | Yes |
| GET | /tasks?priority=high | Filter by priority | Yes |
| GET | /tasks/:id | Get a single task | Yes |
| PATCH | /tasks/:id | Update a task | Yes |
| DELETE | /tasks/:id | Delete a task | Yes |

### Jobs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /jobs | Create a task summary job | Yes |
| GET | /jobs | List all jobs | Yes |
| GET | /jobs/:id | Get a single job | Yes |

### Health

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /health | Check instance health | No |

## Example Usage

### 1. Register

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### 2. Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Response:
```json
{
  "access_token": "eyJhbGci..."
}
```

### 3. Create a Task

```bash
curl -X POST http://localhost:8080/tasks \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task", "priority": "high"}'
```

### 4. Check Load Balancer

```bash
curl http://localhost:8080/health
```

Call multiple times to see different instance IDs (`api-1`, `api-2`, `api-3`).

## Testing with Swagger

1. Open `http://localhost:8080/api`
2. Use `POST /auth/register` to create a user
3. Use `POST /auth/login` to get a token
4. Click **Authorize** button at the top right
5. Enter `Bearer <your_token>`
6. Now you can test all protected endpoints

## Design Decisions

### Database: PostgreSQL
PostgreSQL was chosen for its reliability, strong typing, and excellent TypeORM support.

### Load Balancer: Nginx
Nginx was chosen for its simplicity and performance. Round-robin distribution ensures requests are evenly distributed across all 3 instances.

### Authentication: JWT
JWT tokens are stateless, which means they work correctly across multiple instances without any shared session storage.

### Jobs
Jobs are processed asynchronously. When a job is created, it immediately returns with `pending` status. The processing happens in the background and the status updates to `completed` when done. Since JWT is stateless and jobs are stored in the shared PostgreSQL database, this works correctly across all 3 instances.

## Frontend

`frontend/index.html` dosyasını tarayıcıda açın.
Docker çalışırken backend'e otomatik bağlanır.