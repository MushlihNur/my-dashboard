# Project Context

This document provides a comprehensive overview of the context, architecture, and conventions of the **My Dashboard** project. It is useful for onboarding new developers, as a reference during development, or for providing context to an AI assistant.

---

## Overview

**My Dashboard** is a personal and family dashboard for managing finances, tracking goals, and storing important information.

- **Target user**: Personal and family use
- **Status**: Active development
- **Demo**: [https://my-dashboard-demo-rosy.vercel.app](https://my-dashboard-demo-rosy.vercel.app)
- **Demo credentials**: `guest@demo.com` / `demo123`

---

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Framework    | Next.js 16 (App Router), TypeScript     |
| Styling      | Tailwind CSS v4, shadcn/ui              |
| Database     | PostgreSQL via Supabase                 |
| Auth         | Supabase Auth                           |
| Charts       | Recharts                                |
| Drag & Drop  | dnd-kit                                 |
| Date         | date-fns, react-day-picker              |
| Notification | Sonner (toast)                          |
| Package Mgr  | pnpm                                    |
| Deployment   | Vercel                                  |

---

## Project Structure

```bash
src/
├── app/ # Next.js App Router
│   ├── (auth)/login/ # Login page
│   └── (dashboard)/ # Protected routes
│       ├── (home)/ # Home page
│       ├── finance/ # Finance module
│       │   ├── expenses/
│       │   ├── income/
│       │   ├── summary/
│       │   └── goals/[id]/
│       ├── profile/
│       ├── family/ # Coming soon
│       └── documents/ # Coming soon
├── components/
│   ├── finance/ # Finance-specific components
│   ├── home  Home page components
│   ├── profile/ # Profile components
│   ├── layout/ # Sidebar, navigation
│   └── ui/ # Generic reusable components
└── lib/
    ├── api/ # Supabase query functions
    │   ├── expenses.ts
    │   ├── income.ts
    │   ├── goals.ts
    │   ├── budget.ts
    │   ├── categories.ts
    │   └── profile.ts
    ├── mock/ # Mock data (development reference)
    ├── supabase/ # Supabase client & generated types
    │   ├── client.ts # Browser client
    │   ├── server.ts # Server client
    │   ├── types.ts # Generated types (pnpm supabase gen types)
    │   └── types-helper.ts # Derived helper types
    ├── format.ts # formatRupiah, formatDate
    ├── summary.ts # aggregateByCategory, totalPerMonth, grandTotal
    └── toast.ts # notify.success, notify.error wrapper
```

---

## Database Schema

### Tables

| Table             | Description                                    |
|-------------------|------------------------------------------------|
| `profiles`        | User profile data (extends auth.users)         |
| `categories`      | Master data for expense & income categories    |
| `expenses`        | Expense transactions                           |
| `income`          | Income transactions                            |
| `monthly_budgets` | Monthly expense limits                         |
| `goals`           | Financial goals                                |
| `goal_snapshots`  | History current amount per goal per bulan      |

### Key Relations

```
auth.users → profiles (1:1, auto-created via trigger)
profiles → expenses (1:many)
profiles → income (1:many)
profiles → monthly_budgets (1:many)
profiles → goals (1:many)
goals → goal_snapshots (1:many)
categories → expenses (1:many)
categories → income (1:many)
```
*Note: All tables have Row Level Security (RLS) enabled, filtering by profile_id or user ID to ensure data isolation between personal and demo accounts.*

### RPC Functions
- `update_goals_sort_order(updates JSONB)` — batch update sort_order goals

### Migration
Migration files are located in `supabase/migrations/`. To apply:
```bash
pnpm supabase db push
```

---

## Design System

### Color Palette
```css
--color-c1: #F1F6F9  /* Main background */
--color-c2: #394867  /* Secondary text, sidebar nav */
--color-c3: #212A3E  /* Primary text, sidebar background */
--color-c4: #D9D9D9  /* Border, divider */
```

### Component Libraries
- **shadcn/ui** — Button, Dialog, Calendar, Popover, Separator
- **Tailwind CSS v4** — utility classes, custom colors via `@theme`
- **Lucide React** — icons

### Key UI Components (`src/components/ui/`)
| Component               | Description                              |
|-------------------------|------------------------------------------|
| `stats-card.tsx`        | Generic stats card dengan label + value  |
| `form-input.tsx`        | Input dengan label, support formatNumber |
| `date-picker.tsx`       | Single date picker (shadcn Calendar)     |
| `date-range-picker.tsx` | Date range picker                        |
| `confirm-dialog.tsx`    | Reusable delete confirmation dialog      |

---

## Architecture & Patterns

### State Management
- **Lift state up** to the page level for data used by multiple sibling components.
- No global state management (Redux/Zustand) — not needed for this scale.

### API Layer
All Supabase queries are located in `src/lib/api/` — components do not import the Supabase client directly.
```bash
Page/Component → src/lib/api/*.ts → Supabase
```

### Dialog Pattern (Upsert)
All form dialogs use the **upsert pattern** — a single component handles both add and edit:
```tsx
// Add mode
<ExpenseFormDialog onSuccess={fn} />

// Edit mode  
<ExpenseFormDialog expense={existing} open={bool} onClose={fn} onSuccess={fn} />
```

### Data Fetching
- Client-side fetching using `useEffect` + `useState`
- `useCallback` for fetch functions passed as dependencies.
- `Promise.all` for parallel fetching.

### Error Handling
- Toast notifications via `src/lib/toast.ts`
- `notify.success("message")` and `notify.error("message")`
- No global error boundary (not yet implemented).

### Routing & Middleware
- `src/middleware.ts` — Protects all routes, redirects to `/login` if not authenticated.
- Route groups: `(auth)` for login pages, `(dashboard)` for protected pages.

---

## Conventions

### Language
- **UI labels, buttons, headers** → English
- **Data konten** (expense categories, descriptions) → Indonesian
- **Code** → English (variable names, function names, comments)

### Expense Categories
makan-minum, transportasi, tempat-tinggal, pribadi, kasih-sayang, berbagi, dana-darurat, investasi, other

### Income Categories
salary, other

### Number Formatting
- Currency: `formatRupiah(amount)` → `Rp 1.000.000`
- Input: `FormInput` with `formatNumber` prop for thousand separators

### Date Formatting
- Display: `format(parseISO(date), "dd MMM yyyy")` → `01 Jan 2024`
- DB storage: `yyyy-MM-dd` format

---

## Features Status

### ✅ Completed
- Auth (login/logout) via Supabase Auth
- Home — finance snapshot + goals highlight + quick actions + dynamic greeting
- Finance
  - Expenses — full CRUD + date range filter + category filter
  - Income — full CRUD + date range filter + category filter
  - Goals — full CRUD + drag-drop reorder + snapshot history + progress chart
  - Overview — monthly snapshot (income, limit, expenses, balance)
  - Summary — yearly table per category dengan filter tahun
  - Monthly budget/limit — set per bulan
- Profile — personal info + change password
- Toast notifications (Sonner)
- Dynamic page titles
- Responsive sidebar (collapsible + mobile hamburger)
- Data migration scripts (CSV import, dev→prod)
- Deploy: Vercel (personal + demo)
- Database migrations (Supabase CLI)

### 🚧 In Progress / Coming Soon
- Family — listing + family member details
- Documents — save important documents + shareable link with expiry
- Role management — owner can see everything, family members only see their own

### 💡 Planned
- AI integration for financial analysis
- Month filter in Finance Overview
- Expired document notifications
- Birthday reminders on Home

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon/public key
```

---

## Deployment

| Environment | Vercel Project       | Supabase Project  |
|-------------|----------------------|-------------------|
| Development | local                | my-dashboard-dev  |
| Production  | my-dashboard         | my-dashboard      |
| Demo        | my-dashboard-demo    | my-dashboard      |

Personal and demo environments use **the same Supabase project** but different users — data is isolated via RLS.

---

## Important Notes

- `src/middleware.ts` — do not rename it; Next.js requires this exact filename
- `src/lib/supabase/types.ts` — auto-generated; do not edit manually. Regenerate after a schema change
- `src/lib/mock/` — mock data for development reference; not used in production
- `sort_order` in goals is updated via an RPC function rather than a direct update, due to RLS constraints

---

## Git Branches

| Branch | Purpose                                                      |
|--------|--------------------------------------------------------------|
| `main` | Production — auto-deploy to Vercel                           |
| `dev`  | Development — submit a pull request to `main` for deployment |

---

## Scripts

```bash
pnpm dev                    # Run development server
pnpm build                  # Build for production
pnpm supabase gen types typescript --project-id <id> --schema public > src/lib/supabase/types.ts
                            # Regenerate Supabase types after schema changes
pnpm supabase db push       # Apply migrations to the DB
```