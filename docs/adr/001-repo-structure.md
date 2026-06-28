# ADR-001: Reorganize The Proxima Repository Around The Active Product

**Status:** Accepted
**Date:** 2026-06-29
**Deciders:** Product, engineering

## Context

The repository had active Proxima application code, in-progress redesign files, operational scripts, and a large set of inherited ZingConnect artifacts mixed together at the top level. That made the project harder to scan, increased the chance of working in the wrong file set, and blurred the distinction between shipping code and historical reference material.

## Decision

We reorganized the repository so the active product is the default story:

- product strategy lives in `docs/product/`
- design system material lives in `docs/design/`
- testing guidance lives in `docs/testing/`
- legacy ZingConnect artifacts live in `archive/zingconnect/`
- application code remains in `src/`

We also aligned the package name with the active brand: `proxima`.

## Options Considered

### Option A: Leave the repo as-is

**Pros:** No churn, no path changes.
**Cons:** High cognitive load, weak product signal, legacy artifacts continue to dominate the root.

### Option B: Delete legacy artifacts

**Pros:** Cleanest visible structure.
**Cons:** Loses historical research, implementation context, and reusable source material.

### Option C: Archive legacy artifacts and elevate active product files

**Pros:** Cleaner root, preserves context, easier onboarding, safer than deletion.
**Cons:** Requires path updates and a one-time repo cleanup.

## Trade-off Analysis

Option C gives us the product clarity of a cleanup without paying the cost of data loss. It keeps the root focused on the current app while preserving the earlier ZingConnect phase for reference and auditability.

## Consequences

- It becomes easier to understand where active work should happen.
- Product, design, and testing documents are easier to find.
- Legacy context is still available, but no longer competes with current product files.
- Existing internal file references must point to the new docs locations.

## Action Items

1. [x] Move testing documentation into `docs/testing/`
2. [x] Move product and design working docs into dedicated doc folders
3. [x] Archive legacy ZingConnect artifacts under `archive/zingconnect/`
4. [x] Update internal references to moved docs
5. [ ] Decide whether exploratory folders like `design-system/` should become first-class or also move under `docs/`
