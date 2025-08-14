# TASK028: Route Splitting & Prefetch

Goal: Further reduce initial route payload beyond current lazy cards.

Plan:

- Split $id.tsx non-critical sections into child routes or code-split chunks where practical.
- Prefetch likely-needed chunks on hover/idle.

Acceptance:

- Measured initial JS reduction vs. prior snapshot.
