# Crew2you Bokningssystem

> Bokningssystem för Crew2you Sverige AB — byggt av Samify.

Multitenant React + Supabase-applikation som ersätter Excel + manuella mailflöden med strukturerad pipeline, mobilapp för personal, AI-matchning och automationer.

![Stack](https://img.shields.io/badge/stack-React%2018-61dafb)
![TS](https://img.shields.io/badge/TypeScript-5.5-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-latest-3ecf8e)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06b6d4)
![License](https://img.shields.io/badge/License-Proprietary-c4a758)

---

## Snabbstart

### 1. Klona och installera

```bash
npm install
cp .env.example .env
```

### 2. Sätt upp Supabase

**Skapa ett projekt på [supabase.com](https://supabase.com):**

- Region: `eu-north-1` (Stockholm) — viktigt för latency och GDPR
- Pris: Pro (rekommenderas direkt för Crew2you, $25/mån)

**Hämta credentials från Project Settings → API:**

- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` key → `VITE_SUPABASE_ANON_KEY`

Lägg in i `.env`.

### 3. Kör migrations

**Alternativ A — Supabase CLI (rekommenderas):**

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

**Alternativ B — manuellt via SQL Editor:**

Kopiera filerna i `supabase/migrations/` i ordning och kör i Supabase Studio → SQL Editor.

### 4. Generera typer

```bash
supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.ts
```

### 5. Skapa första super admin-användaren

Gå till Supabase Studio → Authentication → Users → Add user. Skapa konto för `adnan@samify.se` och `rasmus@samify.se` — dessa får automatiskt `super_admin`-roll via `handle_new_user`-triggern.

För Carina (Crew2you VD): skapa konto med hennes mail. Sedan i SQL Editor:

```sql
UPDATE user_profiles
SET role = 'org_admin', full_name = 'Carina [Efternamn]'
WHERE email = 'carina@crew2you.se';
```

### 6. Kör

```bash
npm run dev
```

Öppna http://localhost:5173 → logga in med magic link.

---

## Tech stack

| Lager | Verktyg |
|---|---|
| Frontend | React 18 + TypeScript 5.5 |
| Build | Vite 5 + SWC |
| Routing | React Router 6 |
| State | Zustand (UI) + TanStack Query (server) |
| Styling | Tailwind 3.4 + custom design tokens |
| Forms | React Hook Form + Zod |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| Hosting | Netlify |
| Mail | Resend |
| SMS | 46elks |
| AI | Anthropic Claude (Sonnet 4.6) |
| Fakturering | Fortnox API |

---

## Projektstruktur

```
src/
├── lib/              # Supabase-klient, utils
├── types/            # TypeScript-typer (genererade från Supabase)
├── stores/           # Zustand-stores (auth, UI state)
├── hooks/            # Custom React hooks (data fetching)
├── components/
│   ├── ui/           # Återanvändbara UI-byggstenar
│   ├── layout/       # Sidebar, layouts per roll
│   ├── bookings/     # Bokningskort, pipeline, modaler
│   ├── customers/    # Kund- och butikskomponenter
│   ├── personnel/    # Personalkomponenter
│   ├── inbox/        # AI-mailparsning UI
│   └── automations/  # Autoflow UI
├── pages/
│   ├── auth/         # Login, callback
│   ├── admin/        # Admin-sidor (kontor)
│   ├── personal/     # Personalapp (mobilvy)
│   └── kund/         # Kundportal
├── routes/           # ProtectedRoute m.m.
└── styles/           # Global CSS

supabase/
├── migrations/       # Schema + RLS + seed
├── functions/        # Edge Functions (AI, integrations)
└── config.toml       # Supabase-projekt-config

docs/
├── ROADMAP.md        # Fasplan
├── ARCHITECTURE.md   # Arkitekturbeslut
└── DEPLOYMENT.md     # Deploy-guide
```

---

## Roller

| Roll | Vem | Åtkomst |
|---|---|---|
| `super_admin` | Adnan, Rasmus (Samify) | Alla orgs, support, impersonate |
| `org_admin` | Carina (Crew2you VD) | Allt inom egen org + användarhantering |
| `org_user` | Övriga kontor | Bokningar + register, inga inställningar |
| `personnel` | Demovärdar | Egna uppdrag, utlägg, återrapporter |
| `customer` | Uppdragsgivare | Egna bokningar och rapporter |

Roller styrs av `user_role`-enum i Postgres och **Row Level Security**-policies. Backend-säkerhet, inte bara UI-gömning.

---

## Utveckling

```bash
npm run dev          # Dev server (port 5173)
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run format       # Prettier
npm run supabase:types  # Regenerera DB-typer
```

---

## Deployment

Auto-deploy från `main` branch till Netlify. Manuell deploy:

```bash
netlify deploy --prod
```

Domän: `bokning.crew2you.se` (Enterprise-paketet)

Environment variables sätts i Netlify Dashboard → Site settings → Environment variables.

---

## Roadmap

Se [`docs/ROADMAP.md`](./docs/ROADMAP.md) för fasplanen. Kort:

- **Fas 1 (vecka 1-2):** Auth, pipeline, register, mobilapp — driftsätt MVP
- **Fas 2 (vecka 3-4):** Autoflow, AI-mailparsning, AI-matchning, kundportal
- **Fas 3 (vecka 5-6):** Fortnox, SIE-export, kalendersync, Enterprise-funktioner

---

## Licens & ansvar

Proprietär kod. Tillhör Samify AB. Kunden (Crew2you Sverige AB) har full användningsrätt enligt servicekontrakt.

Kontakt: [hello@samify.se](mailto:hello@samify.se)
