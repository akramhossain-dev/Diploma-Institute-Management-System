# Phase 0.1 — Authentication Design

> **Diploma Institute Management System (DIMS)**  
> Document: Entity-Based Authentication Architecture

---

## 1. The Authentication Problem in Entity-Based Systems

In a unified-user system, authentication is simple — one collection, one login endpoint, one JWT payload structure. In an entity-based system, each actor type is a distinct entity with different data profiles and access scopes.

DIMS solves this with **Option A: Separate Auth Collections**, which is the recommended production approach.

---

## 2. Option Comparison

### Option A — Separate Auth Collections (✅ Recommended)

Four dedicated auth collections, each linked to its entity collection by reference:

```
student_auth    { email, passwordHash, studentId → ref students }
teacher_auth    { email, passwordHash, teacherId → ref teachers }
accountant_auth { email, passwordHash, accountantId → ref accountants }
admin_auth      { email, passwordHash, adminId → ref admins }
```

**Login endpoints:**
```
POST /api/auth/student/login
POST /api/auth/teacher/login
POST /api/auth/accountant/login
POST /api/auth/admin/login
```

---

### Option B — Login from Entity Collections (❌ Not Recommended for Production)

Store `passwordHash` directly on the entity document:

```
students { _id, name, email, passwordHash, ... }
teachers { _id, name, email, passwordHash, ... }
```

---

## 3. Why Option A is Superior

| Dimension | Option A (Separate Auth) | Option B (Entity Auth) |
|---|---|---|
| **Security Isolation** | Auth breach exposes only credentials, not full entity profile | Auth breach exposes full profile + credentials |
| **Schema Clarity** | Entity collections are pure domain data | Entity collections carry mixed concerns |
| **Mongoose `select: false`** | Only one field to protect per collection | Must protect field across multiple large schemas |
| **Token Invalidation** | Centralized in auth collection — one place to invalidate | Scattered across entity collections |
| **Future-Proofing** | Can add OAuth/SSO to auth collections without touching entity schema | Requires entity schema migration |
| **Multiple Auth Methods** | Auth collection can hold `googleId`, `phoneOtp`, etc. without polluting entity | Entity schema bloats with each new auth method |
| **Audit & Session Logging** | Auth events neatly isolated in one collection per entity type | Mixed with entity data |

**Conclusion: Option A is mandatory for production-grade systems.**

---

## 4. JWT Token Design

### 4.1 Token Payload Structure

Each entity type produces a JWT with a different `entityType` claim:

**Student JWT:**
```json
{
  "sub": "<student_auth._id>",
  "entityId": "<students._id>",
  "entityType": "student",
  "studentId": "CST-2024-001",
  "iat": 1720000000,
  "exp": 1720000900
}
```

**Teacher JWT:**
```json
{
  "sub": "<teacher_auth._id>",
  "entityId": "<teachers._id>",
  "entityType": "teacher",
  "employeeId": "TCH-2023-005",
  "iat": 1720000000,
  "exp": 1720000900
}
```

**Accountant JWT:**
```json
{
  "sub": "<accountant_auth._id>",
  "entityId": "<accountants._id>",
  "entityType": "accountant",
  "staffId": "ACC-2023-001",
  "iat": 1720000000,
  "exp": 1720000900
}
```

**Admin JWT:**
```json
{
  "sub": "<admin_auth._id>",
  "entityId": "<admins._id>",
  "entityType": "admin",
  "adminId": "ADM-001",
  "isSuperAdmin": true,
  "iat": 1720000000,
  "exp": 1720000900
}
```

### 4.2 Token Configuration

| Property | Access Token | Refresh Token |
|---|---|---|
| Secret | `JWT_SECRET` (env) | `JWT_REFRESH_SECRET` (env) |
| Algorithm | HS256 | HS256 |
| Expiry | 15 minutes | 7 days |
| Storage | Memory / httpOnly cookie | httpOnly cookie only |

---

## 5. Middleware Architecture

### 5.1 `authenticate` Middleware

Used on all protected routes. Verifies the JWT and attaches entity info to `req`.

```
Request → authenticate middleware:
  1. Extract token from Authorization header or httpOnly cookie
  2. Verify JWT signature and expiry
  3. Attach to req:
     req.entityType  = "student" | "teacher" | "accountant" | "admin"
     req.entityId    = ObjectId (entity collection _id)
     req.authId      = ObjectId (auth collection _id)
     req.isSuperAdmin = boolean (admin only)
  4. Pass to next middleware or return 401
```

### 5.2 `authorizeEntity(...entityTypes)` Middleware

Guards routes by entity type. Replaces traditional RBAC `authorize(roles)`.

```
authorizeEntity('admin')              → only admins
authorizeEntity('teacher')            → only teachers
authorizeEntity('admin', 'teacher')   → admins and teachers
authorizeEntity('student')            → only students
authorizeEntity('admin', 'accountant') → admins and accountants
```

**Usage in routes:**
```
router.get('/students', authenticate, authorizeEntity('admin', 'teacher'), ...)
router.get('/students/me', authenticate, authorizeEntity('student'), ...)
router.post('/fees/:id/payment', authenticate, authorizeEntity('accountant', 'admin'), ...)
```

### 5.3 `authorizeOwner` Middleware

For self-access routes — validates that the requesting entity is accessing their own resource:

```
Request to GET /api/students/:id
  → authenticate (attaches req.entityId, req.entityType)
  → authorizeOwner:
      if entityType === 'student':
        check req.entityId === req.params.id → allow
        else → 403 Forbidden
      if entityType === 'admin':
        → allow (admin can view any student)
      else → 403 Forbidden
```

---

## 6. Login Flow (Option A)

```
[Student Login Request]
POST /api/auth/student/login
Body: { email, password }

Step 1: Find record in student_auth where email = payload.email
Step 2: If not found → return 401 "Invalid credentials"
Step 3: Compare payload.password with student_auth.passwordHash
Step 4: If mismatch → return 401 "Invalid credentials"
Step 5: Check student_auth.isActive === true → else 403 "Account disabled"
Step 6: Load student profile from students collection using student_auth.studentId
Step 7: Generate access token (entityType: "student", entityId: student._id)
Step 8: Generate refresh token → hash → store in student_auth.refreshToken
Step 9: Set refresh token in httpOnly cookie
Step 10: Return access token + student profile (no auth data)
```

---

## 7. Refresh Token Flow

```
POST /api/auth/student/refresh
Cookie: refreshToken=<token>

Step 1: Extract refresh token from cookie
Step 2: Find student_auth record where refreshToken hash matches
Step 3: Verify refresh token JWT validity
Step 4: Issue new access token
Step 5: Rotate refresh token (issue new, update in DB)
Step 6: Return new access token
```

---

## 8. Logout Flow

```
POST /api/auth/student/logout
Header: Authorization: Bearer <accessToken>

Step 1: authenticate middleware validates token
Step 2: Find student_auth record using req.authId
Step 3: Clear student_auth.refreshToken (set to null)
Step 4: Clear httpOnly cookie (set expired)
Step 5: Return 200 OK
```

---

## 9. Password Change Flow

```
PUT /api/auth/student/change-password
Header: Authorization: Bearer <accessToken>
Body: { currentPassword, newPassword }

Step 1: authenticate middleware (student entity only)
Step 2: Load student_auth using req.authId
Step 3: Verify currentPassword against stored hash
Step 4: Hash newPassword (bcrypt, cost 12)
Step 5: Update student_auth.passwordHash = newHash
Step 6: Set student_auth.passwordChangedAt = now
Step 7: Invalidate all existing refresh tokens (clear refreshToken field)
Step 8: Return 200 — force re-login
```

---

## 10. Auth Endpoint Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/student/login` | Public | Student login |
| POST | `/api/auth/student/refresh` | Cookie | Refresh student token |
| POST | `/api/auth/student/logout` | Auth | Student logout |
| PUT | `/api/auth/student/change-password` | Auth | Change student password |
| POST | `/api/auth/teacher/login` | Public | Teacher login |
| POST | `/api/auth/teacher/refresh` | Cookie | Refresh teacher token |
| POST | `/api/auth/teacher/logout` | Auth | Teacher logout |
| PUT | `/api/auth/teacher/change-password` | Auth | Change teacher password |
| POST | `/api/auth/accountant/login` | Public | Accountant login |
| POST | `/api/auth/accountant/refresh` | Cookie | Refresh accountant token |
| POST | `/api/auth/accountant/logout` | Auth | Accountant logout |
| POST | `/api/auth/admin/login` | Public | Admin login |
| POST | `/api/auth/admin/refresh` | Cookie | Refresh admin token |
| POST | `/api/auth/admin/logout` | Auth | Admin logout |
| PUT | `/api/auth/admin/change-password` | Auth | Change admin password |

---

## 11. Account Creation (Admin-Initiated)

Admins create accounts for other entities. The flow is:

```
Admin creates teacher:
  POST /api/teachers  (admin only)
  Body: { fullName, email, phone, departmentId, ... }

Step 1: Create teachers document → get teachers._id
Step 2: Auto-generate temporary password
Step 3: Hash temporary password
Step 4: Create teacher_auth document:
        { email, passwordHash, teacherId: teachers._id, isActive: true }
Step 5: Send login credentials to teacher via email
Step 6: Teacher must change password on first login (enforced via passwordChangedAt = null check)
```

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0.1*
