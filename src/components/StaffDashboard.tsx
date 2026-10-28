/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Booking, HousekeepingTask, ServiceRequest, Room } from '../types/hotel.ts';
import { api } from '../services/api.ts';
import {
  LogIn,
  LogOut,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Brush,
  BellRing,
  BedDouble,
  UserCheck
} from 'lucide-react';

interface StaffDashboardProps {
  hotelId?: string;
  user?: any;
  hotel?: any;
  bookings?: any[];
  onUpdateBookingStatus?: (bookingId: string, status: any) => Promise<void>;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ hotelId = 'hotel-1' }) => {
  const [activeTab, setActiveTab] = useState<'frontdesk' | 'housekeeping' | 'services' | 'rooms'>('frontdesk');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  useEffect(() => {
    loadStaffData();
  }, [hotelId]);

  const loadStaffData = async () => {
    setLoading(true);
    try {
      const [bkgRes, hkRes, srvRes, roomRes] = await Promise.all([
        api.getHotelBookings(hotelId),
        api.getHousekeepingTasks(hotelId),
        api.getServiceRequests(hotelId),
        api.getRoomsByHotel(hotelId)
      ]);
      setBookings(bkgRes.bookings);
      setHousekeepingTasks(hkRes.tasks);
      setServiceRequests(srvRes.requests);
      setRooms(roomRes.rooms);
    } catch (err: any) {
      console.error('Failed to load staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check-In Guest Handler
  const handleCheckIn = async (bookingId: string) => {
    try {
      const res = await api.checkIn(bookingId);
      setActionAlert(res.message);
      loadStaffData();
    } catch (err: any) {
      alert(err.message || 'Check-in failed');
    }
  };

  // Check-Out Guest Handler
  const handleCheckOut = async (bookingId: string) => {
    try {
      const res = await api.checkOut(bookingId);
      setActionAlert(res.message);
      loadStaffData();
    } catch (err: any) {
      alert(err.message || 'Check-out failed');
    }
  };

  // Housekeeping Status Transition Handler
  const handleUpdateHousekeepingStatus = async (taskId: string, nextStatus: HousekeepingTask['status']) => {
    try {
      const res = await api.updateHousekeepingStatus(taskId, nextStatus);
      setActionAlert(res.message);
      loadStaffData();
    } catch (err: any) {
      alert(err.message || 'Failed to update task');
    }
  };

  // Room Status Update Handler
  const handleUpdateRoomStatus = async (roomId: string, status: Room['operationalStatus']) => {
    try {
      const res = await api.updateRoomStatus(roomId, status);
      setActionAlert(`Room operational status changed to ${status}`);
      loadStaffData();
    } catch (err: any) {
      alert(err.message || 'Failed to update room status');
    }
  };

  // Service Request Status Handler
  const handleUpdateServiceStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      const res = await api.updateServiceRequestStatus(id, status);
      setActionAlert(res.message);
      loadStaffData();
    } catch (err: any) {
      alert(err.message || 'Failed to update service status');
    }
  };

  const arrivals = bookings.filter((b) => b.bookingStatus === 'confirmed');
  const inHouse = bookings.filter((b) => b.bookingStatus === 'checked_in');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono text-amber-700 font-semibold tracking-wider uppercase">Operations Console</span>
          <h2 className="text-2xl font-bold font-serif text-slate-900">Hotel Staff & Housekeeping Desk</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The Grand Azure Resort (Malibu) · Front Desk Arrivals, Departures & Turnovers
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('frontdesk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'frontdesk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Arrivals & Departures ({arrivals.length + inHouse.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('housekeeping')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'housekeeping' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Housekeeping Tasks ({housekeepingTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rooms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'rooms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Room Statuses ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'services' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Guest Requests ({serviceRequests.length})
          </button>
        </div>
      </div>

      {actionAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionAlert}
          </span>
          <button type="button" onClick={() => setActionAlert(null)} className="text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Synchronizing operations queue...</div>
      ) : activeTab === 'frontdesk' ? (
        /* Front Desk: Arrivals & Departures */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Arrivals Queue */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold font-serif text-slate-900">Today's Expected Arrivals</h3>
              </div>
              <span className="text-xs font-mono font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                {arrivals.length} Queued
              </span>
            </div>

            {arrivals.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No pending arrivals in queue.</p>
            ) : (
              <div className="space-y-3">
                {arrivals.map((bkg) => (
                  <div key={bkg.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{bkg.guestName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{bkg.bookingReference} · {bkg.guestPhone}</div>
                      </div>
                      <span className="font-mono text-slate-700 font-semibold bg-white px-2 py-1 rounded border border-slate-200">
                        Room #{bkg.roomNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500">{bkg.roomCategory} ({bkg.nights} nights)</span>
                      <button
                        type="button"
                        onClick={() => handleCheckIn(bkg.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Check-In Guest</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Currently In-House / Departures */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold font-serif text-slate-900">In-House Stays & Departures</h3>
              </div>
              <span className="text-xs font-mono font-semibold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded">
                {inHouse.length} In-House
              </span>
            </div>

            {inHouse.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No guests currently checked in.</p>
            ) : (
              <div className="space-y-3">
                {inHouse.map((bkg) => (
                  <div key={bkg.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{bkg.guestName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          Checked In: {bkg.checkInTimestamp ? new Date(bkg.checkInTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Standard'}
                        </div>
                      </div>
                      <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        Room #{bkg.roomNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500">Departure: {bkg.checkOut} (11:00 AM)</span>
                      <button
                        type="button"
                        onClick={() => handleCheckOut(bkg.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-amber-400" />
                        <span>Process Check-Out</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'housekeeping' ? (
        /* Housekeeping Kanban Board */
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-slate-900">Housekeeping Turnover Queue</h3>
            <span className="text-xs text-slate-500">Auto-triggered upon front desk check-outs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['Dirty', 'Cleaning', 'Inspected', 'Ready'] as HousekeepingTask['status'][]).map((colStatus) => {
              const tasksInCol = housekeepingTasks.filter((t) => t.status === colStatus);
              return (
                <div key={colStatus} className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                    <span>{colStatus}</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded shadow-xs">{tasksInCol.length}</span>
                  </div>

                  <div className="space-y-2">
                    {tasksInCol.map((task) => (
                      <div key={task.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs text-xs space-y-2">
                        <div className="flex items-center justify-between font-bold">
                          <span className="font-mono text-slate-900">Room #{task.roomNumber}</span>
                          <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${task.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-tight">{task.notes}</p>
                        <div className="text-[10px] text-slate-400 font-mono">Assigned: {task.assignedStaffName}</div>

                        {/* Status Transition Button */}
                        <div className="pt-2 border-t border-slate-100">
                          {colStatus === 'Dirty' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateHousekeepingStatus(task.id, 'Cleaning')}
                              className="w-full py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded text-[11px] cursor-pointer"
                            >
                              Start Cleaning
                            </button>
                          )}
                          {colStatus === 'Cleaning' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateHousekeepingStatus(task.id, 'Inspected')}
                              className="w-full py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-[11px] cursor-pointer"
                            >
                              Mark Inspected
                            </button>
                          )}
                          {colStatus === 'Inspected' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateHousekeepingStatus(task.id, 'Ready')}
                              className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] cursor-pointer"
                            >
                              Mark Ready & Available
                            </button>
                          )}
                          {colStatus === 'Ready' && (
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 justify-center">
                              <CheckCircle2 className="w-3 h-3" />
                              Ready for Check-In
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'rooms' ? (
        /* Room Status Matrix */
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-slate-900">Room Operational Status Matrix</h3>
            <span className="text-xs text-slate-500">Live operational status across all property keys</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-base font-bold font-mono text-slate-900">Room #{room.roomNumber}</span>
                    <div className="text-[11px] text-slate-500">{room.category}</div>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      room.operationalStatus === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : room.operationalStatus === 'Occupied'
                        ? 'bg-indigo-100 text-indigo-800'
                        : room.operationalStatus === 'Cleaning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {room.operationalStatus}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Override Status:</label>
                  <select
                    value={room.operationalStatus}
                    onChange={(e) => handleUpdateRoomStatus(room.id, e.target.value as Room['operationalStatus'])}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Guest Service Requests */
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-slate-900">Guest In-Room Service Requests</h3>
            <span className="text-xs text-slate-500">{serviceRequests.length} recorded items</span>
          </div>

          <div className="space-y-3">
            {serviceRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">Room #{req.roomNumber}</span>
                    <span className="font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                      {req.category}
                    </span>
                    <span className="text-slate-500">· Guest: {req.guestName}</span>
                  </div>
                  <p className="text-slate-700">{req.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={req.status}
                    onChange={(e) => handleUpdateServiceStatus(req.id, e.target.value as ServiceRequest['status'])}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
