/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNights,
  calculatePriceBreakdown,
  doDatesOverlap,
  isRoomAvailableForDates,
  hasPermission,
  formatINR,
  normalizeIndianPhone,
  ExistingBooking
} from './bookingEngine.ts';

test('calculateNights correctly counts duration between dates', () => {
  assert.equal(calculateNights('2026-11-01', '2026-11-05'), 4);
  assert.equal(calculateNights('2026-11-05', '2026-11-06'), 1);
  assert.equal(calculateNights('2026-11-05', '2026-11-05'), 0);
  assert.equal(calculateNights('2026-11-10', '2026-11-05'), 0);
});

test('calculatePriceBreakdown computes subtotal, 18% GST (CGST + SGST), resort fees, and grand total in INR', () => {
  // Base price: ₹15,000/night for 3 nights with 10% promotional discount
  const breakdown = calculatePriceBreakdown(15000, 3, 1, 10);
  // Room subtotal: 15000 * 3 = 45000
  assert.equal(breakdown.roomRateSubtotal, 45000);
  // 10% discount: 4500
  assert.equal(breakdown.discountAmount, 4500);
  // Taxable: 40500. GST 18%: 40500 * 0.18 = 7290
  assert.equal(breakdown.taxAmount, 7290);
  assert.equal(breakdown.cgstAmount + breakdown.sgstAmount, 7290);
  // Resort fee: ₹750 * 3 = 2250
  assert.equal(breakdown.resortFee, 2250);
  // Total: 40500 + 7290 + 2250 = 50040
  assert.equal(breakdown.totalAmount, 50040);
  assert.equal(breakdown.currency, 'INR');
});

test('formatINR formats currency with Indian rupee symbol and thousand separators', () => {
  const formatted = formatINR(125000);
  assert.match(formatted, /1,25,000/);
});

test('normalizeIndianPhone formats 10-digit Indian numbers with +91 country code', () => {
  assert.equal(normalizeIndianPhone('9876543210'), '+91 98765 43210');
  assert.equal(normalizeIndianPhone('+91 98765 43210'), '+91 98765 43210');
});

test('doDatesOverlap correctly detects half-open booking conflicts', () => {
  assert.equal(
    doDatesOverlap(
      { checkIn: '2026-11-01', checkOut: '2026-11-05' },
      { checkIn: '2026-11-03', checkOut: '2026-11-07' }
    ),
    true
  );

  assert.equal(
    doDatesOverlap(
      { checkIn: '2026-11-01', checkOut: '2026-11-05' },
      { checkIn: '2026-11-05', checkOut: '2026-11-09' }
    ),
    false
  );
});

test('isRoomAvailableForDates rejects rooms with conflicting active bookings', () => {
  const existing: ExistingBooking[] = [
    {
      id: 'bkg-1',
      roomId: 'room-101',
      checkIn: '2026-12-10',
      checkOut: '2026-12-15',
      bookingStatus: 'confirmed'
    }
  ];

  assert.equal(
    isRoomAvailableForDates('room-101', { checkIn: '2026-12-12', checkOut: '2026-12-16' }, existing),
    false
  );
  assert.equal(
    isRoomAvailableForDates('room-101', { checkIn: '2026-12-05', checkOut: '2026-12-10' }, existing),
    true
  );
});

test('RBAC permissions validate roles correctly', () => {
  assert.equal(hasPermission('guest', 'create_booking'), true);
  assert.equal(hasPermission('staff', 'perform_checkin'), true);
  assert.equal(hasPermission('manager', 'manage_rooms'), true);
  assert.equal(hasPermission('superadmin', 'manage_all_hotels'), true);
});
