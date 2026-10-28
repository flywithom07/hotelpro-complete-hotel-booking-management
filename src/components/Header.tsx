/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from '../types/hotel.ts';
import { UserRole } from '../utils/bookingEngine.ts';
import { LogOut, Hotel as HotelIcon, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  currentRole: UserRole;
  activeTab: 'catalog' | 'guest' | 'staff' | 'manager' | 'admin';
  onSelectTab: (tab: 'catalog' | 'guest' | 'staff' | 'manager' | 'admin') => void;
  onQuickSwitchRole: (role: UserRole) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  storageMode: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  activeTab,
  onSelectTab,
  onQuickSwitchRole,
  onOpenAuth,
  onLogout,
  storageMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm no-print">
      {/* Role Demonstration & Platform Status Strip */}
      <div className="bg-slate-950 px-4 sm:px-8 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            HotelPro India · INR (₹)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono text-[11px] truncate max-w-xs sm:max-w-md">
            Backend: {storageMode}
          </span>
        </div>

        {/* Quick Demo Role Switcher with Indian Personas */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 mr-1 hidden sm:inline">Role Switch:</span>
          {(['guest', 'staff', 'manager', 'superadmin'] as UserRole[]).map((r) => {
            const isActive = currentRole === r;
            const labels: Record<UserRole, string> = {
              guest: 'Guest (Aarav)',
              staff: 'Staff (Priya)',
              manager: 'Manager (Vikram)',
              superadmin: 'Super Admin (Rajesh)',
              admin: 'Admin (Rajesh)'
            };
            return (
              <button
                key={r}
                type="button"
                onClick={() => onQuickSwitchRole(r)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Top Bar adhering to 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('catalog')}
          className="flex items-center gap-2 text-left cursor-pointer group whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <HotelIcon className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-serif group-hover:text-amber-300 transition-colors">
              HotelPro
            </span>
            <span className="text-[10px] tracking-widest uppercase text-amber-400/90 font-mono block -mt-1 font-semibold">
              India Hospitality
            </span>
          </div>
        </button>

        {/* Zone 2: Single-Line Text Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={() => onSelectTab('catalog')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
              activeTab === 'catalog' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Explore Sanctuaries
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('guest')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
              activeTab === 'guest' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Guest Stays
          </button>

          {(currentRole === 'staff' || currentRole === 'manager' || currentRole === 'superadmin') && (
            <button
              type="button"
              onClick={() => onSelectTab('staff')}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                activeTab === 'staff' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Operations & Turnovers
            </button>
          )}

          {(currentRole === 'manager' || currentRole === 'superadmin') && (
            <button
              type="button"
              onClick={() => onSelectTab('manager')}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                activeTab === 'manager' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Manager Console
            </button>
          )}

          {currentRole === 'superadmin' && (
            <button
              type="button"
              onClick={() => onSelectTab('admin')}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                activeTab === 'admin' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Super Admin
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action / Account Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[11px] text-amber-400 font-mono capitalize">{currentUser.role}</div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
