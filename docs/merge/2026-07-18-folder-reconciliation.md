# Merge Note: 2026-07-18 Proxima Folder Reconciliation

## Sources Reviewed

- `/Users/shailanshgaur/AI Projects/Proxima`
- `/Users/shailanshgaur/AI Projects/Proxima - codex`

## Target Repo

`/Users/shailanshgaur/AI Projects/Proxima - codex` remains the build target because it contains the newer AppShell/tab architecture, Proxima package identity, Tailwind setup, product and ride services, and migrations 005-006.

## Preserved From Older Repo

- `PROXIMA-MASTER-DESIGN.md` was copied into `docs/product/PROXIMA-MASTER-DESIGN.md`.
- Existing snapshots of both folders were created under `/private/tmp/proxima-merge-safe/` before merge work.

## Reviewed But Not Ported

- Older route-based auth/page text edits rename Zing Connect to Proxima, but those files/components are absent or obsolete in the AppShell architecture.
- The old `HomePage.tsx` session-to-signup redirect fix is superseded by `authService.getCurrentProfile()` and AppShell profile gating in the target app.

## Remaining Local Work In Target

- `.gitignore` includes `.env*`.
- `scripts/seed-lotus-zing.sql` and `scripts/verify-migrations.sql` are present as local SQL utilities.
