# 04 — System Architecture

> **Diploma Institute Management System (DIMS)**  
> Document Type: Architecture Design

---

## 1. Architecture Style

DIMS follows a **3-Tier Client-Server Architecture** with clear separation between:

1. **Presentation Layer** — Next.js frontend (SSR + CSR hybrid)
2. **Application Layer** — Node.js + Express REST API backend
3. **Data Layer** — MongoDB Atlas (document database)

The system uses a **Monorepo structure** with separate `/client` (frontend) and `/server` (backend) packages in a single repository.

---

## 2. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser / Device)                        │
│                                                                           │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                   Next.js Frontend (Vercel)                      │   │
│   │                                                                   │   │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │   │
│   │   │  Admin   │  │ Teacher  │  │ Student  │  │  Accountant  │   │   │
│   │   │Dashboard │  │Dashboard │  │Dashboard │  │  Dashboard   │   │   │
│   │   └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │   │
│   │                                                                   │   │
│   │   React Context (Auth State) │ Axios HTTP Client │ Tailwind CSS  │   │
│   └───────────────────────────────────────────────────────────────── ┘  │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │ HTTPS REST (JSON)
                            │ Authorization: Bearer <JWT>
┌───────────────────────────▼─────────────────────────────────────────────┐
│                     BACKEND API (Render / Railway)                        │
│                                                                           │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                   Express.js REST API                             │   │
│   │                                                                   │   │
│   │  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌─────────┐  │   │
│   │  │   Auth   │ │ Student  │ │Teacher │ │  Fee   │ │ Notice  │  │   │
│   │  │  Router  │ │  Router  │ │ Router │ │ Router │ │ Router  │  │   │
│   │  └──────────┘ └──────────┘ └────────┘ └────────┘ └─────────┘  │   │
│   │                                                                   │   │
│   │  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────────────────┐  │   │
│   │  │Attendance│ │  Result  │ │ Dept / │ │    Admission       │  │   │
│   │  │  Router  │ │  Router  │ │ Course │ │      Router        │  │   │
│   │  └──────────┘ └──────────┘ └────────┘ └────────────────────┘  │   │
│   │                                                                   │   │
│   │   Middleware: JWT Auth │ RBAC │ Validation │ Rate Limiter        │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼─────────────────────────────────────────────┐
│                     DATA LAYER (MongoDB Atlas)                             │
│                                                                           │
│   Collections: users │ students │ teachers │ departments │ courses        │
│                batches │ attendance │ results │ fees │ notices            │
│                admissions │ feeStructures │ payments                      │
└─────────────────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
   ┌──────────▼──┐  ┌───────▼────┐  ┌─────▼─────────┐
   │  Cloudinary │  │  Nodemailer│  │  Socket.io     │
   │  (File CDN) │  │  (Email)   │  │  (Real-time)   │
   └─────────────┘  └────────────┘  └───────────────┘
```

---

## 3. Frontend Architecture

### Technology
- **Framework:** Next.js 14+ (App Router)
- **Language:** JavaScript (JSX) / TypeScript (optional)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Context API + React Query (TanStack Query)
- **HTTP Client:** Axios with interceptors for token injection
- **Auth State:** JWT stored in `httpOnly` cookies (secure) or `localStorage` (dev)

### Key Design Decisions
| Decision | Rationale |
|---|---|
| Next.js App Router | File-based routing, layouts, server components, SEO |
| React Query | Automatic caching, background refetch, loading/error states |
| Context for Auth | Lightweight, no Redux overhead for auth state |
| Tailwind CSS | Rapid, consistent, utility-first styling |
| Axios interceptors | Centralized token injection and 401 handling |

### Route Groups Structure
```
/app
  /(auth)             → Login, Register pages
  /(dashboard)
    /admin/           → Admin routes
    /teacher/         → Teacher routes
    /student/         → Student routes
    /accountant/      → Accountant routes
  /(public)           → Admission form, landing page
```

---

## 4. Backend Architecture

### Technology
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **ODM:** Mongoose
- **Auth:** JSON Web Tokens (JWT) + bcrypt

### Layered Architecture

```
Request
  └→ Route (router/*.js)
       └→ Middleware (authenticate, authorize, validate)
            └→ Controller (controllers/*.js)
                 └→ Service (services/*.js)
                      └→ Model / Repository (models/*.js)
                           └→ MongoDB Atlas
```

| Layer | Responsibility |
|---|---|
| **Router** | Define HTTP method + URL + middleware chain |
| **Middleware** | Auth, RBAC, input validation, rate limiting |
| **Controller** | Parse req, call service, send response |
| **Service** | Business logic, data transformation |
| **Model** | Mongoose schema + DB query methods |

---

## 5. Database Architecture

- **Type:** NoSQL Document Database
- **Provider:** MongoDB Atlas (M0 Free → M2 Shared → M10 Dedicated)
- **ODM:** Mongoose with schema validation
- **Strategy:** Embedding for tightly coupled data, referencing for loosely coupled entities

### Reference vs Embed Decision

| Relationship | Strategy | Reason |
|---|---|---|
| User ↔ Student | Reference (userId in student) | Users are re-usable auth entities |
| Student ↔ Attendance | Reference (studentId in attendance) | Many-to-many, high write volume |
| Student ↔ Results | Reference | Queried independently |
| Student ↔ Fees | Reference | Many fee records per student |
| Course ↔ Department | Reference | Courses belong to departments |
| Notice → attachments | Embed (array of URLs) | Small, co-read data |

---

## 6. API Communication Flow

### Standard Request Flow (Authenticated)

```
Client
  → [1] Send HTTP request with Authorization: Bearer <accessToken>
  → [2] Express receives request
  → [3] authenticate middleware: validate JWT, attach req.user
  → [4] authorize middleware: check role against allowed roles
  → [5] validation middleware: sanitize and validate request body/params
  → [6] controller: extract data, call service
  → [7] service: execute business logic, call model
  → [8] model: query MongoDB Atlas
  → [9] response: return JSON { success, data, message, pagination? }
```

### Token Refresh Flow

```
Client detects 401 response
  → Send refresh token to POST /api/auth/refresh
  → Server validates refresh token
  → Server issues new access token
  → Client retries original request
```

---

## 7. File Upload Architecture

```
Client → Multer (multipart/form-data) → Cloudinary Upload
  → Store returned URL in MongoDB document
  → Serve files via Cloudinary CDN
```

---

## 8. Real-time Architecture (Phase 2+)

```
Socket.io Server (same Express instance)
  → Client connects with JWT in handshake
  → Server authenticates socket
  → Events: new_notice, fee_due_reminder, result_published
  → Rooms: role-based rooms (admin, teacher:id, student:id)
```

---

## 9. Error Handling Strategy

All API errors follow a unified response format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errorCode": "VALIDATION_ERROR",
  "errors": []
}
```

Global error handler in Express catches:
- `ValidationError` → 400
- `UnauthorizedError` → 401
- `ForbiddenError` → 403
- `NotFoundError` → 404
- `ConflictError` → 409
- Unhandled errors → 500

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
