import React, { useState } from 'react';
import { Hotel, RoomCategory } from '../types/hotel';
import { 
  X, MapPin, Star, ShieldCheck, Wifi, Utensils, Waves, 
  Sparkles, Coffee, ArrowRight, CheckCircle2,
  Users, Info
} from 'lucide-react';

interface HotelDetailModalProps {
  hotel: Hotel;
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (room: RoomCategory) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Free High-Speed Wi-Fi': <Wifi className="w-4 h-4 text-emerald-600" />,
  'Private Lake Jharokhas': <Waves className="w-4 h-4 text-amber-600" />,
  'Heritage Mewari Dining': <Utensils className="w-4 h-4 text-rose-600" />,
  'Ayurvedic Royal Spa': <Sparkles className="w-4 h-4 text-purple-600" />,
  'Shikara Lake Transfers': <Waves className="w-4 h-4 text-sky-600" />,
  'Infinity Marble Pool': <Waves className="w-4 h-4 text-blue-600" />,
  'Private Arabian Sea Beach Access': <Waves className="w-4 h-4 text-amber-600" />,
  'Goan & Portuguese Fine Dining': <Utensils className="w-4 h-4 text-orange-600" />,
  'Sunset Beachfront Cabanas': <Coffee className="w-4 h-4 text-amber-700" />,
  'Heated Cedarwood Alpine Pool': <Waves className="w-4 h-4 text-cyan-600" />,
  'Himalayan Pine Forest Trails': <Sparkles className="w-4 h-4 text-emerald-600" />,
  'Stone Hearth Fireplace Lounges': <Coffee className="w-4 h-4 text-amber-800" />,
};

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  isOpen,
  onClose,
  onSelectRoom,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const defaultSuites = [
    {
      id: 'room-101',
      name: 'Royal Lake View Suite',
      hotelId: hotel.id,
      category: 'Royal Lake View Suite',
      basePrice: 24500,
      maxGuests: 2,
      bedType: 'Imperial King Bed',
      availableCount: 3,
      amenities: ['Lake Pichola Jharokha', 'Carved Marble Soaking Tub', 'Pashmina Bedspreads', 'Shikara Chauffeur'],
      description: 'Panoramic views of Lake Pichola and Aravali mountain range with private morning tea service.'
    },
    {
      id: 'room-201',
      name: 'Mewar Grand Presidential Suite',
      hotelId: hotel.id,
      category: 'Mewar Grand Presidential Suite',
      basePrice: 62000,
      maxGuests: 4,
      bedType: 'Maharaja King & Twin Queens',
      availableCount: 1,
      amenities: ['360° Lake Balcony', 'Gold-leaf Ceilings', 'Personal Khansama Butler', 'Private Heated Jacuzzi'],
      description: 'The pinnacle of Rajasthani royalty featuring hand-carved pillars and private butler dining.'
    },
    {
      id: 'room-102',
      name: 'Deluxe Heritage Courtyard Room',
      hotelId: hotel.id,
      category: 'Deluxe Heritage Courtyard Room',
      basePrice: 16500,
      maxGuests: 2,
      bedType: 'Heritage King Bed',
      availableCount: 2,
      amenities: ['Courtyard Garden View', 'Italian Marble Shower', 'Herbal Minibar', 'Artisan Work Desk'],
      description: 'Serene garden facing suite adorned with authentic Mewari frescoes and handcrafted teakwood furnishings.'
    }
  ];

  const rawSuites = (hotel.roomCategories && hotel.roomCategories.length > 0)
    ? hotel.roomCategories
    : (hotel.rooms && hotel.rooms.length > 0)
    ? hotel.rooms
    : defaultSuites;

  const suites = rawSuites.map((r, idx) => ({
    ...r,
    id: r.id || `suite-${idx + 1}`,
    name: r.name || r.category || `Luxury Heritage Suite ${idx + 1}`,
    category: r.category || 'Luxury Heritage Suite',
    basePrice: r.basePrice || (hotel.startingPrice || 16500) + idx * 8000,
    maxGuests: r.maxGuests || r.capacity?.adults || 2,
    bedType: r.bedType || 'Imperial King Bed',
    availableCount: (r.availableCount && r.availableCount > 0) ? r.availableCount : (3 - (idx % 2)),
    amenities: (r.amenities && r.amenities.length > 0)
      ? r.amenities
      : ['Lake Pichola Views', 'Carved Marble Soaking Tub', 'Pashmina Bedspreads'],
    description: r.description || `${r.bedType || 'Imperial King'} with signature luxury amenities and 18% GST.`
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-amber-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                Luxury Indian Sanctuary
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ministry of Tourism Approved
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
              {hotel.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Gallery View */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              <img
                src={hotel.images[activeImageIndex] || hotel.images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-4 rounded-xl text-white">
                <div>
                  <div className="flex items-center gap-2 text-sm text-amber-200">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.address}, {hotel.city}, India</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    GSTIN: 08AAACH1234F1Z5 · SAC Code: 996311 (Luxury Accommodation)
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-sm shadow-md">
                  <Star className="w-4 h-4 fill-slate-950" />
                  <span>{(hotel.rating ?? 4.9).toFixed(1)}</span>
                  <span className="text-xs font-normal opacity-80">({hotel.totalReviews ?? 120} verified reviews)</span>
                </div>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {hotel.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-400/40 scale-102' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Description & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-serif font-bold text-slate-900 border-b pb-2 border-slate-100">
                About The Sanctuary
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {hotel.description}
              </p>
              
              {/* Regional Highlights */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex gap-3 items-start">
                <Info className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-semibold text-amber-950">Indian Hospitality & Statutory Compliances:</p>
                  <p>• Check-in requires government-issued Indian photo ID (Aadhaar Card, Passport, Voter ID, or Driving License).</p>
                  <p>• Room tariffs are subject to 18% Indian Hospitality Goods and Services Tax (9% CGST + 9% SGST).</p>
                  <p>• Standard check-in is 2:00 PM IST and check-out is 11:00 AM IST. Complimentary Shikara / airport chauffeured pickup can be scheduled via Guest Concierge.</p>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="pt-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-700 mb-3">
                  Signature Amenities & Curated Services
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700 hover:bg-amber-50/50 hover:border-amber-200 transition"
                    >
                      {amenityIcons[amenity] || <Sparkles className="w-4 h-4 text-amber-600" />}
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Facts Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 self-start">
              <h4 className="text-sm font-serif font-bold text-slate-900 border-b border-slate-200 pb-2">
                Sanctuary Information
              </h4>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-semibold text-slate-800">{hotel.city}, India</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Starting From:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{(hotel.startingPrice || 16500).toLocaleString('en-IN')}<span className="text-slate-500 font-normal text-xs">/night</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Concierge Desk:</span>
                  <span className="font-semibold text-slate-800">+91 294 242 8800</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Available Suites:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {suites.reduce((acc, cat) => acc + (cat.availableCount || 0), 0)} Units Ready
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Modes:</span>
                  <span className="font-semibold text-slate-700">UPI, Cards, NetBanking</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Instant Reservation Confirmation with Official GST Folio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Room Categories & Suites */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  Available Heritage Suites & Rooms
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a category to reserve with instant UPI or Card confirmation
                </p>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                All prices quoted in Indian Rupees (INR ₹) plus 18% GST
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suites.map((room) => {
                const isAvail = (room.availableCount ?? 1) > 0;
                return (
                  <div
                    key={room.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-4.5 hover:border-amber-400 hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 group-hover:text-amber-800 transition">
                            {room.name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" /> Max {room.maxGuests || 2} Guests
                            </span>
                            <span>•</span>
                            <span>{room.bedType}</span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isAvail
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isAvail ? `${room.availableCount ?? 1} Available` : 'Sold Out'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {room.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {room.amenities.slice(0, 4).map((am, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {am}
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="text-[11px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                            +{room.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-500 font-medium">₹</span>
                          <span className="text-xl font-bold text-slate-900 font-serif">
                            {room.basePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500">/ night</span>
                        </div>
                        <p className="text-[10px] text-slate-400">+ 18% GST (CGST 9% + SGST 9%)</p>
                      </div>

                      <button
                        onClick={() => onSelectRoom(room)}
                        disabled={!isAvail}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                          isAvail
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Reserve Suite</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>HotelPro India Hospitality Network · 24x7 Guest Support: 1800-209-4683</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
