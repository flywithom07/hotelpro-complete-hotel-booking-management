import React, { useState } from 'react';
import { Hotel, RoomCategory, Booking, User } from '../types/hotel';
import { calculatePriceBreakdown, formatINR, normalizeIndianPhone } from '../utils/bookingEngine';
import { 
  X, Calendar, Users, ShieldCheck, CreditCard, 
  Smartphone, Building2, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

interface BookingModalProps {
  hotel: Hotel;
  room: RoomCategory;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (bookingData: any) => Promise<void>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  hotel,
  room,
  user,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  // Dates default: tomorrow to 3 days later
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkoutDate = new Date();
  checkoutDate.setDate(checkoutDate.getDate() + 3);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(checkoutDate.toISOString().split('T')[0]);
  const [guestCount, setGuestCount] = useState(2);
  
  // Guest details (defaulting with Indian persona if logged in or Aarav Sharma)
  const [guestName, setGuestName] = useState(user?.name || 'Aarav Sharma');
  const [guestEmail, setGuestEmail] = useState(user?.email || 'aarav.sharma@example.com');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+91 98765 43210');
  const [specialRequests, setSpecialRequests] = useState('Complimentary airport / Shikara pickup and authentic Rajasthani welcome requested.');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | 'pay_at_hotel'>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const priceBreakdown = calculatePriceBreakdown(
    room.basePrice,
    checkIn,
    checkOut,
    guestCount,
    hotel.seasonalMultiplier || 1.0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const normalizedPhone = normalizeIndianPhone(guestPhone);
    if (!normalizedPhone) {
      setError('Please provide a valid 10-digit Indian mobile number prefixed with +91 (e.g., +91 98765 43210).');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirmBooking({
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelCity: hotel.city,
        roomId: room.id,
        roomName: room.name,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guestCount,
        guestDetails: {
          name: guestName,
          email: guestEmail,
          phone: normalizedPhone,
        },
        specialRequests,
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'razorpay' ? 'Razorpay' : 'Pay at Hotel',
        upiId: paymentMethod === 'upi' ? upiId : undefined,
        priceBreakdown,
        totalAmount: priceBreakdown.totalAmount,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Guaranteed Reservation · INR (₹)
              </span>
              <span className="text-xs text-slate-500">GST SAC: 996311</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
              Reserve {room.name}
            </h2>
            <p className="text-xs text-slate-600">
              {hotel.name} · {hotel.city}, India
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Stay & Guest Inputs */}
            <div className="lg:col-span-7 space-y-5">
              {/* Stay Dates */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" /> Stay Itinerary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Check-in Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Guests Traveling</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {[...Array(room.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'Adult Guest' : 'Adult Guests'} (Max {room.maxGuests})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Guest Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" /> Primary Indian Guest Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Full Name (As on ID)</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Mobile (+91 Indian Code)</label>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Email (For GST Tax Folio)</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="aarav.sharma@example.com"
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Hospitality Requests</label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g., Shikara transfer time, dietary preferences (Jain/Pure Veg), feather-free pillows..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" /> Indian Payment Channel
                </h3>
                
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      paymentMethod === 'upi'
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Smartphone className={`w-4 h-4 ${paymentMethod === 'upi' ? 'text-amber-700' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">0% Fee</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">UPI Instant</p>
                      <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      paymentMethod === 'razorpay'
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className={`w-4 h-4 ${paymentMethod === 'razorpay' ? 'text-amber-700' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-semibold text-slate-500">Gateway</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">Razorpay</p>
                      <p className="text-[10px] text-slate-500">Credit/Debit, NetBanking</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pay_at_hotel')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      paymentMethod === 'pay_at_hotel'
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Building2 className={`w-4 h-4 ${paymentMethod === 'pay_at_hotel' ? 'text-amber-700' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-semibold text-slate-500">Flexible</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold text-slate-900">Pay at Hotel</p>
                      <p className="text-[10px] text-slate-500">Front Desk Check-in</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1.5 animate-in fade-in">
                    <label className="block text-[11px] font-medium text-slate-700">Virtual Payment Address (VPA / UPI ID)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="flex-1 text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Instant Verify
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Supports BHIM, Google Pay, PhonePe, Paytm, CRED & all Indian bank VPAs.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 cols: Indian Tariff & GST Breakdown Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-5 border border-amber-500/20">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    Tariff Summary (INR ₹)
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white mt-0.5">
                    {room.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {priceBreakdown.numberOfNights} Nights · {guestCount} Guests
                  </p>
                </div>

                {/* Detailed Tax Itemization */}
                <div className="space-y-2.5 text-xs border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Tariff ({formatINR(room.basePrice)} × {priceBreakdown.numberOfNights}n):</span>
                    <span className="font-semibold text-white">{formatINR(priceBreakdown.baseTariff)}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Indian Resort & Heritage Amenity Fee:</span>
                    <span className="font-semibold text-white">{formatINR(priceBreakdown.resortFee)}</span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px] pl-2 border-l border-amber-500/30">
                    <span>CGST (Central GST @ 9%):</span>
                    <span>{formatINR(priceBreakdown.cgstAmount)}</span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px] pl-2 border-l border-amber-500/30">
                    <span>SGST (State GST @ 9%):</span>
                    <span>{formatINR(priceBreakdown.sgstAmount)}</span>
                  </div>

                  <div className="flex justify-between text-amber-300/90 text-xs font-medium">
                    <span>Total Statutory GST (18% SAC 996311):</span>
                    <span>{formatINR(priceBreakdown.gstAmount)}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Grand Total (Net INR)</p>
                      <p className="text-[10px] text-emerald-400">Inclusive of all Indian Central & State Taxes</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold font-serif text-amber-400">
                        {formatINR(priceBreakdown.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guarantee Banner */}
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-[11px] text-slate-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Full Free Cancellation:</span> Up to 48 hours prior to check-in. Instant refund credited via original UPI / Bank mode within 2 hours.
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  {isSubmitting ? 'Confirming Indian Reservation...' : `Confirm & Pay ${formatINR(priceBreakdown.totalAmount)}`}
                </button>
                <p className="text-[10px] text-center text-slate-500">
                  By confirming, you agree to HotelPro India Terms and local hotel check-in policies.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
