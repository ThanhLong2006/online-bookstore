# Secure Task Full-Stack (Java 21 + React 18)

## 1) Project structure

- `backend/`: Spring Boot 3.3 API (JWT, RBAC, PostgreSQL, Mail, Swagger, Cache, Rate Limiting)
- `frontend/`: React 18 + TypeScript + Vite + Tailwind + Axios + Zustand + RHF + Zod
- `Dockerfile.backend`: backend multi-stage image
- `Dockerfile.frontend`: frontend multi-stage image
- `docker-compose.yml`: backend + frontend + nginx reverse proxy
- `nginx/default.conf`: reverse proxy + security headers + HTTPS redirect
- `.env.example`: all required environment variables

## 2) Backend features

- Java 21, Spring Boot 3.3.x, Maven
- Spring Security 6 + JWT HS512 (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- Access token: 15 minutes, refresh token: 7 days
- BCrypt password hashing
- Role-based authorization: `USER`, `ADMIN`
- Email auth flow: register, verify email, forgot password, reset password
- Task CRUD with pagination, search, filter
- Global exception handling with `@ControllerAdvice`
- Rate limiting with Bucket4j
- CORS restricted by `FRONTEND_URL`
- Security headers enabled
- Cache for profile endpoint
- OpenAPI/Swagger: `/swagger-ui.html`

## 3) API endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Tasks
- `GET /api/tasks?page=0&size=10&search=&status=`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

## 4) Local run (without Docker)

### Backend
1. Install Java 21 + Maven
2. Copy `.env.example` to `.env` and set DB/SMTP/JWT values
3. Export env vars to shell (or configure IDE run profile)
4. Run:
   - `cd backend`
   - `mvn clean package`
   - `java -jar target/*.jar`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `frontend/.env`:
   - `VITE_API_URL=http://localhost:8080`
4. `npm run dev`

## 5) Docker deployment

1. Copy `.env.example` to `.env`
2. Generate local self-signed cert for nginx:
   - `mkdir -p nginx/certs`
   - `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/certs/dev.key -out nginx/certs/dev.crt -subj "/CN=localhost"`
3. Start stack:
   - `docker compose up -d --build`
4. Access:
   - `https://localhost`
   - Swagger: `https://localhost/swagger-ui.html`

## 6) Security Considerations

- Do not hard-code secrets; use env vars and secret manager (Vault pattern).
- Keep `JWT_SECRET` at least 64 bytes with high entropy.
- Always set `COOKIE_SECURE=true` in production.
- Keep `SameSite=Strict`, `HttpOnly=true` for auth cookies.
- Use HTTPS only and rotate certificates regularly.
- Restrict CORS to trusted frontend domains.
- Keep `spring.jpa.hibernate.ddl-auto=validate` in production.
- Enforce SMTP credentials via secure secret storage.
- Monitor rate-limit logs and tune thresholds by traffic profile.

## 7) Production Deployment

- Use managed PostgreSQL with TLS and least-privilege DB user.
- Run behind WAF / cloud load balancer with DDoS protection.
- Replace self-signed cert by Let's Encrypt or enterprise PKI.
- Add centralized logging and metrics (ELK/Prometheus/Grafana).
- Configure rolling deployment and readiness/liveness checks.
- Add DB migrations (Flyway/Liquibase) for production schema control.

