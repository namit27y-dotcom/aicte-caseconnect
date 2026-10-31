# AICTE CaseConnect

> **Centralized Technical Education Institution Case Monitoring, Overlap Intelligence & Cross-Bureau Resolution Platform**  
> **Smart India Hackathon 2026** | **Problem Statement ID:** `SIH26264`  
> **Organization:** All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India  
> **Team:** `VECTOR_VAGABONDS` | **Repository:** [https://github.com/namit27y-dotcom/aicte-caseconnect.git](https://github.com/namit27y-dotcom/aicte-caseconnect.git)

---

## 🏛️ Executive Summary & Institutional Vision

Higher and technical educational institutions across India interact with multiple AICTE bureaus simultaneously—including **Approval Bureau**, **Finance Bureau**, **Public Grievance Cell**, **Policy & Academic Bureau**, and **Legal & Vigilance Cell**. Historically, grievances and compliance queries arrived through disjointed avenues, resulting in:
- **Siloed Investigations:** Disconnected officers inspecting overlapping anomalies without mutual institutional context.
- **Regulatory Fatigue:** Approved institutions facing parallel, uncoordinated notices from distinct bureaus.
- **Undetected Systemic Violations:** Repeat compliance breaches and multi-campus infractions crossing regional jurisdictions undetected.
- **SLA Breach Blindspots:** Difficulty tracking statutory escalation windows and enforcement turnaround times.

**AICTE CaseConnect** introduces an institutional-grade, privacy-preserving governance architecture that unifies case intake, detects cross-bureau overlap candidates using weighted heuristic intelligence, coordinates joint multi-disciplinary inquiry taskforces, and tracks statutory SLA deadlines under strict audit trails.

---

## 🎨 Institutional Design System (GovTech Enterprise)

Designed strictly following Indian Institutional & Governance design principles with **zero cyan/blue**, using restrained, trustworthy forest tones, warm ivory canvases, and dignified serif typography:

| Design Token | Hex Code | Purpose & Application |
|---|---|---|
| **Sidebar Canvas** | `#12382B` | Authoritative deep forest green sidebar inspired by official secretariat emblems |
| **Primary Green** | `#174B38` | Primary institutional brand color, active navigation tabs, primary CTAs |
| **Canvas Background** | `#F7F5EF` | Soft warm ivory background minimizing ocular strain during prolonged casework |
| **Card Surface** | `#FFFFFF` | Crisp pure white surfaces with subtle micro-borders |
| **Borders & Dividers**| `#E8E2D6` | Refined warm stone borders replacing heavy artificial shadows |
| **Accent Gold** | `#D5A64A` | Muted golden brass accent for institutional emblems and badges |
| **Primary Text** | `#172B24` | Deep forest-charcoal ink for maximum legibility and contrast |
| **Secondary Text** | `#78847D` | Balanced muted slate-green for labels, captions, and secondary metadata |
| **Danger / Overdue** | `#B94F45` | Restrained crimson for statutory SLA breaches and critical notices |
| **Warning / Imminent**| `#C58B3B` | Warm ochre amber for deadline warnings (< 5 days remaining) |
| **Success / Resolved**| `#4F8064` | Muted sage green for closed cases, approved statuses, and compliance achievements |
| **Headings Typography**| `Lora`, `Cinzel`, serif | Premium editorial serif typography for authoritative governance titles |
| **Body Typography** | `Inter`, `Manrope`, sans-serif | High-clarity geometric sans-serif for dense casework data tables |
| **Monospace / Codes** | `JetBrains Mono` | Distinct tabular monospace for tracking IDs (`CC-2026-XXXXXX`) |

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Executive Case Monitoring Overview (`/overview`)
- **Full-Width Institutional Hero Banner:** Authentic Secretariat artwork with embedded governance council styling and quick action buttons.
- **Dynamic 6-Card Single Source of Truth:**
  - `Total Cases` (16 cases, $+5\%$ periodic change)
  - `Awaiting Review` (2 fresh intake cases awaiting first action)
  - `In Progress` (9 actively assigned, coordinated, or review cases)
  - `Overdue` (3 cases exceeding statutory timeframes)
  - `Disposed` (5 closed / resolved complaints)
  - `Coordination` (2 cross-bureau overlap candidates under joint review)
- **Status Distribution Donut Chart:** Responsive SVG chart with `viewBox="0 0 200 200"` scaling ensuring zero overflow, displaying exact dynamic proportions (`Submitted`, `Under Process`, `In Coordination`, `Resolution Review`, `Disposed`) summing to 100%.
- **Attention & Escalation Queue:** High-priority queue prioritizing overdue cases (`CC-2026-000098`, `CC-2026-000178`, `CC-2026-000215`) with direct slide-out drawer inspection.
- **Bureau Workload Capacity:** Live allocation progress bars across AICTE bureaus.
- **Institution Activity Register:** Live register linking institutions to their active open casework tallies.

### 2. 🗂️ Complaints Directory & Lifecycle Engine (`/complaints`)
- **Centralized Case Registry:** Comprehensive, searchable directory of institutional complaints across categories (Infrastructure, Faculty Shortage, Affiliation, Fee Anomaly, Ragging).
- **Multi-Filter Faceting:** Search by tracking number, filter by Bureau, Category, Priority (`Critical`, `High`, `Medium`, `Low`), and Status.
- **Slide-Out Complaint Detail Drawer:** Complete chronological event history, complainant metadata, assigned officer, statutory deadline countdown, and immutable audit trail.
- **Role-Gated State Machine:** Strict lifecycle enforcement (`SUBMITTED` → `ASSIGNED` → `UNDER_PROCESS` → `COORDINATION` → `RESOLUTION_REVIEW` → `CLOSED`) requiring recorded justification for state transitions.

### 3. 🏢 Institution 360° Directory (`/institutions`)
- **Holistic Institution Dossiers:** Profiles for technical institutes across engineering, polytechnic, management, and pharmacy.
- **Cross-Bureau Case Aggregator:** Consolidates all complaints filed against an institution regardless of receiving bureau (`deriveInstitutionMetrics`).
- **Regulatory Status Flags:** Permanent AICTE ID, State, District, and live status (`Approved`, `Under Scrutiny`, `Notice Sent`).
- **Direct Filtering:** Single-click navigation from any institution profile directly into its filtered complaints.

### 4. 🔗 Overlap Intelligence & Joint Taskforces (`/coordination`)
- **Multi-Signal Heuristic Matching Algorithm:**
  - Institutional Identifier & Campus Location Match ($40\%$ weight).
  - Category & Subject Violation Correlation ($25\%$ weight).
  - Temporal Intake Proximity within 30–60 days ($20\%$ weight).
  - Textual & Keyword Co-occurrence Analysis ($15\%$ weight).
- **Explainable Evidence Cards:** Details similarity score ($0-100\%$) and concrete overlap rationale (e.g., simultaneous faculty payroll grievance and annual approval inspection).
- **Human-in-the-Loop Review Workflow:** Bureau officers can **Confirm Overlap** (spawning joint coordination groups) or **Dismiss as Independent** with mandatory justification logged to audit trail.

### 5. ⏱️ Statutory SLA Queue & Escalation Dispatcher (`/deadlines`)
- **Imminent Breach Monitoring:** Classifies casework by deadline urgency (`Overdue`, `Critical < 5 Days`, `On Schedule`).
- **Configurable SLA Policies:** Threshold rules customizable per bureau, category, and case priority.
- **Escalation Dispatcher:** One-click generation of formal Show-Cause Notices to Regional Officers and Bureau Heads.

### 6. 📈 Analytics & Governance Reports (`/analytics`)
- **Strict Single Source of Truth Engine:** All metrics calculated dynamically via `src/utils/analyticsCalculations.ts` from active complaint records:
  - Total Volume, Disposed Count, Disposal Rate ($\frac{\text{Disposed}}{\text{Total}} \times 100\%$), and Average Resolution Time ($\frac{\sum (\text{Resolved} - \text{Intake})}{\text{Disposed}}$).
  - **SLA Compliance Rate:** Percentage of complaints meeting statutory SLA targets.
- **Dynamic 6-Month Intake vs. Disposal Line Chart:** Scaled vector plot with interactive point tooltips indicating monthly received and resolved counts.
- **Top Bureaus Workload Breakdown:** Dynamic volume distribution with proportional progress bars.
- **Status Distribution Donut:** Clean side-by-side layout with vertical legend and zero heading overlap.
- **Complaint Ageing Distribution:** Breakdown across `0–7 Days`, `8–30 Days`, `31–60 Days`, and `60+ Days` with triage action guidance.
- **State-Wise Geographical Distribution:** Ranked breakdown across Indian states and jurisdictions.
- **RFC 4180 Secure CSV Export:** Exports filtered dataset with formula injection defense (`=`, `+`, `-`, `@`).

### 7. 🛡️ Role-Based Access Control & User Administration (`/administration`)
- **13-Capability Role-Permissions Matrix:**
  1. *Complainant (Student / Faculty / Citizen)*: Limited intake submission and tracking of own complaints.
  2. *Bureau Officer (Investigator)*: Bureau casework triage, overlap recommendations, and evidence attachments.
  3. *Bureau Head (Director / Regional In-Charge)*: Inter-bureau approvals, taskforce formation, and escalation review.
  4. *Apex Admin (Member Secretary / Central Secretariat)*: System-wide policy governance, SLA threshold modifications, user provisioning.
- **User Provisioning Directory:** Searchable officer directory with status tags and role assignments.

### 8. 📜 Tamper-Evident Audit Trail (`/audit`)
- **Append-Only Event Ledger:** Captures timestamp, actor name, actor role, bureau, mutation type (`STATUS_CHANGE`, `OVERLAP_LINK`, `DEADLINE_OVERRIDE`, `SLA_RULE_UPDATE`, `USER_ROLE_CHANGE`), entity ID, old value, new value, and rationale.

---

## 🛠️ Technology Stack & Architecture

- **Frontend Core:** React 19 (`react`, `react-dom`)
- **Language:** TypeScript 5.8+ with strict compiler checks (`strict: true`, `noImplicitAny: true`)
- **Styling Architecture:** Tailwind CSS v4 (`@tailwindcss/vite`) with custom CSS color tokens
- **Icons & Visual Assets:** Lucide React (`lucide-react`)
- **Animations:** Motion (`motion`)
- **Testing Suite:** Vitest 3 (`vitest`) with 115 unit test specifications across metrics, permissions, and workflow machines
- **Build & Dev Tooling:** Vite 6 with lightning-fast Hot Module Replacement (HMR)

---

## 📁 Project Directory Structure

```text
aicte-caseconnect/
├── index.html                      # HTML5 entry with institutional serif Google Fonts
├── package.json                    # Project dependencies, build scripts & test commands
├── tsconfig.json                   # Strict TypeScript compiler configuration
├── vite.config.ts                  # Vite bundler configuration with Tailwind CSS v4
│
├── public/
│   └── assets/                     # Authentic AICTE logos, building banners, and SVG vector assets
│
└── src/
    ├── main.tsx                    # React application bootstrap
    ├── App.tsx                     # Top-level state manager, navigation tabs & routing
    ├── index.css                   # Institutional CSS variables, typography, and Tailwind rules
    │
    ├── types/
    │   └── index.ts                # Strong TypeScript interfaces (Complaint, Persona, Institution, Audit, SLA)
    │
    ├── data/
    │   └── syntheticData.ts        # Synthetic demo records for SIH 2026 technical validation
    │
    ├── utils/
    │   ├── caseMetrics.ts          # Core KPI derivations, status distribution, and institution metrics
    │   ├── analyticsCalculations.ts# Pure mathematical calculation engine and CSV exporter
    │   ├── permissions.ts          # 13-capability RBAC evaluator
    │   └── workflow.ts             # Strict finite state machine for complaint lifecycles
    │
    ├── components/
    │   ├── charts/
    │   │   ├── DonutChart.tsx      # SVG donut chart with standardized 200x200 viewBox scaling
    │   │   ├── LineChart.tsx       # SVG line chart for multi-month intake vs. disposal trends
    │   │   └── HorizontalBarChart.tsx # SVG horizontal progress bars
    │   │
    │   ├── layout/
    │   │   ├── Sidebar.tsx         # Deep forest green sidebar with role switcher & badge tallies
    │   │   ├── TopBar.tsx          # Institutional header with search, notifications & user profile
    │   │   └── SyntheticBanner.tsx # Demo simulation environment disclaimer
    │   │
    │   ├── ui/
    │   │   ├── Badge.tsx           # Institutional status and priority badges
    │   │   ├── Button.tsx          # Accessible styled button primitives
    │   │   ├── Card.tsx            # Flat ivory card containers
    │   │   ├── DataTable.tsx       # Standardized table component with pagination
    │   │   ├── EmptyState.tsx      # Clean empty state indicators
    │   │   ├── FilterBar.tsx       # Search and select filter bar
    │   │   └── Modal.tsx           # Modal dialog wrapper
    │   │
    │   └── views/
    │       ├── DashboardView.tsx   # Executive Case Overview with full-width banner
    │       ├── ComplaintsView.tsx  # Searchable complaints table & filter toolbar
    │       ├── ComplaintDetailDrawer.tsx # Slide-out case inspection drawer
    │       ├── NewComplaintModal.tsx # Multi-step intake registration wizard
    │       ├── InstitutionsView.tsx # Institutional directory & dossiers
    │       ├── CoordinationView.tsx # Overlap intelligence & joint taskforces
    │       ├── DeadlineQueueView.tsx# Imminent deadline & escalation queue
    │       ├── AnalyticsView.tsx   # Multi-filter governance analytics & reports
    │       ├── AdministrationView.tsx # RBAC permissions, SLA rules & user directory
    │       ├── AuditTrailView.tsx  # Chronological append-only audit trail
    │       └── SettingsView.tsx    # Application preferences & system metadata
    │
    └── __tests__/
        ├── caseMetrics.test.ts     # 30 tests validating KPI calculations & invariants
        ├── permissions.test.ts     # 39 tests validating role-based authorization matrix
        └── workflow.test.ts        # 46 tests validating complaint state transitions
```

---

## 👥 Demo Personas & Role Switcher

You can test all role-based experiences using the **Role Switcher** at the bottom-left of the sidebar:

| Persona | Name | Role | Bureau Allocation | Capabilities |
|---|---|---|---|---|
| **Bureau Officer** | Aashish Kumar | `BUREAU_OFFICER` | Approval Bureau | Manage assigned complaints, recommend overlaps, transition case stages |
| **Bureau Officer** | Priya Nair | `BUREAU_OFFICER` | Finance Bureau | Financial anomaly inspection, inter-bureau coordination, evidence review |
| **Bureau Officer** | Vikram Singh | `BUREAU_OFFICER` | Policy & Academic Bureau | Curriculum complaints, regulatory compliance verification |
| **Bureau Head** | Dr. Sunita Sharma | `BUREAU_HEAD` | Public Grievance Cell | Authorize cross-bureau taskforces, dispatch show-cause notices, bureau audits |
| **Apex Admin** | Prof. R. K. Verma | `APEX_ADMIN` | Central Secretariat (Apex) | System-wide visibility, edit statutory SLA rules, reassign officer roles |
| **Complainant** | Pooja Mehta | `COMPLAINANT` | Citizen / Student | Register new grievances, track personal submitted cases |

---

## 💻 Local Setup & Development Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher (or `pnpm` / `bun`)

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/namit27y-dotcom/aicte-caseconnect.git
   cd aicte-caseconnect
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will run at **`http://localhost:3000`**.

4. **Execute TypeScript typecheck & test suite:**
   ```bash
   npm run lint        # TypeScript compiler check (tsc --noEmit)
   npm run test        # Runs all 115 Vitest test cases
   ```

5. **Generate optimized production bundle:**
   ```bash
   npm run build       # Builds production client in dist/
   npm run preview     # Locally previews the production build
   ```

---

## 🔒 Synthetic Data & Regulatory Disclaimer

- **Smart India Hackathon 2026 Prototype:** All institutional names, complaint registration numbers, personal names, and dates in this repository are **purely synthetic demonstration data** created specifically for technical evaluation under Problem Statement `SIH26264`.
- **No Production AICTE Linkage:** This application operates autonomously as a decoupled client-side governance prototype and does not connect to live AICTE databases or official government systems.

---

## 📄 Team & Hackathon Credentials

- **Problem Statement ID:** `SIH26264`
- **Problem Statement:** AICTE Centralized Monitoring & Coordination System for Technical Institutions
- **Hackathon:** Smart India Hackathon 2026 (SIH 2026)
- **Team Name:** `VECTOR_VAGABONDS`
- **Repository:** [https://github.com/namit27y-dotcom/aicte-caseconnect.git](https://github.com/namit27y-dotcom/aicte-caseconnect.git)
