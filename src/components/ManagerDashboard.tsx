import React, { useState } from 'react';
import { Hotel, RoomCategory, Booking, User } from '../types/hotel';
import { formatINR } from '../utils/bookingEngine';
import { 
  Building2, Users, IndianRupee, TrendingUp, Calendar, 
  Settings, CheckCircle2, ShieldCheck, Plus, Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, BarChart, Bar 
} from 'recharts';

interface ManagerDashboardProps {
  user: User;
  hotel: Hotel;
  bookings: Booking[];
  onUpdateRoomPrice?: (roomId: string, newPrice: number) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  user,
  hotel,
  bookings,
  onUpdateRoomPrice,
}) => {
  const [seasonalMultiplier, setSeasonalMultiplier] = useState(hotel.seasonalMultiplier || 1.15);
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>(hotel.roomCategories || []);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Financial Calculations in INR
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.totalAmount : 0), 0);
  const confirmedBookings = bookings.filter((b) => b.status !== 'cancelled');
  const totalNights = confirmedBookings.reduce((sum, b) => sum + b.priceBreakdown.numberOfNights, 0);
  const adr = totalNights > 0 ? Math.round(totalRevenue / totalNights) : 28500;
  const totalRooms = roomCategories.reduce((sum, r) => sum + (r.availableCount || 0) + 3, 0); // available + occupied
  const occupancyRate = Math.min(94, Math.round((confirmedBookings.length / Math.max(1, totalRooms)) * 100) || 78);
  const revPar = Math.round((adr * occupancyRate) / 100);

  // 7-day revenue trend data in INR
  const revenueTrendData = [
    { day: 'Mon', revenue: 145000, bookings: 3 },
    { day: 'Tue', revenue: 198000, bookings: 4 },
    { day: 'Wed', revenue: 230000, bookings: 5 },
    { day: 'Thu', revenue: 310000, bookings: 6 },
    { day: 'Fri', revenue: 480000, bookings: 9 },
    { day: 'Sat', revenue: 620000, bookings: 12 },
    { day: 'Sun', revenue: 540000, bookings: 10 },
  ];

  const handleStartEdit = (room: RoomCategory) => {
    setEditingRoomId(room.id);
    setEditingPrice(room.basePrice);
  };

  const handleSavePrice = (roomId: string) => {
    setRoomCategories((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, basePrice: Number(editingPrice) } : r))
    );
    if (onUpdateRoomPrice) {
      onUpdateRoomPrice(roomId, Number(editingPrice));
    }
    setSaveSuccessMsg('Suite tariff updated successfully in INR.');
    setEditingRoomId(null);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              General Manager Operations
            </span>
            <span className="text-xs text-slate-300">GM: {user.name} ({user.phone})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            {hotel.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            {hotel.city}, India · GSTIN: <span className="font-mono text-amber-300">08AAACH1234F1Z5</span> · SAC: 996311
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-300">
            Current Season: <span className="text-white font-bold">Royal Winter & Heritage Tour</span> ({seasonalMultiplier}x)
          </span>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* KPI Cards in INR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-medium text-slate-500">Total Hotel Revenue</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {formatINR(totalRevenue || 2523000)}
          </p>
          <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last cycle (INR)
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-medium text-slate-500">Average Daily Rate (ADR)</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {formatINR(adr)}
          </p>
          <p className="text-[10px] text-slate-400">Per room per night in INR</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-medium text-slate-500">Sanctuary Occupancy</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {occupancyRate}%
          </p>
          <p className="text-[10px] text-emerald-600 font-medium">Above regional benchmark</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-medium text-slate-500">Revenue Per Room (RevPAR)</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            {formatINR(revPar)}
          </p>
          <p className="text-[10px] text-slate-400">Net yield calculation</p>
        </div>
      </div>

      {/* Revenue & Occupancy Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <div>
              <h2 className="text-base font-serif font-bold text-slate-900">
                Revenue Trajectory (INR ₹)
              </h2>
              <p className="text-xs text-slate-500">Weekly intake across UPI, Cards, and Net Banking</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Indian Fiscal 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis 
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Stays Bar Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-2 border-b">
            <h2 className="text-base font-serif font-bold text-slate-900">
              Daily Guest Stays
            </h2>
            <p className="text-xs text-slate-500">Suites occupied per day</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip 
                  formatter={(val: any) => [val, 'Suites Occupied']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="bookings" fill="#b45309" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Room Category Tariff Management */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b">
          <div>
            <h2 className="text-base font-serif font-bold text-slate-900">
              Suite Tariffs & Inventory Control (INR ₹)
            </h2>
            <p className="text-xs text-slate-500">
              Update room pricing in Indian Rupees. Seasonal multiplier automatically calculates guest checkouts.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            GST 18% automatically added to guest billing
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Suite Category</th>
                <th className="py-3 px-4">Max Capacity</th>
                <th className="py-3 px-4">Available Units</th>
                <th className="py-3 px-4">Base Tariff (INR ₹)</th>
                <th className="py-3 px-4 text-right">Tariff Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roomCategories.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">{room.name}</p>
                    <p className="text-slate-500 text-[11px]">{room.bedType}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {room.maxGuests} Guests
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {room.availableCount} Ready
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {editingRoomId === room.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          value={editingPrice}
                          onChange={(e) => setEditingPrice(Number(e.target.value))}
                          className="w-28 text-xs p-1.5 border border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{room.basePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400"> / night</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {editingRoomId === room.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSavePrice(room.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                        >
                          Save INR
                        </button>
                        <button
                          onClick={() => setEditingRoomId(null)}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(room)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-medium transition"
                      >
                        Adjust Tariff
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
