# AICTE CaseConnect

> **Centralized Institution-Related Complaint Monitoring & Resolution Platform**  
> **Smart India Hackathon 2026** | **Problem Statement ID:** `SIH26264`  
> **Organization:** All India Council for Technical Education (AICTE)  
> **Team:** `VECTOR_VAGABONDS`

---

## 🏛️ Executive Summary & Vision

In higher and technical education governance across India, complaints against institutions often arrive through fragmented channels (approval queries, financial anomalies, faculty grievances, ragging reports, infrastructural deficiencies). When different AICTE bureaus handle related cases in isolation:
- Multiple officers examine overlapping issues without mutual awareness.
- Institutions may face parallel scrutiny without coordinated resolution.
- Repeat offenders or chronic compliance failures can go unnoticed across regional borders.
- Escalation deadlines and statutory turnaround times become difficult to enforce.

**AICTE CaseConnect** solves this through a unified, role-based monitoring and cross-bureau coordination platform:
1. **Centralize:** One unified register with transparent, traceable case histories.
2. **Connect:** Algorithmic overlap candidate detection with explainable similarity evidence.
3. **Coordinate:** Joint inquiry groups, lead bureaus, and cross-departmental handoffs.
4. **Monitor:** Configurable statutory SLA deadlines with automated warning thresholds and escalation notices.
5. **Prove:** Tamper-evident, append-only audit trail logging every administrative mutation.

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Executive Dashboard (`/overview`)
- **Real-Time KPI Metrics:** Dynamic counts for Total Complaints, Open Cases, Overdue Incidents, and Disposed Cases with periodic trend delta percentages.
- **Workflow State Distribution:** Interactive donut breakdown tracking cases across `SUBMITTED`, `ASSIGNED`, `UNDER_PROCESS`, `COORDINATION`, `RESOLUTION_REVIEW`, and `CLOSED`.
- **Bureau Workload Density:** Visual progress capacity indicators comparing open cases against bureau allocation limits across all 5 AICTE bureaus.
- **Recent Case Intake Feed:** Quick-access table showing latest case receipts with status chips and direct drawer inspection.

### 2. 🗂️ Complaints Register & Inspector (`/complaints`)
- **Comprehensive Case Directory:** Paginated, multi-attribute searchable database of institutional complaints.
- **Multi-Filter Faceting:** Filter by Status, Bureau, Category, Priority, and Institution State.
- **Slide-Over Case Drawer:** Full case chronology, complainant details, assigned officer, target SLA countdown, and linked audit logs.
- **Workflow State Machine:** Authorized officers can transition complaint statuses (`SUBMITTED` → `ASSIGNED` → `UNDER_PROCESS` → `COORDINATION` → `RESOLUTION_REVIEW` → `CLOSED`) with mandatory reasoning captured for audit.
- **New Complaint Intake Modal:** Multi-step wizard to register new grievances with automatic tracking ID generation (`CC-2026-XXXXX`).

### 3. 🏢 Institution 360° Directory (`/institutions`)
- **Institution Dossiers:** Holistic profile cards for approved engineering, management, and polytechnic institutes.
- **Cross-Bureau Case Aggregation:** View all historical and pending complaints filed against an institution, irrespective of which bureau received them.
- **Regulatory Statuses:** AICTE Approval ID, State, District, Active Approval Status (`APPROVED`, `UNDER_SCRUTINY`, `NOTICE_SERVED`).
- **One-Click Deep Linking:** Jump directly from an institution card to filtered complaints in the Complaints Register.

### 4. 🔗 Cross-Bureau Coordination & Overlap Engine (`/coordination`)
- **Algorithmic Overlap Detection:** Multi-signal heuristic matching engine calculating similarity confidence scores (0–100%) based on:
  - **Institution Match:** Exact regulatory code / name match ($40\%$ weight).
  - **Category Alignment:** Related domain infractions ($25\%$ weight).
  - **Temporal Proximity:** Intake dates within 30–60 days ($20\%$ weight).
  - **Textual & Keyword Heuristics:** Keyword co-occurrence ($15\%$ weight).
- **Explainable Evidence Cards:** Clearly explains *why* cases were flagged (e.g. shared faculty payroll complaints coinciding with annual approval inspection).
- **Human-in-the-Loop Review:** Officers can either **Confirm Overlap** (spawning joint coordination) or **Dismiss as Independent** (capturing official justification).
- **Active Coordination Groups:** Inter-bureau task forces with designated lead officers, co-reviewing bureaus, and consolidated findings.

### 5. ⏱️ Statutory Deadline & Escalation Queue (`/deadlines`)
- **SLA Priority Queue:** Sorts cases by imminent statutory deadline risk (`OVERDUE`, `CRITICAL <5 DAYS`, `ON SCHEDULE`).
- **Escalation Dispatcher:** One-click dispatch of formal Show-Cause Notices to Regional Officers and Bureau Heads for overdue cases.
- **Time Remaining Countdown:** Displays remaining processing days and statutory targets.

### 6. 📈 Analytics & Governance Intelligence (`/analytics`)
- **Live Aggregation Engine:** All metrics calculated in real-time from active complaint data (no hardcoded figures):
  - Total Complaints, Open Complaints, Overdue Complaints, Disposed Cases.
  - **Disposal Rate:** $\frac{\text{Disposed}}{\text{Total}} \times 100\%$.
  - **Average Resolution Time:** $\frac{\sum (\text{Resolved} - \text{Intake})}{\text{Disposed Cases}}$ (in days).
  - **Cross-Bureau Cases:** Total complaints with active inter-bureau linkages.
- **Workload Analytics Across 5 Bureaus:** Approval Bureau, Finance Bureau, Grievance Cell, Policy & Academic Bureau, Legal & Vigilance Cell.
- **State-Wise Geographical Distribution:** Ranked table of states with complaint volumes, open vs. closed breakdown, and search-to-filter.
- **Aging Buckets:** Cases segregated into `0–7 Days`, `8–30 Days`, `31–60 Days`, and `60+ Days`.
- **Export to CSV:** Exports currently filtered dataset directly to `.csv` for offline analysis and reporting.

### 7. 🛡️ System Administration & RBAC (`/administration`)
- **13-Capability Role-Permissions Matrix:** Clear breakdown of capabilities across all 4 user roles:
  1. *Complainant (Citizen/Student/Faculty)*
  2. *Bureau Officer (Scrutiny & Investigation)*
  3. *Bureau Head (Director / Regional In-Charge)*
  4. *Apex Admin (Member Secretary / Central Admin)*
- **Configurable SLA Rules:**
  - Create, edit, toggle, or delete SLA policies per bureau, category, and priority.
  - Form validation: Positive integers, warning threshold strictly lower than deadline duration.
  - Reset to statutory AICTE standards with a single click.
- **User Directory & Provisioning:**
  - Searchable user table with status (`ACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`).
  - Reassign user roles with audit capture.
  - Add new officer credentials and assign designated bureaus.
- **Role-Based Guards:** Enforces permission restrictions with clear explanatory notices for non-admin viewers.

### 8. 📜 Tamper-Evident Audit Trail (`/audit`)
- **Append-Only Logging:** Every administrative action generates an immutable audit item.
- **Captured Metadata:** Timestamp, Actor Name, Actor Role, Actor Bureau, Action Type (`STATUS_CHANGE`, `OVERLAP_LINK`, `DEADLINE_OVERRIDE`, `SLA_RULE_UPDATE`, `USER_ROLE_CHANGE`), Entity ID, Previous Value, New Value, and Reason.
- **Search & Filter:** Search by tracking number, actor name, or action type.

---

## 🎨 Enterprise Design System

The visual style follows a warm, authoritative institutional design language:

| Design Element | Hex / Token | Purpose |
|---|---|---|
| **Canvas Background** | `#FBF9F5` / Warm Alabaster | Soft off-white reducing eye strain during extended casework |
| **Sidebar Background** | `#09251F` / Deep Forest Green | Authoritative dark sidebar inspired by official government seals |
| **Primary Institutional**| `#154636` / Forest Green | Primary buttons, active highlights, header accents |
| **Secondary Accent** | `#0F766E` / Teal Green | Progress indicators, coordination tags, information badges |
| **Neutral Borders** | `#E6E1D8` / Subtle Stone | Ultra-crisp thin borders replacing heavy card shadows |
| **Overdue / Alert** | `#DC2626` / Restrained Crimson | High-visibility warning indicators for SLA breach |
| **Warning / Imminent** | `#D97706` / Warm Amber | Countdown warnings (< 5 days remaining) |
| **Typography** | Plus Jakarta Sans & JetBrains Mono | Clean legible UI headings and distinct monospace tracking IDs |

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 (`react`, `react-dom`)
- **Language:** TypeScript 5.8+ (`strict` mode enabled)
- **Build Tooling:** Vite 6 (`@vitejs/plugin-react`)
- **Styling Engine:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React (`lucide-react`)
- **Animations:** Motion (`motion`)
- **Calculation Engine:** Pure mathematical utility module (`src/utils/analyticsCalculations.ts`)
- **Data Layer:** In-memory reactive state initialized from synthetic seed datasets (`src/data/syntheticData.ts`)

---

## 📁 Repository Directory Structure

```text
├── index.html                      # HTML5 entry with Google Fonts & Meta tags
├── metadata.json                   # AI Studio applet metadata & capabilities
├── package.json                    # Project dependencies & build scripts
├── tsconfig.json                   # TypeScript compiler options
├── vite.config.ts                  # Vite bundler configuration with Tailwind
│
├── public/
│   └── assets/                     # Static assets and reference documentation
│
└── src/
    ├── main.tsx                    # React DOM entry point
    ├── App.tsx                     # Main application controller, state & navigation router
    ├── index.css                   # Global Tailwind CSS imports & custom styles
    │
    ├── types/
    │   └── index.ts                # TypeScript interfaces (Complaint, Persona, SLA, Audit)
    │
    ├── data/
    │   └── syntheticData.ts        # Synthetic SIH 2026 demo data (Complaints, Institutions, etc.)
    │
    ├── utils/
    │   └── analyticsCalculations.ts # Mathematical calculation engine & CSV export
    │
    └── components/
        ├── layout/
        │   ├── Sidebar.tsx         # 295px fixed sidebar with role selector
        │   ├── TopBar.tsx          # Header with global search, notifications, intake CTA
        │   └── SyntheticBanner.tsx # Disclaimer banner for synthetic demo data
        │
        ├── ui/
        │   ├── Badge.tsx           # Standardized status and category badges
        │   ├── Button.tsx          # Accessible styled button primitives
        │   ├── Card.tsx            # Flat warm-white card containers
        │   ├── Input.tsx           # Input fields and form controls
        │   └── Modal.tsx           # Accessible modal dialog primitive
        │
        └── views/
            ├── DashboardView.tsx        # Overview dashboard with charts & workloads
            ├── ComplaintsView.tsx       # Searchable complaints table & filter toolbar
            ├── ComplaintDetailDrawer.tsx# Full slide-out case drawer with state transitions
            ├── NewComplaintModal.tsx    # Multi-field intake registration modal
            ├── InstitutionsView.tsx     # Institutional directory & dossiers
            ├── CoordinationView.tsx     # Cross-bureau overlap analysis & joint groups
            ├── DeadlineQueueView.tsx    # Imminent deadline & escalation queue
            ├── AnalyticsView.tsx        # KPI metrics, workload charts, state distribution
            ├── AuditTrailView.tsx       # Append-only chronological audit log table
            └── AdministrationView.tsx   # RBAC permissions, SLA rules & user management
```

---

## 👥 Demo Personas & Role Switcher

Test all role-based features by switching personas using the **Role Switcher** at the bottom of the left sidebar:

| Persona | Name | Role | Bureau / Jurisdiction | Permitted Scope |
|---|---|---|---|---|
| **Officer** | Aashish Kumar | `BUREAU_OFFICER` | Approval Bureau (Western Region) | View/edit bureau complaints, recommend overlap, transition statuses |
| **Bureau Head** | Dr. Meenakshi Sundaram | `BUREAU_HEAD` | Grievance Cell (Central HQ) | Full bureau authority, approve transfers, view bureau audit logs |
| **Apex Admin** | Prof. R. K. Verma | `APEX_ADMIN` | Member Secretary Secretariat | Global view, configure SLA rules, reassign user roles, manage system |
| **Complainant** | Priya Sharma | `COMPLAINANT` | Citizen / Student Complainant | Submit complaints, view own submitted cases only (restricted views) |

---

## 💻 Local Setup & Development

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher (or `bun` / `pnpm`)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/aicte-caseconnect.git
   cd aicte-caseconnect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will start at `http://localhost:3000`.

4. **Verify TypeScript & build:**
   ```bash
   npm run lint   # Runs: tsc --noEmit
   npm run build  # Builds optimized production bundle in dist/
   ```

---

## 🔒 Synthetic Data & Regulatory Disclaimer

- **SIH 2026 Prototype:** All institutional names, complaint records, addresses, officer names, and dates presented in this prototype are **purely synthetic demo data** created for Smart India Hackathon 2026.
- **No Real AICTE Systems Affected:** This application does not connect to or alter any live AICTE databases, government servers, or official records.
- **Compliance:** Strict compliance with SIH problem statement guidelines (`SIH26264`).

---

## 📄 License & Team

- **Team:** `VECTOR_VAGABONDS`
- **Hackathon:** Smart India Hackathon 2026
- **License:** Apache-2.0
