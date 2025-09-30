# Project Improvement Plan

This plan outlines steps to address key architectural goals: reducing technical debt, maintenance cost, operational cost, and vendor lock-in, while increasing future-proofness, with a focus on dependency management.

**Goals:**

- Reduce Technical Debt
- Reduce Maintenance Cost
- Reduce Operational Cost
- Reduce Vendor Lock-in
- Increase Future Proofness

**Plan Overview:**

```mermaid
graph LR
    subgraph Goals
        direction LR
        G1(Reduce Tech Debt)
        G2(Reduce Maint. Cost)
        G3(Reduce Op. Cost)
        G4(Reduce Vendor Lock-in)
        G5(Increase Future Proofness)
    end

    subgraph "Phase 1: Stabilize Dependencies"
        direction TB
        P1_1(Pin Supabase Client<br/>`pnpm add @supabase/supabase-js@^<latest_stable>`) --> G2; P1_1 --> G1;
        P1_2(Adopt Consistent Versioning<br/>- Tilde (~) for UI libs (@radix-ui/*, cva, clsx, etc.)<br/>- Caret (^) for others (Next, React, Zod, etc.)) --> G2;
        P1_3(Audit & Remove Unused<br/>`pnpm dlx depcheck`) --> G2; P1_3 --> G1; P1_3 --> G3;
        P1_4(Consider `pnpm overrides`<br/>If conflicts arise) --> G2;
    end

    subgraph "Phase 2: Establish Processes"
        direction TB
        P2_1(Controlled Update Cadence<br/>e.g., Monthly/Quarterly) --> G2;
        P2_2(Use `pnpm outdated` for review) --> P2_1;
        P2_3(Automated Updates (Dependabot/Renovate)<br/>- Group updates<br/>- Run tests/lint<br/>- Human review/merge) --> G2; P2_3 --> G5;
        P2_4(Update Checklist<br/>- Run `next-codemod`<br/>- Check `next.config.mjs`<br/>- Review release notes) --> G2; P2_4 --> G1;
    end

    subgraph "Phase 3: Architectural Improvements"
        direction TB
        P3_1(Abstract External Services<br/>e.g., Supabase via `app/lib/supabase.ts`) --> G4; P3_1 --> G2; P3_1 --> G5;
        P3_2(Review UI Component Usage<br/>Value vs. Maintenance) --> G2; P3_2 --> G1;
    end

    Phase1 --> Phase2 --> Phase3
```

**Phase Details:**

**Phase 1: Stabilize Dependencies**

- **P1_1: Pin Supabase Client:** Replace `"latest"` with a stable caret version (`^x.y.z`) using `pnpm add @supabase/supabase-js@^<version>`. (Addresses: Maintenance Cost, Tech Debt)
- **P1_2: Consistent Versioning:** Use **Tilde Ranges (`~x.y.z`)** for UI libraries (`@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`) to allow patch updates automatically. Use **Caret Ranges (`^x.y.z`)** for frameworks, core utilities, and dev dependencies. Apply consistently. (Addresses: Maintenance Cost)
- **P1_3: Audit Unused:** Run `pnpm dlx depcheck` and remove unnecessary packages. (Addresses: Maintenance Cost, Tech Debt, Op. Cost)
- **P1_4: Consider `pnpm overrides`:** Keep `pnpm overrides` in mind for resolving tricky dependency conflicts if they occur during updates. (Addresses: Maintenance Cost)

**Phase 2: Establish Processes**

- **P2_1: Update Cadence:** Define a regular schedule (e.g., monthly) for reviewing updates using `pnpm outdated`. (Addresses: Maintenance Cost)
- **P2_2: Review Tool:** Use `pnpm outdated` to identify packages needing updates during the scheduled review. (Part of P2_1)
- **P2_3: Automation (Dependabot/Renovate):** Set up Dependabot/Renovate to create PRs for updates. Configure grouping (e.g., `@radix-ui/*`) and ensure tests/lint run automatically. _Crucially, maintain human review before merging._ (Addresses: Maintenance Cost, Future Proofness)
- **P2_4: Update Checklist:** For major updates (especially Next.js), create a checklist: run relevant `next-codemod`s, check `next.config.mjs` for required changes, and review official upgrade guides/release notes. (Addresses: Maintenance Cost, Tech Debt)

**Phase 3: Architectural Improvements**

- **P3_1: Abstract Services:** Ensure all Supabase (and potentially other external service) interactions are channeled through dedicated abstraction layers (like `app/lib/supabase.ts`) with clear interfaces. (Addresses: Vendor Lock-in, Maintenance Cost, Future Proofness)
- **P3_2: Review UI:** Periodically assess if the large number of UI components is still justified or if simplification is possible to reduce the dependency footprint. (Addresses: Maintenance Cost, Tech Debt)
