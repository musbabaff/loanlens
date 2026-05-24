<div align="center">
  <br />
    <h1 align="center">LoanLens</h1>
  <br />
  <p align="center">
    <strong>"See through every loan application"</strong>
    <br />
    An AI-powered credit memo generation platform for modern financial institutions.
  </p>
  <p align="center">
    <a href="https://loanlens.example.com">View Demo</a>
    ·
    <a href="https://github.com/loanlens/loanlens/issues">Report Bug</a>
    ·
    <a href="https://github.com/loanlens/loanlens/issues">Request Feature</a>
  </p>
  <p align="center">
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img alt="Claude AI" src="https://img.shields.io/badge/Claude_AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white" />
  </p>
</div>

<hr />

## 📖 About The Project

**LoanLens** transforms hours of manual financial document analysis into a seamless, seconds-long automated workflow. By leveraging advanced Vision LLMs (Anthropic Claude), it extracts structured data directly from bank statements, tax returns, and business plans, detects financial anomalies, and automatically generates comprehensive, audit-ready credit memos.

### ✨ Key Features

- **🧠 AI-Powered Data Extraction:** Automatically parse complex financial PDFs (Bank Statements, Tax Returns, Business Plans, IDs) into structured JSON using Claude Vision.
- **⚡ Real-time Processing Pipeline:** Concurrent document extraction with progress tracking and robust fallback mechanisms.
- **🛡️ Risk & Fraud Detection:** Intelligent anomaly detection identifying unusual transaction patterns, red flags, and inconsistencies.
- **🔐 Enterprise-Grade Security:** Full Row Level Security (RLS) on database and storage via Supabase.
- **🎨 Premium Dark UI:** A meticulously crafted, brand-aligned "terminal-meets-editorial" interface using Tailwind CSS and shadcn/ui.
- **📊 Interactive Dashboards:** Visualize cash flows, income sources, and application status at a glance.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Storage, Realtime)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **AI Integration:** [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) (Claude 3.5 Sonnet / 3.7 Sonnet)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20+)
- [pnpm](https://pnpm.io/) (v9+)
- A [Supabase](https://supabase.com) account & project
- An [Anthropic](https://console.anthropic.com/) API Key

### 1. Installation & Environment

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/loanlens.git
cd loanlens
pnpm install
```

Copy the environment variables template and configure it:

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 2. Database Initialization

Navigate to your Supabase SQL Editor and execute all migration files located in `supabase/migrations/` in order. 
*(Alternatively, use the Supabase CLI if configured: `supabase migration up`)*

Make sure you have enabled **Realtime** (Replication) for the `extractions` table in your Supabase Dashboard to see live extraction updates in the UI.

### 3. Run Development Server

```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
loanlens/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Backend endpoints (Document upload, AI extraction)
│   └── dashboard/        # Authenticated UI (Applications, Memos, Settings)
├── components/           # Reusable UI components (shadcn/ui + custom)
│   ├── applications/     # Application details and tabs
│   ├── extraction/       # AI extraction summaries and status cards
│   └── ui/               # Core design system components
├── lib/                  # Utilities and services
│   ├── ai/               # Anthropic client, Prompts, Extractors, Schemas
│   └── supabase/         # Supabase client configurations
├── supabase/             # Database migrations and policies
└── types/                # Global TypeScript definitions
```

---

## 🛡️ Security & Privacy

- All document processing occurs strictly via secure, authenticated API routes.
- Documents are stored in private Supabase buckets protected by strict Row Level Security (RLS) policies.
- AI processing requires authenticated sessions and limits data exposure per strict system prompts.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
