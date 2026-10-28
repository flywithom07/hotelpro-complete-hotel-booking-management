import React, { useState } from 'react';
import { Booking, User } from '../types/hotel';
import { formatINR } from '../utils/bookingEngine';
import { 
  Calendar, MapPin, Users, Receipt, 
  Sparkles, ArrowUpRight, XCircle, CheckCircle2 
} from 'lucide-react';

interface GuestDashboardProps {
  user: User;
  bookings: Booking[];
  onOpenInvoice: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onExploreHotels: () => void;
}

export const GuestDashboard: React.FC<GuestDashboardProps> = ({
  user,
  bookings,
  onOpenInvoice,
  onCancelBooking,
  onExploreHotels,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [selectedServiceBooking, setSelectedServiceBooking] = useState<Booking | null>(null);
  const [requestedService, setRequestedService] = useState<string>('');
  const [serviceSuccessMsg, setServiceSuccessMsg] = useState<string | null>(null);

  const userBookings = bookings.filter((b) => 
    b.userId === user.id || b.guestDetails.email === user.email
  );

  const upcomingBookings = userBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'checked_in'
  );

  const completedBookings = userBookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayedBookings = activeTab === 'upcoming' 
    ? upcomingBookings 
    : activeTab === 'completed' 
    ? completedBookings 
    : userBookings;

  const handleRequestService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedService) return;
    setServiceSuccessMsg(`Service request for "${requestedService}" sent to ${selectedServiceBooking?.hotelName} Concierge!`);
    setTimeout(() => {
      setServiceSuccessMsg(null);
      setSelectedServiceBooking(null);
      setRequestedService('');
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              Namaste & Welcome
            </span>
            <span className="text-xs text-slate-400">Guest Folio & Concierge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Registered Mobile: <span className="font-semibold text-amber-300">{user.phone}</span> · {user.email}
          </p>
        </div>

        <button
          onClick={onExploreHotels}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg cursor-pointer"
        >
          <span>Book Another Sanctuary</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Upcoming Stays</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
            {upcomingBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Past & Cancelled</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {completedBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'all'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>All Reservations ({userBookings.length})</span>
        </button>
      </div>

      {/* Bookings List */}
      {displayedBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-serif font-bold text-slate-800">No Reservations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curated Indian sanctuaries across Udaipur, Goa, Manali, and Jaipur.
          </p>
          <button
            onClick={onExploreHotels}
            className="mt-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition"
          >
            Explore Sanctuaries
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayedBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    b.status === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : b.status === 'checked_in'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : b.status === 'cancelled'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {b.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-slate-500">ID: {b.id}</span>
                  <span className="text-xs text-slate-400">• Paid via {b.paymentMethod}</span>
                </div>

                <h3 className="text-lg font-serif font-bold text-slate-900">
                  {b.hotelName} — <span className="text-amber-800 font-sans font-medium text-base">{b.roomName}</span>
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {b.hotelCity}, India
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {b.checkInDate} → {b.checkOutDate} ({b.priceBreakdown.numberOfNights} Nights)
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {b.numberOfGuests} Guests
                  </span>
                </div>

                {b.specialRequests && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Special Request:</span> {b.specialRequests}
                  </p>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <div className="text-xs text-slate-500">Total Tax Folio (INR)</div>
                  <div className="text-xl font-bold font-serif text-slate-900">
                    {formatINR(b.totalAmount)}
                  </div>
                  <div className="text-[10px] text-emerald-700">Incl. 18% Indian GST</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenInvoice(b)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Receipt className="w-3.5 h-3.5 text-amber-700" />
                    <span>GST Folio</span>
                  </button>

                  {b.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => setSelectedServiceBooking(b)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Concierge Service</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Cancel reservation ${b.id}? Eligible refund will be processed to original payment method.`)) {
                            onCancelBooking(b.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Concierge Service Request Modal */}
      {selectedServiceBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Concierge & Indian Hospitality
                </h3>
                <p className="text-xs text-slate-500">For {selectedServiceBooking.hotelName}</p>
              </div>
              <button
                onClick={() => setSelectedServiceBooking(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {serviceSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{serviceSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleRequestService} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Curated Indian In-Room Service:
                  </label>
                  <div className="space-y-2">
                    {[
                      'Fresh Kadak Masala Chai & Rajasthani Pyaaz Kachori (₹350)',
                      'Ayurvedic Abhyanga Herbal Massage in Suite (₹4,500)',
                      'Private Sunset Shikara Boat Lake Cruise (Complimentary)',
                      'Fresh Handloom Diwan Bedding & Herbal Linen Set',
                      'Airport / Railway Station Chauffeured Sedan Pickup'
                    ].map((svc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRequestedService(svc)}
                        className={`w-full text-left text-xs p-2.5 rounded-xl border transition ${
                          requestedService === svc
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {svc}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!requestedService}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  Send Request to Front Desk
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
