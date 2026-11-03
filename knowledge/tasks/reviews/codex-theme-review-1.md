1. **P2 — `Customer.tsx:64–65`** — The “Demo customer” selector uses a compact control, below the spec’s 44px phone touch target. On a phone, customers can miss it when trying to switch demo personas.

2. **P2 — `ui.tsx:67–71`** — The phone header’s “Switch user” button uses the small button size, and its text is hidden below `sm`; the icon-only target is only 32px tall. This is difficult to tap on a phone and lacks visible text to identify its purpose.

3. **P2 — `SignIn.tsx:20–25`** — Sign-in rows have no selected state or checkmark. A user selecting a demo account gets no visual confirmation of which role they chose, contrary to the sign-in spec.

4. **P2 — `Board.tsx:32–37`** — Dispatcher assignment and cancel controls use `sm` sizing; the native select is also compact. These controls fall below the 44px minimum if the dispatcher board is used on a phone.

5. **P2 — `MapView.tsx:7,30` and `Rider.tsx:106`** — Map status colors, the marker outline, and the rider marker use hardcoded hex values. This bypasses the theme tokens, so a palette change can leave the map inconsistent with the rest of the app.

6. **P3 — `ui/chart.tsx:65`** — The chart styling still targets Recharts’ default `#ccc` grid stroke directly. That leaves a default-looking hardcoded color in the chart component instead of using the border token.

7. **P3 — `ui/chart.tsx:253`** — Chart tooltip values use `font-mono`, despite the spec calling for Inter throughout and reserving tabular numerals for data. The tooltip’s numerals can look visually inconsistent with the rest of the dashboard.

8. **P3 — `SignIn.tsx:22`** — Demo account initials are placed in outlined circular avatar chips. This is an unnecessary decorative element in the role rows, which the spec asks to keep simple and consistent.

9. **P3 — `Landing.tsx:34–35`** — The landing header includes a “Clickable prototype” badge and a second sign-in button alongside the main sign-in CTA. These compete for attention with the page’s primary action.
