import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, Phone, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { normalizeIndianPhone } from '../utils/bookingEngine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onRegister: (data: { name: string; email: string; password: string; phone: string; role?: string }) => Promise<void>;
  onQuickSwitchRole: (role: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onQuickSwitchRole,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        const normalizedPhone = normalizeIndianPhone(phone);
        if (!normalizedPhone) {
          throw new Error('Please enter a valid 10-digit Indian phone number prefixed with +91 (e.g. +91 98765 43210).');
        }
        await onRegister({ name, email, password, phone: normalizedPhone, role: 'guest' });
      } else {
        await onLogin({ email, password });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await onQuickSwitchRole(role);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to switch role.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-amber-950 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                HotelPro India
              </span>
              <span className="text-xs text-slate-300">Secure JWT Authentication</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mt-1">
              {isRegister ? 'Create Guest Account' : 'Sign in to HotelPro India'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Demo Personas */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" /> 1-Click Demo Login (Indian Personas)
              </p>
              <span className="text-[10px] text-amber-800 font-medium">Instant Test</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('guest')}
                className="p-2 bg-white hover:bg-amber-100/70 border border-amber-200 rounded-xl text-left transition"
              >
                <p className="text-xs font-bold text-slate-900">Aarav Sharma</p>
                <p className="text-[10px] text-slate-500">Guest · +91 98765 43210</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('staff')}
                className="p-2 bg-white hover:bg-amber-100/70 border border-amber-200 rounded-xl text-left transition"
              >
                <p className="text-xs font-bold text-slate-900">Priya Patel</p>
                <p className="text-[10px] text-slate-500">Staff · +91 98765 43212</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('manager')}
                className="p-2 bg-white hover:bg-amber-100/70 border border-amber-200 rounded-xl text-left transition"
              >
                <p className="text-xs font-bold text-slate-900">Vikramaditya Rao</p>
                <p className="text-[10px] text-slate-500">Manager · +91 98765 43211</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 bg-white hover:bg-amber-100/70 border border-amber-200 rounded-xl text-left transition"
              >
                <p className="text-xs font-bold text-slate-900">Rajesh Verma</p>
                <p className="text-[10px] text-slate-500">Super Admin · +91 98765 43213</p>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">Or enter credentials</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Legal Name (As on Photo ID)</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Number (+91 Indian Code)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold text-xs transition shadow-md cursor-pointer"
            >
              {isLoading ? 'Verifying...' : isRegister ? 'Register Indian Guest Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs text-amber-800 hover:text-amber-950 font-medium transition"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register as Guest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
