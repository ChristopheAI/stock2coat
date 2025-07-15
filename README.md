# Stock2coat – MVP Product & Architecture

*Version 2.2 · 15 Jul 2025*\
*Authors: Christophe & ChatGPT o3*

---

## 📑 Inhoudsopgave

1. Business‑ & Marktcontext
2. Product Requirements Document (PRD)
3. Systeem‑ & Software‑architectuur

---

## 1 · Business‑ & Marktcontext

| Element             | Inhoud                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| **Marktgrootte**    | ±800 Belgische poedercoating­bedrijven (+ ≈200 in NL)                                                    |
| **Pilot‑klant**     | **Strameco** – realtime testpartner vanaf augustus 2025                                                  |
| **Expert‑partners** | Frank (40 jaar industrie) & Laurens (operations) leveren domeinkennis & feedback via WhatsApp stand‑ups. |
| **Expansieplan**    | Uitrol naar Nederland in **Q4 2025** na validatie België.                                                |

---

## 2 · Product Requirements Document (PRD)

### 2.1 Productvisie

Stock2coat is een **multi‑tenant SaaS‑inventorysysteem** voor poedercoating­bedrijven. Het platform geeft realtime inzicht in poederlak‑voorraad, garandeert tenant‑isolatie en reduceert manuele tel‑fouten met ≥ 75 %.

### 2.2 MVP‑Doelen

Een minimaal werkend systeem waarmee een lakkerij:

- **Voorraaditems beheert** (CRUD)
- **Veilig inlogt** (Supabase Auth) en **alleen eigen data** ziet (RLS)
- **Dashboard** heeft met voorraad‑KPI’s & lage‑voorraad waarschuwingen

> Geavanceerde features (offline, barcode‑scan, uitgebreide rapportage) worden na de MVP ingepland.

### 2.3 Doelgroep & Persona’s

| Persona      | Primair doel                          | Rechten (MVP)                                   | Apparaten        |
| ------------ | ------------------------------------- | ----------------------------------------------- | ---------------- |
| **Operator** | Snel verbruik boeken                  | Verbruik registreren · Voorraad bekijken        | Tablet / Phone   |
| **Manager**  | Voorraad optimaliseren & team beheren | Volledige CRUD · Gebruikersbeheer · Rapporten   | Desktop / Laptop |
| **Finance**  | Kostprijs & stockwaarde volgen        | Dashboard KPI’s · Export (afschrijvingen – TBD) | Desktop / Laptop |

### 2.4 MVP‑Features

| Prioriteit | Feature                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| **P0**     | Multi‑tenant onboarding · Supabase Auth · RBAC · Inventory CRUD · Verbruik‑UI · Dashboard KPI’s · RLS‑policies |
| **P1**     | Realtime updates · CSV/Excel‑export · Audit‑log · Sentry‑monitoring                                            |
| **P2**     | QR‑scan · Batch/lot‑tracking · Public API · Advanced analytics · PWA                                           |

### 2.5 Deadlines & Mijlpalen (2025)

| Datum      | Week | Mijlpaal                                              |
| ---------- | ---- | ----------------------------------------------------- |
| **15 jul** | 29   | Visueel prototype voorraadbeheer‑scherm klaar () |
| **29 jul** | 30   | Makerkit‑clone + Supabase project staan live          |
| **05 aug** | 31   | Onboarding wizard + tenant‑aanmaak werkt              |
| **19 aug** | 33   | Inventory CRUD + realtime & audit‑log live            |
| **02 sep** | 35   | Strameco test: dashboard + waarschuwingen             |
| **15 sep** | 37   | Publieke MVP‑launch (Belgische markt)                 |

### 2.6 Succes‑KPI’s

- **≤10 min** onboarding voor nieuwe klant
- **≥75 %** minder tel‑fouten vs Excel
- **<500 ms** 95‑p API‑respons
- **≥90 %** tevredenheid (pilot Strameco)

### 2.7 Risico’s & Mitigaties

| Risico                      | Mitigatie                                        |
| --------------------------- | ------------------------------------------------ |
| Data‑lek door verkeerde RLS | Cypress‑e2e per tenant + unit‑tests op policies  |
| Scan‑camera unsupported     | Fallback handmatige input                        |
| Supabase Free‑limits        | Upgrade naar Pro bij >50 k req/d of >500 MB data |

---

## 3 · Systeem‑ & Software‑Architectuur

### 3.1 Technologie‑stack

| Laag              | Keuze                                            | Motief                       |
| ----------------- | ------------------------------------------------ | ---------------------------- |
| **Frontend**      | Next.js 14 (App Router) · Tailwind 4 · shadcn/ui | Makerkit‑clone basis         |
| **State**         | Supabase Realtime + minimaal client‑state        | Minder bugs                  |
| **Auth**          | Supabase Auth (magic‑link)                       | JWT met `tenant_id` & `role` |
| **ORM**           | Prisma                                           | Zit al in template           |
| **Database**      | Supabase PostgreSQL 15 (shared schema)           | RLS + EU host                |
| **Serverless**    | Supabase Edge Functions                          | Cron & webhooks ≤10 s        |
| **Hosting**       | Vercel Free tier                                 | Wildcard‑SSL                 |
| **Observability** | Sentry                                           | Minimal monitoring           |

### 3.2 Componentdiagram

```
Browser ↔ Vercel Edge (Next.js 14) ↔ Supabase (Postgres · Auth · Realtime · Edge)
                                            ↘ Backups (Backblaze)
```

### 3.3 Multi‑tenant isolatie

- Subdomein‑routering → middleware zet `tenant_id` header
- Shared schema met `tenant_id` kolom
- RLS‑policy: `tenant_id = auth.jwt() ->> 'tenant_id'`

### 3.4 Database‑schema (extra tabellen)

```sql
-- Audit‑log
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id),
  user_id uuid references users(id),
  action text,
  payload jsonb,
  ts timestamptz default now()
);
-- Verbruikstransacties
create table inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id),
  inventory_id uuid references inventory_items(id),
  delta numeric, -- negatief = verbruik
  user_id uuid references users(id),
  ts timestamptz default now()
);
-- Lage voorraad alerts
create table low_stock_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id),
  inventory_id uuid references inventory_items(id),
  triggered_at timestamptz,
  resolved boolean default false
);
```

### 3.5 CI/CD

1. **GitHub Actions**: ESLint, Test, Prisma migrate, Supabase `db push`.
2. **Vercel**: Auto‑deploy `main` → `*.stock2coat.com`.

### 3.6 Security & compliance

- Supabase PITR 7 d + wekelijkse dump → Backblaze.
- GDPR DPA’s (Vercel & Supabase).
- Sentry + `tenant_id` breadcrumb.

---

*Plaats dit bestand in repo‑root als **``** – dient als single‑source PRD + Architectuur.*

