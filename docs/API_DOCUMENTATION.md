# HotelPro REST API Documentation

This document provides a reference for all implemented REST API endpoints in the HotelPro MERN stack hospitality management system.

## Base URL
- Local Dev Server: `http://localhost:3000/api`
- Authentication Header: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. System Health & Environment

### `GET /api/system/status`
Returns live platform health, current storage mode (Embedded Store vs MongoDB Atlas URI), and global metrics.

**Response (200 OK):**
```json
{
  "success": true,
  "system": "HotelPro Hospitality Management System",
  "version": "1.0.0-academic",
  "environment": "development",
  "storageMode": "High-Fidelity In-Memory Store (Active)",
  "mongoConfigured": false,
  "metrics": {
    "hotelsCount": 3,
    "roomsCount": 7,
    "bookingsCount": 2,
    "usersCount": 4,
    "activeHousekeeping": 1
  }
}
```

---

## 2. Authentication & User Management

### `POST /api/auth/register`
Registers a new guest account. Public registration is strictly scoped to the `guest` role.

**Request Body:**
```json
{
  "name": "Elena Rostova",
  "email": "guest@hotelpro.io",
  "password": "HotelPro@2026",
  "phone": "+1 (555) 234-5678"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-guest-1",
    "name": "Elena Rostova",
    "email": "guest@hotelpro.io",
    "role": "guest",
    "accountStatus": "active"
  }
}
```

### `POST /api/auth/login`
Authenticates a user using bcrypt password verification and returns a 7-day signed JWT token.

**Request Body:**
```json
{
  "email": "manager@hotelpro.io",
  "password": "HotelPro@2026"
}
```

### `POST /api/auth/quick-switch`
Facilitates 1-click test role demonstration during live portfolios and grading reviews.

**Request Body:**
```json
{
  "role": "staff"
}
```

### `GET /api/auth/me`
Retrieves current profile using Bearer JWT.

---

## 3. Hotel Management

### `GET /api/hotels`
Lists all hotels with destination text query, star rating filter, amenity filter, and sorting.

**Query Parameters:**
- `destination`: string (e.g. "Malibu", "New York")
- `minStar`: number (1-5)
- `amenity`: string (e.g. "Infinity Pool")
- `sort`: "rating" | "reviews" | "recommended"

### `GET /api/hotels/:id`
Retrieves a specific property along with room inventory and verified guest reviews.

### `POST /api/hotels` (Super Admin Only)
Provisions a new hotel property.

---

## 4. Room Inventory & Availability Engine

### `GET /api/rooms/hotel/:hotelId`
Retrieves rooms for a property. When `checkIn` and `checkOut` dates are provided, calculates atomic overlap against confirmed bookings to determine `isAvailableForDates`.

**Query Parameters:**
- `checkIn`: "YYYY-MM-DD"
- `checkOut`: "YYYY-MM-DD"
- `adults`: number

### `POST /api/rooms` (Manager or Super Admin)
Adds a new room key to property inventory.

### `PUT /api/rooms/:id/status` (Staff, Manager, Super Admin)
Updates room operational status: `Available`, `Occupied`, `Cleaning`, or `Maintenance`.

---

## 5. Booking Workflows & Payments

### `POST /api/bookings` (Authenticated)
Creates a reservation. Revalidates availability at submission time to prevent concurrent double-booking. Calculates nights, 12% occupancy tax, resort fees, and grand total on the server.

**Request Body:**
```json
{
  "hotelId": "hotel-1",
  "roomId": "room-101",
  "checkIn": "2026-11-01",
  "checkOut": "2026-11-05",
  "guests": { "adults": 2, "children": 0 },
  "specialRequests": "Ocean view balcony preference.",
  "paymentProvider": "demo_card"
}
```

### `GET /api/bookings/my` (Authenticated)
Retrieves booking history and tax invoices for the logged-in guest.

### `PUT /api/bookings/:id/cancel` (Owner or Admin)
Cancels an un-checked-in booking and sets payment status to `refunded`.

---

## 6. Front Desk Operations: Check-In & Check-Out

### `POST /api/check-in/:bookingId` (Staff, Manager, Admin)
Verifies guest arrival, sets `bookingStatus` to `checked_in`, records timestamp, and sets room status to `Occupied`.

### `POST /api/check-out/:bookingId` (Staff, Manager, Admin)
Finalizes departure, sets `bookingStatus` to `checked_out`, sets room status to `Cleaning`, and automatically generates a high-priority turnover housekeeping task.

---

## 7. Housekeeping Operations

### `GET /api/housekeeping/hotel/:hotelId`
Lists housekeeping tasks by property.

### `PUT /api/housekeeping/:taskId/status`
Advances task through lifecycle: `Dirty` -> `Cleaning` -> `Inspected` -> `Ready`. Setting to `Ready` automatically transitions room operational status back to `Available`.

---

## 8. Guest Service Requests

### `POST /api/services`
Submits in-room service request (Room Service, Extra Amenities, Luggage Assistance, Maintenance).

### `PUT /api/services/:id/status`
Updates request status (`pending`, `in_progress`, `completed`).

---

## 9. Reviews

### `GET /api/reviews/hotel/:hotelId`
Retrieves verified reviews for a property.

### `POST /api/reviews`
Submits a verified stay review and recalculates the hotel's star rating average.

---

## 10. Manager & Admin Analytics

### `GET /api/manager/overview/:hotelId`
Calculates real-time hospitality metrics:
- Total Revenue
- Occupancy Rate %
- Average Daily Rate (ADR)
- Revenue Per Available Room (RevPAR)
- Monthly trend data for Recharts

### `GET /api/admin/overview`
Platform-wide telemetry, user management, and audit log stream.

### `PUT /api/admin/users/:id/role`
Promotes or demotes user role (`guest`, `staff`, `manager`, `superadmin`).

### `PUT /api/admin/users/:id/status`
Suspends or activates platform user accounts.
