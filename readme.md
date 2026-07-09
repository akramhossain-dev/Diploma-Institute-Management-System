# Diploma Institute Management System (DIMS)

DIMS is a modern, full-stack web application designed to manage academic operations, student registries, departments, fee structures, notices, and exams for a diploma-awarding educational institute.

## Technology Stack

- **Frontend**: Next.js (App Router, Tailwind CSS, TypeScript, Zustand, TanStack React Query)
- **Backend**: Node.js, Express, ES Modules, Mongoose, Winston logger
- **Database**: MongoDB (local container or Cloud Atlas)
- **File Storage**: Cloudinary (integrated for photo/file uploads)
- **Email Service**: SMTP integration for alerts and notifications

---

## Getting Started: Docker Compose (Recommended)

The easiest way to run the entire system (Database + Backend + Frontend) locally is using **Docker Compose**. This spins up all required services with a single command.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10 or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or later)

### Setup & Run Instructions

1. **Centralize Environment Configurations**:
   Copy the example environment file at the root to create your `.env` file:
   ```bash
   cp .env.example .env
   ```

2. **Run the Full System**:
   Start the services in the background:
   ```bash
   docker compose up --build -d
   ```
   This will:
   - Start a local MongoDB database container (`dims-mongodb` on port `27017`)
   - Build and start the backend service (`dims-backend` on port `5000`)
   - Build and start the Next.js frontend standalone server (`dims-frontend` on port `3000`)

3. **Verify running containers**:
   ```bash
   docker compose ps
   ```

4. **Seed the database (Optional)**:
   If you are running the system for the first time and want to seed the Super Admin and mock details:
   ```bash
   docker compose exec backend node seed.js
   ```

5. **Stop the services**:
   To stop and remove the containers:
   ```bash
   docker compose down
   ```

---

## Exposed Ports & Local Access

| Service | Port (Container) | Port (Host) | Access URL |
| :--- | :--- | :--- | :--- |
| **Frontend** (Next.js) | `3000` | `3000` | [http://localhost:3000](http://localhost:3000) |
| **Backend API** (Express) | `5000` | `5000` | [http://localhost:5000](http://localhost:5000) |
| **Database** (MongoDB) | `27017` | `27017` | `mongodb://localhost:27017` |

---

## Local Development (Without Docker)

If you prefer to run services manually on your host machine for development:

### Backend Setup
1. Navigate to `/backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in details.
4. Run development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and configure `NEXT_PUBLIC_API_URL`.
4. Run development server:
   ```bash
   npm run dev
   ```

---

## CI/CD Pipeline

A GitHub Actions workflow is configured in `.github/workflows/ci.yml`. On every push and pull request to `main` and `master`, it:
1. Installs dependencies for frontend and backend.
2. Lints frontend code using ESLint.
3. Builds the frontend using `next build` to verify compilation.
4. Validates backend and frontend Docker builds by building Docker images inside the runner environment.
