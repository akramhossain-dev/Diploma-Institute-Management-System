# 12 — Deployment Plan

> **Diploma Institute Management System (DIMS)**  
> Document Type: Deployment & Infrastructure Specification

---

## 1. Deployment Overview

| Service | Platform | URL Pattern |
|---|---|---|
| Frontend (Next.js) | Vercel | `https://dims.vercel.app` or custom domain |
| Backend (Express) | Render / Railway | `https://dims-api.onrender.com` |
| Database | MongoDB Atlas | Managed (Atlas dashboard) |
| File Storage | Cloudinary | CDN delivery |
| Email | Gmail SMTP / SendGrid | Transactional emails |

---

## 2. Environment Tiers

| Tier | Purpose | Branch |
|---|---|---|
| **Development** | Local dev on dev machines | `feature/*`, `dev` |
| **Staging** | Pre-production testing | `staging` |
| **Production** | Live system | `main` |

---

## 3. Frontend Deployment (Vercel)

### 3.1 Setup Steps

1. Push repository to GitHub
2. Connect GitHub repo to Vercel project
3. Set **Root Directory** to `client/`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `.next`
6. Configure environment variables in Vercel Dashboard

### 3.2 Vercel Environment Variables

```
NEXT_PUBLIC_API_URL=https://dims-api.onrender.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3.3 Deployment Triggers

- **Push to `main`** → Automatic production deploy
- **Push to `staging`** → Automatic preview deploy
- **Pull Requests** → Automatic preview URL per PR

### 3.4 Custom Domain Setup

1. Purchase domain (e.g., `dims.edu.bd`)
2. Add domain in Vercel → Domains → Add
3. Configure DNS:
   - `A` record → Vercel IP
   - `CNAME` → `cname.vercel-dns.com`
4. Vercel auto-provisions SSL certificate (Let's Encrypt)

---

## 4. Backend Deployment (Render)

### 4.1 Setup Steps

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repository
3. Set **Root Directory**: `server/`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Select **Environment**: Node
7. Select **Plan**: Free (dev) / Starter $7/mo (production)

### 4.2 Render Environment Variables

Set all backend `.env` values in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://dims_user:<password>@cluster0.xxxxx.mongodb.net/dims_db?retryWrites=true&w=majority
JWT_SECRET=<64-char random string>
JWT_REFRESH_SECRET=<64-char random string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CLIENT_URL=https://dims.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASS=<app-password>
```

### 4.3 Render Auto-Deploy

- **Push to `main`** → Render auto-deploys
- **Health Check Path**: `/api/health`

### 4.4 Health Check Endpoint

Backend must expose:
```
GET /api/health
Response: { "status": "ok", "timestamp": "..." }
```

### 4.5 Railway Alternative

If using Railway instead of Render:

1. `railway init` in `server/` directory
2. `railway up` to deploy
3. Set env variables via Railway dashboard
4. Railway provides auto-generated domain

---

## 5. Database Deployment (MongoDB Atlas)

### 5.1 Atlas Setup

1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a new project: `dims-production`
3. Create a cluster:
   - Development: **M0 Free** tier
   - Production: **M2 Shared** ($9/mo) or **M10 Dedicated** ($57/mo)
4. Create database user with strong password
5. Whitelist IP addresses:
   - Development: Your local IP
   - Production: Render/Railway outbound IPs (or `0.0.0.0/0` as last resort)
6. Get connection string from Atlas → `Connect → Connect your application`

### 5.2 Database Structure

| Database Name | Purpose |
|---|---|
| `dims_dev` | Local development |
| `dims_staging` | Staging environment |
| `dims_production` | Live production |

### 5.3 Backup Strategy

- Atlas M2+ includes automated daily backups (7-day retention)
- M0 free: manual snapshot only — schedule weekly via Atlas UI
- Export critical collections monthly as JSON backup

### 5.4 Atlas Performance Monitoring

- Enable Atlas Performance Advisor
- Create recommended indexes from slow query analysis
- Set up Atlas alerts for:
  - High connection count
  - Query latency > 1 second
  - Storage > 80% capacity

---

## 6. Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Note: Cloud Name, API Key, API Secret from Dashboard
3. Create upload presets:
   - `dims_avatars` — Profile photos (auto crop, max 500×500)
   - `dims_documents` — PDFs and official documents
4. Set allowed formats per preset:
   - Avatars: jpg, png, webp
   - Documents: pdf, jpg, png

---

## 7. CI/CD Pipeline (GitHub Actions)

### 7.1 Backend CI (`.github/workflows/backend-ci.yml`)

Triggers on: `push` to `main` or `staging`, `pull_request`

Steps:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Run linter (`npm run lint`)
5. Run tests (`npm test`) — when tests are added
6. Render auto-deploys on push to `main`

### 7.2 Frontend CI (`.github/workflows/frontend-ci.yml`)

Triggers on: `push` to `main`, `pull_request`

Steps:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Run linter
5. Run build (`npm run build`) — validates no build errors
6. Vercel auto-deploys on push to `main`

---

## 8. Domain & SSL

| Domain | Usage |
|---|---|
| `dims.edu.bd` | Production frontend |
| `api.dims.edu.bd` | Production backend API |
| `staging.dims.edu.bd` | Staging frontend (Vercel preview) |

- **Frontend SSL**: Managed by Vercel (auto-renewing Let's Encrypt)
- **Backend SSL**: Managed by Render / Railway (auto-renewing)
- Force HTTPS redirect at application and platform level

---

## 9. Environment Variable Management

| Environment | Frontend | Backend |
|---|---|---|
| Development | `.env.local` file | `.env` file |
| Staging | Vercel Preview Env | Render Staging Env |
| Production | Vercel Production Env | Render Production Env |

**Rules:**
- NEVER commit `.env` or `.env.local` to git
- Commit `.env.example` with placeholder values
- Rotate secrets quarterly in production

---

## 10. Post-Deployment Checklist

- [ ] Health check endpoint returns 200
- [ ] Login flow works end-to-end
- [ ] File upload to Cloudinary works
- [ ] Email sending works (test registration email)
- [ ] HTTPS enforced on all URLs
- [ ] CORS allows only production frontend domain
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Rate limiting active on auth endpoints
- [ ] Error responses do not expose stack traces
- [ ] Environment variables set correctly in all platforms
- [ ] Custom domain DNS resolving correctly
- [ ] SSL certificate valid and auto-renewing

---

## 11. Rollback Strategy

| Scenario | Action |
|---|---|
| Bad frontend deploy | Vercel → Deployments → "Promote to Production" on previous |
| Bad backend deploy | Render → Deploys → Rollback to previous deploy |
| Bad DB migration | Restore from Atlas backup snapshot |
| Critical bug in production | Revert commit → push to `main` → auto-redeploy |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
