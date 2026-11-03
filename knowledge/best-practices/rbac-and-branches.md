# RBAC and multi-branch (prototype)

**Researched approach.** Permission-based RBAC, not role-name checks: code asks `can(user, 'inventory.manage')`, never `role === 'owner'`. Roles are data (a named set of permissions) so the owner can create e.g. a "Cashier" role without a release. Scope is a second axis: each user has `branchIds` (or `all`). A permission says WHAT, scope says WHERE. Both are enforced in the store (actions throw), and mirrored in the UI (nav, guards, branch switcher) so the UI is convenience, not security.

**Why.** PRD lists multi-branch as an add-on and asks "riders, branches?" (open question). Flexible registration avoids hard-coding Dagupan + Alaminos.

**Prototype limits.** No passwords or server: enforcement is client-side and a demo of the model. Production: Supabase Auth + Postgres RLS using the same role/permission/branch tables.

**YAGNI cuts.** No per-permission-per-branch matrix (one scope list per user), no role inheritance, no audit log UI, no branch hierarchy.
