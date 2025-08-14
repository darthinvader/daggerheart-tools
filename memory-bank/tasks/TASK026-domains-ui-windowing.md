# TASK026: Domains UI Windowing

Goal: Reduce render work in Domains drawer when many cards are selected.

Plan:

- Render only visible domain chips/cards using simple windowing.
- Keep keyboard navigation and screen reader flow intact.

Acceptance:

- No noticeable jank with 200+ domain entries.
