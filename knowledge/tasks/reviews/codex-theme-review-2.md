1. **P2 — `src/pages/customer/Customer.tsx:104–110`; screenshot: customer placed.** The active timeline step shows “Now” but completed steps have no timestamps. When a customer checks whether the order has progressed, they can’t tell when it was assigned or went out for delivery. The spec calls for timestamps on the status timeline.

2. **P2 — `src/components/ui.tsx:67–71`; screenshots: customer placed, rider out-for-delivery.** The phone header’s switch-user control has an 11px-high hit area (`size-11` is overridden by `size-9` from `Button`’s `size="sm"`). On a phone, tapping the icon can be difficult; the spec requires 44px touch targets.

3. **P2 — `src/components/ui.tsx:16–17`; screenshots: all screens with the brand mark.** The flame mark is placed on bright orange (`--brand: #F04A2D`) with a white icon. The spec limits this token to a decorative mark and lists 3.7:1 contrast against white; that falls short for the icon’s visual contrast. This is most noticeable in the phone headers, where the mark sits against blue.

4. **P2 — `src/pages/SignIn.tsx:22`; screenshot: sign-in.** The selected account row is indicated by a blue border and fill, but has no checkmark. A user navigating the list may have to infer which account is already selected; the spec explicitly asks for a blue selected border and checkmark.

5. **P2 — `src/pages/dispatcher/Board.tsx` (UNVERIFIED line); screenshot: signed-in dispatcher board.** The queue tables extend past the visible phone-width viewport, cutting off status and action columns. A dispatcher opening the board on a phone cannot see or use those controls without horizontal scrolling. The supplied screenshot shows this clipping; confirm the exact JSX line with `Board.tsx`.

6. **P2 — `src/components/ui.tsx:78–82`; screenshots: customer placed, rider out-for-delivery.** Bottom-nav links have a 2px active indicator and 56px minimum height, but the icon and label are tightly packed against the bar’s edges. On short screens, the fixed bar can feel cramped, especially with the system safe area; the screenshots show it flush to the bottom. **UNVERIFIED:** no safe-area inset handling is visible in the inspected shell code.
