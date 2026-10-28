/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken, clearStoredToken } from './services/api.ts';
import { Hotel, Room, Booking, User, SystemStatus } from './types/hotel.ts';
import { UserRole } from './utils/bookingEngine.ts';
import { Header } from './components/Header.tsx';
import { HotelSearch } from './components/HotelSearch.tsx';
import { HotelCard } from './components/HotelCard.tsx';
import { HotelDetailModal } from './components/HotelDetailModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { InvoiceModal } from './components/InvoiceModal.tsx';
import { GuestDashboard } from './components/GuestDashboard.tsx';
import { StaffDashboard } from './components/StaffDashboard.tsx';
import { ManagerDashboard } from './components/ManagerDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Compass,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Hotel as HotelIcon,
  IndianRupee,
  Phone
} from 'lucide-react';

// Seed Indian users for client state
const INITIAL_USERS: User[] = [
  {
    id: 'user-guest-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'guest',
    phone: '+91 98765 43210',
    accountStatus: 'active',
    assignedHotelId: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-manager-1',
    name: 'Vikramaditya Rao',
    email: 'vikram.manager@hotelpro.in',
    role: 'manager',
    phone: '+91 98765 43211',
    accountStatus: 'active',
    assignedHotelId: 'hotel-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-staff-1',
    name: 'Priya Patel',
    email: 'priya.staff@hotelpro.in',
    role: 'staff',
    phone: '+91 98765 43212',
    accountStatus: 'active',
    assignedHotelId: 'hotel-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-admin-1',
    name: 'Rajesh Verma',
    email: 'rajesh.admin@hotelpro.in',
    role: 'admin',
    phone: '+91 98765 43213',
    accountStatus: 'active',
    assignedHotelId: null,
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [activeTab, setActiveTab] = useState<'catalog' | 'guest' | 'staff' | 'manager' | 'admin'>('catalog');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Search parameters
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('2026-11-01');
  const [checkOut, setCheckOut] = useState('2026-11-05');
  const [guests, setGuests] = useState(2);
  const [selectedAmenity, setSelectedAmenity] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  // Modals
  const [selectedHotelForDetail, setSelectedHotelForDetail] = useState<Hotel | null>(null);
  const [bookingHotelRoom, setBookingHotelRoom] = useState<{ hotel: Hotel; room: Room } | null>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Toast Notification
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // 1. Fetch System Status
      try {
        const statusRes = await api.getSystemStatus();
        setSystemStatus(statusRes);
      } catch (e) {
        console.warn('System status API not available, using in-memory state');
      }

      // 2. Auth State
      const token = getStoredToken();
      if (token) {
        try {
          const meRes = await api.getMe();
          setCurrentUser(meRes.user);
          setCurrentRole(meRes.user.role);
        } catch {
          clearStoredToken();
          await handleQuickSwitchRole('guest');
        }
      } else {
        await handleQuickSwitchRole('guest');
      }

      // 3. Load Hotels
      await loadHotels();

      // 4. Load Bookings (Initial Indian Bookings)
      const initialBookings: Booking[] = [
        {
          id: 'HP-IND-2026-001',
          bookingReference: 'HP-IND-2026-001',
          userId: 'user-guest-1',
          guestDetails: {
            name: 'Aarav Sharma',
            email: 'aarav.sharma@example.com',
            phone: '+91 98765 43210'
          },
          hotelId: 'hotel-1',
          hotelName: 'The Grand Lake Palace & Royal Heritage Sanctuary',
          hotelCity: 'Udaipur',
          roomId: 'room-101',
          roomName: 'Royal Lake View Suite',
          checkInDate: '2026-11-01',
          checkOutDate: '2026-11-03',
          numberOfGuests: 2,
          priceBreakdown: {
            baseTariff: 49000,
            numberOfNights: 2,
            resortFee: 1500,
            cgstAmount: 4545,
            sgstAmount: 4545,
            gstAmount: 9090,
            totalAmount: 59590,
            currency: 'INR'
          },
          totalAmount: 59590,
          status: 'confirmed',
          paymentMethod: 'UPI (aarav@okhdfcbank)',
          specialRequests: 'Complimentary Shikara lake transfer at 2:30 PM and evening Mewari flute performance view requested.',
          createdAt: new Date().toISOString()
        }
      ];
      setBookings(initialBookings);
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHotels = async () => {
    try {
      const res = await api.getHotels({
        destination,
        amenity: selectedAmenity,
        sort: sortBy
      });
      // Ensure startingPrice and roomCategories fields are populated
      const mappedHotels = res.hotels.map((h: any) => {
        const rooms = h.rooms || [];
        const minPrice = rooms.length > 0 
          ? Math.min(...rooms.map((r: any) => r.basePrice)) 
          : h.startingPrice || 16500;
        return {
          ...h,
          startingPrice: minPrice,
          rating: h.reviewAverage || 4.9,
          totalReviews: h.reviewCount || 120,
          roomCategories: rooms.map((r: any) => ({
            ...r,
            name: r.category || r.name,
            maxGuests: r.capacity?.adults || 2,
            availableCount: (r.operationalStatus === 'Occupied' || r.operationalStatus === 'Maintenance') ? 0 : 3,
            description: `${r.bedType} bed with ${r.amenities?.slice(0, 3).join(', ')}. Quoted in INR with full statutory GST.`
          }))
        };
      });
      setHotels(mappedHotels);
    } catch (err) {
      console.error('Failed to load hotels from API:', err);
    }
  };

  const handleQuickSwitchRole = async (role: UserRole) => {
    try {
      const res = await api.quickSwitch(role);
      setStoredToken(res.token);
      setCurrentUser(res.user);
      setCurrentRole(role);
      setNotification(`Switched role to ${role.toUpperCase()}: ${res.user.name} (${res.user.phone})`);

      // Auto-navigate to appropriate role dashboard
      if (role === 'guest') setActiveTab('catalog');
      else if (role === 'staff') setActiveTab('staff');
      else if (role === 'manager') setActiveTab('manager');
      else if (role === 'admin') setActiveTab('admin');
    } catch (err) {
      // Fallback to local Indian persona switch
      const found = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
      setCurrentUser(found);
      setCurrentRole(role);
      setNotification(`Switched to demo persona: ${found.name} (${found.role.toUpperCase()})`);
      if (role === 'guest') setActiveTab('catalog');
      else if (role === 'staff') setActiveTab('staff');
      else if (role === 'manager') setActiveTab('manager');
      else if (role === 'admin') setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setCurrentUser(null);
    setCurrentRole('guest');
    setActiveTab('catalog');
    setNotification('Signed out. Switched to public guest mode.');
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((current) => (current === msg ? null : current));
    }, 4500);
  };

  const handleConfirmBooking = async (bookingData: any) => {
    const newBookingId = `HP-IND-${Date.now().toString().slice(-6)}`;
    const newBooking: Booking = {
      id: newBookingId,
      bookingReference: newBookingId,
      userId: currentUser?.id || 'user-guest-1',
      guestDetails: {
        name: bookingData.guestDetails.name,
        email: bookingData.guestDetails.email,
        phone: bookingData.guestDetails.phone
      },
      hotelId: bookingData.hotelId,
      hotelName: bookingData.hotelName,
      hotelCity: bookingData.hotelCity,
      roomId: bookingData.roomId,
      roomName: bookingData.roomName,
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
      numberOfGuests: bookingData.numberOfGuests,
      priceBreakdown: bookingData.priceBreakdown,
      totalAmount: bookingData.totalAmount,
      status: 'confirmed',
      paymentMethod: bookingData.paymentMethod,
      upiId: bookingData.upiId,
      specialRequests: bookingData.specialRequests,
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [newBooking, ...prev]);
    setBookingHotelRoom(null);
    triggerToast(`Booking confirmed! Reference #${newBookingId}. Official GST Tax Folio ready.`);
    setInvoiceBooking(newBooking);
  };

  const handleCancelBooking = async (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    triggerToast(`Reservation ${bookingId} cancelled. Refund of 100% initiated to original payment source.`);
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    triggerToast(`Guest reservation #${bookingId} updated to ${status.replace('_', ' ').toUpperCase()}`);
  };

  const handleUpdateRoomPrice = (roomId: string, newPrice: number) => {
    setHotels((prevHotels) =>
      prevHotels.map((h) => ({
        ...h,
        roomCategories: h.roomCategories?.map((r) =>
          r.id === roomId ? { ...r, basePrice: newPrice } : r
        )
      }))
    );
    triggerToast(`Updated suite tariff to ₹${newPrice.toLocaleString('en-IN')}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Global Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onQuickSwitchRole={handleQuickSwitchRole}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        storageMode={systemStatus?.storageMode || 'In-Memory Store Active'}
      />

      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 no-print">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{notification}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'catalog' ? (
          <div>
            {/* Hero Section */}
            <section className="relative bg-slate-950 text-white overflow-hidden pb-16">
              {/* Cinematic Background Backdrop */}
              <div className="absolute inset-0 z-0 opacity-45">
                <img
                  src="/src/assets/images/udaipur_lake_palace_resort_1793110692210.jpg"
                  alt="Udaipur Lake Palace Sanctuary"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter saturate-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-8 space-y-6">
                <div className="max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Indian Luxury Sanctuaries · Quoted in INR (₹)
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-bold font-serif tracking-tight text-white leading-[1.1] text-balance">
                    India’s Finest Heritage & Coastal Sanctuaries.
                  </h1>

                  <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                    Royal Mewari palaces in Udaipur, Arabian Sea beach villas in Goa, and tranquil Himalayan cedar retreats in Manali. Quoted in Indian Rupees (₹) with statutory 18% GST (9% CGST + 9% SGST), instant UPI verification, and compliant tax folios.
                  </p>
                </div>

                {/* Search Bar Widget */}
                <HotelSearch
                  destination={destination}
                  setDestination={setDestination}
                  checkIn={checkIn}
                  setCheckIn={setCheckIn}
                  checkOut={checkOut}
                  setCheckOut={setCheckOut}
                  guests={guests}
                  setGuests={setGuests}
                  selectedAmenity={selectedAmenity}
                  setSelectedAmenity={setSelectedAmenity}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onSearch={loadHotels}
                />
              </div>
            </section>

            {/* Featured Properties Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
                    Premier Indian Hospitality Portfolio
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-0.5">
                    Featured 5-Star Sanctuaries
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Showing verified Indian luxury residences across Rajasthan, Goa, and Himachal Pradesh.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center text-slate-400 text-sm">Loading Indian hotel sanctuaries...</div>
              ) : hotels.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                  <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-slate-800">No properties matched your criteria</h3>
                  <p className="text-xs text-slate-500 mt-1">Try searching for Udaipur, Goa, or Manali.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onSelect={(h) => setSelectedHotelForDetail(h)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Regional Inclusions & Hospitality Craft Showcase */}
            <section className="bg-white border-y border-slate-200/80 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
                    The HotelPro India Standard
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                    Bespoke Indian Hospitality & Statutory Architecture
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Designed for discerning travelers across India, GM revenue operations, and Ministry of Tourism statutory compliances.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-serif text-slate-900">18% GST & Instant UPI Settlement</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Complies with Indian SAC Code 996311 (9% CGST + 9% SGST). Zero-fee instantaneous settlements via Google Pay, PhonePe, and BHIM VPAs.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-serif text-slate-900">Aadhaar & Photo ID Compliance</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Statutory guest verification at front desk check-in with government-approved Indian photo IDs and digital guest register archiving.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-serif text-slate-900">Authentic Indian Regional Services</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Curated experiences including Masala Chai & Pyaaz Kachori, private Lake Pichola Shikara sunset rides, and Ayurvedic Abhyanga therapies.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Role Specific Dashboards Container */
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            {activeTab === 'guest' && currentUser && (
              <GuestDashboard
                user={currentUser}
                bookings={bookings}
                onOpenInvoice={(bkg) => setInvoiceBooking(bkg)}
                onCancelBooking={handleCancelBooking}
                onExploreHotels={() => setActiveTab('catalog')}
              />
            )}

            {activeTab === 'staff' && currentUser && hotels[0] && (
              <StaffDashboard
                user={currentUser}
                hotel={hotels[0]}
                bookings={bookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
              />
            )}

            {activeTab === 'manager' && currentUser && hotels[0] && (
              <ManagerDashboard
                user={currentUser}
                hotel={hotels[0]}
                bookings={bookings}
                onUpdateRoomPrice={handleUpdateRoomPrice}
              />
            )}

            {activeTab === 'admin' && currentUser && (
              <AdminDashboard
                user={currentUser}
                users={users}
                hotels={hotels}
                bookings={bookings}
              />
            )}
          </div>
        )}
      </main>

      {/* Hotel Detail Modal */}
      {selectedHotelForDetail && (
        <HotelDetailModal
          hotel={selectedHotelForDetail}
          isOpen={true}
          onClose={() => setSelectedHotelForDetail(null)}
          onSelectRoom={(room) => {
            setBookingHotelRoom({ hotel: selectedHotelForDetail, room });
            setSelectedHotelForDetail(null);
          }}
        />
      )}

      {/* Booking Checkout Modal */}
      {bookingHotelRoom && (
        <BookingModal
          hotel={bookingHotelRoom.hotel}
          room={bookingHotelRoom.room}
          user={currentUser}
          isOpen={true}
          onClose={() => setBookingHotelRoom(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Printable GST Folio Invoice Modal */}
      {invoiceBooking && (
        <InvoiceModal
          booking={invoiceBooking}
          isOpen={true}
          onClose={() => setInvoiceBooking(null)}
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={async (creds) => {
            const res = await api.login(creds.email, creds.password);
            setStoredToken(res.token);
            setCurrentUser(res.user);
            setCurrentRole(res.user.role);
            triggerToast(`Welcome back, ${res.user.name}`);
          }}
          onRegister={async (regData) => {
            const res = await api.register(regData.name, regData.email, regData.password, regData.phone);
            setStoredToken(res.token);
            setCurrentUser(res.user);
            setCurrentRole(res.user.role);
            triggerToast(`Account created for ${res.user.name}`);
          }}
          onQuickSwitchRole={(role: string) => handleQuickSwitchRole(role as UserRole)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <HotelIcon className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-xl font-bold font-serif text-white tracking-tight">HotelPro India</span>
                <span className="text-xs text-amber-400 font-mono block -mt-1 font-semibold">
                  MERN Hospitality Architecture · Rupee (INR ₹) Edition
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>National Toll-Free Helpline: 1800-209-4683 (24x7 IST)</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 HotelPro India Hospitality Suite. All rights reserved. GSTIN: 08AAACH1234F1Z5 · SAC: 996311</p>
            <div className="flex items-center gap-4 text-xs">
              <span>UPI & Razorpay Supported</span>
              <span>·</span>
              <span>18% GST Compliant</span>
              <span>·</span>
              <span>Ministry of Tourism Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
