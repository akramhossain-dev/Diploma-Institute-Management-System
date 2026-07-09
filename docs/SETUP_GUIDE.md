# Setup & Installation Guide - DIMS

This guide provides step-by-step instructions to configure, run, and deploy the **Diploma Institute Management System (DIMS)**.

---

## 1. System Requirements

Ensure your machine has the following tools installed:
- **Node.js:** `v18.0.0` or higher (Long-Term Support recommended)
- **NPM:** `v9.0.0` or higher
- **MongoDB:** A running local MongoDB instance or a MongoDB Atlas Cloud database account
- **Cloudinary:** A free Cloudinary account for media uploads (avatars, attachments)

---

## 2. Environment Variables Checklist

Both frontend and backend rely on `.env` files. Ensure you create these files prior to launching the services.

### Backend Environment Variables (`backend/.env`)

Create `backend/.env` based on `backend/.env.example`.

| Key | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | Yes | `development` | Runtime mode: `development` or `production`. |
| `PORT` | Yes | `5000` | Port the Express API server listens on. |
| `MONGO_URI` | Yes | — | MongoDB Connection String (Local URI or Atlas SRV string). |
| `JWT_SECRET` | Yes | — | Strong hash secret for JWT access tokens. |
| `JWT_REFRESH_SECRET` | Yes | — | Strong hash secret for JWT refresh tokens. |
| `JWT_EXPIRES_IN` | No | `15m` | Lifetime of access tokens. |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Lifetime of refresh tokens. |
| `CLIENT_URL` | No | `http://localhost:3000` | The origin URL of the Next.js client for CORS clearance. |
| `CLOUDINARY_CLOUD_NAME` | No | — | Cloudinary cloud account name (needed for media upload). |
| `CLOUDINARY_API_KEY` | No | — | Cloudinary credentials. |
| `CLOUDINARY_API_SECRET` | No | — | Cloudinary credentials. |
| `SMTP_HOST` | No | `smtp.gmail.com` | Hostname of SMTP server for transactional mail. |
| `SMTP_PORT` | No | `587` | Connection port for SMTP. |
| `SMTP_USER` | No | — | Username/email of the SMTP account. |
| `SMTP_PASS` | No | — | Password (or App Password) of the SMTP account. |
| `SEED_ADMIN_EMAIL` | Yes (for seeding) | — | Admin email used to bootstrap the system. |
| `SEED_ADMIN_PASSWORD` | Yes (for seeding) | — | Admin password used to bootstrap the system. |
| `SEED_ADMIN_NAME` | No (for seeding) | `Super Admin` | Display name of the bootstrapped super admin. |

### Frontend Environment Variables (`frontend/.env.local`)

Create `frontend/.env.local` based on `frontend/.env.example`.

| Key | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5000/api` | The base URL endpoint pointing to the active Express backend API. |

---

## 3. Installation Steps

### Step 1: Clone and Install Dependencies
From the repository root directory, run:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Seed the Database
DIMS requires a bootstrap step to initialize the institute (MRIST), seed default departments, and register a Super Admin account.

1. Ensure MongoDB is running and reachable.
2. Verify `backend/.env` has `MONGO_URI`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD` defined.
3. From the `backend` directory, run:
   ```bash
   npm run seed
   ```
4. Verify the console displays a success message: `[SEED] ✅ Database seeded successfully!`

---

## 4. Development Setup

### Running Locally
To launch both the backend API and the frontend client simultaneously in development mode (with hot reloading enabled):

#### Launch Backend Server
In the `backend` directory:
```bash
npm run dev
```
The server will boot on the designated port (default: `5000`). Accessing `http://localhost:5000/api/health` should return a `success: true` response.

#### Launch Frontend Client
In the `frontend` directory:
```bash
npm run dev
```
The client will start on `http://localhost:3000`. Open this address in your browser to access the dashboard.

---

## 5. Production Build

When preparing the project for production, build the static client and run the optimized server:

### Backend Production Startup
From the `backend` directory:
```bash
npm run start
```
This runs the API using the standard Node.js process manager (without nodemon file watchers).

### Frontend Compilation
From the `frontend` directory:
```bash
# Compile and optimize the application
npm run build

# Start the compiled client server
npm run start
```
The build process compiles assets, generates TypeScript definitions, and creates a highly optimized build bundle inside the `.next` directory.

---

## 6. Common Setup Issues

### Issue 1: `Missing required environment variables`
- **Symptom:** Backend crashes instantly during startup with `[ENV] ❌ Missing required environment variables: MONGO_URI, ...`
- **Solution:** Verify the `.env` file exists directly inside the `backend/` root directory (not `backend/src/`) and that it has all values listed in the *Backend Environment Variables* section.

### Issue 2: MongoDB connection failures
- **Symptom:** Server starts but logs connection timeouts or crashes when performing database writes.
- **Solution:** Ensure your local MongoDB service is running (`sudo systemctl status mongod` on Linux) or check that your IP address is whitelisted in your MongoDB Atlas Security → Network Access settings.

### Issue 3: CORS policy blocks requests
- **Symptom:** Frontend displays loading spinners endlessly; browser console logs `Access to fetch at '...' has been blocked by CORS policy`.
- **Solution:** Verify that `CLIENT_URL` in `backend/.env` matches the exact URL of your frontend server (e.g., `http://localhost:3000`). Check for trailing slashes!

### Issue 4: `SEED_ADMIN_EMAIL` missing during bootstrap
- **Symptom:** Seeding script throws an error and exits during `npm run seed`.
- **Solution:** Ensure `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are explicitly defined in the `backend/.env` file. These variables do not have fallback defaults to avoid insecure credentials.
