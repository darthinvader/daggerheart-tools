# TASK023: Trim Inventory Homebrew Item Form

Goal: Reduce `homebrew-item-form.tsx` complexity and size by extracting repeated sections and pure helpers.

Plan:

- Extract FieldGroup components (Name, Cost, Tags, Category Details).
- Move transformation logic to `build-homebrew-item.ts` utilities with tests.
- Keep RHF wiring with FormProvider; avoid nested forms.

Acceptance:

- File < 6.5 KB and complexity reduced; tests green.
