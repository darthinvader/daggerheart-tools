# TASK024: Dialog Description A11y Pass

Goal: Remove warnings about missing Dialog description/aria-describedby and improve accessibility.

Plan:

- Ensure every DialogContent includes a matching Description or explicit aria-describedby.
- Update tests to assert presence.

Acceptance:

- No console warnings in test logs; aXe passes for dialog samples.
