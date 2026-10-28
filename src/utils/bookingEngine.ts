/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'guest' | 'staff' | 'manager' | 'superadmin' | 'admin';

export interface ExistingBooking {
  id?: string;
  roomId?: string;
  checkIn: string;
  checkOut: string;
  bookingStatus?: string;
  status?: string;
}

export interface PriceBreakdownResult {
  basePricePerNight: number;
  roomRateSubtotal: number;
  baseTariff: number;
  numberOfNights: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  resortFee: number;
  totalAmount: number;
  currency: string;
}

/**
 * Calculates number of nights between two ISO date strings (YYYY-MM-DD).
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Calculates itemized tariff breakdown for Indian hospitality with 18% GST (9% CGST + 9% SGST).
 * Supports both function signatures:
 * Signature A (Numeric): (basePrice, nights, numberOfRooms, discountPercent, seasonalMultiplier)
 * Signature B (Date-based): (basePrice, checkInStr, checkOutStr, guestCount, seasonalMultiplier)
 */
export function calculatePriceBreakdown(
  basePrice: number,
  arg2: number | string,
  arg3: number | string = 1,
  arg4: number = 0,
  arg5: number = 1.0
): PriceBreakdownResult {
  let nights = 1;
  let numberOfRooms = 1;
  let discountPercent = 0;
  let seasonalMultiplier = 1.0;

  if (typeof arg2 === 'string' && typeof arg3 === 'string') {
    nights = calculateNights(arg2, arg3) || 1;
    numberOfRooms = 1;
    discountPercent = 0;
    seasonalMultiplier = typeof arg5 === 'number' ? arg5 : 1.0;
  } else {
    nights = typeof arg2 === 'number' ? arg2 : 1;
    numberOfRooms = typeof arg3 === 'number' ? arg3 : 1;
    discountPercent = typeof arg4 === 'number' ? arg4 : 0;
    seasonalMultiplier = typeof arg5 === 'number' ? arg5 : 1.0;
  }

  const effectiveBasePrice = Math.round(basePrice * seasonalMultiplier);
  const roomRateSubtotal = effectiveBasePrice * nights * numberOfRooms;
  const discountAmount = Math.round((roomRateSubtotal * discountPercent) / 100);
  const taxableAmount = roomRateSubtotal - discountAmount;

  // Indian Hospitality GST @ 18% (SAC 996311)
  const taxRate = 0.18;
  const taxAmount = Math.round(taxableAmount * taxRate);
  const cgstAmount = Math.round(taxAmount / 2);
  const sgstAmount = taxAmount - cgstAmount;

  // Standard Indian luxury resort and heritage amenity fee: ₹750/night/room
  const resortFee = 750 * nights * numberOfRooms;
  const totalAmount = taxableAmount + taxAmount + resortFee;

  return {
    basePricePerNight: effectiveBasePrice,
    roomRateSubtotal,
    baseTariff: roomRateSubtotal,
    numberOfNights: nights,
    discountPercent,
    discountAmount,
    taxRate,
    taxAmount,
    gstAmount: taxAmount,
    cgstAmount,
    sgstAmount,
    resortFee,
    totalAmount,
    currency: 'INR'
  };
}

/**
 * Formats an amount into Indian Rupees (INR) with Indian numbering comma grouping.
 * e.g., 125000 -> ₹1,25,000
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Normalizes and validates a 10-digit Indian phone number with the +91 country prefix.
 * e.g., "9876543210" -> "+91 98765 43210"
 * Returns null if invalid.
 */
export function normalizeIndianPhone(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, '');
  let tenDigit = '';

  if (digits.length === 10) {
    tenDigit = digits;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    tenDigit = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    tenDigit = digits.slice(1);
  } else {
    return null;
  }

  if (!/^[6-9]\d{9}$/.test(tenDigit)) {
    return null;
  }

  return `+91 ${tenDigit.slice(0, 5)} ${tenDigit.slice(5)}`;
}

/**
 * Half-open interval collision checker for booking dates [checkIn, checkOut).
 */
export function doDatesOverlap(
  rangeA: { checkIn: string; checkOut: string },
  rangeB: { checkIn: string; checkOut: string }
): boolean {
  const startA = new Date(rangeA.checkIn).getTime();
  const endA = new Date(rangeA.checkOut).getTime();
  const startB = new Date(rangeB.checkIn).getTime();
  const endB = new Date(rangeB.checkOut).getTime();

  return startA < endB && endA > startB;
}

/**
 * Determines if a room is available across a list of existing reservations.
 */
export function isRoomAvailableForDates(
  arg1: string,
  arg2: { checkIn: string; checkOut: string } | string,
  arg3?: ExistingBooking[] | string,
  arg4?: ExistingBooking[]
): boolean {
  let targetRoomId: string | null = null;
  let requestedRange: { checkIn: string; checkOut: string };
  let bookingsList: ExistingBooking[] = [];

  if (typeof arg2 === 'object' && Array.isArray(arg3)) {
    targetRoomId = arg1;
    requestedRange = arg2;
    bookingsList = arg3;
  } else if (typeof arg2 === 'string' && Array.isArray(arg3)) {
    requestedRange = { checkIn: arg1, checkOut: arg2 };
    bookingsList = arg3;
  } else if (typeof arg2 === 'string' && typeof arg3 === 'string' && Array.isArray(arg4)) {
    targetRoomId = arg1;
    requestedRange = { checkIn: arg2, checkOut: arg3 };
    bookingsList = arg4;
  } else {
    return true;
  }

  for (const b of bookingsList) {
    if (b.bookingStatus === 'cancelled' || b.status === 'cancelled') continue;
    if (targetRoomId && b.roomId && b.roomId !== targetRoomId) continue;
    if (doDatesOverlap(requestedRange, { checkIn: b.checkIn, checkOut: b.checkOut })) {
      return false;
    }
  }
  return true;
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  guest: [
    'create_booking',
    'search_hotels',
    'view_rooms',
    'cancel_own_booking',
    'view_own_folio',
    'request_service'
  ],
  staff: [
    'perform_checkin',
    'check_in_guest',
    'check_out_guest',
    'update_room_cleaning',
    'view_assigned_arrivals',
    'view_guest_identity'
  ],
  manager: [
    'manage_rooms',
    'perform_checkin',
    'check_in_guest',
    'check_out_guest',
    'update_room_tariff',
    'view_hotel_revenue',
    'manage_inventory',
    'assign_staff'
  ],
  admin: [
    '*'
  ],
  superadmin: [
    '*'
  ]
};

/**
 * Enforces role-based permissions across Guest, Staff, Manager, Super Admin.
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  if (role === 'admin' || role === 'superadmin') return true;
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  return rolePerms.includes(permission);
}
