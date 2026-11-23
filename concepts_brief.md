# Zero-Database Git-Backed Admin & MCP Content Studio (`/admin`)

* **Author:** Mark Anthony Ebio (`@kramzzzy`)
* **Date:** 2026-11-10

## Overview

This proposal adds a self-contained **Admin & MCP Content Management Studio (`/admin`)** to `portfolio-v2` without introducing an external database (no PostgreSQL, Supabase, or third-party headless CMS). Instead, the repository itself is the database:
- **In local development (`npm run dev`)**: A Vite middleware plugin reads and writes files directly on disk (`src/data/portfolio.json`, `src/data/crm.json`, `src/components/*`, and `public/images/*`) with instant hot-reload.
- **In production on Vercel**: Consolidated serverless endpoints (`api/admin.js` and `api/mcp.js`) read and commit changes directly to the `main` branch via the GitHub Contents and Git Trees REST API (`GITHUB_TOKEN` + `ADMIN_SECRET`).
- **Dual-Interface Management**: Both the browser-based `/admin` visual studio and external AI agents (via an embedded Model Context Protocol HTTP JSON-RPC endpoint at `/api/mcp`) call the same storage module (`api/_lib/studio-core.js`).
- **Dual-Mode Access**: Visitors and prospective clients can open `/admin` in **Read-Only Sandbox Mode** (where edits simulate safely in `sessionStorage` and the MCP tool playground can be tested live), while the site owner unlocks **Admin Write Mode** with `ADMIN_SECRET` to commit directly to GitHub or local disk.

---

## Analysis

### 1. Contrarian & YAGNI Critique (`egm-zoom-out`)
- **Why not edit TypeScript files in the IDE?** Editing `src/data/portfolio.ts` directly in VS Code / Antigravity costs zero runtime code. A custom `/admin` portal is only justified if it serves two distinct purposes: (a) allowing non-IDE updates and MCP agent automation from anywhere, and (b) acting as an interactive full-stack + MCP engineering showcase for prospective clients visiting the portfolio.
- **Static Bundle vs. Git Commit Latency**: On Vercel, committing a change to `src/data/portfolio.json` via the GitHub API triggers a new Vercel build that takes ~30–45 seconds to go live. If `/admin` reads from the static bundle, the admin user will not see their saved changes until the rebuild finishes. Therefore, `/admin` must fetch live state from `/api/admin` (which reads the latest GitHub commit SHA directly) and cache recent writes in browser storage until the new static build deploys.

### 2. Codebase Couplings & Migration Targets (`egm-codebase-details`)
- **Manual `pushState` Router**: `src/App.tsx` uses regex path helpers (`resolveProjectIndexFromPath`, `isProjectsArchivePath`, `isSoftwareDevPath`). Adding `/admin` requires an `isAdminPath()` helper in `src/App.tsx`, skipping `EntranceLoader` when `/admin` is loaded directly, pausing background WebGL shaders (`MagicRings`, `LetterGlitch`), and adding `/admin` rewrite rules in `vercel.json`.
- **Decoupling `src/data/portfolio.ts` into JSON + Typed Wrapper**: Rewriting `.ts` source files with regex or AST manipulation during an API call is brittle. Extracting raw data into `src/data/portfolio.json` while keeping `src/data/portfolio.ts` as the typed TypeScript façade (computing dynamic `Years Experience` at runtime from `2016`) preserves all existing imports across `src/App.tsx`, `src/components/ProjectsArchivePage.tsx`, and `src/components/ProjectCaseStudyPage.tsx`.
- **Extracting Hardcoded CRM Data**: `src/components/SoftwareDevelopmentPage.tsx` currently embeds `INITIAL_DEALS`, `INITIAL_WORKFLOWS`, `PREMADE_CHAT_PROMPTS`, and `MEETING_SESSIONS` inline. Extracting these into `src/data/crm.json` + `src/data/crm.ts` allows `/admin` and MCP tools to manage CRM deals and workflows alongside portfolio projects.
- **Null-Safety in Archive Cards**: `src/components/ProjectsArchivePage.tsx` indexes `p.caseStudy.impactMetrics[0].delta` and `p.caseStudy.typography[0].family` directly. Schema validation in `upsert_project` must require at least one metric and one typography entry, and `ProjectsArchivePage.tsx` should use optional chaining (`?.`).

### 3. Quota, Cost & Vercel Function Limits (`egm-structural`)
- **Vercel Hobby 12-Function Limit**: Vercel Hobby plans cap deployments at 12 Serverless Functions. Creating separate files for every admin action would exhaust this quota. Consolidating all admin REST actions into a single `api/admin.js` router and all MCP JSON-RPC calls into `api/mcp.js` keeps total serverless functions at **3** (`api/contact.js`, `api/admin.js`, `api/mcp.js`).
- **Payload Size Ceiling**: Vercel Serverless Functions enforce a 4.5 MB request body limit. Base64 image uploads via `/admin` or `upload_asset` must enforce a 3 MB raw file limit (~4 MB base64) and recommend `.webp` compression.

### 4. Security, Path Traversal & Concurrency (`egm-implementation-readiness`)
- **Strict Path Allowlisting**: File tree and file-read operations (`list_files`, `read_file`) must normalize paths with `path.posix.normalize()`, allowlist only `src/`, `public/`, `api/`, `package.json`, `vercel.json`, and `vite.config.ts`, and reject `.env*`, `.git/*`, `node_modules/*`, or `..` segments.
- **Constant-Time Secret Comparison**: `ADMIN_SECRET` verification in `api/_lib/auth.js` must use `crypto.timingSafeEqual` and never leak `GITHUB_TOKEN` or `ADMIN_SECRET` to the client bundle.
- **Atomic Git Commits**: When updating multiple files or uploading an asset + project together in production, `studio-core.js` will use the GitHub Git Trees API (or sequential `sha`-verified `PUT /contents/` calls) so concurrent edits do not corrupt `src/data/portfolio.json`.

### 5. UX & Aesthetic Compliance (`egm-design` & `egm-comprehension`)
- **Lazy-Loaded Zero-Overhead Bundle**: `AdminStudioPage` will be loaded via `React.lazy()` so main portfolio visitors download 0 KB of admin code.
- **UI Compliance**: Adheres strictly to `.agents/rules/no-ai-slop-ui.md` — using `SpotlightCard` glass containers, `GlassDropdown`, custom dark/indigo scrollbars, icon-only top navigation buttons, and zero pulsing-dot status pill badges.

---

## Goals vs. Non-Goals

* **In-Scope Goals:**
  1. Extract portfolio and case study data into `src/data/portfolio.json` (re-exported with full TypeScript types via `src/data/portfolio.ts`) and CRM mock data into `src/data/crm.json` (`src/data/crm.ts`).
  2. Build shared backend adapter `api/_lib/studio-core.js` + `api/_lib/mcp-tools.js` supporting local `fs` in Vite dev middleware and GitHub REST API commits in production.
  3. Expose `/api/admin` (REST) and `/api/mcp` (MCP Streamable HTTP JSON-RPC 2.0 with tools: `list_pages`, `list_files`, `read_file`, `read_project`, `upsert_project`, `update_crm_data`, `upload_asset`).
  4. Build `/admin` (`src/components/admin/AdminStudioPage.tsx`) featuring:
     - **Route & Pages Explorer**: Visual map of `/`, `/projects`, `/case-study/:slug`, `/software`, and `/admin` with component links and live preview.
     - **Projects & Case Studies Editor**: Form + JSON split editor with live card preview and asset uploader.
     - **CRM Sandbox Data Editor**: Visual editor for `crm.json` deals, workflows, and AI meeting transcripts.
     - **Repository File Inspector**: Tree browser and code viewer/editor for allowlisted repo files (`src/`, `public/`, `api/`).
     - **MCP Inspector & Playground**: Interactive tool runner to test MCP calls (`list_pages`, `read_project`, `upsert_project`) directly in the browser and copy the MCP client config JSON.
* **Out-of-Scope Non-Goals:**
  1. External SQL/NoSQL databases (PostgreSQL, Supabase, MongoDB, Redis).
  2. Multi-user RBAC or third-party OAuth providers (uses single-owner `ADMIN_SECRET` for write mode and zero-login Sandbox Mode for read/preview).
  3. Arbitrary shell execution or editing restricted files (`.env`, `.git`, `node_modules`).

---

## Alternatives Weighed

1. **External Headless CMS or BaaS (Supabase / Sanity / Contentful)**
   - *Rejected by author:* Requires external database provisioning, separate account credentials, and schema sync overhead. User explicitly requested a zero-database system built directly inside the repository.
2. **Third-Party Git CMS Library (Decap CMS / Keystatic / TinaCMS)**
   - *Rejected during architecture review:* Off-the-shelf Git CMS packages inject heavy opinionated UI bundles that clash with the portfolio's custom glassmorphic aesthetic and do not expose an integrated MCP tool server or repository file/route explorer.
3. **Mutating `src/data/portfolio.ts` via Regex / AST String Replacement**
   - *Rejected during codebase review:* Rewriting TypeScript source code on the fly is error-prone. Splitting data into `src/data/portfolio.json` while preserving `src/data/portfolio.ts` as a typed wrapper gives safe `JSON.parse` / `JSON.stringify` serialization and full TypeScript compatibility.

---

## Key Decisions & Staging for Next Steps

1. **Storage Layer**: `src/data/portfolio.json` + `src/data/crm.json` read/written via local `fs` in Vite dev middleware (`vite.config.ts`) and GitHub Contents API in production (`GITHUB_TOKEN`, `GITHUB_REPO="kramzzzy/portfolio-v2"`).
2. **Dual-Mode Access**: Visiting `/admin` defaults to **Sandbox Preview Mode** (edits persist in `sessionStorage` so recruiters/clients can test-drive the CMS and MCP tools safely); entering `ADMIN_SECRET` unlocks **Admin Write Mode** (persisting to disk / GitHub).
3. **MCP Endpoint**: Stateless JSON-RPC 2.0 endpoint at `/api/mcp` supporting `initialize`, `tools/list`, and `tools/call`.
