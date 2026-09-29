# My Dashboard

A personal and family dashboard to manage finances, track goals, and store important information - built as a portfolio project.

🔗 **[Live Demo](https://my-dashboard-demo-rosy.vercel.app/)**

## 🔐 Demo Credentials
Email: guest@demo.com

Password: demo123

## ✨ Features
- **Home** — monthly finance snapshot and top goals overview
- **Finance**
  - Track monthly expenses and income with category breakdown
  - Set monthly spending limits
  - Financial goals with progress tracking and snapshot history
  - Yearly summary report across all categories
- **Profile** — manage personal information and account settings
- **Family** *(coming soon)*
- **Documents** *(coming soon)*

## 🛠 Tech Stack
| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 16 (App Router), TypeScript |
| Styling    | Tailwind CSS, shadcn/ui             |
| Backend    | Next.js API Routes, Supabase        |
| Database   | PostgreSQL (Supabase)               |
| Auth       | Supabase Auth                       |
| Charts     | Recharts                            |
| Drag & Drop| dnd-kit                             |
| Deployment | Vercel                              |


## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Supabase account

### Installation

1. Clone the repo
```bash
   git clone https://github.com/MushlihNur/my-dashboard.git
   cd my-dashboard
```

2. Install dependencies
```bash
   pnpm install
```

3. Setup environment variables
```bash
   cp .env.example .env.local
```
      Fill in your Supabase credentials:
```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
   pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

1. Link your Supabase project
```bash
   pnpm supabase link --project-ref your-project-ref
```

2. Run migrations
```bash
   pnpm supabase db push
```

   Or manually run the SQL files in `supabase/migrations/` via Supabase SQL Editor in order.