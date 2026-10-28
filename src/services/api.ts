/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Hotel, Room, Booking, HousekeepingTask, ServiceRequest, Review, User, SystemStatus } from '../types/hotel.ts';
import { UserRole } from '../utils/bookingEngine.ts';

const TOKEN_KEY = 'hotelpro_auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // System Status
  getSystemStatus: () => apiRequest<SystemStatus>('/api/system/status'),

  // Auth
  login: (email: string, password: string) =>
    apiRequest<{ success: boolean; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (name: string, email: string, password: string, phone?: string) =>
    apiRequest<{ success: boolean; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    }),

  quickSwitch: (role: UserRole) =>
    apiRequest<{ success: boolean; token: string; user: User }>('/api/auth/quick-switch', {
      method: 'POST',
      body: JSON.stringify({ role })
    }),

  getMe: () => apiRequest<{ success: boolean; user: User }>('/api/auth/me'),

  // Hotels
  getHotels: (params?: { destination?: string; minStar?: number; amenity?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.destination) query.append('destination', params.destination);
    if (params?.minStar) query.append('minStar', params.minStar.toString());
    if (params?.amenity) query.append('amenity', params.amenity);
    if (params?.sort) query.append('sort', params.sort);
    return apiRequest<{ success: boolean; count: number; hotels: Hotel[] }>(`/api/hotels?${query.toString()}`);
  },

  getHotelById: (id: string) => apiRequest<{ success: boolean; hotel: Hotel }>(`/api/hotels/${id}`),

  createHotel: (hotelData: Partial<Hotel>) =>
    apiRequest<{ success: boolean; hotel: Hotel }>('/api/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData)
    }),

  // Rooms & Availability
  getRoomsByHotel: (hotelId: string, params?: { checkIn?: string; checkOut?: string; adults?: number }) => {
    const query = new URLSearchParams();
    if (params?.checkIn) query.append('checkIn', params.checkIn);
    if (params?.checkOut) query.append('checkOut', params.checkOut);
    if (params?.adults) query.append('adults', params.adults.toString());
    return apiRequest<{ success: boolean; rooms: Room[] }>(`/api/rooms/hotel/${hotelId}?${query.toString()}`);
  },

  createRoom: (roomData: Partial<Room>) =>
    apiRequest<{ success: boolean; room: Room }>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData)
    }),

  updateRoomStatus: (roomId: string, operationalStatus: Room['operationalStatus']) =>
    apiRequest<{ success: boolean; room: Room }>(`/api/rooms/${roomId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ operationalStatus })
    }),

  // Bookings
  createBooking: (data: {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number };
    specialRequests?: string;
    paymentProvider?: string;
  }) =>
    apiRequest<{ success: boolean; message: string; booking: Booking }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getMyBookings: () => apiRequest<{ success: boolean; count: number; bookings: Booking[] }>('/api/bookings/my'),

  getHotelBookings: (hotelId: string) =>
    apiRequest<{ success: boolean; count: number; bookings: Booking[] }>(`/api/bookings/hotel/${hotelId}`),

  cancelBooking: (bookingId: string) =>
    apiRequest<{ success: boolean; message: string; booking: Booking }>(`/api/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    }),

  // Check-In & Check-Out
  checkIn: (bookingId: string) =>
    apiRequest<{ success: boolean; message: string; booking: Booking; room: Room }>(`/api/check-in/${bookingId}`, {
      method: 'POST'
    }),

  checkOut: (bookingId: string) =>
    apiRequest<{
      success: boolean;
      message: string;
      booking: Booking;
      room: Room;
      housekeepingTask: HousekeepingTask;
    }>(`/api/check-out/${bookingId}`, {
      method: 'POST'
    }),

  // Housekeeping
  getHousekeepingTasks: (hotelId: string) =>
    apiRequest<{ success: boolean; count: number; tasks: HousekeepingTask[] }>(`/api/housekeeping/hotel/${hotelId}`),

  updateHousekeepingStatus: (taskId: string, status: HousekeepingTask['status'], notes?: string) =>
    apiRequest<{ success: boolean; message: string; task: HousekeepingTask; room?: Room }>(
      `/api/housekeeping/${taskId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status, notes })
      }
    ),

  // Services
  getServiceRequests: (hotelId: string) =>
    apiRequest<{ success: boolean; count: number; requests: ServiceRequest[] }>(`/api/services/hotel/${hotelId}`),

  createServiceRequest: (data: {
    hotelId: string;
    roomNumber: string;
    category: ServiceRequest['category'];
    description: string;
    priority?: ServiceRequest['priority'];
  }) =>
    apiRequest<{ success: boolean; message: string; request: ServiceRequest }>('/api/services', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) =>
    apiRequest<{ success: boolean; message: string; request: ServiceRequest }>(`/api/services/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  // Reviews
  getHotelReviews: (hotelId: string) =>
    apiRequest<{ success: boolean; reviews: Review[] }>(`/api/reviews/hotel/${hotelId}`),

  createReview: (data: { hotelId: string; rating: number; title: string; comment: string }) =>
    apiRequest<{ success: boolean; message: string; review: Review }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Manager & Admin Dashboards
  getManagerOverview: (hotelId: string) =>
    apiRequest<{
      success: boolean;
      hotel: { id: string; name: string; city: string };
      kpis: {
        totalRooms: number;
        occupiedRooms: number;
        cleaningRooms: number;
        availableRooms: number;
        occupancyRate: number;
        totalRevenue: number;
        adr: number;
        revpar: number;
        totalBookings: number;
      };
      monthlyRevenue: Array<{ month: string; revenue: number; occupancy: number }>;
    }>(`/api/manager/overview/${hotelId}`),

  getAdminOverview: () =>
    apiRequest<{
      success: boolean;
      platformKPIs: {
        totalHotels: number;
        totalRooms: number;
        totalBookings: number;
        totalUsers: number;
        grossPlatformVolume: number;
        activeStays: number;
      };
      hotels: Hotel[];
      users: User[];
      recentBookings: Booking[];
      logs: Array<{
        id: string;
        actorName: string;
        actorRole: string;
        action: string;
        targetEntity: string;
        details: string;
        createdAt: string;
      }>;
    }>('/api/admin/overview'),

  updateUserRole: (userId: string, role: UserRole, assignedHotelId?: string) =>
    apiRequest<{ success: boolean; message: string; user: User }>(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role, assignedHotelId })
    }),

  updateUserStatus: (userId: string, accountStatus: 'active' | 'suspended') =>
    apiRequest<{ success: boolean; message: string; user: User }>(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ accountStatus })
    })
};
