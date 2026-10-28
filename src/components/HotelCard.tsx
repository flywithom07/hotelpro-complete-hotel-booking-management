/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Hotel } from '../types/hotel.ts';
import { Star, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect }) => {
  const fallbackImage = '/src/assets/images/udaipur_lake_palace_resort_1793110692210.jpg';
  const coverImage = hotel.images && hotel.images.length > 0 ? hotel.images[0] : fallbackImage;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* High-Fidelity Photograph Slot */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={hotel.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Location & Star Marker overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{hotel.city}, {hotel.state} (India)</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-amber-400 font-semibold font-mono text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{hotel.reviewAverage.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({hotel.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Hotel Content & Pricing Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>5-Star Luxury</span>
            <span aria-hidden="true">·</span>
            <span>{hotel.policies.checkInTime} Check-in</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">Instant Guarantee</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug group-hover:text-amber-800 transition-colors">
            {hotel.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {hotel.description}
          </p>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Module */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-medium">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                ₹{(hotel.startingPrice || 16500).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect(hotel)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs group-hover:bg-amber-600 group-hover:text-white cursor-pointer"
          >
            <span>Explore Suites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
