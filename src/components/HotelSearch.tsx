/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Calendar, Users, MapPin, SlidersHorizontal } from 'lucide-react';

interface HotelSearchProps {
  destination: string;
  setDestination: (val: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  guests: number;
  setGuests: (val: number) => void;
  selectedAmenity: string;
  setSelectedAmenity: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onSearch: () => void;
}

export const HotelSearch: React.FC<HotelSearchProps> = ({
  destination,
  setDestination,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  selectedAmenity,
  setSelectedAmenity,
  sortBy,
  setSortBy,
  onSearch
}) => {
  const amenitiesList = [
    'All Amenities',
    'Lake Pichola Views',
    'Private Beach Access',
    'Ayurvedic Jiva Spa',
    'Royal Jharokha Balcony',
    'Snow Peak Panoramas',
    'Private Shikara Boat'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-6 -mt-12 relative z-20">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Destination */}
        <div className="flex flex-col">
          <label htmlFor="destination-input" className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            Indian Destination or Palace
          </label>
          <input
            id="destination-input"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Udaipur, Goa, Manali, Jaipur..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Check In */}
        <div className="flex flex-col">
          <label htmlFor="checkin-date" className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Check-In
          </label>
          <input
            id="checkin-date"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium text-slate-800"
          />
        </div>

        {/* Check Out */}
        <div className="flex flex-col">
          <label htmlFor="checkout-date" className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Check-Out
          </label>
          <input
            id="checkout-date"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium text-slate-800"
          />
        </div>

        {/* Guests & Search Button */}
        <div className="flex items-end gap-2.5">
          <div className="flex-1 flex flex-col">
            <label htmlFor="guests-count" className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Guests
            </label>
            <select
              id="guests-count"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium text-slate-800 bg-white"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={6}>5+ Guests (Palace Villas)</option>
            </select>
          </div>

          <button
            type="submit"
            className="h-[42px] px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Filter Chips & Sort Controls */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter:
          </span>
          {amenitiesList.map((amenity) => {
            const isSelected = (amenity === 'All Amenities' && !selectedAmenity) || selectedAmenity === amenity;
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => setSelectedAmenity(amenity === 'All Amenities' ? '' : amenity)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <label htmlFor="sort-dropdown" className="text-slate-500 text-xs font-medium">Sort by:</label>
          <select
            id="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="recommended">Featured Heritage First</option>
            <option value="rating">Highest Star & Review</option>
            <option value="reviews">Most Reviewed</option>
          </select>
        </div>
      </div>
    </div>
  );
};
