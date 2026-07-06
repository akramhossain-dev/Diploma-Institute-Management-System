# 05 — Technology Stack

> **Diploma Institute Management System (DIMS)**  
> Document Type: Tech Stack Specification

---

## 1. Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend Framework | Next.js | 14+ | Full-stack React framework (App Router) |
| UI Library | React | 18+ | Component-based UI |
| CSS Framework | Tailwind CSS | 3.x | Utility-first styling |
| UI Components | shadcn/ui | Latest | Accessible, headless component library |
| HTTP Client | Axios | 1.x | API requests with interceptors |
| Server State | TanStack Query | 5.x | Data fetching, caching, sync |
| Form Handling | React Hook Form | 7.x | Performant form management |
| Schema Validation (FE) | Zod | 3.x | Runtime type validation |
| Backend Runtime | Node.js | 18+ LTS | JavaScript server runtime |
| Backend Framework | Express.js | 4.x | Minimal, flexible HTTP framework |
| Database | MongoDB | 7.x | Document-oriented NoSQL database |
| Cloud DB Provider | MongoDB Atlas | — | Managed MongoDB hosting |
| ODM | Mongoose | 8.x | MongoDB object modeling |
| Authentication | JSON Web Token | — | Stateless auth tokens |
| Password Hashing | bcrypt | 5.x | Secure password hashing |
| File Uploads | Multer | 1.x | Multipart form handling (backend) |
| File CDN | Cloudinary | Latest | Cloud image/file storage and CDN |
| Email | Nodemailer | 6.x | SMTP email sending |
| Real-time | Socket.io | 4.x | WebSocket-based real-time events |
| Input Validation | express-validator | 7.x | Server-side input validation |
| Rate Limiting | express-rate-limit | 7.x | API rate limiting |
| Logging | Morgan + Winston | Latest | HTTP and structured logging |
| CORS | cors | 2.x | Cross-origin request handling |
| Env Config | dotenv | 16.x | Environment variable management |
| Deployment (FE) | Vercel | — | Next.js deployment platform |
| Deployment (BE) | Render / Railway | — | Node.js backend hosting |

---

## 2. Frontend Stack

### 2.1 Next.js 14 (App Router)
- SSR for SEO and fast initial load
- File-based routing with shared layouts per role
- Server Components for data-heavy views
- Client Components for interactive forms

### 2.2 Tailwind CSS + shadcn/ui
- Utility-first styling with dark mode via `dark:` prefix
- shadcn/ui components: Dialog, Table, Form, Toast, Sidebar, etc.
- Copy-into-codebase model — fully customizable

### 2.3 TanStack Query (React Query v5)
- Automatic caching and background refetching
- Loading/error states out of the box
- Optimistic updates for mutations

### 2.4 React Hook Form + Zod
- Minimal re-renders with uncontrolled inputs
- Zod schema validation integrated via `@hookform/resolvers`

---

## 3. Backend Stack

### 3.1 Node.js + Express.js
- Minimal and unopinionated — structured as feature modules
- Middleware chain: `cors → helmet → morgan → rateLimiter → routes → errorHandler`

### 3.2 MongoDB + Mongoose
- Flexible document model for varied educational records
- Schema enforcement, validation hooks, and population via Mongoose

### 3.3 JWT Authentication

| Token | Expiry | Storage |
|---|---|---|
| Access Token | 15 minutes | Memory / httpOnly cookie |
| Refresh Token | 7 days | httpOnly cookie |

### 3.4 Cloudinary
- Free tier: 25GB storage, 25GB bandwidth
- On-the-fly image transforms (resize, crop for avatars)
- Upload flow: `Multer buffer → cloudinary.uploader.upload → store URL in DB`

### 3.5 Socket.io (Phase 2+)
- Events: `new_notice`, `result_published`, `fee_due_reminder`
- Rooms: role-based (admin, teacher:id, student:id)
- Auth: JWT in socket handshake

---

## 4. Environment Variables

### Backend `.env`
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 5. Development Tools

| Tool | Purpose |
|---|---|
| ESLint | JavaScript linting |
| Prettier | Code formatting |
| Husky | Git pre-commit hooks |
| Postman | API testing |
| MongoDB Compass | Local DB GUI |
| Nodemon | Auto-restart on backend changes |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
