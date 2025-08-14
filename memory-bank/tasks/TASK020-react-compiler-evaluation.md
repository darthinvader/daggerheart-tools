# TASK020: React 19 Compiler Evaluation

Goal: Evaluate enabling the React Compiler to optimize memoization and reactivity.

Plan:

- Audit code for unsupported patterns (dynamic hooks, non-deterministic renders).
- Enable compiler in Vite plugin react-swc config (experimental flag) on a branch.
- Start with a small subtree (characters/$id.tsx route) under a feature flag.
- Measure re-renders with React Profiler before/after.

Risks:

- Subtle memoization bugs; watch effects and refs.

Acceptance:

- No test failures; measurable render reductions in equipment/inventory interactions.
