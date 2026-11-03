## 1. Goal → owner decision → best view

| PRD goal | Decision the owner makes | Best view |
|---|---|---|
| Faster deliveries | Which rider or town needs attention? | **Ranked table:** rider/town, deliveries, average minutes, vs target, vs overall average. Flag slow outliers. Since today’s averages cluster around 62 minutes, show the numbers and deltas; remove both delivery-time bar charts. |
| More repeat orders | Are customers ordering again on the expected cycle? | **KPI plus customer follow-up table:** repeat rate and average refill cycle above a ranked list of due/overdue customers, with last order, expected refill date, and status. Remove the segmented refill bar; it shows counts without telling the owner who to contact. |
| Fewer lost customers | Who needs contact, and did contacted customers reorder? | **Follow-up table:** customer, town, days overdue, last contact, reorder status. Keep “Customers to call” as a link/KPI. Track contacted-to-reordered outcomes in the table. |
| Better promo results | Which blast should be repeated or changed? | **Blast table:** segment, sent date, recipients, orders in window, order rate, and baseline/delta. Keep a blast only if it shows measurable lift; raw post-blast order counts alone don’t establish impact. |
| Less manual work | Is customer self-service reducing staff entry? | **One small 8-week stacked column chart** for customer-placed vs staff-encoded orders, with current share and change. Retain the trend because it shows progress over time. |

## 2. Page layout, top to bottom

1. **Business overview** and “Last 30 days vs the 30 before” stay as-is.
2. **KPI strip:** Orders, Revenue, Avg delivery time, Repeat rate, Customers to call. Keep **“Avg delivery time”** exactly as written; remove Time to dispatch and Avg refill cycle from the top strip unless they drive a separate owner decision.
3. **Two-column decision section:**
   - Left: “Delivery performance” ranked table. Columns: Rider/town, Deliveries, Avg minutes, vs target, vs overall avg. Use tabs for Rider / Town if needed.
   - Right: “Customer retention” summary and follow-up table. Columns: Customer, Town, Last order, Expected refill, Days overdue, Contact/reorder status.
4. **Less manual work:** the weekly channel chart, kept to one chart.
5. **Promo results:** blast table. Columns: Blast/segment, Sent, Recipients, Window, Orders, Order rate, vs baseline.

That is one chart total. Remove Orders per day unless the owner confirms daily volume changes staffing or stock decisions. Remove revenue-by-town, units-by-size, failed-reason bars, and the refill-health bar; retain those metrics only if they become actionable rows or alerts.

## 3. Seed-data changes

Keep the seeded PRNG deterministic. Set explicit overrides after generated orders so the intended examples survive changes to the random sequence.

- **Delivery outliers:** adjust delivered durations in `seed.ts` by rider and customer town. Keep most orders near 58–64 minutes, but give one rider a meaningful sample averaging about 85 minutes and one town about 90 minutes. Keep the other groups around 55–65. Avoid a one-order “outlier”; use several orders per group.
- **Failed deliveries:** replace the five generic failures with a clear dominant reason, such as 4 “Wrong address” and 1 “No one home.” Place them in the current 30-day window and assign riders so they can be investigated.
- **Promo lift:** the current blast uses just 9 recipients and counts any recipient order in the following week, which is too small and lacks a comparison. Use a larger deterministic consented segment; ensure a visible subset places orders in the 7-day window and add a comparable pre-blast or unmessaged baseline cohort. Show order rate and lift, not just post-blast count.
- **Repeat and follow-up outcomes:** retain generated repeat-order variation, but ensure the seed includes both overdue customers who reorder after contact and overdue customers who do not. Add/seed contact and reorder outcome fields only if the existing model supports them; otherwise the proposed table needs a small data-model addition.
- Leave the existing app-share progression intact so the manual-work trend remains visible. Preserve **“Business overview”** and **“Avg delivery time”** exactly.

## 4. shadcn components

Use `Table` for ranked delivery, follow-up, and blast results; `Badge` for status and outlier flags; `Tabs` for Rider/Town table switching; `Card` for compact KPI grouping; and the existing Recharts `ChartContainer` for the single weekly stacked chart. Use inline colored deltas and tabular numerals in tables. Avoid horizontal-bar panels, gradients, and decorative tiles.

## 5. Reviewer checklist

- [ ] “Business overview” remains visible.
- [ ] “Avg delivery time” remains visible with that exact label.
- [ ] No more than three charts appear; proposed layout uses one.
- [ ] Rider and town averages include sample counts and target/average comparisons.
- [ ] Slow rider and slow town are clearly flagged from seeded data.
- [ ] Follow-up rows distinguish due/overdue and show contact/reorder outcome.
- [ ] Promo rows show recipients, order rate, and a meaningful baseline comparison.
- [ ] Every remaining visual supports a stated owner decision.
