# Branches and access control

**Problem.** Fiesta Gas may run several depots. Stock, riders, dispatch and cash must be separable per branch; staff must only do and see what their role and branch allow.

**Scope.** Branch registry (add/edit/deactivate), per-branch stock/thresholds/riders/customers/orders, inter-branch stock transfer, owner branch switcher, permission-based roles (system + custom), user registry with branch scope, store-level enforcement.

**PRD tie-back.** Add-on "multi-branch"; open question "riders, branches, active customers now?".

**Entities/services.** Branch, Role(perms), User(role, branchIds), Order/Customer/Rider/Movement `branchId`, `stocks[branchId]`. See `best-practices/rbac-and-branches.md`.

**Stories.** stories/ (branch registration, team and roles, branch scoping, stock transfer).
