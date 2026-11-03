import { expect, test } from 'vitest'
import { computeRefill, DAY } from './refill'

const now = 100 * DAY
test('one order uses size default, area average wins when given', () => {
  expect(computeRefill([now], '11kg', undefined, now)?.cycleDays).toBe(35)
  expect(computeRefill([now], '11kg', 28, now)?.source).toBe('default')
  expect(computeRefill([now], '11kg', 28, now)?.cycleDays).toBe(28)
})
test('second order sets first cycle, later orders average', () => {
  const two = computeRefill([0, 30 * DAY], '11kg', undefined, now)!
  expect(two.source).toBe('first')
  expect(two.firstToSecond).toBe(30)
  const three = computeRefill([0, 30 * DAY, 50 * DAY], '11kg', undefined, now)!
  expect(three.source).toBe('average')
  expect(three.cycleDays).toBe(25)
  expect(three.firstToSecond).toBe(30)
})
test('status: ok -> due -> overdue past grace', () => {
  const at = (d: number) => computeRefill([0, 30 * DAY], '11kg', undefined, d * DAY)!.status
  expect(at(40)).toBe('ok') // expected day 60
  expect(at(58)).toBe('due')
  expect(at(62)).toBe('due') // inside grace
  expect(at(63)).toBe('overdue') // exactly grace days past
  expect(at(64)).toBe('overdue')
})
test('no orders -> null', () => expect(computeRefill([], '11kg', undefined, now)).toBeNull())
