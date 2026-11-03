# Fiesta Gas Delivery: clickable PWA prototype

Mock-data prototype of the full delivery loop (customer, dispatcher, rider, owner). No backend; state lives in localStorage.

```bash
npm install
npm run dev                          # development
npm run build && npm run preview     # production build with the service worker (installable/offline), http://localhost:4173
npm test                             # refill-cycle engine tests
npm run e2e                          # full order loop across all 4 roles (needs the preview server running); screenshots -> knowledge/design/references/e2e/
```

Open `/` for the role launcher + 5-minute demo script. "Reset demo data" is on the launcher.
Static `dist/` can be hosted anywhere (HashRouter, relative base); PWA install needs HTTPS or localhost.

Prototype limits (by design): SMS/payments/GPS are simulated, brand colors are placeholders pending Petron approval, map is OpenStreetMap, location list is a PSGC subset.

## Demo flow
Open `/` (landing) -> Sign in -> pick a team member. Each browser tab keeps its own signed-in user (sessionStorage), so keep a customer tab and a dispatcher tab side by side. "Switch user" is in every header. Reset data from the landing page.
