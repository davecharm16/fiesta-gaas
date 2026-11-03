OpenAI Codex v0.165.0
--------
workdir: /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
model: gpt-6-luna
provider: openai
approval: never
sandbox: read-only
reasoning effort: medium
reasoning summaries: none
session id: 01a18d87-e320-7383-906e-073fc1798f90
--------
user
You are reviewing a client-demo PWA prototype for a Pangasinan LPG delivery business (Fiesta Gas). Spec: ../knowledge/product_docs/FiestaGas_PRD.md. Code: ./src (Vite + React + TS, mock data in localStorage, HashRouter).
Review for: (1) correctness bugs in src/lib (refill-cycle rules vs the PRD, store actions, inventory deduction, derive.ts), (2) demo-breaking UX bugs in src/pages (flows: customer orders -> dispatcher assigns -> rider delivers -> owner analytics/inventory), (3) PRD features obviously missing from the demo that a client would expect to see, (4) PWA/offline problems in vite.config.ts. Do NOT edit files. Report findings ranked by severity as: file:line - problem - suggested fix. Max 15 findings, no praise, no style nitpicks.

codex
I’ll read the PRD and inspect the library, key pages, and Vite PWA configuration, then report only actionable issues with file and line references.
exec
/bin/bash -lc "pwd && rg --files src && rg --files | rg 'vite\\.config|package\\.json|FiestaGas_PRD\\.md'" in /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
 succeeded in 438ms:
/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
src/pages/customer/Customer.tsx
src/pages/dispatcher/Customers.tsx
src/pages/dispatcher/Board.tsx
src/pages/dispatcher/NewOrder.tsx
src/pages/rider/Rider.tsx
src/pages/owner/Ops.tsx
src/pages/owner/Engage.tsx
src/pages/owner/Dashboard.tsx
src/pages/Launcher.tsx
src/lib/geo.ts
src/lib/store.ts
src/lib/derive.ts
src/lib/types.ts
src/lib/seed.ts
src/lib/refill.ts
src/lib/refill.test.ts
src/components/ui.tsx
src/components/MapView.tsx
src/index.css
src/main.tsx
src/App.tsx
vite.config.ts
package.json
node_modules/define-data-property/package.json
node_modules/path-scurry/package.json
node_modules/stringify-object/package.json
node_modules/tinyglobby/package.json
node_modules/path-scurry/node_modules/lru-cache/package.json
node_modules/idb/package.json
node_modules/jsesc/package.json
node_modules/path-scurry/node_modules/lru-cache/dist/commonjs/package.json
node_modules/which-boxed-primitive/package.json
node_modules/path-scurry/node_modules/lru-cache/dist/esm/package.json
node_modules/workbox-strategies/package.json
node_modules/obug/package.json
node_modules/assertion-error/package.json
node_modules/type-fest/package.json
node_modules/is-bigint/package.json
node_modules/es-errors/package.json
node_modules/has-property-descriptors/package.json
node_modules/call-bind/package.json
node_modules/typed-array-length/package.json
node_modules/foreground-child/package.json
node_modules/path-scurry/dist/commonjs/package.json
node_modules/vitest/package.json
node_modules/tempy/package.json
node_modules/universalify/package.json
node_modules/babel-plugin-polyfill-corejs3/package.json
node_modules/path-scurry/dist/esm/package.json
node_modules/core-js-compat/package.json
node_modules/possible-typed-array-names/package.json
node_modules/foreground-child/dist/commonjs/package.json
node_modules/is-stream/package.json
node_modules/lru-cache/package.json
node_modules/call-bound/package.json
node_modules/function.prototype.name/package.json
node_modules/is-array-buffer/package.json
node_modules/foreground-child/dist/esm/package.json
node_modules/regexp.prototype.flags/package.json
node_modules/es-object-atoms/package.json
node_modules/has-tostringtag/package.json
node_modules/es-abstract-get/package.json
node_modules/brace-expansion/package.json
node_modules/lodash.debounce/package.json
node_modules/regjsgen/package.json
node_modules/is-typed-array/package.json
node_modules/functions-have-names/package.json
node_modules/jackspeak/package.json
node_modules/ms/package.json
node_modules/stop-iteration-iterator/package.json
node_modules/lightningcss-darwin-arm64/package.json
node_modules/isexe/package.json
node_modules/shebang-regex/package.json
node_modules/is-module/package.json
node_modules/brace-expansion/dist/commonjs/package.json
node_modules/string.prototype.trimstart/package.json
node_modules/std-env/package.json
node_modules/browserslist/package.json
node_modules/brace-expansion/dist/esm/package.json
node_modules/jackspeak/dist/commonjs/package.json
node_modules/@rolldown/pluginutils/package.json
node_modules/@isaacs/cliui/package.json
node_modules/array-buffer-byte-length/package.json
node_modules/unique-string/package.json
node_modules/@babel/plugin-transform-optional-catch-binding/package.json
node_modules/source-map-js/package.json
node_modules/jackspeak/dist/esm/package.json
node_modules/has-proto/package.json
node_modules/@rolldown/binding-darwin-arm64/package.json
node_modules/vite-plugin-pwa/package.json
node_modules/node-releases/package.json
node_modules/string.prototype.trimend/package.json
node_modules/lightningcss/package.json
node_modules/@babel/plugin-transform-for-of/package.json
node_modules/workbox-precaching/package.json
node_modules/is-obj/package.json
node_modules/math-intrinsics/package.json
node_modules/@isaacs/cliui/dist/commonjs/package.json
node_modules/debug/package.json
node_modules/is-regexp/package.json
node_modules/@babel/helper-optimise-call-expression/package.json
node_modules/csstype/package.json
node_modules/workbox-core/package.json
node_modules/pretty-bytes/package.json
node_modules/workbox-google-analytics/package.json
node_modules/is-negative-zero/package.json
node_modules/require-from-string/package.json
node_modules/vite-plugin-pwa/types/package.json
node_modules/@babel/plugin-transform-explicit-resource-management/package.json
node_modules/electron-to-chromium/package.json
node_modules/call-bind-apply-helpers/package.json
node_modules/side-channel-list/package.json
node_modules/@types/react/package.json
node_modules/react-router/package.json
node_modules/@babel/plugin-transform-modules-commonjs/package.json
node_modules/async-function/package.json
node_modules/data-view-byte-offset/package.json
node_modules/chai/package.json
node_modules/tinybench/package.json
node_modules/is-generator-function/package.json
node_modules/@babel/helper-create-class-features-plugin/package.json
node_modules/es-abstract/package.json
node_modules/escalade/package.json
node_modules/path-key/package.json
node_modules/typed-array-byte-offset/package.json
node_modules/@babel/plugin-transform-logical-assignment-operators/package.json
node_modules/regexpu-core/package.json
node_modules/resolve/package.json
node_modules/@isaacs/cliui/dist/esm/package.json
node_modules/reflect.getprototypeof/package.json
node_modules/estree-walker/package.json
node_modules/supports-preserve-symlinks-flag/package.json
node_modules/@babel/plugin-transform-class-properties/package.json
node_modules/gensync/package.json
node_modules/@types/node/package.json
node_modules/string.prototype.trim/package.json
node_modules/@babel/plugin-transform-duplicate-keys/package.json
node_modules/own-keys/package.json
node_modules/json-schema-traverse/package.json
node_modules/@trickfilm400/rollup-plugin-off-main-thread/package.json
node_modules/resolve/test/resolver/false_main/package.json
node_modules/signal-exit/package.json
node_modules/resolve/test/resolver/incorrect_main/package.json
node_modules/resolve/test/resolver/nested_symlinks/mylib/package.json
node_modules/undici-types/package.json
node_modules/signal-exit/dist/cjs/package.json
node_modules/@types/estree/package.json
node_modules/signal-exit/dist/mjs/package.json
node_modules/resolve/test/resolver/browser_field/package.json
node_modules/typed-array-byte-length/package.json
node_modules/rolldown/package.json
node_modules/resolve/test/resolver/baz/package.json
node_modules/@types/trusted-types/package.json
node_modules/@babel/helpers/package.json
node_modules/data-view-buffer/package.json
node_modules/@types/react-dom/package.json
node_modules/resolve/test/resolver/dot_slash_main/package.json
node_modules/@types/leaflet/package.json
node_modules/shebang-command/package.json
node_modules/ejs/package.json
node_modules/@types/deep-eql/package.json
node_modules/resolve/test/resolver/multirepo/packages/package-a/package.json
node_modules/acorn/package.json
node_modules/fast-deep-equal/package.json
node_modules/@types/resolve/package.json
node_modules/resolve/test/resolver/multirepo/packages/package-b/package.json
node_modules/resolve/test/resolver/multirepo/package.json
node_modules/deepmerge/package.json
node_modules/fs-extra/package.json
node_modules/@babel/helper-define-polyfill-provider/package.json
node_modules/@types/chai/package.json
node_modules/resolve/test/resolver/invalid_main/package.json
node_modules/fsevents/package.json
node_modules/fdir/package.json
node_modules/resolve/test/resolver/dot_main/package.json
node_modules/@types/geojson/package.json
node_modules/side-channel-weakmap/package.json
node_modules/nanoid/url-alphabet/package.json
node_modules/nanoid/package.json
node_modules/@babel/helper-create-regexp-features-plugin/package.json
node_modules/is-shared-array-buffer/package.json
node_modules/@trickfilm400/rollup-plugin-off-main-thread/node_modules/magic-string/package.json
node_modules/nanoid/non-secure/package.json
node_modules/hasown/package.json
node_modules/regenerate-unicode-properties/package.json
node_modules/@babel/plugin-transform-class-static-block/package.json
node_modules/unbox-primitive/package.json
node_modules/dunder-proto/package.json
node_modules/resolve/test/resolver/symlinked/package/package.json
node_modules/nanoid/async/package.json
node_modules/commander/package.json
node_modules/set-function-name/package.json
node_modules/@babel/compat-data/package.json
node_modules/scheduler/package.json
node_modules/@babel/plugin-syntax-unicode-sets-regex/package.json
node_modules/workbox-broadcast-update/package.json
node_modules/workbox-recipes/package.json
node_modules/is-number-object/package.json
node_modules/@babel/plugin-transform-exponentiation-operator/package.json
node_modules/@babel/plugin-transform-template-literals/package.json
node_modules/get-own-enumerable-property-symbols/package.json
node_modules/@babel/plugin-transform-duplicate-named-capturing-groups-regex/package.json
node_modules/@vitejs/plugin-react/package.json
node_modules/@babel/plugin-transform-modules-amd/package.json
node_modules/@babel/plugin-transform-object-rest-spread/package.json
node_modules/@babel/preset-env/data/package.json
node_modules/@typescript/typescript-darwin-arm64/package.json
node_modules/@babel/plugin-transform-regexp-modifiers/package.json
node_modules/common-tags/package.json
node_modules/esutils/package.json
node_modules/crypto-random-string/package.json
node_modules/@babel/preset-env/package.json
node_modules/serialize-javascript/package.json
node_modules/@babel/plugin-transform-new-target/package.json
node_modules/is-weakset/package.json
node_modules/resolve/test/module_dir/zmodules/bbb/package.json
node_modules/@babel/helper-annotate-as-pure/package.json
node_modules/temp-dir/package.json
node_modules/balanced-match/package.json
node_modules/get-intrinsic/package.json
node_modules/@babel/plugin-proposal-private-property-in-object/package.json
node_modules/is-date-object/package.json
node_modules/graceful-fs/package.json
node_modules/minimatch/package.json
node_modules/js-tokens/package.json
node_modules/babel-plugin-polyfill-regenerator/package.json
node_modules/object.assign/package.json
node_modules/balanced-match/dist/commonjs/package.json
node_modules/fast-uri/package.json
node_modules/jsonfile/package.json
node_modules/@babel/helper-module-imports/package.json
node_modules/minimatch/dist/commonjs/package.json
node_modules/oxlint/package.json
node_modules/fast-json-stable-stringify/package.json
node_modules/balanced-match/dist/esm/package.json
node_modules/baseline-browser-mapping/package.json
node_modules/detect-libc/package.json
node_modules/typed-array-buffer/package.json
node_modules/minimatch/dist/esm/package.json
node_modules/@babel/plugin-transform-spread/package.json
node_modules/fast-uri/benchmark/package.json
node_modules/leven/package.json
node_modules/object-inspect/package.json
node_modules/@rollup/pluginutils/package.json
node_modules/@babel/plugin-transform-unicode-sets-regex/package.json
node_modules/is-map/package.json
node_modules/strip-comments/package.json
node_modules/magic-string/package.json
node_modules/is-core-module/package.json
node_modules/@babel/plugin-transform-numeric-separator/package.json
node_modules/unicode-match-property-ecmascript/package.json
node_modules/@rollup/pluginutils/node_modules/estree-walker/src/package.json
node_modules/@rollup/pluginutils/node_modules/estree-walker/package.json
node_modules/@apideck/better-ajv-errors/package.json
node_modules/function-bind/package.json
node_modules/@babel/plugin-transform-parameters/package.json
node_modules/unicode-match-property-value-ecmascript/package.json
node_modules/jake/package.json
node_modules/typescript/vendor/vscode-jsonrpc/package.json
node_modules/@rollup/pluginutils/node_modules/estree-walker/dist/esm/package.json
node_modules/@babel/plugin-syntax-import-attributes/package.json
node_modules/is-symbol/package.json
node_modules/@babel/plugin-transform-private-methods/package.json
node_modules/picomatch/package.json
node_modules/is-async-function/package.json
node_modules/@babel/template/package.json
node_modules/typescript/package.json
node_modules/workbox-build/package.json
node_modules/@rollup/pluginutils/dist/es/package.json
node_modules/source-map-support/package.json
node_modules/@rollup/plugin-babel/package.json
node_modules/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining/package.json
node_modules/workbox-build/node_modules/pretty-bytes/package.json
node_modules/@babel/helper-remap-async-to-generator/package.json
node_modules/@rollup/rollup-darwin-arm64/package.json
node_modules/vite/package.json
node_modules/@babel/traverse/package.json
node_modules/@rollup/plugin-node-resolve/package.json
node_modules/@rollup/plugin-babel/dist/es/package.json
node_modules/source-map-support/node_modules/source-map/package.json
node_modules/@rollup/plugin-node-resolve/dist/es/package.json
node_modules/@babel/plugin-transform-regenerator/package.json
node_modules/is-weakref/package.json
node_modules/@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression/package.json
node_modules/es-to-primitive/package.json
node_modules/@rollup/plugin-replace/package.json
node_modules/postcss/package.json
node_modules/@babel/plugin-transform-modules-umd/package.json
node_modules/@rollup/plugin-terser/package.json
node_modules/regenerate/package.json
node_modules/@rollup/plugin-replace/node_modules/magic-string/package.json
node_modules/async/package.json
node_modules/@rollup/plugin-replace/dist/es/package.json
node_modules/@babel/runtime/helpers/esm/package.json
node_modules/@babel/runtime/package.json
node_modules/path-parse/package.json
node_modules/define-properties/package.json
node_modules/smob/package.json
node_modules/@babel/code-frame/package.json
node_modules/is-finalizationregistry/package.json
node_modules/@rollup/plugin-terser/dist/es/package.json
node_modules/@babel/plugin-transform-async-to-generator/package.json
node_modules/@babel/plugin-transform-typeof-symbol/package.json
node_modules/arraybuffer.prototype.slice/package.json
node_modules/leaflet/package.json
node_modules/react-dom/package.json
node_modules/regjsparser/package.json
node_modules/@babel/plugin-transform-dynamic-import/package.json
node_modules/picocolors/package.json
node_modules/at-least-node/package.json
node_modules/workbox-expiration/package.json
node_modules/has-symbols/package.json
node_modules/@babel/plugin-transform-block-scoped-functions/package.json
node_modules/semver/package.json
node_modules/workbox-sw/package.json
node_modules/@babel/plugin-transform-unicode-regex/package.json
node_modules/es-define-property/package.json
node_modules/@babel/helper-compilation-targets/package.json
node_modules/safe-array-concat/package.json
node_modules/@babel/plugin-transform-member-expression-literals/package.json
node_modules/@babel/plugin-transform-named-capturing-groups-regex/package.json
node_modules/set-proto/package.json
node_modules/which-builtin-type/package.json
node_modules/internal-slot/package.json
node_modules/@babel/plugin-transform-reserved-words/package.json
node_modules/@babel/core/package.json
node_modules/@babel/plugin-transform-classes/package.json
node_modules/ajv/package.json
node_modules/@babel/plugin-transform-block-scoping/package.json
node_modules/@babel/plugin-transform-function-name/package.json
node_modules/@babel/helper-skip-transparent-expression-wrappers/package.json
node_modules/@babel/plugin-transform-sticky-regex/package.json
node_modules/workbox-routing/package.json
node_modules/@babel/helper-plugin-utils/package.json
node_modules/@babel/plugin-transform-shorthand-properties/package.json
node_modules/@babel/plugin-transform-optional-chaining/package.json
node_modules/@babel/helper-validator-option/package.json
node_modules/@babel/plugin-transform-async-generator-functions/package.json
node_modules/@babel/helper-globals/package.json
node_modules/@babel/plugin-transform-computed-properties/package.json
node_modules/@babel/types/package.json
node_modules/@babel/helper-member-expression-to-functions/package.json
node_modules/@babel/plugin-transform-nullish-coalescing-operator/package.json
node_modules/@babel/helper-string-parser/package.json
node_modules/@babel/plugin-transform-json-strings/package.json
node_modules/@babel/plugin-bugfix-safari-rest-destructuring-rhs-array/package.json
node_modules/@babel/plugin-transform-arrow-functions/package.json
node_modules/@babel/plugin-transform-private-property-in-object/package.json
node_modules/@babel/plugin-transform-literals/package.json
node_modules/@babel/plugin-transform-dotall-regex/package.json
node_modules/@babel/plugin-transform-unicode-property-regex/package.json
node_modules/@babel/plugin-transform-unicode-escapes/package.json
node_modules/@babel/plugin-bugfix-firefox-class-in-computed-class-key/package.json
node_modules/@babel/helper-replace-supers/package.json
node_modules/@babel/plugin-transform-export-namespace-from/package.json
node_modules/upath/package.json
node_modules/@babel/helper-validator-identifier/package.json
node_modules/@babel/plugin-transform-object-super/package.json
node_modules/@babel/plugin-bugfix-safari-class-field-initializer-scope/package.json
node_modules/@babel/plugin-syntax-import-assertions/package.json
node_modules/@babel/plugin-transform-modules-systemjs/package.json
node_modules/@babel/preset-modules/package.json
node_modules/@babel/generator/package.json
node_modules/@babel/plugin-transform-property-literals/package.json
node_modules/tinyexec/package.json
node_modules/filelist/package.json
node_modules/source-map/package.json
node_modules/update-browserslist-db/package.json
node_modules/babel-plugin-polyfill-corejs2/package.json
node_modules/@babel/helper-wrap-function/package.json
node_modules/why-is-node-running/package.json
node_modules/cookie/package.json
node_modules/json5/package.json
node_modules/for-each/package.json
node_modules/filelist/node_modules/minimatch/package.json
node_modules/set-cookie-parser/package.json
node_modules/@babel/parser/package.json
node_modules/is-data-view/package.json
node_modules/workbox-streams/package.json
node_modules/eta/package.json
node_modules/filelist/node_modules/brace-expansion/package.json
node_modules/filelist/node_modules/balanced-match/package.json
node_modules/safe-push-apply/package.json
node_modules/yallist/package.json
node_modules/convert-source-map/package.json
node_modules/is-set/package.json
node_modules/glob/package.json
node_modules/minipass/package.json
node_modules/get-symbol-description/package.json
node_modules/workbox-navigation-preload/package.json
node_modules/side-channel/package.json
node_modules/cross-spawn/package.json
node_modules/minipass/dist/commonjs/package.json
node_modules/gopd/package.json
node_modules/glob/dist/commonjs/package.json
node_modules/react-router-dom/package.json
node_modules/@babel/plugin-transform-destructuring/package.json
node_modules/minipass/dist/esm/package.json
node_modules/@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly/package.json
node_modules/safe-regex-test/package.json
node_modules/glob/dist/esm/package.json
node_modules/has-bigints/package.json
node_modules/rollup/package.json
node_modules/is-document.all/package.json
node_modules/object-keys/package.json
node_modules/@babel/helper-module-transforms/package.json
node_modules/is-regex/package.json
node_modules/workbox-window/package.json
node_modules/package-json-from-dist/package.json
node_modules/@oxlint/binding-darwin-arm64/package.json
node_modules/rollup/node_modules/@types/estree/package.json
node_modules/es-module-lexer/package.json
node_modules/workbox-range-requests/package.json
node_modules/which-collection/package.json
node_modules/which-typed-array/package.json
node_modules/side-channel-map/package.json
node_modules/isarray/package.json
node_modules/package-json-from-dist/dist/commonjs/package.json
node_modules/rollup/dist/es/package.json
node_modules/expect-type/package.json
node_modules/is-boolean-object/package.json
node_modules/is-weakmap/package.json
node_modules/data-view-byte-length/package.json
node_modules/package-json-from-dist/dist/esm/package.json
node_modules/which/package.json
node_modules/get-proto/package.json
node_modules/generator-function/package.json
node_modules/set-function-length/package.json
node_modules/@jridgewell/remapping/package.json
node_modules/buffer-from/package.json
node_modules/globalthis/package.json
node_modules/unicode-property-aliases-ecmascript/package.json
node_modules/@vitest/mocker/package.json
node_modules/es-set-tostringtag/package.json
node_modules/unicode-canonical-property-names-ecmascript/package.json
node_modules/terser/dist/package.json
node_modules/terser/package.json
node_modules/is-string/package.json
node_modules/workbox-cacheable-response/package.json
node_modules/terser/bin/package.json
node_modules/@vitest/spy/package.json
node_modules/@oxc-project/types/package.json
node_modules/@jridgewell/sourcemap-codec/package.json
node_modules/@jridgewell/gen-mapping/package.json
node_modules/jsonpointer/package.json
node_modules/@jridgewell/trace-mapping/package.json
node_modules/is-callable/package.json
node_modules/@jridgewell/source-map/package.json
node_modules/react/package.json
node_modules/caniuse-lite/package.json
node_modules/string.prototype.matchall/package.json
node_modules/available-typed-arrays/package.json
node_modules/@jridgewell/resolve-uri/package.json
node_modules/workbox-background-sync/package.json

exec
/bin/bash -lc 'cat ../knowledge/product_docs/FiestaGas_PRD.md && cat src/lib/refill.ts src/lib/store.ts src/lib/derive.ts src/lib/types.ts vite.config.ts' in /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
 succeeded in 0ms:
# Fiesta Gas Delivery App — PRD

Source: `initial-docs/Fiesta Gas Delivery App — Initial Proposal.pdf` (Oct 29, 2026, Dave Charm). The PDF is archival; edit this file.
Status: **proposal / pre-discovery.** Baselines, targets and the open questions below are settled in discovery.

## Overview
Delivery + customer-management platform for a local Fiesta Gas (Petron partner) LPG distributor in Pangasinan.
Customers order refills online, riders deliver with payment and proof captured on the spot, and the business uses each
customer's refill cycle to send reminders and promos by SMS.

**Problem today:** orders arrive by call/text/Messenger and are tracked by hand; no customer map, no reorder history,
follow-ups depend on staff memory.

**Four parts:** (1) customer map + directory, (2) ordering + delivery (rider assignment, payment, proof of delivery,
cylinder inventory), (3) analytics (delivery speed, refill cycle), (4) automated engagement (reminders, follow-up list, SMS blasts).

## Goals & success metrics
| Goal | Measure |
|---|---|
| Faster deliveries | Avg minutes order placed → delivered, per rider and town |
| More repeat orders | Share of customers with a 2nd order; avg days between refills |
| Fewer lost customers | Overdue customers contacted, and how many reordered |
| Better promo results | Orders within a set window after an SMS blast |
| Less manual work | Dispatcher-encoded vs customer-placed orders |

## Roles
| Role | Interface | Main jobs |
|---|---|---|
| Customer | Mobile web app (PWA) | Order refill, pick size/payment, track rider, history |
| Dispatcher/Admin | Web dashboard | Encode call/text orders, manage map, assign riders, cancellations |
| Rider | Native Android app | Delivery list + route, collect payment, proof of delivery, log empties |
| Owner/Manager | Web dashboard | Analytics, products/prices/inventory, text blasts, review remittances |

Dispatcher-encoded orders are a first-class path (same flow as app orders).

## Domains (feature scope)
- **Customer mapping & search** — pin per customer (name, contact, town, barangay, street/purok, landmark); pins dropped by customer, rider or dispatcher; map filters (town, barangay, cylinder size, last order); barangay density view; search by name/mobile/town/barangay; PSGC standard town/barangay list (not free text).
- **Ordering** — size, quantity, type (refill swap | new tank with deposit); dispatcher encoding for walk-in/call/text; SMS/in-app confirmations and status.
- **Delivery & dispatch** — manual or nearest-rider assignment; status: Placed → Assigned → Out for delivery → Delivered | Failed; failed deliveries return to queue with reason.
- **Payment** — COD and e-wallet (GCash/Maya) recorded per order; online prepayment is an add-on; end-of-day rider remittance (expected vs turned over).
- **Proof of delivery** — photo, signature or OTP, auto GPS + timestamp, empties collected.
- **Inventory** — full/empty stock per size (delivery deducts full, empties add back), stock-in, rider load-out/return, customer-held cylinders and deposits, low-stock alerts, counts with adjustment reasons, movement/discrepancy report.
- **Analytics & refill cycle** — see rules below; dashboard: delivery time, time to dispatch, refill cycle, first-to-second interval, due/overdue, repeat rate, sales by area/product, failed deliveries.
- **Engagement** — auto refill reminder (configurable timing/template/quiet hours, opt-out); lead follow-up list + call outcome logging (reached, ordered, switched supplier, not interested, call back); prospects as leads; SMS blasts (segment, preview count, send/schedule, saved templates, delivery report + orders-after-blast). Promo only to consenting customers (Data Privacy Act).

### Refill-cycle rules
1. First order: default cycle from cylinder size + area average.
2. Second order sets first real cycle; first-to-second interval tracked separately (new-customer retention signal).
3. Later orders update the average cycle.
4. Expected next refill = last order date + avg cycle; past it by a grace period → overdue.

## Baseline vs out of scope
Baseline (fixed price) also includes offline sync, rider safety checklist, delivery zones/fees, inventory, sales/remittance reports.
Out of scope: Petron system integration (unless API provided), accounting/BIR invoicing/payroll, hardware, multi-warehouse and supplier POs.
Optional add-ons (quoted separately): customer feedback, typhoon mode, SMS keyword ordering, scheduled auto-refill, online prepayment, live rider tracking, multi-branch, loyalty/referrals, Messenger bot, route optimization, reseller portal, native customer app.

## Platform & tech (confirm after discovery)
Web admin (Next.js) + customer PWA + native Android rider app (React Native/Expo), one shared backend.
PostgreSQL + PostGIS (e.g. Supabase); Google Maps or Mapbox; PSA PSGC codes; local SMS gateway (Semaphore/M360); PayMongo/Xendit (add-on); Vercel hosting.
Why not native for customers: ~1 order/month/household, PWA from an SMS link avoids download friction. Why native for riders: background GPS, camera, offline storage.

## Commercials (indicative)
PHP 441,000–661,500 fixed, ~147 man-days at PHP 3,000–4,500; ~3–4 months with 2–3 people. Payments: 30% signing / 40% UAT build / 30% go-live. 30 days bug-fix warranty. Running costs (SMS ≈ PHP 0.56/msg, maps, hosting ≈ PHP 3–5k/mo) paid by distributor.

| Module | Man-days |
|---|---|
| Rider app | 20 |
| Inventory | 15 |
| Discovery + UI/UX | 12 |
| Directory, map, search, import | 12 |
| Order mgmt + dispatch | 12 |
| Customer PWA + OTP login | 12 |
| Testing + bug fixing | 12 |
| Analytics dashboard | 10 |
| Backend, roles, PSGC data | 8 |
| SMS blast + segments | 8 |
| Refill-cycle engine + reminders | 6 |
| Lead follow-up + call logging | 6 |
| Deploy, UAT, training | 6 |
| Payment logging, sales, remittance report | 5 |
| Delivery zones + fees | 3 |
| **Total** | **147** |

## Assumptions & risks
Assumes: distributor runs its own riders and sets own prices; riders have Android + data; an existing customer list can seed the map.
Risks: customers keep calling (→ dispatcher entry is full path, reminders link to order page); rural addresses (→ pin on first delivery + landmark); SMS cost growth (→ segment targeting, per-blast limits, cost preview); promo privacy complaints (→ explicit consent, opt-out in every message, consent records); Fiesta Gas/Petron branding (→ confirm guidelines before launch).

## Open questions (discovery)
Towns covered / all Pangasinan? · Riders, branches, active customers now? · Cylinder sizes, prices, deposit handling? · Households only or stores/resellers too? · Payment methods today? · Format of current customer list and stock records? · Who pays SMS/map costs post-launch? · Budget range and target launch date?
import type { Size } from './types'

export const DAY = 86_400_000
export const GRACE_DAYS = 3
export const REMIND_DAYS = 3
const SIZE_DEFAULT: Record<Size, number> = { '11kg': 35, '22kg': 20, '50kg': 12 }

export type RefillStatus = 'new' | 'ok' | 'due' | 'overdue'
export interface Refill {
  cycleDays: number
  source: 'default' | 'first' | 'average'
  firstToSecond?: number
  expectedNext: number
  daysUntil: number
  status: RefillStatus
}

/**
 * Refill-cycle rules (PRD):
 * 1 order  -> default cycle (area average, else cylinder-size default)
 * 2 orders -> first real cycle (also tracked as first-to-second interval)
 * 3+       -> average of all intervals
 * expected next = last order + cycle; overdue once past it by GRACE_DAYS; due inside REMIND_DAYS.
 */
export function computeRefill(deliveredAt: number[], size: Size, areaAvg: number | undefined, now: number): Refill | null {
  const t = [...deliveredAt].sort((a, b) => a - b)
  if (!t.length) return null
  const gaps = t.slice(1).map((x, i) => (x - t[i]) / DAY)
  const cycleDays = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : areaAvg ?? SIZE_DEFAULT[size]
  const expectedNext = t[t.length - 1] + cycleDays * DAY
  const daysUntil = (expectedNext - now) / DAY
  const status: RefillStatus = daysUntil < -GRACE_DAYS ? 'overdue' : daysUntil <= REMIND_DAYS ? 'due' : 'ok'
  return {
    cycleDays,
    source: !gaps.length ? 'default' : gaps.length === 1 ? 'first' : 'average',
    firstToSecond: gaps[0],
    expectedNext,
    daysUntil,
    status,
  }
}
import { useSyncExternalStore } from 'react'
import { DEPOSIT, REFILL_PRICE, town } from './geo'
import { seed } from './seed'
import type { Channel, Customer, DB, Order, Outcome, Payment, Size } from './types'

const KEY = 'fiesta-gas-demo-v1'
const load = (): DB => {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch { /* private mode: fall through to seed */ }
  return seed()
}
let db: DB = load()
const subs = new Set<() => void>()
const emit = () => { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* quota: keep in memory */ } subs.forEach((f) => f()) }
// Other tabs (e.g. dispatcher on one tab, rider on another) stay live.
addEventListener('storage', (e) => { if (e.key === KEY && e.newValue) { db = JSON.parse(e.newValue); subs.forEach((f) => f()) } })

export const useDB = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => db)
const set = (f: (d: DB) => DB) => { db = f(structuredClone(db)); emit() }
const uid = (p: string) => `${p}${Math.random().toString(36).slice(2, 8)}`
const sms = (d: DB, to: string, text: string, kind: 'status' | 'reminder' | 'blast' | 'otp') => d.sms.unshift({ id: uid('s'), to, text, at: Date.now(), kind })
const cust = (d: DB, id: string) => d.customers.find((c) => c.id === id)!

export const OTP = '4821' // demo one-time code, shown in the customer's SMS inbox

export const actions = {
  reset: () => { db = seed(); emit() },

  placeOrder(i: { customerId: string; size: Size; qty: number; type: 'refill' | 'new'; payment: Payment; channel: Channel }) {
    set((d) => {
      const c = cust(d, i.customerId)
      const amount = (REFILL_PRICE[i.size] + (i.type === 'new' ? DEPOSIT[i.size] : 0)) * i.qty + town(c.town).fee
      const o: Order = { id: `FG-${1000 + d.orders.length + 1}`, ...i, status: 'Placed', amount, placedAt: Date.now() }
      d.orders.push(o)
      sms(d, c.phone, `Fiesta Gas: order ${o.id} received (${i.qty}x ${i.size}, ₱${amount.toLocaleString()}). We'll text you when a rider is on the way.`, 'status')
      return d
    })
  },
  assign(orderId: string, riderId: string) {
    set((d) => {
      const o = d.orders.find((x) => x.id === orderId)!
      o.status = 'Assigned'; o.riderId = riderId; o.assignedAt = Date.now(); o.failReason = undefined
      sms(d, cust(d, o.customerId).phone, `Fiesta Gas: ${d.riders.find((r) => r.id === riderId)!.name} will deliver order ${o.id}.`, 'status')
      return d
    })
  },
  cancel(orderId: string) { set((d) => { d.orders.find((x) => x.id === orderId)!.status = 'Cancelled'; return d }) },
  startDelivery(orderId: string) {
    set((d) => {
      const o = d.orders.find((x) => x.id === orderId)!
      o.status = 'Out for delivery'
      const c = cust(d, o.customerId)
      sms(d, c.phone, `Fiesta Gas: your order ${o.id} is out for delivery. Delivery code: ${OTP}. Give it to the rider.`, 'otp')
      return d
    })
  },
  deliver(orderId: string, p: { pod: NonNullable<Order['pod']>; cash: number; empties: number }) {
    set((d) => {
      const o = d.orders.find((x) => x.id === orderId)!
      o.status = 'Delivered'; o.deliveredAt = Date.now(); o.pod = p.pod; o.cashCollected = o.payment === 'cod' ? p.cash : 0; o.empties = p.empties
      d.stock.full[o.size] -= o.qty
      d.stock.empty[o.size] += p.empties
      d.movements.unshift({ id: uid('m'), at: Date.now(), kind: 'delivery', size: o.size, full: -o.qty, empty: p.empties, note: `Order ${o.id}` })
      sms(d, cust(d, o.customerId).phone, `Fiesta Gas: order ${o.id} delivered. Salamat po!`, 'status')
      return d
    })
  },
  fail(orderId: string, reason: string) {
    set((d) => {
      const o = d.orders.find((x) => x.id === orderId)!
      o.status = 'Failed'; o.failReason = reason
      return d
    })
  },
  requeue(orderId: string) { set((d) => { const o = d.orders.find((x) => x.id === orderId)!; o.status = 'Placed'; o.riderId = undefined; return d }) },

  addCustomer(c: Omit<Customer, 'id' | 'heldCylinders'>) {
    let id = ''
    set((d) => { id = uid('c'); d.customers.push({ ...c, id, heldCylinders: 0 }); return d })
    return id
  },
  logFollowUp(customerId: string, outcome: Outcome) { set((d) => { d.followUps.unshift({ id: uid('f'), customerId, outcome, at: Date.now() }); return d }) },

  sendBlast(message: string, segment: string, recipients: string[]) {
    set((d) => {
      d.blasts.unshift({ id: uid('b'), message, segment, recipients, at: Date.now() })
      recipients.forEach((id) => sms(d, cust(d, id).phone, message, 'blast'))
      return d
    })
  },
  sendReminder(customerId: string) {
    set((d) => { sms(d, cust(d, customerId).phone, 'Fiesta Gas: baka paubos na ang gas ninyo! Order na: fiestagas.example/order — reply STOP to opt out.', 'reminder'); return d })
  },
  stockIn(size: Size, qty: number, note: string) {
    set((d) => {
      d.stock.full[size] += qty; d.stock.empty[size] = Math.max(0, d.stock.empty[size] - qty)
      d.movements.unshift({ id: uid('m'), at: Date.now(), kind: 'stock-in', size, full: qty, empty: -qty, note })
      return d
    })
  },
  remit(riderId: string, day: string, turnedOver: number) {
    set((d) => { d.remits = d.remits.filter((r) => !(r.riderId === riderId && r.day === day)); d.remits.push({ riderId, day, turnedOver }); return d })
  },
}
import { computeRefill, DAY, type Refill } from './refill'
import type { Customer, DB, Order } from './types'

export const delivered = (d: DB) => d.orders.filter((o) => o.status === 'Delivered')
export const byId = <T extends { id: string }>(a: T[], id?: string) => a.find((x) => x.id === id)
export const mins = (a: number, b: number) => Math.round((b - a) / 60_000)
export const peso = (n: number) => '₱' + Math.round(n).toLocaleString()
export const ago = (t: number, now = Date.now()) => {
  const m = Math.round((now - t) / 60_000)
  return m < 1 ? 'just now' : m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`
}
export const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10)
export const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)

/** Area average cycle per town, from customers with 2+ delivered orders. */
export function areaCycles(d: DB): Record<string, number> {
  const out: Record<string, number[]> = {}
  for (const c of d.customers) {
    const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
    const r = computeRefill(t, c.size, undefined, Date.now())
    if (r && r.source !== 'default') (out[c.town] ||= []).push(r.cycleDays)
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, avg(v)]))
}

export function refillOf(d: DB, c: Customer, area = areaCycles(d)): Refill | null {
  const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
  return computeRefill(t, c.size, area[c.town], Date.now())
}

export const refillRows = (d: DB) => {
  const area = areaCycles(d)
  return d.customers.map((c) => ({ c, r: refillOf(d, c, area) }))
}

export const ordersOf = (d: DB, customerId: string): Order[] => d.orders.filter((o) => o.customerId === customerId).sort((a, b) => b.placedAt - a.placedAt)
export const lastOrderDays = (d: DB, c: Customer) => {
  const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
  return t.length ? (Date.now() - Math.max(...t)) / DAY : Infinity
}

export const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const r = (x: number) => (x * Math.PI) / 180
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}
const DEPOT = { lat: 16.043, lng: 120.334 } // Dagupan depot (demo)
/** Rider position = their latest active stop, else the depot. Stand-in for live GPS. */
export function riderPos(d: DB, riderId: string) {
  const active = d.orders.filter((o) => o.riderId === riderId && (o.status === 'Assigned' || o.status === 'Out for delivery')).sort((a, b) => b.assignedAt! - a.assignedAt!)[0]
  return active ? byId(d.customers, active.customerId)! : DEPOT
}
export function nearestRider(d: DB, o: Order) {
  const c = byId(d.customers, o.customerId)!
  return d.riders.map((r) => ({ r, km: km(riderPos(d, r.id), c) })).sort((a, b) => a.km - b.km)[0]
}
export type Size = '11kg' | '22kg' | '50kg'
export const SIZES: Size[] = ['11kg', '22kg', '50kg']
export type Channel = 'app' | 'call' | 'text' | 'walk-in'
export type Status = 'Placed' | 'Assigned' | 'Out for delivery' | 'Delivered' | 'Failed' | 'Cancelled'
export type Payment = 'cod' | 'gcash' | 'maya'
export type Outcome = 'Reached' | 'Ordered' | 'Switched supplier' | 'Not interested' | 'Call back later'

export interface Customer {
  id: string
  name: string
  phone: string
  town: string
  barangay: string
  street: string
  landmark: string
  lat: number
  lng: number
  size: Size
  promoConsent: boolean
  heldCylinders: number
}
export interface Rider { id: string; name: string; phone: string }
export interface Order {
  id: string
  customerId: string
  size: Size
  qty: number
  type: 'refill' | 'new'
  channel: Channel
  status: Status
  payment: Payment
  amount: number
  placedAt: number
  assignedAt?: number
  deliveredAt?: number
  riderId?: string
  failReason?: string
  cashCollected?: number
  empties?: number
  pod?: { kind: 'otp' | 'photo'; photo?: string; at: number; lat: number; lng: number }
}
export interface Sms { id: string; to: string; text: string; at: number; kind: 'status' | 'reminder' | 'blast' | 'otp' }
export interface FollowUp { id: string; customerId: string; outcome: Outcome; at: number }
export interface Blast { id: string; message: string; segment: string; recipients: string[]; at: number }
export interface Movement { id: string; at: number; kind: 'delivery' | 'stock-in' | 'adjustment'; size: Size; full: number; empty: number; note: string }
export interface Remit { riderId: string; day: string; turnedOver: number }
export interface DB {
  customers: Customer[]
  riders: Rider[]
  orders: Order[]
  sms: Sms[]
  followUps: FollowUp[]
  blasts: Blast[]
  movements: Movement[]
  remits: Remit[]
  stock: { full: Record<Size, number>; empty: Record<Size, number> }
  seededAt: number
}
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Fiesta Gas Delivery (prototype)',
        short_name: 'Fiesta Gas',
        description: 'LPG ordering, delivery and refill reminders: clickable prototype',
        theme_color: '#0b2a57',
        background_color: '#f3f5f9',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // Cache map tiles at runtime so previously viewed areas work offline.
      workbox: { runtimeCaching: [{ urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/, handler: 'CacheFirst', options: { cacheName: 'osm-tiles', expiration: { maxEntries: 300 } } }] },
    }),
  ],
})

exec
/bin/bash -lc 'for f in src/pages/customer/Customer.tsx src/pages/dispatcher/Board.tsx src/pages/dispatcher/NewOrder.tsx src/pages/dispatcher/Customers.tsx src/pages/rider/Rider.tsx src/pages/owner/Ops.tsx src/pages/owner/Engage.tsx src/pages/owner/Dashboard.tsx src/App.tsx src/main.tsx; do echo ---$f; nl -ba "$f"; done' in /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
 succeeded in 62ms:
---src/pages/customer/Customer.tsx
     1	import { useState } from 'react'
     2	import { Link, useNavigate } from 'react-router-dom'
     3	import { Field, StatusPill } from '../../components/ui'
     4	import { DEPOSIT, REFILL_PRICE, town } from '../../lib/geo'
     5	import { ago, byId, mins, ordersOf, peso, refillOf } from '../../lib/derive'
     6	import { actions, OTP, useDB } from '../../lib/store'
     7	import { SIZES, type Order, type Payment, type Size } from '../../lib/types'
     8	
     9	export const ME = 'c1' // the demo customer
    10	
    11	export function OrderPage() {
    12	  const d = useDB(); const nav = useNavigate()
    13	  const me = byId(d.customers, ME)!
    14	  const r = refillOf(d, me)
    15	  const [size, setSize] = useState<Size>(me.size)
    16	  const [qty, setQty] = useState(1)
    17	  const [type, setType] = useState<'refill' | 'new'>('refill')
    18	  const [payment, setPayment] = useState<Payment>('cod')
    19	  const fee = town(me.town).fee
    20	  const total = (REFILL_PRICE[size] + (type === 'new' ? DEPOSIT[size] : 0)) * qty + fee
    21	  return (
    22	    <div className="stack">
    23	      <div><h1>Kumusta, {me.name.split(' ')[0]}!</h1><div className="mute">📍 {me.street}, {me.barangay}, {me.town}</div></div>
    24	      {r && r.status !== 'ok' && <div className="card" style={{ borderColor: 'var(--orange)' }}>
    25	        <b>{r.status === 'overdue' ? 'Baka paubos na ang gas ninyo.' : 'Malapit nang maubos ang gas.'}</b>
    26	        <div className="mute">Usually you refill every ~{Math.round(r.cycleDays)} days. Order now and we'll deliver today.</div>
    27	      </div>}
    28	      <div className="card stack">
    29	        <h2>Order a refill</h2>
    30	        <Field label="Cylinder size"><div className="chips">{SIZES.map((s) => <button key={s} className={`chip ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>)}</div></Field>
    31	        <Field label="Order type"><div className="chips">
    32	          <button className={`chip ${type === 'refill' ? 'on' : ''}`} onClick={() => setType('refill')}>Refill swap</button>
    33	          <button className={`chip ${type === 'new' ? 'on' : ''}`} onClick={() => setType('new')}>New tank + deposit</button></div></Field>
    34	        <Field label="Quantity"><div className="row">
    35	          <button className="btn alt" aria-label="Less" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b style={{ minWidth: 24, textAlign: 'center' }}>{qty}</b>
    36	          <button className="btn alt" aria-label="More" onClick={() => setQty(Math.min(5, qty + 1))}>+</button></div></Field>
    37	        <Field label="Payment"><div className="chips">{([['cod', 'Cash on delivery'], ['gcash', 'GCash'], ['maya', 'Maya']] as const).map(([k, l]) =>
    38	          <button key={k} className={`chip ${payment === k ? 'on' : ''}`} onClick={() => setPayment(k)}>{l}</button>)}</div></Field>
    39	        <div className="row"><span className="mute">{qty}× {size} {type === 'new' ? 'new tank' : 'refill'}{fee ? ` + ${peso(fee)} delivery` : ' · free delivery'}</span><b className="right big" style={{ fontSize: 22 }}>{peso(total)}</b></div>
    40	        <button className="btn hot block" onClick={() => { actions.placeOrder({ customerId: ME, size, qty, type, payment, channel: 'app' }); nav('/customer/orders') }}>Place order</button>
    41	        {payment !== 'cod' && <div className="mute">E-wallet is paid to the rider on delivery in this version. Online prepayment is an optional add-on.</div>}
    42	      </div>
    43	    </div>
    44	  )
    45	}
    46	
    47	const STEPS = ['Placed', 'Assigned', 'Out for delivery', 'Delivered'] as const
    48	
    49	function OrderCard({ o, d, live }: { o: Order; d: ReturnType<typeof useDB>; live?: boolean }) {
    50	  const rider = byId(d.riders, o.riderId)
    51	  const idx = STEPS.indexOf(o.status as (typeof STEPS)[number])
    52	  return (
    53	    <div className="card stack">
    54	      <div className="row"><b>{o.id}</b><StatusPill s={o.status} /><span className="right mute">{ago(o.placedAt)}</span></div>
    55	      <div>{o.qty}× {o.size} {o.type === 'new' ? 'new tank' : 'refill'} · {peso(o.amount)} · {o.payment.toUpperCase()}</div>
    56	      {live && <>
    57	        <div className="timeline">{STEPS.map((s, i) => <span key={s} className={i <= idx ? 'done' : ''}>{s === 'Out for delivery' ? 'On the way' : s}</span>)}</div>
    58	        {rider && <div className="mute">🛵 {rider.name} · {rider.phone}</div>}
    59	        {o.status === 'Out for delivery' && <div className="sms otp">Give the rider your delivery code: <b>{OTP}</b></div>}
    60	        {o.status === 'Failed' && <div className="mute">Delivery failed: {o.failReason}. We'll re-dispatch shortly.</div>}
    61	      </>}
    62	      {o.status === 'Delivered' && o.deliveredAt && <div className="mute">Delivered in {mins(o.placedAt, o.deliveredAt)} min</div>}
    63	    </div>
    64	  )
    65	}
    66	
    67	export function Orders() {
    68	  const d = useDB()
    69	  const all = ordersOf(d, ME)
    70	  const live = all.filter((o) => ['Placed', 'Assigned', 'Out for delivery', 'Failed'].includes(o.status))
    71	  const past = all.filter((o) => !live.includes(o))
    72	  return (
    73	    <div className="stack">
    74	      <h1>My orders</h1>
    75	      {live.length ? live.map((o) => <OrderCard key={o.id} o={o} d={d} live />) : <div className="card mute">No active order. <Link to="/customer">Order a refill</Link></div>}
    76	      <h3>History</h3>
    77	      {past.map((o) => <OrderCard key={o.id} o={o} d={d} />)}
    78	    </div>
    79	  )
    80	}
    81	
    82	export function Inbox() {
    83	  const d = useDB()
    84	  const me = byId(d.customers, ME)!
    85	  const mine = d.sms.filter((s) => s.to === me.phone)
    86	  return (
    87	    <div className="stack">
    88	      <h1>Messages</h1><div className="mute">What this customer's phone receives by SMS.</div>
    89	      {mine.length ? mine.map((s) => <div key={s.id} className={`sms ${s.kind === 'otp' ? 'otp' : ''}`}>{s.text}<div className="mute">{ago(s.at)}</div></div>)
    90	        : <div className="card mute">Nothing yet. Place an order to see the confirmation.</div>}
    91	    </div>
    92	  )
    93	}
---src/pages/dispatcher/Board.tsx
     1	import { StatusPill } from '../../components/ui'
     2	import { ago, byId, nearestRider, peso } from '../../lib/derive'
     3	import { actions, useDB } from '../../lib/store'
     4	import type { Order } from '../../lib/types'
     5	
     6	export default function Board() {
     7	  const d = useDB()
     8	  const live = d.orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).sort((a, b) => a.placedAt - b.placedAt)
     9	  const queue = live.filter((o) => o.status === 'Placed' || o.status === 'Failed')
    10	  const rest = live.filter((o) => !queue.includes(o))
    11	  const Row = ({ o }: { o: Order }) => {
    12	    const c = byId(d.customers, o.customerId)!
    13	    const rider = byId(d.riders, o.riderId)
    14	    const near = !o.riderId || o.status === 'Failed' ? nearestRider(d, o) : null
    15	    return (
    16	      <tr>
    17	        <td><b>{o.id}</b><div className="mute">{ago(o.placedAt)} · {o.channel}</div></td>
    18	        <td>{c.name}<div className="mute">{c.barangay}, {c.town}</div></td>
    19	        <td>{o.qty}× {o.size}<div className="mute">{peso(o.amount)} · {o.payment.toUpperCase()}</div></td>
    20	        <td><StatusPill s={o.status} />{o.failReason && <div className="mute">{o.failReason}</div>}</td>
    21	        <td>
    22	          {near ? (
    23	            <div className="row">
    24	              <button className="btn sm" onClick={() => actions.assign(o.id, near.r.id)}>Assign {near.r.name} ({near.km.toFixed(1)} km)</button>
    25	              <select aria-label={`Assign ${o.id}`} defaultValue="" onChange={(e) => e.target.value && actions.assign(o.id, e.target.value)}>
    26	                <option value="">Other rider…</option>{d.riders.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
    27	              </select>
    28	              <button className="btn ghost sm" onClick={() => actions.cancel(o.id)}>Cancel</button>
    29	            </div>
    30	          ) : <span>🛵 {rider?.name}</span>}
    31	        </td>
    32	      </tr>
    33	    )
    34	  }
    35	  return (
    36	    <div className="stack">
    37	      <div className="row"><h1 className="grow">Order board</h1><span className="mute">Suggested rider = nearest to the customer pin (demo positions)</span></div>
    38	      <div className="card scroll">
    39	        <h2>Needs a rider ({queue.length})</h2>
    40	        <table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Action</th></tr></thead><tbody>
    41	          {queue.map((o) => <Row key={o.id} o={o} />)}</tbody></table>
    42	        {!queue.length && <div className="mute">All orders are assigned.</div>}
    43	      </div>
    44	      <div className="card scroll">
    45	        <h2>In progress ({rest.length})</h2>
    46	        <table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Rider</th></tr></thead><tbody>
    47	          {rest.map((o) => <Row key={o.id} o={o} />)}</tbody></table>
    48	      </div>
    49	    </div>
    50	  )
    51	}
---src/pages/dispatcher/NewOrder.tsx
     1	import { useMemo, useState } from 'react'
     2	import { useNavigate } from 'react-router-dom'
     3	import { MapView } from '../../components/MapView'
     4	import { Field } from '../../components/ui'
     5	import { DEPOSIT, REFILL_PRICE, TOWNS, town } from '../../lib/geo'
     6	import { peso } from '../../lib/derive'
     7	import { actions, useDB } from '../../lib/store'
     8	import { SIZES, type Channel, type Payment, type Size } from '../../lib/types'
     9	
    10	export default function NewOrder() {
    11	  const d = useDB(); const nav = useNavigate()
    12	  const [q, setQ] = useState('')
    13	  const [cid, setCid] = useState<string>('')
    14	  const [isNew, setIsNew] = useState(false)
    15	  const [f, setF] = useState({ name: '', phone: '', town: TOWNS[0].name, barangay: TOWNS[0].barangays[0], street: '', landmark: '' })
    16	  const [pin, setPin] = useState<[number, number] | undefined>()
    17	  const [channel, setChannel] = useState<Channel>('call')
    18	  const [size, setSize] = useState<Size>('11kg')
    19	  const [qty, setQty] = useState(1)
    20	  const [type, setType] = useState<'refill' | 'new'>('refill')
    21	  const [payment, setPayment] = useState<Payment>('cod')
    22	  const matches = useMemo(() => q.length < 2 ? [] : d.customers.filter((c) => (c.name + c.phone + c.barangay + c.town).toLowerCase().includes(q.toLowerCase())).slice(0, 5), [q, d.customers])
    23	  const t = town(isNew ? f.town : d.customers.find((c) => c.id === cid)?.town ?? TOWNS[0].name)
    24	  const total = (REFILL_PRICE[size] + (type === 'new' ? DEPOSIT[size] : 0)) * qty + t.fee
    25	  const ready = isNew ? !!(f.name && f.phone && f.street && pin) : !!cid
    26	
    27	  function submit() {
    28	    let id = cid
    29	    if (isNew) id = actions.addCustomer({ ...f, lat: pin![0], lng: pin![1], size, promoConsent: false })
    30	    actions.placeOrder({ customerId: id, size, qty, type, payment, channel })
    31	    nav('/dispatcher')
    32	  }
    33	  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value })
    34	  return (
    35	    <div className="stack" style={{ maxWidth: 760 }}>
    36	      <h1>Encode a call / text / walk-in order</h1>
    37	      <div className="card stack">
    38	        <div className="chips">
    39	          <button className={`chip ${!isNew ? 'on' : ''}`} onClick={() => setIsNew(false)}>Existing customer</button>
    40	          <button className={`chip ${isNew ? 'on' : ''}`} onClick={() => setIsNew(true)}>New customer</button>
    41	        </div>
    42	        {!isNew ? <>
    43	          <Field label="Search name, mobile number, town or barangay"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Pantal or 0917…" /></Field>
    44	          {matches.map((c) => <button key={c.id} className={`chip ${cid === c.id ? 'on' : ''}`} style={{ textAlign: 'left', borderRadius: 12 }} onClick={() => { setCid(c.id); setSize(c.size) }}>{c.name} · {c.barangay}, {c.town}</button>)}
    45	        </> : <>
    46	          <div className="grid">
    47	            <Field label="Name"><input value={f.name} onChange={set('name')} /></Field>
    48	            <Field label="Mobile number"><input value={f.phone} onChange={set('phone')} inputMode="tel" /></Field>
    49	            <Field label="Town"><select value={f.town} onChange={(e) => setF({ ...f, town: e.target.value, barangay: town(e.target.value).barangays[0] })}>{TOWNS.map((x) => <option key={x.name}>{x.name}</option>)}</select></Field>
    50	            <Field label="Barangay (standard list)"><select value={f.barangay} onChange={set('barangay')}>{town(f.town).barangays.map((b) => <option key={b}>{b}</option>)}</select></Field>
    51	            <Field label="Street / purok"><input value={f.street} onChange={set('street')} /></Field>
    52	            <Field label="Landmark"><input value={f.landmark} onChange={set('landmark')} /></Field>
    53	          </div>
    54	          <div className="mute">Click the map to drop the customer's pin {pin ? '✓' : '(required)'}</div>
    55	          <MapView pins={[]} onPick={(la, ln) => setPin([la, ln])} picked={pin} height={240} />
    56	        </>}
    57	      </div>
    58	      <div className="card stack">
    59	        <Field label="How did the order come in?"><div className="chips">{(['call', 'text', 'walk-in'] as const).map((c) => <button key={c} className={`chip ${channel === c ? 'on' : ''}`} onClick={() => setChannel(c)}>{c}</button>)}</div></Field>
    60	        <div className="row">
    61	          <Field label="Size"><div className="chips">{SIZES.map((s) => <button key={s} className={`chip ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>)}</div></Field>
    62	          <Field label="Type"><div className="chips"><button className={`chip ${type === 'refill' ? 'on' : ''}`} onClick={() => setType('refill')}>Refill swap</button><button className={`chip ${type === 'new' ? 'on' : ''}`} onClick={() => setType('new')}>New tank</button></div></Field>
    63	          <Field label="Qty"><input type="number" min={1} max={5} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} style={{ width: 70 }} /></Field>
    64	          <Field label="Payment"><select value={payment} onChange={(e) => setPayment(e.target.value as Payment)}><option value="cod">Cash on delivery</option><option value="gcash">GCash</option><option value="maya">Maya</option></select></Field>
    65	        </div>
    66	        <div className="row"><b className="big" style={{ fontSize: 22 }}>{peso(total)}</b><span className="mute">incl. {peso(t.fee)} delivery</span>
    67	          <button className="btn hot right" disabled={!ready} onClick={submit}>Create order</button></div>
    68	      </div>
    69	    </div>
    70	  )
    71	}
---src/pages/dispatcher/Customers.tsx
     1	import { useMemo, useState } from 'react'
     2	import { MapView, pinColor } from '../../components/MapView'
     3	import { StatusPill } from '../../components/ui'
     4	import { TOWNS, town } from '../../lib/geo'
     5	import { byId, lastOrderDays, ordersOf, peso, refillRows } from '../../lib/derive'
     6	import { useDB } from '../../lib/store'
     7	import { SIZES } from '../../lib/types'
     8	
     9	export default function Customers() {
    10	  const d = useDB()
    11	  const [q, setQ] = useState(''); const [tw, setTw] = useState(''); const [bg, setBg] = useState(''); const [sz, setSz] = useState(''); const [stale, setStale] = useState('')
    12	  const [sel, setSel] = useState<string>()
    13	  const rows = useMemo(() => refillRows(d).filter(({ c }) =>
    14	    (!q || (c.name + c.phone + c.town + c.barangay).toLowerCase().includes(q.toLowerCase())) && (!tw || c.town === tw) && (!bg || c.barangay === bg) &&
    15	    (!sz || c.size === sz) && (!stale || lastOrderDays(d, c) > +stale)), [d, q, tw, bg, sz, stale])
    16	  const sc = byId(d.customers, sel)
    17	  const sr = rows.find((r) => r.c.id === sel)?.r
    18	  // barangay concentration for the coverage view
    19	  const conc = Object.entries(rows.reduce<Record<string, number>>((a, { c }) => ((a[`${c.barangay}, ${c.town}`] = (a[`${c.barangay}, ${c.town}`] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 6)
    20	  return (
    21	    <div className="stack">
    22	      <h1>Customer map &amp; directory <span className="mute">({rows.length} of {d.customers.length})</span></h1>
    23	      <div className="card row">
    24	        <input aria-label="Search" placeholder="Search name, mobile, town, barangay" value={q} onChange={(e) => setQ(e.target.value)} className="grow" style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 10 }} />
    25	        <select aria-label="Town" value={tw} onChange={(e) => { setTw(e.target.value); setBg('') }}><option value="">All towns</option>{TOWNS.map((t) => <option key={t.name}>{t.name}</option>)}</select>
    26	        <select aria-label="Barangay" value={bg} onChange={(e) => setBg(e.target.value)}><option value="">All barangays</option>{(tw ? town(tw).barangays : [...new Set(TOWNS.flatMap((t) => t.barangays))]).map((b) => <option key={b}>{b}</option>)}</select>
    27	        <select aria-label="Size" value={sz} onChange={(e) => setSz(e.target.value)}><option value="">All sizes</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</select>
    28	        <select aria-label="Last order" value={stale} onChange={(e) => setStale(e.target.value)}><option value="">Any last order</option><option value="14">&gt; 14 days ago</option><option value="30">&gt; 30 days ago</option><option value="45">&gt; 45 days ago</option></select>
    29	      </div>
    30	      <div className="sidebar">
    31	        <div className="stack">
    32	          <MapView pins={rows.map(({ c, r }) => ({ id: c.id, lat: c.lat, lng: c.lng, label: c.name, color: pinColor(r?.status) }))} onSelect={setSel} />
    33	          <div className="mute">Pin color: <span style={{ color: 'var(--ok)' }}>● on cycle</span> · <span style={{ color: 'var(--warn)' }}>● due soon</span> · <span style={{ color: 'var(--bad)' }}>● overdue</span></div>
    34	          <div className="card"><h3>Where customers are concentrated</h3>
    35	            {conc.map(([k, n]) => <div key={k} className="row"><span style={{ width: 190 }}>{k}</span><div className="bar" style={{ width: n * 26 }} /><b>{n}</b></div>)}</div>
    36	        </div>
    37	        <div className="stack">
    38	          {sc ? (
    39	            <div className="card stack">
    40	              <h2>{sc.name}</h2>
    41	              <div>📞 {sc.phone}<br />📍 {sc.street}, {sc.barangay}, {sc.town}<br /><span className="mute">Landmark: {sc.landmark}</span></div>
    42	              <div className="mute">Cylinder: {sc.size} · holding {sc.heldCylinders} · promo consent: {sc.promoConsent ? 'yes' : 'no'}</div>
    43	              {sr && <div>Refill cycle ~{Math.round(sr.cycleDays)} days ({sr.source}) <span className={`pill ${sr.status}`}>{sr.status === 'overdue' ? `overdue ${Math.round(-sr.daysUntil)}d` : sr.status === 'due' ? 'due soon' : `next in ${Math.round(sr.daysUntil)}d`}</span></div>}
    44	              <h3>Order history</h3>
    45	              {ordersOf(d, sc.id).slice(0, 6).map((o) => <div key={o.id} className="row"><span>{o.id}</span><StatusPill s={o.status} /><span className="right mute">{peso(o.amount)} · {new Date(o.placedAt).toLocaleDateString()}</span></div>)}
    46	            </div>
    47	          ) : <div className="card mute">Select a pin or a row to open the customer profile.</div>}
    48	          <div className="card scroll" style={{ maxHeight: 420, overflowY: 'auto' }}>
    49	            <table><tbody>{rows.map(({ c, r }) => <tr key={c.id} onClick={() => setSel(c.id)} style={{ cursor: 'pointer', background: sel === c.id ? '#e8eefa' : undefined }}>
    50	              <td>{c.name}<div className="mute">{c.barangay}, {c.town}</div></td><td>{r && <span className={`pill ${r.status}`}>{r.status}</span>}</td></tr>)}</tbody></table>
    51	          </div>
    52	        </div>
    53	      </div>
    54	    </div>
    55	  )
    56	}
---src/pages/rider/Rider.tsx
     1	import { useState } from 'react'
     2	import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
     3	import { MapView } from '../../components/MapView'
     4	import { Field, StatusPill } from '../../components/ui'
     5	import { byId, dayKey, peso } from '../../lib/derive'
     6	import { actions, OTP, useDB } from '../../lib/store'
     7	import type { Order } from '../../lib/types'
     8	
     9	const CHECKS = ['Valve and hose checked on every cylinder', 'No leak smell on the truck / motorcycle', 'Cylinders strapped upright', 'Phone charged and GPS on']
    10	
    11	export function Jobs() {
    12	  const d = useDB()
    13	  const [sp, setSp] = useSearchParams()
    14	  const rid = sp.get('r') ?? 'r1'
    15	  const [checks, setChecks] = useState<boolean[]>(CHECKS.map(() => false))
    16	  const mine = d.orders.filter((o) => o.riderId === rid && ['Assigned', 'Out for delivery'].includes(o.status))
    17	  const today = d.orders.filter((o) => o.riderId === rid && o.status === 'Delivered' && dayKey(o.deliveredAt!) === dayKey(Date.now()))
    18	  const cash = today.reduce((a, o) => a + (o.cashCollected ?? 0), 0)
    19	  return (
    20	    <div className="stack">
    21	      <div className="row"><h1 className="grow">My deliveries</h1>
    22	        <select aria-label="Rider" value={rid} onChange={(e) => setSp({ r: e.target.value })}>{d.riders.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
    23	      <details className="card" open={!checks.every(Boolean)}><summary><b>Pre-shift safety checklist</b> {checks.every(Boolean) ? '✅' : `(${checks.filter(Boolean).length}/${CHECKS.length})`}</summary>
    24	        <div className="stack" style={{ marginTop: 8 }}>{CHECKS.map((c, i) => <label key={c} className="row"><input type="checkbox" checked={checks[i]} onChange={() => setChecks(checks.map((x, j) => (j === i ? !x : x)))} />{c}</label>)}</div></details>
    25	      {mine.length ? mine.map((o) => {
    26	        const c = byId(d.customers, o.customerId)!
    27	        return <Link key={o.id} to={`/rider/job/${o.id}?r=${rid}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
    28	          <div className="row"><b>{c.name}</b><StatusPill s={o.status} /></div>
    29	          <div className="mute">{c.street}, {c.barangay}, {c.town}</div>
    30	          <div>{o.qty}× {o.size} · {o.payment === 'cod' ? `Collect ${peso(o.amount)}` : `${o.payment.toUpperCase()} ${peso(o.amount)}`}</div></Link>
    31	      }) : <div className="card mute">No deliveries assigned. Ask the dispatcher to assign one.</div>}
    32	      <div className="card"><h3>Today</h3><div className="row"><span>{today.length} delivered</span><b className="right">{peso(cash)} cash to turn over</b></div></div>
    33	    </div>
    34	  )
    35	}
    36	
    37	const REASONS = ['No one home', 'Wrong address', 'Customer cancelled at door']
    38	
    39	/** Downscale a camera photo so it fits localStorage. */
    40	const shrink = (file: File) => new Promise<string>((res) => {
    41	  const img = new Image(); const url = URL.createObjectURL(file)
    42	  img.onload = () => { const s = 240 / Math.max(img.width, img.height); const cv = document.createElement('canvas'); cv.width = img.width * s; cv.height = img.height * s
    43	    cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url); res(cv.toDataURL('image/jpeg', 0.6)) }
    44	  img.src = url
    45	})
    46	
    47	export function Job() {
    48	  const d = useDB(); const { id } = useParams(); const nav = useNavigate(); const [sp] = useSearchParams()
    49	  const o = byId(d.orders, id) as Order | undefined
    50	  const [mode, setMode] = useState<'otp' | 'photo'>('otp')
    51	  const [code, setCode] = useState('')
    52	  const [photo, setPhoto] = useState<string>()
    53	  const [empties, setEmpties] = useState(1)
    54	  const [cash, setCash] = useState<number>()
    55	  const [reason, setReason] = useState('')
    56	  if (!o) return <div className="card">Order not found. <Link to="/rider">Back</Link></div>
    57	  const c = byId(d.customers, o.customerId)!
    58	  const back = `/rider?r=${sp.get('r') ?? o.riderId}`
    59	  const podOk = mode === 'otp' ? code === OTP : !!photo
    60	  return (
    61	    <div className="stack">
    62	      <Link to={back}>← Deliveries</Link>
    63	      <div className="card stack">
    64	        <div className="row"><h2 className="grow">{c.name}</h2><StatusPill s={o.status} /></div>
    65	        <div>📞 <a href={`tel:${c.phone}`}>{c.phone}</a><br />📍 {c.street}, {c.barangay}, {c.town}<br /><span className="mute">Landmark: {c.landmark}</span></div>
    66	        <MapView pins={[{ id: c.id, lat: c.lat, lng: c.lng, label: c.name, color: '#f04a2d' }]} height={180} />
    67	        <a className="btn alt block" style={{ textAlign: 'center', textDecoration: 'none' }} target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}>Open directions</a>
    68	        <div>{o.qty}× {o.size} {o.type === 'new' ? 'new tank + deposit' : 'refill swap'} · <b>{peso(o.amount)}</b> · {o.payment.toUpperCase()}</div>
    69	      </div>
    70	
    71	      {o.status === 'Assigned' && <button className="btn hot block" onClick={() => actions.startDelivery(o.id)}>Start delivery (texts customer)</button>}
    72	
    73	      {o.status === 'Out for delivery' && <div className="card stack">
    74	        <h2>Complete delivery</h2>
    75	        {o.payment === 'cod' ? <Field label="Cash collected (₱)"><input type="number" inputMode="numeric" value={cash ?? o.amount} onChange={(e) => setCash(+e.target.value)} /></Field>
    76	          : <div className="mute">{o.payment.toUpperCase()}: confirm the customer's payment screen, then continue.</div>}
    77	        <Field label="Proof of delivery"><div className="chips">
    78	          <button className={`chip ${mode === 'otp' ? 'on' : ''}`} onClick={() => setMode('otp')}>Customer code</button>
    79	          <button className={`chip ${mode === 'photo' ? 'on' : ''}`} onClick={() => setMode('photo')}>Photo</button></div></Field>
    80	        {mode === 'otp' ? <Field label="4-digit code the customer received by SMS"><input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={4} placeholder="demo code: 4821" /></Field>
    81	          : <><input type="file" accept="image/*" capture="environment" onChange={async (e) => e.target.files?.[0] && setPhoto(await shrink(e.target.files[0]))} />{photo && <img src={photo} alt="Delivered cylinder" style={{ maxWidth: 160, borderRadius: 10 }} />}</>}
    82	        <Field label="Empty cylinders collected"><div className="row">
    83	          <button className="btn alt" onClick={() => setEmpties(Math.max(0, empties - 1))}>−</button><b>{empties}</b><button className="btn alt" onClick={() => setEmpties(empties + 1)}>+</button></div></Field>
    84	        <div className="mute">📍 GPS location and time are captured automatically with the confirmation.</div>
    85	        <button className="btn block" disabled={!podOk} onClick={() => { actions.deliver(o.id, { pod: { kind: mode, photo, at: Date.now(), lat: c.lat, lng: c.lng }, cash: cash ?? o.amount, empties }); nav(back) }}>Confirm delivered</button>
    86	        <hr style={{ border: 0, borderTop: '1px solid var(--line)', width: '100%' }} />
    87	        <Field label="Can't deliver?"><select value={reason} onChange={(e) => setReason(e.target.value)}><option value="">Choose a reason…</option>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
    88	        <button className="btn ghost block" disabled={!reason} onClick={() => { actions.fail(o.id, reason); nav(back) }}>Mark delivery failed</button>
    89	      </div>}
    90	
    91	      {o.status === 'Delivered' && <div className="card">✅ Delivered. {o.pod && `Proof: ${o.pod.kind}.`}</div>}
    92	    </div>
    93	  )
    94	}
---src/pages/owner/Ops.tsx
     1	import { useState } from 'react'
     2	import { Field } from '../../components/ui'
     3	import { ago, byId, dayKey, peso } from '../../lib/derive'
     4	import { LOW_STOCK } from '../../lib/geo'
     5	import { actions, useDB } from '../../lib/store'
     6	import { SIZES, type Size } from '../../lib/types'
     7	
     8	export function Inventory() {
     9	  const d = useDB()
    10	  const [size, setSize] = useState<Size>('11kg'); const [qty, setQty] = useState(10)
    11	  const held = d.customers.reduce((a, c) => a + c.heldCylinders, 0)
    12	  return (
    13	    <div className="stack">
    14	      <h1>Cylinder inventory</h1>
    15	      <div className="grid">{SIZES.map((s) => { const low = d.stock.full[s] <= LOW_STOCK[s]; return (
    16	        <div key={s} className="card" style={low ? { borderColor: 'var(--bad)' } : undefined}>
    17	          <h3>{s}</h3><div className="big">{d.stock.full[s]} <span className="mute" style={{ fontSize: 14 }}>full</span></div>
    18	          <div className="mute">{d.stock.empty[s]} empty{low && <b style={{ color: 'var(--bad)' }}> · low stock (alert at {LOW_STOCK[s]})</b>}</div></div>) })}
    19	        <div className="card"><h3>Held by customers</h3><div className="big">{held}</div><div className="mute">cylinders out on deposit</div></div></div>
    20	      <div className="card row">
    21	        <b>Stock-in from supplier</b>
    22	        <Field label="Size"><select value={size} onChange={(e) => setSize(e.target.value as Size)}>{SIZES.map((s) => <option key={s}>{s}</option>)}</select></Field>
    23	        <Field label="Qty"><input type="number" min={1} value={qty} onChange={(e) => setQty(+e.target.value || 1)} style={{ width: 80 }} /></Field>
    24	        <button className="btn" onClick={() => actions.stockIn(size, qty, 'Refilled cylinders from supplier')}>Record stock-in</button>
    25	        <span className="mute">Delivered orders deduct full tanks and add collected empties automatically.</span></div>
    26	      <div className="card scroll"><h3>Movements</h3><table><thead><tr><th>When</th><th>Type</th><th>Size</th><th>Full</th><th>Empty</th><th>Note</th></tr></thead><tbody>
    27	        {d.movements.slice(0, 15).map((m) => <tr key={m.id}><td>{ago(m.at)}</td><td>{m.kind}</td><td>{m.size}</td><td>{m.full > 0 ? '+' : ''}{m.full}</td><td>{m.empty > 0 ? '+' : ''}{m.empty}</td><td>{m.note}</td></tr>)}</tbody></table></div>
    28	    </div>
    29	  )
    30	}
    31	
    32	export function Remittance() {
    33	  const d = useDB()
    34	  const day = dayKey(Date.now())
    35	  return (
    36	    <div className="stack">
    37	      <h1>Rider remittance · today</h1>
    38	      <div className="mute">Expected cash from delivered cash-on-delivery orders vs. cash the rider turned over.</div>
    39	      <div className="card scroll"><table><thead><tr><th>Rider</th><th>Deliveries</th><th>Expected cash</th><th>Turned over</th><th>Difference</th></tr></thead><tbody>
    40	        {d.riders.map((r) => {
    41	          const mine = d.orders.filter((o) => o.riderId === r.id && o.status === 'Delivered' && dayKey(o.deliveredAt!) === day)
    42	          const exp = mine.reduce((a, o) => a + (o.cashCollected ?? 0), 0)
    43	          const rem = d.remits.find((x) => x.riderId === r.id && x.day === day)
    44	          const diff = rem ? rem.turnedOver - exp : undefined
    45	          return <tr key={r.id}><td>{byId(d.riders, r.id)!.name}</td><td>{mine.length}</td><td>{peso(exp)}</td>
    46	            <td><input aria-label={`Turned over ${r.name}`} type="number" style={{ width: 110 }} defaultValue={rem?.turnedOver} onBlur={(e) => e.target.value !== '' && actions.remit(r.id, day, +e.target.value)} /></td>
    47	            <td>{diff === undefined ? '—' : <b style={{ color: diff === 0 ? 'var(--ok)' : 'var(--bad)' }}>{diff === 0 ? 'Balanced' : peso(diff)}</b>}</td></tr> })}</tbody></table></div>
    48	    </div>
    49	  )
    50	}
---src/pages/owner/Engage.tsx
     1	import { useMemo, useState } from 'react'
     2	import { Field } from '../../components/ui'
     3	import { SMS_COST, TOWNS } from '../../lib/geo'
     4	import { ago, byId, delivered, refillRows } from '../../lib/derive'
     5	import { DAY } from '../../lib/refill'
     6	import { actions, useDB } from '../../lib/store'
     7	import { SIZES, type Outcome } from '../../lib/types'
     8	
     9	const OUTCOMES: Outcome[] = ['Reached', 'Ordered', 'Switched supplier', 'Not interested', 'Call back later']
    10	
    11	export function FollowUps() {
    12	  const d = useDB()
    13	  const list = refillRows(d).filter((x) => x.r && (x.r.status === 'due' || x.r.status === 'overdue')).sort((a, b) => a.r!.daysUntil - b.r!.daysUntil)
    14	  const last = (id: string) => d.followUps.find((f) => f.customerId === id)
    15	  const saved = d.followUps.filter((f) => f.outcome === 'Ordered').length
    16	  const lost = d.followUps.filter((f) => f.outcome === 'Switched supplier' || f.outcome === 'Not interested').length
    17	  return (
    18	    <div className="stack">
    19	      <div className="row"><h1 className="grow">Daily follow-up list</h1><span className="pill ok">{saved} saved</span><span className="pill overdue">{lost} lost</span></div>
    20	      <div className="mute">Customers whose expected refill date is near or past (3-day grace). Reminders text customers before they run out.</div>
    21	      <div className="card scroll"><table><thead><tr><th>Customer</th><th>Cycle</th><th>Status</th><th>Last contact</th><th>Log outcome</th></tr></thead><tbody>
    22	        {list.map(({ c, r }) => { const f = last(c.id); return (
    23	          <tr key={c.id}>
    24	            <td><b>{c.name}</b><div className="mute">{c.barangay}, {c.town} · <a href={`tel:${c.phone}`}>{c.phone}</a></div></td>
    25	            <td>~{Math.round(r!.cycleDays)} d</td>
    26	            <td><span className={`pill ${r!.status}`}>{r!.status === 'overdue' ? `overdue ${Math.round(-r!.daysUntil)}d` : 'due soon'}</span></td>
    27	            <td>{f ? <>{f.outcome}<div className="mute">{ago(f.at)}</div></> : <span className="mute">none</span>}</td>
    28	            <td><div className="row">
    29	              <select aria-label={`Outcome ${c.name}`} defaultValue="" onChange={(e) => e.target.value && actions.logFollowUp(c.id, e.target.value as Outcome)}><option value="">Log call…</option>{OUTCOMES.map((o) => <option key={o}>{o}</option>)}</select>
    30	              <button className="btn alt sm" onClick={() => actions.sendReminder(c.id)}>Send reminder SMS</button></div></td>
    31	          </tr>) })}</tbody></table>
    32	        {!list.length && <div className="mute">Nobody is due. 🎉</div>}</div>
    33	    </div>
    34	  )
    35	}
    36	
    37	const TEMPLATES = ['Fiesta Gas promo: free delivery this weekend on any refill! Order here: fiestagas.example/order', 'Fiesta Gas: ₱30 off your next 11kg refill until Sunday. Order here: fiestagas.example/order', 'Kumusta! Time for a refill? Order in 1 minute: fiestagas.example/order']
    38	
    39	export function Blast() {
    40	  const d = useDB()
    41	  const [tw, setTw] = useState(''); const [sz, setSz] = useState(''); const [overdue, setOverdue] = useState(false); const [min, setMin] = useState(0)
    42	  const [msg, setMsg] = useState(TEMPLATES[0]); const [sent, setSent] = useState(false)
    43	  const rows = useMemo(() => refillRows(d), [d])
    44	  const seg = rows.filter(({ c, r }) => (!tw || c.town === tw) && (!sz || c.size === sz) && (!overdue || r?.status === 'overdue') &&
    45	    delivered(d).filter((o) => o.customerId === c.id).length >= min)
    46	  const to = seg.filter(({ c }) => c.promoConsent)
    47	  const label = [tw || 'All towns', sz || 'all sizes', overdue && 'overdue only', min && `${min}+ orders`, 'consented'].filter(Boolean).join(' · ')
    48	  const full = `${msg} Reply STOP to opt out.`
    49	  return (
    50	    <div className="stack">
    51	      <h1>SMS text blast</h1>
    52	      <div className="sidebar">
    53	        <div className="card stack">
    54	          <div className="grid">
    55	            <Field label="Town"><select value={tw} onChange={(e) => setTw(e.target.value)}><option value="">All</option>{TOWNS.map((t) => <option key={t.name}>{t.name}</option>)}</select></Field>
    56	            <Field label="Cylinder size"><select value={sz} onChange={(e) => setSz(e.target.value)}><option value="">All</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</select></Field>
    57	            <Field label="Min. orders"><input type="number" min={0} value={min} onChange={(e) => setMin(+e.target.value || 0)} /></Field>
    58	            <label className="row" style={{ alignSelf: 'end', paddingBottom: 10 }}><input type="checkbox" checked={overdue} onChange={(e) => setOverdue(e.target.checked)} />Overdue only</label>
    59	          </div>
    60	          <Field label="Saved templates"><div className="chips">{TEMPLATES.map((t, i) => <button key={t} className={`chip ${msg === t ? 'on' : ''}`} onClick={() => setMsg(t)}>Template {i + 1}</button>)}</div></Field>
    61	          <Field label="Message"><textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
    62	          <div className="mute">Opt-out text is added automatically. Only customers who consented to promos are included ({seg.length - to.length} excluded).</div>
    63	          <div className="row"><b>{to.length} recipients</b><span className="mute">≈ ₱{(to.length * SMS_COST).toFixed(2)} at ₱{SMS_COST}/SMS</span>
    64	            <button className="btn hot right" disabled={!to.length || !msg.trim()} onClick={() => { actions.sendBlast(full, label, to.map((x) => x.c.id)); setSent(true); setTimeout(() => setSent(false), 2500) }}>Send now</button></div>
    65	          {sent && <div className="pill ok">Sent (simulated). Check the report on the right.</div>}
    66	        </div>
    67	        <div className="stack">
    68	          <div className="card"><h3>Preview</h3><div className="sms">{full}</div></div>
    69	          <div className="card stack"><h3>Blast history</h3>{d.blasts.map((b) => {
    70	            const n = d.orders.filter((o) => b.recipients.includes(o.customerId) && o.placedAt > b.at && o.placedAt < b.at + 7 * DAY).length
    71	            return <div key={b.id}><b>{b.segment}</b><div className="mute">{ago(b.at)} · delivered to {b.recipients.length} · {n} orders within 7 days</div></div> })}</div>
    72	        </div>
    73	      </div>
    74	      <div className="mute">Customers: {rows.length}. Example recipient: {to[0] ? byId(d.customers, to[0].c.id)!.name : '—'}.</div>
    75	    </div>
    76	  )
    77	}
---src/pages/owner/Dashboard.tsx
     1	import { avg, byId, delivered, mins, peso, refillRows } from '../../lib/derive'
     2	import { DAY } from '../../lib/refill'
     3	import { useDB } from '../../lib/store'
     4	
     5	const Bars = ({ rows, fmt = (n: number) => String(Math.round(n)), alt }: { rows: [string, number][]; fmt?: (n: number) => string; alt?: boolean }) => {
     6	  const max = Math.max(1, ...rows.map((r) => r[1]))
     7	  return <div className="stack" style={{ gap: 6 }}>{rows.map(([k, v]) => <div key={k} className="row"><span style={{ width: 120, fontSize: 13 }}>{k}</span><div className={`bar ${alt ? 'o' : ''}`} style={{ width: `${(v / max) * 55}%` }} /><b style={{ fontSize: 13 }}>{fmt(v)}</b></div>)}</div>
     8	}
     9	const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => <div className="card"><div className="mute">{label}</div><div className="big">{value}</div><div className="mute">{sub}</div></div>
    10	const group = (a: [string, number][]) => Object.entries(a.reduce<Record<string, number[]>>((m, [k, v]) => ((m[k] ||= []).push(v), m), {}))
    11	
    12	export default function Dashboard() {
    13	  const d = useDB()
    14	  const done = delivered(d)
    15	  const rows = refillRows(d)
    16	  const mult = rows.filter((x) => x.r && x.r.source !== 'default')
    17	  const withOrders = rows.filter((x) => x.r).length
    18	  const dispatch = d.orders.filter((o) => o.assignedAt).map((o) => mins(o.placedAt, o.assignedAt!))
    19	  const dTime = (o: (typeof done)[number]) => mins(o.placedAt, o.deliveredAt!)
    20	  const townOf = (id: string) => byId(d.customers, id)!.town
    21	  const manual = d.orders.filter((o) => o.channel !== 'app').length
    22	  const reasons = group(d.orders.filter((o) => o.failReason).map((o) => [o.failReason!, 1]))
    23	  const promoOrders = d.blasts.map((b) => d.orders.filter((o) => b.recipients.includes(o.customerId) && o.placedAt > b.at && o.placedAt < b.at + 7 * DAY).length)
    24	  return (
    25	    <div className="stack">
    26	      <h1>Analytics</h1>
    27	      <div className="grid">
    28	        <Stat label="Avg delivery time" value={`${Math.round(avg(done.map(dTime)))} min`} sub="order placed → delivered" />
    29	        <Stat label="Avg time to dispatch" value={`${Math.round(avg(dispatch))} min`} sub="order placed → rider assigned" />
    30	        <Stat label="Avg refill cycle" value={`${Math.round(avg(mult.map((x) => x.r!.cycleDays)))} days`} sub={`${mult.length} customers with 2+ orders`} />
    31	        <Stat label="First → second order" value={`${Math.round(avg(mult.map((x) => x.r!.firstToSecond!)))} days`} sub="new-customer retention signal" />
    32	        <Stat label="Repeat rate" value={`${Math.round((mult.length / Math.max(1, withOrders)) * 100)}%`} sub="customers with 2+ orders" />
    33	        <Stat label="Due / overdue" value={`${rows.filter((x) => x.r?.status === 'due').length} / ${rows.filter((x) => x.r?.status === 'overdue').length}`} sub="see the Follow-ups tab" />
    34	        <Stat label="Orders encoded by staff" value={`${Math.round((manual / Math.max(1, d.orders.length)) * 100)}%`} sub={`${manual} of ${d.orders.length} (call/text/walk-in)`} />
    35	        <Stat label="Failed deliveries" value={String(d.orders.filter((o) => o.status === 'Failed').length)} sub="reasons below" />
    36	      </div>
    37	      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
    38	        <div className="card"><h3>Avg delivery minutes · by rider</h3><Bars rows={group(done.map((o) => [byId(d.riders, o.riderId)?.name ?? '?', dTime(o)])).map(([k, v]) => [k, avg(v)])} /></div>
    39	        <div className="card"><h3>Avg delivery minutes · by town</h3><Bars rows={group(done.map((o) => [townOf(o.customerId), dTime(o)])).map(([k, v]) => [k, avg(v)])} /></div>
    40	        <div className="card"><h3>Revenue · by town</h3><Bars alt fmt={peso} rows={group(done.map((o) => [townOf(o.customerId), o.amount])).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0)])} /></div>
    41	        <div className="card"><h3>Units · by cylinder size</h3><Bars rows={group(done.map((o) => [o.size, o.qty])).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0)])} /></div>
    42	        <div className="card"><h3>Failed delivery reasons</h3><Bars alt rows={reasons.map(([k, v]) => [k, v.length])} /></div>
    43	        <div className="card"><h3>Promo blasts · orders within 7 days</h3>{d.blasts.map((b, i) => <div key={b.id} className="row"><span className="grow">{b.segment}</span><b>{promoOrders[i]} orders</b><span className="mute">from {b.recipients.length}</span></div>)}</div>
    44	      </div>
    45	    </div>
    46	  )
    47	}
---src/App.tsx
     1	import { Navigate, Route, Routes } from 'react-router-dom'
     2	import { Shell } from './components/ui'
     3	import Launcher from './pages/Launcher'
     4	import { Inbox, OrderPage, Orders } from './pages/customer/Customer'
     5	import Board from './pages/dispatcher/Board'
     6	import Customers from './pages/dispatcher/Customers'
     7	import NewOrder from './pages/dispatcher/NewOrder'
     8	import Dashboard from './pages/owner/Dashboard'
     9	import { Blast, FollowUps } from './pages/owner/Engage'
    10	import { Inventory, Remittance } from './pages/owner/Ops'
    11	import { Job, Jobs } from './pages/rider/Rider'
    12	
    13	export default function App() {
    14	  return (
    15	    <Routes>
    16	      <Route path="/" element={<Launcher />} />
    17	      <Route path="/customer" element={<Shell phone title="Customer app" base="/customer" tabs={[['', 'Order'], ['orders', 'My orders'], ['inbox', 'Messages']]} />}>
    18	        <Route index element={<OrderPage />} /><Route path="orders" element={<Orders />} /><Route path="inbox" element={<Inbox />} />
    19	      </Route>
    20	      <Route path="/dispatcher" element={<Shell title="Dispatcher" base="/dispatcher" tabs={[['', 'Order board'], ['new', 'New order'], ['customers', 'Customers & map']]} />}>
    21	        <Route index element={<Board />} /><Route path="new" element={<NewOrder />} /><Route path="customers" element={<Customers />} />
    22	      </Route>
    23	      <Route path="/rider" element={<Shell phone title="Rider app" base="/rider" tabs={[['', 'Deliveries']]} />}>
    24	        <Route index element={<Jobs />} /><Route path="job/:id" element={<Job />} />
    25	      </Route>
    26	      <Route path="/owner" element={<Shell title="Owner" base="/owner" tabs={[['', 'Analytics'], ['follow-ups', 'Follow-ups'], ['blast', 'SMS blast'], ['inventory', 'Inventory'], ['remittance', 'Remittance']]} />}>
    27	        <Route index element={<Dashboard />} /><Route path="follow-ups" element={<FollowUps />} /><Route path="blast" element={<Blast />} />
    28	        <Route path="inventory" element={<Inventory />} /><Route path="remittance" element={<Remittance />} />
    29	      </Route>
    30	      <Route path="*" element={<Navigate to="/" />} />
    31	    </Routes>
    32	  )
    33	}
---src/main.tsx
     1	import { StrictMode } from 'react'
     2	import { createRoot } from 'react-dom/client'
     3	import { HashRouter } from 'react-router-dom'
     4	import App from './App'
     5	import './index.css'
     6	
     7	createRoot(document.getElementById('root')!).render(<StrictMode><HashRouter><App /></HashRouter></StrictMode>)

codex
I’ve found several likely state and workflow mismatches; I’m checking the rider flow and exact line numbers now, especially whether invalid delivery states can silently corrupt stock or break the demo.
exec
/bin/bash -lc "nl -ba src/pages/rider/Rider.tsx && nl -ba src/lib/derive.ts && nl -ba src/lib/store.ts && nl -ba vite.config.ts && nl -ba src/pages/owner/Engage.tsx | sed -n '39,75p' && nl -ba src/pages/owner/Ops.tsx | sed -n '8,50p'" in /Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app
 succeeded in 0ms:
     1	import { useState } from 'react'
     2	import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
     3	import { MapView } from '../../components/MapView'
     4	import { Field, StatusPill } from '../../components/ui'
     5	import { byId, dayKey, peso } from '../../lib/derive'
     6	import { actions, OTP, useDB } from '../../lib/store'
     7	import type { Order } from '../../lib/types'
     8	
     9	const CHECKS = ['Valve and hose checked on every cylinder', 'No leak smell on the truck / motorcycle', 'Cylinders strapped upright', 'Phone charged and GPS on']
    10	
    11	export function Jobs() {
    12	  const d = useDB()
    13	  const [sp, setSp] = useSearchParams()
    14	  const rid = sp.get('r') ?? 'r1'
    15	  const [checks, setChecks] = useState<boolean[]>(CHECKS.map(() => false))
    16	  const mine = d.orders.filter((o) => o.riderId === rid && ['Assigned', 'Out for delivery'].includes(o.status))
    17	  const today = d.orders.filter((o) => o.riderId === rid && o.status === 'Delivered' && dayKey(o.deliveredAt!) === dayKey(Date.now()))
    18	  const cash = today.reduce((a, o) => a + (o.cashCollected ?? 0), 0)
    19	  return (
    20	    <div className="stack">
    21	      <div className="row"><h1 className="grow">My deliveries</h1>
    22	        <select aria-label="Rider" value={rid} onChange={(e) => setSp({ r: e.target.value })}>{d.riders.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
    23	      <details className="card" open={!checks.every(Boolean)}><summary><b>Pre-shift safety checklist</b> {checks.every(Boolean) ? '✅' : `(${checks.filter(Boolean).length}/${CHECKS.length})`}</summary>
    24	        <div className="stack" style={{ marginTop: 8 }}>{CHECKS.map((c, i) => <label key={c} className="row"><input type="checkbox" checked={checks[i]} onChange={() => setChecks(checks.map((x, j) => (j === i ? !x : x)))} />{c}</label>)}</div></details>
    25	      {mine.length ? mine.map((o) => {
    26	        const c = byId(d.customers, o.customerId)!
    27	        return <Link key={o.id} to={`/rider/job/${o.id}?r=${rid}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
    28	          <div className="row"><b>{c.name}</b><StatusPill s={o.status} /></div>
    29	          <div className="mute">{c.street}, {c.barangay}, {c.town}</div>
    30	          <div>{o.qty}× {o.size} · {o.payment === 'cod' ? `Collect ${peso(o.amount)}` : `${o.payment.toUpperCase()} ${peso(o.amount)}`}</div></Link>
    31	      }) : <div className="card mute">No deliveries assigned. Ask the dispatcher to assign one.</div>}
    32	      <div className="card"><h3>Today</h3><div className="row"><span>{today.length} delivered</span><b className="right">{peso(cash)} cash to turn over</b></div></div>
    33	    </div>
    34	  )
    35	}
    36	
    37	const REASONS = ['No one home', 'Wrong address', 'Customer cancelled at door']
    38	
    39	/** Downscale a camera photo so it fits localStorage. */
    40	const shrink = (file: File) => new Promise<string>((res) => {
    41	  const img = new Image(); const url = URL.createObjectURL(file)
    42	  img.onload = () => { const s = 240 / Math.max(img.width, img.height); const cv = document.createElement('canvas'); cv.width = img.width * s; cv.height = img.height * s
    43	    cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url); res(cv.toDataURL('image/jpeg', 0.6)) }
    44	  img.src = url
    45	})
    46	
    47	export function Job() {
    48	  const d = useDB(); const { id } = useParams(); const nav = useNavigate(); const [sp] = useSearchParams()
    49	  const o = byId(d.orders, id) as Order | undefined
    50	  const [mode, setMode] = useState<'otp' | 'photo'>('otp')
    51	  const [code, setCode] = useState('')
    52	  const [photo, setPhoto] = useState<string>()
    53	  const [empties, setEmpties] = useState(1)
    54	  const [cash, setCash] = useState<number>()
    55	  const [reason, setReason] = useState('')
    56	  if (!o) return <div className="card">Order not found. <Link to="/rider">Back</Link></div>
    57	  const c = byId(d.customers, o.customerId)!
    58	  const back = `/rider?r=${sp.get('r') ?? o.riderId}`
    59	  const podOk = mode === 'otp' ? code === OTP : !!photo
    60	  return (
    61	    <div className="stack">
    62	      <Link to={back}>← Deliveries</Link>
    63	      <div className="card stack">
    64	        <div className="row"><h2 className="grow">{c.name}</h2><StatusPill s={o.status} /></div>
    65	        <div>📞 <a href={`tel:${c.phone}`}>{c.phone}</a><br />📍 {c.street}, {c.barangay}, {c.town}<br /><span className="mute">Landmark: {c.landmark}</span></div>
    66	        <MapView pins={[{ id: c.id, lat: c.lat, lng: c.lng, label: c.name, color: '#f04a2d' }]} height={180} />
    67	        <a className="btn alt block" style={{ textAlign: 'center', textDecoration: 'none' }} target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}>Open directions</a>
    68	        <div>{o.qty}× {o.size} {o.type === 'new' ? 'new tank + deposit' : 'refill swap'} · <b>{peso(o.amount)}</b> · {o.payment.toUpperCase()}</div>
    69	      </div>
    70	
    71	      {o.status === 'Assigned' && <button className="btn hot block" onClick={() => actions.startDelivery(o.id)}>Start delivery (texts customer)</button>}
    72	
    73	      {o.status === 'Out for delivery' && <div className="card stack">
    74	        <h2>Complete delivery</h2>
    75	        {o.payment === 'cod' ? <Field label="Cash collected (₱)"><input type="number" inputMode="numeric" value={cash ?? o.amount} onChange={(e) => setCash(+e.target.value)} /></Field>
    76	          : <div className="mute">{o.payment.toUpperCase()}: confirm the customer's payment screen, then continue.</div>}
    77	        <Field label="Proof of delivery"><div className="chips">
    78	          <button className={`chip ${mode === 'otp' ? 'on' : ''}`} onClick={() => setMode('otp')}>Customer code</button>
    79	          <button className={`chip ${mode === 'photo' ? 'on' : ''}`} onClick={() => setMode('photo')}>Photo</button></div></Field>
    80	        {mode === 'otp' ? <Field label="4-digit code the customer received by SMS"><input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={4} placeholder="demo code: 4821" /></Field>
    81	          : <><input type="file" accept="image/*" capture="environment" onChange={async (e) => e.target.files?.[0] && setPhoto(await shrink(e.target.files[0]))} />{photo && <img src={photo} alt="Delivered cylinder" style={{ maxWidth: 160, borderRadius: 10 }} />}</>}
    82	        <Field label="Empty cylinders collected"><div className="row">
    83	          <button className="btn alt" onClick={() => setEmpties(Math.max(0, empties - 1))}>−</button><b>{empties}</b><button className="btn alt" onClick={() => setEmpties(empties + 1)}>+</button></div></Field>
    84	        <div className="mute">📍 GPS location and time are captured automatically with the confirmation.</div>
    85	        <button className="btn block" disabled={!podOk} onClick={() => { actions.deliver(o.id, { pod: { kind: mode, photo, at: Date.now(), lat: c.lat, lng: c.lng }, cash: cash ?? o.amount, empties }); nav(back) }}>Confirm delivered</button>
    86	        <hr style={{ border: 0, borderTop: '1px solid var(--line)', width: '100%' }} />
    87	        <Field label="Can't deliver?"><select value={reason} onChange={(e) => setReason(e.target.value)}><option value="">Choose a reason…</option>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
    88	        <button className="btn ghost block" disabled={!reason} onClick={() => { actions.fail(o.id, reason); nav(back) }}>Mark delivery failed</button>
    89	      </div>}
    90	
    91	      {o.status === 'Delivered' && <div className="card">✅ Delivered. {o.pod && `Proof: ${o.pod.kind}.`}</div>}
    92	    </div>
    93	  )
    94	}
     1	import { computeRefill, DAY, type Refill } from './refill'
     2	import type { Customer, DB, Order } from './types'
     3	
     4	export const delivered = (d: DB) => d.orders.filter((o) => o.status === 'Delivered')
     5	export const byId = <T extends { id: string }>(a: T[], id?: string) => a.find((x) => x.id === id)
     6	export const mins = (a: number, b: number) => Math.round((b - a) / 60_000)
     7	export const peso = (n: number) => '₱' + Math.round(n).toLocaleString()
     8	export const ago = (t: number, now = Date.now()) => {
     9	  const m = Math.round((now - t) / 60_000)
    10	  return m < 1 ? 'just now' : m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`
    11	}
    12	export const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10)
    13	export const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)
    14	
    15	/** Area average cycle per town, from customers with 2+ delivered orders. */
    16	export function areaCycles(d: DB): Record<string, number> {
    17	  const out: Record<string, number[]> = {}
    18	  for (const c of d.customers) {
    19	    const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
    20	    const r = computeRefill(t, c.size, undefined, Date.now())
    21	    if (r && r.source !== 'default') (out[c.town] ||= []).push(r.cycleDays)
    22	  }
    23	  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, avg(v)]))
    24	}
    25	
    26	export function refillOf(d: DB, c: Customer, area = areaCycles(d)): Refill | null {
    27	  const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
    28	  return computeRefill(t, c.size, area[c.town], Date.now())
    29	}
    30	
    31	export const refillRows = (d: DB) => {
    32	  const area = areaCycles(d)
    33	  return d.customers.map((c) => ({ c, r: refillOf(d, c, area) }))
    34	}
    35	
    36	export const ordersOf = (d: DB, customerId: string): Order[] => d.orders.filter((o) => o.customerId === customerId).sort((a, b) => b.placedAt - a.placedAt)
    37	export const lastOrderDays = (d: DB, c: Customer) => {
    38	  const t = delivered(d).filter((o) => o.customerId === c.id).map((o) => o.deliveredAt!)
    39	  return t.length ? (Date.now() - Math.max(...t)) / DAY : Infinity
    40	}
    41	
    42	export const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    43	  const r = (x: number) => (x * Math.PI) / 180
    44	  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2
    45	  return 12742 * Math.asin(Math.sqrt(h))
    46	}
    47	const DEPOT = { lat: 16.043, lng: 120.334 } // Dagupan depot (demo)
    48	/** Rider position = their latest active stop, else the depot. Stand-in for live GPS. */
    49	export function riderPos(d: DB, riderId: string) {
    50	  const active = d.orders.filter((o) => o.riderId === riderId && (o.status === 'Assigned' || o.status === 'Out for delivery')).sort((a, b) => b.assignedAt! - a.assignedAt!)[0]
    51	  return active ? byId(d.customers, active.customerId)! : DEPOT
    52	}
    53	export function nearestRider(d: DB, o: Order) {
    54	  const c = byId(d.customers, o.customerId)!
    55	  return d.riders.map((r) => ({ r, km: km(riderPos(d, r.id), c) })).sort((a, b) => a.km - b.km)[0]
    56	}
     1	import { useSyncExternalStore } from 'react'
     2	import { DEPOSIT, REFILL_PRICE, town } from './geo'
     3	import { seed } from './seed'
     4	import type { Channel, Customer, DB, Order, Outcome, Payment, Size } from './types'
     5	
     6	const KEY = 'fiesta-gas-demo-v1'
     7	const load = (): DB => {
     8	  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch { /* private mode: fall through to seed */ }
     9	  return seed()
    10	}
    11	let db: DB = load()
    12	const subs = new Set<() => void>()
    13	const emit = () => { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* quota: keep in memory */ } subs.forEach((f) => f()) }
    14	// Other tabs (e.g. dispatcher on one tab, rider on another) stay live.
    15	addEventListener('storage', (e) => { if (e.key === KEY && e.newValue) { db = JSON.parse(e.newValue); subs.forEach((f) => f()) } })
    16	
    17	export const useDB = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => db)
    18	const set = (f: (d: DB) => DB) => { db = f(structuredClone(db)); emit() }
    19	const uid = (p: string) => `${p}${Math.random().toString(36).slice(2, 8)}`
    20	const sms = (d: DB, to: string, text: string, kind: 'status' | 'reminder' | 'blast' | 'otp') => d.sms.unshift({ id: uid('s'), to, text, at: Date.now(), kind })
    21	const cust = (d: DB, id: string) => d.customers.find((c) => c.id === id)!
    22	
    23	export const OTP = '4821' // demo one-time code, shown in the customer's SMS inbox
    24	
    25	export const actions = {
    26	  reset: () => { db = seed(); emit() },
    27	
    28	  placeOrder(i: { customerId: string; size: Size; qty: number; type: 'refill' | 'new'; payment: Payment; channel: Channel }) {
    29	    set((d) => {
    30	      const c = cust(d, i.customerId)
    31	      const amount = (REFILL_PRICE[i.size] + (i.type === 'new' ? DEPOSIT[i.size] : 0)) * i.qty + town(c.town).fee
    32	      const o: Order = { id: `FG-${1000 + d.orders.length + 1}`, ...i, status: 'Placed', amount, placedAt: Date.now() }
    33	      d.orders.push(o)
    34	      sms(d, c.phone, `Fiesta Gas: order ${o.id} received (${i.qty}x ${i.size}, ₱${amount.toLocaleString()}). We'll text you when a rider is on the way.`, 'status')
    35	      return d
    36	    })
    37	  },
    38	  assign(orderId: string, riderId: string) {
    39	    set((d) => {
    40	      const o = d.orders.find((x) => x.id === orderId)!
    41	      o.status = 'Assigned'; o.riderId = riderId; o.assignedAt = Date.now(); o.failReason = undefined
    42	      sms(d, cust(d, o.customerId).phone, `Fiesta Gas: ${d.riders.find((r) => r.id === riderId)!.name} will deliver order ${o.id}.`, 'status')
    43	      return d
    44	    })
    45	  },
    46	  cancel(orderId: string) { set((d) => { d.orders.find((x) => x.id === orderId)!.status = 'Cancelled'; return d }) },
    47	  startDelivery(orderId: string) {
    48	    set((d) => {
    49	      const o = d.orders.find((x) => x.id === orderId)!
    50	      o.status = 'Out for delivery'
    51	      const c = cust(d, o.customerId)
    52	      sms(d, c.phone, `Fiesta Gas: your order ${o.id} is out for delivery. Delivery code: ${OTP}. Give it to the rider.`, 'otp')
    53	      return d
    54	    })
    55	  },
    56	  deliver(orderId: string, p: { pod: NonNullable<Order['pod']>; cash: number; empties: number }) {
    57	    set((d) => {
    58	      const o = d.orders.find((x) => x.id === orderId)!
    59	      o.status = 'Delivered'; o.deliveredAt = Date.now(); o.pod = p.pod; o.cashCollected = o.payment === 'cod' ? p.cash : 0; o.empties = p.empties
    60	      d.stock.full[o.size] -= o.qty
    61	      d.stock.empty[o.size] += p.empties
    62	      d.movements.unshift({ id: uid('m'), at: Date.now(), kind: 'delivery', size: o.size, full: -o.qty, empty: p.empties, note: `Order ${o.id}` })
    63	      sms(d, cust(d, o.customerId).phone, `Fiesta Gas: order ${o.id} delivered. Salamat po!`, 'status')
    64	      return d
    65	    })
    66	  },
    67	  fail(orderId: string, reason: string) {
    68	    set((d) => {
    69	      const o = d.orders.find((x) => x.id === orderId)!
    70	      o.status = 'Failed'; o.failReason = reason
    71	      return d
    72	    })
    73	  },
    74	  requeue(orderId: string) { set((d) => { const o = d.orders.find((x) => x.id === orderId)!; o.status = 'Placed'; o.riderId = undefined; return d }) },
    75	
    76	  addCustomer(c: Omit<Customer, 'id' | 'heldCylinders'>) {
    77	    let id = ''
    78	    set((d) => { id = uid('c'); d.customers.push({ ...c, id, heldCylinders: 0 }); return d })
    79	    return id
    80	  },
    81	  logFollowUp(customerId: string, outcome: Outcome) { set((d) => { d.followUps.unshift({ id: uid('f'), customerId, outcome, at: Date.now() }); return d }) },
    82	
    83	  sendBlast(message: string, segment: string, recipients: string[]) {
    84	    set((d) => {
    85	      d.blasts.unshift({ id: uid('b'), message, segment, recipients, at: Date.now() })
    86	      recipients.forEach((id) => sms(d, cust(d, id).phone, message, 'blast'))
    87	      return d
    88	    })
    89	  },
    90	  sendReminder(customerId: string) {
    91	    set((d) => { sms(d, cust(d, customerId).phone, 'Fiesta Gas: baka paubos na ang gas ninyo! Order na: fiestagas.example/order — reply STOP to opt out.', 'reminder'); return d })
    92	  },
    93	  stockIn(size: Size, qty: number, note: string) {
    94	    set((d) => {
    95	      d.stock.full[size] += qty; d.stock.empty[size] = Math.max(0, d.stock.empty[size] - qty)
    96	      d.movements.unshift({ id: uid('m'), at: Date.now(), kind: 'stock-in', size, full: qty, empty: -qty, note })
    97	      return d
    98	    })
    99	  },
   100	  remit(riderId: string, day: string, turnedOver: number) {
   101	    set((d) => { d.remits = d.remits.filter((r) => !(r.riderId === riderId && r.day === day)); d.remits.push({ riderId, day, turnedOver }); return d })
   102	  },
   103	}
     1	import react from '@vitejs/plugin-react'
     2	import { defineConfig } from 'vitest/config'
     3	import { VitePWA } from 'vite-plugin-pwa'
     4	
     5	export default defineConfig({
     6	  base: './',
     7	  plugins: [
     8	    react(),
     9	    VitePWA({
    10	      registerType: 'autoUpdate',
    11	      includeAssets: ['icon.svg'],
    12	      manifest: {
    13	        name: 'Fiesta Gas Delivery (prototype)',
    14	        short_name: 'Fiesta Gas',
    15	        description: 'LPG ordering, delivery and refill reminders: clickable prototype',
    16	        theme_color: '#0b2a57',
    17	        background_color: '#f3f5f9',
    18	        display: 'standalone',
    19	        start_url: './',
    20	        icons: [
    21	          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    22	          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    23	          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    24	        ],
    25	      },
    26	      // Cache map tiles at runtime so previously viewed areas work offline.
    27	      workbox: { runtimeCaching: [{ urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/, handler: 'CacheFirst', options: { cacheName: 'osm-tiles', expiration: { maxEntries: 300 } } }] },
    28	    }),
    29	  ],
    30	})
    39	export function Blast() {
    40	  const d = useDB()
    41	  const [tw, setTw] = useState(''); const [sz, setSz] = useState(''); const [overdue, setOverdue] = useState(false); const [min, setMin] = useState(0)
    42	  const [msg, setMsg] = useState(TEMPLATES[0]); const [sent, setSent] = useState(false)
    43	  const rows = useMemo(() => refillRows(d), [d])
    44	  const seg = rows.filter(({ c, r }) => (!tw || c.town === tw) && (!sz || c.size === sz) && (!overdue || r?.status === 'overdue') &&
    45	    delivered(d).filter((o) => o.customerId === c.id).length >= min)
    46	  const to = seg.filter(({ c }) => c.promoConsent)
    47	  const label = [tw || 'All towns', sz || 'all sizes', overdue && 'overdue only', min && `${min}+ orders`, 'consented'].filter(Boolean).join(' · ')
    48	  const full = `${msg} Reply STOP to opt out.`
    49	  return (
    50	    <div className="stack">
    51	      <h1>SMS text blast</h1>
    52	      <div className="sidebar">
    53	        <div className="card stack">
    54	          <div className="grid">
    55	            <Field label="Town"><select value={tw} onChange={(e) => setTw(e.target.value)}><option value="">All</option>{TOWNS.map((t) => <option key={t.name}>{t.name}</option>)}</select></Field>
    56	            <Field label="Cylinder size"><select value={sz} onChange={(e) => setSz(e.target.value)}><option value="">All</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</select></Field>
    57	            <Field label="Min. orders"><input type="number" min={0} value={min} onChange={(e) => setMin(+e.target.value || 0)} /></Field>
    58	            <label className="row" style={{ alignSelf: 'end', paddingBottom: 10 }}><input type="checkbox" checked={overdue} onChange={(e) => setOverdue(e.target.checked)} />Overdue only</label>
    59	          </div>
    60	          <Field label="Saved templates"><div className="chips">{TEMPLATES.map((t, i) => <button key={t} className={`chip ${msg === t ? 'on' : ''}`} onClick={() => setMsg(t)}>Template {i + 1}</button>)}</div></Field>
    61	          <Field label="Message"><textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
    62	          <div className="mute">Opt-out text is added automatically. Only customers who consented to promos are included ({seg.length - to.length} excluded).</div>
    63	          <div className="row"><b>{to.length} recipients</b><span className="mute">≈ ₱{(to.length * SMS_COST).toFixed(2)} at ₱{SMS_COST}/SMS</span>
    64	            <button className="btn hot right" disabled={!to.length || !msg.trim()} onClick={() => { actions.sendBlast(full, label, to.map((x) => x.c.id)); setSent(true); setTimeout(() => setSent(false), 2500) }}>Send now</button></div>
    65	          {sent && <div className="pill ok">Sent (simulated). Check the report on the right.</div>}
    66	        </div>
    67	        <div className="stack">
    68	          <div className="card"><h3>Preview</h3><div className="sms">{full}</div></div>
    69	          <div className="card stack"><h3>Blast history</h3>{d.blasts.map((b) => {
    70	            const n = d.orders.filter((o) => b.recipients.includes(o.customerId) && o.placedAt > b.at && o.placedAt < b.at + 7 * DAY).length
    71	            return <div key={b.id}><b>{b.segment}</b><div className="mute">{ago(b.at)} · delivered to {b.recipients.length} · {n} orders within 7 days</div></div> })}</div>
    72	        </div>
    73	      </div>
    74	      <div className="mute">Customers: {rows.length}. Example recipient: {to[0] ? byId(d.customers, to[0].c.id)!.name : '—'}.</div>
    75	    </div>
     8	export function Inventory() {
     9	  const d = useDB()
    10	  const [size, setSize] = useState<Size>('11kg'); const [qty, setQty] = useState(10)
    11	  const held = d.customers.reduce((a, c) => a + c.heldCylinders, 0)
    12	  return (
    13	    <div className="stack">
    14	      <h1>Cylinder inventory</h1>
    15	      <div className="grid">{SIZES.map((s) => { const low = d.stock.full[s] <= LOW_STOCK[s]; return (
    16	        <div key={s} className="card" style={low ? { borderColor: 'var(--bad)' } : undefined}>
    17	          <h3>{s}</h3><div className="big">{d.stock.full[s]} <span className="mute" style={{ fontSize: 14 }}>full</span></div>
    18	          <div className="mute">{d.stock.empty[s]} empty{low && <b style={{ color: 'var(--bad)' }}> · low stock (alert at {LOW_STOCK[s]})</b>}</div></div>) })}
    19	        <div className="card"><h3>Held by customers</h3><div className="big">{held}</div><div className="mute">cylinders out on deposit</div></div></div>
    20	      <div className="card row">
    21	        <b>Stock-in from supplier</b>
    22	        <Field label="Size"><select value={size} onChange={(e) => setSize(e.target.value as Size)}>{SIZES.map((s) => <option key={s}>{s}</option>)}</select></Field>
    23	        <Field label="Qty"><input type="number" min={1} value={qty} onChange={(e) => setQty(+e.target.value || 1)} style={{ width: 80 }} /></Field>
    24	        <button className="btn" onClick={() => actions.stockIn(size, qty, 'Refilled cylinders from supplier')}>Record stock-in</button>
    25	        <span className="mute">Delivered orders deduct full tanks and add collected empties automatically.</span></div>
    26	      <div className="card scroll"><h3>Movements</h3><table><thead><tr><th>When</th><th>Type</th><th>Size</th><th>Full</th><th>Empty</th><th>Note</th></tr></thead><tbody>
    27	        {d.movements.slice(0, 15).map((m) => <tr key={m.id}><td>{ago(m.at)}</td><td>{m.kind}</td><td>{m.size}</td><td>{m.full > 0 ? '+' : ''}{m.full}</td><td>{m.empty > 0 ? '+' : ''}{m.empty}</td><td>{m.note}</td></tr>)}</tbody></table></div>
    28	    </div>
    29	  )
    30	}
    31	
    32	export function Remittance() {
    33	  const d = useDB()
    34	  const day = dayKey(Date.now())
    35	  return (
    36	    <div className="stack">
    37	      <h1>Rider remittance · today</h1>
    38	      <div className="mute">Expected cash from delivered cash-on-delivery orders vs. cash the rider turned over.</div>
    39	      <div className="card scroll"><table><thead><tr><th>Rider</th><th>Deliveries</th><th>Expected cash</th><th>Turned over</th><th>Difference</th></tr></thead><tbody>
    40	        {d.riders.map((r) => {
    41	          const mine = d.orders.filter((o) => o.riderId === r.id && o.status === 'Delivered' && dayKey(o.deliveredAt!) === day)
    42	          const exp = mine.reduce((a, o) => a + (o.cashCollected ?? 0), 0)
    43	          const rem = d.remits.find((x) => x.riderId === r.id && x.day === day)
    44	          const diff = rem ? rem.turnedOver - exp : undefined
    45	          return <tr key={r.id}><td>{byId(d.riders, r.id)!.name}</td><td>{mine.length}</td><td>{peso(exp)}</td>
    46	            <td><input aria-label={`Turned over ${r.name}`} type="number" style={{ width: 110 }} defaultValue={rem?.turnedOver} onBlur={(e) => e.target.value !== '' && actions.remit(r.id, day, +e.target.value)} /></td>
    47	            <td>{diff === undefined ? '—' : <b style={{ color: diff === 0 ? 'var(--ok)' : 'var(--bad)' }}>{diff === 0 ? 'Balanced' : peso(diff)}</b>}</td></tr> })}</tbody></table></div>
    48	    </div>
    49	  )
    50	}

codex
1. **[P1] [src/lib/store.ts:56](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/store.ts:56) — Delivery can be confirmed more than once, deducting stock repeatedly.** A second tab or a repeated action can deliver an already delivered order and append another inventory movement. Guard transitions so only an `Out for delivery` order can be delivered, and make the update idempotent.

2. **[P1] [src/lib/store.ts:60](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/store.ts:60) — Delivery deducts stock without checking availability.** Stock can go negative, and neither assignment nor delivery blocks an order that exceeds full stock. Validate available stock before dispatch or confirmation and show an actionable error.

3. **[P1] [src/lib/derive.ts:18](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/derive.ts:18) — Refill-cycle averages mix cylinder sizes.** An 11kg and 50kg customer in the same town contribute equally to the area default, despite the PRD specifying defaults by size and area average. Group area averages by town and size.

4. **[P1] [src/lib/refill.ts:19](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/refill.ts:19) — An order becomes overdue only after *more than* the grace period.** At exactly three days past expected refill it remains `due`; the PRD says overdue once past the date by a grace period. Use a boundary consistent with that rule and test it.

5. **[P1] [src/lib/store.ts:28](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/store.ts:28) — Order IDs can collide after cancellation or reset.** IDs are based on current order count, so deleting no orders but resetting to seed or concurrent tab order creation can reuse an ID. Use a collision-resistant ID or monotonic counter.

6. **[P1] [src/lib/store.ts:93](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/store.ts:93) — Stock-in silently reduces empty-cylinder stock without validating the quantity.** Recording more stock-in than available empties clamps the displayed empty stock to zero while logging the full negative quantity, producing a false movement history. Validate the return quantity or represent supplier stock-in separately from returned empties.

7. **[P1] [src/pages/rider/Rider.tsx:84](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/rider/Rider.tsx:84) — The “GPS” proof records the customer’s saved pin, not the rider’s current location.** This can make proof look verified when no GPS was read. Capture browser geolocation and timestamp, and expose permission or failure state.

8. **[P1] [src/pages/customer/Customer.tsx:9](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/customer/Customer.tsx:9) — The customer flow is hard-wired to one seeded account.** New dispatcher-added customers cannot use the PWA to order or see their history, so the customer journey only works for the demo seed. Add a customer-selection or login flow, or clearly limit and label the demo account.

9. **[P1] [src/pages/rider/Rider.tsx:23](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/rider/Rider.tsx:23) — Safety checks are not required before starting deliveries.** The checklist is only local component state and never gates “Start delivery”; navigating away resets it. Persist checklist state per rider and prevent start until required checks are complete.

10. **[P1] [src/pages/owner/Engage.tsx:64](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Engage.tsx:64) — Repeated clicks can send duplicate blasts.** The button remains active while the simulated send runs, creating duplicate blast records and SMS entries. Disable it during submission and confirm the recipient count before sending.

11. **[P2] [src/pages/dispatcher/Board.tsx:14](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/dispatcher/Board.tsx:14) — Failed orders can be reassigned directly, but there is no requeue action despite the stated failed-to-queue flow.** The store has `requeue`, but the board does not use it. Add an explicit requeue path or make reassignment visibly reset the failed state and reason.

12. **[P2] [src/pages/owner/Dashboard.tsx:30](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Dashboard.tsx:30) — “Avg refill cycle” and “First → second order” use the same customer set.** Both include customers with exactly two orders, so the dashboard reports identical metrics and misses the PRD’s later-order average. Calculate first-to-second separately and average later intervals for cycle length.

13. **[P2] [src/pages/owner/Ops.tsx:20](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Ops.tsx:20) — Inventory has no adjustment/count workflow or discrepancy report.** The PRD calls for physical counts with adjustment reasons and movement/discrepancy reporting; the demo only supports stock-in and delivery movement.

14. **[P2] [src/pages/owner/Engage.tsx:43](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Engage.tsx:43) — The blast flow lacks scheduling, saved-template persistence, and delivery results.** It simulates immediate sends and labels every recipient “delivered,” while the PRD expects send/schedule, saved templates, and a delivery report.

15. **[P2] [vite.config.ts:20](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/vite.config.ts:20) — Manifest icon files are not included in the configured assets.** Only `icon.svg` is listed, while the manifest references `icon-192.png` and `icon-512.png`; if those files are absent or not precached, installability and the installed-app icon can fail. Use existing icon paths or add and include the referenced PNGs.
tokens used
47,226
1. **[P1] [src/lib/store.ts:56](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/store.ts:56) — Delivery can be confirmed more than once, deducting stock repeatedly.** A second tab or a repeated action can deliver an already delivered order and append another inventory movement. Guard transitions so only an `Out for delivery` order can be delivered, and make the update idempotent.

2. **[P1] [src/lib/store.ts:60](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/store.ts:60) — Delivery deducts stock without checking availability.** Stock can go negative, and neither assignment nor delivery blocks an order that exceeds full stock. Validate available stock before dispatch or confirmation and show an actionable error.

3. **[P1] [src/lib/derive.ts:18](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/derive.ts:18) — Refill-cycle averages mix cylinder sizes.** An 11kg and 50kg customer in the same town contribute equally to the area default, despite the PRD specifying defaults by size and area average. Group area averages by town and size.

4. **[P1] [src/lib/refill.ts:19](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/refill.ts:19) — An order becomes overdue only after *more than* the grace period.** At exactly three days past expected refill it remains `due`; the PRD says overdue once past the date by a grace period. Use a boundary consistent with that rule and test it.

5. **[P1] [src/lib/store.ts:28](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/store.ts:28) — Order IDs can collide after cancellation or reset.** IDs are based on current order count, so deleting no orders but resetting to seed or concurrent tab order creation can reuse an ID. Use a collision-resistant ID or monotonic counter.

6. **[P1] [src/lib/store.ts:93](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/lib/store.ts:93) — Stock-in silently reduces empty-cylinder stock without validating the quantity.** Recording more stock-in than available empties clamps the displayed empty stock to zero while logging the full negative quantity, producing a false movement history. Validate the return quantity or represent supplier stock-in separately from returned empties.

7. **[P1] [src/pages/rider/Rider.tsx:84](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/rider/Rider.tsx:84) — The “GPS” proof records the customer’s saved pin, not the rider’s current location.** This can make proof look verified when no GPS was read. Capture browser geolocation and timestamp, and expose permission or failure state.

8. **[P1] [src/pages/customer/Customer.tsx:9](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/customer/Customer.tsx:9) — The customer flow is hard-wired to one seeded account.** New dispatcher-added customers cannot use the PWA to order or see their history, so the customer journey only works for the demo seed. Add a customer-selection or login flow, or clearly limit and label the demo account.

9. **[P1] [src/pages/rider/Rider.tsx:23](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/rider/Rider.tsx:23) — Safety checks are not required before starting deliveries.** The checklist is only local component state and never gates “Start delivery”; navigating away resets it. Persist checklist state per rider and prevent start until required checks are complete.

10. **[P1] [src/pages/owner/Engage.tsx:64](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Engage.tsx:64) — Repeated clicks can send duplicate blasts.** The button remains active while the simulated send runs, creating duplicate blast records and SMS entries. Disable it during submission and confirm the recipient count before sending.

11. **[P2] [src/pages/dispatcher/Board.tsx:14](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/dispatcher/Board.tsx:14) — Failed orders can be reassigned directly, but there is no requeue action despite the stated failed-to-queue flow.** The store has `requeue`, but the board does not use it. Add an explicit requeue path or make reassignment visibly reset the failed state and reason.

12. **[P2] [src/pages/owner/Dashboard.tsx:30](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Dashboard.tsx:30) — “Avg refill cycle” and “First → second order” use the same customer set.** Both include customers with exactly two orders, so the dashboard reports identical metrics and misses the PRD’s later-order average. Calculate first-to-second separately and average later intervals for cycle length.

13. **[P2] [src/pages/owner/Ops.tsx:20](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Ops.tsx:20) — Inventory has no adjustment/count workflow or discrepancy report.** The PRD calls for physical counts with adjustment reasons and movement/discrepancy reporting; the demo only supports stock-in and delivery movement.

14. **[P2] [src/pages/owner/Engage.tsx:43](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/src/pages/owner/Engage.tsx:43) — The blast flow lacks scheduling, saved-template persistence, and delivery results.** It simulates immediate sends and labels every recipient “delivered,” while the PRD expects send/schedule, saved templates, and a delivery report.

15. **[P2] [vite.config.ts:20](/Users/davecharm.bulaquena/Documents/personal/fiesta-gas/app/vite.config.ts:20) — Manifest icon files are not included in the configured assets.** Only `icon.svg` is listed, while the manifest references `icon-192.png` and `icon-512.png`; if those files are absent or not precached, installability and the installed-app icon can fail. Use existing icon paths or add and include the referenced PNGs.
