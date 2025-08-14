# TASK021: shadcn UI Alignment Audit

Goal: Ensure our `components/ui/*` matches stock shadcn templates to simplify maintenance.

Plan:

- Diff each component against current shadcn templates.
- Revert behavioral customizations; keep tokenized styling.
- Add notes where divergences are intentional (e.g., data attributes for tests).

Acceptance:

- No a11y warnings for Dialog; consistent props across wrappers.
