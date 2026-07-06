# 11 — UI/UX Plan

> **Diploma Institute Management System (DIMS)**  
> Document Type: UI/UX Design Specification

---

## 1. Design Philosophy

DIMS follows a **Clean, Data-Dense, Role-Aware Dashboard** design pattern. The UI must feel professional, authoritative, and efficient — suited for administrative and academic staff who interact with it daily.

**Core Principles:**
- **Clarity over decoration** — Information hierarchy above aesthetics
- **Role-aware** — Each user sees only what's relevant to their role
- **Responsive-first** — Works on desktop, tablet, and mobile
- **Accessible** — WCAG 2.1 AA compliant (sufficient contrast, keyboard navigation)
- **Dark mode support** — Toggle between light and dark themes

---

## 2. Color System

### 2.1 Primary Palette (Light Mode)

| Token | HEX | Usage |
|---|---|---|
| `--color-primary` | `#2563EB` | CTA buttons, active nav links, focus rings |
| `--color-primary-dark` | `#1D4ED8` | Button hover states |
| `--color-secondary` | `#7C3AED` | Secondary actions, badges |
| `--color-success` | `#16A34A` | Present status, paid status |
| `--color-warning` | `#D97706` | Late status, partial payment |
| `--color-danger` | `#DC2626` | Absent status, error states |
| `--color-bg` | `#F8FAFC` | Page background |
| `--color-surface` | `#FFFFFF` | Card/panel background |
| `--color-border` | `#E2E8F0` | Dividers and borders |
| `--color-text-primary` | `#0F172A` | Main text |
| `--color-text-secondary` | `#64748B` | Labels, captions |

### 2.2 Dark Mode Overrides

| Token | HEX |
|---|---|
| `--color-bg` | `#0F172A` |
| `--color-surface` | `#1E293B` |
| `--color-border` | `#334155` |
| `--color-text-primary` | `#F1F5F9` |
| `--color-text-secondary` | `#94A3B8` |

---

## 3. Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Page Title (h1) | Inter | 24px | 700 |
| Section Title (h2) | Inter | 20px | 600 |
| Card Title (h3) | Inter | 16px | 600 |
| Body Text | Inter | 14px | 400 |
| Table Header | Inter | 13px | 600 (uppercase) |
| Table Cell | Inter | 13px | 400 |
| Caption / Label | Inter | 12px | 400 |
| Badge | Inter | 11px | 500 |

Google Font: `Inter` (weights: 400, 500, 600, 700)

---

## 4. Layout Structure

### 4.1 Dashboard Shell

```
┌─────────────────────────────────────────────────────┐
│  HEADER (Top Bar)                               [H]  │
│  Logo  |  Breadcrumb  |  Search  |  Bell  |  Avatar │
├──────────────┬──────────────────────────────────────┤
│              │                                        │
│   SIDEBAR    │         MAIN CONTENT AREA             │
│   (240px)    │                                        │
│              │   ┌─────────────────────────────┐    │
│  [Nav items] │   │  Page Header (title + CTA)  │    │
│              │   ├─────────────────────────────┤    │
│              │   │  Content (table / form / ...) │   │
│              │   └─────────────────────────────┘    │
│              │                                        │
└──────────────┴──────────────────────────────────────┘
```

- Sidebar is **collapsible** on mobile (off-canvas drawer)
- Sidebar is **pinned** on desktop
- Header is **sticky** (stays on scroll)

---

## 5. Sidebar Structure by Role

### 5.1 Admin Sidebar

```
━━━━━━━━━━━━━━━━━━━━
 🏫 DIMS
━━━━━━━━━━━━━━━━━━━━
 📊 Dashboard

 ── ACADEMICS ──
 👨‍🎓 Students
 👨‍🏫 Teachers
 🏛 Departments
 📚 Courses
 🎓 Batches

 ── OPERATIONS ──
 ✅ Attendance
 📊 Results
 💰 Fees
 📢 Notices
 📝 Admissions

 ── SYSTEM ──
 👥 User Management
 ⚙️ Settings
━━━━━━━━━━━━━━━━━━━━
 [Avatar] Admin Name
 [Logout]
```

### 5.2 Teacher Sidebar

```
━━━━━━━━━━━━━━━━━━━━
 🏫 DIMS
━━━━━━━━━━━━━━━━━━━━
 📊 Dashboard
 👤 My Profile
 ✅ Attendance
 📊 Results
 📢 Notices
━━━━━━━━━━━━━━━━━━━━
 [Avatar] Teacher Name
 [Logout]
```

### 5.3 Student Sidebar

```
━━━━━━━━━━━━━━━━━━━━
 🏫 DIMS
━━━━━━━━━━━━━━━━━━━━
 📊 Dashboard
 👤 My Profile
 ✅ My Attendance
 📊 My Results
 💰 My Fees
 📢 Notices
━━━━━━━━━━━━━━━━━━━━
 [Avatar] Student Name
 [Logout]
```

### 5.4 Accountant Sidebar

```
━━━━━━━━━━━━━━━━━━━━
 🏫 DIMS
━━━━━━━━━━━━━━━━━━━━
 📊 Dashboard
 💰 Fee Structures
 💳 Payments
 📋 Reports
 📢 Notices
━━━━━━━━━━━━━━━━━━━━
 [Avatar] Accountant Name
 [Logout]
```

---

## 6. Page Designs by Module

### 6.1 Admin Dashboard

Layout: **4-column stat cards + 2-column below (table + list)**

```
┌──────────┬──────────┬──────────┬──────────┐
│ Students │ Teachers │  Pending │  Notices │
│   324    │    42    │  Admiss. │  Active  │
│  total   │  active  │    12    │    5     │
└──────────┴──────────┴──────────┴──────────┘
┌────────────────────────┬───────────────────┐
│ Recent Admissions      │ Alerts            │
│ [Table: name, status]  │ - 18 low attend.  │
│                        │ - 45 unpaid fees  │
│                        │ - 3 pending appr. │
└────────────────────────┴───────────────────┘
```

### 6.2 Student List Page (Admin)

- **Filter bar**: department selector, batch selector, semester, status, search
- **Data table**: Avatar, Roll No, Name, Department, Batch, Semester, Status, Actions
- **Pagination**: bottom of table
- **Action buttons**: View, Edit, Change Status
- **Add Student button**: top-right CTA

### 6.3 Attendance Sheet (Teacher)

- **Course + Date selector** at top
- **Student roster table**: Roll, Name, [Present] [Absent] [Late] toggle buttons
- **Submit button**: bottom of form
- **Summary row**: auto-counts totals as teacher marks

### 6.4 Result Entry (Teacher)

- **Course + Semester + Exam Type** selectors
- **Mark entry table**: Roll, Name, Marks Obtained / Total Marks, Grade (auto-shown)
- **Save Draft / Submit** buttons
- Inline validation: cannot exceed total marks

### 6.5 Student Dashboard

- **Welcome card**: Name, Roll, Department, Semester
- **Attendance Summary**: Progress bars per subject (e.g., CST-101: 82%)
- **Recent Results**: Last published results (subject, marks, grade)
- **Fee Status**: Due amounts with payment status badges
- **Notice feed**: Last 5 active notices

---

## 7. Component Library

### 7.1 Core Components (shadcn/ui based)

| Component | Usage |
|---|---|
| `Button` | Primary, Secondary, Ghost, Destructive variants |
| `Input` | Text, Email, Password, Number inputs |
| `Select` | Dropdown selects |
| `Table` | Data tables with sorting |
| `Badge` | Status indicators (Active, Paid, Absent, etc.) |
| `Card` | Container for dashboard widgets |
| `Dialog` / `Modal` | Confirmation dialogs, form modals |
| `Toast` | Success/error notifications |
| `Avatar` | Profile images with fallback initials |
| `Skeleton` | Loading placeholder states |
| `Tabs` | Tab-based content switching |
| `Pagination` | Table pagination controls |

### 7.2 Custom Components

| Component | Description |
|---|---|
| `StatCard` | Dashboard metric cards (icon, value, label, trend) |
| `DataTable` | Full-featured table: sort, filter, pagination, row actions |
| `AttendanceSheet` | Bulk toggle interface for attendance entry |
| `MarkEntryForm` | Row-based form for entering exam marks |
| `FeeCard` | Student fee status card with payment history |
| `NoticeCard` | Notice display with audience badge and attachment |
| `StatusBadge` | Colored badge for status enums |
| `PageHeader` | Consistent page title + CTA button header |
| `EmptyState` | Illustration + message for empty lists |
| `ConfirmDialog` | "Are you sure?" destructive action dialog |

---

## 8. Responsive Design Strategy

| Breakpoint | Target | Layout Changes |
|---|---|---|
| `sm` (< 640px) | Mobile | Sidebar collapses to drawer, single column |
| `md` (640–1024px) | Tablet | Sidebar icon-only mode, 2-column grids |
| `lg` (1024px+) | Desktop | Full sidebar, 3–4 column grids |

- Tables become **horizontally scrollable** on mobile
- Forms stack vertically on mobile (single column)
- Stat cards stack 2×2 on tablet, 4×1 on desktop

---

## 9. Dark Mode Implementation

- Controlled via `<html class="dark">` toggle
- Tailwind `dark:` variants for all color tokens
- User preference stored in `localStorage`
- Respects OS-level `prefers-color-scheme` on first load
- Toggle button in Header (sun/moon icon)

---

## 10. Accessibility Standards

- **Contrast ratio**: Minimum 4.5:1 for text (WCAG AA)
- **Focus rings**: Visible on all interactive elements
- **ARIA labels**: All icon buttons and form controls labeled
- **Keyboard navigation**: Full tab-order throughout the app
- **Screen reader**: Semantic HTML (nav, main, section, table headers)
- **Error messages**: Linked to form inputs via `aria-describedby`

---

## 11. Loading & Error States

| State | Design Pattern |
|---|---|
| Page loading | Full-page skeleton with shimmer effect |
| Table loading | Skeleton rows (5 rows of gray bars) |
| Form submitting | Button shows spinner + "Saving..." text |
| API error | Toast notification (red, auto-dismiss 5s) |
| Empty list | EmptyState component (icon + helpful message) |
| 404 page | Friendly error page with "Go to Dashboard" button |
| 403 page | "Access Denied" with role explanation |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
