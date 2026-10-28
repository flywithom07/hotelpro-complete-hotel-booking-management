/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../utils/bookingEngine.ts';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  accountStatus: 'active' | 'suspended';
  assignedHotelId: string | null;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  starRating: number;
  reviewAverage: number;
  reviewCount: number;
  rating?: number;
  totalReviews?: number;
  amenities: string[];
  images: string[];
  managerId: string;
  status: 'active' | 'maintenance';
  startingPrice?: number;
  totalRooms?: number;
  seasonalMultiplier?: number;
  policies: {
    checkInTime: string;
    checkOutTime: string;
    cancellationDays: number;
    petFriendly: boolean;
  };
  rooms?: Room[];
  roomCategories?: Room[];
  reviews?: Review[];
}

export interface Room {
  id: string;
  hotelId: string;
  roomNumber?: string;
  name?: string;
  category: string;
  capacity?: { adults: number; children: number };
  maxGuests?: number;
  bedType: string;
  sizeSqFt?: number;
  basePrice: number;
  amenities: string[];
  operationalStatus?: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  availableCount?: number;
  images?: string[];
  floor?: number;
  description?: string;
  isAvailableForDates?: boolean;
}

export type RoomCategory = Room;

export interface PriceBreakdown {
  basePricePerNight?: number;
  roomRateSubtotal?: number;
  discountPercent?: number;
  discountAmount?: number;
  taxRate?: number;
  taxAmount?: number;
  baseTariff: number;
  numberOfNights: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  resortFee: number;
  totalAmount: number;
  currency: string;
}

export interface Booking {
  id: string;
  bookingReference?: string;
  userId: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
  };
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelImage?: string;
  roomId: string;
  roomNumber?: string;
  roomName: string;
  roomCategory?: string;
  checkIn?: string;
  checkOut?: string;
  checkInDate: string;
  checkOutDate: string;
  nights?: number;
  numberOfGuests: number;
  guests?: { adults: number; children: number };
  numberOfRooms?: number;
  priceBreakdown: PriceBreakdown;
  totalAmount: number;
  status: 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  bookingStatus?: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: string;
  paymentProvider?: string;
  paymentReceipt?: string;
  upiId?: string;
  specialRequests: string;
  checkInTimestamp?: string | null;
  checkOutTimestamp?: string | null;
  createdAt: string;
}

export interface HousekeepingTask {
  id: string;
  hotelId: string;
  roomId: string;
  roomNumber: string;
  taskType: 'Turnover Clean' | 'Daily Refresh' | 'Deep Clean' | 'Inspection';
  priority: 'high' | 'standard' | 'low';
  status: 'Dirty' | 'Cleaning' | 'Inspected' | 'Ready';
  assignedStaffId: string | null;
  assignedStaffName: string;
  notes: string;
  createdAt: string;
  completedAt: string | null;
}

export interface ServiceRequest {
  id: string;
  hotelId: string;
  roomId: string;
  roomNumber: string;
  bookingId: string;
  guestId: string;
  guestName: string;
  category: 'Room Service' | 'Extra Amenities' | 'Luggage Assistance' | 'Maintenance Issue' | 'Concierge Booking';
  description: string;
  priority: 'urgent' | 'standard' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  bookingId: string;
  rating: number;
  title: string;
  comment: string;
  verifiedStay: boolean;
  createdAt: string;
}

export interface SystemStatus {
  success: boolean;
  system: string;
  version: string;
  environment: string;
  storageMode: string;
  mongoConfigured: boolean;
  metrics: {
    hotelsCount: number;
    roomsCount: number;
    bookingsCount: number;
    usersCount: number;
    activeHousekeeping: number;
  };
}
