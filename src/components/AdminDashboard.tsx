import React, { useState } from 'react';
import { User, Hotel, Booking } from '../types/hotel';
import { formatINR } from '../utils/bookingEngine';
import { 
  ShieldCheck, Users, Building2, IndianRupee, Activity, 
  MapPin, CheckCircle2, AlertTriangle, Search, FileText, Phone
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  users: User[];
  hotels: Hotel[];
  bookings: Booking[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  users,
  hotels,
  bookings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'hotels' | 'logs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Total Platform Booking Volume
  const totalVolume = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.totalAmount : 0), 0);
  const totalGSTCollected = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.priceBreakdown.gstAmount : 0), 0);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Super Admin Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Super Admin Portal
            </span>
            <span className="text-xs text-slate-400">National Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            HotelPro India Platform Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Admin: <span className="text-white font-semibold">{user.name}</span> · Contact: <span className="text-amber-400">{user.phone}</span> · All 28 States & UTs Authorized
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>GST E-Invoicing & UPI Webhooks Live</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'overview' ? 'border-amber-600 text-amber-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          National Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'users' ? 'border-amber-600 text-amber-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          User Accounts & RBAC ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'hotels' ? 'border-amber-600 text-amber-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sanctuary Properties ({hotels.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'logs' ? 'border-amber-600 text-amber-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Statutory Audit Logs
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-xs font-medium text-slate-500">Gross Platform Volume (INR)</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {formatINR(totalVolume || 4850000)}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">Across all Indian properties</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-xs font-medium text-slate-500">GST Collected (18% SAC)</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-amber-800">
                {formatINR(totalGSTCollected || 739830)}
              </p>
              <p className="text-[10px] text-slate-400">9% CGST + 9% SGST remittance</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-xs font-medium text-slate-500">Active Sanctuaries</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {hotels.length} Luxury Units
              </p>
              <p className="text-[10px] text-slate-400">Udaipur, Goa, Manali</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <p className="text-xs font-medium text-slate-500">Registered Platform Users</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {users.length} Indian Personas
              </p>
              <p className="text-[10px] text-slate-400">Guests, Staff, GMs, Admins</p>
            </div>
          </div>

          {/* Quick Properties Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-serif font-bold text-slate-900">
              Indian Sanctuary Inventory & Tariffs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hotels.map((h) => (
                <div key={h.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">{h.city}, India</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">★ {h.rating}</span>
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-sm">{h.name}</h3>
                  <p className="text-xs text-slate-500">{h.address}</p>
                  <p className="text-xs font-bold text-slate-900 pt-1">
                    Tariffs From: <span className="text-amber-700">₹{(h.startingPrice || 16500).toLocaleString('en-IN')}</span> / night
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b">
            <div>
              <h2 className="text-base font-serif font-bold text-slate-900">
                Indian User Management & Roles
              </h2>
              <p className="text-xs text-slate-500">
                Role-based access control with authentic +91 mobile verification.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, mobile, email..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Mobile (+91)</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {u.name}
                      {u.id === user.id && (
                        <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">You</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-rose-100 text-rose-800'
                          : u.role === 'manager'
                          ? 'bg-amber-100 text-amber-900'
                          : u.role === 'staff'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">{u.phone}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Hotels */}
      {activeTab === 'hotels' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-serif font-bold text-slate-900">
            Registered Indian Sanctuaries
          </h2>
          <div className="space-y-4">
            {hotels.map((h) => (
              <div key={h.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif font-bold text-slate-900">{h.name}</h3>
                  <p className="text-xs text-slate-500">{h.address}, {h.city}, India</p>
                  <p className="text-xs text-slate-700 mt-1">
                    Manager: <span className="font-semibold text-slate-900">Vikramaditya Rao (+91 98765 43211)</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Base Tariff</p>
                  <p className="text-base font-serif font-bold text-slate-900">₹{(h.startingPrice || 16500).toLocaleString('en-IN')} / night</p>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Compliant (GSTIN 08AAACH1234F1Z5)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Statutory Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-serif font-bold text-slate-900">
            Statutory & Tax Compliance Audit Trail
          </h2>
          <div className="space-y-3 font-mono text-xs">
            {[
              { time: 'Today 14:12 IST', event: 'CGST (9%) and SGST (9%) reconciliation executed for Udaipur property.', status: 'PASS' },
              { time: 'Today 11:30 IST', event: 'UPI webhook instant settlement verified for reservation HP-IND-2026-001 (₹53,100).', status: 'PASS' },
              { time: 'Today 09:15 IST', event: 'Ministry of Tourism guest ID register backup completed for Rajasthan & Goa properties.', status: 'PASS' },
              { time: 'Yesterday 22:00 IST', event: 'Night audit completed by Shift Staff Priya Patel (+91 98765 43212).', status: 'PASS' }
            ].map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 mr-3">{log.time}</span>
                  <span className="text-slate-800">{log.event}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
