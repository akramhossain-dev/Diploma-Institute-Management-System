# 09 — Security Rules

> **Diploma Institute Management System (DIMS)**  
> Document Type: Security Specification

---

## 1. Security Overview

DIMS implements a multi-layered security model covering authentication, authorization, input integrity, transport security, and data protection. All security rules are enforced server-side; client-side checks are supplementary only.

---

## 2. Authentication Security

### 2.1 JWT Token Strategy

| Property | Access Token | Refresh Token |
|---|---|---|
| Algorithm | HS256 | HS256 |
| Secret | `JWT_SECRET` (env) | `JWT_REFRESH_SECRET` (env) |
| Expiry | 15 minutes | 7 days |
| Storage (Frontend) | In-memory / httpOnly cookie | httpOnly cookie only |
| Transmission | `Authorization: Bearer <token>` header | Sent via cookie |

**Rules:**
- JWT secrets MUST be at least 64 characters long, randomly generated
- Secrets MUST be rotated if a breach is suspected
- Access tokens MUST NOT be stored in `localStorage` in production
- Refresh tokens MUST be hashed before storage in DB (to prevent DB compromise attacks)
- On logout, refresh token MUST be invalidated server-side

### 2.2 Password Security

- Algorithm: **bcrypt** with cost factor 12 (minimum)
- Passwords must meet complexity requirements (enforced via validation):
  - Minimum 8 characters
  - At least 1 uppercase, 1 lowercase, 1 digit, 1 special character
- Passwords MUST NEVER be stored in plaintext or logged
- Password fields MUST be excluded from all API responses (Mongoose `select: false`)
- Brute-force protection via rate limiting on `/api/auth/login`

### 2.3 Session Management

- Stateless auth via JWT — no server-side session storage
- On password change: all existing refresh tokens for that user MUST be invalidated
- On account deactivation: all tokens for that user MUST be rejected

---

## 3. Authorization (RBAC)

### 3.1 Middleware Chain

Every protected endpoint passes through:

```
Request
  → authenticate middleware (verify JWT, attach req.user)
  → authorize middleware (check role is allowed)
  → optional: resource ownership check (in controller/service)
  → controller
```

### 3.2 Role Enforcement Rules

- Roles are embedded in the JWT payload — no DB lookup needed per request
- If a user's role changes, existing tokens remain valid until expiry; the role change takes full effect after re-login
- The `authorize` middleware is a factory function accepting an array of allowed roles:

```javascript
authorize('admin', 'teacher')
// Returns 403 Forbidden if req.user.role not in ['admin', 'teacher']
```

### 3.3 Resource Ownership

For student/teacher accessing own data:
- Controller compares `req.user.id` against the resource's `userId` field
- Mismatch returns `403 Forbidden` (not `404`) to avoid information leakage

### 3.4 Admin Bypass

- Admin role bypasses all resource-level ownership checks
- Admin cannot be created via API — must be seeded via CLI script or direct DB insertion (production bootstrap)

---

## 4. Input Validation & Sanitization

### 4.1 Server-Side Validation

All API inputs MUST be validated server-side using `express-validator`:

- **String fields:** Trim whitespace, check length, escape HTML
- **Email fields:** `isEmail()`, normalize to lowercase
- **Number fields:** `isNumeric()`, min/max range checks
- **Date fields:** `isISO8601()` format
- **Enum fields:** `isIn([...allowedValues])`
- **ObjectId fields:** `isMongoId()` format check

### 4.2 Sanitization Rules

- Strip all HTML tags from text inputs (XSS prevention)
- Reject requests with unexpected/extra fields (strict schema)
- Validate MongoDB ObjectIds before DB queries to prevent CastErrors

### 4.3 File Upload Validation

- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- Maximum file size: 5MB per file
- Files are uploaded to Cloudinary — not stored locally on the server
- Validate file type by magic bytes (not just extension) — Multer filter

---

## 5. API Rate Limiting

Using `express-rate-limit`:

| Endpoint Group | Limit | Window |
|---|---|---|
| `POST /api/auth/login` | 10 requests | 15 minutes |
| `POST /api/admissions` (public) | 5 requests | 1 hour |
| All other authenticated endpoints | 100 requests | 15 minutes |
| All other public endpoints | 30 requests | 15 minutes |

Rate limit responses return `429 Too Many Requests` with a `Retry-After` header.

---

## 6. Transport Security (HTTPS)

- All production traffic MUST use HTTPS (TLS 1.2+)
- HTTP requests MUST be redirected to HTTPS (301)
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Certificates managed by Vercel (frontend) and Render/Railway (backend)

---

## 7. HTTP Security Headers

Using `helmet` middleware:

| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | Restricted to own origins + Cloudinary CDN |
| `X-XSS-Protection` | `1; mode=block` |
| `Permissions-Policy` | Restrict camera, microphone, geolocation |

---

## 8. CORS Policy

```javascript
cors({
  origin: process.env.CLIENT_URL,   // Only allow frontend origin
  credentials: true,                // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
```

- Wildcard `*` origin is strictly FORBIDDEN in production
- Preflight `OPTIONS` requests are handled automatically

---

## 9. Data Protection Rules

### 9.1 Sensitive Field Exclusion

Fields that MUST NEVER appear in API responses:
- `password` (Mongoose: `select: false`)
- `refreshToken` (Mongoose: `select: false`)
- `__v` (Mongoose version key)

### 9.2 Data Minimization

- API responses return only fields necessary for the use case
- Paginated list endpoints return summary fields only (no full nested objects)
- Student list: no guardian details, no SSC info (only on individual GET)

### 9.3 Environment Variable Security

- ALL secrets in `.env` files — NEVER hardcoded in source
- `.env` is in `.gitignore` — NEVER committed to version control
- `.env.example` with placeholder values is committed as documentation
- Production env variables set via platform secret managers (Vercel / Render dashboard)

---

## 10. Logging & Monitoring

### 10.1 What to Log

| Event | Log Level |
|---|---|
| Successful login | INFO |
| Failed login attempt | WARN |
| Authorization failure (403) | WARN |
| Input validation failure | INFO |
| Server errors (500) | ERROR |
| DB connection issues | ERROR |

### 10.2 What NEVER to Log

- Passwords (plaintext or hashed)
- JWT tokens
- Full request bodies containing sensitive PII
- Credit card or payment details

### 10.3 Log Storage

- Development: Console (morgan + winston console transport)
- Production: File transport (`logs/error.log`, `logs/combined.log`) + optionally forwarded to logging service (Logtail, Papertrail)

---

## 11. Security Checklist (Pre-Deployment)

- [ ] JWT secrets are strong (64+ chars), stored in env
- [ ] bcrypt cost factor is 12+
- [ ] All auth routes rate-limited
- [ ] All inputs validated server-side
- [ ] File uploads validated by type and size
- [ ] HTTPS enforced, HTTP redirected
- [ ] CORS restricted to frontend domain
- [ ] Helmet headers enabled
- [ ] `password` and `refreshToken` excluded from API responses
- [ ] No secrets in source code or git history
- [ ] Error messages do not expose stack traces in production
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Database user has minimum required permissions

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
